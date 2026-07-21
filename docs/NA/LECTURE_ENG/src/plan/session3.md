# [Teaching plan] 3rd session. Output structure control & dataization

## 1. Overview and goals

- **Target**: Learners who want to automatically link AI agent responses to external programs or practice forms
- **Time**: Total 60 minutes (5 minutes introduction, 20 minutes explanation, 25 minutes practice, 10 minutes sharing and organizing)
- **target**:
  - Recognize the business limitations of short-form responses and understand the advantages of standardized output formats.
  - Can explain the uses of the three major business output formats (table, bullet point, JSON).
  - Using the few-shot example technique, you can remove unnecessary introductions/explanations in AI and enforce structure.

---

## 2. Time plan (Total: 60 minutes)

| steps | time | Details | How to proceed |
| :--- | :--- | :--- | :--- |
| **Introduction** | 5 minutes | Bringing awareness to the problems of unstructured text | Open Thoughts Ask Questions and Give Examples |
| **Key explanation** | 20 minutes | 3 major format features, 4 output structure control rules, Few-shot usage method | Presentation and example explanation |
| **Practice progress** | 25 minutes | Transforming unstructured meeting minutes text into tables, bullets, and JSON | Individual practice and verification |
| **Summary and Q&A** | 10 minutes | Explanation of precautions and missing data exception handling rules when linking the system | Feedback and Session 3 Summary |

---

## 3. Detailed lecture guide

### [00:00 - 00:05] Introduction: Open your mind (5 minutes)

#### Instructor Explanation Guide
> "I recorded the meeting and wrote it down as text, and this file is 30 pages long. If the manager says, 'Summarize only the key points and organize them in an Excel table,' I see the AI ​​result that summarizes well, and then I have the inconvenience of having to type it in Excel again, stitch by stitch. Why is that? It's because the output structure is not controlled. Today, I will learn techniques to perfectly control this output format."

#### Introduction Questions
- *"What is the real reason why it is difficult to copy the great sentences given by AI and paste them directly into my report or system?"*
- *"Have you ever had the experience of instructing AI not only the content of the answer but also the 'shape (specification)' of the answer?"*

---

### [00:05 - 00:25] Keynote: Output Structure Control Techniques (20 minutes)

#### 1) Uses of the three major output formats
- **Table**: Suitable for comparing items, checking data consistency, and managing schedules and personnel (for human reports)
- **Bullet Point**: Suitable for rapid dissemination, summary of key issues, and short briefings (for human messengers)
- **JSON**: Database (DB) storage, for passing parameters to other agent systems (for computer/system linkage)

#### Visual 1. Unstructured text filter pipeline
```
[Irregular long line meeting minutes]
         │
         ▼ (LLM output filtering)
+───────────────────────────────────────────────────+
| [Table Format] [Bullet Format] [JSON Format] |
|  Category | In charge | Deadline │ - Conclusion 1 │ "tasks": [ │
|  Information | Assistant Manager Lee| 5/20 │ - Action 1 │ {"owner":..│
+───────────────────────────────────────────────────+
```
*Image description: This is an illustration of a jumbled line of meeting minutes passing through a filter and being mapped and converted into three neat data cards: table, bullet, and JSON.*

#### 2) Four prompt laws for output control
1. **Schema definition**: Clearly define the column names or JSON keys to be filled in English.
2. **Specify rules for handling blank values**: Close gaps, such as “If there is no information, don’t leave it blank, write ‘N/A.’”
3. **Block unnecessary greetings**: Ban editorials such as `“Yes, we will summarize what you requested”` and specify `“Never write output other than a JSON block”`.
4. **Few-shot (example) provided**: Insert at least one sample of the desired type into the prompt.

#### Visual 2. Few-shot (example) mapping prompt template
```
### Instructions: Convert the input values according to the rules below.
[Input example]: Approval of Hong Gil-dong's business trip on May 3
[Output example]: { "date": "2026-05-03", "name": "Hong Gil-dong", "task": "Business trip" }

---
[Actual input]: May 25, Manager Minji Kim applied for leave
[Actual output]: (★ LLM creates a response in the correct format, mimicking the example)
```
*Image description: A flowchart that intuitively shows how example blocks written within the prompt are replicated and expanded into actual output.*

---

### [00:25 - 00:50] Hands-on lab: Meeting minutes data structuring exercise (25 minutes)

#### Exercise text to be provided (part of meeting minutes)
```text
At the regular meeting in May, the schedule for promoting new educational programs was discussed.
Kim Min-ji decided to draft the promotional text by this Friday.
Landing page modifications will be completed by Park Jun-ho by next Tuesday.
It was decided to review the budget in the direction of increasing it by 10%.
Student recruitment notices will be sent out next Wednesday morning.
In addition, Seoyeon Lee decided to organize the education satisfaction survey questions.
```

#### Exercise performance steps
1. **Table conversion**: Convert the meeting minutes into a Markdown table according to the table (‘classification, content, person in charge, deadline’) columns.
2. **Bullet summary**: Select only the key points and summarize them in a key summary form.
3. **JSON conversion**: Fetch answers only as pure JSON according to the specified schema structure (`{ "decisions": [], "tasks": [ { "task": "", "owner": "", "due_date": "" } ] }`).

#### Instructor Tip
> "When converting to JSON, private words keep getting mixed up or parentheses are broken. In this case, encourage attention by adding a sentence at the bottom of the prompt: `# Constraint: Text other than JSON is strictly prohibited.`

---

### [00:50 - 01:00] Summary and discussion (10 minutes)

#### Share Questions (For Discussion)
- “Which is better, a table or JSON, when it comes to fully integrating into the system?”
- “How did you make AI handle items with missing deadlines or people in charge? (Exception handling tips)”

#### Instructor Closing Summary Script
> "Thank you for your hard work. The lesson from this time is that you have developed **'the power to control the output structure so that computers and systems can understand'**. In the next 4th session, we will go beyond this one-page prompt and go into 'workflow design', which links multiple steps like a chain, and begin assembling a full-fledged pipeline."
