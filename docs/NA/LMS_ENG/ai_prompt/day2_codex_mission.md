# Task 01. Consistency Check Practice Guide

In this lab, you will learn how to quickly identify information discrepancies (consistency issues) between multiple documents using Codex Client and derive a summary report.

---

## 1. Story and practice background

While the startup project was in progress, the planner held a meeting to finalize the service reservation cancellation penalty policy and member withdrawal process and record them in the meeting minutes. However, the developer completed development based on the previous version of the requirements definition (payment cancellation was not reflected), and the designer completed the component design based on the screen definition that reflected another type of flow.

In the end, just before launch, a fatal communication failure occurred where **the meeting minutes policy and the actual function implementation and design composition were in a triangular conflict.

Previously, to find these inconsistencies, a person had to go through the documents one by one, which took a lot of time and involved human error. In this exercise, you will learn practical skills for automatically detecting contradictions between multiple documents and composing an action report by running Codex as a **"Reviewer"**.

---

## 2. Learning objectives

* Logical contradictions and differences (inconsistencies) between multiple specification documents can be compared and analyzed.
* Discrepancies between the requirements definition and the screen definition can be identified.
* You can verify whether the meeting agreement is fully reflected in the plan and screen design.
* Understand the practical workflow of using AI as a ‘precision reviewer’ rather than a ‘correct answer writer’.

---

## 3. Provide original files for practice

For practice, please create the contents of the three files below in the project folder (`automation/`). Intentionally inconsistent (contradictory) policies are hidden in each document.

### ① Meeting minutes (`meeting-notes.md`)
```markdown
# Online expert consultation service 2nd planning coordination meeting minutes

* **Purpose of the meeting**: Final confirmation of reservation cancellation policy and membership withdrawal process
* **decision**:
  1. If the user cancels the reservation consultation, a 10% cancellation penalty fee will be deducted and a refund will be made.
  2. When a user applies for membership withdrawal, existing consultation schedules are immediately ‘automatically cancelled’ and a ‘full refund’ is issued without a protection fee.
  3. For service transparency, we provide a 'star review and evaluation function' that allows general users (Customers) to evaluate experts (Experts) after the consultation.
  4. Non-members can only view the expert list and profile, and the reservation request button must be in a disabled status.
```

### ② Requirements definition (`requirements.md`)
```markdown
# Expert consultation service Define functional requirements

| Requirement ID | user | Function name | Requirements Description |
|---|---|---|---|
| FR-001 | Customer | Sign up | Users can sign up through email authentication. |
| FR-002 | Customer | Search for experts | Users can search for experts by field. |
| FR-003 | Customer | Membership withdrawal | When a user withdraws membership, existing reservation and consultation information is maintained in 'archived (maintained)' status for system security. |
| FR-004 | Expert | Star rating | After the consultation is over, the expert has a star rating function to evaluate the user (customer) who received the consultation. |

*Note: This Requirements Definition does not define requirements related to the reservation payment cancellation (refund) function.*
```

### ③ Screen definition (`screen-specification.md`)
```markdown
# Expert consultation Service screen design and flow definition

1. **Non-member home screen (SCR-001)**:
   - You can view the list of experts in your non-member status.
   - Both the ‘View Details’ and ‘Reservation’ buttons are activated and exposed at the bottom of each expert card. (When you click, you are immediately taken to the reservation schedule selection screen without being prompted to sign up)

2. **Membership withdrawal screen (SCR-002)**:
   - When the user presses the ‘Withdraw’ button, the withdrawal is processed immediately and the user is returned to the Login screen. (No separate reservation cancellation process or information pop-up window is displayed, and reservation data is hidden only on the screen)

3. **Consultation End screen (SCR-003)**:
   - When the consultation is over, a 'Counselor Evaluation' pop-up is displayed on the right side of the screen, and general users (Customers) can give stars (1 to 5 points) to the Expert (Expert).
```

---

## 4. Codex Action and Prompt Guide

Learners copy and send the instructions below to the prompt input box at the bottom of Codex Client and then press the **[Build]** button.

