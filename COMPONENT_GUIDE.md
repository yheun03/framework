# Component Guide

Figma 디자인 시스템(`2026_스타일가이드_v02_조앤`)을 기준으로 정리한 컴포넌트 목록과 공통 속성 규칙입니다.
화면에서는 **퍼블리싱 수준(Vue 속성 + v-if / v-for + 페이지 안 temp JSON)** 으로 작성하는 것을 기본으로 합니다.

- 데모: LNB `디자인시스템 컴포넌트` / `MES 컴포넌트` / `홈페이지 컴포넌트` 메뉴 (컴포넌트별 1페이지, 속성별 아코디언 + 우측 Props 패널), 공통 규칙은 `/demos/demo-guide`
- 토큰: `/demos/demo-design-tokens` (PC/MO 타이포 · 굵기 · 컬러 · System 팔레트 · 여백 · 그리드 · 라운드 · 그림자)
- 조합 예시: `/demos/demo-mes-sample` (작업실적 현황 - 조회 → 목록 → 상세 Drawer → 저장 Toast), `/demos/demo-corporate-sample` (기업 홈페이지), `/demos/demo-product-sample` (제품 홈페이지)

## 1. 공통 속성 규칙

같은 의미는 모든 컴포넌트에서 같은 이름을 씁니다. 타입은 `types/appCommon.ts`.

| 속성                    | 값                                                                                    | 설명                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `v-model`               | 컴포넌트별                                                                            | 입력값, 선택 id(Tabs/Steps/Tree/Segmented), 열린 id 배열(Accordion), 선택 행 배열(DataTable)                            |
| `v-model:open`          | boolean                                                                               | 레이어 열림 (Drawer / Popover / Tooltip)                                                                                |
| `items`                 | Array                                                                                 | 모든 목록 데이터 (Select, Tabs, Accordion, Segmented, Steps, Timeline, Tree, Transfer, Carousel, Breadcrumb, DataTable) |
| `label`                 | string                                                                                | 필드 라벨 / 짧은 표시 텍스트                                                                                            |
| `title` · `description` | string                                                                                | 블록 제목 · 설명                                                                                                        |
| `hint`                  | string                                                                                | 필드 하단 문구. `state` 색상을 따라감                                                                                   |
| `size`                  | `xs` `sm` `md` `lg` `xl`                                                              | 버튼 기준 24 / 36 / 44 / 48 / 56px (Figma 버튼 사이즈)                                                                  |
| `width`                 | `240` · `'50%'` · `'full'`                                                            | 숫자는 px, `full` = 100%                                                                                                |
| `height`                | number · string                                                                       | 세로 크기                                                                                                               |
| `tone`                  | `primary` `secondary` `gray` `danger` `warning` `success` `info`                      | 색상 의미 (AppTag 는 `black` `red` `orange` `green` `blue` `navy` `purple` 추가)                                        |
| `variant`               | `fill` `soft` `outline` `plain` `line` …                                              | 시각 스타일                                                                                                             |
| `shape`                 | `square` `round` `pill` (+`circle`, `underline`)                                      | 모서리                                                                                                                  |
| `state`                 | `error` `warning` `success`                                                           | **검증 상태만** 표현                                                                                                    |
| `placement`             | `top` `bottom` `left` `right`                                                         | 레이어 위치                                                                                                             |
| `initial`               | `none` `first` `all`                                                                  | 최초 열림/선택 (Tabs, Accordion, Tree)                                                                                  |
| boolean                 | `disabled` `readonly` `loading` `active` `required` `clearable` `closable` `multiple` | on/off 상태·기능                                                                                                        |

## 2. 디자인 토큰 (Figma 01. Spacing / 02~04. Layout / 05. Color / 06·08. Typography / 14. Thumbnail / 21. Shadow)

