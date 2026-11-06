# Development Guide

누가 작업해도 같은 결과가 나오도록 지키는 최소 규칙입니다.

## 1. 기본 원칙

- 기존 스타일 · 네이밍 · 폴더 구조를 따릅니다.
- 요청과 관련 없는 코드는 고치지 않습니다.
- 한 곳에서만 쓰면 그 파일 안에, **두 곳 이상**이면 공통으로 분리합니다.
- console · 임시 코드는 남기지 않습니다.

## 2. 어디에 둘까 (모두 `src/` 아래)

| 폴더             | 넣는 것                                       |
| ---------------- | --------------------------------------------- |
| `views/`         | 화면. 파일 경로가 곧 주소 (파일명 kebab-case) |
| `components/`    | 재사용 UI (`.vue` 만)                         |
| `composables/`   | Vue 기능을 쓰는 재사용 로직 `use*`            |
| `store/`         | 여러 화면이 공유하는 상태 (Pinia)             |
| `services/api/`  | axios 클라이언트                              |
| `utils/`         | Vue 와 무관한 순수 함수                       |
| `constants/`     | 여러 파일이 쓰는 상수 · provide 키            |
| `assets/styles/` | SCSS (아래 규칙)                              |

- 언어는 **JavaScript** 입니다. (`.js`, `<script setup>`) — TypeScript 를 쓰지 않습니다.
- import 는 자동이 아니므로 **쓰는 것은 모두 직접 import** 합니다. 경로는 `@/` (= `src/`)
- 레이아웃 없이 보여줄 화면(로그인 등)은 `router/index.js` 의 `ROUTE_META` 에 `layout: false` 를 적습니다.

## 3. 컴포넌트

- 공통은 `App` prefix, 기능 묶음은 폴더: `AppGrid/AppGridDownload.vue`
- 페이지 전용은 `components/Page{이름}/`: `PageDemo/content/…`
- UI 와 이벤트에 집중하고, API · 복잡한 상태는 넣지 않습니다.
- props 는 객체로 선언하고 기본값을 함께 적습니다: `size: { type: String, default: 'md' }`
- 속성 이름은 [COMPONENT_GUIDE](./COMPONENT_GUIDE.md#1-공통-속성) 를 따르고 같은 뜻의 새 이름을 만들지 않습니다.

## 4. 상태 · API

- **Store**: 공유 상태만. 화면에서는 action / computed 로만 다룹니다.
- **API**: `useApi()` 사용 (`services/api/apiClient.js`). 주소는 실행 모드의 `.env` `VITE_API_URL`.
- **퍼블리싱 데이터**: 화면 안에 `// temp 데이터` 로 작성 (API 연동 시 그 영역만 교체).

## 5. SCSS

| 위치               | 용도                                                        |
| ------------------ | ----------------------------------------------------------- |
| `abstract/`        | 변수 · 함수 · mixin 만 (CSS 출력 금지 — 모든 SFC 에 주입됨) |
| `base/`            | 리셋 · 토큰 CSS 변수 · 유틸                                 |
| `components/base/` | 공통 컴포넌트                                               |
| `pages/`           | 페이지 전용                                                 |
| `projects/{key}/`  | 기업 테마 · 전용 스타일                                     |

- 클래스는 BEM: `.app-tag__label`, `.app-tag--soft`, 상태는 `.is-active`
- 색은 HEX 대신 의미 변수(`--color-*`, `--bg-*`, `--border-*`), 글꼴은 `@include font(b2, sb)`
- 반응형은 `@include tablet` (≤1199) / `@include mo` (≤767)

## 6. i18n

- vue-i18n 을 사용합니다. 문구는 `i18n/ko.js` · `en.js` 에 같은 key(`'nav.home'`)로 추가합니다.
- 화면에서는 `useI18nText()` 의 `t(key)` 또는 템플릿 `$t(key)` 로 사용합니다.
- 새 화면을 LNB 에 넣을 때는 `store/navigation.js` 메뉴 + `nav.*` 문구를 함께 추가합니다.

## 7. 접근성

| 규칙                 | 방법                                                                              |
| -------------------- | --------------------------------------------------------------------------------- |
| 페이지마다 `h1` 하나 | 섹션은 `h2` → `h3` 순서 (`AppSection` · `AppAccordion` 의 `tag`)                  |
| 입력에는 이름        | `label` 또는 `aria-label`. `AppFormField` 안에서는 자동 연결                      |
| 아이콘 버튼          | `AppIconButton aria-label="닫기"`                                                 |
| 글자색 대비 4.5:1    | 브랜드 · 상태색을 글자에 쓸 때는 `--theme-primary-text`, `--theme-status-*-text`  |
| 포커스 표시          | 전역 `:focus-visible` 유지 (`outline: none` 금지)                                 |
| 문서 제목            | LNB 메뉴명으로 자동 (`메뉴명 \| 서비스명`). 메뉴에 없으면 `ROUTE_META` 의 `title` |

## 8. 작업 후 확인

- [ ] 관련 없는 파일을 건드리지 않았다
- [ ] 중복 로직 · 불필요한 composable / util 을 만들지 않았다
- [ ] 문구는 i18n, 색은 의미 변수를 썼다
- [ ] `npm run build` 가 성공한다
- [ ] 키보드(Tab)로 조작 가능하고, 360px 에서 가로 스크롤이 없다
