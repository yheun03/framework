# Component Guide

Figma 디자인 시스템(`2026_스타일가이드_v02_조앤`) 기준 컴포넌트 · 토큰 요약입니다.
자세한 예시와 전체 속성은 **실행 화면의 데모 페이지**에서 확인합니다.

- **우측 Props 패널**: 컴포넌트의 모든 prop · 값 · 기본값. 값을 누르면 `속성="값"` 이 복사됩니다. 실제 props 와 다르면 `npm run check` 가 실패합니다.
- **소스 코드 보기**: 상단 탭 오른쪽 `</>` 버튼 → 지금 화면의 .vue 파일 전체를 보고 복사합니다.
- **잘못된 값 경고**: `tone="dangr"` 처럼 지원하지 않는 값을 넣으면 개발 모드 콘솔에 사용 가능한 값이 나옵니다.

| 보고 싶은 것                  | 데모 주소                                       |
| ----------------------------- | ----------------------------------------------- |
| 공통 속성 규칙                | `/demos/demo-guide`                             |
| 타이포 · 컬러 · 여백 · 그리드 | `/demos/demo-design-tokens`                     |
| 조합 예시                     | `demo-mes-sample` · LNB **ERP · MES 예제 화면** |

## 1. 공통 속성

같은 의미는 모든 컴포넌트에서 **같은 이름 · 같은 값**을 씁니다. (값 목록은 각 데모 페이지 우측 Props 패널)

| 속성                  | 값                                                               | 뜻                         |
| --------------------- | ---------------------------------------------------------------- | -------------------------- |
| `v-model`             | 컴포넌트별                                                       | 입력값 · 선택 id · 열린 id |
| `items`               | Array                                                            | 모든 목록 데이터           |
| `label`               | string                                                           | 필드 라벨 · 짧은 텍스트    |
| `title` `description` | string                                                           | 블록 제목 · 설명           |
| `hint`                | string                                                           | 필드 하단 문구             |
| `size`                | `xs` `sm` `md` `lg` `xl`                                         | 크기 (높이는 아래 표)      |
| `width`               | `240` `'50%'` `'full'`                                           | 숫자는 px                  |
| `tone`                | `primary` `secondary` `gray` `danger` `warning` `success` `info` | 색 의미                    |
| `variant`             | `fill` `soft` `outline` `plain` …                                | 모양                       |
| `shape`               | `square` `round` `pill`                                          | 모서리                     |
| `state`               | `error` `warning` `success`                                      | **검증 상태만**            |
| `placement`           | `top` `bottom` `left` `right`                                    | 레이어 위치                |
| `direction`           | `horizontal` `vertical`                                          | 배치 방향                  |
| `tag`                 | `h1` ~ `h4`                                                      | 제목 태그 (heading 순서)   |
| `ariaLabel`           | string                                                           | 화면에 라벨이 없을 때 이름 |

- 예외 (라이브러리 · 업무 의미를 따름): `AppChart` 의 `data`(Chart.js 데이터 객체), `AppEquipmentCard` 의 `status`(설비 상태 `run` `idle` `stop` `check` `off` → 색은 자동)
- on/off 는 boolean: `disabled` `readonly` `active` `required` `clearable` `closable` …
- 보이기 여부는 `show*` (`showValue` `showTotal` …), 버튼 문구는 `*Text` (`emptyText` `searchText` …)

### size 별 실제 높이 (px)

**같은 `size` 이름 = 같은 높이**입니다. 한 컴포넌트의 크기 이름을 알면 다른 컴포넌트도 같은 이름으로 맞춥니다. (Figma 디자인 시스템 기준)

| 이름 | `xs` | `sm` | `md` | `lg` | `xl` |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 높이 | 24   | 36   | 44   | 48   | 56   |

| 컴포넌트                               | 쓰는 이름          | 기본값 |
| -------------------------------------- | ------------------ | ------ |
| Button · IconButton                    | `xs` ~ `xl`        | `md`   |
| Input · Select · DatePicker · Textarea | `sm` ~ `xl`        | `lg`   |
| Tabs (line · fill · outline · box)     | `sm` ~ `xl`        | `md`   |
| DataTable (행 높이)                    | `sm` ~ `xl`        | `lg`   |
| InputNumber                            | `xs` ~ `lg`        | `sm`   |
| Segmented                              | `sm` ~ `lg`        | `md`   |
| Carousel `navSize` (좌우 버튼)         | `xs` ~ `xl` · 숫자 | `lg`   |

- 한 줄에 입력과 버튼을 같이 둘 때는 **같은 이름**을 씁니다. (조회 영역 AppSearchPanel 은 입력 · 버튼 모두 `sm` 36px)
- IconButton 은 표에 없는 크기만 숫자(px)로 지정합니다. (예: `:size="32"`)
- 높이가 아닌 크기 (이름은 같지만 글자 · 아이콘 크기 기준)
    - TextButton · Tabs `text` `divider` : 글자 크기 (TextButton `sm` 12 · `md` 13 · `lg` 14 / Tabs 14 · 16 · 18 · 20)
    - Tag `xs` 18 · `sm` 22 · `md` 28, Choice(체크 · 라디오 박스) `sm` 18 · `md` 22
- 모달 · 드로어 너비도 이름으로 지정합니다: Modal `sm` 420 · `md` 640 · `lg` 900 / Drawer `sm` 360 · `md` 480 · `lg` 640 (특별한 경우만 `width`)
- 모양(`shape`)은 모든 컴포넌트에서 `square` `round` `pill` 같은 이름입니다. (입력 계열은 `underline` 추가)

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

LNB 메뉴 그룹과 같은 분류입니다.

