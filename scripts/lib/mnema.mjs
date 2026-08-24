/**
 * Minimal MCP client for Mnema's Streamable HTTP endpoint.
 *
 * The server runs the SDK transport with `enableJsonResponse: true` and
 * `sessionIdGenerator: undefined` — stateless JSON-RPC over a single POST.
 * A `mnema_api_*` key is accepted directly as the Bearer token.
 *
 * Two shapes come back depending on the Accept negotiation, so parse both:
 * a bare JSON body, or an SSE frame whose `data:` line holds the JSON-RPC.
 */

const ENDPOINT = process.env.MNEMA_MCP_URL ?? 'https://api.theboringpeople.in/mcp';
const KEY = process.env.MNEMA_API_KEY;
const PROTOCOL_VERSION = '2025-06-18';

export class MnemaError extends Error {
  constructor(reason, detail) {
    super(`mnema:${reason}${detail ? ` — ${detail}` : ''}`);
    this.reason = reason;
  }
}

function parseBody(text, contentType) {
  if (contentType.includes('text/event-stream')) {
    const line = text.split('\n').find((l) => l.startsWith('data:'));
    if (!line) throw new MnemaError('sse_no_data_frame', text.slice(0, 200));
    return JSON.parse(line.slice(5).trim());
  }
  return JSON.parse(text);
}

let rpcId = 0;

async function rpc(method, params) {
  if (!KEY) throw new MnemaError('no_api_key', 'MNEMA_API_KEY is unset');

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${KEY}`,
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      'mcp-protocol-version': PROTOCOL_VERSION,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
    signal: AbortSignal.timeout(45_000),
  });

  const text = await res.text();

  if (res.status === 401) throw new MnemaError('unauthorized', 'key invalid, revoked, or act-as');
  if (res.status === 402) throw new MnemaError('subscription_gate', text.slice(0, 200));
  if (res.status === 403) throw new MnemaError('forbidden', text.slice(0, 200));
  if (!res.ok) throw new MnemaError(`http_${res.status}`, text.slice(0, 200));

  const body = parseBody(text, res.headers.get('content-type') ?? '');
  if (body.error) throw new MnemaError('rpc_error', `${body.error.code} ${body.error.message}`);
  return body.result;
}

/**
 * The SDK requires an `initialize` before tool calls even in stateless mode on
 * some versions and does not on others. Try the call; if the server complains
 * about initialization, handshake once and retry. Never swallow anything else.
 */
let handshook = false;

async function ensureHandshake() {
  if (handshook) return;
  await rpc('initialize', {
    protocolVersion: PROTOCOL_VERSION,
    capabilities: {},
    clientInfo: { name: 'nbk-profile-readme', version: '1.0.0' },
  });
  handshook = true;
}

export async function callTool(name, args = {}) {
  const invoke = () => rpc('tools/call', { name, arguments: args });

  let result;
  try {
    result = await invoke();
  } catch (err) {
    const needsInit = err instanceof MnemaError
      && err.reason === 'rpc_error'
      && /not initialized|initializ/i.test(err.message);
    if (!needsInit) throw err;
    await ensureHandshake();
    result = await invoke();
  }

  if (result?.isError) {
    const detail = result.content?.map((c) => c.text).join(' ').slice(0, 300);
    throw new MnemaError('tool_error', `${name}: ${detail}`);
  }

  // Always carry the prose block alongside the structured payload as `_text`.
  //
  // This used to return one or the other. When a server emitted
  // structuredContent that was missing the fields a formatter wanted, the
  // prose — which usually says the right thing in a sentence — had already
  // been thrown away, so the fallback was unreachable and the formatter
  // printed undefined. Keep both and let the caller decide.
  const text = result?.content?.find((c) => c.type === 'text')?.text;

  if (result?.structuredContent) {
    return text === undefined
      ? result.structuredContent
      : { ...result.structuredContent, _text: text };
  }

  if (text === undefined) throw new MnemaError('empty_tool_result', name);

  try {
    const parsed = JSON.parse(text);
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
      ? { ...parsed, _text: text }
      : { value: parsed, _text: text };
  } catch {
    return { _text: text, text };
  }
}

export function keyConfigured() {
  return Boolean(KEY);
}
