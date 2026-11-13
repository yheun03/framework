<template>
    <div class="business-page business-page--detail">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">ERP · 영업관리</p>
                <h1 class="business-page__title">수주 상세</h1>
                <p class="business-page__desc">{{ form.orderNo }} · {{ customerName }}</p>
            </div>
        </header>
        <AppSection title="기본 정보">
            <div class="business-form-grid">
                <AppInput v-model="form.orderNo" label="수주번호" readonly />
                <AppSelect
                    v-model="form.customerCode"
                    label="거래처"
                    :items="customers"
                    required
                    :state="errors.customer ? 'error' : null"
                    :hint="errors.customer"
                />
                <AppDatePicker v-model="form.orderDate" label="수주일" />
                <AppDatePicker v-model="form.dueDate" label="납기일" :state="errors.dueDate ? 'error' : null" :hint="errors.dueDate" />
                <AppInput v-model="form.managerName" label="담당자" />
                <AppSelect v-model="form.status" label="상태" :items="statuses" />
            </div>
        </AppSection>
        <AppSection title="수주 품목">
            <AppDataTable caption="수주 품목" :columns="lineColumns" :items="lines" row-key="itemCode" size="md" />
            <p class="sales-order-detail__sum">
                합계 <strong>{{ won(totalAmount) }}</strong>
            </p>
        </AppSection>
        <AppSection title="메모">
            <AppTextarea v-model="form.memo" :rows="5" placeholder="수주 관련 전달사항을 입력하세요." aria-label="수주 관련 전달사항" />
        </AppSection>

        <LayoutBottomBar>
            <template #left><AppButton size="md" @click="goList">목록</AppButton></template>
            <template #right><AppButton size="md" variant="fill" tone="primary" :loading="saving" @click="save">저장</AppButton></template>
        </LayoutBottomBar>
    </div>
</template>
<script setup>
import { computed, reactive, ref, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useModal } from '@/composables/useModal';
import { useToast } from '@/composables/useToast';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppInput from '@/components/AppInput.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTextarea from '@/components/AppTextarea.vue';
import LayoutBottomBar from '@/components/Layout/LayoutBottomBar.vue';

// 주소 /sales-orders/:id → 파일 views/sales-orders/[id].vue
const route = useRoute();
const router = useRouter();
const modal = useModal();
const toast = useToast();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const customers = ref([]);  api.get('/customers/options').then((options) => (customers.value = options));
// const statuses = useCodes('SO_STATUS'); // import { useCodes } from '@/composables/useCodes'
// const fetchSalesOrder = (orderNo) => api.get(`/sales-orders/${orderNo}`);
// const saveSalesOrder = (form) => api.put(`/sales-orders/${form.orderNo}`, form);
const customers = ref(DEMO_CUSTOMER_OPTIONS);
const statuses = ref(DEMO_STATUS_CODES);
const fetchSalesOrder = async (orderNo) => ({ ...structuredClone(DEMO_SALES_ORDER), orderNo });
const saveSalesOrder = () => new Promise((resolve) => setTimeout(resolve, 400));
// temp 데이터 끝

// ── 폼 · 품목 ─────────────────────────────────────────────
const won = (value) => `₩${value.toLocaleString()}`;
const lineColumns = [
    { key: 'itemCode', label: '품목코드', width: 110 },
    { key: 'itemName', label: '품목명', align: 'left' },
    { key: 'spec', label: '규격', align: 'left' },
    { key: 'qty', label: '수량', width: 90, align: 'right' },
    { key: 'price', label: '단가', width: 110, align: 'right', format: won },
    { key: 'amount', label: '공급가액', width: 130, align: 'right', format: (_, row) => won(row.qty * row.price) },
];
const lines = shallowRef([]);
const totalAmount = computed(() => lines.value.reduce((sum, row) => sum + row.qty * row.price, 0));

const emptyForm = () => ({ orderNo: '', customerCode: null, orderDate: '', dueDate: '', managerName: '', status: 'confirmed', memo: '' });
const form = reactive(emptyForm());
const errors = reactive({ customer: '', dueDate: '' });
const customerName = computed(() => customers.value.find((customer) => customer.value === form.customerCode)?.label ?? '');

// 마지막으로 불러오거나 저장한 값 - 지금 값과 다르면 '저장하지 않은 변경'
const savedSnapshot = ref(JSON.stringify(form));
const isDirty = computed(() => JSON.stringify(form) !== savedSnapshot.value);

/** 저장 전 검사 - 칸마다 오류 문구를 넣고(없으면 ''), 하나라도 있으면 false */
function validate() {
    errors.customer = form.customerCode ? '' : '거래처를 선택하세요.';
    errors.dueDate = form.dueDate ? '' : '납기일을 선택하세요.';
    return !Object.values(errors).some(Boolean);
}

/** 주소의 id 로 수주를 불러와 폼 · 품목에 넣습니다. */
async function load() {
    const { lines: orderLines = [], ...order } = await fetchSalesOrder(route.params.id);
    Object.assign(form, emptyForm(), order);
    savedSnapshot.value = JSON.stringify(form);
    lines.value = orderLines;
}
load();

// ── 동작 ──────────────────────────────────────────────────
const saving = ref(false);

/** 저장: 검사 → 저장 (저장 중 버튼 로딩 · 중복 클릭 방지) */
async function save() {
    if (!validate()) return;
    saving.value = true;
    try {
        await saveSalesOrder(form);
        savedSnapshot.value = JSON.stringify(form);
        toast.success('저장했습니다.');
    } finally {
        saving.value = false;
    }
}

/** 목록: 바뀐 내용이 있으면 한 번 묻고 이동 */
async function goList() {
    if (isDirty.value && !(await modal.confirm('저장하지 않은 내용이 있습니다. 목록으로 갈까요?'))) return;
    router.push('/sales-orders');
}
</script>

<style scoped lang="scss">
.sales-order-detail__sum {
    margin: 12px 0 0;
    text-align: right;
    color: var(--theme-gray-700);
    @include font(b2, rg);

    strong {
        margin-left: 12px;
        color: var(--theme-gray-900);
        @include font(b1, sb);
    }
}
</style>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/customers/options · GET /api/codes/SO_STATUS (선택 목록: [{ value, label }]) */
const DEMO_CUSTOMER_OPTIONS = [
    { value: 'C-0001', label: '한빛전자' },
    { value: 'C-0002', label: '대성모터스' },
    { value: 'C-0003', label: '유진테크' },
];
const DEMO_STATUS_CODES = [
    { value: 'confirmed', label: '확정' },
    { value: 'working', label: '생산중' },
    { value: 'warning', label: '납기주의' },
    { value: 'done', label: '완료' },
];

/**
 * GET /api/sales-orders/{orderNo} → 수주 1건 + 품목(lines)
 * PUT /api/sales-orders/{orderNo} 요청 본문: lines 를 뺀 같은 모양 (customerCode · dueDate · managerName · status · memo …)
 */
const DEMO_SALES_ORDER = {
    orderNo: 'SO-260814-01',
    customerCode: 'C-0001',
    orderDate: '2026-08-14',
    dueDate: '2026-08-20',
    managerName: '김영업',
    status: 'working',
    memo: '포장 라벨에 고객사 LOT 번호 표기',
    lines: [
        { itemCode: 'FG-10021', itemName: '모터 하우징 A', spec: 'AL6061 / 120mm', qty: 800, price: 40000 },
        { itemCode: 'FG-10022', itemName: '하우징 커버', spec: 'AL6061 / 118mm', qty: 800, price: 20000 },
    ],
};
</script>
