# Development Guide

이 문서는 어떤 개발자가 와도 같은 기준으로 개발하기 위한 공통 가이드입니다.

## 1. 기본 원칙

- 기존 코드 스타일, 네이밍, 폴더 구조를 유지합니다.
- 중복 로직은 `utils`, `composables`, `stores`, `types` 중 알맞은 위치로 모읍니다.
- 한 화면에서만 쓰는 로직은 page/component 내부에 둡니다.
- 두 곳 이상에서 반복되면 공통 함수로 분리합니다.
- 임시 코드, console, 테스트용 코드는 남기지 않습니다.
- 대규모 구조 변경보다 최소 영향 범위 수정을 우선합니다.

## 2. 파일 위치 기준

```text
pages/        URL과 직접 연결되는 화면
components/   재사용 UI 컴포넌트
composables/  Vue/Nuxt 상태와 생명주기를 사용하는 재사용 로직
stores/       여러 화면에서 공유하는 Pinia 상태
utils/        Vue 의존성이 없는 순수 함수
types/        여러 파일에서 공유하는 타입
assets/scss/  스타일
server/api/   Nitro API
plugins/      Nuxt 앱 초기화/주입
```

## 3. Component 규칙

- 공통 컴포넌트명은 `App` prefix를 사용합니다. 예: `AppButton.vue`
- 기능 단위 컴포넌트는 폴더로 묶습니다. 예: `components/AppGrid`, `components/AppProgress`
- 폴더 안 컴포넌트도 파일명에 폴더명을 포함합니다. 예: `AppGridDownload.vue`, `AppGridCellInput.vue`
- `index.vue`, `Download.vue`, `Reset.vue`처럼 단독으로 의미가 겹치는 파일명은 사용하지 않습니다.
- `components/` 안에는 `.vue` 컴포넌트만 둡니다. 타입은 `types/`, 재사용 로직은 `composables/` 또는 `utils/`로 분리합니다.
- 컴포넌트는 UI 표현과 이벤트 전달에 집중합니다.
- API 호출, 복잡한 상태, 공통 계산 로직은 컴포넌트 안에 직접 넣지 않습니다.
- prop/event 타입은 컴포넌트 전용이면 해당 파일 안에 두고, 공유되면 `types/`로 분리합니다.

## 4. Composable 규칙

- Vue/Nuxt 기능을 사용하는 재사용 로직은 `composables/use*.ts`로 작성합니다.
- 이름은 `useModalViewer`처럼 역할이 드러나게 작성합니다.
- 단순히 다른 함수를 한 번 감싸는 composable은 만들지 않습니다.
- 화면별 composable은 특정 화면에 강하게 묶이지 않도록 입력/출력을 명확히 둡니다.

## 5. Store 규칙

- 여러 화면에서 공유하는 상태만 Pinia store로 만듭니다.
- store는 상태, computed, action 중심으로 작성합니다.
- 컴포넌트는 store 내부 구조를 직접 가공하지 않고 action/computed를 사용합니다.
- 단일 화면에서만 필요한 상태는 page/component 내부에 둡니다.

## 6. Utils 규칙

- Vue 의존성이 없는 순수 함수는 `utils/`에 둡니다.
- 값 변환, 정규화, 포맷팅, 비교 함수는 utils로 분리합니다.
- 예시:
    - `utils/css.ts`: CSS size 변환
    - `utils/progress.ts`: progress value/range 정규화
    - `utils/upload.ts`: 파일 형식/용량 처리
    - `utils/section.ts`: section layout 값 변환

## 7. API 규칙

- API 호출은 직접 Axios를 쓰지 않고 `useApi()`를 사용합니다.
- endpoint는 `/api/*` 형식을 사용합니다.
- Axios 설정은 `plugins/axios.ts`에서만 수정합니다.
- 서버/클라이언트 요청 차이는 `composables/useApi.ts`에서 처리합니다.

```ts
const api = useApi();
const data = await api.get<MyType>('/api/example');
```

## 8. Type 규칙

- 두 곳 이상에서 쓰는 타입은 `types/`로 분리합니다.
- 컴포넌트 prop/event 계약으로 공유되는 타입도 `types/`에 둡니다.
- 한 파일에서만 쓰는 타입은 해당 파일 내부에 둡니다.
- `any`는 외부 라이브러리 타입이 불명확한 경우에만 제한적으로 사용합니다.

## 9. SCSS 규칙

- 공통 컴포넌트 스타일은 `assets/scss/components/base/`에 둡니다.
- page 전용 스타일은 `assets/scss/pages/`에 둡니다.
- 변수/토큰은 `assets/scss/abstract/` 기준을 따릅니다.
- 기존 class naming 방식을 유지합니다.
- 컴포넌트 구조 변경 없이 스타일만 해결 가능한 경우 SCSS에서 처리합니다.

## 10. Page 규칙

- `pages/` 파일명은 URL이 되므로 kebab-case를 사용합니다.
- demo 페이지는 컴포넌트 사용 예시만 담당합니다.
- 실제 업무 로직과 demo 전용 상태를 섞지 않습니다.
- 특정 page 안에서만 쓰는 modal, renderer, content는 `Page_페이지명/modal`, `Page_페이지명/renderer`, `Page_페이지명/content` 폴더에 둡니다.
- page 전용 파일명도 폴더 역할이 보이도록 `PageDemoModalRendererExample.vue`처럼 작성합니다.
- 새 페이지가 LNB에 필요하면 navigation store와 i18n label을 함께 추가합니다.

## 11. i18n 규칙

- 텍스트 key는 `i18n/ko.ts`, `i18n/en.ts`를 함께 맞춥니다.
- 화면에서는 `useI18nText()` 또는 기존 i18n composable을 사용합니다.
- label key는 메뉴, 탭, demo title에서 같은 기준으로 관리합니다.

## 12. 공통화 기준

- 같은 코드가 2곳 이상 반복되면 공통화 후보입니다.
- Vue 상태/생명주기 필요: `composables/`
- 전역 공유 상태 필요: `stores/`
- 순수 계산/변환: `utils/`
- 공유 타입: `types/`
- UI 반복: `components/`

## 13. 개발 체크리스트

```text
[ ] 기존 구조와 네이밍을 유지했는가
[ ] 중복 로직을 새로 만들지 않았는가
[ ] 공통 함수/store/composable 위치가 적절한가
[ ] page/component에 API/상태/가공 로직이 과하게 들어가지 않았는가
[ ] 타입 위치가 적절한가
[ ] 임시 코드와 console이 남아 있지 않은가
[ ] 변경 범위가 요청과 직접 관련된 파일로 제한되었는가
```
