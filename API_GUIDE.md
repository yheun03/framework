# API Guide

화면(프론트)과 서버(백엔드)가 지키는 약속입니다. **백엔드 개발자는 이 문서만 보면 연동할 수 있게** 적었습니다.
화면별 응답 예시는 **각 화면 파일 맨 아래 `<script>` 의 `DEMO_*` 상수**입니다. (예: `src/views/work-orders.vue` → `GET /api/work-orders` 응답) 같은 키 · 같은 모양으로 응답하면 화면은 temp 영역만 바꿔서 연결됩니다. → 8장
프론트 쪽 구현은 `src/services/api/apiClient.js`(화면에서는 `useApi()`) · `src/composables/useSearchList.js` 에 있습니다.

## 1. 주소 · 공통 헤더

| 항목              | 약속                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| 기본 주소         | **모든 API 는 `/api` 아래** (`GET /api/work-orders`). 컨트롤러를 `/api/…` 로 매핑하거나 context-path `/api`   |
| 운영 · 개발 서버  | 같은 도메인의 `/api/…` → nginx 가 경로 그대로 `server:8080/api/…` 로 전달 (`nginx.conf`)                      |
| 내 PC 개발        | `npm run serve` 는 `http://localhost:8080/api` 를 직접 호출 → 백엔드에 CORS 허용 필요 (아래 6장)              |
| 요청 본문         | JSON (`Content-Type: application/json`), 파일은 `FormData` (multipart)                                        |
| `Accept-Language` | 화면 언어 (`ko` · `en` · `ja` · `vi`) 를 항상 보냅니다. 오류 문구 · 공통코드 이름 다국어에 씁니다.            |
| 인증              | 로그인 후 `Authorization: Bearer {accessToken}` 를 자동으로 붙입니다. 쿠키 세션도 됩니다. (`withCredentials`) |
| 날짜              | 문자열 `YYYY-MM-DD`, 일시는 `YYYY-MM-DD HH:mm:ss` (화면 입력값 그대로)                                        |
| 시간 초과         | 30초 (`apiClient.js` 의 `timeout`)                                                                            |

## 2. 응답 · 오류

```jsonc
// 성공: 둘 다 됩니다. { data } 로 감싸면 화면은 data 만 받습니다.
{ "data": { "id": 1, "orderNo": "WO-2611-001" } }
{ "id": 1, "orderNo": "WO-2611-001" }

// 실패: HTTP 상태 코드 + message (화면이 이 문구를 그대로 오류 토스트로 보여 줍니다)
{ "message": "이미 마감된 작업지시입니다." }
```

| 상태            | 화면 동작                                                                 |
| --------------- | ------------------------------------------------------------------------- |
| 2xx             | 정상                                                                      |
| 400 · 409 · 422 | `message` 를 오류 토스트로 표시 → **사용자가 읽을 문장으로** 적어 주세요. |
| 401             | 로그아웃 → 로그인 화면 (`?redirect=` 로 원래 화면 복귀)                   |
| 403 · 404 · 500 | `message` 표시, 없으면 '요청을 처리하지 못했습니다. (상태코드)'           |
| 응답 없음       | '서버에 연결할 수 없습니다.' / 30초 초과 시 '응답이 늦어…'                |

- `message` 대신 `error`(문자열)도 읽습니다. HTML 오류 페이지는 표시하지 않습니다.

## 3. 목록 조회 (페이지)

화면의 조회 조건이 그대로 쿼리스트링으로 갑니다. **빈 조건(null · '' · 빈 배열)은 보내지 않습니다.** (= 전체)

```text
GET /api/work-orders?keyword=샤프트&status=working&page=1&size=10&sort=dueDate,asc
```

| 파라미터 | 뜻                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------- |
| `page`   | **1부터** 시작하는 페이지 번호                                                                       |
| `size`   | 한 페이지 건수 (10 · 20 · 50 · 100). 엑셀 다운로드는 `page=1&size=10000` 으로 전체를 한 번에 요청    |
| `sort`   | `키,asc` 또는 `키,desc` (Spring Pageable 과 같은 모양). 헤더를 누를 때만 붙고, 없으면 서버 기본 정렬 |
| 그 외    | 화면 조회 조건 (이름은 화면과 협의)                                                                  |

응답은 `{ items, total }` 입니다.

```jsonc
{ "items": [ ... ], "total": 128 }
```

- 서버가 다른 모양(Spring Page 의 `content` · `totalElements`, page 0부터)을 주면 **화면의 fetch 함수 한 곳에서** 맞춥니다. (7장 예시)
  서버에서 맞추려면 `spring.data.web.pageable.one-indexed-parameters=true` 로 page 를 1부터 받습니다.
- 기간 조건은 화면이 `fromDate` · `toDate` 처럼 풀어서 보냅니다. 이름은 화면 `fetch` 에서 맞춥니다.
- 정렬 · 페이지는 **서버가** 합니다. 화면은 받은 행 순서를 그대로 보여 줍니다. 엑셀용 최대 건수(10,000)는 서버에도 같은 상한을 둡니다.

## 4. 로그인 (`project.config.js` 의 `auth`)

| 항목        | 기본값                                   | 약속                                                                                       |
| ----------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| 로그인      | `POST /auth/login` `{ email, password }` | `{ accessToken, refreshToken?, user: { name, permissions: ['WO.READ', …] } }`              |
| 토큰 갱신   | `auth.refreshUrl: null` (사용 안 함)     | 예) `POST /auth/refresh` `{ refreshToken }` → `{ accessToken, refreshToken? }`, 만료면 401 |
| 로그아웃    | `POST /auth/logout`                      | 응답 본문 없음                                                                             |
| 사용 여부   | `auth.enabled: false`                    | `true` 로 바꾸면 로그인하지 않은 사용자는 로그인 화면으로                                  |
| 메뉴 (선택) | `menuUrl: null` (`constants/menus.js`)   | 예) `GET /api/menus` → `menus.js` 와 같은 행 배열 (아래)                                   |

