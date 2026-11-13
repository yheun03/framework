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
| 레이아웃     | Section · SectionWrapper · LayoutBottomBar(하단 고정 버튼) · KioskLayout(현장 터치 단말, `layouts/`)                           |
| 데이터 · MES | DataTable · Table · Grid · SearchPanel · StatCard · StatusLamp · EquipmentCard · Timeline · Tree · Transfer · Chart · Progress |

- 파일은 `src/components/App{이름}.vue` (묶음은 폴더), 스타일은 `src/assets/styles/components/base/_{이름}.scss` (일부 화면만 쓰는 컴포넌트는 그 `.vue` 의 `<style>` 에서 `@use` - DEVELOPMENT_GUIDE 5장)
- 자동 등록이 없으므로 쓰는 컴포넌트는 `import AppButton from '@/components/AppButton/AppButton.vue'` 처럼 직접 import 합니다.
- 새 컴포넌트는 `<button>` · `<input>` 대신 기존 base 를 조합합니다.
  `AppIconButton`(닫기 · 화살표) · `AppTextButton`(링크) · `AppInput` · `AppButton unstyled`(동작만)

## 4. 작성 패턴 — 표준 화면 유형

ERP · MES · TMS 업무 화면은 거의 모두 아래 7가지 유형의 조합입니다. **새 화면은 가장 가까운 템플릿 파일을 복사해서 시작합니다.**
실행 화면은 LNB **가이드 → 화면 템플릿 · …**, 소스는 상단 탭 오른쪽 `</>` 버튼.

| 유형            | 템플릿                                                                                   | 구성                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 목록            | `views/demos/demo-page-example.vue`                                                      | AppSearchPanel → AppDataTable → AppPagination (`useSearchList`)                           |
| 등록 · 수정     | `views/demos/demo-page-form.vue`                                                         | AppSection + `business-form-grid` → LayoutBottomBar                                       |
| 상세 보기       | `views/work-orders/[id].vue`                                                             | 요약(`business-summary`) → 정보(`business-detail`) → 하위 목록                            |
| 마스터 · 디테일 | `views/demos/demo-page-master-detail.vue`                                                | 왼쪽 목록(clickable) → 오른쪽 상세 + 하위 목록                                            |
| 선택 팝업       | `views/demos/demo-page-picker.vue` + `components/PageDemo/picker/PageDemoItemPicker.vue` | 찾기 버튼 → `await useModal().pick(찾기 컴포넌트)`                                        |
| 대용량 그리드   | `views/demos/demo-page-grid.vue`                                                         | AppSearchPanel → AppGrid(셀 편집 · 서버 정렬) → AppPagination, 고친 행만 저장 · 전체 엑셀 |
| 현장 키오스크   | `views/kiosk/work-result.vue` (`ROUTE_META layout: 'kiosk'`)                             | KioskLayout → 큰 카드 선택 → 숫자판 입력 → 큰 등록 버튼                                   |

- **검증**: 등록 · 수정 화면은 `errors` 객체와 `validate()` 함수를 화면 안에 그대로 씁니다. (칸마다 한 줄, 별도 검증 모듈 없음)
- **화면 스크립트 순서**: 모든 템플릿은 `import` → `── temp 데이터` → `── 목록/폼` → `── 동작` 순서입니다. 선택 목록은 temp 영역에서 `ref(DEMO_CODES.X)` → 연동 시 `useCodes('X')`. 다른 사람 화면도 같은 자리에서 찾습니다.
- **데모 데이터 = 서버 JSON 응답 예시**: 화면 파일 **맨 아래 `<script>` 블록**에 `DEMO_*` 상수로 둡니다. 주석에 `GET /api/…` 주소를 적고, 서버가 줄 모양 그대로(코드 값 · 숫자 · 일시 문자열) 씁니다. 백엔드는 이 블록을 보고 같은 JSON 으로 응답하고, 프론트는 API 연동 후 이 블록을 지웁니다. (`'1,200 EA'` 같은 표시용 문자열 · 색(tone)은 넣지 않고 화면이 만듭니다)
- **주소 규칙**: 목록 `views/work-orders.vue` → `/work-orders`, 상세 `views/work-orders/[id].vue` → `/work-orders/:id` (쿼리 `?id=` 를 쓰지 않음). 상세는 LNB 메뉴 대신 `ROUTE_META` 에 `title` 을 적습니다.
- **목록 표**: 기본은 `AppDataTable`. 셀 편집 · 수천 행 · 열 고정이 필요하면 `AppGrid`(AG Grid). HTML `<table>` 을 직접 만들지 않습니다.
    - 서버 페이지 목록의 정렬은 `v-model:sort="sort"` (useSearchList), 조회 실패는 `:error="Boolean(error)"`
    - 엑셀은 표 종류와 관계없이 `fetchAllRows()` + `useAppGridExcelExport().exportRows()` (재고 현황 · 대용량 그리드 예제)
