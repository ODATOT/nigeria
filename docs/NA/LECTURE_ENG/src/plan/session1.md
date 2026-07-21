# [Teaching plan] 1st session. Understanding AI·LLM·Agent concepts

## 1. Overview and goals

- **Target**: Non-majors/beginners who are new to AI or need conceptual organization
- **Time**: Total 60 minutes (5 minutes introduction, 20 minutes explanation, 25 minutes practice, 10 minutes sharing and organizing)
- **target**:
  - The relationship between AI, LLM, and Agent can be easily explained through everyday analogies.
  - Understand the difference between general conversation using ChatGPT and agent design that handles tasks.
  - Can explain the four major components of an agent: Input, Reasoning, Action, and Output.

---

## 2. Time plan (Total: 60 minutes)

| steps | time | Details | How to proceed |
| :--- | :--- | :--- | :--- |
| **Introduction** | 5 minutes | Lesson opening and thought-opening questions | Instructor questions and answers |
| **Key explanation** | 20 minutes | Definition and difference between AI, LLM, Agent, 4 elements of agent | Instructor-led explanation (using metaphors) |
| **Practice progress** | 25 minutes | Comparison exercise of 3 question types (general, role, action) | Enter individual prompts and create comparison table |
| **Summary and Q&A** | 10 minutes | Sharing practice impressions and key summary of the first session | Discussion and Feedback |

---

## 3. Detailed lecture guide

### [00:00 - 00:05] Introduction: Open your mind (5 minutes)

#### Instructor Explanation Guide
> "Nice to meet you all. Today we will learn about 'how to work with artificial intelligence.' When you think of artificial intelligence, you usually think of asking questions to ChatGPT and getting answers. Asking good questions every time and eliciting answers is completely different from creating an agent that works on its own without you. I will explain this difference very easily today."

#### Introduction Questions
1. *"Have you ever asked a question to ChatGPT? You have to keep rewriting the prompt (question) to get a good answer every time. Can't you just let this assistant do the work for you?"*
2. *"What does it take to make AI go beyond just giving smart answers and actually take action, such as sending emails or organizing data?"*

---

### [00:05 - 00:25] Key Points: Concepts for Beginners (20 minutes)

#### 1) Relationship between AI, LLM, and Agent (understanding through analogy)
To make it difficult for beginners to understand, we will avoid jargon and explain it with the following analogy.

- **AI (Artificial Intelligence) ──> [Metaphor: A huge forest called science and technology]**
  - This is the broadest scope to refer to all technologies that enable machines to think and make decisions like humans.
- **LLM (Large Language Model) ──> [Metaphor: A smart ‘brain’ that has read all the books in the library]**
  - It is a core engine (brain) that has the ability to naturally write sentences by reading and learning a huge amount of text. (e.g. GPT-4, Claude, etc.)
- **Agent ──> [Metaphor: ‘Worker robot’ with arms, legs (Action) and behavioral rules attached to the brain (LLM)]**
  - It is not just words, but a ‘complete system that makes plans, acts (uses tools), and produces results’ to achieve a given goal.

#### Visual Material 1. AI·LLM·Agent relationship diagram
```
+-------------------------------------------------------+
| AI (Artificial Intelligence: The Great Forest of Computer Science) |
|  +-------------------------------------------------+  |
|  | LLM (Large Language Models: A smart thinking 'brain' engine)|  |
|  |  +-------------------------------------------+  |  |
|  |  | Agent (Agent: a robot with the ability to act and have rules)|  |  |
|  |  +-------------------------------------------+  |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
```
*Image description: The structure of three squares or circles containing each other (AI > LLM > Agent) shows that the agent is a practical system built on LLM.*

#### 2) Four major components of an agent: IRAO (very important!)
The way agents work is exactly the same as the way people work. Go through the following 4 steps:

1. **Input**: Give work (e.g. email sent by customer)
2. **Reasoning (judgment/inference)**: Thinking with your brain (e.g. “Is this an angry customer? It’s because of the delivery delay. I should apologize and find a solution.”)
3. **Action (action/tool)**: Working with hands and feet (e.g. checking delivery status in courier system, sending email reply)
4. **Output**: Presenting results (e.g. written apology reply email and database processing record)

#### Visual 2. Four components of agent (IRAO) flowchart
```
[user request / data] ──> (brain: judgment/inference) ──> [tool execution / API] ──> [final work product]
      (Input)                 (Reasoning)               (Action)                 (Output)
```
*Image description: This is a pipeline-shaped infographic that flows from left to right from input to output, visually expressing that the agent must go through a process of judgment and tool execution in the middle.*

---

### [00:25 - 00:50] Practice: Practice comparing responses by question type (25 minutes)

#### Lab Objectives
- Experience for yourself how practical your answers become when you specify specific ‘reasoning’ and ‘output format’ for the prompt.

#### Practice text to provide (customer complaint email)
```text
Subject: Protest against delayed delivery

Hello, the product I ordered last week has not yet been delivered.
When I ordered it, it said it would be delivered in 2-3 days, but it's already been a week.
No contact, no tracking of delivery. Please refund me.
```

#### Practice steps (performed individually by learners)

- **Step 1 (General Questions)**: Just ask basic questions without any options.
  - Prompt: `"Reply to customer complaint email."`
- **Step 2 (Role Designation)**: Give the AI ​​a specific job/role (Persona).
  - Prompt: `"You are a friendly customer support representative. Please respond to customer complaint emails."`
- **Step 3 (Structured Questions)**: Enforce the order of work (Reasoning) and the format (Output) of how to respond.
  - Prompt: `"You are a customer support expert. Analyze customer complaint emails and draft a response by dividing it into cause of complaint, apology statement, solution, and follow-up actions."`

#### Instructor Tip
> "Let learners enter each of the three items directly in the antigravity prompt test window. Compared to step 1, which was roughly written in line letters, in step 3, we encourage students to observe how the mail is neatly structured and output as departmental action plans or cause analysis items."

---

### [00:50 - 01:00] Summary and discussion (10 minutes)

#### Share Questions (For Discussion)
- “Between the 1st level reply and the 3rd level reply, at which level can you go to work today, receive approval from your manager, and immediately send it to the customer?”
- “What were the key words that made a difference in the results?”
- “If we want to pass these results on to a computer or the next system, what format should we store them in?”

#### Instructor Closing Summary Script
> "Thank you for your hard work. The main point of the first session is clear. Agent design is not **'knowledge of asking good questions' but 'design that promises the order and shape of work'**. In the next second session, we will look at 'Persona design and prompt structuring' that smartly fixes the agent's personality and judgment criteria."
