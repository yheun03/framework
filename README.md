# Framework

Nuxt 3 기반의 Jonsoft 웹 퍼블리싱/프론트엔드 공통 프레임워크입니다.

공통 UI 컴포넌트, Pinia store, composable, SCSS 구조, demo 페이지를 포함하며  
새 화면을 만들 때 동일한 방식으로 개발할 수 있도록 기본 구조를 제공합니다.

## Stack

- Nuxt 3 / Vue 3
- Pinia
- Axios
- SCSS
- AG Grid
- Chart.js
- i18n

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run generate
```

## Documents

- 개발 규칙: [`DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md)
- 프로젝트 노트: [`project_note.md`](./project_note.md)

## Directory

```text
components/   공통 UI 컴포넌트
composables/  재사용 로직
stores/       Pinia 상태관리
pages/        Nuxt 라우트 페이지
assets/scss/  SCSS 스타일
types/        공통 타입
utils/        순수 유틸 함수
server/api/   서버 API
```
