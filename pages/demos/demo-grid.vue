<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>
                <!-- GRID 1 -->
                <PageDemoAccordionSection class="page-demo-accordion" title="사용자 목록">
                    <AppGridToolbar>
                        <AppGridSearch v-model="search1" :fields="searchFields1" :api="grid1Api" />
                        <AppGridDownload grid-id="grid1" :api="grid1Api" />
                    </AppGridToolbar>
                    <ClientOnly>
                        <AppGrid grid-id="grid1" class="page-demo-grid" :row-data="rows1" :column-defs="columns1"
                            :default-col-def="defaultColDef" :get-row-height="getRowHeight"
                            :row-selection="multiRowSelection" animate-rows height="320px"
                            @grid-ready="grid1Api = $event.api" />
                    </ClientOnly>
                </PageDemoAccordionSection>
                <PageDemoAccordionSection class="page-demo-accordion" title="셀 클릭 데모">
                    <ClientOnly>
                        <AppGrid grid-id="grid-cell-click" class="page-demo-grid" :row-data="rows1"
                            :column-defs="columns1" :default-col-def="defaultColDef" :row-selection="multiRowSelection"
                            auto-height animate-rows @cell-clicked="handleCellClicked" />
                    </ClientOnly>
                    <p class="page-demo__desc">{{ clickedCellText }}</p>
                </PageDemoAccordionSection>
                <!-- GRID 2 -->
                <PageDemoAccordionSection class="page-demo-accordion" title="주문 목록">
                    <AppGridToolbar>
                        <AppGridSearch v-model="search2" :fields="searchFields2" :api="grid2Api" />
                        <AppGridDownload grid-id="grid2" :api="grid2Api" />
                    </AppGridToolbar>
                    <ClientOnly>
                        <AppGrid grid-id="grid2" class="page-demo-grid" :row-data="rows2" :column-defs="columns2"
                            :default-col-def="defaultColDef" :get-row-height="getRowHeight"
                            :row-selection="multiRowSelection" animate-rows height="320px"
                            @grid-ready="grid2Api = $event.api" />
                    </ClientOnly>
                </PageDemoAccordionSection>
                <!-- GRID 3 -->
                <PageDemoAccordionSection class="page-demo-accordion" title="상품 조회 (단순 그리드)">
                    <AppGridToolbar>
                        <AppGridSearch v-model="search3" :fields="searchFields3" :api="grid3Api" />
                        <AppGridDownload grid-id="grid3" :api="grid3Api" />
                    </AppGridToolbar>
                    <ClientOnly>
                        <AppGrid grid-id="grid3" class="page-demo-grid" :row-data="rows3" :column-defs="columns3"
                            :default-col-def="defaultColDef" auto-height animate-rows @grid-ready="grid3Api = $event.api" />
                    </ClientOnly>
                </PageDemoAccordionSection>
                <PageDemoAccordionSection class="page-demo-accordion" title="셀 렌더러 인풋 예제">
                    <AppGridToolbar>
                        <AppGridDownload grid-id="grid4" :api="grid4Api" />
                    </AppGridToolbar>
                    <ClientOnly>
                        <AppGrid grid-id="grid4" class="page-demo-grid" :row-data="rows4" :column-defs="columns4"
                            :default-col-def="inputExampleColDef" auto-height :row-height="56" animate-rows
                            @grid-ready="grid4Api = $event.api" />
                    </ClientOnly>
                </PageDemoAccordionSection>
                <PageDemoAccordionSection class="page-demo-accordion" title="페이지네이션 예제">
                    <AppGridToolbar>
                        <AppGridDownload grid-id="grid5" :api="grid5Api" />
                    </AppGridToolbar>
                    <ClientOnly>
                        <AppGrid grid-id="grid5" class="page-demo-grid" :row-data="pagedRows" :column-defs="columns1"
                            :default-col-def="defaultColDef" :row-selection="multiRowSelection" animate-rows
                            height="360px" @grid-ready="grid5Api = $event.api" />
                    </ClientOnly>
                    <AppPagination v-model:page="paginationPage" v-model:page-size="paginationPageSize"
                        :total="rowsPagination.length" :page-size-options="[5, 10, 20]" size="sm" />
                </PageDemoAccordionSection>
            </main>

            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky page-demo-stack">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>

    <LayoutBottomBar>
        <template #right>
            <AppButton>test</AppButton>
        </template>
    </LayoutBottomBar>
