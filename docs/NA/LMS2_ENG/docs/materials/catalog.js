/* 교육 자료 카탈로그 · Training materials catalog (auto-generated) */
window.LMS_MATERIALS = [
 {
  "id": "raising-your-ai",
  "date": "2026-11",
  "place": "Abuja",
  "ko": {
   "kicker": "특강 01 · 보너스 반나절",
   "title": "Raising Your AI",
   "sub": "AI 키우기",
   "desc": "환각(Hallucination)에서 하네스(Harness)까지, AI가 어떻게 변해 왔는지 흐름을 정리하고 끝까지 남는 경쟁력인 '나만의 노하우'를 이야기합니다.",
   "tags": [
    "환각·RAG",
    "프롬프트·MCP",
    "에이전트",
    "컨텍스트 엔지니어링",
    "스킬·하네스",
    "1분 스피치"
   ]
  },
  "en": {
   "kicker": "Bonus Lecture 01 · Half day",
   "title": "Raising Your AI",
   "sub": "From hallucination to harness",
   "desc": "What changed in AI, from hallucination to harness, and what still matters most: your own know-how. Short talks, then you think and speak.",
   "tags": [
    "Hallucination & RAG",
    "Prompts & MCP",
    "Agents",
    "Context engineering",
    "Skills & harness",
    "1-min speech"
   ]
  },
  "slides": [
   {
    "t": "Raising Your AI",
    "n": "Welcome. This is a bonus half day. In Week 1 you used many AI words. Today we put them in order, and then I will tell you what I believe matters most after many years of building AI systems."
   },
   {
    "t": "Short talks, then you think and speak",
    "n": "No coding today. For every idea we ask four questions: what does the word mean, why did it appear, who led it, and what happened in the real world."
   },
   {
    "t": "THE STORY",
    "n": "Ask the room: what does a clever graduate need on their first day? Collect answers: files, tools, rules, a manager, a desk. Each answer maps to one idea we will see."
   },
   {
    "t": "What each idea gave the new employee",
    "n": "Who led each one: hallucination as an AI term from about 2000, famous with ChatGPT in 2022; RAG, Facebook AI 2020, popularised by Perplexity; prompts, OpenAI GPT-3 2020 and Google chain of thought; tools, ReAct 2022 and OpenAI 2023; MCP, Anthropic Nov 2024; agents, AutoGPT 2023 to Codex 2025; context engineering, Lütke and Karpathy June 2025; skills, Anthropic Oct 2025; harness, coding-agent builders 2025; skill stacks, gstack and pstack 2026. Ask: which of these did you already use in Week 1? Almost all."
   },
   {
    "t": "It predicts the next word",
    "n": "Keep this to two minutes. Everything today follows from this slide: because it predicts likely words, it can sound right and be wrong (hallucination); because it has a cutoff and no access to your files, we give it documents (RAG) and tools. Optional clip: Karpathy, Intro to Large Language Models."
   },
   {
    "t": "A confident answer that is false or made up",
    "n": "Who named it: vision researchers used the word around 2000; Google used it for machine translation in 2018; everyone met it with ChatGPT in November 2022. Some scientists prefer “confabulation”. Video: IBM Technology, Why Large Language Models Hallucinate, youtube.com/watch?v=cfqtFvWOfg0"
   },
   {
    "t": "When hallucination cost real money",
    "n": "Trainer know-how: add a real case from legal AI here. Lesson: the company is responsible for what its AI says. This is why Day 2 asked for evidence on every OBS card."
   },
   {
    "t": "Retrieval‑Augmented Generation",
    "n": "A normal model takes a closed-book exam. A RAG system takes an open-book exam. Perplexity did not invent RAG, but it was one of the first to make it a popular product. Video: IBM Technology, What is RAG?, youtube.com/watch?v=T-D1OfcDW1M"
   },
   {
    "t": "RAG: look it up first, then answer",
    "n": "Retrieval-Augmented Generation. The new employee now has the company files. But if the files are wrong, the answer is wrong with a source attached."
   },
   {
    "t": "Videos for hallucination and RAG",
    "n": "Play a 3 to 5 minute clip only. Test the room’s internet first; if it is slow, tell the story yourself."
   },
   {
    "t": "A 1‑minute speech in four steps",
    "n": "Show this slide before round 1. Trainer corrects ideas and facts, not English. Keep time strictly: 1 minute each."
   },
   {
    "t": "Sentence starters you can borrow",
    "n": "Leave this slide up during the first speech round. Good English is not the goal; a clear answer with one example is."
   },
   {
    "t": "Choose one. Think 1 minute. Speak 1 minute.",
    "n": "Shape: Point, Reason, Example, Point. Partner gives one strength and one question. Then two volunteers speak to the room."
   },
   {
    "t": "From magic words to clear requests",
    "n": "History: GPT-3 (OpenAI, 2020) showed few-shot prompting; Google’s chain of thought (2022): “Let’s think step by step”. Why it faded: InstructGPT (2022) learned to follow plain instructions; o1 (2024) reasons by itself."
   },
   {
    "t": "From talking to acting",
    "n": "Prices are an example only. Karpathy’s Intro to LLMs video has a clear section where the model uses a browser, a calculator and Python."
   },
   {
    "t": "One common language for every tool",
    "n": "Designed by David Soria Parra and Justin Spahr-Summers, inspired by Microsoft’s Language Server Protocol (2016). When your rivals adopt your standard, it has won. Video: Anthropic, The Model Context Protocol, youtube.com/watch?v=CQywdSdi5iA"
   },
   {
    "t": "An AI that can act can be tricked",
    "n": "The Nigeria Data Protection Act was signed in June 2023 and set up the Nigeria Data Protection Commission (NDPC). Prompt injection is the main new risk of agents and MCP. Every tool you connect is a door: open only the doors the task needs."
   },
   {
    "t": "Videos for tools and MCP",
    "n": "Play a 3 to 5 minute clip only."
   },
   {
    "t": "Choose one. Think 1 minute. Speak 1 minute.",
    "n": "Shape: Point, Reason, Example, Point. Two volunteers speak to the room afterwards."
   },
   {
    "t": "A chatbot talks. An agent does the work.",
    "n": "Agent = someone who acts for you, like a travel agent. What changed between 2023 and 2025: better tool use, real tests (SWE-bench, Princeton 2023), lower cost and better harnesses. Video: Andrew Ng, What’s next for AI agentic workflows, youtube.com/watch?v=sal78ACtGTc"
   },
   {
    "t": "One goal, many steps, until done",
    "n": "Point at the circle: think, act, look, check. In 2023 agents went round this loop and got lost. In 2025 they mostly come back with a working result, because models, tools and harnesses got better. When the check says done, the agent reports what changed and shows proof, like a passing test."
   },
   {
    "t": "Deep research: from headline to everyday",
    "n": "Use this to land the main message: features you can download become ordinary very fast. Ask: if a big company’s headline feature lasted less than two years as a “special” thing, how long will a clever prompt last? What lasts is your own know-how."
   },
   {
    "t": "What is on the AI’s desk?",
    "n": "Named in June 2025 by Tobi Lütke (Shopify CEO); Andrej Karpathy: “the delicate art and science of filling the context window with just the right information for the next step.” Why it matters: agents run 50 to 100 steps and the desk fills up; facts in the middle get missed (2023) and accuracy drops as input grows (“context rot”, 2025). Video: Tina Huang, Context Engineering Clearly Explained, youtube.com/watch?v=jLuwLJBQkIs"
   },
   {
    "t": "Everything the AI sees, in one picture",
    "n": "Walk through it left to right. Outside the desk: documents, tools, skills and memory. Select brings only what this step needs onto the desk. Write saves notes back out so nothing important is lost. The model reads the whole desk and acts; the result comes back onto the desk, so the desk keeps growing. That is why we compress history and tool results, and why big jobs go to a sub-agent with its own desk. Bigger is not better: models miss facts in the middle of long input (Lost in the Middle, 2023) and get worse as input grows (context rot, 2025)."
   },
   {
    "t": "Four ways to keep the desk tidy",
    "n": "The four moves are from LangChain’s 2025 write-up on context engineering. Longer talk: Context Engineering for Agents, youtube.com/watch?v=4GiqzUHD5AA"
   },
   {
    "t": "Skills: an expert’s method in a file",
    "n": "Agent Skills: Anthropic, Oct 2025; an open standard from Dec 2025 that others like Codex can read. A skill’s power is not secret words. It is someone’s experience, written down. Video: Claude Agent Skills Explained, youtube.com/watch?v=fOxC44g8vig"
   },
   {
    "t": "Harness: the office around the AI",
    "n": "The model is the horse; the harness is how you ride it. Anthropic’s Nov 2025 advice for long tasks: feature list, progress file, a commit per step, tests before “done”. pstack changes fast: check its details before class. Video: Karpathy, Software Is Changing (Again), the “autonomy slider” part, youtube.com/watch?v=LCEmiRjPEtQ"
   },
   {
    "t": "Model = horse. Harness = how you ride.",
    "n": "Everything in the dashed line is the harness. Claude Code, Codex and Antigravity give you a harness; your rules, memory and tests make it yours. Ask: which of these did you set up in Week 1? (Rules file, Git, tests, and you as the reviewer.)"
   },
   {
    "t": "gstack and pstack, side by side",
    "n": "Both prove the main message: the value is one person’s experience, written down and checked by the environment. Trainer know-how: which parts I would keep, and which rules I would write myself."
   },
   {
    "t": "Videos for Era 3",
    "n": "Pick one or two in class; give the rest as homework."
   },
   {
    "t": "Choose one. Think 1 minute. Speak 1 minute.",
    "n": "Shape: Point, Reason, Example, Point. Two volunteers speak to the room afterwards."
   },
   {
    "t": "The employee, the desk, the office",
    "n": "Ask one student to explain the picture back in 30 seconds. This leads straight into the next slide: the pattern."
   },
   {
    "t": "THE PATTERN",
    "n": "Pause here. This is the bridge from history to my own opinion."
   },
   {
    "t": "What everyone has, and what only you can have",
    "n": "Message for founders and investors: your advantage is the know-how you put into the environment, plus evidence that it works for your users. Trainer know-how: something in my work that was hard to copy, and why."
   },
   {
    "t": "Raise it: correct, write down, repeat",
    "n": "We say raise, not program. You never get it right on day one."
   },
   {
    "t": "Nothing here is a trick",
    "n": "MarketMate is a made-up example. Ask: which line stops which mistake?"
   },
   {
    "t": "FINAL SPEECH · 2 MINUTES EACH",
    "n": "Review partner times and asks one follow-up question. Trainer know-how: give your own 2-minute answer first, as a model."
   },
   {
    "t": "TO REMEMBER",
    "n": "End with your own closing message, one or two sentences you want trainees to repeat to their students."
   }
  ],
  "count": 38
 },
 {
  "id": "less-is-more",
  "date": "2026-11",
  "place": "Abuja",
  "ko": {
   "kicker": "특강 02 · 보너스 강의",
   "title": "Less Is More",
   "sub": "적을수록 좋다",
   "desc": "더 똑똑해진 AI에는 왜 더 짧은 프롬프트가 필요할까요? 모델에게 '많이 먹여주던' 방식에서 '방향을 안내하는' 방식으로 바뀐 이유를 사례로 살펴봅니다.",
   "tags": [
    "프롬프트 길이",
    "Lost in the middle",
    "규칙 → 판단",
    "The Bitter Lesson",
    "pstack",
    "1분 스피치"
   ]
  },
  "en": {
   "kicker": "Bonus Lecture 02",
   "title": "Less Is More",
   "sub": "Why smarter AI needs slimmer prompts",
   "desc": "Why smarter AI needs slimmer prompts: from feeding the model to guiding it. Real cases, research findings and new prompt rules.",
   "tags": [
    "Prompt length",
    "Lost in the middle",
    "Rules → judgement",
    "The Bitter Lesson",
    "pstack",
    "1-min speech"
   ]
  },
  "slides": [
   {
    "t": "Less Is More",
    "n": "Welcome. In \"Raising Your AI\" we saw how AI grew up. Today is one idea from that story, and from my own work: as models got smarter, the way to control them flipped."
   },
   {
    "t": "OPENING QUESTION",
    "n": "Count the hands. Most people say yes, or it depends. Say: in 2023 the honest answer was mostly yes. In 2026 the honest answer is mostly no. Today we see why."
   },
   {
    "t": "Five parts, two speeches",
    "n": "Same format as Raising Your AI: one minute to think, one minute to speak, Point, Reason, Example, Point."
   },
   {
    "t": "Six words you will see today",
    "n": "Give one minute to read. These six words come back on almost every slide."
   },
   {
    "t": "The model is weak, so help it with more",
    "n": "Ask: who wrote a prompt with ALWAYS or NEVER in capitals in Week 1?"
   },
   {
    "t": "Short, then long, then short again",
    "n": "Early models could not follow instructions, so you showed them a pattern. Later models could follow instructions, so prompts became long rule books. Today’s models have good judgement, so short guides work best."
   },
   {
    "t": "Legal AI: which law applies to this case?",
    "n": "Tell it in the first person. The hard part of law is not finding the law; it is applying it to this exact situation. Cases and interpretations help, so I used RAG. But law is full of exceptions, so there was always one more case to add. And the more cases I added, the more the model mixed them up. Then a new model came out and the problem almost disappeared."
   },
   {
    "t": "More cases, more errors",
    "n": "Say clearly this is a picture of what I saw, not a published chart. The next slides show that researchers found the same pattern."
   },
   {
    "t": "From feeding the AI to guiding it",
    "n": "This is the core of the lecture. If you have a real example from legal work, put it in the box. Keep client details out."
   },
   {
    "t": "It was not just my system",
    "n": "Two numbers to remember. RAG helped, but did not fix legal answers. And length itself hurts."
   },
   {
    "t": "On hard cases, the model follows the majority",
    "n": "Tell it in the first person. The AI had to judge whether a law applies to a case. On easy cases it reasoned well. On very hard ones it leaned to the majority of the cases I gave it. More yes cases, more yes answers; more no cases, more no answers. In RAG we think similarity is everything, but the pile of cases quietly votes. The squares are an illustration, not real counts."
   },
   {
    "t": "“LLMs follow the herd”",
    "n": "Zhao, Wallace, Feng, Klein, Singh, “Calibrate Before Use”, ICML 2021. Xie, Zhang, Chen, Lou, Su, “Adaptive Chameleon or Stubborn Sloth”, ICLR 2024. One more reason “more cases” failed: a bigger pile adds votes, not just noise. Newer models are less swayed, but run the flip test before you trust a system."
   },
   {
    "t": "Long inputs blur, and rules collide",
    "n": "Rule clash example is real: Anthropic found “leave documentation as appropriate” and “DO NOT add comments” in the same request."
   },
   {
    "t": "Examples box it in, shouting backfires",
    "n": "Attention budget is Anthropic’s phrase, from “Effective context engineering for AI agents”, 2025."
   },
   {
    "t": "Where is the answer in the input?",
    "n": "So if you paste 120 court cases, the important one may sit in the middle, where the model pays least attention. Newer models are better at this, but the lesson stays: fewer, better pieces."
   },
   {
    "t": "Day one at a new job",
    "n": "Link back to the \"new employee\" story from Raising Your AI. Ask: which manager would you rather work for?"
   },
   {
    "t": "Choose one. Think 1 minute. Speak 1 minute.",
    "n": "Shape: Point, Reason, Example, Point. Partner gives one strength and one question. Then two volunteers speak to the room."
   },
   {
    "t": "Anthropic deleted 80% of Claude Code’s hidden instructions",
    "n": "Why? In his words: “we found that we were overconstraining Claude Code.” Newer models “have better judgement and can handle these decisions well without explicit rules.”"
   },
   {
    "t": "Rules out, judgement in",
    "n": "Point at the first one: the old rule was a list of NEVERs. The new one says the goal, fit in with the code around you, and trusts the model to work out the details. The second one: 9,100 characters became a few lines."
   },
   {
    "t": "Old habit → new rule, with an example",
    "n": "Source: Anthropic, 24 July 2026. “Load only when needed” is Anthropic’s “progressive disclosure”, the same idea as skills."
   },
   {
    "t": "Everyone found the same thing",
    "n": "Sources: OpenAI Reasoning best practices (Feb 2025); OpenAI GPT-5 Prompting Guide (Aug 2025); DeepSeek-R1 paper (Jan 2025); Anthropic, Effective context engineering for AI agents (Sept 2025): “the smallest possible set of high-signal tokens”."
   },
   {
    "t": "The Bitter Lesson (Richard Sutton, 2019)",
    "n": "Sutton is a founder of reinforcement learning. His one-page essay uses chess, Go, speech recognition and computer vision as examples. The third card is our application of his idea, not his words."
   },
   {
    "t": "Slim is not the same as safe",
    "n": "Anthropic reported no loss on its own coding tests. Developer reports: IBTimes Singapore, 28 July 2026, based on online discussion."
   },
   {
    "t": "Five things that stay",
    "n": "Number 1 is Anthropic’s own example from its prompting guide: a model that knows why can handle cases you never wrote down. Number 3: Anthropic says spend most of your CLAUDE.md on gotchas."
   },
   {
    "t": "Feed it vs guide it",
    "n": "The traps here are made up for teaching. Replace them with real ones from your legal work if you can."
   },
   {
    "t": "The old ways are not dead",
    "n": "Give this as your own opinion. We do not always use the biggest model. A law firm or hospital may need an on-premise sLLM because data cannot leave the building. A local model on a laptop works offline. For those models, few-shot, step-by-step and careful RAG matter more. Knowing why each old technique was invented is your strength: you know when to bring it back. Always test, because the same prompt can help one model and hurt another."
   },
   {
    "t": "Put rules where they cannot be skipped",
    "n": "pstack is not mainly about short prompts. It is about where rules live: as high in this stack as possible. A correction that lives only in the chat “is invisible to the next session.” Same message as Anthropic: keep the prompt light, put the hard rules in code and checks."
   },
   {
    "t": "Choose one. Think 1 minute. Speak 1 minute.",
    "n": "Starters: The key point is… This matters because… For example, in my business… So my rule would be…"
   },
   {
    "t": "Videos for this lecture",
    "n": "The first link was found embedded in a news article about the prompt cut; I could not play it from here, so please check it."
   },
   {
    "t": "TO REMEMBER",
    "n": "Finish with the opening question again: is a longer prompt a better prompt? Ask for hands. Then the closing line."
   },
   {
    "t": "Where the facts come from",
    "n": "Full links are in the textbook’s reference list."
   }
  ],
  "count": 31
 }
];
