<template>
    <div class="page-demo mes-sample">
        <!-- 1. 경로 + 제목 -->
        <AppBreadcrumb :items="breadcrumbs" size="sm" />
        <header class="page-demo__header">
            <h1 class="page-demo__title">{{ title }}</h1>
            <p class="page-demo__desc">{{ description }}</p>
        </header>

        <!-- 2. 공지/알람 -->
        <AppAlert
            v-if="alarms.length"
            tone="danger"
            variant="outline"
            :title="`설비 알람 ${alarms.length}건`"
            :description="alarms.join(' · ')"
            closable
        >
            <template #actions
                ><AppButton size="xs" tone="danger" variant="soft" @click="toast.info('알람 화면으로 이동합니다.')">알람 보기</AppButton></template
            >
        </AppAlert>

        <!-- 3. KPI -->
        <div class="mes-sample__kpi">
            <AppStatCard
                v-for="card in statusCards"
                :key="card.key"
                :title="card.title"
                :value="countBy(card.key)"
                unit="건"
                :tone="card.tone"
                size="sm"
                clickable
                :active="filter.status === card.key"
                @click="filter.status = card.key"
            />
        </div>

        <!-- 4. 조회 조건 -->
        <AppSearchPanel :columns="4" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="작업일자" :span="2">
                <AppDatePicker v-model="filter.period" type="range-input" size="xs" />
            </AppSearchItem>
            <AppSearchItem label="라인">
                <AppSelect v-model="filter.line" :items="lines" size="xs" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="품목">
                <AppInput v-model="filter.keyword" size="xs" placeholder="품목명" clearable />
            </AppSearchItem>
        </AppSearchPanel>

        <!-- 5. 목록 -->
        <AppSection>
            <AppDataTable
                v-model="checked"
                title="작업실적"
                show-total
                :total="filteredRows.length"
                selectable
                clickable
                size="sm"
                :columns="columns"
                :items="pagedRows"
                @row-click="openDetail"
            >
                <template #toolbar>
                    <AppSegmented v-model="unit" :items="units" size="sm" />
                    <AppButton size="xs" :disabled="!checked.length" @click="confirmDelete">삭제</AppButton>
                    <AppButton size="xs" variant="fill" tone="primary" @click="openDetail()">실적 등록</AppButton>
                </template>
                <template #cell-status="{ value }">
                    <AppTag variant="soft" shape="round" dot :tone="statusMeta[String(value)].tone" :label="statusMeta[String(value)].label" />
                </template>
                <template #cell-rate="{ row }">
                    <AppProgressBar :value="rate(row)" show-value />
                </template>
                <template #cell-defectQty="{ value }">
                    <span :style="{ color: Number(value) > 0 ? 'var(--tone-danger)' : undefined }">{{ value }}</span>
                </template>
                <template #empty>
                    <AppEmpty type="search" size="sm" description="조회 조건을 변경해 보세요.">
                        <template #actions><AppButton size="xs" @click="reset">조건 초기화</AppButton></template>
                    </AppEmpty>
                </template>
            </AppDataTable>
            <AppPagination
                v-if="filteredRows.length"
                v-model:page="page"
                :page-size="pageSize"
                :total="filteredRows.length"
                :show-page-size="false"
                size="sm"
            />
        </AppSection>

        <!-- 6. 상세 / 등록 Drawer -->
        <AppDrawer v-model:open="drawer.open" :title="drawer.row ? '작업실적 상세' : '작업실적 등록'" :description="drawer.row?.orderNo" :width="560">
            <div class="mes-sample__drawer">
                <AppSteps v-if="drawer.row" :model-value="stepIndex(drawer.row.status)" :items="steps" size="sm" />
                <AppInputGroup label="작업지시 / 품목" separator="·">
                    <AppInput :model-value="drawer.row?.orderNo ?? ''" size="sm" readonly placeholder="작업지시번호" />
                    <AppInput :model-value="drawer.row?.item ?? ''" size="sm" readonly placeholder="품목" />
                </AppInputGroup>
                <div class="mes-sample__row">
                    <AppInputNumber v-model="form.doneQty" label="양품 수량" size="md" :step="10" />
                    <AppInputNumber
                        v-model="form.defectQty"
                        label="불량 수량"
                        size="md"
                        :state="form.defectQty > 0 ? 'warning' : null"
                        :hint="form.defectQty > 0 ? '불량 사유를 입력하세요.' : ''"
                    />
                </div>
                <AppSelect v-if="form.defectQty > 0" v-model="form.defectReason" label="불량 사유" :items="defectReasons" size="sm" state="warning" />
                <AppDatePicker v-model="form.doneAt" type="datetime" label="실적 일시" size="sm" />
                <AppTextarea v-model="form.memo" label="비고" :rows="3" :max-length="200" show-count />
                <template v-if="drawer.row">
                    <strong>처리 이력</strong>
                    <AppTimeline :items="history" size="sm" />
                </template>
            </div>
            <template #footer>
                <AppButton @click="drawer.open = false">취소</AppButton>
                <AppButton variant="fill" tone="primary" :loading="saving" @click="save">저장</AppButton>
            </template>
        </AppDrawer>
    </div>
