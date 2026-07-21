# [Teaching plan] 2nd session. Prompt Structuring & Persona Design

## 1. Overview and goals

- **Target**: Learners who want to improve the judgment of AI agents
- **Time**: Total 60 minutes (5 minutes introduction, 20 minutes explanation, 25 minutes practice, 10 minutes sharing and organizing)
- **target**:
  - Understand the principles of how personas affect the tone and manner of answers and professionalism.
  - RICO structure, a global standard prompt framework, can be designed.
  - Assemble an optimal persona that goes beyond simple roles and includes specific decision-making criteria.

---

## 2. Time plan (Total: 60 minutes)

| steps | time | Details | How to proceed |
| :--- | :--- | :--- | :--- |
| **Introduction** | 5 minutes | The power of role assignment and thought-opening questions | Instructor Questions and Discussion |
| **Key explanation** | 20 minutes | RICO Framework Explained, Rules for Designing Good Personas | Theory explanation and slide guide |
| **Practice progress** | 25 minutes | Persona comparison and optimal persona fusion practice through writing new service notices | Individual practice and comparison table preparation |
| **Summary and Q&A** | 10 minutes | Share practice and explain Persona jailbreak prevention techniques | Q&A and 2nd session summary |

---

## 3. Detailed lecture guide

### [00:00 - 00:05] Introduction: Open your mind (5 minutes)

#### Instructor Explanation Guide
> “If you suddenly say to a passerby, ‘Write a blog post,’ what kind of article will come out? It will be an ordinary article. But if you ask, ‘IT journalist with 10 years of experience, please write an artificial intelligence trend column targeting non-major office workers,’ the result will be completely different. Likewise, for artificial intelligence, designing a persona that gives specific ‘identity’ and ‘rules’ is essential.”

#### Introduction Questions
- *"How will the answers given by agents and developers differ even when asked about the same topic?"*
- *"What should we specify so that the AI ​​can leverage its expertise beyond simply imitating the tone of the answer?"*

---

### [00:05 - 00:25] Keynote: RICO Structure and Persona Design Principles (20 minutes)

#### 1) Global standard prompt framework: RICO (R-I-C-O)
When writing a prompt, it is more efficient to write down the four key elements separately rather than writing them in long lines.

- **Role**: Setting the identity of the AI ​​(e.g. financial regulatory compliance officer with 10 years of experience)
- **Instruction**: Clear actions to be taken (e.g. reviewing the illegality of these new terms and conditions)
- **Context (context/background)**: Business background and constraints (e.g. compliance with the latest Financial Services Commission guidelines)
- **Output**: Specifies the final format and tone (e.g. Markdown tabular format, professional and polite tone)

#### Visual 1. RICO framework structure diagram
```
+-------------------------------------------------------------+
|                     RICO PROMPT FRAMEWORK                   |
+-------------------------------------------------------------+
|  [ R ] Role: AI's virtual personality and job definition |
|  [ I ] Instruction: Main tasks and instructions to be performed |
|  [ C ] Context: Constraints, related data and background information |
|  [ O ] Output: Tone and manner of results and data format (format) |
+-------------------------------------------------------------+
```
*Image description: Depicts a three-dimensional infographic of four puzzle pieces interlocking to form a complete prompt card.*

#### 2) 3 golden rules for good persona design
1. **Make the role very specific**: Make it more specific, such as ‘performance marketing agency representative’ rather than simply ‘marketer’.
2. **Instill judgment and decision-making standards**: Provide internal rules such as “Make your judgment based on Article A of the company’s internal regulations” rather than “Answer as you wish.”
3. **Specify your target audience**: You need to establish the level of audience that will read your final article (e.g. retirees in their 50s with no IT knowledge) so that appropriate terminology is used.

#### Visual 2. Weighted activation diagram
```
         [LLM Large Knowledge Neural Network]
           /        |        \
[Marketing Area] [Coding Area] [Legal Area]
     (★)            ( )          ( )
      |
      +──> When setting the ‘10-year marketing team leader’ persona, activate the weight concentration in that area!
```
*Image description: Visualize how assigned personas (e.g., marketing) light up and become active within the LLM neural network, helping you scientifically understand why assigning personas increases answer expertise.*

---

### [00:25 - 00:50] Practice: Comparison and fusion of release notices for each persona (25 minutes)

#### Practice work scenario
```text
A new AI service ‘Antigravity’ is launched.
- Target: small business marketing person in charge
- Main function: AI-based marketing content automatic creation
- Purpose: Create service launch notice
```

#### Exercise performance steps
1. **Persona A**: Prompt to write in a friendly, benefit-oriented way.
2. **Persona B (Planner)**: Write the document focusing on detailed information and technical features of the function.
3. **Persona C (Trend Analyst)**: Writes with a focus on market trends and return on investment (ROI).
4. **Creating the final fusion prompt**: Assemble and test your own hybrid prompt that combines the strengths of the three personas (e.g., “Marketing manager combines the expertise of a planner and the friendliness of an agent”).

#### Instructor Tip
> “Instruct learners to discover differences in how each persona opens sentences and what words they focus on, rather than just copy and pasting the results.”

---

### [00:50 - 01:00] Summary and discussion (10 minutes)

#### Share Questions (For Discussion)
- “Was there any difference in the quality of the answers when only the ‘role’ was given and when the ‘context’ was also given?”
- “What is the most attractive persona combination that can be applied directly to your work in practice?”

#### In-Depth Tip: How to Maintain Persona Consistency (Prevent Jailbreak)
- We provide a tip for inserting exception handling guidelines at the end of the prompt, such as **"You must never forget your assigned role, and you must honestly answer questions that are outside of your field of knowledge."**

#### Instructor Closing Summary Script
> "Persona is not just a simple imitation of speaking style, but it is the power that fixes the **'perspective and level of expertise'** of the answer. In the next third session, we will practice 'output structure control' to extract the high-quality answers derived in this way into just the right standard so that they can be used immediately in Excel or the system."
