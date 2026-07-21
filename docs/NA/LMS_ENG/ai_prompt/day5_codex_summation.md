# Day 05 Training Content Summary (Codex AI Workspace)

This summary is the final comprehensive summary guideline for instructors and participants conducting the Day 5 **"Service Design (UI/UX Review)"** training session. We provide summary information for achieving true user-centered design by discovering complex user information recognition difficulties that can occur during the planning stage (Task 01), detecting inconsistencies between multi-screen planning documents (Task 02), and optimizing user movement to shorten the click steps to reach the final destination (Task 03).

---

## 📌 Part 1. Introduction background and necessity

### 1. Usability barriers in the service design phase
* **The arrogance of function-centered design**: Due to the confirmation bias of developers who judge that “development is finished when the function is running properly,” the phenomenon often occurs that users who access the app for the first time do not understand the interface rules and leave the app.
* **Integrated consistency fragmentation**: As multiple planners and publishers work on different parts, the learning load increases due to different design themes or words (ID vs. customer ID), such as login, sign-up, and my page, and different button positions.
* **Fatigue-inducing flow**: In the name of business policy, clicks and single consent screens are listed in succession, causing excessive screen switching (friction) to achieve the purpose, drastically reducing the entry rate into the payment stage.

### 2. ChatGPT vs Codex Client (Workspace-based)
| Comparison Items | ChatGPT (General Conversational AI) | Codex Client (Workspace-based AI) |
|---|---|---|
| **Screen structure analysis** | Judging only the readability of one text uploaded by a user | Comprehensive comparative analysis of the link and inflow depth of multiple file specifications such as registration screen, card details screen, and payment screen |
| **Consistency Verification** | Correcting superficial words at the level of simple variable English writing | Derive consistency violation points by mapping the color, font width, and status message specifications of function buttons for the same purpose placed on different screens |
| **Persona Research** | Qualitative feedback at the level of fragmentary “It’s difficult to use” | By projecting specific skill limit scenarios such as self-employed people in their 50s, error-prone information reset difficulties and font size legibility verification tracking |

---

## 📌 Part 2. Summary of goals and results of today’s practice

### 1. Final result to be created today
* **Task 01. Review the screen from the user's perspective**: **UX improvement report** that uncovers usability limitations that novice users face when applying for a reservation (output: `ux-review-report.md`)
* **Task 02. Review screen consistency**: **UI consistency report** that captures contradictions in button placement, rules, and terminology between sign-up and information modification screens (output: `ui-consistency-report.md`)
* **Task 03. Improving user flow**: **User Journey Report** containing an architecture proposal to shorten the 9-step consultation reservation click step to 4 steps (output: `user-journey-report.md`)
* **Mission 01. Become a first-time user**: **Virtual user experience** that captures the vivid and perplexing elements of Codex given the persona of a beginner in his 50s (output: `first-user-review.md`)
* **Mission 02. Evaluating service quality with AI**: Comprehensive **service quality evaluation report** structured as indicators (Score) of understandability, readability, and recovery (output: `usability-evaluation.md`)

---

## 📌 Part 3. Follow along (Step-by-Step practice guide)

### STEP 1. Task 01 - Review the screen from the user’s perspective
* **Action**: Prepare the `day5_signup_flow.md` file and send the command below to Codex.
  > "Based on the screen specifications of the reservation application details form provided, please review whether the information structure is clear from the perspective of a novice user who is new to the service, point out elements that impede usability, and write a report suggesting improvements (UX Review Report)."
* **Check**: Check whether distraction factors for expert information (ratings, etc.), unclear time slot selection, payment fee hiding points, and specific layout improvement guides have been derived.

### STEP 2. Task 02 - Review screen consistency
* **Action**: Give the command below to compare the login/signup screen specifications and member information modification specifications.
  > "Please compare the design details of each screen in the provided day5_signup_flow.md and analyze elements that lack consistency in button placement rules, terms used, and feedback messages to create a screen comparison report."
* **Check**: Check whether points of confusion between the 'ID' terminology on the sign-up screen and 'Customer ID' on the reservation screen, and the asymmetric grid actions of the small completion button at the top and the full-width login button at the bottom, have been derived.

### STEP 3. Task 03 - Improving user flow
* **Action**: Presents a 9-step path broken down from moving calendars to checking details, and builds the optimization commands below.
  > "Please analyze the reservation detailed scenario flow in the provided day5_signup_flow.md and create a user journey improvement report (User Journey Report) that can minimize the click steps and screen movement until the user completes the consultation reservation."
