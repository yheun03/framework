<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Columns / Items -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Columns / Items"
                    description="columns(컬럼 정의) + items(JSON 행 데이터)만으로 목록을 그립니다. AG Grid 없이 쓰는 가벼운 HTML 테이블입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>columns</b> : { key, label, width, align, sortable, format }</li>
                        <li><b>items</b> : 행 데이터 배열</li>
                        <li><b>rowKey</b> : 행 고유 키 (기본값 id)</li>
                    </ul>

                    <AppDataTable :columns="eventColumns" :items="events" />
                </PageDemoSection>

                <!-- Variant -->
                <PageDemoSection class="page-demo-section" title="Variant" description="Figma 테이블 가이드 스타일입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>board</b> : 게시판형 - 헤더 면 (기본값)</li>
                        <li><b>line</b> : 상단 진한 라인 (라인 구분)</li>
                        <li><b>stripe</b> : 짝수 행 면 (면 구분)</li>
                        <li><b>border</b> : 셀 경계선</li>
                    </ul>

                    <div class="page-demo-stack">
                        <template v-for="variant in ['board', 'line', 'stripe', 'border']" :key="variant">
                            <p class="page-demo-hint">variant = "{{ variant }}"</p>
                            <AppDataTable :variant="variant" size="sm" :columns="eventColumns" :items="events.slice(0, 3)" />
                        </template>
                    </div>
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="행 높이입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 36px</li>
                        <li><b>md</b> : 48px (기본값)</li>
                        <li><b>lg</b> : 56px</li>
                    </ul>

                    <div class="page-demo-stack">
                        <AppDataTable v-for="size in ['sm', 'lg']" :key="size" :size="size" :columns="eventColumns" :items="events.slice(0, 2)" />
                    </div>
                </PageDemoSection>

                <!-- Cell Slot -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Cell Slot"
                    description="#cell-{key} 슬롯으로 셀을 꾸밉니다. 슬롯 값: { row, value, index }"
                >
                    <ul class="page-demo-hint-list">
                        <li><b>#cell-{key}</b> : 예: #cell-status, #cell-progress</li>
                    </ul>

                    <AppDataTable size="sm" :columns="workColumns" :items="workOrders">
                        <template #cell-status="{ value }">
                            <AppTag variant="soft" shape="round" dot :tone="statusTone[String(value)]" :label="String(value)" />
                        </template>
                        <template #cell-progress="{ row }">
                            <AppProgressBar :value="Number(row.progress)" show-value />
                        </template>
                    </AppDataTable>
                </PageDemoSection>

                <!-- Selectable / v-model -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Selectable / v-model"
                    description="체크박스(AppChoice) 선택입니다. v-model 은 선택된 rowKey 배열입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>selectable</b> : 체크박스 컬럼 노출</li>
                        <li><b>v-model</b> : 선택된 rowKey 배열</li>
                    </ul>

                    <AppDataTable v-model="selectedIds" size="sm" :columns="workColumns" :items="workOrders" selectable />
                    <p class="page-demo-output">v-model: {{ selectedIds }}</p>
                </PageDemoSection>

                <!-- Sortable -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Sortable"
                    description="컬럼 정렬입니다. 정렬 헤더는 AppButton(unstyled) 이며 클릭할 때마다 오름차순/내림차순이 바뀝니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>columns[].sortable</b> : 정렬 가능 컬럼</li>
                        <li><b>@sort</b> : { key, order } 이벤트</li>
                    </ul>

                    <AppDataTable size="sm" :columns="workColumns" :items="workOrders" @sort="(sort) => (lastSort = `${sort.key} ${sort.order}`)" />
                    <p class="page-demo-output">sort: {{ lastSort || '-' }}</p>
                </PageDemoSection>

                <!-- Clickable -->
                <PageDemoSection class="page-demo-section" title="Clickable" description="행 클릭 이벤트입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>clickable</b> : 행 클릭 가능 - row-click(row, index) 이벤트</li>
                        <li><b>hoverable</b> : 마우스 오버 행 강조 (기본값 true)</li>
                    </ul>

                    <AppDataTable
                        size="sm"
                        :columns="workColumns"
                        :items="workOrders.slice(0, 3)"
                        clickable
                        @row-click="(row) => (clickedRow = String(row.orderNo))"
                    />
                    <p class="page-demo-output">row-click: {{ clickedRow || '-' }}</p>
                </PageDemoSection>

                <!-- Title / ShowTotal / #toolbar -->
                <PageDemoSection class="page-demo-section" title="Title / ShowTotal / #toolbar" description="상단 영역입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>title</b> : 테이블 제목</li>
                        <li><b>showTotal</b> : 총 건수 표시</li>
                        <li><b>total</b> : 총 건수 직접 지정 (페이지네이션 시)</li>
                        <li><b>#toolbar</b> : 오른쪽 버튼 영역</li>
                    </ul>

                    <AppDataTable title="작업지시 목록" show-total size="sm" :columns="workColumns" :items="workOrders.slice(0, 3)" :total="128">
                        <template #toolbar>
                            <AppButton size="xs">엑셀</AppButton>
                            <AppButton size="xs" variant="fill" tone="primary">등록</AppButton>
                        </template>
                    </AppDataTable>
                </PageDemoSection>

                <!-- Height -->
                <PageDemoSection class="page-demo-section" title="Height" description="지정하면 세로 스크롤 + 헤더 고정이 됩니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>height</b> : number(px) | string</li>
                    </ul>

                    <AppDataTable size="sm" :columns="workColumns" :items="manyOrders" :height="200" />
                </PageDemoSection>

                <!-- Empty -->
                <PageDemoSection class="page-demo-section" title="Empty" description="데이터가 없으면 AppEmpty 가 표시됩니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>emptyText</b> : 기본 문구</li>
                        <li><b>#empty</b> : 빈 화면 슬롯</li>
                    </ul>

                    <AppDataTable size="sm" :columns="eventColumns" :items="[]" empty-text="조회된 이벤트가 없습니다." />
                </PageDemoSection>
            </main>
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AppDataTableColumn } from '~/components/Table/AppDataTable.vue';