### Codex Request Prompt (Review Instructions)
```text
Compare and analyze the three documents ‘meeting-notes.md’, ‘requirements.md’, and ‘screen-specification.md’ in the project folder.

Find and organize items that are contradictory or inconsistent between each document, or items that exist in one document but are missing from the other.
Print the results according to the requirements below.

1. Organize the results in the form of a Markdown table with the following columns: ‘Classification (functions/screens/policies/terms, etc.)’, ‘Findings and contradictions’, ‘Impact level (high/medium/low)’, ‘Highest authority standard document’, and ‘Recommended action’.
2. When entering development and testing, indicate the impact level as 'high' for matters that may cause fatal rework.
3. Do not create arbitrary answers, but derive comparative analysis results based on facts only based on the document text.
```

---

## 5. Example of results

Codex interprets the prompts and generates a clear discrepancy summary report in tabular form, as shown below.

| Category | Findings and Contradictions | Impact | Reference document | Recommended Action |
|---|---|---|---|---|
| **Policy/Features** | In the meeting minutes, the 10% fee refund policy for cancellation of reservations was confirmed, but the requirements definition (`requirements.md`) was completely missing related information. | **High** | Meeting minutes | Reservation cancellation and 10% penalty refund function requirements must be additionally reflected in the requirements definition |
| **Policy/Screen** | When a member withdraws, the meeting minutes define 'automatic cancellation and full refund' for existing reservations, but the requirements document defines 'retention and maintenance', and the screen definition defines 'hidden processing without pop-up information', so all three documents are different. | **High** | Meeting minutes | After coordination with the planning team, the withdrawal logic of the requirements and screen definitions needs to be integrated and modified based on the meeting minutes |
| **Function/Screen** | In the meeting minutes and screen definitions, it was designed so that 'the user (Customer) evaluates the expert (Expert)', but in the requirements document (FR-004), the subjects were written in the opposite direction so that 'the expert (Expert) evaluates the user (Customer)'. | **High** | Meeting minutes | FR-004 evaluation subject in the requirements definition was revised to reflect customer |
| **Screen** | In the meeting minutes, it is stated that 'reservation request button is disabled' for non-members, but the screen definition (SCR-001) contradicts it by 'activating non-member reservation button' and entering the schedule without encouraging registration. | **Medium** | Meeting minutes | Modify the non-member home screen reservation flow in the screen definition to 'Induce deactivation or registration pop-up' |

---

## 6. AI utilization points

* **Multiple file cross-check**: Detect semantic errors (contradictions) between documents by simultaneously comparing the context of text data.
* **Impact Prioritization**: Prioritize by determining payment/policy conflict factors that become bottlenecks in system development.
* **Obtain action advice**: Derive a clear direction (Action Item) where the plan should go to resolve contradictions.

---

## 7. Learning points

> **⚠️ Shift in core perception**
> "AI is not a magic lamp that quickly writes out the answer statement. It is the most meticulous reviewer that finds **logical contradictions and loopholes (differences) in just a few seconds that would otherwise require a person to search through multiple documents all night long."

The most expensive point in a practical project is when planning errors are discovered and the system is overturned after development is completed. By deploying Codex as a pipeline inspector, you can prevent the catastrophe of planners, designers, and developers each holding different versions of the specification and creating the wrong product.

---

# Task 02. Change Management

## 1. Story and practice background

As the project progressed, the customer's requirements changed significantly to align with the business strategy. In the initial plan (v1.0), it was decided to support only simple email ID login, but as a result of the meeting, Google social login function was added to improve user subscription rate. In addition, to strengthen security, a mobile phone SMS authentication process was required when registering as a member, and a final agreement was made to establish a new division of administrator (Admin) authority for back office management.

However, this changed policy was not organically reflected in all outputs. As a result, only the planning requirements definition was partially modified, and the screen design and back-end API specifications were distributed to the development team while still holding the membership registration/login specifications based on the previous v1.0 standard.

In this exercise, you will learn techniques to use Codex to dynamically contrast requirements files before and after changes, identify screens, API functions, and documents affected by the changes, and automatically organize the change history and scope of influence map.

---