| 파일                             | 내용                                                                                                                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `abstract/_tokens.scss`          | 원본 토큰 SCSS 맵: brand · gradient · font/line/bg color · state color · font weight · `$ds-typography-pc` / `-mo` · 767px                                                                             |
| `abstract/_layout.scss`          | `space(24)` · `radius(lg)` 함수, `@include tablet` (1199px) / `@include mo` (767px) mixin                                                                                                              |
| `abstract/_typography.scss`      | `@include font(b2, sb)` / `font(h1, sb, en)` - CSS 변수 기반이라 MO 에서 자동 전환                                                                                                                     |
| `base/_typography-vars.scss`     | `--ds-font-{token}-size` / `-lh` (PC 값, `max-width: 767px` 에서 MO 값)                                                                                                                                |
| `base/_layout-vars.scss`         | `--ds-space-{2~180}`, `--ds-radius-{sm~xl}`, `--ds-grid-{width,margin,gutter,columns}` (Tablet 8 / MO 4 Column 자동 전환)                                                                              |
| `base/_theme.scss`               | `--theme-brand-*`, `--theme-gradient-*`, `--theme-color-0x`, `--theme-line-*`, `--theme-bg-*`, `--theme-status-*` 를 토큰에서 생성                                                                     |
| `base/_utilities.scss`           | `.typo-{h1..}` `.typo-sb` `.typo-en` `.text-*` `.bg-*` `.bg-gradient-*` `.line-*` 유틸 클래스                                                                                                          |
| `projects/framework/_theme.scss` | `$primary #FF5900` / `$secondary #111111` / `$tertiary #FF7830` → `--theme-gradient-brand` = `linear-gradient(134deg, #FF7830 1.83%, #FF5900 98.55%)` (Primary 버튼·브랜드 배지·띠배너), LNB `#111111` |

- 타이포 토큰: `d1~d6` `h1~h6` `t1~t5` `b1~b4` `c1~c3` `btn1~btn4`, weight `lt`(300) `rg`(400) `md`(500, 썸네일 브랜드명) `sb`(600), 자간 kr -0.025em / en 0
- 폰트 파일: Pretendard 1.3.9 Light / Regular / Medium / SemiBold / Bold (`assets/fonts`)
- 여백 토큰 (세로 기준, 짝수): `2 4 8 12 16 20 24 28 32 40 48 56 60 70 80 100 120 140 180` (56 PC / 60 MO) → `space(n)`, `.mt-n` `.mb-n` `.pt-n` `.pb-n` `.gap-n`
- 그리드: `.ds-container`(기본 1580 / 마진 20 / 거터 20) + `--1920-wide` `--1920-narrow` `--1560-wide` `--1320-wide` `--1280-narrow` `--fluid`, `.ds-grid > .ds-col-{1~12}` (Tablet·MO 자동 환산, 덮어쓰기 `.ds-col-t-{1~8}` `.ds-col-m-{1~4}`)
- 라운드: `sm 10` `md 12` `lg 20` `xl 28` (Figma 썸네일 크기별 라운드) → `radius(key)`, `.radius-key`
- 상태 색상: error `#DC0000` · success `#04B014` · warning `#FFAA00`
- 컴포넌트에서는 HEX 를 직접 쓰지 않고 `font()` 믹스인과 `--theme-*` / 의미 변수만 사용합니다.
- 그라디언트 변수는 `background` 단축 속성으로 사용합니다. (`background-color` 에는 그라디언트를 넣을 수 없습니다)
- 상태 info 는 Figma 상태 컬러에 없어 System Blue 700(`#3776CB`) 을 사용합니다.

### 아이콘 (Lucide)

- `@lucide/vue` 아이콘을 `components/icons.ts` 에 `Icon*` 이름으로 등록해 사용합니다. (`<IconSearch />`)
- 크기 `font-size` · 색 `color` · 선 두께 `--app-icon-stroke-width` (기본 2, Figma 22. Icon Guide 의 2px 세트 / 큰 아이콘은 1.5)
- 채움 아이콘(별점 · 찜)은 `createIcon(Star, { filled: true })` 로 정의합니다.
- Lucide 에 없는 SNS 로고(Instagram · Facebook · YouTube · X)는 같은 규격의 SVG 로 직접 정의했습니다. 라이선스 고지: `/legal/lucide`

## 3. 추가 컴포넌트

### Figma 스타일가이드 기반