</template>

<script setup lang="ts">
import type { CellClickedEvent, ColDef, GridApi } from "ag-grid-community";

import type { AppGridSearchField, DateRangeValue } from "~/types/appGrid";

import AppGridCellSelect from "~/components/AppGrid/Cell/AppGridCellSelect.vue";
import AppGridCellInput from "~/components/AppGrid/Cell/AppGridCellInput.vue";
import AppGridCellChoice from "~/components/AppGrid/Cell/AppGridCellChoice.vue";
import AppGridCellTextarea from "~/components/AppGrid/Cell/AppGridCellTextarea.vue";
import AppGridCellDatePicker from "~/components/AppGrid/Cell/AppGridCellDatePicker.vue";
import AppGridCellImage from "~/components/AppGrid/Cell/AppGridCellImage.vue";
import AppGridCellFile from "~/components/AppGrid/Cell/AppGridCellFile.vue";

const { title, description } = useDemoI18n("grid");
const clickedCellText = ref("셀을 클릭하면 선택한 행/컬럼/값이 표시됩니다.");
const grid1Api = shallowRef<GridApi | null>(null);
const grid2Api = shallowRef<GridApi | null>(null);
const grid3Api = shallowRef<GridApi | null>(null);
const grid4Api = shallowRef<GridApi | null>(null);
const grid5Api = shallowRef<GridApi | null>(null);

/* 행 높이 동적 처리 */

const getRowHeight = (params: any) => {
    if (
        Array.isArray(params.data?.attachments) &&
        params.data.attachments.length
    ) {
        return 260;
    }

    if (params.data?.manualFile) {
        return 140;
    }

    if (
        Array.isArray(params.data?.productGallery) &&
        params.data.productGallery.length
    ) {
        return 240;
    }

    if (params.data?.productImage) {
        return 100;
    }

    return 42;
};

/* 검색 상태 */

const deptSearchOptions = [
    { label: "개발", value: "개발" },
    { label: "디자인", value: "디자인" },
    { label: "기획", value: "기획" },
    { label: "운영", value: "운영" },
];

const search1 = reactive({
    name: "",
    verifiedPick: null as string | null,
    qCol: "name",
    qText: "",
    grade: "" as string,
    departmentSet: [] as string[],
    activeOnly: false,
    joinedAt: null as string | null,
});

const searchFields1: AppGridSearchField[] = [
    { field: "name", label: "이름", type: "input", placeholder: "이름 검색" },
    {
        field: "verifiedPick",
        filterField: "verified",
        label: "인증 여부",
        type: "select",
        placeholderSelect: "선택",
        options: [
            { label: "Y (인증)", value: "Y" },
            { label: "N (미인증)", value: "N" },
        ],
    },
    {
        id: "search1-composite",
        field: "_composite",
        label: "통합 검색",
        type: "select_input",
        selectInput: {
            columnKey: "qCol",
            textKey: "qText",
            options: [
                { label: "이름", value: "name" },
                { label: "이메일", value: "email" },
                { label: "부서", value: "department" },
                { label: "점수", value: "score" },
            ],
        },
        placeholderInput: "검색어 입력",
        numberFilterFields: ["score"],
    },
    {
        field: "grade",
        label: "등급",
        type: "radio",
        options: [
            { label: "A", value: "A" },
            { label: "B", value: "B" },
            { label: "C", value: "C" },
        ],
    },
    {
        field: "departmentSet",
        filterField: "department",
        label: "부서(다중)",
        type: "checkbox",
        options: deptSearchOptions,
    },
    {
        field: "activeOnly",
        filterField: "active",
        label: "재직(활성)만",
        type: "toggle",
    },
    {
        field: "joinedAt",
        label: "입사일",
        type: "calendar",
        placeholder: "날짜 선택",
    },
];