</template>

<script setup lang="ts">
import type { AppDataTableColumn } from '~/components/Table/AppDataTable.vue';
import type { AppTone } from '~/types/appCommon';

const { title, description } = useDemoI18n('mesSample');
const toast = useToast();
const { openConfirm } = useModal();

/* ==========================================================
   temp 데이터 (퍼블리싱 단계 - API 연동 시 이 영역만 교체)
========================================================== */
type Status = 'wait' | 'run' | 'done' | 'stop';
type Row = {
    id: string;
    orderNo: string;
    item: string;
    line: string;
    planQty: number;
    doneQty: number;
    defectQty: number;
    worker: string;
    status: Status;
};

const breadcrumbs = [{ label: '홈', to: '/' }, { label: '생산관리' }, { label: '작업실적 현황' }];
const alarms = ['EQ-0102 온도 상한 초과', 'EQ-0202 자재 대기 30분 경과'];
const lines = ['1라인', '2라인', '3라인'].map((label) => ({ value: label, label }));
const units = [
    { value: 'EA', label: 'EA' },
    { value: 'BOX', label: 'BOX' },
];
const defectReasons = ['치수 불량', '외관 불량', '이물', '기타'].map((label) => ({ value: label, label }));
const steps = [{ title: '대기' }, { title: '진행' }, { title: '완료' }];
const history = [
    { title: '실적 등록', description: '양품 512 / 불량 3', time: '10-21 13:05', tone: 'success' as AppTone },
    { title: '작업 시작', time: '10-21 08:00', tone: 'primary' as AppTone },
];

const statusMeta: Record<string, { label: string; tone: AppTone }> = {
    wait: { label: '대기', tone: 'gray' },
    run: { label: '진행', tone: 'primary' },
    done: { label: '완료', tone: 'success' },
    stop: { label: '정지', tone: 'danger' },
};
const statusCards = [
    { key: 'all', title: '전체', tone: 'gray' },
    { key: 'run', title: '진행', tone: 'primary' },
    { key: 'done', title: '완료', tone: 'success' },
    { key: 'stop', title: '정지', tone: 'danger' },
] as const;

const rows = ref<Row[]>([
    {
        id: '1',
        orderNo: 'WO-2610-001',
        item: '브라켓 A형',
        line: '1라인',
        planQty: 1200,
        doneQty: 1200,
        defectQty: 4,
        worker: '김민수',
        status: 'done',
    },
    {
        id: '2',
        orderNo: 'WO-2610-002',
        item: '하우징 커버',
        line: '1라인',
        planQty: 800,
        doneQty: 512,
        defectQty: 3,
        worker: '이서연',
        status: 'run',
    },
    { id: '3', orderNo: 'WO-2610-003', item: '샤프트', line: '2라인', planQty: 3000, doneQty: 0, defectQty: 0, worker: '박지훈', status: 'wait' },
    {
        id: '4',
        orderNo: 'WO-2610-004',
        item: '기어 세트',
        line: '3라인',
        planQty: 450,
        doneQty: 120,
        defectQty: 12,
        worker: '최유진',
        status: 'stop',
    },
    { id: '5', orderNo: 'WO-2610-005', item: '플랜지', line: '2라인', planQty: 600, doneQty: 600, defectQty: 0, worker: '한지민', status: 'done' },
    {
        id: '6',
        orderNo: 'WO-2610-006',
        item: '커넥터 핀',
        line: '3라인',
        planQty: 10000,
        doneQty: 7350,
        defectQty: 21,
        worker: '김민수',
        status: 'run',
    },
    { id: '7', orderNo: 'WO-2610-007', item: '브라켓 B형', line: '1라인', planQty: 900, doneQty: 300, defectQty: 0, worker: '이서연', status: 'run' },
    { id: '8', orderNo: 'WO-2610-008', item: '샤프트', line: '2라인', planQty: 1500, doneQty: 1500, defectQty: 2, worker: '박지훈', status: 'done' },
]);