| 컴포넌트                     | Figma 위치                                    | 파일                                                                                                            |
| ---------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| AppTag                       | 11. ETC - 태그 / 셀링아이콘                   | `components/AppTag.vue`, `_tag.scss`                                                                            |
| AppInputNumber               | 11. ETC - 수량 버튼 (A/B/C)                   | `components/AppInputNumber.vue`, `_input-number.scss`                                                           |
| AppInputGroup                | 09. Select - 전화번호 셀렉트                  | `components/AppInputGroup.vue`, `_input-group.scss`                                                             |
| AppTooltip                   | 11. ETC - 말풍선                              | `components/AppTooltip.vue`, `_tooltip.scss`                                                                    |
| AppPopover                   | 12. Popup - 노출 레이어                       | `components/AppPopover.vue`, `_tooltip.scss`                                                                    |
| AppRating                    | 11. ETC - 평점                                | `components/AppRating.vue`, `_rating.scss`                                                                      |
| AppCarousel                  | 11. ETC - 좌우 슬라이드 / 인디케이터 / 플레이 | `components/AppCarousel.vue`, `_carousel.scss`                                                                  |
| AppTopButton                 | 11. ETC - 탑 버튼                             | `components/AppButton/AppTopButton.vue`, `_top-button.scss`                                                     |
| AppToastHost + useToast      | 12. Popup - 토스트 팝업                       | `components/AppToastHost.vue`, `composables/useToast.ts`, `stores/toast.ts`, `types/appToast.ts`, `_toast.scss` |
| AppEmpty                     | 20. No search result                          | `components/AppEmpty.vue`, `_empty.scss`                                                                        |
| AppDataTable                 | 13. Table - 게시판형 / 라인·면 구분           | `components/Table/AppDataTable.vue`, `_data-table.scss`                                                         |
| System palette / Shadow 토큰 | 05. Color / 21. Shadow                        | `abstract/_palette.scss`, `base/_theme-extend.scss`                                                             |

### MES 공통

| 컴포넌트                       | 용도                                 | 파일                                                     |
| ------------------------------ | ------------------------------------ | -------------------------------------------------------- |
| AppSearchPanel · AppSearchItem | 목록 상단 조회 조건                  | `components/AppSearch/*`, `_search-panel.scss`           |
| AppStatCard                    | KPI 카드 (증감/진행률)               | `components/AppStatCard.vue`, `_stat-card.scss`          |
| AppStatusLamp                  | 설비 상태 램프                       | `components/AppStatusLamp.vue`, `_stat-card.scss`        |
| AppSteps                       | 공정/결재 단계                       | `components/AppSteps.vue`, `_steps.scss`                 |
| AppTimeline                    | LOT·알람 이력                        | `components/AppTimeline.vue`, `_steps.scss`              |
| AppTree                        | BOM / 메뉴 / 조직 트리               | `components/AppTree/*`, `types/appTree.ts`, `_tree.scss` |
| AppTransfer                    | 권한·설비·작업자 배정                | `components/AppTransfer.vue`, `_transfer.scss`           |
| AppBreadcrumb                  | 화면 경로                            | `components/AppBreadcrumb.vue`, `_drawer.scss`           |
| AppSegmented                   | 일/주/월 등 보기 전환                | `components/AppSegmented.vue`, `_drawer.scss`            |
| AppDrawer                      | 옆에서 열리는 상세/등록 패널         | `components/AppDrawer.vue`, `_drawer.scss`               |
| AppAlert                       | 화면 내 고정 알림 배너               | `components/AppAlert.vue`, `_alert.scss`                 |
| AppSpinner                     | 로딩 (inline / overlay / fullscreen) | `components/AppSpinner.vue`, `_spinner.scss`             |

### 홈페이지 공통 (Figma 14~19 / MO 06)

| 컴포넌트                          | Figma 위치                         | 파일                                                                          |
| --------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| AppSiteHeader                     | 18. GNB Guide - 기본 GNB           | `components/AppSite/AppSiteHeader.vue`, `_site-header.scss`                   |
| AppSiteFooter                     | 19. Footer Guide - 기본 / 블랙     | `components/AppSite/AppSiteFooter.vue`, `_site-footer.scss`                   |
| AppDockBar                        | MO 06. Dock Bar Guide              | `components/AppSite/AppDockBar.vue`, `_dock-bar.scss`                         |
| AppBillboard                      | 16. Billboard Banner (풀 / 카드형) | `components/AppBillboard.vue`, `_billboard.scss`                              |
| AppLineBanner                     | 17. Line Banner (90/120/180/240)   | `components/AppLineBanner.vue`, `_line-banner.scss`                           |
| AppProductCard · AppPromotionCard | 14·15. Thumbnail Guide             | `components/AppProductCard.vue`, `AppPromotionCard.vue`, `_product-card.scss` |
| AppCarousel `navVariant="banner"` | 16·17. 좌우화살표\_BG (56x80)      | 기존 `AppCarousel.vue` 옵션 추가                                              |

