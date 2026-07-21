# Day 06 Training Content Summary (Codex AI Workspace)

This summary is the final comprehensive summary of guidelines for instructors and participants of the Day 6 **"Development (Creating Screens with AI)"** training session. We provide key information needed to grow into a hands-on, hands-on junior with AI pair programmers, such as designing a prototype to overcome the vagueness of the early stages of development and quickly create a UI draft on a blank screen (Task 01), securing debugging capabilities to interpret error messages to find and solve the cause on your own (Task 02), and improving code to make complex and redundant raw code easier to read and more robust (Task 03).

---

## 📌 Part 1. Introduction background and necessity

### 1. Fatal barrier at the entry level of development
* **Blank Page Syndrome**: Even when you have a planning document in front of you, you are unable to take the first step in writing code, which causes time to be lost and gives up easily at the starting stage.
* **Debugging fear and time delay**: Due to lack of clue search ability to read and interpret English error logs that occur during development, more than half a day of learning efficiency is wasted trying to catch missed semicolons or variable name typos that would have been completed in 10 seconds.
* **Unmaintainable spaghetti code**: If you are intoxicated by the success of a function and mass-produce raw code without paying attention to variable names and commonization logic, even if just one function is extended, the entire system will collapse.

### 2. ChatGPT vs Codex Client (Workspace-based)
| Comparison Items | ChatGPT (General Conversational AI) | Codex Client (Workspace-based AI) |
|---|---|---|
| **Screen Draft Build** | Returns only a single component markup based on partial text copied by the user | Interconnectivity and automatic building of local boilerplate between HTML structures and external CSS Flexbox/Grid style files to decorate them |
| **Error Cause Tracking** | Present only superficial prediction code by looking at only one line of error message | Resolve the actual cause by mapping the source code line number of the error stack trace and the asynchronous call relationship between local functions |
| **Code Refactoring** | Proposal of monotonous abbreviation that unconditionally reduces the code to conciseness | Collaborative naming convention standard, reusable function extraction parameter design, practical clean refactoring with complexity removal and annotation enrichment |

---

## 📌 Part 2. Summary of goals and results of today’s practice

### 1. Final result to be created today
* **Task 01. Quickly create a screen draft**: Responsive dashboard implemented based on planned layout specifications **Screen prototype** (Output: `day6_layout_spec.md` based code)
* **Task 02. Error resolution assistant**: **Error diagnosis and resolution guidebook** that reads error types and establishes defensive precautions (Output: `day6_debug_source.js`-based solution code)
* **Task 03. Improving the code**: **Refactoring source code** with duplicates removed and readable naming (Output: Refactoring version based on `day6_dirty_code.js`)
* **Mission 01. Resolving errors with AI**: **Debugging error report** describing the actual debugging process and CORS/JSON parsing failure history (output: `day6_error_report.md`)
* **Mission 02. Receive AI code review**: **Final audit result report** that actively improves and improves code smell points (output: `day6_code_review.md`)

---

## 📌 Part 3. Follow along (Step-by-Step practice guide)

### STEP 1. Task 01 - Quickly create a screen draft
* **Action**: Configure `day6_layout_spec.md` containing the dashboard screen specification in a local folder and send the prompt below to Codex.
  > "Based on the provided layout specification, please create a draft HTML markup and CSS grid style for a responsive dashboard screen to view reservation status. Please suggest an initial project structure, including a left navigation bar and waiting/approved/complete card components to indicate reservation status."
* **Check**: Check that the generated HTML file and CSS file structure are created properly, and that the dashboard three-tier card layout and navigation composition are correctly set in the web browser.

### STEP 2. Task 02 - Error Resolution Assistant
* **Action**: Link the `day6_debug_source.js` file, which causes an error at runtime, and send the command below.
  > "An error 'TypeError: Cannot read properties of undefined (reading 'map')' occurred in the code you wrote. Compare the provided source code `day6_debug_source.js` and the console error log to explain the cause (why) of the error from a beginner's perspective. Please provide a modified source with defense code that can completely control the error."
* **Check**: Identify the causal explanation for empty value detection before asynchronous data acquisition, and check whether optional chaining (`?.`) or conditional early return (`if (!data)`) defense valve code has been added.

### STEP 3. Task 03 - Improving the code
* **Action**: Requesting refactoring feedback based on the raw, dirty source `day6_dirty_code.js`.
  > "Please analyze the source of the provided `day6_dirty_code.js` file and refactor it into an improved version of clean code by 1) separating the duplicate markup binding logic into a common utility function, 2) correcting ambiguous variable names (ex: `a`, `temp`, `fn`) with practical words, and 3) writing appropriate one-line comments to facilitate future maintenance."
* **Check**: Check that esoteric temporary variables have been modified to be more readable, such as `formatUserPhoneNumber`, and that duplicate functions have been cleaned up with common render card template helper functions.

### Mission 1. Solving errors with AI
* **Action**: Request debugging with error logs such as CORS or JSON format interpretation failure during testing.
  > "Based on the 'SyntaxError: Unexpected token < in JSON' error message and code file that occurred when calling the server, please build a final debugging report (Error Report) that reflects the background of the error and the action code."
* **Check**: Check whether the debugging report form, which captures the cause of the HTTP response type mismatch and safely blocks the exception, is properly filled out in the `day6_error_report.md` file.

### Mission 2. Receive AI code review
* **Action**: Request an audit of the final rendering control code of the file you specified.
  > "Please conduct a multi-faceted review of the provided dashboard status control code for global variable exposure and branch code profusion based on code quality indicators and return the final improved refactoring summary (Code Review)."
* **Check**: Verify that the `day6_code_review.md` report, which includes pointing out global contamination encapsulation and recommending a `switch-case` or mapping map structure, demonstrates numerical growth.

---

## 📌 Part 4. Principle of operation and significance

### 1. Rapid UI Prototyping
* This is a technique that lowers the start-up cost to close to zero by mapping the descriptive UI specifications written by the planner to component style classes and grid templates.

### 2. Code auditing focusing on readability (Clean Code Auditing)
* This is a task to extend the lifespan of software by monitoring not only its operation as machine language readable by machines, but also intelligent variable names and consistent role divisions that can be easily understood by other fellow developers (collaborators).

### 3. Five development improvement milestones
```text
[Screen skeleton draft build] (Task 01. Resolving startup barriers)
         │
         ▼
[Error log detailed diagnosis] (Task 02. Overcoming debugging)
         │
         ▼
[Duplicate and variable name improvement] (Task 03. Clean refactoring)
         │
         ▼
[Create exception prevention report] (Mission 01. Debugging patterning)
         │
         ▼
[Code multidimensional precision audit] (Mission 02. Code completion assurance)
```
These five sessions help learners realize the fun of writing code early on, prevent them from panicking when encountering bugs, and naturally instill the excellent junior development tendencies of critically refining and improving their own code.

---

## 📌 Part 5. Training Session Guide

### 💡 Instructional design specifications
* **Difficulty level**: ★★☆☆☆ (Beginner - For non-major beginners who are completely new to coding)
* **Estimated lab time**: 1 hour 30 minutes to 2 hours
* **Practical usability**: ★★★★★ (dramatically reduces the speed of development for beginners)
* **Learner Questions/Discussion Topics**:
  1. “If the solution code written by AI succeeds in fixing the error, but I do not fully understand the detailed operating principles of the code, should I apply that code to the actual deployment environment? What are the potential risks that may arise in this case?”
  2. “Which is closer to good code, ‘high-performing code’ or ‘easy-to-read code’? How would it be more advantageous to strike a balance between the two in a startup environment where business is constantly changing?”
