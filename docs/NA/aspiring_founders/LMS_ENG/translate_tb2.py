import re

def translate_day2_textbook():
    path = 'ODA_AI_SW/docs/NA/aspiring_founders/LMS_ENG/day2/day2-textbook.html'
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    text = re.sub(r'<title>.*?</title>', '<title>Day 2 Self-Study Textbook | Aspiring Founders AI Web App MVP Bootcamp</title>', text)
    text = text.replace('🏠 LMS 홈', '🏠 LMS Home')
    text = text.replace('🏫 AI 강의실', '🏫 AI Classroom')
    text = text.replace('📖 강의 Textbook', '📖 Textbook')
    text = text.replace('📋 Day 2 교육운영', '📋 Day 2 Operations')
    text = text.replace('팀명', 'Team Name')
    text = text.replace('안티그래비티 및 코덱스 실습 계정 확인', 'Check Antigravity and Codex practice accounts')
    text = text.replace('🔑 AI Account 확인', '🔑 AI Accounts')
    
    text = text.replace('<span class="badge">Day 2 자율 Textbook</span>', '<span class="badge">Day 2 Textbook</span>')
    text = text.replace('<strong>AI와 프로젝트 기획하기 자율 학습 가이드북</strong>', '<strong>Project Planning with AI Self-Study Guide</strong>')
    text = text.replace('🏫 AI 자율 학습 강의실 돌아가기', '🏫 Return to AI Classroom')
    text = text.replace('🖨️ Textbook 인쇄 / PDF 저장', '🖨️ Print / Save as PDF')
    
    text = text.replace('ACE AI Startup Bootcamp · Day 2 Self-Study Textbook', 'ACE AI Startup Bootcamp · Day 2 Self-Study Textbook')
    text = text.replace('<h1 class="doc-title">AI와 프로젝트 기획하기</h1>', '<h1 class="doc-title">Project Planning &amp; Architecture with AI</h1>')
    
    text = text.replace('<h2>1. 교육 개요 및 핵심 학습 목표</h2>', '<h2>1. Overview &amp; Core Learning Objectives</h2>')
    text = text.replace('<h2>2. PROJECT.md 14개 표준 섹션 구조</h2>', '<h2>2. The 14 Standard Sections of PROJECT.md</h2>')
    text = text.replace('<h2>3. 핵심 기능 3~5개 선정 원칙</h2>', '<h2>3. Principles for Selecting 3–5 Core Features</h2>')
    text = text.replace('<h2>4. User Flow 및 데이터 모델 설계</h2>', '<h2>4. User Journey &amp; Data Model Design</h2>')
    text = text.replace('<h2>5. 실습 단계별 프롬프트 가이드</h2>', '<h2>5. Step-by-Step Prompt Guide</h2>')
    text = text.replace('<h2>6. 안전 원칙 및 자주 묻는 질문 (FAQ)</h2>', '<h2>6. Security Principles &amp; FAQ</h2>')
    
    # Generic Korean content replacements
    text = text.replace('아이디어를 AI가 이해할 수 있는 구체적인 기획 명세서(PROJECT.md)로 작성하는 가이드입니다.', 'A comprehensive guide for structuring raw founder ideas into build-ready engineering specifications in PROJECT.md.')
    text = text.replace('프로젝트 개요 및 문제 정의', 'Project Overview & Problem Statement')
    text = text.replace('타깃 사용자 페르소나 정의', 'Target User Persona & Pain Points')
    text = text.replace('핵심 가치 제안 (Value Prop)', 'Core Value Proposition')
    text = text.replace('핵심 기능 3~5개 상세 명세', '3–5 Core Feature Specifications')
    text = text.replace('사용자 여정 및 흐름도 (User Flow)', 'End-to-End User Flow')
    text = text.replace('화면 목록 및 레이아웃 구성', 'Screen Catalog & Wireframe Layouts')
    text = text.replace('데이터 모델 및 JSON 스키마', 'Data Models & LocalStorage Schema')
    text = text.replace('예외 처리 및 엣지 케이스', 'Error Recovery & Edge Case Handling')
    text = text.replace('수익 모델 및 비즈니스 트랙', 'Monetization & Business Track')
    text = text.replace('Antigravity 개발 핸드오프 체크리스트', 'Antigravity Development Handoff Checklist')

    # Prompts
    text = text.replace('📌 Codex 기획 프롬프트:', '📌 Codex Planning Prompt:')
    text = text.replace('📌 Codex 사용자 여정 프롬프트:', '📌 Codex User Flow Prompt:')
    text = text.replace('📌 Codex 데이터 모델 프롬프트:', '📌 Codex Data Model Prompt:')
    text = text.replace('📌 Codex 핸드오프 검증 프롬프트:', '📌 Codex Handoff Validation Prompt:')

    # Modal
    text = text.replace('AI 실습 계정 정보', 'AI Practice Account Credentials')
    text = text.replace('배정된 도구 계정 목록', 'Assigned Practice Tool Accounts')
    text = text.replace('안티그래비티 (Google AGY)', 'Antigravity (Google AGY)')
    text = text.replace('개발 도구', 'Dev Tool')
    text = text.replace('비밀번호 (Password)', 'Password')
    text = text.replace('코덱스 (OpenAI Codex)', 'Codex (OpenAI Codex)')
    text = text.replace('기획·검증 도구', 'Planning &amp; QA Tool')
    text = text.replace('안티그래비티 ID가 복사되었습니다!', 'Antigravity ID copied!')
    text = text.replace('안티그래비티 비밀번호가 복사되었습니다!', 'Antigravity Password copied!')
    text = text.replace('코덱스 ID가 복사되었습니다!', 'Codex ID copied!')
    text = text.replace('코덱스 비밀번호가 복사되었습니다!', 'Codex Password copied!')
    text = text.replace('title="비밀번호 보기/숨기기"', 'title="Show/Hide Password"')
    text = text.replace('>복사<', '>Copy<')
    text = text.replace('>닫기<', '>Close<')
    text = text.replace("user.name + ' 전용 AI 도구 계정'", "user.name + ' Dedicated AI Tools Account'")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

translate_day2_textbook()
print('day2-textbook.html translated!')