## 2. Learning objectives

* You can accurately compare and analyze changes in the requirements definition before and after the change.
* The scope of impact of specific function changes on system sub-elements (screen UI, linked API specifications) can be identified.
* System change history (Change Log) can be created and managed structurally.
* Using AI, the impact analysis process can be shortened to prevent human error.

---

## 3. Provide original files for practice

For practice, please create the contents of the four files below in the project folder (`automation/`).

### ① Requirements before change (`requirements-before.md`)
```markdown
# Define functional requirements v1.0 (Before change)

| Requirement ID | user | Function name | Requirements Description |
|---|---|---|---|
| FR-AUTH-01 | Customer | Login | Users can log in using their email address and password. |
| FR-AUTH-02 | Customer | Sign up | The user completes the registration by entering the email address and clicking the email verification link. |
| FR-AUTH-03 | System | Authorization | When registration is completed, the system automatically grants general user (User) rights to all users. |
```

### ② Requirements after change (`requirements-after.md`)
```markdown
# Define functional requirements v2.0 (After change)

| Requirement ID | user | Function name | Requirements Description |
|---|---|---|---|
| FR-AUTH-01 | Customer | Login | In addition to logging in via email, users can log in by linking their Google social accounts. |
| FR-AUTH-02 | Customer | Sign up | After applying for membership, the user completes the registration through the Check SMS authentication number by entering mobile phone number procedure. |
| FR-AUTH-03 | System | PermissionCategory | The system authority policy is divided into general user (User) authority and system administrator (Admin) authority. |
```

### ③ Screen definition (`screen-specification-v2.md`)
```markdown
# screen design (remaining documents as of v1.0)

1. **Login screen (SCR-01)**:
   - Only the Enter your email field, password input field, and ‘Login’ button are exposed.

2. **Sign up screen (SCR-02)**:
   - An Enter your email field and a ‘Send authentication email’ button are provided. When clicked, a pop-up window with Email link verification guide is displayed.

3. **My Page screen (SCR-03)**:
   - Only the profile information and reservation status screen for general members is displayed. Monitoring menus or page transition flows for administrators are not designed.
```

### ④ API specification (`api-specification.md`)
```markdown
# Backend member authentication API specifications (remaining documents as of v1.0)

* **Login API**:
  - `POST /api/v1/auth/login`
  - Request Payload: `{ "email": "string", "password": "string" }`

* **Sign up API**:
  - `POST /api/v1/auth/signup`
  - Request Payload: `{ "email": "string", "password": "string" }`
```

---

## 4. Codex Action and Prompt Guide

The learner copies and sends the instructions below to the Codex Client prompt input box and then clicks the **[Build]** button.

### Codex request prompt (directs change and impact analysis)
```text
First, analyze which policy has been changed by comparing the 'requirements-before.md' and 'requirements-after.md' files in the project folder.

After that, analyze which part of the ‘screen-specification-v2.md’ and ‘api-specification.md’ documents, which remain at the v1.0 level, where the changed policy content should be reflected.

The results are output in a Markdown table format according to the format below:
1. ‘Change items’, ‘Before change’, ‘After change’, ‘Scope of influence (screen/API)’, ‘Actions (specific modification guide required)’
2. Additionally, based on the v2.0 requirements, classify the importance of parts that require modification in the order of ‘high/medium/low’ and mark them in the column.
```

---

## 5. Example of results

Codex reads the semantic differences before and after the change and accurately reports the scope of impact and correction guide as shown below.

| Change Items | Before change | After change | Scope of Impact (Screen/API) | Importance | What to do (specific fix guide) |
|---|---|---|---|---|---|
| **Social Login** | Email login only | Added Google social login function | • Login screen (`SCR-01`) <br>• Login API | **High** | • Placing the 'Google Sign-in' button component on the login screen UI <br>• Need to design additional Google OAuth token reception parameter (`"oauth_token": "string"`) in API Payload |
| **Membership registration verification** | Email link verification | Check SMS authentication number by entering mobile phone number | • Membership registration screen (`SCR-02`) <br>• Membership registration API | **High** | • Replace the UI of the email sending component with a mobile phone number input field and a 'send/confirm verification number' field <br>• Mobile phone number (`"phone": "string"`) and verification code (`"verification_code": "string"`) fields are required to be reflected in the subscription API payload |
| **Administrator Privileges** | Automatic granting of single user permissions | Diversification of general user / system admin rights | • My Page Screen (`SCR-03`) <br>• Overall Security Authorization API | **Medium** | • Add administrator-only dashboard screen design to be exposed when logging in with administrator account <br>• Design of authority role (`"role": "string"`) information receiver in API authentication header or member information response |

