# ODA Boost AI - ACE AI Startup Bootcamp (Day 1)

This is a repository of teaching materials for ACE Startup SW/AI pilot course and ACE AI Startup Bootcamp training.

# View teaching plan

[https://edunlab.github.io/ODA_boost_AI_na/](https://edunlab.github.io/ODA_boost_AI_na/)

## purpose

This repository provides educational materials to understand the concept of AI Agent and develop the ability to use it in practice. Beyond simply asking AI questions, we aim to cultivate agent design capabilities that design how AI works.

## structure

```
ODA_boost_AI_na/
├── src/ # development and original source folder (use here when modifying)
│ ├── session/ # HTML slide fragment for each session (session1.html ~ session3.html)
│ ├── images/ # image resource
│ ├── review/ # review markdown file
│ ├── app.js # Front-end JavaScript source
│ ├── index.html # Main HTML template
│ └── style.css # Style sheet source
├── docs/ # build done deployment folder (GitHub Pages hosting target)
│ ├── index.html # Merged main HTML (self-executing and CORS error-free)
├── ai_prompt/ # Agent design and prompt data
├── build.js # Build script that builds/merges src sources into docs
└── README.md
```

## How to build and deploy

Modification work is performed on files in the `src/` folder. To create a single HTML merge for distribution, run the build command below. It uses only Node.js standard modules, so no additional package installation (`npm install`) is required.

```bash
node build.js
```

Running this command will automatically merge all HTML files inside `src/session/` into `docs/index.html` and copy and organize all necessary assets into the `docs/` folder.

## Training content

### Edunity Lab (Day 1-2)

**Day 1: Basics**

- **1st session**: Understanding AI · LLM · Agent concepts
- **Part 2**: Prompt Structuring & Persona Design
- **3rd session**: Output structure control & dataization

**Day 2: In-Depth**

- **4th session**: Agent flow design (Prompt → Workflow)
- **Lesson 5**: Conditional branching & judgment type agent design
- **6th session**: Work automation agent design (Mini Project)

### Examples of Agents by Industry

We provide examples of Agent design that can be used in various industries:

- Game review analysis Agent (`01_game_review_agent`)
- Movie Marketing Agent (`02_movie_marketing_agent`)
- Commerce Review Analysis Agent (`03_commerce_review_agent`)
- IP Goods Planning Agent (`04_ip_goods_agent`)
- Content Curation Agent (`05_content_curation_agent`)

## How to start

### View web document

- **Online teaching plan**: [https://edunlab.github.io/boost_ai/](https://edunlab.github.io/boost_ai/)
- **Run locally as a web server (recommended)**:
  Run the local server by entering the Python command below in the project root folder, and then access `http://localhost:8000/docs/` in the browser.
  ```bash
  python -m http.server 8000
  ```
  Or, to directly serve the `docs` directory, use the following command and connect to `http://localhost:8000/`.
  ```bash
  python -m http.server 8000 --directory docs
  ```
- **Run directly locally**: Open the `index.html` file in the `docs/` folder directly in a web browser by double-clicking it, or run it through a local web server tool such as VS Code's Live Server.

### Check out our training materials

- `ai_prompt/edunitylab/01_curriculum.md`: Overall training schedule and goals
- `ai_prompt/edunitylab/02_lesson.md`: Detailed lesson plan for instructors (including time allocation, practice examples, and instructor tips)
- `ai_prompt/edunitylab/03_practice task.md`: Practice tasks and guide
- `ai_prompt/edunitylab/04_PTmaterial_detail.md`: Detailed script for slide presentation materials

## Key concepts

### What is an Agent?

Agent is not simply a tool that is good at giving answers, but a system that receives input, makes decisions, and produces execution results.

**Agent Component:**

- **Input**: User request or data
- **Reasoning**: judgment, inference, classification, summary
- **Action**: Use tool, save, notify, call next step
- **Output**: Results or work products provided to users

### Principles for good agent design

1. **Persona Design**: Clearly define roles, judgment criteria, and target audience
2. **Output structure**: Select the format (table, bullet, JSON) that suits your business purpose.
3. **Workflow design**: Handle complex problems by dividing them into steps
4. **Conditional Branching**: Design different processing paths depending on the input.
5. **Automation suitability**: Select tasks with repeatability, regularity, and dataability

## Contribution

This project was developed for educational purposes. Improvement suggestions or bug reports are welcome.

## License

You are free to use it for educational purposes.

## contact

Contact your project manager.
