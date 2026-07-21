# Day 07 Training Content Summary (Codex AI Workspace)

This summary is the final, comprehensive summary of guidelines for instructors and participants leading the Day 7 **"Development (Making Functionality with AI)"** training session. If Day 6 was centered on configuring the screen structure framework on a blank screen (static rendering), Day 7 completed the user's click action, input transmission, and data loading flow (dynamic function connection, Task 01), verified user scenarios to prevent interruption of inflow flow such as loss of previous state value (Task 02), and verified functions to block logic malfunctions such as repeated button inflow and time boundaries (Task 03) to ensure that the system operates completely and robustly. Provides key summary guidelines for assembling practical software functionality.

---

## 📌 Part 1. Introduction background and necessity

### 1. Overcoming barriers to non-development juniors at the feature integration stage
* **Shell Limitations of Static Screens**: Publishing screens are perfect, but without click actions and form submission events and state storage, they provide no value to actual users.
* **Fragmentation of the user journey**: The individual sign-up function and the reservation list renderer function each work well, but flow connection defects, such as filter information being lost or missing state backups, often occur when the user moves through the list and returns to the detail page.
* **System collapse due to exception input (Abuse)**: If there is no safety device (Disabled state, Data Validation) for abnormal category input, such as continuous influx (Double Submit) where the button is pressed multiple times quickly or reservation request for past dates, the integrity of the database will collapse serially.

### 2. ChatGPT vs Codex Client (Workspace-based)
| Comparison Items | ChatGPT (General Conversational AI) | Codex Client (Workspace-based AI) |
|---|---|---|
| **Event connection suggestion** | Provides event binding for a single button by looking at just the HTML fragment | Presents a comprehensive data movement system between screens, from submission of membership registration form to dashboard screen switching and loading into local storage |
| **Scenario Gap Verification** | Provide fragmentary solution code for “Back information disappears” | Read the full screen map (`day7_user_flow.md`) and structurally analyze sections vulnerable to information loss for list regression, detailed reservation entry, and virtual payment status changes |
| **Block exceptions from repeated hits** | Simple setTimeout use debounce code only mechanical return | Build practical logic to prevent continuous data inflow by organically synchronizing the loading status value lock instruction and the `disabled` attribute of HTML tags |

---

## 📌 Part 2. Summary of goals and results of today’s practice

### 1. Final result to be created today
* **Task 01. Connecting the feature**: **Dynamic event script** that loads data into local storage and controls normal screen transition when submitting a form click (Output: Completed code based on `day7_unconnected_feature.html`)
* **Task 02. Verifying user scenario**: **Session backup logic** that preserves filtering setting information when going back to the screen (Output: alternative code based on `day7_user_flow.md`)
* **Task 03. Find feature errors**: **Security and integrity verification source** equipped with lock variable and past date exception verification guard to block duplicate repeated hits** (Output: `day7_feature_validation.js` modified version)
* **Mission 01. Check service completeness with AI**: **Service quality inspection report** recording missing loading feedback (Spinner) and detection of storage exceptions as priority ratings (output: `day7_service_audit.md`)
* **Mission 02. Try it from start to finish**: **End-to-end user scenario comprehensive verification report** that collects and complements movement errors of personas who are unfamiliar with smartphone operation (output: `day7_e2e_validation.md`)

---

## 📌 Part 3. Follow along (Step-by-Step practice guide)

### STEP 1. Task 01 - Connecting functions
* **Action**: Prepare the sign-up markup `day7_unconnected_feature.html` where the feature is not working and submit the questions below to Codex.
  > "I am trying to connect a JavaScript function to the sign-up screen code in the provided day7_unconnected_feature.html. Please write an integrated script that 1) checks the validity of input values ​​when the sign-up complete button is clicked, 2) saves the information in the browser's local storage, and 3) moves to the dashboard screen when successful. Please also suggest the missing cancel button response or duplicate sign-up check logic."
* **Confirm**: When submitting the sign-up button, the warning message window in the browser lights up normally and verifies that the email data entered in the LocalStorage area of ​​the Developer Tools Application tab is loaded.