const { title, description } = useDemoI18n('dataTable');

// ---------- temp data ----------
const eventColumns: AppDataTableColumn[] = [
    { key: 'name', label: '이벤트명', align: 'left' },
    { key: 'period', label: '이벤트 기간', width: 200 },
    { key: 'announce', label: '이벤트 발표', width: 120 },
    { key: 'result', label: '당첨여부', width: 100 },
];

const events = [
    { id: 1, name: '금영노래방으로 가을 노래 부르리 GO!구매! 이벤트', period: '2023.11.20 ~ 2023.12.20', announce: '2023.12.25', result: '당첨' },
    { id: 2, name: 'ZEM 펀드 10월 이벤트', period: '2023.11.20 ~ 2023.12.20', announce: '2023.12.25', result: '미당첨' },
    { id: 3, name: '2030 다이어트 경품 이벤트', period: '2023.11.20 ~ 2023.12.20', announce: '2023.12.25', result: '당첨' },
    { id: 4, name: '신학기 선물 이벤트', period: '2023.11.20 ~ 2023.12.20', announce: '2023.12.25', result: '당첨' },
];

const workColumns: AppDataTableColumn[] = [
    { key: 'orderNo', label: '작업지시번호', width: 140, sortable: true },
    { key: 'item', label: '품목', align: 'left', sortable: true },
    { key: 'planQty', label: '계획수량', width: 100, align: 'right', sortable: true },
    { key: 'progress', label: '진척률', width: 160 },
    { key: 'status', label: '상태', width: 100 },
];

const workOrders = [
    { id: 'WO-001', orderNo: 'WO-2610-001', item: '브라켓 A형 (BR-100)', planQty: 1200, progress: 100, status: '완료' },
    { id: 'WO-002', orderNo: 'WO-2610-002', item: '하우징 커버 (HC-220)', planQty: 800, progress: 64, status: '진행' },
    { id: 'WO-003', orderNo: 'WO-2610-003', item: '샤프트 (SF-030)', planQty: 3000, progress: 0, status: '대기' },
    { id: 'WO-004', orderNo: 'WO-2610-004', item: '기어 세트 (GS-410)', planQty: 450, progress: 27, status: '정지' },
];

const manyOrders = Array.from({ length: 12 }, (_, index) => ({
    ...workOrders[index % workOrders.length],
    id: `WO-${index + 1}`,
    orderNo: `WO-2610-${String(index + 1).padStart(3, '0')}`,
}));

const statusTone: Record<string, 'success' | 'primary' | 'gray' | 'danger'> = { 완료: 'success', 진행: 'primary', 대기: 'gray', 정지: 'danger' };
const selectedIds = ref<unknown[]>([]);
const clickedRow = ref('');
const lastSort = ref('');
</script>