```jsonc
// GET /api/menus - 로그인한 사용자가 볼 메뉴만 (권한은 서버가 거르거나 permission 으로 화면이 거름)
[
    { "id": "MENU_026000", "order": 11, "label": "생산관리", "icon": "chart" },
    { "id": "MENU_026007", "parentId": "MENU_026000", "order": 6, "to": "/work-orders", "label": "작업지시 목록", "permission": "WO.READ" },
]
```

- **권한 코드**는 `대상.동작` (예: `WO.READ` · `WO.WRITE` · `WO.DELETE`), 전체 권한은 `*`. 화면은 메뉴 · 버튼을 숨기고, **서버도 같은 권한을 반드시 다시 확인**합니다. (권한 없으면 403 + `message`)
- 여러 요청이 동시에 401 이어도 화면은 갱신을 한 번만 부르고, 갱신이 실패하면 로그인 화면으로 보냅니다.

## 5. 파일

| 동작     | 프론트 코드                                                      | 서버                                                  |
| -------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| 업로드   | `api.post('/files', formData)` (Content-Type 은 브라우저가 정함) | multipart, 필드명은 화면과 협의                       |
| 다운로드 | `api.raw.get(url, { responseType: 'blob' })`                     | `Content-Disposition: attachment; filename*=UTF-8''…` |

## 6. 내 PC 에서 함께 띄우기

| 방법                    | 설정                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| 백엔드 CORS 허용 (기본) | `.env` 의 `VITE_API_URL=http://localhost:8080/api`, 백엔드에서 `http://localhost:5173` 허용 · credentials 허용 |
| CORS 없이 (Vite 프록시) | `.env` 의 `VITE_API_URL=/api` → Vite 가 `/api/…` 를 그대로 `localhost:8080/api/…` 로 전달                      |
| 다른 PC 의 백엔드       | `VITE_PROXY_TARGET=http://192.168.0.10:8080 npm run dev`                                                       |

## 7. 프론트에서 부르기 (`useApi`)

화면에서는 `useApi()` 의 `get` · `post` · `put` · `patch` · `delete` 를 그대로 씁니다. (`src/composables/useApi.js`)

```js
import { useApi } from '@/composables/useApi';

const api = useApi();

// 목록 - GET /work-orders?page=1&size=10&… → { items, total }
const fetchWorkOrders = (params) => api.get('/work-orders', { params });

// Spring Page 를 그대로 주는 서버라면 화면의 fetch 함수에서만 맞춥니다.
// const fetchWorkOrders = (params) =>
//     api.get('/work-orders', { params: { ...params, page: params.page - 1 } }).then((page) => ({ items: page.content, total: page.totalElements }));

const order = await api.get(`/work-orders/${id}`); // 상세
await api.post('/work-orders', form); // 등록
await api.put(`/work-orders/${id}`, form); // 수정
await api.delete('/work-orders', { data: ids }); // 여러 건 삭제
await api.post('/work-orders', form, { toast: false }); // 오류 토스트 없이 화면에서 직접 처리 (catch 의 error.message)
```

## 8. 화면별 응답 예시 (데모 데이터)

각 화면 파일 맨 아래에 서버가 줄 JSON 을 그대로 적어 두었습니다. **백엔드는 이 모양대로 응답합니다.**

```js
<script>
/** GET /api/work-orders?keyword=하우징&status=working&page=1&size=10 → { items, total } */
const DEMO_WORK_ORDERS = {
    items: [{ orderNo: 'WO-260814-01', lineName: '가공 1라인', planQty: 1200, status: 'working', statusName: '작업중' }],
    total: 3,
};
</script>
```

| 규칙                 | 약속                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| 코드 + 이름          | 상태 · 구분 같은 코드 값은 `status: 'working'` 과 이름 `statusName: '작업중'` 을 함께 줍니다.     |
| 숫자                 | 숫자는 숫자로 (`1200`, `1.52`). 쉼표 · 단위 · `₩` 는 화면이 붙입니다. 단위가 행마다 다르면 `unit` |
| 날짜 · 일시          | `YYYY-MM-DD` · `YYYY-MM-DD HH:mm:ss` 문자열 (1장)                                                 |
| 색 · 표시 문자열     | 서버는 주지 않습니다. (`tone` 은 `constants/codeTone.js`, `'1,200 EA'` 등은 화면에서 만듦)        |
| 공통코드 (선택 목록) | `GET /api/codes/{그룹}` → `[{ value, label }]` (예: `WO_STATUS`, `LINE`). 화면은 `useCodes(그룹)` |
| 요약 · 대시보드      | 화면 상단 요약은 `GET /api/{대상}/summary` 처럼 숫자 객체 하나로 줍니다.                          |

- 키 이름을 바꿔야 하면 화면 담당자와 협의해 **데모 블록과 화면을 함께** 고칩니다. (데모 블록이 곧 계약서)
- 대상 화면: `views/` 의 업무 화면(목록 · 상세 · 대시보드 · 키오스크 `views/kiosk/`)과 `views/demos/demo-page-*.vue` 템플릿(대용량 그리드 포함), 찾기 팝업 `components/PageDemo/picker/`. `npm test` 가 맨 아래 블록이 있는지 검사합니다.