---

## 6. AI utilization points

* **Perform Semantic Diff**: Identify key business policy differences in planning statements, not line-by-line.
* **Automatic impact map mapping**: Linked exploration of files with dependencies (screen planning, API specifications) in accordance with changes in requirements.
* **Automation of modification guidelines**: Recommendations by logically inferring the action items that the backend and frontend should perform respectively.

---

## 7. Learning points

The biggest risk when changes occur is **"source inconsistency due to omission"**. Using AI as an impact analysis assistant can automatically identify the scope that needs to be changed in the development specification (API) and design specifications (screen spec) when the requirements document is revised, thereby preventing source omission accidents and preserving development productivity.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Intermediate)
* **Estimated lab time:** 40 minutes
* **Practical usability:** ★★★★★

---

# Task 03. Decision Tracking

## 1. Story and practice background

At project meetings, numerous ideas and heated debates unfold, and various business policies are decided. However, if you are busy with your schedule and only record the details of simple meetings or final decisions, the background and context of why this decision was made often disappears after a while.

For example, the result information such as "For this first deployment, it was decided to apply only Google login and exclude Apple login" remains in the meeting minutes, but if there is no history of "Why Apple login was excluded in the meeting room at the time (cost? period? policy?)**, **who finally signed**, **when this decision was made**", then if a new team member joins or the second development is discussed, the same issue must be ping-ponged again.

In this exercise, you will learn how to use Codex to precisely extract the subject, date, cause, and background evidence of decisions from unstructured oral meeting minutes, messenger conversation minutes, and change request emails, and to build a **Decision Log** and **Pending Items** checklist for project tracking.

---

## 2. Learning objectives

* The background, date, and person in charge of decisions can be clearly classified in meeting minutes and conversation records.
* It is possible to distinguish between simple opinions expressed and completed matters in which the final decision has been approved.
* Pending/Action Items that are inconclusive and require reconfirmation in the future can be systematically organized.
* Using AI, business decision history (Decision Log) can be structured in real time from text conversation files.

---

## 3. Provide original files for practice

For practice, please create the contents of the two files below in the project folder (`automation/`).

### ① Meeting and messenger conversation log (`messenger-chat.md`)
```markdown
# planning-development 3rd decision making meeting transcript

* **Date**: 2026-07-15
* **Attendants**: PM, Dev_Lead

**PM**: The CEO gave his opinion on adding social login, and he wants both Google and Apple login to be included during the first launch.
**Dev_Lead**: Our development schedule for Apple Login is very tight, and due to Apple's annual developer account fee review schedule, we cannot possibly meet the launch specifications at the end of this month. First, let's launch only Google social login first, and consider reintroducing Apple login in the next second release.
**PM**: From what I heard, the schedule is definitely unreasonable. great. As of today (7/15), I have made the final decision to only use Google Login in the first round and will report this to the CEO. We'll put Apple Login on hold and talk about it again at the next meeting.

**PM**: And let’s finalize the payment method that was decided on July 16th. Is it true that only card payments were saved first due to a problem with the PG company contract?
**Dev_Lead**: Yes, as discussed on 7/16, real-time bank transfer was put on hold due to the PG review schedule as it took more time to complete the contract. Currently, only the credit card payment module integration is in progress by the development team. The development team will conduct a technical review on whether to support overseas PayPal payments, and make a final decision on whether to introduce it at a later meeting.

**PM**: Okay. Then, after completing the technical review for overseas payments, please hand it over to me, the PM. Lastly, how did we solidify the administrator page permission security requirements discussed on July 17th?
**Dev_Lead**: Due to security room audit requirements, the PM finally confirmed at the 7/17 meeting to apply Step 2 hierarchical division of authority into Super Admin and Sub Admin instead of simple administrator. The development team also built permissions based on this standard.
```