* **Check**: Review whether the one-page integrated structure (TO-BE) of the details and reservation screens and the modal simplification matrix of the overlapping terms and conditions agreement process have been completed with a four-step flow structure.

### Mission 1. Become a first-time user
* **Action**: Request the research context of older users to AI along with the persona settings below.
  > "You are a self-employed person in your 50s who is somewhat awkward at using digital smartphone apps. While looking at the membership sign-up and first screen UI specifications written in the provided day5_signup_flow.md statement, please write down what you find most confusing and difficult when signing up, your emotional reaction, and any requests for improvement."
* **Check**: Determine whether the report lists the manual click barrier for the ID duplicate check button, difficulties with legibility of 10px text for days and slots in the calendar, and reset anger points where entire characters are lost when an error occurs in the sign-up form.

### Mission 2. Evaluate service quality with AI
* **Action**: Request an evaluation of the overall quality quantification (Usability Scoring) of the completed plan using the prompt below.
  > "Based on the provided day5_signup_flow.md specification, please give a score out of 5 for each item such as 1) information readability, 2) operation accessibility, 3) error resilience, and 4) movement efficiency, and build a service quality evaluation (Usability Evaluation) that points out the strengths and painful points of improvement along with the overall evaluation score."
* **Check**: Secure the scores for the four major evaluation axes, such as 2.5 points for error resilience and 2.0 points for movement efficiency, and check whether comprehensive measures such as preserving local storage status are recommended.

---

## 📌 Part 4. Principle of operation and significance

### 1. Heuristic Usability Auditing (UX Heuristic Auditing)
* This is an analysis method that measures the level of friction that users will face by comparing the information hierarchy and button style of a single specification that the planner inadvertently passed over with standard UI principles.

### 2. Virtual Persona Simulation (AI Persona Simulation)
* By imitating the behavioral psychology of personas with specific technical proficiency and age barriers, error loops and cognitive friction points that designers may miss due to being stuck in their own field of vision are captured early before the test stage.

### 3. Five usability improvement milestones
```text
[Novice user usability review] (Task 01. Identifying inconveniences)
         │
         ▼
[UI style consistency check] (Task 02. Unified standard)
         │
         ▼
[User Journey Shortening Design] (Task 03. Movement Line Optimization)
         │
         ▼
[Collection of virtual customer trouble logs] (Mission 01. First impression feedback)
         │
         ▼
[Usability numerical quality diagnosis] (Mission 02. Score prescription)
```
This usability diagnosis pipeline allows students to go beyond the technological omnipotence of “development is over once the code is running”** and instill user-centered thinking of **“successful software must be understandable by users”**.

---

## 📌 Part 5. Training Session Guide

### 💡 Instructional design specifications
* **Difficulty level**: ★★☆☆☆ (Beginner - Non-development planning positions can also participate 100% without coding)
* **Estimated lab time**: 1 hour to 1 hour 30 minutes
* **Practical usability**: ★★★★★ (Verification tool to be operated unconditionally before final completion of the plan)
* **Learner Questions/Discussion Topics**:
  1. “How should we balance the fact that all entered data is lost in the event of a membership registration error from the perspective of information deletion for security purposes (Security) and the user experience (UX) perspective?”
  2. “When the product is successful and the number of users increases by more than 100,000, how should we improve the UI by combining the virtual reviews predicted by AI and the actually collected Google Analytics (GA) user behavior log data?”

---

## 📌 Part 6. Service design (UI/UX review) stage final training task

| Task | Topic | AI utilization |
|---|---|---|
| Task 01 | Reviewing the screen from the user's perspective | AI reviews the irrationality of the screen layout from the perspective of a novice user and comes up with a solution |
| Task 02 | Review screen consistency | Establishing rules by comparing and analyzing terminology across multiple pages and button position symmetry |
| Task 03 | Improving user movement | Flow design that reduces the number of user clicks by shortening unnecessary independent guidance screens |
| Mission 01 | Become a first-time user | Reproducing a virtual sign-up predicament by injecting an unfamiliar, elderly persona into a smart device |
| Mission 02 | Evaluating service quality with AI | Write a final evaluation report by converting usability scores such as comprehension, recovery, and readability |