- **상태 표시**: `AppTag variant="soft" dot :tone="codeTone('WO_STATUS', row.status)" :label="row.statusName"` (색은 `constants/codeTone.js`, tone 은 `success` `info` `warning` `danger` `gray`)
- **저장 · 취소**: 화면 하단 `LayoutBottomBar`. 저장하지 않은 변경이 있으면 `isDirty` 로 확인 후 나갑니다.
- 예제 업무 화면(LNB **ERP · MES 예제 화면**)도 같은 규칙으로 만들어져 있습니다.

### 목록 템플릿

- 원본 파일: `src/views/demos/demo-page-example.vue` — 아래 코드와 같습니다. (`npm run check` 가 다르면 알려줍니다)
- API 연동은 temp 영역의 `fetchWorkOrders` 만 바꿉니다. `{ items, total }` 을 돌려주면 페이지를 바꿀 때 자동으로 다시 조회합니다.
- 서버 응답 모양은 파일 맨 아래 `DEMO_CODES` · `DEMO_WORK_ORDERS` (= `GET /api/codes/…` · `GET /api/work-orders` 응답 예시) 입니다.

```vue
<template>
    <div class="business-page">
        <header class="business-page__header">
            <div>
                <h1 class="business-page__title">작업지시 목록</h1>
                <p class="business-page__desc">조회 조건 → 목록 → 페이지 이동으로 구성한 기본 목록 화면입니다.</p>
            </div>
            <div class="business-page__actions">
                <AppButton variant="fill" tone="primary" size="sm" to="/demos/demo-page-form">작업지시 등록</AppButton>
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
            <!-- v-model:sort: 헤더(수량)를 누르면 서버 정렬(sort=qty,asc)로 다시 조회 · 행을 누르면 상세로 (실제 화면: router.push(`/work-orders/${row.id}`) → views/work-orders/[id].vue) -->
            <AppDataTable
                v-model="checked"
                title="작업지시"
                caption="작업지시 목록"
                :columns="columns"
                :items="items"
                :error="Boolean(error)"
                v-model:sort="sort"
                :total="total"
                selectable
                clickable
                show-total
                @row-click="openDetail"
            >
                <template #toolbar>
                    <AppButton size="xs" :disabled="!checked.length" @click="remove">선택 삭제</AppButton>
                </template>
                <template #cell-status="{ row }">
                    <AppTag variant="soft" dot :tone="codeTone('WO_STATUS', row.status)" :label="row.statusName" />
                </template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModal } from '@/composables/useModal';
import { useSearchList } from '@/composables/useSearchList';
import { useToast } from '@/composables/useToast';
import { codeTone } from '@/constants/codeTone';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

const modal = useModal();
const toast = useToast();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const lines = useCodes('LINE'); // import { useCodes } from '@/composables/useCodes'
// const fetchWorkOrders = ({ period, ...params }) => api.get('/work-orders', { params: { ...params, fromDate: period.start, toDate: period.end } });
// const deleteWorkOrders = (ids) => api.delete('/work-orders', { data: ids });
const lines = ref(DEMO_CODES.LINE);
const statuses = ref(DEMO_CODES.WO_STATUS);
let tempRows = DEMO_WORK_ORDERS.items;
const fetchWorkOrders = async ({ line, status, page, size, sort }) => {
    const [sortKey, sortOrder] = sort?.split(',') ?? []; // 'qty,desc' - 서버라면 서버가 정렬
    const rows = tempRows
        .filter((row) => (!line || row.line === line) && (!status || row.status === status))
        .sort((a, b) => (sortKey ? (a[sortKey] > b[sortKey] ? 1 : -1) * (sortOrder === 'desc' ? -1 : 1) : 0));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
const deleteWorkOrders = async (ids) => (tempRows = tempRows.filter((row) => !ids.includes(row.id)));
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'orderNo', label: '작업지시', width: 140 },
    { key: 'lineName', label: '라인', width: 100 },
    { key: 'itemName', label: '품목', align: 'left' },
    { key: 'qty', label: '수량', width: 100, align: 'right', sortable: true },
    { key: 'status', label: '상태', width: 100 },
];

const { filter, items, total, page, pageSize, sort, loading, error, search, reset, reload } = useSearchList({
    filter: () => ({ period: { start: '2026-11-01', end: '2026-11-30' }, line: null, status: null }),
    fetch: fetchWorkOrders,
});
const checked = ref([]);

// ── 동작 ──────────────────────────────────────────────────
/** 행 클릭 → 상세 (실제: router.push(`/work-orders/${row.id}`)) */
function openDetail(row) {
    toast.info(`${row.orderNo} 상세로 이동합니다.`);
}

/** 선택 삭제 → 확인 → 삭제 → 다시 조회 */
async function remove() {
    if (!(await modal.confirm(`선택한 ${checked.value.length}건을 삭제할까요?`))) return;
    await deleteWorkOrders(checked.value);
    toast.success(`${checked.value.length}건을 삭제했습니다.`);
    checked.value = [];
    reload();
}
</script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/LINE · GET /api/codes/WO_STATUS (공통코드: [{ value, label }]) */
const DEMO_CODES = {
    LINE: [
        { value: 'L1', label: '1라인' },
        { value: 'L2', label: '2라인' },
    ],
    WO_STATUS: [
        { value: 'working', label: '진행' },
        { value: 'done', label: '완료' },
        { value: 'stopped', label: '정지' },
    ],
};

/** GET /api/work-orders?fromDate=2026-11-01&toDate=2026-11-30&line=L1&status=working&page=1&size=10 → { items, total } */
const DEMO_WORK_ORDERS = {
    items: [
        {
            id: 1,
            orderNo: 'WO-2611-001',
            line: 'L1',
            lineName: '1라인',
            itemCode: 'FG-10011',
            itemName: '브래킷 A형',
            qty: 1200,
            status: 'working',
            statusName: '진행',
        },
        {
            id: 2,
            orderNo: 'WO-2611-002',
            line: 'L1',
            lineName: '1라인',
            itemCode: 'FG-10022',
            itemName: '하우징 커버',
            qty: 800,
            status: 'done',
            statusName: '완료',
        },
        {
            id: 3,
            orderNo: 'WO-2611-003',
            line: 'L2',
            lineName: '2라인',
            itemCode: 'FG-10031',
            itemName: '샤프트',
            qty: 3000,
            status: 'stopped',
            statusName: '정지',
        },
    ],
    total: 3,
};
</script>
```

