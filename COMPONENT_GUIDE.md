# Component Guide

Figma 디자인 시스템(`2026_스타일가이드_v02_조앤`)을 기준으로 정리한 컴포넌트 목록과 공통 속성 규칙입니다.
화면에서는 **퍼블리싱 수준(Vue 속성 + v-if / v-for + 페이지 안 temp JSON)** 으로 작성하는 것을 기본으로 합니다.

- 데모: LNB `디자인시스템 컴포넌트` / `MES 컴포넌트` 메뉴 (컴포넌트별 1페이지, 속성별 아코디언 + 우측 Props 패널), 공통 규칙은 `/demos/demo-guide`
- 토큰: `/demos/demo-design-tokens` (PC/MO 타이포 · 컬러 테이블)
- 조합 예시: `/demos/demo-mes-sample` (작업실적 현황 - 조회 → 목록 → 상세 Drawer → 저장 Toast)

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

## 2. 디자인 토큰 (Figma 03. Typography / 05. Color)

| 파일                             | 내용                                                                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `abstract/_tokens.scss`          | 원본 토큰 SCSS 맵: brand · gradient · font/line/bg color · state color · font weight · `$ds-typography-pc` / `-mo` · 767px         |
| `abstract/_typography.scss`      | `@include font(b2, sb)` / `font(h1, sb, en)` - CSS 변수 기반이라 MO 에서 자동 전환                                                 |
| `base/_typography-vars.scss`     | `--ds-font-{token}-size` / `-lh` (PC 값, `max-width: 767px` 에서 MO 값)                                                            |
| `base/_theme.scss`               | `--theme-brand-*`, `--theme-gradient-*`, `--theme-color-0x`, `--theme-line-*`, `--theme-bg-*`, `--theme-status-*` 를 토큰에서 생성 |
| `base/_utilities.scss`           | `.typo-{h1..}` `.typo-sb` `.typo-en` `.text-*` `.bg-*` `.bg-gradient-*` `.line-*` 유틸 클래스                                      |
| `projects/framework/_theme.scss` | `$primary #0A7CFF` / `$secondary #39C3B6` / `$tertiary #F59917`                                                                    |

- 타이포 토큰: `d1~d6` `h1~h6` `t1~t5` `b1~b4` `c1~c3` `btn1~btn4`, weight `lt`(300) `rg`(400) `sb`(600), 자간 kr -0.025em / en 0
- 상태 색상: error `#DC0000` · success `#04B014` · warning `#FFAA00`
- 컴포넌트에서는 HEX 를 직접 쓰지 않고 `font()` 믹스인과 `--theme-*` / 의미 변수만 사용합니다.

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
