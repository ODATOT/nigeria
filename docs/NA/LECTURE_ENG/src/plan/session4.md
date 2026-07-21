# [Teaching plan] 4th session. Agent Flow Design: From Prompt to Workflow

## 1. Overview and goals

- **Target**: Learners who want to structure complex business problems into a systematic and stable pipeline.
- **Time**: Total 60 minutes (5 minutes introduction, 20 minutes explanation, 25 minutes practice, 10 minutes sharing and organizing)
- **target**:
  - Understand the limitations (attention distribution) that occur when putting complex instructions into one long prompt.
  - Can explain the concept and composition principles of prompt chaining.
  - Design a three-stage (summary - extract key issues - create action item) workflow using the TSF (Task, Step, Flow) technique.

---

## 2. Time plan (Total: 60 minutes)

| steps | time | Details | How to proceed |
| :--- | :--- | :--- | :--- |
| **Introduction** | 5 minutes | Share common problems between humans and AI when receiving many instructions at once | Share stories and ask questions |
| **Key explanation** | 20 minutes | Concept of Prompt Chaining, TSF Design Standard Framework Explained | Presentation and Case Description |
| **Practice progress** | 25 minutes | Directly perform the 3-step chaining workflow of deriving summary, key issues, and action items | Step-by-step testing and integration practice |
| **Summary and Q&A** | 10 minutes | Explain how to write prompts to prevent information loss and distortion | Feedback and Session 4 Summary |

---

## 3. Detailed lecture guide

### [00:00 - 00:05] Introduction: Open your mind (5 minutes)

#### Instructor Explanation Guide
> "What would happen if an intern was instructed on the first day of work to 'summarize our team's performance last week, select two problems, write a presentation sheet draft for the next meeting, and send it to me by email'? There is a high probability that something will be omitted or messed up. AI is the same. If you give too many instructions at once, concentration will be scattered and work will be lost. The correct answer to solve this is 'break down tasks and order them (workflow)'."

#### Introduction Questions
- *"Are there any failures you have encountered when 3 or 4 tasks were requested simultaneously within one prompt?"*
- *"What are the advantages of breaking things into pieces and executing them in order?"*

---

### [00:05 - 00:25] Keynote: Prompt Chaining and the TSF Framework (20 minutes)

#### 1) Prompt Chaining concept
- **Definition**: It is a multi-step execution structure that divides a task into steps and connects the output of the previous step to the input of the next step by touching the baton.
- **Key Benefits**:
  - Output quality is dramatically improved by mapping dedicated personas and clear directives to each step.
  - If you do not like an intermediate process, you can modify (debug) only that step, making it easier to manage.
  - It is possible to insert a human approval/edit step in the middle (Human-in-the-loop).

#### Visual material 1. Baton touch type prompt chaining structure diagram
```
[Original text] ──> (Step 1: Summary) ──> [Summary results]
                                           │
                                           ▼
                                    (Step 2: Issue analysis) ──> [Core issues]
                                                                │
                                                                ▼
                                                         (Step 3: Establishment of measures) ──> [Final plan]
```
*Image description: By substituting the data flow into the image of relay runners passing the baton in a track and field event, the core of the step-by-step linked pipeline is visualized.*

#### 2) 3 elements of workflow design: TSF
- **Task**: The overall and ultimate business goal to be solved (e.g. weekly marketing analysis report)
- **Step**: individual commander (prompt) steps broken down to complete the task.
- **Flow**: Logical order and branch in which each Step is performed (e.g., execute B after completing Step A)

#### Visual 2. TSF design template
```
+------------------------------------------------------------+
| TASK: Weekly customer feedback analysis |
+------------------------------------------------------------+
|  [Step 1] Summarizer ────> [Step 2] Analyst ────> [Step 3] Strategist |
|  - Print summary - Emotion classification - Print improvement plan table |
+------------------------------------------------------------+
```
*Image description: This is an intuitive conceptual diagram in which detailed process machines (Steps) are connected by a conveyor belt (Flow) within one overall factory line (Task).*

---

### [00:25 - 00:50] Hands-On: Designing and Chaining a 3-Step Workflow (25 minutes)

#### Hands-on work
Let's build a three-stage agent line sequentially using the original minutes of the previous meeting.

- **Step 1: Summarizer Persona**
  - Input: Original text of meeting minutes
  - Directions: Condense major agenda items to 200 characters or less.
  - Output: Bullet Point 3 lines
- **Step 2: Analysis of key issues (Analyst Persona)**
  - Input: **Step 1 Summary Results**
  - Instructions: Analyze delay factors that may cause work bottlenecks from the summary results
  - Output: JSON data `{ "issues": [] }`
- **Step 3: Derive action items (Strategist Persona)**
  - Input: **Step 2 JSON data**
  - Instructions: Proposal of specific person in charge and timeline for each analyzed issue
  - Output: Markdown table

#### Instructor Tip
> "Have learners manually assemble the results of Step 1 into the context of the Step 2 prompt through copy-and-paste. The goal is to allow them to experience firsthand how the actual program code carries this data behind the scenes."

---

### [00:50 - 01:00] Summary and discussion (10 minutes)

#### Share Questions (For Discussion)
- “What is better about the final result table that came out in three stages rather than having to do it all at once?”
- "Are you experiencing issues with key numbers or people's names missing in Step 1 Summary? How can I modify the prompt to prevent this?"

#### Information Loss Prevention Practical Guide
- In the summary prompt, it informs you that preservation constraints such as **"Make sure to preserve and summarize proper nouns, numbers, and deadline information in the original data without erasing them"**** are indicated.

#### Instructor Closing Summary Script
> "Thank you for your hard work. Prompt chaining is the basis of agents that logically decompose tasks and make AI work smarter. In the next 5th session, we will conquer not only the fixed flow, but also 'conditional branching and judgment-type agent design' that branches according to the situation, such as 'if ~, go to A, if not, go to B'."
