# Development Guide

누가 작업해도 같은 결과가 나오도록 지키는 최소 규칙입니다.

## 0. 한눈에 보는 구조

```text
[화면] views/*.vue ─── 템플릿: 목록 · 등록/수정 · 상세 · 마스터-디테일 · 선택 팝업 · 대용량 그리드 · 키오스크
   │  조회 조건 · 목록 · 페이지 · 정렬 → composables/useSearchList
   │  선택 목록(공통코드) · 상태 색   → composables/useCodes · constants/codeTone
   │  확인 · 알림 · 찾기 팝업          → composables/useModal · useToast
   │  입력 검증 · 변경 여부            → 화면 안에 직접 (errors 객체 + validate 함수)
   ▼
[API 호출] const api = useApi();  api.get · post · put · patch · delete
   ▼
[공통 클라이언트] services/api/apiClient.js
   · 주소: 실행 모드(.env*) + /api  · 토큰 Authorization: Bearer 자동
   · 빈 조회 조건 제거               · 오류 → message 토스트 / 401 → (갱신) → 로그인 화면
   ▼
[서버]  약속은 API_GUIDE.md
```

| 무엇이              | 어디서 정해지나                                                               |
| ------------------- | ----------------------------------------------------------------------------- |
| 화면 주소           | `src/views` 파일 경로 (`work-orders/[id].vue` → `/work-orders/:id`)           |
| LNB 메뉴            | `constants/menus.js` (한 줄 = 메뉴 하나) → `store/navigation.js`              |
| 상단 탭 · 화면 유지 | `App.vue` (KeepAlive, 탭 주소마다 화면 1개) · `store/routeTabs.js`            |
| 문서 제목           | 메뉴 이름 → `ROUTE_META.title` → `.env*` 의 `VITE_TITLE`                      |
| 로그인 · 권한       | `project.config.js` 의 `auth` → `router/guard.js` · `store/auth.js` (`can`)   |
| 메뉴 권한           | `menus.js` 의 `permission` (없으면 LNB 숨김 · 주소로 오면 `/forbidden`)       |
| 레이아웃            | 기본 `DefaultLayout` · 현장 단말 `KioskLayout` (`ROUTE_META layout: 'kiosk'`) |
| 회사별 색 · 이미지  | `assets/styles/projects/{key}/_theme.scss` · `public/images/projects/{key}/`  |

## 1. 기본 원칙

- **필요할 때만 공통으로 뺍니다.** 두 화면 이상이 같은 코드를 실제로 쓸 때 composable · util 을 만들고, '나중에 쓸지도' 는 만들지 않습니다.
- 설정으로 동작을 바꾸는 스위치 · 한 번만 쓰는 util 파일 · API 를 한 번 더 감싸는 도메인 함수 파일을 만들지 않습니다. 화면 안에 몇 줄로 쓰는 편이 읽기 쉽습니다.
- 기존 스타일 · 네이밍 · 폴더 구조를 따릅니다.
- 요청과 관련 없는 코드는 고치지 않습니다.
- console · 임시 코드는 남기지 않습니다.

## 1-1. 화면 개발 순서