const search2 = reactive({
    product: "",
    status: "" as string,
    date: null as DateRangeValue | null,
    shipDate: null as DateRangeValue | null,
});

const searchFields2: AppGridSearchField[] = [
    { field: "product", label: "상품", type: "input", placeholder: "상품명" },
    {
        field: "status",
        label: "상태",
        type: "radio",
        options: [
            { label: "READY", value: "READY" },
            { label: "DELIVERY", value: "DELIVERY" },
            { label: "DONE", value: "DONE" },
        ],
    },
    {
        field: "date",
        label: "주문일(기간)",
        type: "range_calendar",
        placeholder: "주문일 범위",
    },
    {
        field: "shipDate",
        label: "출고일(기간·min/max)",
        type: "range_calendar_minmax",
        min: "2026-01-01",
        max: "2026-12-31",
        placeholder: "출고일 범위",
    },
];

const search3 = reactive({
    product: "",
    listedAt: null as string | null,
});

const searchFields3: AppGridSearchField[] = [
    { field: "product", label: "상품", type: "input", placeholder: "상품 검색" },
    {
        field: "listedAt",
        label: "등록일",
        type: "calendar",
        placeholder: "등록일 선택",
    },
];

/* 기본 column 옵션 */

const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    sortable: true,
    filter: true,
    resizable: true,
};

const inputExampleColDef: ColDef = {
    minWidth: 140,
    sortable: true,
    filter: true,
    resizable: true,
};

const multiRowSelection = {
    mode: "multiRow",
    checkboxes: true,
    headerCheckbox: true,
} as const;

function handleCellClicked(event: CellClickedEvent) {
    const rowName = event.data?.name ?? "-";
    const colName = event.colDef.headerName ?? event.colDef.field ?? "-";
    const value = event.value ?? "-";

    clickedCellText.value = `선택 셀: ${rowName} / ${colName} / ${value}`;
}

const listValueFormatter = (params: any) =>
    Array.isArray(params.value) ? params.value.join(", ") : "";

/* GRID 1 column */

const columns1: ColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 80,
    },

    {
        field: "name",
        headerName: "이름",
    },

    {
        field: "department",
        headerName: "부서",
        filter: "agTextColumnFilter",
    },

    {
        field: "email",
        headerName: "이메일",
    },

    {
        field: "grade",
        headerName: "등급",
        width: 72,
    },

    {
        field: "verified",
        headerName: "인증",
        width: 72,
    },

    {
        field: "active",
        headerName: "재직",
        width: 72,
    },

    {
        field: "joinedAt",
        headerName: "입사일",
        width: 120,
        filter: "agDateColumnFilter",
    },

    {
        field: "score",
        headerName: "점수",
        filter: "agNumberColumnFilter",
    },
];

/* GRID 2 column */

const columns2: ColDef[] = [
    {
        field: "orderId",
        headerName: "주문번호",
        width: 120,
    },

    {
        field: "product",
        headerName: "상품",
    },

    {
        field: "price",
        headerName: "가격",
        filter: "agNumberColumnFilter",
    },

    {
        field: "status",
        headerName: "상태",
    },

    {
        field: "date",
        headerName: "주문일",
        width: 120,
        filter: "agDateColumnFilter",
    },

    {
        field: "shipDate",
        headerName: "출고일",
        width: 120,
        filter: "agDateColumnFilter",
    },
];

/* GRID 3 column */

