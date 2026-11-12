# API Guide

화면(프론트)과 서버(백엔드)가 지키는 약속입니다. **백엔드 개발자는 이 문서만 보면 연동할 수 있게** 적었습니다.
프론트 쪽 구현은 `src/services/api/apiClient.js` · `src/composables/useSearchList.js` 에 있습니다.

## 1. 주소 · 공통 헤더

| 항목              | 약속                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| 기본 주소         | 운영 · 개발 서버: 같은 도메인의 `/api/…` → nginx 가 `server:8080` 으로 전달 (`nginx.conf`)                    |
| 내 PC 개발        | `npm run serve` 는 `http://localhost:8080` 을 직접 호출 → 백엔드에 CORS 허용 필요 (아래 6장)                  |
| 요청 본문         | JSON (`Content-Type: application/json`), 파일은 `FormData` (multipart)                                        |
| `Accept-Language` | 화면 언어 (`ko` · `en`) 를 항상 보냅니다. 오류 문구 다국어에 씁니다.                                          |
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
GET /api/work-orders?keyword=샤프트&status=working&page=1&size=10
```

| 파라미터 | 뜻                                  |
| -------- | ----------------------------------- |
| `page`   | **1부터** 시작하는 페이지 번호      |
| `size`   | 한 페이지 건수 (10 · 20 · 50 · 100) |
| 그 외    | 화면 조회 조건 (이름은 화면과 협의) |

응답은 아래 중 하나면 됩니다. (`src/utils/list.js`)

```jsonc
{ "items": [ ... ], "total": 128 }                 // 권장
{ "content": [ ... ], "totalElements": 128 }       // Spring Page 그대로
[ ... ]                                            // 배열 = 건수가 적은 목록 (화면이 나눠서 보여줌)
```

- **Spring Pageable 은 page 가 0부터**입니다. `spring.data.web.pageable.one-indexed-parameters=true` 를 켜거나 서버에서 `page - 1` 로 받아 주세요.
- 기간 조건은 화면이 `fromDate` · `toDate` 처럼 풀어서 보냅니다. 이름은 화면 `fetch` 에서 맞춥니다.

## 4. 메뉴 (`project.config.js` 의 `menuUrl`)

로그인 후 1번 호출합니다. 사용자 권한에 맞는 메뉴만 돌려주면 LNB 에 그대로 그려집니다.

```jsonc
GET /api/menus
[
    { "id": "MES", "order": 1, "label": "MES", "icon": "factory" },
    { "id": "MES_WO", "parentId": "MES", "order": 1, "to": "/work-orders", "label": "작업지시 목록" }
]
```

| 필드       | 필수 | 설명                                                    |
| ---------- | ---- | ------------------------------------------------------- |
| `id`       | O    | 메뉴 고유값                                             |
| `parentId` |      | 상위 메뉴 id (없으면 1단계)                             |
| `order`    | O    | 같은 상위 안의 순서                                     |
| `to`       |      | 화면 주소 (= 프론트 `src/views` 파일 경로). 없으면 그룹 |
| `label`    | △    | 메뉴 이름 (또는 다국어 키 `labelKey`)                   |
| `icon`     |      | 1단계 아이콘 이름 (프론트 `LayoutNavItem.vue` 목록)     |
| `isActive` |      | `false` 면 숨김                                         |

## 5. 공통코드 (`project.config.js` 의 `codeUrl`)

선택 목록(라인 · 상태 · 창고 …)은 그룹 이름으로 받습니다. 같은 그룹은 새로고침 전까지 1번만 호출합니다.

```jsonc
GET /api/codes/LINE          // codeUrl: '/codes/{group}'
[ { "value": "L1", "label": "1라인" } ]       // 또는 [ { "code": "L1", "name": "1라인" } ]
```

## 6. 로그인 (`project.config.js` 의 `auth`)

| 항목      | 기본값                                   | 약속                                                      |
| --------- | ---------------------------------------- | --------------------------------------------------------- |
| 로그인    | `POST /auth/login` `{ email, password }` | `{ accessToken, user }` (또는 `{ token, user }`)          |
| 로그아웃  | `POST /auth/logout`                      | 응답 본문 없음                                            |
| 사용 여부 | `auth.enabled: false`                    | `true` 로 바꾸면 로그인하지 않은 사용자는 로그인 화면으로 |

## 7. 파일

| 동작     | 프론트 코드                                                      | 서버                                                  |
| -------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| 업로드   | `api.post('/files', formData)` (Content-Type 은 브라우저가 정함) | multipart, 필드명은 화면과 협의                       |
| 다운로드 | `api.raw.get(url, { responseType: 'blob' })`                     | `Content-Disposition: attachment; filename*=UTF-8''…` |

## 8. 내 PC 에서 함께 띄우기

| 방법                    | 설정                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| 백엔드 CORS 허용 (기본) | `.env` 의 `VITE_API_URL=http://localhost:8080`, 백엔드에서 `http://localhost:5173` 허용 · credentials 허용 |
| CORS 없이 (Vite 프록시) | `.env` 의 `VITE_API_URL=/server` → Vite 가 `/server` 를 떼고 `localhost:8080` 으로 전달                    |
| 다른 PC 의 백엔드       | `VITE_PROXY_TARGET=http://192.168.0.10:8080 npm run dev`                                                   |

## 9. 프론트에서 API 함수 만들기

여러 화면이 쓰는 API 는 도메인별 파일 하나로 모읍니다. 화면은 이 함수만 부릅니다.

```js
// src/services/api/workOrderApi.js
import apiClient from '@/services/api/apiClient';

export const workOrderApi = {
    /** 목록 - GET /work-orders?page=1&size=10&… → { items, total } */
    list: (params) => apiClient.get('/work-orders', { params }),
    /** 상세 */
    get: (id) => apiClient.get(`/work-orders/${id}`),
    /** 저장 - id 가 있으면 수정, 없으면 등록 */
    save: (form) => (form.id ? apiClient.put(`/work-orders/${form.id}`, form) : apiClient.post('/work-orders', form)),
    /** 여러 건 삭제 */
    remove: (ids) => apiClient.delete('/work-orders', { data: ids }),
};
```
