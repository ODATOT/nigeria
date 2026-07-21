# Day 03 Training Content Summary (Codex AI Workspace)

This summary is the final comprehensive summary guideline for instructors and participants conducting the Day 3 **"Technical Design (Data Normalization)"** training session. It ports meeting transcripts recorded in natural language into a physical data model (ERD), unifies confusing domain terms into a single standard dictionary, and includes key summaries of technical architecture decisions and a collaborative design pipeline that proactively explores potential inconsistent edge cases.

---

## 📌 Part 1. Introduction background and necessity

### 1. Bottleneck in technical design
* **Understanding error**: The data structure model and table design drawn by planners, designers, and developers for the same service screen plan are misaligned, ultimately resulting in missing data and consistency conflicts.
* **Vocabulary error**: Each subject uses different variable names for the same concept, such as 'Member/Customer/User/Member', resulting in a huge waste of terminology costs (communication costs) during development and testing.
* **Sharing error**: In response to rapid business changes, only the DB table schema is modified and the API or screen design is not synchronized, resulting in unexpected system paralysis.

### 2. ChatGPT vs Codex Client (Workspace-based)
| Comparison Items | ChatGPT (General Conversational AI) | Codex Client (Workspace-based AI) |
|---|---|---|
| **Context Awareness** | Only understands single file/text copied and pasted by user | Simultaneously recognize multiple dependency relationships of DDL schema, DFD, plan, and API specifications within a folder |
| **Terminology Standardization** | It is close to a one-time translation, making it impossible to maintain consistency across the entire code base of words | Consistent standard naming and column recommendation based on project-wide variable dictionary |
| **Scope of Impact Analysis** | Limited to fragmentary query error resolution | Reverse inference on API endpoint and UI component chain modification site due to change of 1 line of schema |

---

## 📌 Part 2. Summary of goals and results of today’s practice

### 1. Final result to be created today
* **Task 01. Resolving gaps in data structure understanding**: **Data structure definition and Mermaid ERD** derived from key properties from planning meeting minutes (output: `erd-schema.md`)
* **Task 02. Terminology standardization**: **Project standard terminology dictionary** that unifies Korean terms, English standard names, types, and recommended DB column names (output: `project-glossary.md`)
* **Task 03. Share the impact of change**: **Change Impact Analysis**, a list of API specifications and screen modification areas according to specification changes (introduction of reservation approval system) (Output: `change-impact-report.md`)
* **Mission 01. Design decision record**: **Design Decision Log** (output: `design-decision-log.md`), which logs the background of database normalization/denormalization agreement and the reason for rejecting alternatives.
* **Mission 02. Excavation of exception scenarios**: **Edge Case Analysis Report** responding to concurrent payment, referential integrity withdrawal, and distributed transaction rollback (Output: `edge-case-analysis.md`)

---

## 📌 Part 3. Follow along (Step-by-Step practice guide)

### STEP 1. Task 01 - Resolving gaps in understanding data structure
* **Action**: Create a `day3_meeting_notes.md` file in the folder, then build the command below in the prompt window.
  > "Please analyze the provided meeting minutes from a data structure perspective to derive key entities and relationships, and write a data structure definition and Mermaid ERD code."
* **Check**: In the generated results, check that the User, Expert, Reservation, Payment entities and their 1:N and 1:1 cardinality relationships are rendered correctly by Mermaid code.

### STEP 2. Task 02 - Terminology standardization
* **Action**: After preparing the fragmented planning/API documents in the project, build the command below.
  > "Please analyze terms such as 'Member/User/Customer/Member' and 'Counselor/Expert/Teacher/Counselor' that are used interchangeably throughout the project and create a dictionary of standard project terms in the form of a Markdown table."
* **Check**: Check whether the English standard abbreviations and recommended DB column names (`user_id`, `expert_id`) mapped to Korean standard words are collectively defined in dictionary form.

### STEP 3. Task 03 - Share the impact of change
* **Action**: Prepare the pre/post change spec with the reservation approval process added, then build the command below.
  > "Please fill out the API specifications, DB schema, screens, and change sharing reports that are affected as the reservation confirmation process has been changed to 'Awaiting Approval' status added and 'Payment after expert approval'."
* **Check**: Check whether the database Reservations table modification, API specification update target, and screen UI button/status window modification requirements are consistent.

### Mission 1. Design Decision Log
* **Action**: Prepare data history separation and DDL query resolution records and build the commands below.
  > "Please extract normalization and database structure design decisions from the meeting and create a Design Decision Log that includes decision items, background reasons, alternatives reviewed, approvers, and possible future changes."
* **Check**: Check whether the reservation cancellation history separation reason (DEC-003) and alternative rejection argument (Alternative 1: Table bloat and lock bottleneck risk) are archived.

### Mission 2. Edge Case Discovery
* **Action**: Provide the completed DB data model schema to Codex and build the command below.
  > "Please derive data consistency violation edge case exception scenarios that may occur in the currently defined User, Expert, Reservation, and Payment table structures and suggest improvement measures."
* **Check**: Check whether specific DB engineering improvement measures, such as simultaneous reservation duplicate application (simultaneity), loss of withdrawn member history (referential integrity), and payment network interruption (distributed transaction), and soft delete are proposed.

---

## 📌 Part 4. Principle of operation and significance

### 1. Schema Context Awareness
* Rather than a simple word search, the principle is to understand the logic of foreign key (FK) reference relationships and database-specific constraints and convert the natural language flow (e.g., reservation confirmation upon completion of approval) described by the planner into backend state transition rules and DDL query statements.

### 2. Meta-Terminology Clustering
* By semantically clustering fragmented synonyms in multiple documents, a single project master dictionary is derived and the dictionary is built in a self-learning format according to the English column rules for each domain.

### 3. Technical design synergy of five tasks/missions
```text
[Data Modeling Agreement] (Task 01. Structuring)
         │
         ▼
[Unification of domain terms] (Task 02. Standard dictionary)
         │
         ▼
[Design change impact tracking] (Task 03. Change control)
         │
         ▼
[Architecture Decision Logging] (Mission 01. Why Preservation)
         │
         ▼
[Consistency and edge case exception prevention] (Mission 02. Safety design)
```
This five-step collaboration loop blocks exceptions from the planning and design stage, providing an absolute advantage in gaining productivity and eliminating human errors for developers who begin actual coding work.

---

## 📌 Part 5. Training Session Guide

### 💡 Instructional design specifications
* **Difficulty**: ★★★★☆ (Advanced – includes database and transaction concepts)
* **Estimated practice time**: 1 hour 30 minutes to 2 hours (comprehensive practice)
* **Practical usability**: ★★★★★
* **Learner Questions/Discussion Topics**:
  1. “What are the performance disadvantages of selecting Soft Delete (logical deletion) instead of Hard Delete when processing membership withdrawal, and what is the index/DB partitioning strategy that can compensate for this?”
  2. “When a project progresses to mid-way without creating a terminology standardization dictionary, what impact does the ‘Terminology Debt’ cost incurred within the development team have on the actual schedule?”

---

## 📌 Part 6. Planning and design stage final training task

| Task | Topic | AI utilization |
|---|---|---|
| Task 01 | Addressing gaps in understanding data structures | Convert meeting content into data structures and organize entities and relationships |
| Task 02 | Terminology standardization | Create a standard terminology dictionary by analyzing terms throughout the project |
| Task 03 | Share the impact of change | Analyze the impact of design changes and track related documents and features |
| Mission 01 | Design decision history | Manage design basis and change history by creating decision log |
| Mission 02 | Excavating Exception Scenarios | Analyze missing edge cases and derive risk factors and improvement plans |