| 단계           | 하는 일                                                                                                                                         | 결과                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1. 유형 고르기 | 목록 · 등록/수정 · 상세 · 마스터-디테일 · 선택 팝업 중 가장 가까운 것 ([COMPONENT_GUIDE 4장](./COMPONENT_GUIDE.md#4-작성-패턴--표준-화면-유형)) | 복사할 템플릿             |
| 2. 퍼블리싱    | 템플릿 복사 → `constants/menus.js` 에 메뉴 한 줄 → 파일 맨 아래 `DEMO_*` (서버 JSON 응답 예시) + `// ── temp 데이터` 로 화면 완성               | 백엔드 없이 동작하는 화면 |
| 3. API 연동    | 백엔드는 `DEMO_*` 와 같은 JSON 으로 응답 → `// temp 데이터` ~ `// temp 데이터 끝` 만 교체 (`fetch…` · `save…` 함수) → 맨 아래 데모 블록 삭제    | 화면 구조는 그대로        |
| 4. 확인        | 아래 8장 체크리스트 + `npm run check`                                                                                                           | 커밋 · PR                 |

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
- **API**: `const api = useApi()` → `api.get` · `post` · `put` · `patch` · `delete` (`services/api/apiClient.js`). 주소는 실행 모드의 `.env` `VITE_API_URL`. → [API_GUIDE 7장](./API_GUIDE.md#7-프론트에서-부르기-useapi)
    - 조회 조건의 빈 값(null · '' · 빈 배열)은 보내지 않습니다. (`apiClient.js` 요청 인터셉터)
    - `{ data }` 로 감싼 응답은 `data` 만 돌려줍니다.
    - 오류는 서버 `message` 로 **오류 토스트를 자동으로** 띄웁니다. 화면에서 직접 처리하려면 `{ toast: false }` 후 `error.message` 사용
    - 로그인 토큰이 있으면 `Authorization: Bearer` 자동 첨부, `401` 은 로그인 화면으로 이동
- **로그인**: `project.config.js` 의 `auth.enabled` (기본 false = 로그인 없이 열람)
    - true 면 `ROUTE_META` 에 `public: true` 가 없는 화면은 로그인 필요 (`router/guard.js`)
    - 로그인 API 주소 · 응답 형식은 `auth.loginUrl` (`{ accessToken, refreshToken?, user: { name, permissions } }`), 상태는 `store/auth.js`
    - 토큰 갱신: `auth.refreshUrl` 을 적으면 401 때 한 번 갱신하고 원래 요청을 다시 보냅니다. 여러 요청이 동시에 401 이어도 갱신 · 로그인 이동은 한 번만.
    - 로그아웃은 LNB 아래 버튼 (`auth.enabled` 일 때). 공통코드 기억도 함께 지웁니다.
- **퍼블리싱 데이터 (데모 데이터 = 서버 JSON 응답 예시)**: 화면 파일 **맨 아래 `<script>` 블록**에 `DEMO_*` 상수로 씁니다. 위의 `// temp 데이터` 영역은 이 상수를 돌려주는 `fetch…` 함수만 둡니다. (API 연동 시 temp 영역만 교체하고 데모 블록은 삭제) 이미지는 외부 주소 대신 `utils/sampleImage.js` 의 `sampleImage(seed, w, h)` (폐쇄망에서도 표시).
    - 상수 위 주석에 `GET /api/…?조건` 과 응답 모양(`→ { items, total }`)을 적습니다. 백엔드는 이 주석과 값을 보고 응답을 만듭니다.
    - 서버가 줄 **원래 값**만 씁니다: 코드(`status: 'working'`) + 이름(`statusName: '작업중'`), 숫자는 숫자(`qty: 1200`, 단위는 `unit`), 일시는 `YYYY-MM-DD HH:mm:ss`. `'1,200 EA'` 같은 표시 문자열 · 색(`tone`)은 넣지 않고 화면에서 `format` · `STATUS_TONE` 으로 만듭니다.
    - 선택 목록(공통코드)도 `DEMO_CODES` 에 `[{ value, label }]` 로 두고, 화면에서는 `const statuses = ref(DEMO_CODES.X)` 로 받습니다. (연동 시 `api.get('/codes/X')` 로 교체)
    - 맨 아래 `<script>` 는 빌드 시 `<script setup>` 보다 먼저 실행되므로 위에서 바로 쓸 수 있습니다.
- **목록 조회**: `useSearchList({ filter, fetch })` — 조회 조건 · 목록 · 건수 · 페이지 · 정렬 · 로딩 · 오류 · 조회/초기화를 한 번에. 화면마다 직접 만들지 않습니다.
    - 조건은 **조회 버튼을 누른 시점의 값**만 씁니다. (입력만 바꾸고 페이지를 넘기면 이전 조건) 늦게 온 이전 응답은 버립니다.
    - 정렬은 `AppDataTable v-model:sort="sort"` → `params.sort = 'dueDate,asc'` (서버 정렬). `v-model:sort` 없이 `sortable` 만 쓰면 현재 페이지 안에서만 정렬됩니다.
    - 실패하면 `error` 가 채워짐 → `AppDataTable :error="Boolean(error)"` ('목록을 불러오지 못했습니다.')
    - 엑셀처럼 전체가 필요하면 `fetchAllRows()` → `useAppGridExcelExport().exportRows()` (현재 페이지만 내려받지 않음)
- **공통코드**: `const statuses = useCodes('WO_STATUS')` (`GET /api/codes/WO_STATUS` → `[{ value, label }]`, 앱 안에서 한 번만 조회). 상태 태그 색은 `codeTone('WO_STATUS', row.status)` (`constants/codeTone.js` 에 그룹 한 줄)
- **권한**: 로그인 응답 `user.permissions` → `useAuthStore().can('WO.WRITE')` 로 버튼을 숨기고, 메뉴는 `menus.js` 의 `permission`. 상세처럼 메뉴에 없는 화면은 `ROUTE_META` 의 `permission`. (`auth.enabled: false` 면 항상 통과)
- **서버 메뉴**: `project.config.js` 의 `menuUrl` 을 적으면 로그인 후 그 API 의 행 배열(`menus.js` 와 같은 모양)로 LNB 를 그립니다.
- **등록 · 수정**: 화면 안에 `form` · `errors`(reactive) 와 `validate()` 를 직접 씁니다. 입력에는 `:state="errors.x ? 'error' : null" :hint="errors.x"`, 나가기 전 `isDirty` 확인. (등록 · 수정 템플릿)
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
- **일부 화면만 쓰는 공통 컴포넌트**(AppChart · AppDatePicker · 업로드 · 트리 등)의 스타일은 전역 `components/base/_index.scss` 가 아니라 그 컴포넌트 `.vue` 의 `<style lang="scss">@use 'components/base/…';</style>` 로 불러옵니다. (그 화면 조각에만 포함 → 첫 화면이 가벼워짐)
- 클래스는 BEM: `.app-tag__label`, `.app-tag--soft`, 상태는 `.is-active`
- 색은 HEX 대신 의미 변수(`--color-*`, `--bg-*`, `--border-*`, `--theme-*`), 글꼴은 `font-size` 대신 `@include font(b2, sb)` (`strong` · 제목은 `sb`)
- 반응형은 `@include tablet` (≤1199) / `@include mo` (≤767). `@media (max-width: …)` 를 직접 쓰지 않습니다.
- 유틸 클래스는 여백(`mt` `mb` `pt` `pb` `gap`) · 라운드 · 글꼴(`typo-*`) · 색(`text-*` `bg-*`) · 그리드(`ds-*`) 만 있습니다. 배치(flex 등)는 화면 스타일에 씁니다.

## 6. 문구 · 다국어 (i18n)

| 어디                                  | 규칙                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| 공통 컴포넌트 · 레이아웃 기본 문구    | **i18n 필수** (`ui.*` key). 언어를 바꾸면 버튼 · 안내 · 스크린리더 문구가 함께 바뀜  |
| LNB 메뉴                              | `constants/menus.js` 의 `label`(이름 직접) 또는 `labelKey`(`nav.*`, 다국어 프로젝트) |
| 업무 화면 문구 (제목 · 라벨 · 데이터) | **한국어 직접 작성** (기본). 다국어가 필요한 프로젝트만 화면 문구도 i18n             |

- 언어는 ko · en · ja · vi 입니다. 문구는 `i18n/ko.js` · `en.js` · `ja.js` · `vi.js` 에 같은 key 로 추가합니다. (`'ui.close'`, `'nav.home'`) 빠뜨리면 `npm test` 가 알려줍니다.
    - 프레임워크 데모 설명(`demo.*`)은 ko · en 에만 있고, 일본어 · 베트남어에서는 영어로 보입니다.
    - 공통코드 이름은 서버가 `Accept-Language` 에 맞춰 줍니다. 언어를 바꾸면 다음 화면부터 코드를 새로 받습니다.
- 템플릿은 `$t('ui.table.selectRow', { n: 3 })`, 스크립트는 `useI18nText().t(key)` 또는 `i18n.global.t(key, params)`.
- 컴포넌트 기본 문구를 화면에서 바꾸려면 `*Text` · `placeholder` prop 을 씁니다. (`searchText="검색"`)
- 새 화면을 LNB 에 넣을 때는 `constants/menus.js` 에 한 줄 추가합니다.

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
- [ ] 태블릿(1024 · 820px)에서 조회 패널 · 표가 깨지지 않는다 (표는 가로 스크롤)
- [ ] `npm run check` 가 성공한다 (lint · 포맷 · 단위 테스트 · 문서 예제 · Props 패널 · 빌드)
- [ ] 화면을 고쳤으면 `npm run test:e2e` 가 성공한다 (새 표준 템플릿은 `tests/e2e/smoke.spec.js` 의 `PAGES` 에 추가)

커밋 시 lint · 포맷 검사가 자동으로 돌고(`.githooks/pre-commit`), AI 도구가 넣는 `Co-authored-by: Cursor · Claude` 줄은 자동으로 지워지며(`.githooks/commit-msg`), main 배포 전 GitHub Actions 가 `check` 와 같은 검사를 합니다.

## 9. 자주 하는 실수

| 증상                                                      | 원인 · 해결                                                                                  |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 화면 전용 하위 컴포넌트가 주소로 열림                     | `views/` 아래 `.vue` 는 모두 주소가 됩니다. → `components/Page{이름}/` 로 옮기기             |
| 컴포넌트가 안 보이고 콘솔에 'Failed to resolve'           | 자동 import 가 없습니다. → `import AppButton from '@/components/AppButton/AppButton.vue'`    |
| 다른 탭 갔다 오면 목록이 예전 값                          | 탭 화면은 유지(KeepAlive)됩니다. 돌아올 때마다 조회하려면 `onActivated(reload)`              |
| 상세 화면 id 별로 탭이 여러 개                            | 의도된 동작 (주소마다 탭 1개). 탭 닫기로 정리                                                |
| '전체' 를 골랐는데 서버가 빈 문자열로 받음                | 이미 해결됨 - `apiClient` 가 빈 조건을 보내지 않습니다. 직접 `fetch`/`axios` 를 쓰지 마세요. |
| 페이지가 하나씩 밀려서 조회됨                             | 화면은 `page` 1부터, Spring 은 0부터 → [API_GUIDE 3장](./API_GUIDE.md#3-목록-조회-페이지)    |
| 저장 버튼을 두 번 눌러 2건 저장                           | `:loading="saving"` + `try/finally` (등록 · 수정 템플릿 그대로)                              |
| 헤더 정렬이 현재 페이지 10건만 정렬됨                     | 서버 페이지 목록은 `AppDataTable v-model:sort="sort"` (useSearchList 의 sort)                |
| 엑셀에 현재 페이지만 나옴                                 | `fetchAllRows()` 로 조건 전체를 받아 `exportRows()`                                          |
| 로컬은 되는데 개발 서버에서 API 404                       | 백엔드 주소는 모두 `/api/…`. `.env` 도 `http://localhost:8080/api` (API_GUIDE 1장)           |
| 다국어 key 를 ko 에만 넣어 테스트 실패                    | en · ja · vi 에도 같은 key                                                                   |
| `<script setup>` 에서 `await api.get()` 이 화면을 안 그림 | 최상위 `await` 는 쓰지 않습니다. `async function load()` 를 만들어 호출                      |
| 색 · 글자 크기가 화면마다 조금씩 다름                     | HEX · px 대신 `--color-*` · `@include font(b2, sb)` · 컴포넌트 `size`                        |
| 커밋이 막힘 (`[pre-commit]`)                              | `npm run lint` · `npm run format` 후 다시 커밋                                               |

## 10. 주석 규칙

- **왜**를 적습니다. 코드가 말하는 **무엇**은 적지 않습니다. (`// 1 더하기` ✗ · `// 서버 page 는 1부터` ○)
- 파일 맨 위 블록 주석: 이 파일이 무엇이고, 어떻게 쓰는지 예시 1~2줄. (composable · util · store · 스크립트 필수)
- 밖에서 쓰는 함수에는 `/** 한 줄 설명 */` + 필요하면 `@param` · `@returns` (VS Code 가 호출하는 곳에서 보여 줌)
    - 타입은 JavaScript 기본 이름만: `{string}` `{number}` `{boolean}` `{Object}` `{Array}` `{Function}` `{Promise}`. 모양은 설명에 적습니다. (`@param {Object} [options.temp] [{ value, label }] 목록`)
    - TypeScript 문법(`@template` · `Record<…>` · `import('…')` · `() => T`)은 쓰지 않습니다. (`npm test` 가 검사)
- 화면 스크립트는 구역 주석으로 나눕니다: `// ── 코드 목록 ──` · `// ── temp 데이터 ──` · `// ── 목록 ──` · `// ── 동작 ──`, 파일 맨 아래 `<script>` 는 `// ── 데모 데이터 = 서버 JSON 응답 예시 ──`
- `TODO` 는 담당 · 날짜와 함께: `// TODO(홍길동, 2026-12-01): 서버 정렬 파라미터 확정 후 교체`
- 주석 처리한 옛 코드를 남기지 않습니다. (git 기록에 있음)