const columns3: ColDef[] = [
    {
        field: "productId",
        headerName: "상품코드",
        width: 120,
    },

    {
        field: "listedAt",
        headerName: "등록일",
        width: 118,
        filter: "agDateColumnFilter",
    },

    {
        field: "productImage",
        headerName: "대표이미지",
        width: 220,
        autoHeight: true,
        cellRenderer: AppGridCellImage,
        cellRendererParams: {
            triggerText: "대표 이미지 업로드",
            hint: "단일 이미지",
            multiple: false,
        },
    },

    {
        field: "productGallery",
        headerName: "상세이미지",
        width: 260,
        autoHeight: true,
        cellRenderer: AppGridCellImage,
        valueFormatter: listValueFormatter,
        cellRendererParams: {
            triggerText: "상세 이미지 업로드",
            hint: "최대 4개",
            multiple: true,
            maxCount: 4,
        },
    },

    {
        field: "manualFile",
        headerName: "매뉴얼",
        width: 240,
        autoHeight: true,
        cellRenderer: AppGridCellFile,
        cellRendererParams: {
            triggerText: "매뉴얼 업로드",
            hint: "단일 파일",
            accept: ".pdf,.doc,.docx",
            multiple: false,
        },
    },

    {
        field: "attachments",
        headerName: "첨부파일",
        width: 260,
        autoHeight: true,
        cellRenderer: AppGridCellFile,
        valueFormatter: listValueFormatter,
        cellRendererParams: {
            triggerText: "첨부파일 업로드",
            hint: "최대 3개",
            accept: ".pdf,.xlsx,.zip",
            multiple: true,
            maxCount: 3,
        },
    },

    {
        field: "product",
        headerName: "상품명",
        cellRenderer: AppGridCellInput,
        cellRendererParams: {
            placeholder: "상품명 입력",
        },
    },

    {
        field: "category",
        headerName: "카테고리",
        cellRenderer: AppGridCellSelect,
        cellRendererParams: {
            options: [
                { label: "전자기기", value: "전자기기" },
                { label: "주변기기", value: "주변기기" },
            ],
        },
    },

    {
        field: "price",
        headerName: "가격",
        cellRenderer: AppGridCellInput,
        cellRendererParams: {
            type: "number",
        },
    },

    {
        field: "stock",
        headerName: "재고",
        cellRenderer: AppGridCellInput,
        cellRendererParams: {
            type: "number",
            min: 0,
            max: 100,
        },
    },

    {
        field: "releaseDate",
        headerName: "출시일",
        width: 150,
        cellRenderer: AppGridCellDatePicker,
        cellRendererParams: {
            min: "2026-01-01",
            max: "2026-12-31",
            placeholder: "출시일 선택",
        },
    },

    {
        field: "displayOptions",
        headerName: "노출 옵션",
        width: 180,
        cellRenderer: AppGridCellChoice,
        valueFormatter: listValueFormatter,
        suppressHeaderMenuButton: true,
        sortable: false,
        filter: false,
        cellRendererParams: {
            type: "checkbox",
            options: [
                { label: "메인", value: "main" },
                { label: "추천", value: "recommend" },
            ],
        },
    },

    {
        field: "memo",
        headerName: "메모",
        width: 220,
        cellRenderer: AppGridCellTextarea,
        cellRendererParams: {
            rows: 2,
            placeholder: "메모 입력",
        },
    },

    {
        field: "state",
        headerName: "상태",
        cellRenderer: AppGridCellChoice,
        suppressHeaderMenuButton: true,
        sortable: false,
        filter: false,
        cellRendererParams: {
            type: "radio",
            options: [
                { label: "판매중", value: "판매중" },
                { label: "품절", value: "품절" },
            ],
        },
    },
];

/* GRID 4 column */

