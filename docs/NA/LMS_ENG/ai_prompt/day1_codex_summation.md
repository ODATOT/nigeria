# Day 1. Codex Client-based requirements definition training teaching summary

This summary goes beyond general theoretical education and is a practical guide that combines **Project-Based Learning (PBL)** and **Codex Client** that follow actual planning and development workflows. 

---

## 📌 Part 1. Why use Codex Client?

### 1. Critical difference between ChatGPT and Codex Client

The general ChatGPT web chat window and Codex Client on a multi-file project basis differ in their approach when designing requirements.

| Comparison Items | General ChatGPT (web browser) | Codex Client (Workspace-based) |
|---|---|---|
| **Task Awareness Scope** | Recognizes only one-shot text entered in the current input window | Recognize all files in the project folder (Workspace) |
| **File Control Method** | Manually copy and paste the result code displayed on the screen | AI directly creates and partially modifies designated markdown files |
| **Multiple File Inference** | Manual upload is required each time to modify linkage of previous files | Simultaneous inference of contents of other linked files when changing one plan |

### 2. Workspace (project) concept
* **Local folder = Project = Workspace**.
* When several markdown files (`meeting-notes.md`, `functional-requirements.md`, etc.) required for specifications exist in one folder, this refers to a unit that connects the entire folder to AI and uses it as **Context storage**.

---

## 📌 Part 2. Practice goals

### 1. Final result to be created today
* **Integrated requirements definition (`requirements-specification.md`)**: A formal specification that has been verified and approved starting from the original meeting minutes.
* **Gmail plugin sending email**: Completed using the Gmail API plugin to send an actual email to stakeholders (representatives, etc.) requesting a final decision on an ambiguous exception.

### 2. Input / Output sequence connectivity

```text
[📥 Input: Original transcript] ──► (Codex Client) ──► [💾 Output: Key summary memo]
                                                    │
                                                    ▼
[📥 Input: Summary memo] ──► (Codex Client) ──► [💾 Output: Object classification & Requirements Definition]
                                                    │
                                                    ▼
[📥 Input: Requirements table] ──► (Codex Client) ──► [💾 Output: Scenario detailing & planning questionnaire]
                                                    │
                                                    ▼
[📥 Input: Specification files] ──► (Codex Client + Gmail Plugin) ──► [💾 Output: Integrated specifications & Gmail sending done]
```

### 3. Step-by-step detailed data pipeline specifications

#### 🔧 Preparation stage. Local work folder and AI linkage settings
* **Workspace (Input)**: Empty folder `automation/` on the learner's computer desktop.
* **Integration result (Output)**: `automation/` project integration completed within Codex Client
* **Summary Description**: The user establishes a dedicated directory locally and opens the corresponding path in the Codex AI environment to secure a channel for writing and reading documents.
* **Performance Prompt**: Create an `automation` folder on the local desktop and run Codex Client.

#### Step 0. Deriving key summaries from detailed conversation transcripts (preprocessing)
* **Step input (Input)**: `meeting-notes-raw.md` (Ping-pong conversation log mixed with conversations that took place during the meeting)
* **Step Output**: `meeting-notes.md` (15-line summary note with unnecessary context removed)
* **Summary Description**: To reduce analysis noise, key requirements are extracted from unstructured meeting minutes and preprocessed into a condensed planning summary.
* **Performance prompt**: Read the original meeting minutes of `meeting-notes-raw.md, remove unnecessary conversation context and context between speakers, and write information about service users, functional requirements, system policies, and pending reservations in the form of a compact, unstructured summary memo of approximately 15 lines. Please do not arbitrarily add fictitious content that is not in the original text.

#### Step 1. Summary Planning Memo Requirements Analysis
* **Step Input**: `meeting-notes.md`
* **Step Output**: List of classified planning objects (user roles, feature candidates, business policies, pending decisions)
* **Summary Description**: Based on the unstructured text summary memo, planning elements are separated/structured according to four characteristics (user, function, policy, and undecided).
* **Performance prompt**: Read `meeting-notes.md and identify the following. 1. Service users 2. Functions performed by users 3. Functions performed by the system 4. Business rules 5. What has not yet been decided. Do not add information that is not in the meeting notes and mark unclear information separately.’

#### Step 2. Functional requirements statement definition (FR table)
* **Stage Input**: List of classified planning objects (Stage 1 output)
* **Step Output**: `functional-requirements.md` (testable specification table structure requirements statement)
* **Summary Description**: Functions split into objects are written in function specification sentences in accordance with the strict testing rule that `[user/system] must [operate] under [specific conditions]`.
* **Execution prompt**: `Write the feature candidates extracted in step 1 as functional requirements. Assign requirement IDs in order starting from FR-001, clearly write down only one function and user for one requirement, exclude ambiguous expressions, and output as a Markdown table.`

#### Step 3. Complementary scenarios (normal and exception flows)
* **Step Input**: `functional-requirements.md` draft table
* **Step Output**: Detailed `functional-requirements.md` with normal/exception flow and validation criteria.
* **Summary Description**: In addition to the normal flow of the main function, supplement the process specification for handling abnormal exceptions that may occur such as system failure/data duplication/payment failure.
* **Execution Prompt**: Add normal flow and exception flow to each requirement in `functional-requirements.md. Normal flows are written step by step from start to completion, and exception flows are reviewed for failure, duplication, and no data situations, and do not make arbitrary decisions, but specify confirmation as necessary.`

