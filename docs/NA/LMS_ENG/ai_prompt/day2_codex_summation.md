# Day 2. Codex Client-based discrepancy detection, change management, and decision tracking training summary

This summary is a summary of the training course that combines the actual project management (PM) core tasks of **Inconsistency Detection (Task 01)**, **Change Management (Task 02)**, and **Decision Tracking (Task 03)** with Codex Client's project workspace context inference function.

---

## 📌 Part 1. Why Codex Client for these three tasks?

### 1. Differences between ChatGPT and Codex Client (Multiple Documents & History Tracking)
* **General ChatGPT (Single Conversation)**: Compare or remember only fragmented information from one document at a time. When multiple files change and their relationships become entangled, it is easy to lose the previous context and leave each file contradictory or missing.
* **Codex Client (Workspace-based)**: Since it recognizes the project folder itself, it compares the consistency between multiple files at once, including before/after change documents (`requirements-before.md`, `requirements-after.md`), design documents (`screen-specification.md`), and API specifications (`api-specification.md`). It also parses completed decisions and pending matters from unstructured conversation logs logically and structurally.

### 2. Productivity when using AI as a reviewer
* **Software Engineering Prevention**: Fixing errors in the design phase is **up to 100 times** cheaper than fixing them once development and testing are complete.
* **Value as a Reviewer**: AI reduces communication errors and prevents rework at the source by checking everything in seconds for missing detailed policies that humans would easily miss, mismatched variable mapping (e.g., reversed evaluation subject), and non-reflection of deactivation rules.

---

## 📌 Part 2. Practice goals

### 1. Final result to be created today
* **Task 01**: **Inconsistency summary report table comparing contradictions between the three major planning documents**
* **Task 02**: **Change impact analysis table** that summarizes screen/API impact and actions according to change requirements
* **Task 03**: **Decision Log table** and **Pending Items table** extracted from meeting transcripts

### 2. Input / Output data pipeline

```text
===========================================================================================
[Task 01. Mismatch detection]
 - meeting minutes (meeting-notes.md)
 - Requirements (requirements.md) ──► (Codex Client) ──► [💾 Output: Discrepancy Summary Report Table]
 - screen definition (screen-specification.md)
-------------------------------------------------------------------------------------------
[Task 02. Change Management]
 - Before change requirements (before.md)
 - After change requirements (after.md) ──► (Codex Client) ──► [💾 Output: Change impact analysis table]
 - v1.0 screen definition & API specification
-------------------------------------------------------------------------------------------
[Task 03. Decision tracking]
 - Meeting and messenger chat log ──► (Codex Client) ──► [💾 Output: decision making log & pending table]
===========================================================================================
```

---

## 📌 Part 3. Follow along (Codex Client actual UI guide)

### STEP 1. Task 01 - Inconsistency detection
* **Action**: Create the files `meeting-notes.md`, `requirements.md`, and `screen-specification.md` in the `automation` project folder, then build them by executing the following command in the prompt window.
  > "Compare the three documents, organize the different content and missing items in a table, and indicate the parts that may affect development by priority."
* **Check**: Check whether membership withdrawal policy and star rating subject errors are detected in the generated results table.

### STEP 2. Task 02 - Change Management
* **Action**: Create the files `requirements-before.md`, `requirements-after.md`, `screen-specification-v2.md`, and `api-specification.md` in the folder, then build the command below in the prompt window.
  > "Analyze the changes in requirements-before.md and requirements-after.md, and write the parts that need to be modified in the v1.0 screen and API specification file in the form of an impact scope table."
* **Check**: Check whether Google social login, SMS authentication, and Admin permission addition are mapped to screen planning and API specifications, respectively, and action items are derived.

### STEP 3. Task 03 - Decision Tracking
* **Action**: Prepare the `messenger-chat.md` file in the folder, then build the command below in the prompt window.
  > "Analyze the meeting minutes, classify decisions, reasons for decisions, and pending items (Action Items) and write them in the Decision Log and Pending Items table."
* **Check**: Check whether the reason for Apple login suspension and credit card priority introduction are accurately recorded.

### Mission 1. Analysis of impact of changes in membership registration (Task 06)
* **Action**: Build the command below as requested to add cell phone authentication.
  > "If the mobile phone authentication function is added to membership registration, please find all affected screens, APIs, DBs, and documents and write an impact analysis report."
* **Check**: Modify signup screen (high), modify login API (medium), add DB column (high), add admin screen query item (low) Check that the action mapping is correctly derived into the summary report.

### Mission 2. Write project issue report (Task 07)
* **Action**: After preparing meeting minutes, change history, issue list, etc., build the command below.
  > "Please write a project issue report summarizing the main issues of the current project and including urgency and priority."
* **Check**: Check whether login (completed), membership registration (in progress/intermediate), payment API delay (issue/high/PM responsible), requirements to be changed (risk/high/planning team), and administrator authority policy need to be confirmed (unconfirmed/intermediate/planning team) are summarized by urgency and person in charge.

---

## 📌 Part 4. Principle of operation and significance

### 1. Semantic Diff
* Rather than simply comparing lines of code or text, this is the principle of interpreting changes in the business logic of planning requirements (e.g. email login ➔ Google social integration) and mapping them to subsystems.

### 2. Context encapsulation within unstructured conversations
* In the conversational flow, metadata such as 'reasoning context', 'status (pending/completed)', and 'person in charge' are precisely structured in the colloquial argument of "let's put it on hold due to the tight development schedule."

### 3. Connection flow synergy of five Tasks/Missions
```text
[What has changed?] (Task 01. Inconsistency discovery)
       │
       ▼
[Why has it changed and what is the background?] (Task 03. Decision tracking)
       │
       ▼
[What actually needs to be changed?] (Task 02. Change Management)
       │
       ▼
[What is the scope of impact on architecture?] (Mission 1. Impact analysis)
       │
       ▼
[Current progress and remaining risks?] (Mission 2. issue report)
```
This feedback loop becomes the core design control architecture responsible for maintaining deliverable consistency and preventing rework in actual IT project management.

---

## 📌 Part 5. Training Session Guide

### 💡 Instructional design specifications
* **Difficulty**: ★★★☆☆ (Intermediate)
* **Estimated practice time**: 1 hour 30 minutes to 2 hours (comprehensive practice)
* **Practical usability**: ★★★★★
* **Learner Questions/Discussion Topics**:
  1. “What is the cost difference between performing these three tasks immediately after the meeting and manually comparing them during or after development?”
  2. “Among the AI-derived impact scope analysis results, what is the performance of detecting minor fields (e.g. API Request Payload) that may be missed by actual developers?”

---

## 📌 Part 6. Planning and design stage final training task

| Task | Topic | AI utilization |
|---|---|---|
| Task 01 | Inconsistency detection | Compare and verify differences between documents |
| Task 02 | Missing detection | Check for missing functions, policies, and exceptions |
| Task 03 | Change Management | Change history management and impact analysis |
| Task 04 | Document versioning | Compare versions and manage up-to-date documents |
| Task 05 | Decision Tracking | Management of meeting decisions and action items |
| Task 06 | Impact analysis | Analysis of scope of impact based on change request |
| Task 07 | Project issue report | Automatic reporting of project status and issues |
