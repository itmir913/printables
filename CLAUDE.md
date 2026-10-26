# CLAUDE.md

## 이 저장소는 무엇인가

교실에서 쓰는 인쇄물을 웹으로 공개하는 저장소다. `luminousky.com/printables/` 아래에 열린다.
**폴더 이름이 그대로 공개 주소다.**

```
printables/
├─ index.html                  → /printables/                     허브: 분야마다 바로가기 하나 (자료는 늘어놓지 않는다)
├─ admissions/                 → /printables/admissions/          분야 바로가기 (진학)
│  ├─ index.html
│  ├─ interview-guide/         → /printables/admissions/interview-guide/      자료
│  └─ interview-questions/     → /printables/admissions/interview-questions/  자료
├─ shared/
│  ├─ viewer/                  인쇄물 공용 뷰어 — 모든 자료가 연다
│  │  ├─ viewer.js · viewer.css   조작 막대(상위·목차·면 번호·배율·단일/두 페이지·표지 별도·인쇄)
│  │  ├─ markdown.js           .md 원고 → 면 (<!-- page --> 로 면을 나눈다)
│  │  └─ manuscript.css        자기 면 양식이 없는 새 자료의 기본 A4 면
│  ├─ catalog.js               공개 자료 목록 — 바로가기 쪽의 내용은 전부 여기서 나온다
│  ├─ art.js                   카드 그림
│  ├─ landing.js               허브·분야 쪽을 그리는 양식
│  ├─ landing.css · site.css   Tailwind 진입점과 팔레트
└─ vite.config.js              폴더의 index.html 을 저절로 찾는다. 고치지 않는다
```

- **허브 → 분야 → 자료의 3단까지만** 둔다. 자료를 다른 분야로 옮기면 이미 나눠 준 링크가
  끊긴다. Pages 에는 서버 리디렉션이 없다. 폴더 이름은 영문 소문자 kebab-case 로 짓는다.
- 바로가기 쪽(허브·분야)은 HTML 에 내용을 적지 않는다. `<body data-category="…">` 하나만 두고
  `catalog.js` 를 `landing.js` 가 그린다. 디자인은 「인쇄 교정지」 양식이다 — 흰 종이, 1px 잉크 괘선,
  네 귀퉁이의 재단선, 모노스페이스 판형 표시. 그라데이션과 흐린 장식은 두지 않는다.
  분야 팔레트는 바탕을 거의 흰 종이로 두고, 색은 글자와 `--accent` 에만 쓴다.
- 자료 폴더는 서로 독립이다. 자기 CSS·JS 를 가지고, 다른 자료를 가져다 쓰지 않는다.
  (예외: 문제은행은 짝인 가이드북 폴더의 스타일을 읽는다 — 그 폴더 CLAUDE.md 참고)
- **화면 조작은 모든 자료가 `shared/viewer/` 하나를 쓴다.** 자료마다 인쇄 단추나 조작 막대를
  따로 두지 않는다 — 자료가 수십 개가 되어도 UX 가 갈라지지 않게 하려는 것이다.
  면(`.page`)의 크기·생김새·면 번호는 자료가 정하고, 뷰어는 면을 늘어놓기만 한다.
  자료 의존 기능(예: 「본문만 / 부록만」 인쇄 범위)은 뷰어에 넣지 않는다.
  `shared/` 의 바로가기 쪽 파일(catalog·landing·art·site.css)은 여전히 인쇄물이 쓰지 않는다.
- 자료 폴더에 CLAUDE.md 가 있으면 그 파일이 이 문서보다 우선한다.

## 넓히는 법

**자료를 더할 때** (예: 진학 분야에 학종 설계도)
1. `admissions/hakjong-blueprint/index.html` 을 만든다. 인쇄물 자체의 CSS·JS 도 그 폴더에 둔다.
   면을 다 붙인 뒤 뷰어를 붙인다.
   ```html
   <script type="module">
   import { mountViewer } from '../../shared/viewer/viewer.js';
   mountViewer({ title: '학종 설계도' });   // back · tocFrom · cover · checkOverflow 는 viewer.js 머리 주석
   </script>
   ```
   원고를 .md 로 쓰려면 `pagesFromMarkdown(원고)` 로 면을 만들고 `shared/viewer/manuscript.css` 를
   연 뒤 `mountViewer({ checkOverflow: true })` 를 부른다. 넘친 면은 화면에 붉은 점선으로 보인다.
2. `shared/catalog.js` 의 진학 분야 `groups[].items` 에 한 줄을 더한다 (path · tag · name · copy).
   묶음이 새로 필요하면 `groups` 에 하나를 더한다 — 분야 쪽에 섹션이 하나 생긴다.
3. 카드 그림을 따로 그리려면 `shared/art.js` 에 함수를 더하고 `art` 에 그 이름을 적는다.
   적지 않으면 자료 이름을 적은 A4 면 그림이 들어간다.

**분야를 더할 때** (예: CS 동아리)
1. `cs-club/index.html` — `admissions/index.html` 을 복사해 `data-category` · `<title>` ·
   description 만 바꾼다.
2. `shared/catalog.js` 의 `CATEGORIES` 에 분야를 더한다. `tone` 은 blue · pink · violet · plum · peach
   가운데 고른다. 허브에 그 분야의 바로가기 카드가 하나 저절로 생긴다.
3. 그 아래 자료는 위와 같다.

`vite.config.js` 와 배포 워크플로는 고치지 않는다. 폴더에 `index.html` 이 있으면 빌드·배포에 들어간다.

## 명령

```bash
npm run dev       # 개발 서버. http://localhost:5173/printables/admissions/
npm run build     # dist/ 생성
npm run preview   # dist/ 를 열어 본다
```

폴더에 `index.html` 을 두면 저절로 빌드에 들어간다. `vite.config.js` 는 고치지 않는다.

## 배포

`.github/workflows/deploy-pages.yml` 을 **손으로 실행할 때만** 배포한다. push 로는 배포하지 않는다.

```bash
gh workflow run "Deploy to GitHub Pages"
```

## 두 종류의 CSS

- **인쇄물**(가이드북 등)은 Tailwind 3 CDN 으로 만들어졌다. 자기 폴더의 `tailwind.css` 가
  층 없이 style.css → Preflight → 유틸리티 순으로 묶어 CDN 시절의 면을 그대로 지킨다.
  그 순서를 건드린 뒤에는 이전 커밋과 면을 대조한다 (면 수, 넘친 면, 요소 위치).
- **바로가기 쪽**은 `shared/landing.css`(→ `site.css`) 하나를 여는 Tailwind 4 표준 구성이다.
- 진입점마다 `source(none)` + `@source` 로 자기 쪽만 훑는다. 다른 쪽의 클래스가 섞이지 않는다.

## 커밋

`.githooks/commit-msg` 가 생성 도구 서명 줄(Co-Authored-By 등)을 지운다. 클론한 뒤 한 번:

```bash
git config core.hooksPath .githooks
```
