# Bug Sheet Checklist - Application Pages

## Practice Module Analytics

### Subject Involvement Graph(Backend - Subha and Shayaan )
- [ ] **Bug Description:** Subject Involvement graph seems fixed
- [ ] **Recommendation:** Make the graph dynamic and responsive to actual user subject interaction data

### Question Analysis Graph - Average Seconds per Question(Subha and Shayaan)
- [ ] **Bug Description:** Question Analysis graph the Avg.Second per Question is fixed at zero always doesnt make sense
- [ ] **Recommendation:** Implement proper time tracking functionality to capture actual time spent per question and display accurate average values

### Accuracy Calculation System(Subha and Shayaan)
- [ ] **Bug Description:** Accuracy is fixed the formulas are:
  - total questions: 10 Hard 10 Med 10 Easy 
  - Total accuracy is assuming 25 correct answers 
  - (25/30) * 100 
  - Lets say 8 Hard correct 8 Medium correct 7 easy correct
  - Hard question accuracy: (8/10)*100 
  - Medium question accuracy: (8/10)*100
  - Easy question accuracy: (7/10)*100
- [ ] **Recommendation:** Fix accuracy calculation to properly reflect actual performance per difficulty level and overall performance based on real user responses

### Confidence Rating System(Subha and Shayaan)
- [ ] **Bug Description:** Confidence should not be fixed a button must appear on scale 1-9 1 being least confident 9 bwing highly confident
- [ ] **Recommendation:** Implement interactive confidence rating system with the following scale:
  - Confidence Level 1: Numerical Value 1, Percentage Range 10-30% (Low)
  - Confidence Level 2: Numerical Value 2, Percentage Range 30-40% (Low)
  - Confidence Level 3: Numerical Value 3, Percentage Range 40-50% (Low)
  - Confidence Level 4: Numerical Value 4, Percentage Range 60-65% (Medium)
  - Confidence Level 5: Numerical Value 5, Percentage Range 70-75% (Medium)
  - Confidence Level 6: Numerical Value 6, Percentage Range 75-80% (Medium)
  - Confidence Level 7: Numerical Value 7, Percentage Range 85-88% (High)
  - Confidence Level 8: Numerical Value 8, Percentage Range 90-92% (High)
  - Confidence Level 9: Numerical Value 9, Percentage Range 95%+ (High)

### Confidence Accuracy Calculation(Subha and Shayaan)
- [ ] **Bug Description:** System needs to calculate confidence-based accuracy properly
- [ ] **Recommendation:** Implement proper confidence accuracy calculation:
  - Questions answered with high confidence: 15 Correct among high confidence: 12 High Confidence Accuracy = (12/15) × 100% = 80%
  - Questions answered with medium confidence: 7 Correct among medium confidence: 5 Medium Confidence Accuracy = (5/7) × 100% = 71.4%
  - Questions answered with low confidence: 3 Correct among low confidence: 2 Low Confidence Accuracy = (2/3) × 100% = 66.7%

### Average Confidence Calculation(Subha and Shayaan)
- [ ] **Bug Description:** Average confidence calculation not working properly
- [ ] **Recommendation:** Fix average confidence calculation system:
  - Confidence ratings: [8, 7, 9, 6, 8, 7, 5, 8, 9, 6, 7, 8, 4, 7, 8, 6, 7, 8, 5, 9, 7, 6, 8, 7, 7]
  - Sum = 8+7+9+6+8+7+5+8+9+6+7+8+4+7+8+6+7+8+5+9+7+6+8+7+7 = 177 Number of questions = 25
  - Average Confidence = 177/25 = 7.08 Converted to percentage = 7.08 → ~85% confidence(use the confidence chart for percentage allotment)

### Calibration Gap Analysis(Subha and Shayaan)
- [ ] **Bug Description:** Calibration gap calculation not implemented
- [ ] **Recommendation:** Implement calibration gap analysis:
  - Calibration Gap = Average Confidence - Accuracy
  - Average Confidence: 85% Accuracy: 76% Calibration Gap = 85% - 76% = +9%
  - Interpretation: Slightly overconfident (confidence exceeds actual performance)
  - Perfect Calibration: Gap = ±5% Underconfident: Gap < -10% Overconfident: Gap > +10% Well-calibrated: Gap = ±5% to ±10%