## 5. 화면 레이아웃 클래스 (퍼블리셔)

업무 화면의 바깥 틀은 아래 클래스로만 짭니다. (`src/assets/styles/pages/_business.scss`) 화면마다 새 틀 클래스를 만들지 않습니다.

| 클래스                                                                        | 쓰는 곳                                  | 반응형 (tablet ≤1199 · mo ≤767) |
| ----------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------- |
| `business-page`                                                               | 화면 최상위 (최대 1440px · 안쪽 여백 24) | mo: 여백 16                     |
| `business-page__header` · `__title` · `__desc` · `__actions`                  | 제목 줄 (h1 하나) · 오른쪽 버튼          | mo: 세로 쌓기, 버튼 꽉 채움     |
| `business-page__eyebrow`                                                      | 제목 위 작은 분류 (`MES · 작업관리`)     |                                 |
| `business-summary` (`--compact` = 3칸)                                        | 상단 숫자 카드 4칸                       | tablet 2칸 · mo 1칸             |
| `business-form-grid`                                                          | 입력 폼 3칸                              | tablet 2칸 · mo 1칸             |
| `business-detail` · `__item`                                                  | 상세 정보 `dl` 2칸 (dt · dd)             | mo 1칸                          |
| `business-page__section-wrapper` + `AppSectionWrapper direction="horizontal"` | 좌우 2단                                 | mo: 1단                         |
| `equipment-grid`                                                              | 설비 카드 4칸                            | tablet 2칸 · mo 1칸             |

- 한 화면에서만 쓰는 스타일은 그 화면의 `<style scoped lang="scss">` 에 둡니다. 두 화면 이상이 쓰면 `_business.scss` 로 옮깁니다.
- 표 · 조회 조건 · 상태 표시는 클래스가 아니라 컴포넌트(`AppDataTable` · `AppSearchPanel` · `AppTag`)를 씁니다.