---

## 4. Codex Action and Prompt Guide

The learner copies and sends the instructions below to the Codex Client prompt input box and then clicks the **[Build]** button.

### Codex request prompt (instruction to extract decisions)
```text
Read the 'messenger-chat.md' conversation log in the project folder and create Decision Log and Pending Items for project management and tracking.

Please perform the analysis according to the conditions below.
1. For matters that have been decided, please fill out the ‘Decision Log’ table. The column must include ‘decision item’, ‘decision content’, ‘decision background/basis’, ‘decision date’, ‘person in charge/subject’, and ‘status’.
2. Organize matters that have not yet been decided and require follow-up review or are on hold in the ‘Pending Items’ table. In the column, please include ‘Pending items’, ‘Follow-up details’, ‘Person in charge’, and ‘Planned due date’.
3. Please do not write fictitious dates or decision-making entities that are not based on the conversation log text.
```

---

## 5. Example of results

Codex classifies decision attributes from unstructured colloquial conversations and produces structured tabular reports.

### Decision Log

| Decision Items | Decision Details | Decision-making background/basis | Decision date | Person in charge/subject | status |
|---|---|---|---|---|---|
| **Login Method** | Apply Google login (pending Apple login) | Apple login excluded from the first specifications due to the tight development schedule and delay in reviewing Apple developer account linkage | 2026-07-15 | PM | Done |
| **Payment Method** | Credit card payment priority applied | The first launch of real-time account transfer payments has been put on hold due to problems with the PG company contract and approval review schedule | 2026-07-16 | Development Team (Dev_Lead) | In progress |
| **Administrator Privileges** | Applying two-level hierarchical permissions (Super/Sub Admin) | Final approval and confirmation by PM to meet security audit requirements | 2026-07-17 | PM | Done |

### Pending Items

| Open Items | Follow-up details | Contact person | due date |
|---|---|---|---|
| **Apply Apple Login** | After putting the first launch on hold, review whether to reintroduce it at the next meeting | PM | Next meeting |
| **Availability of overseas payment support** | Technical review of PayPal integration and report of results | Development Team (Dev_Lead) | PM delivered after technical review |

---

## 6. AI utilization points

* **Understanding decision-making context**: Extracting logical consensus points between simple opinions (let's add Apple) and final decisions (let's just go with Google) from colloquial conversations.
* **Background/Rationale Encapsulation**: Archiving a textual summary of external factors (review schedule, security requirements) that influenced the decision.
* **Action Item Formalization**: List the person(s) responsible for pending matters and future action plans.

---

## 7. Learning points

The most important asset in a practical project is **"History and basis for decision making (Why)"**. If the background behind a decided policy is not recorded, the risks of previous decisions cannot be identified when change requests are made, leading to recurrence of errors and increased skepticism. By using AI to automatically extract decision logs from meeting and messenger records, you can prevent duplication of meetings and safely preserve the historical context of the project.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 30-40 minutes
* **Practical usability:** ★★★★★

---

## 8. Connection flow of three tasks

1. **Task 01 - Consistency Check**
   - Compare plans, screen designs, and meeting minutes to identify **contradictions and differences (inconsistencies)** between documents.
2. **Task 02 - Change Management**
   - Track the impact on lower-level products (screen definitions, API specifications) as requirements change and specify the change history.
3. **Task 03 - Decision Tracking**
   - Structuring the background of agreement and decision-making basis (Decision Log) of **meeting minutes that resulted in changes and tracking outstanding work**.

## 8. Connection flow of five Tasks/Missions

1. **Task 01 - Consistency Check**
   - Compare plans, screen designs, and meeting minutes to identify **contradictions and differences (inconsistencies)** between documents.
2. **Task 02 - Change Management**
   - Track the impact on lower-level products (screen definitions, API specifications) as requirements change and specify the change history.