### Weak Topics Identification(Subha and Shayaan)
- [ ] **Bug Description:** Identified weak topics not working false data populating
- [ ] **Recommendation:** Fix weak topics identification algorithm to analyze actual performance data and provide accurate topic-based insights instead of false data population

---

## PM Test Page

### PM Home Page

#### Font Styling(vanathi)
- [ ] **Bug Description:** Complete font change
- [ ] **Recommendation:** Implement consistent font styling across the PM home page

#### Date Filter Functionality(shayaan and Vanathi)
- [ ] **Bug Description:** Date filter not working
- [ ] **Recommendation:** Fix date filter functionality to properly filter tests by selected date ranges

#### Test Actions
- [ ] **Bug Description:** Retake mistakes notworking Resume test not working
- [ ] **Recommendation:** Fix both retake mistakes and resume test functionality to allow proper test continuation and mistake review

#### Last Attempt Analytics
- [ ] **Bug Description:** Last Attempt analytics doesnot make sense to have Time spent in it need to revisit
- [ ] **Recommendation:** Revisit Last Attempt analytics structure and remove or modify Time spent component to make it more meaningful

#### Recent Tests Filter
- [ ] **Bug Description:** The filter of ALL This Week and By Subject is not working under recent tests
- [ ] **Recommendation:** Fix ALL, This Week, and By Subject filters under recent tests section to properly display filtered results

#### Test Accessibility
- [ ] **Bug Description:** There must be some sort easy access feature for all the tests created and the big letters for showing them is just not easy accessible
- [ ] **Recommendation:** Implement better accessibility features for test navigation and reduce font size or improve layout for better usability

#### Test Type Distinction
- [ ] **Bug Description:** Practice test and simulated test are two different things In practice test we caluclate time there is no time limit In simulated test there is a time limit this is a key difference
- [ ] **Recommendation:** Clearly distinguish between practice test (no time limit, time calculation) and simulated test (with time limit) in UI and functionality

#### Default Exam Naming
- [ ] **Bug Description:** It would be better to have the default exam name as the book name and date and time
- [ ] **Recommendation:** Implement default exam naming convention using book name + date + time format

#### Topic Breakdown Issues
- [ ] **Bug Description:** The topic breakdown is repetative a lot of topics just repeat again and again
- [ ] **Recommendation:** Fix topic breakdown algorithm to eliminate repetitive topics and show unique topic distribution

#### Progress Bar UI
- [ ] **Bug Description:** The progress bar UI after creating a test is not right it gets cut make sure there is a silver silhouette and after each step is done it turns green
- [ ] **Recommendation:** Fix progress bar UI with proper silver silhouette and green completion indicators for each completed step

#### Processing Status Display
- [ ] **Bug Description:** The process is showing to status processing processing
- [ ] **Recommendation:** Fix processing status display to show proper status messages instead of duplicate "processing processing"

### Inside the Test

#### Help Button
- [ ] **Bug Description:** Help button not working
- [ ] **Recommendation:** Fix help button functionality to provide proper assistance within the test interface

#### Pause Button Icon
- [ ] **Bug Description:** Pause button stays pause even when paused it should change to resume im talking about the icon
- [ ] **Recommendation:** Implement dynamic pause/resume button icon that changes based on current state

#### Option Selection
- [ ] **Bug Description:** The options is only selecting when the checkbox is selected it should automatically be able to select the entire option row
- [ ] **Recommendation:** Make entire option row clickable for selection, not just the checkbox

#### Full Screen Mode
- [ ] **Bug Description:** Full screen mode te test is overlapping on the side menu
- [ ] **Recommendation:** Fix full screen mode layout to prevent test content from overlapping with side menu

#### Script Concordance Questions
- [ ] **Bug Description:** Script Concordance question even when answered is alwys considered skipped
- [ ] **Recommendation:** Fix Script Concordance question handling to properly register answers and prevent them from being marked as skipped

#### Question Review Access
- [ ] **Bug Description:** There is no palce to review all the questions and answers
- [ ] **Recommendation:** Implement a comprehensive question review interface showing all questions and their answers