### STEP 2. Task 02 - Verify user scenario
* **Action**: Ask about the cause of information loss in all sections based on the `day7_user_flow.md` specification that organizes registration, list, and detailed itinerary.
  > "By analyzing the step-by-step call sequence of the provided day7_user_flow.md specification (Sign up ➔ Expert search ➔ Detailed reservation ➔ Virtual payment), diagnose the two key sections where information loss is most likely to occur when a user takes this route, and suggest a state preservation logic structure as an alternative code to prevent this."
* **Check**: Verify that the `sessionStorage.setItem` caching helper function has been extracted properly in response to an issue where existing search category filtering is reset when returning to the list.

### STEP 3. Task 03 - Find functional errors
* **Action**: Prepare the source `day7_feature_validation.js` that causes duplicate button press errors and instruct an exception prevention patch.
  > "Please review the reservation application logic in the provided day7_feature_validation.js file. 1) Detect the vulnerability of duplicate reservation requests (button presses) and 2) the possibility of application errors in the past of the reservation date. To prevent this, please suggest a final verification code with disabled state processing and date validity period check added."
* **Check**: Check whether detection of the Boolean variable `isSubmitting` state, which refers to the lock, is working, and whether the `.disabled = true` control of the target element button is processed normally.

### Mission 1. Check service completeness with AI
* **Action**: Send a quality audit of your completed `day7_feature_validation.js` integration script.
  > "Based on the total amount of code and screen movement flow provided, please analyze any missing loading feedback or exception handling in operation from a service QA perspective and generate an inspection report (Service Audit) with priority."
* **Check**: Check whether the `day7_service_audit.md` file, which contains a `try-catch` recommendation to prevent storage capacity overflow and a virtual completeness evaluation of 85%, is secured.

### Mission 2. Try it from start to finish (E2E Walkthrough)
* **Action**: Conduct a mock E2E journey role-playing test by assigning the persona of a novice self-employed person in his 50s.
  > "You are a self-employed novice in your 50s who is unfamiliar with mobile app reservation payments. Assuming that you are using an E2E scenario from sign-up to payment completion, please pull out a vivid user scenario verification (E2E Validation) to see if there is a risk of inconvenience or deviation in my logic."
* **Check**: Check whether corrections for fatigue, etc. that may be felt when the inability to apply for past dates is not clearly stated on the screen are reflected and output in the `day7_e2e_validation.md` verification result.

---

## 📌 Part 4. Principle of operation and significance

### 1. Client storage persistence (Storage Persistence & State Control)
* This is a screen flow design technique that preserves information and prevents churn by controlling local/session caching storage guaranteed by the browser before direct database communication with the server.

### 2. Continuous submission lock technique (Debouncing & Disabled Guard)
* This is a solid development practice principle that prevents unnecessary transactions and data corruption by controlling duplicate event queues created by multiple mouse clicks and synchronizing deactivation flags.

### 3. Five milestones for improving functional completeness
```text
[Connect static markup events] (Task 01. Inject life into buttons)
         │
         ▼
[User all journey flow tracking] (Task 02. Securing status preservation)
         │
         ▼
[Abnormal repeated hitting and guard coding] (Task 03. Robustness auditing)
         │
         ▼
[Comprehensive usability assurance QA inspection] (Mission 01. Scoring diagnosis)
         │
         ▼
[Virtual customer persona E2E done] (Mission 02. Proof of journey completion)
```
Through this functional assembly and verification training, students will gain a clear understanding of the “difference between a completed screen and an actual service”**, and proactively acquire software design and development skills to self-adjust how to complete a friendlier and safer application.

---

## 📌 Part 5. Training Session Guide

### 💡 Instructional design specifications
* **Difficulty level**: ★★☆☆☆ (Beginner - even non-majors can easily learn local storage and basic JavaScript concepts)
* **Estimated lab time**: 1 hour 30 minutes to 2 hours
* **Practical usability**: ★★★★★ (Core foundations for building robust, bug-free applications)
* **Learner Questions/Discussion Topics**:
  1. "If there is no response even after 5 seconds after the user presses the reservation completion button, is this a front-end event processing failure (error) or a back-end server processing delay? How should I modify the event logic to distinguish between the two situations and send a screen message to the user?"
  2. "Browser LocalStorage is convenient because it permanently stores data on the user's computer, but it is very vulnerable to security. So what information about users is safe to store in local storage, and what information should never be stored?"
