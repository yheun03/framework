# Framework

Jonsoft 공통 퍼블리싱 프레임워크 (Nuxt 3 · Vue 3 · Pinia · SCSS)

새 프로젝트는 이 저장소를 복사한 뒤 **설정 · 색상 · 이미지만 바꿔서** 시작합니다.

```bash
npm install
npm run dev        # 개발 서버
npm run generate   # 정적 배포 (sitemap.xml · robots.txt 자동 생성)
```

## 새 프로젝트 시작 (4단계)

### 1. `project.config.ts` 수정

| 항목                          | 예시                                       |
| ----------------------------- | ------------------------------------------ |
| `key`                         | `acme` (기업 폴더명, kebab-case)           |
| `companyName` / `serviceName` | `ACME Corp.` / `ACME Works`                |
| `baseURL` / `siteUrl`         | `/works/` / `https://acme.com/works/`      |
| `themeColor`                  | `$primary` 와 같은 값                      |
| `seo.*`                       | title · description · keywords · OG 이미지 |

> 페이지 제목은 화면명만 쓰면 됩니다. `useHead({ title: '로그인' })` → `로그인 | ACME Works`

### 2. 색상 수정 — `assets/scss/projects/{key}/_theme.scss`

```scss
$primary: #0057b8; // 50~900 팔레트 · 버튼 · 포커스 · 텍스트 대비 색까지 자동 생성
$secondary: #4b5563;
$tertiary: #003f87; // 브랜드 그라디언트 = tertiary → primary (134deg)
```

Header · LNB 등 따로 바꿀 항목만 `null` 대신 값을 넣습니다.

### 3. 이미지 교체 — `public/images/projects/{key}/`

`favicon.svg`, `og-image.png`(1200×630 권장)

### 4. 기업 전용 코드는 `{key}` 폴더에만

```text
components/projects/{key}/      AcmeOrderStatus.vue  (기업명 prefix)
assets/scss/projects/{key}/     _theme.scss · index.scss
```

여러 프로젝트에서 실제로 쓰는 것이 확인된 것만 공통 폴더로 옮깁니다.

## 체크리스트

- [ ] `project.config.ts` 의 key · 이름 · URL · SEO
- [ ] `_theme.scss` 색상, `themeColor` 일치
- [ ] favicon · OG 이미지
- [ ] `npm run generate` 후 title · canonical · sitemap.xml 확인

## 문서

| 문서                                           | 내용                                    |
| ---------------------------------------------- | --------------------------------------- |
| [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) | 폴더 구조 · 코드 규칙 · 접근성 규칙     |
| [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)     | 공통 속성 · 디자인 토큰 · 컴포넌트 목록 |

화면으로 보기: 실행 후 LNB **가이드 → 공통 속성 규칙 / 디자인 토큰**