const columns: AppDataTableColumn[] = [
    { key: 'orderNo', label: '작업지시', width: 130, sortable: true },
    { key: 'item', label: '품목', align: 'left', sortable: true },
    { key: 'line', label: '라인', width: 70 },
    { key: 'planQty', label: '계획', width: 90, align: 'right' },
    { key: 'doneQty', label: '양품', width: 90, align: 'right' },
    { key: 'defectQty', label: '불량', width: 70, align: 'right' },
    { key: 'rate', label: '달성률', width: 150 },
    { key: 'worker', label: '작업자', width: 80 },
    { key: 'status', label: '상태', width: 90 },
];

/* ==========================================================
   화면 상태
========================================================== */
const initialFilter = () => ({
    period: { start: '2026-10-21', end: '2026-10-21' } as { start: string | null; end: string | null } | null,
    line: null as string | number | boolean | null,
    keyword: '',
    status: 'all' as string,
});
const filter = reactive(initialFilter());
const applied = ref({ ...initialFilter() });
const loading = ref(false);
const checked = ref<unknown[]>([]);
const unit = ref<string | number | boolean | null>('EA');
const page = ref(1);
const pageSize = 5;

const filteredRows = computed(() =>
    rows.value.filter(
        (row) =>
            (filter.status === 'all' || row.status === filter.status) &&
            (!applied.value.line || row.line === applied.value.line) &&
            (!applied.value.keyword || row.item.includes(applied.value.keyword)),
    ),
);
const pagedRows = computed(() => filteredRows.value.slice((page.value - 1) * pageSize, page.value * pageSize));

watch(
    () => filter.status,
    () => (page.value = 1),
);

function countBy(key: string) {
    return key === 'all' ? rows.value.length : rows.value.filter((row) => row.status === key).length;
}

function rate(row: Record<string, unknown>) {
    return Math.round((Number(row.doneQty) / Number(row.planQty)) * 100);
}

function stepIndex(status: Status) {
    return { wait: 0, run: 1, stop: 1, done: 2 }[status];
}

function search() {
    loading.value = true;
    setTimeout(() => {
        applied.value = { ...filter };
        page.value = 1;
        loading.value = false;
        toast.show(`${filteredRows.value.length}건이 조회되었습니다.`);
    }, 400);
}

function reset() {
    Object.assign(filter, initialFilter());
    applied.value = { ...initialFilter() };
}

function confirmDelete() {
    openConfirm({
        title: '삭제',
        message: `선택한 ${checked.value.length}건을 삭제하시겠습니까?`,
        onConfirm: () => {
            rows.value = rows.value.filter((row) => !checked.value.includes(row.id));
            checked.value = [];
            toast.success('삭제되었습니다.');
        },
    });
}

/* ==========================================================
   상세 / 등록
========================================================== */
const drawer = reactive<{ open: boolean; row: Row | null }>({ open: false, row: null });
const form = reactive({
    doneQty: 0,
    defectQty: 0,
    defectReason: null as string | number | boolean | null,
    doneAt: '2026-10-21 17:00' as string | null,
    memo: '',
});
const saving = ref(false);

function openDetail(row?: Record<string, unknown>) {
    drawer.row = (row as Row | undefined) ?? null;
    form.doneQty = drawer.row?.doneQty ?? 0;
    form.defectQty = drawer.row?.defectQty ?? 0;
    form.defectReason = null;
    form.memo = '';
    drawer.open = true;
}

function save() {
    saving.value = true;
    setTimeout(() => {
        if (drawer.row) Object.assign(drawer.row, { doneQty: form.doneQty, defectQty: form.defectQty });
        saving.value = false;
        drawer.open = false;
        toast.success('작업실적이 저장되었습니다.');
    }, 500);
}
</script>

<style scoped lang="scss">
.mes-sample {
    display: grid;
    gap: 16px;

    &__kpi {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;

        @media (max-width: 960px) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    &__drawer {
        display: grid;
        gap: 16px;
    }

    &__row {
        display: flex;
        gap: 24px;
    }
}
</style>
