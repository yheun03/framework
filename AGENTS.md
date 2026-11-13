# AGENTS.md

AI 코딩 도구(Cursor · Claude Code · Codex 등)가 이 저장소에서 작업할 때 지키는 규칙입니다. 사람용 설명은 [README](./README.md) → [DEVELOPMENT_GUIDE](./DEVELOPMENT_GUIDE.md) · [COMPONENT_GUIDE](./COMPONENT_GUIDE.md) · [API_GUIDE](./API_GUIDE.md) 에 있습니다. 이 파일과 가이드가 다르면 가이드가 맞습니다.

## 저장소

- MES · ERP 업무 화면 프레임워크. Vue 3 · Vite 8 · Pinia · vue-i18n · SCSS · **JavaScript (TypeScript 금지)**
- 화면 = `src/views/` 파일 경로 (`views/work-orders/[id].vue` → `/work-orders/:id`), 메뉴 = `src/constants/menus.js` 한 줄
- 자동 import 없음: 쓰는 컴포넌트 · 함수는 모두 `@/…` 로 직접 import

## 명령

```bash
npm run serve      # 개발 서버 http://localhost:5173
npm run check      # 끝나기 전에 반드시: lint → 포맷 → 단위 테스트 → 문서 예제 → Props 패널 → 빌드
npm run test:e2e   # 화면을 고쳤으면: 표준 템플릿 · 업무 화면을 브라우저로 열어 봄 (처음 한 번 npx playwright install chromium)
npm run format     # 포맷 자동 정리
```

## 새 화면을 만들 때

1. 유형을 고르고 템플릿을 복사합니다: 목록 `demos/demo-page-example.vue` · 등록/수정 `demo-page-form.vue` · 상세 `work-orders/[id].vue` · 마스터-디테일 `demo-page-master-detail.vue` · 선택 팝업 `demo-page-picker.vue` · 대용량 그리드 `demo-page-grid.vue` · 현장 키오스크 `kiosk/work-result.vue`
2. `src/constants/menus.js` 에 메뉴 한 줄 (권한이 있으면 `permission`)
3. 스크립트 순서: `import` → `// ── temp 데이터` ~ `// temp 데이터 끝` → `// ── 목록 / 폼` → `// ── 동작`
4. **파일 맨 아래 `<script>` 블록에 `DEMO_*` = 서버 JSON 응답 예시** (주석에 `GET /api/…?조건 → 모양`)
    - 코드 + 이름(`status` · `statusName`), 숫자는 숫자, 일시 `YYYY-MM-DD HH:mm:ss`
    - `'1,200 EA'` 같은 표시 문자열 · 색(`tone`)은 데이터에 넣지 않음 → 화면의 `format` · `codeTone(그룹, 값)`
    - temp 영역은 `DEMO_*` 를 돌려주는 `fetch…` · `save…` 함수만. API 연동은 temp 영역만 교체하고 데모 블록 삭제

## 반드시 쓰는 것

| 하려는 일          | 쓰는 것                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| API 호출           | `useApi()` (`get` · `post` · `put` · `patch` · `delete`). axios · fetch 직접 사용 금지          |
| 목록 조회 · 페이지 | `useSearchList({ filter, fetch })` + `AppDataTable v-model:sort :error` + `AppPagination`       |
| 선택 목록 · 상태명 | `useCodes('그룹')` (공통코드 `GET /api/codes/{그룹}`), 상태 색은 `constants/codeTone.js`        |
| 권한               | `useAuthStore().can('WO.WRITE')`, 메뉴는 `menus.js` 의 `permission`                             |
| 확인 · 알림 · 찾기 | `useModal().confirm()` · `useToast()` · `useModal().pick(찾기 컴포넌트)`                        |
| 표                 | 기본 `AppDataTable`, 셀 편집 · 수천 행 · 열 고정은 `AppGrid`. HTML `<table>` 직접 작성 금지     |
| 엑셀               | `useAppGridExcelExport().exportRows()` + `useSearchList` 의 `fetchAllRows()` (현재 페이지 아님) |
| 하단 저장 버튼     | `components/Layout/LayoutBottomBar.vue`                                                         |

## 하지 않는 것

- TypeScript · `lang="ts"` · TS 전용 JSDoc(`Record<…>`, `import('…')`)
- `console.*` · 주석 처리한 옛 코드 · 담당/날짜 없는 `TODO`
- HEX 색 · px 글자 크기 → `--color-*` · `--theme-*` 변수, `@include font(b2, sb)`, 반응형은 `@include tablet` / `@include mo`
- 공통 컴포넌트의 한국어 하드코딩 → i18n `ui.*` key (ko · en · ja · vi 네 파일에 함께 추가, `npm test` 가 누락 검사)
- 한 화면만 쓰는 composable · util · 설정 스위치 새로 만들기 (두 화면 이상이 실제로 쓸 때만)
- 요청과 관련 없는 파일 수정, 새 prop 을 만들고 Props 패널(`PageDemoPropsSummary.vue`)에 안 적기
- `views/` 아래에 화면이 아닌 하위 컴포넌트 두기 (`components/Page{이름}/` 로)

## 끝내기 전에

- [ ] `npm run check` 성공, 화면을 고쳤으면 `npm run test:e2e` 성공
- [ ] 개발 모드 콘솔에 `[props]` · `[a11y]` · AG Grid 경고 없음
- [ ] 새 API 모양은 화면 맨 아래 `DEMO_*` 와 [API_GUIDE](./API_GUIDE.md) 규칙이 일치
