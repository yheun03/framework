# Framework

Jonsoft 공통 퍼블리싱 프레임워크 — **MES · ERP 같은 업무 관리 시스템 전용** (Vue 3 · Vite 8 · Pinia · vue-i18n · SCSS · JavaScript)

> 기업·제품 홈페이지(GNB · 빌보드 · 상품 카드 등)는 지원 범위가 아닙니다.

실무 MES 프로젝트(mti-mes/client)와 같은 구조 · 같은 실행 방식입니다.
새 프로젝트는 이 저장소를 복사한 뒤 **설정 · 색상 · 이미지만 바꿔서** 시작합니다.

## 처음 받은 사람 (5분)

1. Node **20.19 이상** (`.nvmrc` = 22) 확인 → `npm install` → `npm run serve` → http://localhost:5173
2. 편집기에 Vue(Official) · ESLint · Prettier 확장을 설치하고 '저장 시 포맷'을 켭니다. 들여쓰기 · 줄바꿈은 `.editorconfig` 가 맞춥니다.
3. LNB **가이드 → 화면 템플릿 · 목록** 을 열고, 상단 탭 오른쪽 `</>` 버튼으로 소스를 봅니다.
4. 아래 표에서 내 역할의 '먼저 읽을 것' → '첫 과제' 순서로 진행합니다.

## 역할별 시작하기

| 역할              | 먼저 읽을 것                                                                                   | 주로 만지는 곳                                                         | 첫 과제 (30분)                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **신입**          | 이 문서 → [DEVELOPMENT_GUIDE](./DEVELOPMENT_GUIDE.md) 1-1 · 2 · 9장(자주 하는 실수)            | `src/views/` 화면 파일 하나                                            | `npm run new:page` 로 목록 화면 하나 만들고 컬럼 · 조회 조건 바꾸기  |
| **경력 (프론트)** | [DEVELOPMENT_GUIDE](./DEVELOPMENT_GUIDE.md) 0장(구조) · 4장 → `useSearchList` · `useForm` 소스 | `composables/` · `services/api/` · `components/`                       | 예제 화면 하나를 `{도메인}Api.js` + 실제 API 로 연결                 |
| **백엔드**        | [API_GUIDE](./API_GUIDE.md) 전체                                                               | 서버 응답 모양 · `project.config.js` 의 `menuUrl` · `codeUrl` · `auth` | 목록 API 하나를 `{ items, total }` · `page` 1부터로 맞춰 화면과 연결 |
| **퍼블리셔**      | [COMPONENT_GUIDE](./COMPONENT_GUIDE.md) 1 · 4 · 5장 + 데모 우측 Props 패널                     | `src/views/` 템플릿 부분 · `assets/styles/` · `projects/{key}/`        | 템플릿 복사 → `// temp 데이터` 로 화면 완성 (스크립트는 temp 영역만) |
| **PM · 설계**     | 이 문서 · LNB **ERP · MES 예제 화면**                                                          | -                                                                      | 화면 정의서의 각 화면을 5가지 유형 중 하나로 분류                    |

## 실행 · 검사

```bash
npm install
npm run serve      # 로컬 개발 서버 (http://localhost:5173) - .env
npm run dev        # dev 모드로 실행 - .env.dev
npm run pub        # 퍼블리싱 확인용 (같은 네트워크에서 IP:3005 로 접속)
npm run build      # dist/ 생성
npm run new:page -- <경로> <유형> "<화면명>"   # 새 화면 (list · form · detail · master-detail · picker)

npm run check      # 커밋 · PR 전 전체 검사: lint → 포맷 → 단위 테스트 → 문서 예제 → Props 패널 → 빌드
npm run lint       # ESLint (console · 사용하지 않는 변수 등)
npm run format     # Prettier 자동 정리
npm test           # 단위 테스트 (tests/*.test.mjs, Node 내장 테스트 러너)
```

- `npm install` 시 git 커밋 전 검사(lint · 포맷)와 AI 공동 작성자 줄 제거가 자동 연결됩니다. (`.githooks/pre-commit` · `commit-msg`)
- main 에 push 하면 GitHub Actions 가 같은 검사를 통과한 경우에만 데모 사이트를 배포합니다.

| 파일       | 모드  | 용도                               |
| ---------- | ----- | ---------------------------------- |
| `.env`     | local | 내 PC 개발 (localhost 접속은 항상) |
| `.env.dev` | dev   | 개발 서버                          |
| `.env.prd` | prd   | 운영 서버                          |
| `.env.pub` | pub   | 퍼블리싱 확인                      |

