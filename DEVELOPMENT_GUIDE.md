# Development Guide

누가 작업해도 같은 결과가 나오도록 지키는 최소 규칙입니다.

## 1. 기본 원칙

- 기존 스타일 · 네이밍 · 폴더 구조를 따릅니다.
- 요청과 관련 없는 코드는 고치지 않습니다.
- 한 곳에서만 쓰면 그 파일 안에, **두 곳 이상**이면 공통으로 분리합니다.
- console · 임시 코드는 남기지 않습니다.

## 1-1. 화면 개발 순서

| 단계           | 하는 일                                                                                                                                  | 결과                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1. 유형 고르기 | 목록 · 등록/수정 · 마스터-디테일 · 선택 팝업 중 가장 가까운 것 ([COMPONENT_GUIDE 4장](./COMPONENT_GUIDE.md#4-작성-패턴--표준-화면-유형)) | 복사할 템플릿             |
| 2. 퍼블리싱    | 템플릿 복사 → 메뉴(`MENU_SEED` + `nav.*`) → `// temp 데이터` 로 화면 완성                                                                | 백엔드 없이 동작하는 화면 |
| 3. API 연동    | `// temp 데이터` ~ `// temp 데이터 끝` 만 교체 (`fetch` · `setForm` · `api.post`)                                                        | 화면 구조는 그대로        |
| 4. 확인        | 아래 8장 체크리스트 + `npm run check`                                                                                                    | 커밋 · PR                 |

- 퍼블리셔와 개발자가 나눠 작업해도 2 → 3 경계가 `// temp 데이터` 주석 하나로 정해집니다. temp 영역 밖에 임시 코드를 두지 않습니다.
- 화면 유형에 없는 새 패턴이 두 화면 이상에서 필요하면 템플릿(`views/demos/demo-page-*.vue`)과 이 문서에 먼저 추가합니다.

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
- 상세 화면은 `views/{목록}/[id].vue` (주소 `/{목록}/:id`, 화면에서 `useRoute().params.id`). `?id=` 쿼리로 상세를 만들지 않습니다.
- 레이아웃 없이 보여줄 화면(로그인 등)은 `router/index.js` 의 `ROUTE_META` 에 `layout: false` 를 적습니다.
- 상단 탭(최근 방문)은 레이아웃이 있는 화면을 모두 기록합니다. 탭에서 빼려면 `ROUTE_META` 에 `tab: false` 를 적습니다.
- 화면 하단 고정 버튼(저장 · 취소 등)은 `components/Layout/LayoutBottomBar.vue` 를 씁니다. (`#left` · `#right` 슬롯)

## 3. 컴포넌트

- 공통은 `App` prefix, 기능 묶음은 폴더: `AppGrid/AppGridDownload.vue`
- 페이지 전용은 `components/Page{이름}/`: `PageDemo/content/…`
- UI 와 이벤트에 집중하고, API · 복잡한 상태는 넣지 않습니다.
- props 는 객체로 선언하고 기본값을 함께 적습니다. 값이 정해진 prop 은 `utils/props.js` 의 `oneOf` 로 검사합니다.
  `size: { type: String, default: 'md', validator: oneOf(SIZES) }`
- 새 prop 을 만들면 데모 Props 패널(`components/PageDemo/content/PageDemoPropsSummary.vue`)에도 적습니다. (`npm run check:props`)
- 속성 이름은 [COMPONENT_GUIDE](./COMPONENT_GUIDE.md#1-공통-속성) 를 따르고 같은 뜻의 새 이름을 만들지 않습니다.

## 4. 상태 · API · 로그인

- **Store**: 공유 상태만. 화면에서는 action / computed 로만 다룹니다.
- **API**: `useApi()` 사용 (`services/api/apiClient.js`). 주소는 실행 모드의 `.env` `VITE_API_URL`.
    - 여러 화면이 같은 API 를 쓰면 도메인별 파일로 모읍니다. (`services/api/workOrderApi.js`)

        ```js
        export const workOrderApi = {
            list: (params) => apiClient.get('/work-orders', { params }),
            get: (id) => apiClient.get(`/work-orders/${id}`),
            save: (form) => (form.id ? apiClient.put(`/work-orders/${form.id}`, form) : apiClient.post('/work-orders', form)),
        };
        ```

    - `{ data }` 로 감싼 응답은 `data` 만 돌려줍니다.
    - 오류는 서버 `message` 로 **오류 토스트를 자동으로** 띄웁니다. 화면에서 직접 처리하려면 `{ toast: false }` 후 `error.message` 사용
    - 로그인 토큰이 있으면 `Authorization: Bearer` 자동 첨부, `401` 은 로그인 화면으로 이동
- **로그인**: `project.config.js` 의 `auth.enabled` (기본 false = 로그인 없이 열람)
    - true 면 `ROUTE_META` 에 `public: true` 가 없는 화면은 로그인 필요 (`router/guard.js`)
    - 로그인 API 주소 · 응답 형식은 `auth.loginUrl` (`{ accessToken, user }`), 상태는 `store/auth.js`
- **퍼블리싱 데이터**: 화면 안에 `// temp 데이터` 로 작성 (API 연동 시 그 영역만 교체). 이미지는 외부 주소 대신 `utils/sampleImage.js` 의 `sampleImage(seed, w, h)` (폐쇄망에서도 표시).
- **목록 조회**: `useSearchList({ filter, fetch })` — 조회 조건 · 목록 · 건수 · 페이지 · 로딩 · 조회/초기화를 한 번에. 화면마다 직접 만들지 않습니다.
- **등록 · 수정**: `useForm(빈 폼, 규칙)` — `field('키')` 로 오류 표시, 저장 전 `validate()`, 나가기 전 `isDirty` 확인.
- **모달**: `const ok = await useModal().confirm('삭제할까요?')` (확인 true / 취소 false)
- **선택 팝업**: `const item = await useModal().pick(찾기컴포넌트, { title })` — 찾기 컴포넌트는 `emit('select', 값)`. 여러 화면이 쓰는 찾기 팝업은 `components/projects/{key}/Picker{대상}.vue`
- **탭 화면 유지**: 열린 탭의 화면은 입력값이 유지됩니다(KeepAlive). 탭으로 돌아올 때마다 새로 조회하려면 `onActivated` 를 씁니다.

## 5. SCSS

| 위치               | 용도                                                          |
| ------------------ | ------------------------------------------------------------- |
| `abstract/`        | 변수 · 함수 · mixin 만 (CSS 출력 금지 — 모든 SFC 에 주입됨)   |
| `base/`            | 리셋 · 토큰 CSS 변수 · 유틸                                   |
| `components/base/` | 공통 컴포넌트                                                 |
| `pages/`           | **여러 화면이 함께 쓰는** 페이지 스타일 (`_business.scss` 등) |
| `projects/{key}/`  | 기업 테마 · 전용 스타일                                       |

- **한 화면에서만 쓰는 스타일**은 그 화면 파일의 `<style scoped lang="scss">` 에 둡니다. 두 화면 이상이 쓰면 `pages/` 로 옮깁니다.
- 클래스는 BEM: `.app-tag__label`, `.app-tag--soft`, 상태는 `.is-active`
- 색은 HEX 대신 의미 변수(`--color-*`, `--bg-*`, `--border-*`, `--theme-*`), 글꼴은 `font-size` 대신 `@include font(b2, sb)` (`strong` · 제목은 `sb`)
- 반응형은 `@include tablet` (≤1199) / `@include mo` (≤767). `@media (max-width: …)` 를 직접 쓰지 않습니다.
- 유틸 클래스는 여백(`mt` `mb` `pt` `pb` `gap`) · 라운드 · 글꼴(`typo-*`) · 색(`text-*` `bg-*`) · 그리드(`ds-*`) 만 있습니다. 배치(flex 등)는 화면 스타일에 씁니다.

## 6. 문구 · 다국어 (i18n)

| 어디                                  | 규칙                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| 공통 컴포넌트 · 레이아웃 기본 문구    | **i18n 필수** (`ui.*` key). 언어를 바꾸면 버튼 · 안내 · 스크린리더 문구가 함께 바뀜 |
| LNB 메뉴                              | **i18n 필수** (`nav.*` key)                                                         |
| 업무 화면 문구 (제목 · 라벨 · 데이터) | **한국어 직접 작성** (기본). 다국어가 필요한 프로젝트만 화면 문구도 i18n            |

- 문구는 `i18n/ko.js` · `en.js` 에 같은 key 로 추가합니다. (`'ui.close'`, `'nav.home'`)
- 템플릿은 `$t('ui.table.selectRow', { n: 3 })`, 스크립트는 `useI18nText().t(key)` 또는 `i18n.global.t(key, params)`.
- 컴포넌트 기본 문구를 화면에서 바꾸려면 `*Text` · `placeholder` prop 을 씁니다. (`searchText="검색"`)
- 새 화면을 LNB 에 넣을 때는 `store/navigation.js` 메뉴 + `nav.*` 문구를 함께 추가합니다.

## 7. 접근성

| 규칙                 | 방법                                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 페이지마다 `h1` 하나 | 섹션은 `h2` → `h3` 순서 (`AppSection` · `AppAccordion` 의 `tag`)                                                                                     |
| 입력에는 이름        | `label` 또는 `aria-label` (placeholder 는 이름이 아님). `AppFormField` · `AppSearchItem` 안에서는 자동 연결. 빠뜨리면 개발 모드 콘솔에 `[a11y]` 경고 |
| 아이콘 버튼          | `AppIconButton aria-label="닫기"`                                                                                                                    |
| 글자색 대비 4.5:1    | 브랜드 · 상태색을 글자에 쓸 때는 `--theme-primary-text`, `--theme-status-*-text`                                                                     |
| 포커스 표시          | 전역 `:focus-visible` 유지 (`outline: none` 금지)                                                                                                    |
| 문서 제목            | LNB 메뉴명으로 자동 (`메뉴명 \| 서비스명`). 메뉴에 없으면 `ROUTE_META` 의 `title`                                                                    |

## 8. 작업 후 확인

- [ ] 관련 없는 파일을 건드리지 않았다
- [ ] 중복 로직 · 불필요한 composable / util 을 만들지 않았다
- [ ] 공통 컴포넌트 문구는 i18n, 색은 의미 변수, 글꼴은 `font()` mixin 을 썼다
- [ ] 개발 모드 콘솔에 `[props]` · `[a11y]` 경고가 없다
- [ ] 키보드(Tab)로 조작 가능하고, 360px 에서 가로 스크롤이 없다
- [ ] `npm run check` 가 성공한다 (lint · 포맷 · 테스트 · 문서 예제 · Props 패널 · 빌드)

커밋 시 lint · 포맷 검사가 자동으로 돌고(`.githooks/pre-commit`), AI 도구가 넣는 `Co-authored-by: Cursor · Claude` 줄은 자동으로 지워지며(`.githooks/commit-msg`), main 배포 전 GitHub Actions 가 `check` 와 같은 검사를 합니다.