### 기업·제품 홈페이지 / MES 확장 (Figma 에 없는 컴포넌트를 같은 토큰으로 확장)

| 컴포넌트         | 용도                                  | 파일                                                      |
| ---------------- | ------------------------------------- | --------------------------------------------------------- |
| AppHeading       | 섹션 제목 (eyebrow / 제목 / 설명)     | `components/AppHeading.vue`, `_heading.scss`              |
| AppFeatureCard   | 사업 영역 · 제품 특징 · 서비스 소개   | `components/AppFeatureCard.vue`, `_feature-card.scss`     |
| AppPricingCard   | 요금제 / 라이선스                     | `components/AppPricingCard.vue`, `_pricing-card.scss`     |
| AppEquipmentCard | MES 설비 현황 (StatusLamp + Progress) | `components/AppEquipmentCard.vue`, `_equipment-card.scss` |

- 샘플 화면 스타일: `assets/scss/pages/_site-sample.scss` (섹션 세로 간격 120 / MO 60)
- 샘플 이미지: `public/images/projects/framework/sample/*.svg` (페이지에서 `useRuntimeConfig().app.baseURL` 을 앞에 붙여 사용)

### Base 컴포넌트 조합 규칙

새 컴포넌트는 네이티브 `<button>` / `<input>` 대신 기존 base 컴포넌트를 조합합니다.

| base                 | 사용처                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AppIconButton`      | Tag 닫기, InputNumber ±, Tooltip/Popover/Alert/Toast/Drawer 닫기, Carousel 좌우·재생, Tree 토글, Transfer 이동, SearchPanel 접기                 |
| `AppTextButton`      | Breadcrumb 링크, Toast 액션                                                                                                                      |
| `AppInput`           | InputNumber 입력, Transfer 검색 (InputGroup 은 AppInput/AppSelect 를 슬롯으로 묶는 래퍼)                                                         |
| `AppButton`          | SearchPanel 조회/초기화 (Drawer 하단은 `#footer` 슬롯에 AppButton 배치)                                                                          |
| `AppButton unstyled` | 동작만 쓰고 모양은 컴포넌트가 정의: Tag(clickable), Rating 별, TopButton, Carousel 점, StatCard·Steps(clickable), Segmented, DataTable 정렬 헤더 |

- `unstyled` 는 `.app-button-unstyled` (테두리/배경/패딩 제거, focus-visible 유지) 만 남깁니다.
- `AppIconButton` 크기는 인라인 스타일로 적용되므로 `size` / `icon-size` 숫자 props 로 넘기고, 색상만 CSS 변수(`--icon-button-color`, `--icon-button-bg` …)로 덮어씁니다.

## 4. 퍼블리싱 작성 패턴

```vue
<template>
    <AppSearchPanel :columns="4" @search="search" @reset="reset">
        <AppSearchItem label="라인"><AppSelect v-model="filter.line" :items="lines" size="xs" /></AppSearchItem>
    </AppSearchPanel>

    <AppDataTable v-model="checked" :columns="columns" :items="rows" selectable show-total>
        <template #cell-status="{ value }">
            <AppTag variant="soft" dot :tone="statusTone[value]" :label="value" />
        </template>
    </AppDataTable>
</template>

<script setup lang="ts">
// temp 데이터 - API 연동 시 이 영역만 교체
const lines = [{ value: 'L1', label: '1라인' }];
const columns = [
    { key: 'orderNo', label: '작업지시' },
    { key: 'status', label: '상태' },
];
const rows = ref([{ id: 1, orderNo: 'WO-001', status: '진행' }]);
</script>
```

- 색상은 컴포넌트 SCSS 에서 `--bg-*`, `--color-*`, `--border-*` 의미 변수만 사용합니다. 새 토큰은 `base/_theme-extend.scss` 에 추가합니다.
- 토스트는 `app.vue` 의 `<AppToastHost />` 가 렌더링하고, 화면에서는 `useToast()` 만 호출합니다.
