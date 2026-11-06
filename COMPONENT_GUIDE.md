# Component Guide

Figma 디자인 시스템(`2026_스타일가이드_v02_조앤`) 기준 컴포넌트 · 토큰 요약입니다.
자세한 예시와 전체 속성은 **실행 화면의 데모 페이지 + 우측 Props 패널**에서 확인합니다.

| 보고 싶은 것                  | 데모 주소                                                           |
| ----------------------------- | ------------------------------------------------------------------- |
| 공통 속성 규칙                | `/demos/demo-guide`                                                 |
| 타이포 · 컬러 · 여백 · 그리드 | `/demos/demo-design-tokens`                                         |
| 조합 예시                     | `demo-mes-sample` · `demo-corporate-sample` · `demo-product-sample` |

## 1. 공통 속성

같은 의미는 모든 컴포넌트에서 **같은 이름 · 같은 값**을 씁니다. (값 목록은 각 데모 페이지 우측 Props 패널)

| 속성                  | 값                                                               | 뜻                         |
| --------------------- | ---------------------------------------------------------------- | -------------------------- |
| `v-model`             | 컴포넌트별                                                       | 입력값 · 선택 id · 열린 id |
| `items`               | Array                                                            | 모든 목록 데이터           |
| `label`               | string                                                           | 필드 라벨 · 짧은 텍스트    |
| `title` `description` | string                                                           | 블록 제목 · 설명           |
| `hint`                | string                                                           | 필드 하단 문구             |
| `size`                | `xs` `sm` `md` `lg` `xl`                                         | 24 / 36 / 44 / 48 / 56px   |
| `width`               | `240` `'50%'` `'full'`                                           | 숫자는 px                  |
| `tone`                | `primary` `secondary` `gray` `danger` `warning` `success` `info` | 색 의미                    |
| `variant`             | `fill` `soft` `outline` `plain` …                                | 모양                       |
| `shape`               | `square` `round` `pill`                                          | 모서리                     |
| `state`               | `error` `warning` `success`                                      | **검증 상태만**            |
| `placement`           | `top` `bottom` `left` `right`                                    | 레이어 위치                |
| `direction`           | `horizontal` `vertical`                                          | 배치 방향                  |
| `align`               | `left` `center` `right`                                          | 정렬                       |
| `tag`                 | `h1` ~ `h4`                                                      | 제목 태그 (heading 순서)   |
| `ariaLabel`           | string                                                           | 화면에 라벨이 없을 때 이름 |

- on/off 는 boolean: `disabled` `readonly` `active` `required` `clearable` `closable` …
- 보이기 여부는 `show*` (`showValue` `showTotal` …), 버튼 문구는 `*Text` (`emptyText` `moreText` …)

## 2. 디자인 토큰

| 종류   | 사용법                                     | 값                                                                      |
| ------ | ------------------------------------------ | ----------------------------------------------------------------------- |
| 글꼴   | `@include font(b2, sb)` / `.typo-b2`       | `d1~6` `h1~6` `t1~5` `b1~4` `c1~3` · `lt` `rg` `md` `sb` (MO 자동 축소) |
| 여백   | `space(24)` / `.mt-24` `.gap-24`           | 2 4 8 12 16 20 24 28 32 40 48 56 60 70 80 100 120 140 180               |
| 라운드 | `radius(lg)` / `.radius-lg`                | sm 10 · md 12 · lg 20 · xl 28                                           |
| 그리드 | `.ds-container` > `.ds-grid` > `.ds-col-4` | PC 12 · Tablet 8 · MO 4 단 자동 환산                                    |
| 반응형 | `@include tablet` / `@include mo`          | ≤1199px / ≤767px                                                        |
| 그림자 | `var(--shadow-level-1~3)`                  |                                                                         |

**색상**

| 변수                                                    | 용도                                           |
| ------------------------------------------------------- | ---------------------------------------------- |
| `--theme-primary` `--theme-gradient-brand`              | 면 · 테두리 · 아이콘 (#FF5900 · 그라디언트)    |
| `--theme-primary-text`                                  | **글자**로 쓰는 브랜드색 (대비 4.5:1)          |
| `--theme-status-{error,warning,success,info}` / `-text` | 상태 면 / 상태 글자                            |
| `--color-*` `--bg-*` `--border-*`                       | 컴포넌트 의미 변수 (`base/_theme-extend.scss`) |

- 컴포넌트 SCSS 에는 HEX 를 쓰지 않습니다.
- 그라디언트는 `background` 로 지정합니다. (`background-color` 불가)

**아이콘** — Lucide: `import { IconSearch } from '@/components/icons'` → `<IconSearch />`
크기 `font-size`, 색 `color`, 선 두께 `--app-icon-stroke-width`. 새 아이콘은 `src/components/icons.js` 에 등록.

## 3. 컴포넌트 목록

| 분류         | 컴포넌트                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 입력         | Input · Textarea · Select · Choice · InputNumber · InputGroup · DatePicker · FormField · Upload                                |
| 버튼 · 표시  | Button · IconButton · TextButton · TopButton · Tag · Rating · Tooltip · Popover · Empty · Spinner · Alert                      |
| 탐색         | Tabs · Accordion · Breadcrumb · Pagination · Segmented · Steps · Carousel                                                      |
| 레이어       | Modal · Drawer · Toast (`useToast()`)                                                                                          |
| 데이터 · MES | DataTable · Table · Grid · SearchPanel · StatCard · StatusLamp · EquipmentCard · Timeline · Tree · Transfer · Chart · Progress |
| 홈페이지     | SiteHeader · SiteFooter · DockBar · Billboard · LineBanner · ProductCard · PromotionCard · Heading · FeatureCard · PricingCard |

- 파일은 `src/components/App{이름}.vue` (묶음은 폴더), 스타일은 `src/assets/styles/components/base/_{이름}.scss`
- 자동 등록이 없으므로 쓰는 컴포넌트는 `import AppButton from '@/components/AppButton/AppButton.vue'` 처럼 직접 import 합니다.
- 새 컴포넌트는 `<button>` · `<input>` 대신 기존 base 를 조합합니다.
  `AppIconButton`(닫기 · 화살표) · `AppTextButton`(링크) · `AppInput` · `AppButton unstyled`(동작만)

## 4. 작성 패턴

```vue
<template>
    <AppSearchPanel :columns="4" @search="search">
        <AppSearchItem label="라인"><AppSelect v-model="filter.line" :items="lines" size="xs" /></AppSearchItem>
    </AppSearchPanel>

    <AppDataTable v-model="checked" :columns="columns" :items="rows" selectable show-total>
        <template #cell-status="{ value }">
            <AppTag variant="soft" dot :tone="statusTone[value]" :label="value" />
        </template>
    </AppDataTable>
</template>

<script setup>
import { ref } from 'vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppTag from '@/components/AppTag.vue';

// temp 데이터 - API 연동 시 이 영역만 교체
const lines = [{ value: 'L1', label: '1라인' }];
const rows = ref([{ id: 1, orderNo: 'WO-001', status: '진행' }]);
</script>
```