3. **Task 03 - Decision Tracking**
   - Structuring the background of agreement and decision-making basis (Decision Log) of **meeting minutes that resulted in changes and tracking outstanding work**.
4. **Mission 1 (Task 06) - Impact Analysis**
   - Automatically derives **impact analysis report** by finding screens, APIs, DBs, and documents that are affected by the request to “add mobile phone authentication for membership registration”.
5. **Mission 2 (Task 07) - Writing a Project Issue Report**
   - Automatically reports **issue summary and priority report** by comprehensively analyzing distributed original data such as meeting minutes, change history, and issue list.

By learning these hands-on courses organically, students will acquire top-level planning capabilities to complete Project Requirements Lifecycle Management, the most difficult problem in real-world project management: “What is inconsistent ➔ How to change and control ➔ Why was that decision made ➔ What scope does it affect and what are the issues?”** with an AI inspection assistant.

---

# Mission 1 (Task 06). Impact Analysis

## 1. Story and practice background

During the project, the following requirement change requests were received from the customer.
> "To improve user experience and security, please add SMS authentication using mobile phone number when registering as a member."

On the surface, it may seem like a small modification that increases the size of a simple text field, but in reality, it requires comprehensive design modifications and DB schema updates, including the membership registration screen (UI), login/member authentication logic, User DB table structure, back-end authentication API specification, and even the administrator dashboard screen.

In this exercise, you will use Codex to analyze how a single change request has a chain effect (Ripple Effect) on various design outputs and documents at the bottom of the project, and learn techniques for automatically organizing the scope of modifications and specific actions to be taken at a glance into an impact report.

---

## 2. Learning objectives

* The propagation path and impact boundary of change requests can be analyzed.
* Sub-elements (screen UI, DB schema, API specifications) that require direct modification due to change can be logically identified.
* The revision history and impact map of related specification documents can be structured in a structured manner.
* Using an AI assistant, an Impact Analysis Report can be created efficiently within a short period of time.

---

## 3. Practice mission

The learner copies and sends the instructions below to the Codex Client prompt input box and then clicks the **[Build]** button.

> "If the mobile phone authentication function is added to membership registration, please find all affected screens, APIs, DBs, and documents and write an impact analysis report."

---

## 4. Example of results

Codex determines the impact on sub-architectures and documents based on the input changes and produces a structured impact map report as shown below.

| Change Request | Affected by | Impact | Action |
|---|---|---|---|
| **Mobile phone authentication added** | Membership registration screen | **High** | Screen planning and UI modification from email single sign-up form to mobile phone number and authentication number input form |
| **Mobile phone authentication added** | Login/Signup API | **Medium** | Add phone and verification_code variables to signup API payload and modify authentication logic |
| **Mobile phone authentication added** | User DB | **High** | Add mobile phone number (`phone`) and authentication verification (`is_verified`) columns to the Users table |
| **Mobile phone authentication added** | Administrator screen | **Low** | Add mobile phone number display item to administrator back office member information inquiry list |

---

## 5. AI utilization points

* **Automatic mapping of scope of influence**: Dependency inference from unstructured change requests to linked architecture elements such as DB, API, and UI.
* **Detailed design of action items**: Translate changes into detailed action item instructions that developers can take immediate action on.
* **Automatically generate impact reports**: Archiving complex architectural dependencies into intuitive Markdown tabular reports.

---

## 6. Learning points

The number one cause of IT project collapse is **"serial omission failure due to simple addition of requirements"**. When you say “let’s add an authentication form” during the planning or development process, a runtime error occurs if any of the DB columns or API Request parameters are missing. By deploying AI as an impact analysis tool, you can ensure development stability by immediately getting a list of all artifacts and action guidance that are affected by a change request.

---

### 💡 Training Difficulty

* **Difficulty:** ★★★☆☆ (Intermediate)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Mission 2 (Task 07). Write a project issue report (Project Issue Report)

## 1. Story and practice background

As the project schedule approaches launch, a large amount of team members' meeting minutes, development progress history, plan change requests, and action items that have not yet been resolved accumulate.