#### Quick Navigation
- [ ] **Bug Description:** No place to quick access previous questions only one button suppose i put 2 question as review and im at the 30th i have to manually press previous 27 times thats not right
- [ ] **Recommendation:** Implement quick navigation feature allowing direct access to specific questions, especially those marked for review

#### Last Question Handling
- [ ] **Bug Description:** I think last questions answer is always skipped even when answered
- [ ] **Recommendation:** Fix last question answer registration to ensure it's properly saved and not marked as skipped

#### Question Count Accuracy
- [ ] **Bug Description:** The review attempted skipped and pending count is always wrong when i have only 5 questions and have answered all 5 its still shwoingtwo pending
- [ ] **Recommendation:** Fix question count algorithm to accurately track and display review, attempted, skipped, and pending question counts

---

## Home Page (Analytics Page)

### Study Progress Section
- [ ] **Bug Description:** Study progress text is too small and light
- [ ] **Recommendation:** Increase font size and improve contrast for study progress text visibility

- [ ] **Bug Description:** Study progress is not taking in new data when i added OBG book couldnt see the update on the home page
- [ ] **Recommendation:** Fix study progress data integration to automatically reflect new book additions and updates

### Work-Break Ratio and Consistency
- [ ] **Bug Description:** Work-Break ratio and COnsistency seems to be hardcoded
- [ ] **Recommendation:** Implement dynamic Work-Break ratio and Consistency calculations using real user data

- [ ] **Bug Description:** AI insight not working for the same
- [ ] **Recommendation:** Fix AI insight functionality for Work-Break ratio analysis using proper formulas:
  - Work-Break Ratio = (Total Study Time - Break Time) / Break Time Optimal ratio is 3:1 to 5:1
  - Example: Total Study Time: 40 hours/week, Break Time: 10 hours/week, Work-Break Ratio = 30/10 = 3 (optimal)
  - Consistency Score = (Days with study activity / Total days in period) × 100%
  - Example: Study activity on 24 days out of 30, Consistency Score = (24/30) × 100% = 80%

### Optimal Study Time Analysis
- [ ] **Bug Description:** Studyefficiency and Focus score dont seem to be right
- [ ] **Recommendation:** Fix efficiency and focus score calculations using proper algorithm:
  - Efficiency Score = (Retention Score) / (Hours Spent) × Normalization Factor
  - Example for Physiology: Retention Score: 90%, Hours Spent: 12.8, Normalization Factor: 1.2, Efficiency Score = (90/12.8) × 1.2 = 8.4 (very efficient)
  - Compare to Pathology: Retention Score: 65%, Hours Spent: 22.3, Efficiency Score = (65/22.3) × 1.2 = 3.5 (less efficient)

- [ ] **Bug Description:** Time optimisation insight seems hardcoded
- [ ] **Recommendation:** Implement dynamic time optimization insights based on actual user study patterns and performance data

### Knowledge Gap Analysis
- [ ] **Bug Description:** There are to many empty boxes just keep whats filled using data
- [ ] **Recommendation:** Remove empty boxes and display only data-populated knowledge gap analysis components

### Today's Focus
- [ ] **Bug Description:** Weak areas need to be in red and must be percentages
- [ ] **Recommendation:** Display weak areas in red color with percentage values

- [ ] **Bug Description:** Due for Review needs to in blue/yellow this is only about flashvcrads which are due
- [ ] **Recommendation:** Color code Due for Review section in blue/yellow specifically for flashcards that are due for review

- [ ] **Bug Description:** Recently Mastered: recent learnt topics
- [ ] **Recommendation:** Implement Recently Mastered section showing recently learned topics with proper data integration

### Body System Completion
- [ ] **Bug Description:** Body System Completition (Spelling): The text need to be bigger and the dropdown for scrolling seems odd fix it on the bottom right
- [ ] **Recommendation:** Fix spelling to "Completion", increase text size, and improve dropdown positioning/design on bottom right

- [ ] **Bug Description:** Connection Strength calculation needs implementation
- [ ] **Recommendation:** Implement Connection Strength calculation: Connection Strength = (0.8 × 0.4) + (0.7 × 0.3) + (0.75 × 0.3) = 0.32 + 0.21 + 0.225 = 0.755 (76%)