`VITE_API_URL`(API 주소)과 `VITE_TITLE`(기본 문서 제목)을 적습니다. 비밀값은 넣지 않습니다.

- 모드 결정: npm 스크립트의 `VITE_APP_MODE`(serve · dev · prd · pub) → 없으면 컨테이너가 만든 `/api-config.js`(docker-compose `MODE`) → 없으면 local
- 배포 이미지는 모드 없이 한 번만 빌드합니다. (`npm run build`) 같은 이미지가 dev · prd 컨테이너에서 각각의 `.env.dev` · `.env.prd` 값을 씁니다.

**API 주소가 정해지는 방식**

| 실행                      | 주소                              | 전달                                                     |
| ------------------------- | --------------------------------- | -------------------------------------------------------- |
| `serve` (localhost 접속)  | `.env` 의 `http://localhost:8080` | 백엔드 직접 호출 (백엔드 CORS 허용 필요)                 |
| `pub` · `dev` (개발 서버) | `/api`                            | Vite 가 `/api` 를 `VITE_PROXY_TARGET`(기본 :8080)로 전달 |
| Docker (dev · prd)        | `/api`                            | nginx 가 `/api/` 를 `server:8080` 으로 전달              |

- CORS 를 피하고 싶으면 `.env` 의 `VITE_API_URL=/server` → Vite 가 `/server` 를 떼고 로컬 백엔드로 전달합니다.

## 배포 (Docker)

```bash
docker build -t docker.jonsoft.co.kr/{프로젝트}/client:latest .
docker push docker.jonsoft.co.kr/{프로젝트}/client:latest

docker compose -f docker-compose-dev.yml up -d    # 개발 서버 (MODE=dev, :latest)
docker compose -f docker-compose-prd.yml up -d    # 운영 서버 (MODE=prd, :release)
```

| 파일                     | 이미지 태그 | MODE  | 실무와 같은 점                                                             |
| ------------------------ | ----------- | ----- | -------------------------------------------------------------------------- |
| `docker-compose-dev.yml` | `:latest`   | `dev` | 2칸 들여쓰기 · `expose 80` · 외부 네트워크 `default-network` · 업로드 200M |
| `docker-compose-prd.yml` | `:release`  | `prd` | 헬스체크 `curl -f http://localhost:80/login` (30s · 5회 · 시작 40s)        |

- 이미지는 한 번만 빌드하고, 컨테이너가 시작할 때 `MODE` 값으로 `/api-config.js` 를 만들어 API 주소를 고릅니다.
- `nginx.conf`: SPA 새로고침 대응, `/api/` → 백엔드(`server:8080`) 프록시.
- 이미지 주소 · 컨테이너명은 `init-project` 가 `{key}` 로 바꿉니다. (실무처럼 이름이 다르면 직접 수정) 백엔드 서비스명은 `nginx.conf` 에서 바꿉니다.
- `index.html` 은 캐시하지 않고(`no-cache`), 해시가 붙은 `/assets/` 는 1년 캐시합니다. 배포 직후에도 새 화면이 바로 보입니다.
- `Dockerfile` 은 `npm ci --ignore-scripts` 로 설치합니다. (git 훅 연결 스크립트가 빌드 단계에는 없음)
- 데모 사이트(GitHub Pages)는 main 에 push 하면 자동 배포됩니다. (`npm run build:pages`)

## 새 프로젝트 시작

```bash
npm run init-project -- acme "ACME" "ACME MES"   # key · 회사명 · 서비스명
```

`init-project` 가 아래 1번과 Docker 이미지 · 컨테이너 이름을 한 번에 처리합니다. (기존 `framework` 폴더는 지우지 않습니다)

1. **설정**
    - 기업 폴더 3곳을 `{key}` 이름으로 복사: `src/assets/styles/projects/` · `src/components/projects/` · `public/images/projects/`
    - `src/project.config.js` 의 `key` · `companyName` · `serviceName` (문서 제목 `메뉴명 | 서비스명` 도 함께 바뀜)
    - `.env*` 의 `VITE_TITLE`
    - `key` 와 폴더명이 다르면 `npm run serve` 가 바로 알려줍니다.