const columns4: ColDef[] = [
    {
        field: "text",
        headerName: "Text Input",
        width: 180,
        cellRenderer: AppGridCellInput,
        cellRendererParams: {
            placeholder: "텍스트 입력",
        },
    },

    {
        field: "number",
        headerName: "Number Input",
        width: 160,
        cellRenderer: AppGridCellInput,
        cellRendererParams: {
            type: "number",
        },
    },

    {
        field: "select",
        headerName: "Select",
        width: 180,
        cellRenderer: AppGridCellSelect,
        cellRendererParams: {
            options: [
                { label: "대기", value: "대기" },
                { label: "진행", value: "진행" },
                { label: "완료", value: "완료" },
            ],
        },
    },

    {
        field: "date",
        headerName: "DatePicker",
        width: 160,
        cellRenderer: AppGridCellDatePicker,
        cellRendererParams: {
            placeholder: "날짜 선택",
        },
    },

    {
        field: "radio",
        headerName: "Radio",
        width: 180,
        cellRenderer: AppGridCellChoice,
        sortable: false,
        filter: false,
        cellRendererParams: {
            type: "radio",
            options: [
                { label: "Y", value: "Y" },
                { label: "N", value: "N" },
            ],
        },
    },

    {
        field: "checkbox",
        headerName: "Checkbox",
        width: 220,
        cellRenderer: AppGridCellChoice,
        valueFormatter: listValueFormatter,
        sortable: false,
        filter: false,
        cellRendererParams: {
            type: "checkbox",
            options: [
                { label: "SMS", value: "sms" },
                { label: "Email", value: "email" },
            ],
        },
    },

    {
        field: "textarea",
        headerName: "Textarea",
        width: 240,
        autoHeight: true,
        cellRenderer: AppGridCellTextarea,
        cellRendererParams: {
            rows: 2,
            placeholder: "내용 입력",
        },
    },
];

/* GRID 1 data */

const rows1 = [
    {
        id: 1,
        name: "홍길동",
        department: "개발",
        email: "hong@test.com",
        score: 88,
        grade: "A",
        verified: "Y",
        active: "Y",
        joinedAt: "2026-02-01",
    },
    {
        id: 2,
        name: "김민수",
        department: "디자인",
        email: "kim@test.com",
        score: 72,
        grade: "B",
        verified: "N",
        active: "Y",
        joinedAt: "2026-03-12",
    },
    {
        id: 3,
        name: "이서연",
        department: "기획",
        email: "lee@test.com",
        score: 95,
        grade: "A",
        verified: "Y",
        active: "N",
        joinedAt: "2025-11-20",
    },
    {
        id: 4,
        name: "박지훈",
        department: "운영",
        email: "park@test.com",
        score: 61,
        grade: "C",
        verified: "N",
        active: "Y",
        joinedAt: "2026-01-18",
    },
    {
        id: 5,
        name: "최유진",
        department: "개발",
        email: "choi@test.com",
        score: 84,
        grade: "B",
        verified: "Y",
        active: "Y",
        joinedAt: "2026-04-05",
    },
];

const rowsPagination = Array.from({ length: 24 }, (_, index) => {
    const source = rows1[index % rows1.length];
    const pageNo = index + 1;

    return {
        ...source,
        id: pageNo,
        name: `${source.name}${pageNo}`,
        email: `user${String(pageNo).padStart(2, "0")}@test.com`,
        score: Math.max(50, source.score - (index % 7)),
    };
});

const paginationPage = ref(1);
const paginationPageSize = ref(5);
const pagedRows = computed(() => {
    const start = (paginationPage.value - 1) * paginationPageSize.value;
    const end = start + paginationPageSize.value;

    return rowsPagination.slice(start, end);
});

/* GRID 2 data */

const rows2 = [
    {
        orderId: "ORD-001",
        product: "노트북",
        price: 1200000,
        status: "READY",
        date: "2026-03-01",
        shipDate: "2026-03-03",
    },
    {
        orderId: "ORD-002",
        product: "키보드",
        price: 120000,
        status: "DELIVERY",
        date: "2026-03-02",
        shipDate: "2026-03-05",
    },
    {
        orderId: "ORD-003",
        product: "마우스",
        price: 35000,
        status: "DONE",
        date: "2026-03-03",
        shipDate: "2026-03-04",
    },
    {
        orderId: "ORD-004",
        product: "모니터",
        price: 420000,
        status: "DELIVERY",
        date: "2026-03-04",
        shipDate: "2026-03-10",
    },
    {
        orderId: "ORD-005",
        product: "태블릿",
        price: 780000,
        status: "READY",
        date: "2026-03-05",
        shipDate: "2026-03-06",
    },
];