| 분류 (LNB)   | 컴포넌트                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 입력         | Input · Textarea · Select · Choice · InputNumber · InputGroup · DatePicker · FormField · UploadImage · UploadFile              |
| 버튼 · 표시  | Button · IconButton · TextButton · TopButton · Tag · Rating · Tooltip · Popover · Empty · Spinner · Alert                      |
| 탐색         | Tabs · Accordion · Breadcrumb · Pagination · Segmented · Steps · Carousel                                                      |
| 레이어       | Modal (`await useModal().confirm()`) · Drawer · Toast (`useToast()`)                                                           |
| 레이아웃     | Section · SectionWrapper · LayoutBottomBar(하단 고정 버튼)                                                                     |
| 데이터 · MES | DataTable · Table · Grid · SearchPanel · StatCard · StatusLamp · EquipmentCard · Timeline · Tree · Transfer · Chart · Progress |

- 파일은 `src/components/App{이름}.vue` (묶음은 폴더), 스타일은 `src/assets/styles/components/base/_{이름}.scss`
- 자동 등록이 없으므로 쓰는 컴포넌트는 `import AppButton from '@/components/AppButton/AppButton.vue'` 처럼 직접 import 합니다.
- 새 컴포넌트는 `<button>` · `<input>` 대신 기존 base 를 조합합니다.
  `AppIconButton`(닫기 · 화살표) · `AppTextButton`(링크) · `AppInput` · `AppButton unstyled`(동작만)

## 4. 작성 패턴 — 기본 목록 화면

조회 조건 → 목록 → 페이지 이동으로 구성한 MES 목록 화면입니다. **그대로 복사해서 `src/views/` 에 넣으면 실행됩니다.**

- 실행 화면: LNB **가이드 → 화면 작성 예제** (`/demos/demo-page-example`)
- 원본 파일: `src/views/demos/demo-page-example.vue` — 아래 코드와 같습니다. (`npm run check` 가 다르면 알려줍니다)

```vue
<template>
    <div class="business-page">
        <header class="business-page__header">
            <div>
                <h1 class="business-page__title">작업지시 목록</h1>
                <p class="business-page__desc">조회 조건 → 목록 → 페이지 이동으로 구성한 기본 목록 화면입니다.</p>
            </div>
            <div class="business-page__actions">
                <AppButton variant="fill" tone="primary" size="sm" @click="toast.info('등록 화면으로 이동합니다.')">작업지시 등록</AppButton>
            </div>
        </header>

        <!-- 조회 조건: 입력 · 버튼 모두 size="sm"(36px) - 같은 이름 = 같은 높이 -->
        <AppSearchPanel :columns="4" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="작업일자" :span="2">
                <AppDatePicker v-model="filter.period" type="range-input" size="sm" />
            </AppSearchItem>
            <AppSearchItem label="라인">
                <AppSelect v-model="filter.line" :items="lines" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="상태">
                <AppSelect v-model="filter.status" :items="statuses" size="sm" placeholder="전체" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <AppDataTable
                v-model="checked"
                title="작업지시"
                caption="작업지시 목록"
                :columns="columns"
                :items="pagedRows"
                :total="rows.length"
                selectable
                show-total
            >
                <template #toolbar>
                    <AppButton size="xs" :disabled="!checked.length" @click="remove">선택 삭제</AppButton>
                </template>
                <template #cell-status="{ value }">
                    <AppTag variant="soft" dot :tone="statusTone[value]" :label="value" />
                </template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="rows.length" />
        </AppSection>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useToast } from '@/composables/useToast';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

const toast = useToast();

// temp 데이터 - API 연동 시 이 영역만 교체 (const api = useApi(); rows.value = await api.get('/work-orders', { params: filter }))
const lines = [
    { value: 'L1', label: '1라인' },
    { value: 'L2', label: '2라인' },
];
const statuses = [
    { value: '진행', label: '진행' },
    { value: '완료', label: '완료' },
    { value: '정지', label: '정지' },
];
const allRows = [
    { id: 1, orderNo: 'WO-2611-001', line: '1라인', item: '브래킷 A형', qty: 1200, status: '진행' },
    { id: 2, orderNo: 'WO-2611-002', line: '1라인', item: '하우징 커버', qty: 800, status: '완료' },
    { id: 3, orderNo: 'WO-2611-003', line: '2라인', item: '샤프트', qty: 3000, status: '정지' },
];

const columns = [
    { key: 'orderNo', label: '작업지시', width: 140 },
    { key: 'line', label: '라인', width: 100 },
    { key: 'item', label: '품목', align: 'left' },
    { key: 'qty', label: '수량', width: 100, align: 'right' },
    { key: 'status', label: '상태', width: 100 },
];
const statusTone = { 진행: 'info', 완료: 'success', 정지: 'danger' };

const filter = reactive({ period: { start: '2026-11-01', end: '2026-11-30' }, line: null, status: null });
const rows = ref([...allRows]);
const checked = ref([]);
const page = ref(1);
const pageSize = ref(10);
const loading = ref(false);

const pagedRows = computed(() => rows.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value));

function search() {
    const lineLabel = lines.find((line) => line.value === filter.line)?.label;
    rows.value = allRows.filter((row) => (!lineLabel || row.line === lineLabel) && (!filter.status || row.status === filter.status));
    page.value = 1;
    checked.value = [];
}

function reset() {
    Object.assign(filter, { period: { start: '2026-11-01', end: '2026-11-30' }, line: null, status: null });
    search();
}

function remove() {
    rows.value = rows.value.filter((row) => !checked.value.includes(row.id));
    toast.success(`${checked.value.length}건을 삭제했습니다.`);
    checked.value = [];
}
</script>
```
