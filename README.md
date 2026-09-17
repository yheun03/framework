# Framework

Nuxt 3 기반의 Jonsoft 웹 퍼블리싱/프론트엔드 공통 프레임워크입니다.

공통 UI 컴포넌트, Pinia store, composable, SCSS 구조, demo 페이지를 포함하며  
새 화면을 만들 때 동일한 방식으로 개발할 수 있도록 기본 구조를 제공합니다.

## 기업별 프로젝트 시작하기

이 저장소를 새 기업 프로젝트로 복사한 뒤 아래 순서대로 수정합니다. 기업 정보와 전용 코드는 공통 코드에 섞지 않는 것을 원칙으로 합니다.

### 1. 프로젝트 정보와 SEO 수정

루트의 [`project.config.ts`](./project.config.ts) 한 파일에서 다음 항목을 변경합니다.

| 설정                | 용도                                         | 예시                                |
| ------------------- | -------------------------------------------- | ----------------------------------- |
| `key`               | 기업 전용 폴더명. 영문 kebab-case 사용       | `acme`                              |
| `companyName`       | 회사명, copyright 등에 사용                  | `ACME Corp.`                        |
| `serviceName`       | 서비스명, 화면 브랜드명, OG site name에 사용 | `ACME Works`                        |
| `locale`            | HTML/OG 언어                                 | `ko`                                |
| `baseURL`           | 앱이 배포되는 경로. 도메인 루트는 `/`        | `/works/`                           |
| `siteUrl`           | 운영 사이트의 절대 URL과 canonical URL       | `https://works.acme.com/`           |
| `favicon`           | `public/` 기준 파비콘 경로                   | `images/projects/acme/favicon.svg`  |
| `themeColor`        | 브라우저 UI용 대표 색상                      | `#0057B8`                           |
| `seo.title`         | 기본 브라우저/검색 결과 제목                 | `ACME Works`                        |
| `seo.titleTemplate` | 하위 페이지 title 규칙                       | `%s \| ACME Works`                  |
| `seo.description`   | 검색 결과 및 SNS 공유 설명                   | 기업별 설명                         |
| `seo.keywords`      | 검색 키워드 배열                             | `['ACME', 'ERP']`                   |
| `seo.ogImage`       | `public/` 기준 OG 이미지 경로                | `images/projects/acme/og-image.png` |
| `seo.ogImageAlt`    | OG 이미지 대체 문구                          | `ACME Works`                        |

`nuxt.config.ts`는 위 설정으로 title, description, canonical, favicon, theme color, Open Graph와 Twitter 메타 태그를 자동 생성합니다. 페이지별 title은 기업명을 붙이지 않고 다음처럼 화면명만 작성합니다.

```ts
useHead({ title: '로그인' });
```

그러면 `로그인 | ACME Works`처럼 `seo.titleTemplate`이 자동 적용됩니다.

> `siteUrl`은 반드시 실제 운영 주소로 변경합니다. 하위 경로에 배포하면 `baseURL`과 `siteUrl`에 같은 경로를 포함합니다. OG 이미지는 SNS 호환성을 위해 1200×630 크기의 PNG 또는 JPG를 권장합니다.

### 2. 기업별 색상 수정

기존 `framework` 폴더를 `project.config.ts`의 `key`와 같은 이름으로 복사하거나 변경합니다.

```text
assets/scss/projects/framework/
├── _theme.scss
└── index.scss

↓ key가 acme인 경우

assets/scss/projects/acme/
├── _theme.scss
└── index.scss
```

`_theme.scss`의 `$primary`, `$secondary`, `$tertiary`를 바꾸면 50~900 팔레트와 공통 컴포넌트 색상이 자동 생성됩니다. Header, LNB, Page Navigator만 다른 색이 필요한 경우 같은 파일의 `null` 값을 실제 색상으로 변경합니다.

```scss
$primary: #0057b8;
$secondary: #4b5563;
$tertiary: #003f87;

// 별도 지정이 필요한 항목만 변경
$lnb-background: linear-gradient(180deg, #003f87, #00295a);
```

`project.config.ts`의 `themeColor`도 `$primary`와 같은 값으로 맞춥니다. SCSS 색상은 컴파일 시 사용하고 `themeColor`는 브라우저 메타 태그에 사용하므로 두 값이 각각 필요합니다.

### 3. 이미지 교체

기업별 이미지는 다음 폴더에 모읍니다.

```text
public/images/projects/{key}/
├── favicon.svg
└── og-image.png
```

파일명이 다르면 `project.config.ts`의 `favicon`, `seo.ogImage` 경로도 함께 변경합니다. 정적 배포의 base URL은 자동 반영됩니다.

### 4. 기업 전용 컴포넌트와 SCSS 분리

공통 컴포넌트는 기존 `components/`에 유지하고, 특정 기업 또는 프로젝트에서만 사용하는 코드는 반드시 해당 `key` 폴더에 둡니다.

```text
components/
├── AppButton/                       # 모든 프로젝트 공통
└── projects/
    └── acme/
        ├── AcmeDashboardSummary.vue
        └── AcmeOrderStatus.vue

assets/scss/
├── components/base/                 # 모든 프로젝트 공통
└── projects/
    └── acme/
        ├── _theme.scss              # 기업 테마 토큰
        ├── _dashboard.scss          # 기업 전용 화면/컴포넌트 스타일
        └── index.scss               # 기업 전용 SCSS 진입점
```

기업 전용 컴포넌트는 활성 프로젝트 폴더만 Nuxt에 자동 등록됩니다. 파일명은 다른 프로젝트와 충돌하지 않도록 `Acme`처럼 기업명 또는 프로젝트명 prefix를 붙입니다.

기업 전용 SCSS 파일은 `index.scss`에서 불러옵니다.

```scss
@use 'dashboard';
```

공통으로 쓸 가능성이 있다는 이유만으로 먼저 공통 폴더에 넣지 않습니다. 실제로 여러 프로젝트에서 동일하게 사용하는 것이 확인된 컴포넌트만 공통 영역으로 이동합니다.

### 5. 신규 프로젝트 체크리스트

```text
[ ] project.config.ts의 key, 회사명, 서비스명 수정
[ ] baseURL, siteUrl, title, description, keywords 수정
[ ] favicon, OG 이미지 교체 및 경로 확인
[ ] assets/scss/projects/{key}/_theme.scss 색상 수정
[ ] themeColor와 $primary 값 일치 확인
[ ] components/projects/{key}/ 폴더 생성
[ ] assets/scss/projects/{key}/index.scss 생성
[ ] npm run build로 경로와 SCSS 컴파일 확인
[ ] 배포된 페이지 소스에서 title/description/og:image/canonical 확인
```

## Stack

- Nuxt 3 / Vue 3
- Pinia
- Axios
- SCSS
- AG Grid
- Chart.js
- i18n

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run generate
```

## Documents

- 개발 규칙: [`DEVELOPMENT_GUIDE.md`](./DEVELOPMENT_GUIDE.md)
- 프로젝트 노트: [`project_note.md`](./project_note.md)

## Directory

```text
components/   공통 UI 컴포넌트
components/projects/{key}/ 기업/프로젝트 전용 컴포넌트
composables/  재사용 로직
stores/       Pinia 상태관리
pages/        Nuxt 라우트 페이지
assets/scss/  SCSS 스타일
assets/scss/projects/{key}/ 기업 테마와 전용 SCSS
public/images/projects/{key}/ 기업별 favicon/OG 이미지
types/        공통 타입
utils/        순수 유틸 함수
server/api/   서버 API
```