/* GRID 3 data */

const rows3 = [
    {
        productId: "P-001",
        listedAt: "2026-01-08",
        productImage: "https://picsum.photos/80?random=101",
        productGallery: [
            "https://picsum.photos/80?random=111",
            "https://picsum.photos/80?random=112",
        ],
        manualFile: "/samples/notebook-manual.pdf",
        attachments: [
            "/samples/notebook-spec.pdf",
            "/samples/notebook-warranty.pdf",
        ],
        product: "노트북",
        category: "전자기기",
        price: 1200000,
        stock: 12,
        releaseDate: "2026-01-20",
        displayOptions: ["main"],
        memo: "프로모션 대상",
        state: "품절",
    },

    {
        productId: "P-002",
        listedAt: "2026-02-14",
        productImage: "https://picsum.photos/80?random=102",
        productGallery: [
            "https://picsum.photos/80?random=121",
            "https://picsum.photos/80?random=122",
            "https://picsum.photos/80?random=123",
        ],
        manualFile: "/samples/keyboard-manual.docx",
        attachments: [
            "/samples/keyboard-layout.pdf",
            "/samples/keyboard-price.xlsx",
        ],
        product: "키보드",
        category: "주변기기",
        price: 120000,
        stock: 34,
        releaseDate: "2026-02-25",
        displayOptions: ["recommend"],
        memo: "키 배열 확인 필요",
        state: "품절",
    },

    {
        productId: "P-003",
        listedAt: "2026-02-20",
        productImage: "https://picsum.photos/80?random=103",
        productGallery: ["https://picsum.photos/80?random=131"],
        manualFile: "/samples/mouse-manual.pdf",
        attachments: ["/samples/mouse-guide.pdf"],
        product: "마우스",
        category: "주변기기",
        price: 35000,
        stock: 50,
        releaseDate: "2026-03-02",
        displayOptions: ["main", "recommend"],
        memo: "인기 상품",
        state: "판매중",
    },

    {
        productId: "P-004",
        listedAt: "2026-03-01",
        productImage: "https://picsum.photos/80?random=104",
        productGallery: [
            "https://picsum.photos/80?random=141",
            "https://picsum.photos/80?random=142",
            "https://picsum.photos/80?random=143",
            "https://picsum.photos/80?random=144",
        ],
        manualFile: "/samples/monitor-manual.pdf",
        attachments: [
            "/samples/monitor-install.pdf",
            "/samples/monitor-driver.zip",
            "/samples/monitor-checklist.xlsx",
        ],
        product: "모니터",
        category: "전자기기",
        price: 420000,
        stock: 7,
        releaseDate: "2026-03-12",
        displayOptions: [],
        memo: "재입고 예정",
        state: "품절",
    },

    {
        productId: "P-005",
        listedAt: "2026-03-15",
        productImage: "https://picsum.photos/80?random=105",
        productGallery: [],
        manualFile: "/samples/tablet-manual.pdf",
        attachments: [],
        product: "태블릿",
        category: "전자기기",
        price: 780000,
        stock: 9,
        releaseDate: "2026-03-22",
        displayOptions: ["recommend"],
        memo: "",
        state: "판매중",
    },
];

/* GRID 4 data */

const rows4 = [
    {
        text: "기본 텍스트",
        number: 10,
        select: "대기",
        date: "2026-04-01",
        radio: "Y",
        checkbox: ["sms"],
        textarea: "셀 안에서 textarea를 확인합니다.",
    },

    {
        text: "수정 가능",
        number: 25,
        select: "진행",
        date: "2026-04-15",
        radio: "N",
        checkbox: ["sms", "email"],
        textarea: "여러 인풋 렌더러를 같은 방식으로 사용합니다.",
    },

    {
        text: "",
        number: 0,
        select: "완료",
        date: null,
        radio: "Y",
        checkbox: [],
        textarea: "",
    },
];
</script>
