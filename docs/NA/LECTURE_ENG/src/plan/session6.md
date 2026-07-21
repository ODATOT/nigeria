# [Teaching plan] 6th session. Work automation agent design: Mini Project

## 1. Overview and goals

- **Target**: Learners who want to create a blueprint to solve their own practical problems based on the agent design techniques they have learned so far
- **Time**: Total 60 minutes (5 minutes introduction, 15 minutes explanation, 30 minutes practice, 10 minutes presentation and summary)
- **target**:
  - Can explain the evaluation criteria (repeatability, regularity, dataness) of which tasks are suitable for AI automation.
  - You can create an Agent design that includes problem definition, input, processing flow, conditional branching, and output format.
  - Based on the design, logically announce the agent's operation flow and expected effects and accept feedback.

---

## 2. Time plan (Total: 60 minutes)

| steps | time | Details | How to proceed |
| :--------------- | :--- | :---------------------------------------------------------------- | :--------------------------- |
| **Introduction** | 5 minutes | Explaining the importance of selecting automation targets | Open your thoughts and present examples |
| **Key explanation** | 15 minutes | Guide to the three major evaluation criteria for automation and how to write an agent design | Lecture-style explanation and slide examples |
| **Practice progress** | 30 minutes | Selection of individual/team job candidates, automation suitability evaluation, and preparation of agent design | Complete Practice Worksheet |
| **Presentation and summary** | 10 minutes | Presentation and feedback by team, conclusion of the entire process | Speech and Instructor Feedback |

---

## 3. Detailed lecture guide

### [00:00 - 00:05] Introduction: Open your mind (5 minutes)

#### Instructor Explanation Guide

> "It's the final 6th session! Now is Mini Project time, where you can create a practical automation agent blueprint with your own hands. The most important thing when creating an agent is not to have it do 'cool and great work,' but to have it do 'work that is repeated every day and has clear rules.' Let's look at what kind of work is suitable as food for the agent and complete the actual blueprint."

#### Introduction Questions

- _"What kind of annoying and repetitive text work do you do every morning as soon as you get to work?"_
- _"Are there clear standards or rules for AI to handle that task?"_

---

### [00:05 - 00:20] Key explanation: Automation standards and design documentation (15 minutes)

#### 1) Three major evaluation criteria for selecting automation targets

It is a measure to evaluate whether a task is suitable for introducing an agent. (Evaluated on a scale of 1 to 5)

1. **Frequency**: How many times per week or per day? (The more frequently it happens, the better)
2. **Rule-based**: Can you explain your work method and judgment logic to others in writing? (If you can't explain it, it's difficult to judge LLM as well)
3. **Data-driven**: Are the input values ​​and final results computerized in text, tables, Excel, etc.? (No verbal instructions or manual labor allowed)

#### Visual 1. Automation Suitability Matrix

```
   Go ▲
     │ [Optimal target (★)]
  Gyu │ - Weekly report summary and writing
  Chic │ - Automatic response classification for repeat customer emails
  Castle │
     ├────────────────────────────────────
  Me │ - Brainstorming new business strategies
     │ - Sketching design ideas
     └────────────────────────────────────
     Low data quality ▲ High
```

_Image description: This is a two-dimensional matrix diagram showing that the optimal agent to be designed is located in a highly repetitive area on the horizontal axis (dataness) and vertical axis (regularity)._

#### 2) Guide to filling out the 11-item Agent design form

This is the main outline of the design form you will fill out during your lab time.

- **Project Name**: Agent’s name
- **Problem you are trying to solve**: Current inefficiencies and need for automation
- **User and Target Task**: Who will operate this agent
- **Input data**: Example of text or document to be entered
- **Processing steps (Workflow)**: Roles and interconnection methods of Step 1, Step 2, and Step 3
- **Conditional Branching**: Processing path is divided depending on what situation.
- **Output results & usage method**: Result format (table, JSON, etc.) and follow-up link
- **Expected benefits**: Time saved and value for money

#### Visual 2. Agent-wide architecture map

```
[ Input: Raw data ] ──> [ Step 1: Classification ] ──(Branch)──> [ Step 2-A: Positive template ] ──> [ Output: Table/JSON ]
                                      └──> [ Step 2-B: Fraud Notification ]
```

_Image description: This is a system blueprint in which the structure is organically mapped from input through several stages of workflow and conditional branching to the output as a final formatted result._

---

### [00:20 - 00:50] Practice: Creating agent design and presentation materials (30 minutes)

#### Lab Steps

1. **Identify task candidates**: Each team member or individual writes down three candidate tasks that they would like to automate.
2. **Suitability evaluation and selection**: Score based on three major criteria (repeatability, regularity, and dataability) and select the one task with the highest score.
3. **Complete design form**: Carefully fill out the items in the agent design form provided for the selected task.
4. **Create a 1-page summary for presentation**: Complete a 3-minute speech summary card to explain to your peers.

#### Instructor Tip

> "Don't let learners worry about technical implementation (coding). The key is to continually reassure and encourage them that 'organizing things logically in words and tables' is more than 90% of agent planning."

---

### [00:50 - 01:00] Presentation and summary (10 minutes)

#### Presentation guide for each team

- Have each team clearly present only the main points for **3 minutes**.
  - 1 minute: What is the problem and why do we need automation? (Problem definition)
  - 1 minute: What is the input data and processing flow (workflow, conditional branching)?
  - 1 minute: What format will the final result be and what effect do you expect?

#### Peer Feedback Rubric

- **Excellent**: The problem is specific, input/processing/conditions/output are organically linked, and the effect is described quantitatively.
- **Supplementation required**: The problem is too ambiguous, conditional branching is omitted, or the result format is not determined, making practical application difficult.

#### Instructor Closing Summary Script

> "Everyone, thank you very much for your hard work over the past 6 hours! Today, we have gone beyond simple users who are good at handling AI and have taken our first step as **'AI workflow architects'** who design the pipeline through which AI works. The blueprint you created today will become the strongest framework when building actual agents in the future. We will conclude the training. Thank you!"