- [ ] **Bug Description:** Concept Mastery Distribution(Topic based) not working properly
- [ ] **Recommendation:** Implement proper Concept Mastery Distribution for each mastery level:
  - Count of concepts at each level / Total concepts × 100%
  - Example: 24 Mastered concepts (>80% mastery), 35 Strong concepts (60-80% mastery), 28 Developing concepts (40-60% mastery), 13 Weak concepts (<40% mastery), Total: 100 concepts
  - Distribution: Mastered: 24%, Strong: 35%, Developing: 28%, Weak: 13%

- [ ] **Bug Description:** You need to show the topics highest in each level
- [ ] **Recommendation:** Display highest-scoring topics for each mastery level (Mastered, Strong, Developing, Weak)

### Learning Progress Status
- [ ] **Bug Description:** Difficulty Score calculation needs validation
- [ ] **Recommendation:** Implement and validate Difficulty Score calculation:
  - Difficulty Score = (Average Number of Attempts) × 50% + (Percentage of "Again" Responses) × 30% + (Time Spent per Card) × 20%
  - Example for Heart Failure cards: Average Attempts: 3.8 out of max 5 = 76%, "Again" Responses: 65%, Average Time: 12 seconds out of typical 8 seconds = 150%
  - Difficulty Score = (0.76 × 0.5) + (0.65 × 0.3) + (1.5 × 0.2) = 0.38 + 0.195 + 0.3 = 0.85 (high difficulty)

### Exam Performance Analysis
- [ ] **Bug Description:** These numbers dont watch the one on the PM home page
- [ ] **Recommendation:** Synchronize exam performance numbers between Home page and PM home page to ensure data consistency

### Confidence vs Accuracy
- [ ] **Bug Description:** The formula has been shared with the PM bug sheet
- [ ] **Recommendation:** Implement proper confidence vs accuracy analysis using formulas from PM bug sheet

- [ ] **Bug Description:** The insight is not right
- [ ] **Recommendation:** Fix confidence vs accuracy insights to provide accurate analysis and recommendations

### Answer Change Pattern & Question Navigation
- [ ] **Bug Description:** Answer change Pattern: Use proper colour coding therer are two greens
- [ ] **Recommendation:** Fix color coding for Answer Change Pattern to use distinct colors instead of duplicate greens

- [ ] **Bug Description:** Same with Question Navigation Behavior
- [ ] **Recommendation:** Fix color coding for Question Navigation Behavior section to use proper distinct color scheme

### Weak Topics
- [ ] **Bug Description:** These are not identified properly anywhere
- [ ] **Recommendation:** Implement proper weak topics identification algorithm across all sections to accurately identify and display weak performance areas

### Topic Breakdown
- [ ] **Bug Description:** This entire section doesnt seem to working there are hardcoded which shouldnt be the case
- [ ] **Recommendation:** Replace hardcoded topic breakdown data with dynamic analysis based on actual user performance and study patterns

### Flashcard Creation
- [ ] **Bug Description:** Flashcard creation graph labelling must be better
- [ ] **Recommendation:** Improve flashcard creation graph labels for better clarity and understanding

- [ ] **Bug Description:** Decay rate calulation seems right but need to test more
- [ ] **Recommendation:** Conduct additional testing of decay rate calculation to ensure accuracy and reliability

---

## MyPDF Page

### Font and Typography
- [ ] **Bug Description:** Complete font change
- [ ] **Recommendation:** Implement consistent font styling across the entire MyPDF page

- [ ] **Bug Description:** Document name must be bigger and clearer
- [ ] **Recommendation:** Increase document name font size and improve clarity for better readability

- [ ] **Bug Description:** Increase the font sizes of all the words in Continue Reading
- [ ] **Recommendation:** Enhance font sizes throughout the Continue Reading section for improved visibility

### Library Section Layout
- [ ] **Bug Description:** there is enough space to make the folder icons bigger in the library section
- [ ] **Recommendation:** Increase folder icon sizes in the library section to better utilize available space

- [ ] **Bug Description:** The drop down of subjects is very small not at all visible
- [ ] **Recommendation:** Increase subject dropdown size and improve visibility for better user interaction

### Library Navigation Structure
- [ ] **Bug Description:** And isnide library at the startof the page it should show all folders in a scrllable fashion not the opened folder
- [ ] **Recommendation:** Modify library to display all folders in scrollable format at page start instead of showing opened folder content