#### Step 4. Undecided Planning Questionnaire Extraction
* **Step Input**: ‘Additional confirmation required’ item in the planning specification
* **Step Output**: `open-questions.md` (formal decision request with question ID, priority, scope of influence, etc.)
* **Summary Description**: Before starting development, we identify and stipulate issues that must be coordinated with stakeholders and operate a plan-revision feedback loop.
* **Action Prompt**: `Please review the current requirements document and look for any inconclusive or ambiguous content. Write each item in the form of a question that planners can check with stakeholders, and create a table with related ID, reason for decision, influence function, and priority.`

#### Step 5. Consolidate documents and send to Gmail (plugin)
* **Step Input**: `meeting-notes.md`, `functional-requirements.md`, `open-questions.md` and Gmail plugin integration
* **Step Output**: `requirements-specification.md` and email sent completed
* **Summary Description**: Merge scattered Markdown specifications into one approval specification file, and use the Gmail plugin to automatically send planning approval report emails to decision makers.
* **Performance prompt**: `Use the Gmail plugin to summarize the content of requirements-specification.md that has just been verified and the pending matters in open-questions.md and send a planning approval request email to [decision maker email address].`

---

## 📌 Part 3. Follow along (Codex Client actual UI guide)

Learners prepare an empty folder on the desktop on the Codex Client actual UI screen and complete the exercise by **starting with the basic operation of creating a sample meeting minutes file**.

### STEP 1. Create and select project folder
* **Action**: Create an empty **`automation`** folder on the desktop, and click the `automation` folder in the **`project`** list window on the left side of Codex Client to connect to it.
* **Status**: The current folder is in a clean, empty state with no files.

### STEP 2. Instructions for creating sample files for practice (initial creation)
* **Action**: Click the prompt input box at the bottom, paste the instructions below, and press the **[Build]** button on the right.
  > "Create a meeting-notes-raw.md file in the project folder and write the first kick-off meeting minutes conversation below. [Content: The CEO proposes a meeting to create an online expert consultation service, the planner (PM) asks about membership registration, and upon completion of payment, the reservation is confirmed and the cancellation policy is decided to be put on hold.]"
* **Result**: The `meeting-notes-raw.md` file is created and saved for the first time inside the left explorer.

### STEP 3. Enter Prompt (summary preprocessing request)
* **Action**: Now that the source file is ready, write summary processing instructions in the prompt input field.
  > "Read meeting-notes-raw.md and create meeting-notes.md, a summary of key planning elements."

### STEP 4. Run Codex (build summary file)
* **Action**: Click the [Build] button on the right side of the input window.
* **AI operation**: AI automatically finds and reads `meeting-notes-raw.md` in the folder, then creates a refined key summary file `meeting-notes.md` suitable for planning analysis and saves it in the project folder.

### STEP 5. Install Gmail plugin and send mail
* **action**:
  1. Install the **`Gmail` plugin** from the plugin store on the top right of Codex Client and link your Google account with OAuth.
  2. Enter the command below in the prompt window to actually send an email summarizing the integration requirements and planning questionnaire.
     > "Use the Gmail plugin to summarize the content of requirements-specification.md that has just been verified and the pending matters in open-questions.md, and immediately send a request for planning approval to [decision maker's email]."
* **Confirmation**: Final check whether the email has actually been sent in the ‘Sent Mailbox’ of your email.

---

## 📌 Part 4. Why did it become like this? (Principle of operation and significance)

### 1. Codex Client’s file navigation and plugin integration mechanism
* Codex Client caches and monitors the file structure of the directory from the moment the user opens the project folder. In addition, it works closely with external services, such as directly calling the linked Gmail plugin API to create and send emails on behalf of others.

### 2. Why are files connected and created organically?
* Steps 2 (`functional-requirements.md`) and 4 (`open-questions.md`), created by analyzing step 1 (`meeting-notes.md`), are looking at the same service object. 
* When the file names are clear and the contents are related to each other, Codex Client can identify dependencies between them, merge documents without data conflicts, and provide linting warnings (ambiguity detection).

### 3. Scalability to the next level of design
* The specification files built today are not just simple documents. In the next process, if you input these markdown specifications into Codex Client, they become powerful source data that AI automatically extracts **DB design document (ERD), back-end API specification, and front-end wireframe screen design code**.

---

## 📌 Part 5. Mission (PBL task)

### Mission Overview: Add new business policies and automate sending with Gmail plugin
* **Assignment**: Create a situation where the representative talks about additional requirements during the meeting.
  1. Manually add the virtual additional meeting contents below to the bottom of the `meeting-notes-raw.md` document.
     > **Representative**: "Oh, by the way. We also need a membership withdrawal function. When you cancel, all scheduled consultations should be automatically canceled and a refund issued."
  2. Instruct Codex Client to re-process and analyze so that the `FR-005 Membership Cancellation` requirement and exception flow (automatic reservation cancellation upon withdrawal) are added to `functional-requirements.md`.
  3. By executing the **Gmail plugin** sending function set up earlier, a prompt is sent to immediately and automatically send an approval request email summarizing the final updated withdrawal policy and planning open questionnaire to the main email address, and then check the mailbox to see if the delivery has actually been completed.