Each week, the PM (Project Manager) must compile a weekly status report by collecting the actual progress of the current project and the risks and issues that need to be urgently resolved. However, if people manually collate and organize numerous fragmented files and records, important delay issues are missed or a lot of manual resources are wasted.

In this exercise, you will learn how to use Codex's Workspace-wide context recognition function to immediately and comprehensively analyze fragmented data such as meeting minutes, change history, action items, and issue lists scattered within the project folder, and automatically build a **Project Issue Report** that summarizes the current status of the project by urgency and responsible subject.

---

## 2. Learning objectives

* Project progress can be logically summarized from multiple specification documents and records.
* You can clearly classify simple work details and urgent issues and risks that cause actual bottlenecks.
* Tasks that need to be resolved first can be prioritized based on urgency and impact.
* Using AI as an integrated analyst, you can automatically build highly readable weekly project issue reports.

---

## 3. Practice mission

The learner prepares a document containing the following virtual project information (meeting minutes, change history, Action Item, issue list, etc.) and then requests the Codex Client to write a report as follows.

> "Please write a project issue report summarizing the main issues of the current project and including urgency and priority."

---

## 4. Example of results

Codex accurately parses task status, stall points, and management policy open agendas across all Workspace resources to render priority-driven issue reports, such as those shown below.

| Category | Content | Priority | Responsible entity |
|---|---|---|---|
| **Complete** | Completed implementation of login and user authentication functions | - | Development Team (Dev_Lead) |
| **Progress** | Membership registration function (SMS authentication linkage) development and integration in progress | **Medium** | Development Team (Dev_Lead) |
| **Issue** | Payment API integration bottleneck due to delay in external PG company approval review schedule | **High** | PM |
| **Danger** | Schedule pressure due to addition of new business requirements (overseas Paypal payment) | **High** | Planning Team |
| **Pending** | Administrator back office access rights policy and Super/Sub detailed authorization criteria need to be confirmed | **Medium** | Planning Team |

---

## 5. AI utilization points

* **Multidimensional data integration analysis**: Integrated analysis of unstructured documents in different formats, such as meeting records, schedule data, and conversation records.
* **Automatic detection of issues and risks**: Identify project risk factors (schedule delays, additional requirements, etc.) from simple records.
* **Automatic priority mapping**: Categorizes key issues that PM must deal with first based on urgency and risk.
* **Automated weekly/regular report writing**: Generate structured status reporting data according to the report form.

---

## 6. Learning points

The biggest enemy of project management (PM) is **"invisible risk"**. If you cannot visualize risks such as “schedule delay” or “requirements to be added” buried in a pile of documents in time, golden time will be missed and development milestones will be broken. Using AI as an integrated analysis engine allows for proactive and transparent project control by providing immediate risk classification and issue reports based on all original work records created within the team.

---

### 💡 Training Difficulty

* **Difficulty:** ★★☆☆☆ (Beginner)
* **Estimated lab time:** 20-30 minutes
* **Practical usability:** ★★★★★

---

# Planning and design stage final training task

| Task | Topic | Core values ​​of utilizing AI |
|---|---|---|
| **Task 01** | Inconsistency detection | Comparison of contradictions between documents, precise auditing of policy and logic conflicts |
| **Task 02** | Missing detection | Define requirements and check for missing functions, policies, and exception handling |
| **Task 03** | Change Management | Track change history and preserve design consistency according to requirements revisions |
| **Task 04** | Document versioning | Cross-comparison of versions and synchronization of latest master document consistency |
| **Task 05** | Decision Tracking | Extracting agreement (why) and action items from meeting/messenger records |
| **Task 06** | Impact analysis | Analysis of chain architecture impact scope (UI, API, DB) according to new change requests |
| **Task 07** | Project issue report | Automation of risk classification and weekly issue reports through analysis of project original records |

These seven tasks are all designed based on **"Practical core tasks actually performed by PMs, planners, and developers during the IT project planning and design stage"**. Using Codex, you can perfectly master the **AI-based Requirements Lifecycle Management practical pipeline** by going beyond simple document review and linking change control, decision tracking, architecture impact analysis, and risk management report creation.