- [ ] **Bug Description:** For example when. first open the Mypdf page The library must show all the folders off of which i will select one lets say Anatomy and a new section called all must be added in the library dorpdown
- [ ] **Recommendation:** Implement folder selection interface where MyPDF page initially shows all available folders for selection, and add "All" section to library dropdown for comprehensive access

### AI Integration
- [ ] **Bug Description:** Optimse you rstudy must come from the AI recomendation engine
- [ ] **Recommendation:** Connect "Optimize your study" feature to AI recommendation engine for personalized study suggestions

### Recent Section
- [ ] **Bug Description:** Recent section is not populated at all
- [ ] **Recommendation:** Fix Recent section to properly populate with recently accessed documents and study materials

---

## PDFviewer Page

### Search Functionality
- [ ] **Bug Description:** Search bar looks shit there is a overlap of two bars the search bar is black and the text inside is black as well
- [ ] **Recommendation:** Fix search bar design to eliminate overlap, change color scheme to ensure text visibility with proper contrast

- [ ] **Bug Description:** No up and down buttom when i serach no way to find the second word after the first one appears
- [ ] **Recommendation:** Implement up and down navigation buttons for search results to allow cycling through multiple instances of searched terms

### Alarm Feature
- [ ] **Bug Description:** ALarm is a dummy no pop up when done no sound when done literally no functionality other than a counter
- [ ] **Recommendation:** Implement complete alarm functionality with popup notifications, sound alerts, and proper timer completion actions

### UI/UX Issues
- [ ] **Bug Description:** The fonts inside buttons are so small you kiterally cant see it
- [ ] **Recommendation:** Increase button font sizes across the interface for better readability

- [ ] **Bug Description:** All the icons seem to be bulged up or smudged none of them have any clarity
- [ ] **Recommendation:** Replace or redesign all icons to ensure sharp, clear visibility without bulging or smudging effects

- [ ] **Bug Description:** There are no icon name showcase when hovered over the button
- [ ] **Recommendation:** Implement tooltip functionality to display icon names on hover for better user guidance

### Notes Overlay Issues
- [ ] **Bug Description:** IN notes overlay the sroke and opacity control of pens disapper and no option to change unless i click on a diff pen and then clcik the one i want
- [ ] **Recommendation:** Fix pen stroke and opacity controls to remain accessible in notes overlay without requiring pen switching workaround

- [ ] **Bug Description:** Highlighter tool is shit spreads over every single time
- [ ] **Recommendation:** Fix highlighter tool precision to prevent unwanted spreading and ensure accurate highlighting

### Shapes and Tools
- [ ] **Bug Description:** Uneccewary icons in the shapes tool like the pan icon where its not needed
- [ ] **Recommendation:** Remove unnecessary icons from shapes tool, specifically the pan icon and other irrelevant tools

- [ ] **Bug Description:** There are unessecary fonts which are not working in teh text tool
- [ ] **Recommendation:** Remove non-functional fonts from text tool and ensure all available fonts work properly

### Text Tool Functionality
- [ ] **Bug Description:** None of the options work in the text tool not a single one text colour doesnt change size doesnt change bold italica nothing works and there is no way to edit a written text
- [ ] **Recommendation:** Fix complete text tool functionality including color change, size adjustment, bold, italic formatting, and implement text editing capabilities

### PDF/Notes/AI Toggle
- [ ] **Bug Description:** The trifecta icon of PDF/Notes/AI the background of the toggle is not visible
- [ ] **Recommendation:** Fix toggle background visibility for PDF/Notes/AI trifecta icon

- [ ] **Bug Description:** Literally all three icons are completely blurred
- [ ] **Recommendation:** Replace or redesign all three icons (PDF/Notes/AI) to ensure clear, sharp visibility

### Split View Issues
- [ ] **Bug Description:** In Pdf and notes spilt view i dont get any content i have written in teh notes overlay
- [ ] **Recommendation:** Fix split view synchronization to display notes overlay content properly in PDF and notes split view

- [ ] **Bug Description:** Screenshot tool disappears when in notes mode and not able to place screenshots at all inside the notes
- [ ] **Recommendation:** Ensure screenshot tool remains accessible in notes mode and implement screenshot placement functionality within notes

