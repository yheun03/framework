# Framework

Jonsoft 공통 퍼블리싱 프레임워크 (Vue 3 · Vite 8 · Pinia · vue-i18n · SCSS · JavaScript)

실무 MES 프로젝트(mti-mes/client)와 같은 구조 · 같은 실행 방식입니다.
새 프로젝트는 이 저장소를 복사한 뒤 **설정 · 색상 · 이미지만 바꿔서** 시작합니다.

## 실행

```bash
npm install
npm run serve      # 로컬 개발 서버 (http://localhost) - .env
npm run dev        # dev 모드로 실행 - .env.dev
npm run pub        # 퍼블리싱 확인용 (같은 네트워크에서 IP:3005 로 접속)
npm run build      # dist/ 생성
```

| 파일       | 모드  | 용도                               |
| ---------- | ----- | ---------------------------------- |
| `.env`     | local | 내 PC 개발 (localhost 접속은 항상) |
| `.env.dev` | dev   | 개발 서버                          |
| `.env.prd` | prd   | 운영 서버                          |
| `.env.pub` | pub   | 퍼블리싱 확인                      |

`VITE_API_URL`(API 주소)과 `VITE_TITLE`(브라우저 제목)을 적습니다. 비밀값은 넣지 않습니다.

## 배포 (Docker)

```bash
docker build -t docker.jonsoft.co.kr/{프로젝트}/client:latest .
docker push docker.jonsoft.co.kr/{프로젝트}/client:latest

docker compose -f docker-compose-dev.yml up -d    # 개발 서버 (MODE=dev, :latest)
docker compose -f docker-compose-prd.yml up -d    # 운영 서버 (MODE=prd, :release)
```

- 이미지는 한 번만 빌드하고, 컨테이너가 시작할 때 `MODE` 값으로 `/api-config.js` 를 만들어 API 주소를 고릅니다.
- `nginx.conf`: SPA 새로고침 대응, `/api/` → 백엔드(`server:8080`) 프록시.
- 이미지 주소 · 컨테이너명 · 백엔드 서비스명은 프로젝트에 맞게 바꿉니다.
- 데모 사이트(GitHub Pages)는 main 에 push 하면 자동 배포됩니다. (`npm run build:pages`)

## 새 프로젝트 시작 (4단계)

1. **설정** — `src/project.config.js` 의 `key` · 회사명 · 서비스명, `.env*` 의 `VITE_TITLE`, `index.html` 의 파비콘 · 설명
2. **색상** — `src/assets/styles/projects/{key}/_theme.scss`

    ```scss
    $primary: #0057b8; // 50~900 팔레트 · 버튼 · 포커스 · 텍스트 대비 색까지 자동 생성
    $secondary: #4b5563;
    $tertiary: #003f87; // 브랜드 그라디언트 = tertiary → primary (134deg)
    ```

3. **이미지** — `public/images/projects/{key}/` (favicon 등)
4. **기업 전용 코드** — `src/components/projects/{key}/`, `src/assets/styles/projects/{key}/` 에만 둡니다.

## 폴더 구조

```text
src/
├── views/          화면 (파일 경로 = 주소: views/demos/demo-button.vue → /demos/demo-button)
├── components/     공통 컴포넌트 (App*)
├── layouts/        DefaultLayout (LNB · 탭)
├── router/         라우터 · 화면별 옵션(ROUTE_META)
├── store/          Pinia
├── composables/    use* 재사용 로직
├── services/api/   axios 클라이언트
├── i18n/           vue-i18n (ko · en)
├── constants/      공용 상수
├── utils/          순수 함수
└── assets/         styles(SCSS) · fonts
```

## 문서

| 문서                                           | 내용                                    |
| ---------------------------------------------- | --------------------------------------- |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | 코드 규칙 · 접근성 규칙                 |
| [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)     | 공통 속성 · 디자인 토큰 · 컴포넌트 목록 |

화면으로 보기: 실행 후 LNB **가이드 → 공통 속성 규칙 / 디자인 토큰**