2. **색상** — `src/assets/styles/projects/{key}/_theme.scss` (브랜드 색은 여기 한 곳에서만 정합니다)

    ```scss
    $primary: #0057b8; // 50~900 팔레트 · 버튼 · 포커스 · 글자용 대비 색 · index.html theme-color 까지 자동
    $secondary: #4b5563;
    $tertiary: #003f87; // 브랜드 그라디언트 = tertiary → primary (134deg)
    ```

3. **이미지 · 설명** — `public/images/projects/{key}/favicon.svg` 교체, `project.config.js` 의 `description`
4. **기업 전용 코드** — `src/components/projects/{key}/`, `src/assets/styles/projects/{key}/` 에만 둡니다.

## 첫 화면 만들기

화면 유형(목록 · 등록/수정 · 상세 · 마스터-디테일 · 선택 팝업)을 고르고 해당 템플릿으로 시작합니다. → [COMPONENT_GUIDE 4장](./COMPONENT_GUIDE.md#4-작성-패턴--표준-화면-유형)

예) 출하 목록 화면 `/shipments` 를 추가합니다. (완성된 모습은 LNB **ERP · MES 예제 화면 → 작업지시 목록**)

```bash
npm run new:page -- shipments list "출하 목록" --menu MENU_026000   # 목록 + LNB 메뉴 한 줄
npm run new:page -- shipments/[id] detail "출하 상세"              # 상세 (메뉴 없음)
npm run new:page -- shipments/new form "출하 등록"                 # 등록 · 수정
```

1. **화면 파일** — `new:page` 가 템플릿을 `src/views/shipments.vue` 로 복사합니다. (직접 복사해도 됩니다)
   파일 경로가 곧 주소, 상세 화면은 `views/shipments/[id].vue` → `/shipments/:id`
2. **메뉴** — `--menu 상위메뉴id` 를 주면 `src/constants/menus.js` 에 한 줄 추가 (`root` = 1단계). 다국어가 필요하면 `label` 대신 `labelKey` + `i18n/*.js`
3. **확인** — `npm run serve` → LNB 에서 열기 (상단 탭 · 문서 제목 `메뉴명 | 서비스명` 자동)
4. **데이터** — `// ── temp 데이터` ~ `// temp 데이터 끝` 영역만 교체 (예: `const fetchShipments = (params) => shipmentApi.list(params)`)
   오류 토스트 · 로그인 토큰 · 401 은 공통 처리, API 함수는 `services/api/{도메인}Api.js` ([API_GUIDE 9장](./API_GUIDE.md#9-프론트에서-api-함수-만들기))
5. **검사** — `npm run check`

레이아웃 없는 화면(로그인 등) · 탭에서 뺄 화면은 `src/router/index.js` 의 `ROUTE_META` 에 `layout: false` · `tab: false`.

## 폴더 구조

```text
src/
├── views/          화면 (파일 경로 = 주소: views/demos/demo-button.vue → /demos/demo-button)
├── components/     공통 컴포넌트 (App*)
├── layouts/        DefaultLayout (LNB · 탭)
├── router/         라우터 · 화면별 옵션(ROUTE_META)
├── store/          Pinia
├── composables/    use* 재사용 로직 (useSearchList · useForm · useModal · useApi …)
├── services/api/   axios 클라이언트 · 도메인별 API 함수 ({도메인}Api.js)
├── i18n/           vue-i18n (ko · en)
├── constants/      공용 상수 · LNB 메뉴(menus.js)
├── utils/          순수 함수 (props 값 검사 · 색 대비 · 샘플 이미지 …)
└── assets/         styles(SCSS) · fonts
scripts/            init-project · new-page · check-docs · check-props 등 노드 스크립트
tests/              단위 테스트 (npm test)
```

## 문서

| 문서                                           | 내용                                                                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | 코드 규칙 · API · 로그인 · 문구(i18n) · SCSS · 접근성 · 작업 후 확인                          |
| [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)     | 공통 속성 · size 높이표 · 디자인 토큰 · 컴포넌트 목록 · 표준 화면 유형 · 화면 레이아웃 클래스 |
| [API_GUIDE.md](./API_GUIDE.md)                 | 백엔드 연동 약속 (응답 · 오류 · 페이지 · 메뉴 · 공통코드 · 로그인 · 파일)                     |

화면으로 보기: 실행 후 LNB **가이드 → 공통 속성 규칙 / 디자인 토큰 / 화면 템플릿 · …**