### AI Split View
- [ ] **Bug Description:** In AI split view The font needs to be changed and the logos of U and Acolyte look extremely weird need to change it completely
- [ ] **Recommendation:** Update AI split view font and completely redesign U and Acolyte logos for better appearance

- [ ] **Bug Description:** Error: Job polling timeout gettig this error from AI
- [ ] **Recommendation:** Fix AI job polling timeout error to ensure proper AI functionality without timeout issues

- [ ] **Bug Description:** Unneccesary upload button
- [ ] **Recommendation:** Remove unnecessary upload button from AI interface

### AI Tools Functionality
- [ ] **Bug Description:** Ai tools summary working Citation has random numbers
- [ ] **Recommendation:** Fix AI citation tool to generate proper citations without random numbers

- [ ] **Bug Description:** Concept mapper unavailable
- [ ] **Recommendation:** Implement or fix concept mapper functionality in AI tools

- [ ] **Bug Description:** Topic tracker unavailable
- [ ] **Recommendation:** Implement or fix topic tracker functionality in AI tools

- [ ] **Bug Description:** Flashvard and quiz links not working
- [ ] **Recommendation:** Fix flashcard and quiz links to ensure proper navigation and functionality

- [ ] **Bug Description:** Document Insights is present but not scroollable
- [ ] **Recommendation:** Implement scrolling functionality for Document Insights section

---

## Notes Page

### Library Design
- [ ] **Bug Description:** Same library design issue as one in PDF
- [ ] **Recommendation:** Apply the same library design fixes implemented for PDF page - display all folders in scrollable format at page start and add "All" section to library dropdown

### Create New Folders Interface
- [ ] **Bug Description:** The create new folders the icon is small and not proportional to the text below it
- [ ] **Recommendation:** Resize create new folders icon to be proportional and properly aligned with the text below it

### AI Integration
- [ ] **Bug Description:** Ai recomendation not working
- [ ] **Recommendation:** Fix AI recommendation functionality to provide working study suggestions and recommendations

### Note Creation Logic
- [ ] **Bug Description:** No matter which folder i create a new note its taking the previous pdf and opening a notes for it I was testing using the cardiology pdf in notes i created a new note in psychiatry but its creating one in the cardiology pdf
- [ ] **Recommendation:** Fix note creation logic to properly associate new notes with the selected folder/subject instead of defaulting to previously opened PDF

### Page Layout
- [ ] **Bug Description:** The page seems too empty
- [ ] **Recommendation:** Improve page layout and content density to make better use of available space and provide a more engaging user interface

---

## Flashcard Page

### Font and Typography
- [ ] **Bug Description:** Complete font change
- [ ] **Recommendation:** Implement consistent font styling across the entire Flashcard page

- [ ] **Bug Description:** The heading to font size should be calibrated again
- [ ] **Recommendation:** Recalibrate heading font sizes for proper hierarchy and readability

### Create Flashcard Functionality
- [ ] **Bug Description:** Create flashcard just not working
- [ ] **Recommendation:** Fix create flashcard functionality to allow proper flashcard creation and saving

### My Decks Display Format
- [ ] **Bug Description:** My Decks inside each subect no need to show the entire flashcard show it as a list as its harder to scroll if entire flashcard is there
- [ ] **Recommendation:** Change My Decks display format to show flashcards as a list instead of full cards for easier scrolling and navigation

- [ ] **Bug Description:** Cards are not loading in MyDecks by body system
- [ ] **Recommendation:** Fix card loading functionality in MyDecks by body system section

- [ ] **Bug Description:** It should be simialr to how Recent block is shown
- [ ] **Recommendation:** Implement similar display format as Recent block for consistent user experience

### Bookmark Section
- [ ] **Bug Description:** The bookmark section is weird and doesnt make sense
- [ ] **Recommendation:** Redesign bookmark section with clear functionality and intuitive user interface

### ANKI-Based Day Filter System
- [ ] **Bug Description:** There ust be a day based filter so that Cards due are proeprly shown based on ANKI
- [ ] **Recommendation:** Implement day-based filter system for proper ANKI-style spaced repetition scheduling

- [ ] **Bug Description:** For day 25.01.25 lets say there are 10 cards due they must not be pushed for the next day they must stay in the same day as a folder
- [ ] **Recommendation:** Ensure cards due for specific dates remain in their designated day folder and are not automatically pushed to next day

