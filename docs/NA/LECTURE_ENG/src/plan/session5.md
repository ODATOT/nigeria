# [Teaching plan] 5th session. Conditional branching & judgment type agent design

## 1. Overview and goals

- **Target**: Learners who want to create a dynamic agent that performs different follow-up tasks depending on user input or situational judgment.
- **Time**: Total 60 minutes (5 minutes introduction, 20 minutes explanation, 25 minutes practice, 10 minutes sharing and organizing)
- **target**:
  - Understand the importance and purpose of conditional branching (if-else) in agent design.
  - Define classification criteria (positive, negative, inquiry, complex) and a clear basis for judgment in the prompt.
  - Establish and reflect exception handling rules to handle ambiguous information or complex intent.

---

## 2. Time plan (Total: 60 minutes)

| steps | time | Details | How to proceed |
| :--- | :--- | :--- | :--- |
| **Introduction** | 5 minutes | Discussing the limitations of agents that behave the same in all cases | Situational play and questions |
| **Key explanation** | 20 minutes | Basic structure of conditional branching, classification criteria table definition, exception response rule design | Presentation and Case Description |
| **Practice progress** | 25 minutes | Positive/negative/inquiry classification and reason analysis practice using customer review data | Classification Agent construction and testing |
| **Summary and Q&A** | 10 minutes | Reason for judgment (Reason) Strengths of simultaneous output and summary of session 5 | Discussion and Feedback |

---

## 3. Detailed lecture guide

### [00:00 - 00:05] Introduction: Open your mind (5 minutes)

#### Instructor Explanation Guide
> "I designed an automatic response chatbot, but what happens if a customer's praise review saying, 'You're really friendly and the delivery is fast!' and the customer's complaint review saying, 'Please refund me. I'm so angry' are equally answered with 'Thank you, I'll pass it on to the person in charge.' The customer who filed the complaint will be even more angry. In this way, the working agent must **'reason'** the situation and **'branch'** the course of action accordingly."

#### Introduction Questions
- *"If there is an agent that automatically reads and processes customer emails, what different flows should the emails be divided into depending on their purpose?"*
- *"If a question comes in that is difficult for AI to classify (e.g., 'When will it be restocked? But this new product is pretty'), how should it be wise to handle it?"*

---

### [00:05 - 00:25] Keynote: Conditional Branching and Exception Handling Design (20 minutes)

#### 1) Concept of Conditional Branching
- **Definition**: A structure that flows into different work pipelines (Flows) depending on input values ​​or situation analysis results.
- **Design of classification criteria**: If the criteria are ambiguous, the agent's judgment accuracy drastically decreases.
  - **Positive**: Expression of satisfaction, praise, recommendation, intention to repurchase
  - **Negative**: Complaints, complaints about defects, error reports, refund/exchange requests
  - **Inquiry**: Request information on schedule, method, price, procedures, etc.
  - **Complex/Exception**: When positive and negative are mixed, or the text is short and the intention is unclear.

#### Visual 1. Conditional branching decision flow chart (Decision Tree)
```
                  [Customer input (review/mail)]
                              │
                              ▼
                    { Intent Classification Judgment (LLM) }
                   /          │           \
            [Affirmative] [Negative] [Inquiry]
               │              │              │
               ▼              ▼              ▼
         [Thank you response] [Urgent person in charge] [FAQ response]
                        [Assignment and Notification] [Automatic Send]
```
*Image description: This is a tree-shaped diagram where when one input value is received, the LLM makes a decision in three branches, each heading to a different action card.*

#### 2) Exception handling response
In practice, ambiguous input that is difficult to predict always comes in. To achieve this, you need to insert clear 'priority rules' within the prompt.
- **Example priority rule**:
  - Rule 1: If positive and negative input comes in at the same time (complex), judge it as **'negative'** and identify the elements of dissatisfaction first.
  - Rule 2: If interpretation is difficult due to lack of information or foreign language, do not make random guesses and classify as **'additional confirmation required'**.

#### Visual 2. Exception handling guardrail mapping
```
+───────────────────────────────────────────────────────────+
| [vague input]: “Okay, but the delivery is late.” (Positive + Negative Complex) |
+───────────────────────────────────────────────────────────+
                             │
                             ▼ [Guardrail rules]
                   “Compounds take precedence over negation.”
                             │
                             ▼
                    [Final classification]: Negative
                    [Follow-up]: Immediate linkage with delivery team
```
*Image description: The rule card acts as a guardrail, showing the process by which ambiguous data is controlled to a defined trajectory without being twisted.*

---

### [00:25 - 00:50] Practice: Designing a Review Classification Agent (25 minutes)

#### Practice text to provide (5 review samples)
```text
1. “I liked that the lecture content could be applied directly to practice.”
2. "Payment was attempted twice due to an error on the application page. Please check."
3. “When is the next training session held?”
4. “The instructor’s explanation was good, but the practice time was a bit lacking.”
5. “The resource download link does not open.”
```

#### Exercise performance steps
1. **Write classification prompt**: Write positive/negative/inquiry/complex classification criteria in RICO format.
2. **Reason output designation**: Instead of outputting only the simple classification name, configure it to output the `reason for judgment: [explanation of basis]` item explaining why the decision was made.
3. **Write and compare results**: Categorize the five reviews and summarize them in table format. In particular, check the results of compound sentences with positive and negative sentences, such as number 4, and supplement the prompt with exception rules.

#### Instructor Tip
> "Please emphasize the theoretical fact (similar to CoT) that if you tell artificial intelligence not only the judgment results but also the 'reason for judgment', the logic of the AI's reasoning will be organized and the classification accuracy itself will greatly increase."

---

### [00:50 - 01:00] Summary and discussion (10 minutes)

#### Share Questions (For Discussion)
- “When the reasons for judgment were printed together, was there any change in the accuracy of the classification results or convenience of review?”
- "If the system determines that an input is classified as 'incorrect' or 'failure' in the field, what kind of automatic notification should be sent to the person in charge afterwards?"

#### Instructor Closing Summary Script
> "Thank you for your hard work. Conditional branching gives agents the 'judgment power' to respond to changes in situations. In the next 6th session, I will use all the roles, output control, workflow, and conditional branching I have learned so far to complete my own automation agent design (Mini Project) that solves my actual work."
