# Codex-based requirements definition training mission (level 0 to level 5)

This training mission is designed to allow non-majors/non-developers to practice step by step the entire process from planning summary, requirements definition, document specification, planning questionnaire construction and final document integration & sending actual report mail using Gmail plugin by linking Codex/ChatGPT AI based on actual project collaboration scenarios.

---

## Step 0. Deriving key summaries from detailed conversation transcripts (preprocessing)

### Mission status

Original minutes from planning meetings are too long for immediate analysis of requirements due to unnecessary chatter, context, and conversational ping-pong between speakers.
Learners should use Codex as a preprocessing tool to derive planning memos from meeting minutes that briefly summarize only key business requirements.

### Step input (Input)
* Original minutes of the first meeting in the form of an irregular ping-pong conversation ([meeting-notes-raw.md](file:///Users/hojunlee/workspace/ODA_AI_SW/NA/LMS/ai_prompt/meeting-notes-raw.md))

#### Original transcript of the first meeting (`meeting-notes-raw.md`)
```markdown
# First kick-off meeting minutes to establish expert consultation service

**Date**: 2026-07-10 14:00 - 15:30
**Attendees**: CEO, planner (PM), developer (Dev), designer (Designer)

---

**Representative**: Hello everyone. Today’s meeting is to discuss the basic requirements and establish direction for our newly launched “Online Expert Consultation Service.” The key is the process where users come to our platform, find experts in various fields, make reservations for consultations, and complete payment smoothly.

**planning person**: Yes, CEO. Let’s start our discussion with the basic sign-up process for the service. Does the structure require users to sign up to use the service?

**Representative**: Yes, that is correct. Users must first sign up to be able to smoothly use functions such as expert search or reservation. Non-member status only allows for simple browsing.

**Designer**: After signing up, you will be searching for experts. What are your thoughts on the expert profile page and classification criteria?

**Representative**: Experts must first be categorized by field. For example, there might be categories such as IT consulting, legal consulting, and design coaching. Users should be able to quickly find the expert they want by selecting a category or directly entering a search term.

**Designer**: Then, a list of experts will appear in the search results, and you will then go to the details page and select a schedule. How do I choose the date and time?

**Representative**: Yes, when the user selects a specific expert, the schedule for consultation with that expert should be displayed in the form of a calendar or timeline. Users must be able to freely select the date and time they wish to receive consultation and apply for a reservation.

**Developer**: How does the payment process work immediately after requesting a reservation? Does payment have to be made immediately upon requesting a reservation to confirm the reservation?

**Representative**: The final reservation must move to “confirmed” status once payment has been completed. If payment fails due to exceeding the PG company's limit or for other reasons, the reservation should not be processed as done, but should be stuck in waiting or cancellation status.

**Developer**: This is a business rule that states that when payment fails, the reservation should not be created or the lock should be released. Where can professionals check their scheduled schedules?

**Representative**: Experts must have an expert-only dashboard within our system, where they can monitor and manage their reservation request details and confirmed schedules in real time.

**planning person**: Signing up as an expert will be different from regular signing up. Is there a separate authentication or approval process required? You can't have just anyone act as an expert.

**Representative**: That's a good point. Experts cannot work immediately after applying for membership, but the site administrator must review the submitted documents and qualifications and "approve" them before they can be exposed to the expert list and participate in the reservation system, so we will set the administrator approval policy as required.

**planner**: When a reservation is made, a notification should be sent to the user or expert to improve development convenience and usability. Which notification channel do you prefer?

**Representative**: Notifications must be sent unconditionally. We need to notify you when your reservation is confirmed or cancelled. However, I think we need to consider development resources and cost issues more closely as to whether to send notifications by email or text message to a mobile phone. Let's not confirm this part yet.

**Developer**: Do we need to set rules for cancellation fees and refunds now?

**Representative**: The cancellation fee policy is also something that requires legal review and consultation with the marketing department. It's difficult to decide today, so let's leave this as a pending matter that hasn't been decided yet. It will be confirmed at the second meeting later.

**planner**: Okay. I will roughly compile the policies and pending matters decided today and organize them into a summary memo of the pre-processing meeting for the draft specification.
```

### Step output (Output)
* Key summary notes file ([meeting-notes.md](file:///Users/hojunlee/workspace/ODA_AI_SW/NA/LMS/ai_prompt/meeting-notes.md))

### Learning Objectives

* Pick out key requirements requirements (user roles, feature candidates, constraints, pending issues) from the dialog.
* Strip away the clutter of dialogue and condense it into a refined, unstructured summary of 15 lines or less.

### 🛠️ Detailed guide to follow in practice
1. **Obtain Original Meeting Notes**: Download the provided example transcript `meeting-notes-raw.md` and place it in your work folder or create the file contents.
2. **Preprocessing instructions**: Copy the **Codex request example** prompt below and send it to the AI dialog window.
3. **Save results**: Copy the refined summary note text returned by AI and save it as a `meeting-notes.md` file. This file will be the input data for the next step 1.

### Codex request example (prompt)

```text
Read the original meeting minutes from meeting-notes-raw.md, remove unnecessary conversation context and context between speakers, and
Write down information about service users, functional requirements, system policies, and pending matters in the form of a compact, unstructured summary memo of approximately 15 lines.
Please do not arbitrarily add fictitious content that is not in the original text.
```

### Example results (refined copy: `meeting-notes.md`)

```markdown
We are planning to create an online expert consultation service.

Users can search for experts after signing up.
Experts are classified by field.
Users can select the consultation date and time.
Once payment is completed, the reservation is confirmed.
If payment fails, the reservation cannot be completed.

Experts can confirm their reservations.
Administrators can approve expert membership.

A notification should be sent when the reservation is completed.
It has not yet been decided whether notifications will be sent by email or text.
The cancellation fee policy has not yet been determined.
```

---

## Step 1. Find key takeaways from meeting notes

### Mission status

It is time to analyze the level 0 planning summary notes (`meeting-notes.md`) refined from meeting conversations between representatives, planners, developers, etc.
Based on this summary, learners must accurately categorize the main objects of the service (user roles, functions, business rules, and policies).

### Step input (Input)
* Summary planning memo file refined in step 0 ([meeting-notes.md](file:///Users/hojunlee/workspace/ODA_AI_SW/NA/LMS/ai_prompt/meeting-notes.md))

### Step output (Output)
* List of service user roles
* Feature candidate list
* List of business rules
* List of pending matters

### Learning Objectives

* Distinguish between users, functions, and policies in meeting notes.
* Distinguish between confirmed and undecided content.
* Codex is instructed not to arbitrarily add content that is not in the original text.

### 🛠️ Detailed guide to follow in practice
1. **Instruct AI**: Continue the previous Step 0 conversation by sending the **Codex Request Example** prompt below.
2. **Classification result analysis**: Check whether the users analyzed by AI are divided into three role groups (Customer, Expert, Admin).
3. **Verification**: Check whether any functions not specified in the meeting notes were introduced into the classification results.

### Codex request example

```text
Read meeting-notes.md and categorize the following contents.

1. Service user
2. Functions performed by the user
3. Functions performed by the system
4. Business rules
5. Matters not yet decided

Do not add anything that is not in the meeting notes.
Please indicate unclear information separately.

Don't edit the file yet, just show the analysis results.
```

### Learner Checklist

* Are users classified into Customer, Expert, and Admin?
* Has the relationship between payment success and reservation confirmation been confirmed?
* Are notification methods and cancellation policies separated as pending matters?
* Didn't Codex add a feature that wasn't in the meeting notes?

---

## Step 2. Creating functional requirements statements

### Mission status

It is time to use the functional candidates classified in step 1 to write a functional requirement statement that conforms to the actual specification structure.
It is converted into a standardized sentence structure that all collaborators, such as developers, planners, and QA, can clearly and equally understand.

### Step input (Input)
* Stage 1 output (user role list, feature candidate list, business rule list, pending decision list)

### Step output (Output)
* `functional-requirements.md` (FR-001 ~ FR-004 standardized functional requirements definition table)

### Learning Objectives

* Write the function as a verifiable requirement statement.
* A requirement includes only one feature.
* Specify requirements including users, conditions, and actions.

### Criteria for writing requirements

```text
[user or system]
Under [specific conditions]
Must be able to perform [function or operation].
```

### 🛠️ Detailed guide to follow in practice
1. **Prepare the template**: Create a `functional-requirements.md` file in your workspace and paste the table format of the **Learner Mission** below.
2. **AI Structured Request**: Continuing from the previous conversation, enter the **Codex Request Example** prompt below.
3. **Specification and Save**: Copy the derived specification table, overwrite it in the created `functional-requirements.md` file, and save it.

### Learner Mission (Template)

```markdown
| Requirement ID | user | Function name | Requirements Description |
|---|---|---|---|
| FR-001 | Customer | Sign up | |
| FR-002 | Customer | expert inquiry | |
| FR-003 | Customer | Select consultation time | |
| FR-004 | System | Reservation confirmed | |
```

### Codex request example

```text
Write the feature candidates extracted in step 1 as functional requirements.

Apply the following rules:

1. Requirement IDs are assigned in order starting from FR-001.
2. Write only one function for one requirement.
3. Write clearly who the user is.
4. Includes the conditions under which the function is executed.
5. Write sentences that can be tested.
6. Do not use ambiguous expressions such as “conveniently,” “appropriately,” or “quickly.”
7. Do not add anything that is not in the meeting notes.

Write the results in a Markdown table.
```

### Example results

```markdown
| Requirement ID | user | Function name | Requirements Description |
|---|---|---|---|
| FR-001 | Customer | Sign up | Users must be able to create an account by entering the information required to sign up. |
| FR-002 | Customer | expert inquiry | Users must be able to view a list of experts in each field from their logged in status. |
| FR-003 | Customer | Select consultation time | The user must be able to view and select the date and time available for consultation from the status of the expert selected. |
| FR-004 | System | Reservation confirmed | The system must confirm a consultation appointment only when payment has been approved. |
```

### Learner Checklist

* Aren’t multiple functions mixed in one requirement?
* Are users clearly defined?
* Are execution conditions included?
* Is this a testable sentence?
* Is there any basis for the original meeting notes?

---

## Step 3. Adding normal and exception flows

### Mission status

Although the functional specification is standardized, in the actual operating environment, countless abnormalities such as missing data, failure to call external modules, and time duplication occur.
Learners must improve the completeness of the specification by complementing the normal flow of the main function as well as the abnormal exception flow.

### Step input (Input)
* Step 2 output (`functional-requirements.md` table)

### Step output (Output)
* Requirements specification supplemented with scenarios and exception policies (normal flow, exception flow, verification criteria, list of policies requiring additional confirmation)

### Learning Objectives

* Define normal user flow step by step.
* Find conditions that cause failure or exceptions.
* Defines how the system should behave in exception situations.

### 🛠️ Detailed guide to follow in practice
1. **Target confirmation**: Among the requirements table, select the payment-related business flow ‘FR-004 Reservation Confirmation’ as the target of intensive analysis.
2. **Enter Prompt**: Following the conversation, send the **Codex Request Example** prompt below.
3. **Design update**: Copy the normal/exception flows and verification criteria returned by AI and add and supplement them to the `functional-requirements.md` file.

### Learner Mission (Format Template)

```markdown
### FR-004 Reservation confirmed

- User:
- Prerequisites:
- Normal flow:
- Exception flow:
- Verification criteria:
```

### Codex request example

```text
For each requirement in functional-requirements.md
Add normal flow and exception flow.

Please apply the following criteria.

1. The normal flow is written step by step from the user’s initial action to the completion result.
2. The exception flow reviews failure, duplicate, no data, and unauthorized situations.
3. Do not arbitrarily decide on exception policies that cannot be confirmed in the meeting notes.
4. Contents that require policy decisions are marked as “confirmation required.”
5. Write at least one verification criterion for each requirement.
```

### Example results

```markdown
### FR-004 Reservation confirmed

- user: System
- Prerequisite: The status of the user selecting a consultation time with an expert and requesting payment.
- Normal flow:
  1. The system creates a payment request.
  2. The external payment system approves the payment.
  3. The system confirms the consultation reservation.
  4. The system displays reservation done status to the user.

- Exception flow:
  1. If payment fails, the reservation will not be confirmed.
  2. If the consultation time is reserved for another user before payment is approved, the reservation will be stopped.
  3. If the payment is approved but the reservation fails to be saved, the processing policy requires additional confirmation.

- Verification criteria:
  - In payment failure status, a confirmed reservation must not be created.
```

---

## Step 4. Create pending decisions and planning questions

### Mission status

In the process of filling out the requirements specification, policies that have not yet been established, such as 'notification sending method' and 'cancellation fee refund policy' were confirmed.
To ensure clear communication with decision-makers and relevant departments before development begins, these pending matters are drawn up in a structured planning questionnaire format.

### Step input (Input)
* Among the 3rd stage outputs, ‘List of policies and pending matters requiring additional confirmation’

### Step output (Output)
* `open-questions.md` (question ID, associated requirement ID, question to check, reason for decision, impact function, priority, status table)

### Learning Objectives

* Separate confirmed requirements from undetermined requirements.
* Write questions that must be checked before development.
* Identify the functions affected when a question is not resolved.

### 🛠️ Detailed guide to follow in practice
1. **Prepare questions file**: Create an `open-questions.md` file in your working folder.
2. **Question extraction request**: Enter the **Codex request example** prompt below in the dialog window to print the decision list table.
3. **Save contents**: Copy and paste the created question table into the `open-questions.md` file and save it.

### Codex request example

```text
By reviewing the current requirements document
Find unconfirmed or ambiguous content.

Each item can be confirmed by the planner to stakeholders.
Please write in question form.

Please include the following items:

1. Question ID
2. Related Requirement ID
3. Questions to ask
4. Why this decision is necessary
5. Functions affected when decisions are not made
6. Priorities
7. Status

Please don't make up answers to questions arbitrarily.
```

### Example results

```markdown
| Question ID | Related Requirements | Questions to check | Why a decision is needed | Impact function | Priority | status |
|---|---|---|---|---|---|---|
| Q-001 | FR-005 | How many hours before the start of the consultation can the user cancel the reservation? | This is necessary to determine whether cancellation is possible. | Reservation cancellation, refund | Must | Open |
| Q-002 | FR-005 | How are fees and refund rates applied when canceling a reservation? | A standard for calculating the refund amount is needed. | Payment cancellation, refund | Must | Open |
| Q-003 | FR-006 | Which method is used for reservation done notifications: email, SMS, or app notification? | External notification service and development scope must be determined. | Send notification | Should | Open |
| Q-004 | FR-004 | If the reservation fails to be saved after payment approval, which method is applied: automatic cancellation or reprocessing? | Discrepancies between payment and reservation status must be prevented. | Payment, Reservation confirmed | Must | Open |
```

---

## Step 5. Create requirements workbook and share via email (Gmail plugin)

### Mission status

Even non-development planners or entrepreneurs should be able to compile and validate requirements definitions and connect external collaboration tools and plug-ins without the help of coding tools.
Learners directly install and link the **Gmail plugin** of the Codex Client and send a report email containing the contents of the final specification document with AI self-linting to the decision maker through actual Gmail using only AI prompt instructions.

### Step input (Input)
* `meeting-notes.md` (stage 0 result)
* `functional-requirements.md` (step 3 result)
* `open-questions.md` (step 4 result)
* **Gmail Plugin** integration authentication within Codex Client

### Step output (Output)
* `requirements-specification.md` (integrated requirements definition)
* Final report and approval request email sent through Gmail API plugin completed

### Learning Objectives

* Perform the AI Client external extension plugin (Gmail) installation and authentication steps.
* Final integrated verification of documents through AI’s own linting loop.
* Give AI an email sending prompt to automatically send Gmail to the actual recipient.

### 🛠️ Detailed guide to follow in practice
1. **Gmail plugin integration**:
   * Go to the settings icon at the top right of Codex Client or the plugin store (Plugins).
   * Search for the `Gmail` plugin and click the **[Install]** button.
   * After installation is complete, when the Google Login OAuth pop-up window opens, log in with your Google account and **approve permission to send Gmail mail**.
2. **Document merging and primary verification**: Send the prompt for **Learner Mission 1** below to the previous dialog to request creation of an integrated requirements definition `requirements-specification.md` and save the result.
3. **Error Debugging**: When the AI shows the verification feedback list, it corrects the document by indicating an ambiguity warning (`WARNING`) or omission (`ERROR`) on the prompt and builds it to a final pass (`PASS`) state.
4. **Send Gmail plug-in command**: Send the **Learner Mission 2 (Send Gmail plug-in)** prompt below to the AI ​​and instruct the AI ​​to run the Gmail plug-in command.
5. **Confirm receipt of email**: Check whether the AI-standardized planning report email has been successfully sent to the designated recipient's mailbox (or your own sent mailbox).

### Project file configuration

```text
requirements-project/
├── meeting-notes.md
├── functional-requirements.md
├── open-questions.md
└── requirements-specification.md
```

### Learner Mission 1 (Integration and AI Verification)

```text
Read the following three files and create a requirements-specification.md file, which is a requirements definition that merges them.

-meeting-notes.md
- functional-requirements.md
- open-questions.md

At the same time, analyze errors in the requirements document based on the six rules below.

[Verification Rules]
1. Requirement ID duplicate?
2. Is the requirement ID missing?
3. Is the user role missing?
4. Whether normal and exception flows are missing
5. Whether verification criteria are omitted
6. Whether to use ambiguous expressions (ambiguous words: conveniently, quickly, as necessary, appropriately, normally)

The error verification results are displayed at the beginning of the output window in the format below, and the contents of the requirements-specification.md file are combined and displayed below.

[Output Format]
PASS: No duplicate requirement IDs
ERROR: FR-004 Verification criteria missing
WARNING: Use of ambiguous expression “conveniently” in FR-007
```

### Learner Mission 2 (Gmail Plugin Send Prompt)

```text
Using the Gmail plugin, the contents of the requirements-specification.md file you just verified and
Send an email according to the conditions below based on the list of open questions in open-questions.md.

- Recipient (To): [Enter the email address of the representative or decision maker who will receive feedback here]
- Email subject: [Approval Request] Review of expert consultation service requirements definition and coordination of undetermined policies
- Body structure:
  - Report on completion of integrated verification of planning documents
  - Major open questions requiring urgent planning decisions (Summary tips for Q-001 ~ Q-004)
  - Feedback response deadline information
```

### Example of email sent

```text
Title: [Approval Request] Review of expert consultation service requirements specification and coordination of undetermined policies

Hello, CEO, this is planning team OOO.
We have completed the creation of the Requirements Definition (requirements-specification.md) for the new ‘Online Expert Consultation Service’ and are sharing it with you.

When writing this document, we ran an AI linter to self-filter ambiguous requirements and supplement normal/exceptional flows. However, there are major pending issues that require the CEO's final decision before full-scale development begins, so we are sharing them below.

[Main decision]
1. Q-001: How many hours before the start of the consultation can the user cancel the reservation?
2. Q-002: How do fees and refund rates apply when canceling a reservation?
3. Q-003: What would you introduce as a reservation notification channel? (SMS/Email)

You may be busy, but these are key issues that directly affect the scope of refunds and external module integration, so we would appreciate your feedback by next Tuesday (7/17).

Please refer to the attached file (requirements-specification.md) for detailed documents.
Thank you.
```

---

## Practice task 1. Pet home care and matching service (Mission 1)

### Mission status

A planning meeting was held for a platform that connects pet owners (customers) with professional pet sitters.
Based on the requirements specification and AI verification process learned in steps 1 to 5, the learner must clearly derive user roles (guardian, pet sitter, manager), core functions, and exception flows (response to payment timeout, cancellation, and pet sitter no-show) from the meeting minutes summary below and create a completed document through AI linting inspection.

### Step input (Input)
* `pet-care-meeting-notes.md` (Summary of pet care service meeting minutes)

### Step output (Output)
* `pet-care-requirements.md` (Functional and Exception Flow Requirements Definition)
* Email approval request for undetermined policy coordination

### Original transcript of the first meeting (`pet-care-meeting-notes.md`)

```markdown
# Pet home care and matching service 1st planning meeting minutes

**Date**: 2026-07-12 10:00 - 11:30
**Attendees**: PM (planning person), Dev (developer), CEO (table)

---

**CEO**: The essence of our service is to match trustworthy pet sitters and pet owners. Identity verification and real-time monitoring are key so that guardians can trust and entrust their care.

**PM**: Yes, that's right. First of all, when signing up, users must be categorized as guardians (general members) and pet sitters (professional members). After registering a pet sitter's profile, the administrator must review and 'approve' their qualifications and identity in order to be exposed on the list.

**Dev**: How is payment processed after applying for pet sitter matching?
**CEO**: If the guardian selects the desired schedule and pet sitter and applies, the pet sitter must 'accept' the request to open the payment window. If payment is not made within 1 hour of pet sitter acceptance, the application will be automatically cancelled.
**Dev**: If payment is successful, the reservation is confirmed and can I change the real-time care status?
**PM**: That's right. A push notification should be sent to the guardian whenever the pet sitter visits on the day of reservation and changes the real-time status, such as 'starting care', 'on a walk', 'meal payment', 'end of care', etc.

**Dev**: How do I set up a cancellation policy?
**CEO**: Let's set a 100% refund up to 24 hours before the start of the service, a 50% penalty for cancellation within 24 hours to 2 hours before, and no refund for cancellation less than 2 hours. If a pet sitter no-shows, a 100% refund and 200% point compensation must be provided to the guardian, and a replacement pet sitter recommendation process must be initiated. This alternative referral stream requires specific policy coordination.
```

### 🛠️ Self-practice guide
1. **Create meeting notes**: Create a `pet-care-meeting-notes.md` file in the work folder and save the original contents of the first meeting minutes above.
2. **Document your requirements**: Copy the **Recommended AI Practice Prompt** below and send it to Codex AI.
3. **Result review and AI linting**: Review the derived plan and apply the 6 verification rules used in `requirements-specification.md` to run a linting loop so that the AI finds warnings and errors on its own.

### Recommended AI Practice Prompts

```text
[Role: IT Professional Business Analyst]
Analyze the pet-care-meeting-notes.md file you just downloaded and write a requirements definition, pet-care-requirements.md, in the following format.

1. Overview and service structure
2. Define user roles (guardian, pet sitter, administrator)
3. List of core functional requirements (ID format: PCR-001, PCR-002...)
4. Normal flow and exception flow (e.g. processing of payment expiration exceeding 1 hour, 200% point compensation for pet sitter no-show, replacement pet sitter recommendation process, etc.)
5. List of non-decision questions

Specify it to the level that is as detailed and developmentable as possible, and apply the AI Lint verification conditions used in step 5 and show the self-verification results at the beginning.
```

### Evaluation Confirmation Criteria

* Was the administrator's 'qualification and approval' business rule reflected after registering as a pet sitter?
* Are the conditions for ‘payment completed within 1 hour’ after accepting a matching application and the exception handling for automatic cancellation when the time is exceeded defined in the requirements?
* In the event of a pet sitter no-show, have emergency scenarios such as '100% refund, 200% point payment, and replacement pet sitter recommendation process activated' been specifically described?

---

## Practice task 2. Unmanned study cafe space reservation and IoT control service (Mission 2)

### Mission status

These are the minutes of a planning meeting for a system that allows individual rooms at a study cafe to be reserved via mobile phone and controls and links offline hardware devices (smart door locks, lighting, heating and cooling) completely unmanned.
Learners must understand the characteristics of a physical reservation service in which hardware devices and mobile payment software must operate organically, derive a multi-safety process (fail-safe) to minimize user inconvenience in the event of IoT failures (device network interruption, password generation and transmission failure, etc.) as well as normal reservation/use flow, and create a structured functional specification.

### Step input (Input)
* `study-cafe-meeting-notes.md` (Summary of unmanned study cafe service meeting minutes)

### Step output (Output)
* `study-cafe-requirements.md` (IoT-linked exception handling integrated requirements definition)
* Hardware-Software Control Verification Scenario Specification

### Original transcript of the first meeting (`study-cafe-meeting-notes.md`)

```markdown
# Unmanned study cafe space reservation and IoT control service 1st planning meeting minutes

**Date**: 2026-07-13 14:00 - 15:30
**Participants**: PM (planning person), IoT Dev (hardware developer), Web Dev (web developer)

---

**PM**: The goal of the unmanned study cafe service is to allow users to make reservations/payments via mobile devices and to fully automate on-site door lock and air conditioning control.

**IoT Dev**: Once the reservation is confirmed (payment done), you must issue a door lock password (pin code) create command from the server to the IoT gateway. For security purposes, the PIN code will only be activated from 10 minutes before the reservation starts until the end.
**Web Dev**: Users will receive a one-time password via notification message or app push 10 minutes before the reservation starts.
**PM**: Yes. Additionally, when the reservation begins, the air conditioner and room lights are automatically turned on, and 5 minutes before the end of the reservation, a voice message saying "5 minutes left" must be announced through the speaker inside the room. When the shutdown time comes, power and lighting should be cut off immediately and door locks should stop working.

**Web Dev**: What if the user wants to extend the usage time?
**PM**: Extension reservation and payment is possible in at least 1 hour increments only if there is no reservation at the later time.
**IoT Dev**: What should I do if an exception occurs where the door does not open at the reserved time or the pin code transmission fails due to an IoT communication failure?
**PM**: Very important exception handling! When a pin code transmission fails, a real-time failure warning must immediately appear on the administrator's web dashboard. When the user presses the 'Emergency Door Open' button, the server opens the door remotely through a spare communication network, or a multiple fail-safe network is required to immediately connect an emergency call to the administrator. This exception response manual and notification conditions require further design.
```

### 🛠️ Self-practice guide
1. **Create meeting notes**: Create a `study-cafe-meeting-notes.md` file in the work folder and save the original contents of the first meeting minutes above.
2. **Document your requirements**: Copy the **Recommended AI Practice Prompts** below and forward them to Codex AI.
3. **Fail-safe review**: We build a complete version by exchanging feedback to ensure that the double- and triple-safety device process to deal with device malfunctions and communication errors is included in the plan without omission.

### Recommended AI Practice Prompts

```text
[Role: IoT Systems Business Analyst]
Based on the study-cafe-meeting-notes.md file you downloaded, fill out study-cafe-requirements.md including the following conditions.

1. Define the normal flow of study room reservation and payment
2. Hardware control timing specification (password activation 10 minutes before reservation time and air conditioner turned on, audio announcement 5 minutes before end, immediate shutdown upon end)
3. Exception and fail-safe flow:
   - Automatic switching to spare wireless network and emergency remote opening process in case of offline IoT door lock network failure
   - Emergency manual door opening button provided when pin code transmission fails and immediate dashboard alarm creation rule for administrators
4. Requirements verification criteria

Organize the flow very specifically in the form of a timeline so that developers and HW engineers can work together without ambiguity.
```

### Evaluation Confirmation Criteria

* Have permission controls been defined to ensure that the smart password (PIN code) is only valid from 10 minutes before the reservation time until the end?
* Has the automatic control flow for the start of the reservation (device ON), 5 minutes before the end (information message), and the end point (power/lighting off) been written in detail based on time?
* In the event of a door lock communication failure, are multiple emergency exception scenarios (fail-safe) included, such as 'administrator alarm', 'remote opening of spare network', and 'emergency communication linkage'?
```
