# Korea–Nigeria ODA AI·SW Education Portal

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-008751?logo=github)](https://odatot.github.io/nigeria/NA/)
[![Language](https://img.shields.io/badge/Language-KO%20%7C%20EN-0047A0)](#서비스-바로가기)

대한민국과 나이지리아의 디지털 교육 협력을 위한 AI·SW 교육 포털입니다. 10일 집중 과정과 예비창업자 5일 부트캠프의 LMS, 강의 슬라이드, 실습 자료를 한국어와 영어로 제공합니다.

> **Live portal:** <https://odatot.github.io/nigeria/NA/>

## 주요 교육 과정

| 과정 | 대상 | 기간 | 핵심 내용 |
| --- | --- | --- | --- |
| Digital Future Talent Training | 학생·청년 인재 | 10일 | AI 기초, 프롬프트 설계, 웹 개발, 데이터·ERD, MVP 구현 및 발표 |
| Aspiring Founders AI Web App MVP Bootcamp | 예비창업자 | 5일 | 아이디어 구체화, AI 개발 도구, 웹앱 MVP 제작, 품질 개선, 배포 및 피칭 |

각 과정은 학습용 LMS와 강의용 슬라이드를 분리해 운영하며, 한국어·영어 자료를 함께 제공합니다.

## 서비스 바로가기

### 통합 포털

- [한국어 포털](https://odatot.github.io/nigeria/NA/)
- [English portal](https://odatot.github.io/nigeria/NA/index_eng.html)

### 10일 AI·SW 과정

- [한국어 LMS](https://odatot.github.io/nigeria/NA/LMS/docs/)
- [English LMS](https://odatot.github.io/nigeria/NA/LMS_ENG/docs/)
- [한국어 강의 슬라이드](https://odatot.github.io/nigeria/NA/LECTURE/docs/)
- [English lecture slides](https://odatot.github.io/nigeria/NA/LECTURE_ENG/docs/)

### 예비창업자 5일 과정

- [한국어 LMS](https://odatot.github.io/nigeria/NA/aspiring_founders/LMS/)
- [English LMS](https://odatot.github.io/nigeria/NA/aspiring_founders/LMS_ENG/)
- [한국어 강의 슬라이드](https://odatot.github.io/nigeria/NA/aspiring_founders/LECTURE/docs/)
- [English lecture slides](https://odatot.github.io/nigeria/NA/aspiring_founders/LECTURE_ENG/docs/)

## 저장소 구조

```text
docs/NA/
├── index.html                 # 한국어 통합 포털
├── index_eng.html             # 영어 통합 포털
├── LMS/                       # 10일 과정 한국어 LMS·실습 자료
├── LMS_ENG/                   # 10일 과정 영어 LMS·실습 자료
├── LECTURE/                   # 10일 과정 한국어 강의 원본·배포본
├── LECTURE_ENG/               # 10일 과정 영어 강의 원본·배포본
├── aspiring_founders/         # 예비창업자 5일 과정 LMS·강의·커리큘럼
└── ADD_LECTURE/               # 보충 강의와 워크북
```

강의 디렉터리의 `src/`는 편집 원본, `docs/`는 GitHub Pages에 사용할 빌드 결과입니다. `LMS/`와 `LMS_ENG/`에는 일차별 교재, AI Classroom, Codex 미션, 공지와 설문 자료가 포함됩니다.

## 로컬에서 확인하기

별도 패키지 설치 없이 Python의 정적 파일 서버로 전체 포털을 확인할 수 있습니다.

```bash
git clone https://github.com/ODATOT/nigeria.git
cd nigeria
python3 -m http.server 8000 --directory docs
```

브라우저에서 <http://localhost:8000/NA/>를 엽니다.

## 강의 슬라이드 빌드

10일 과정 강의 슬라이드를 수정할 때는 해당 언어의 `src/`를 편집한 뒤 빌드합니다. 빌드 스크립트는 Node.js 표준 모듈만 사용합니다.

```bash
cd docs/NA/LECTURE       # 영어 자료는 LECTURE_ENG
node build.js
```

생성된 결과는 각 디렉터리의 `docs/`에 저장됩니다. 커밋 전에는 로컬 서버에서 링크, 이미지, 모바일 레이아웃을 확인해 주세요.

## 배포

정적 사이트는 저장소의 `docs/` 디렉터리를 기준으로 GitHub Pages에 게시됩니다. 변경 사항이 기본 브랜치에 반영되면 Pages가 공개 포털을 갱신합니다.

배포 전 확인 사항:

1. 한국어·영어 통합 포털의 주요 링크가 열리는지 확인합니다.
2. 수정한 LMS 또는 강의 페이지를 로컬 서버에서 확인합니다.
3. 강의 원본을 수정했다면 `node build.js` 결과도 함께 반영합니다.
4. 개인정보, 계정 정보, API 키가 포함되지 않았는지 확인합니다.

## 기여 방법

1. 목적이 드러나는 브랜치를 만듭니다.
2. 원본 파일과 필요한 빌드 결과를 함께 수정합니다.
3. 로컬에서 한국어·영어 링크와 화면을 확인합니다.
4. 변경 목적과 검증 결과를 적어 Pull Request를 엽니다.

교육 내용, 링크 오류, 번역 개선 제안은 Issue 또는 Pull Request로 남겨 주세요.

## 사용 안내

이 저장소는 교육 운영을 위해 제작되었습니다. 별도 `LICENSE` 파일은 포함되어 있지 않으므로 자료의 복제·수정·재배포가 필요한 경우 프로젝트 관리자에게 사용 범위를 확인해 주세요.

---

## English summary

This repository hosts the Korea–Nigeria ODA AI·SW Education Portal. It provides bilingual LMS content, lecture slides, exercises, and instructor resources for a 10-day digital talent program and a 5-day AI web app MVP bootcamp for aspiring founders.

Start from the [English portal](https://odatot.github.io/nigeria/NA/index_eng.html). To preview the site locally, run `python3 -m http.server 8000 --directory docs` and open <http://localhost:8000/NA/>.