### Due Today Functionality
- [ ] **Bug Description:** I cant open a flashcard from due today
- [ ] **Recommendation:** Fix due today section to allow proper opening and accessing of flashcards scheduled for current day

### UI Design Issues
- [ ] **Bug Description:** The icons of people must be removed
- [ ] **Recommendation:** Remove people icons from the flashcard interface

- [ ] **Bug Description:** The design of flashcard design is not good the siize and look and feel must be completely changed
- [ ] **Recommendation:** Complete redesign of flashcard appearance including size, layout, and overall look and feel

### Analytics and Visualization
- [ ] **Bug Description:** The decay rate graph must be shown
- [ ] **Recommendation:** Implement decay rate graph display for tracking memory retention and forgetting curves

### Button Functionality
- [ ] **Bug Description:** WHen i press hard the flascard doesnt exit same with all the buttons other than Again
- [ ] **Recommendation:** Fix button functionality to ensure Hard button and all other buttons work properly for flashcard navigation and scoring

### Content Quality
- [ ] **Bug Description:** The spelling pronunciation must be fixed
- [ ] **Recommendation:** Implement spell check and pronunciation correction features for flashcard content

---

## AI Page

### Study History Display
- [ ] **Bug Description:** Study History chats must have start of chat names not pdf names
- [ ] **Recommendation:** Change Study History display to show chat conversation names/titles instead of PDF file names for better chat identification and navigation

### Query Types Interface
- [ ] **Bug Description:** Query types must be made more clear
- [ ] **Recommendation:** Improve query types interface with clearer descriptions, labels, and visual indicators to help users understand different query options available

---

## Profile Page

### Font and Design
- [ ] **Bug Description:** Font change compllete
- [ ] **Recommendation:** Implement complete font change across the entire Profile page for consistency

- [ ] **Bug Description:** The fonts inside buttons need to be big
- [ ] **Recommendation:** Increase button font sizes for better readability and accessibility

### Banner Section
- [ ] **Bug Description:** Banner redesign and structuring
- [ ] **Recommendation:** Redesign and restructure the banner section for improved visual appeal and layout organization

### Statistics Display
- [ ] **Bug Description:** Statistics not populTED
- [ ] **Recommendation:** Fix statistics section to properly populate with user data and performance metrics

### Profile Features
- [ ] **Bug Description:** A place to define goals
- [ ] **Recommendation:** Implement goals section where users can define and track their study objectives and targets

- [ ] **Bug Description:** Edit prfile
- [ ] **Recommendation:** Implement comprehensive profile editing functionality for user information updates

- [ ] **Bug Description:** Donot make sense to have a remove profile option
- [ ] **Recommendation:** Remove the profile deletion option as it doesn't serve a meaningful purpose in this context

### Institution Settings
- [ ] **Bug Description:** Institution drop down with serach must be enabled the list is already there for all medical colleges in India
- [ ] **Recommendation:** Enable search functionality within institution dropdown to allow users to easily find and select from the existing list of medical colleges in India

- [ ] **Bug Description:** Location doesnt make sense
- [ ] **Recommendation:** Remove or redesign location field as it doesn't provide meaningful value in current context

### Security Settings
- [ ] **Bug Description:** Password recvery remove two factor if its not active better if we can get it will clear some regilatioons
- [ ] **Recommendation:** Remove inactive two-factor authentication from password recovery process, or implement proper 2FA functionality to meet regulatory requirements

---

## General/Global Issues

### Animation Updates
- [ ] **Bug Description:** Loading animations need to be updated
- [ ] **Recommendation:** Update loading animations across the application for better user experience and modern design standards

- [ ] **Bug Description:** Training animation need to be updated
- [ ] **Recommendation:** Update training animation sequences to improve user onboarding and tutorial experience

### Font Specifications
- [ ] **Bug Description:** The font needed to update is Caustean bold
- [ ] **Recommendation:** Implement Caustean bold font across the application where font updates are required

### Notification System
- [ ] **Bug Description:** Notification style should be similar to app design
- [ ] **Recommendation:** Update notification styling to match the overall app design language and maintain visual consistency

---

## Additional Pages
*Additional page bug sheets will be added below as they are provided*