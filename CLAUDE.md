# CLAUDE.md

## 이 저장소는 무엇인가

교실에서 쓰는 인쇄물을 웹으로 공개하는 저장소다. `luminousky.com/printables/` 아래에 열린다.
**폴더 이름이 그대로 공개 주소다.**

```
printables/
├─ admissions/                 → /printables/admissions/          진학 분야 바로가기
│  ├─ index.html · index.css
│  ├─ interview-guide/         → /printables/admissions/interview-guide/
│  └─ interview-questions/     → /printables/admissions/interview-questions/
├─ shared/site.css             바로가기 쪽이 함께 쓰는 Tailwind 바탕
└─ vite.config.js
```

- **분야(admissions 등) → 자료(interview-guide 등)의 3단까지만** 둔다. 자료를 다른 분야로 옮기면
  이미 나눠 준 링크가 끊긴다. Pages 에는 서버 리디렉션이 없다.
- 분야 폴더에는 바로가기 `index.html` 을 둔다. 디자인은 Teacher Utility Kit 홈과 같은 양식이다.
- 자료 폴더에 CLAUDE.md 가 있으면 그 파일이 이 문서보다 우선한다.

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
- **바로가기 쪽**은 `shared/site.css` 를 가져오는 Tailwind 4 표준 구성이다.
- 진입점마다 `source(none)` + `@source` 로 자기 쪽만 훑는다. 다른 쪽의 클래스가 섞이지 않는다.

## 커밋

`.githooks/commit-msg` 가 생성 도구 서명 줄(Co-Authored-By 등)을 지운다. 클론한 뒤 한 번:

```bash
git config core.hooksPath .githooks
```
