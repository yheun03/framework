# Development Guide

누가 작업해도 같은 결과가 나오도록 지키는 최소 규칙입니다.

## 1. 기본 원칙

- 기존 스타일 · 네이밍 · 폴더 구조를 따릅니다.
- 요청과 관련 없는 코드는 고치지 않습니다.
- 한 곳에서만 쓰면 그 파일 안에, **두 곳 이상**이면 공통으로 분리합니다.
- console · 임시 코드는 남기지 않습니다.

## 2. 어디에 둘까

| 폴더           | 넣는 것                            |
| -------------- | ---------------------------------- |
| `pages/`       | URL 화면 (파일명 kebab-case)       |
| `components/`  | 재사용 UI (`.vue` 만)              |
| `composables/` | Vue 기능을 쓰는 재사용 로직 `use*` |
| `stores/`      | 여러 화면이 공유하는 상태 (Pinia)  |
| `utils/`       | Vue 와 무관한 순수 함수            |
| `types/`       | 여러 파일이 공유하는 타입          |
| `assets/scss/` | 스타일 (아래 SCSS 규칙)            |

## 3. 컴포넌트

- 공통은 `App` prefix, 기능 묶음은 폴더: `AppGrid/AppGridDownload.vue`
- 페이지 전용은 `components/Page{이름}/`: `PageDemo/content/…`
- UI 와 이벤트에 집중하고, API · 복잡한 상태는 넣지 않습니다.
- 속성 이름은 [COMPONENT_GUIDE](./COMPONENT_GUIDE.md#1-공통-속성) 를 따르고 같은 뜻의 새 이름을 만들지 않습니다.

## 4. 상태 · API · 타입

- **Store**: 공유 상태만. 화면에서는 action / computed 로만 다룹니다.
- **API**: `useApi()` 사용, 주소는 `/api/*`. Axios 설정은 `plugins/axios.ts` 에서만.
- **Type**: 공유 타입은 `types/`, `any` 는 외부 라이브러리 타입이 불분명할 때만.
- **퍼블리싱 데이터**: 페이지 안에 `// temp 데이터` JSON 으로 작성 (API 연동 시 그 영역만 교체).

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

- 화면 문구는 `i18n/ko.ts` · `en.ts` 에 같은 key 로 추가하고 `useI18nText()` 로 사용합니다.
- 새 페이지를 LNB 에 넣을 때는 `stores/navigation.ts` 메뉴 + `nav.*` 문구를 함께 추가합니다.

## 7. 접근성 · SEO

| 규칙                 | 방법                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| 페이지마다 `h1` 하나 | 섹션은 `h2` → `h3` 순서 (`AppSection` · `AppAccordion` 의 `tag`)                 |
| 입력에는 이름        | `label` 또는 `aria-label`. `AppFormField` 안에서는 자동 연결                     |
| 아이콘 버튼          | `AppIconButton aria-label="닫기"`                                                |
| 글자색 대비 4.5:1    | 브랜드 · 상태색을 글자에 쓸 때는 `--theme-primary-text`, `--theme-status-*-text` |
| 포커스 표시          | 전역 `:focus-visible` 유지 (`outline: none` 금지)                                |
| 문서 제목 · 설명     | 데모는 `useDemoI18n()`, 그 외는 `useHead({ title })` (없으면 LNB 메뉴명)         |

## 8. 작업 후 확인

- [ ] 관련 없는 파일을 건드리지 않았다
- [ ] 중복 로직 · 불필요한 composable / util 을 만들지 않았다
- [ ] 문구는 i18n, 색은 의미 변수를 썼다
- [ ] 키보드(Tab)로 조작 가능하고, 360px 에서 가로 스크롤이 없다
