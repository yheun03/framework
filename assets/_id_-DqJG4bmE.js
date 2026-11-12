var e=`<template>
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
                <AppSelect v-model="form.customer" label="거래처" :items="customers" required v-bind="field('customer')" />
                <AppDatePicker v-model="form.orderDate" label="수주일" />
                <AppDatePicker v-model="form.dueDate" label="납기일" v-bind="field('dueDate')" />
                <AppInput v-model="form.manager" label="담당자" />
                <AppSelect v-model="form.status" label="상태" :items="statuses" />
            </div>
        </AppSection>
        <AppSection title="수주 품목">
            <AppDataTable caption="수주 품목" :columns="lineColumns" :items="lines" row-key="code" size="md" />
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
import { computed, ref, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCodes } from '@/composables/useCodes';
import { required, useForm } from '@/composables/useForm';
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

// ── 코드 목록 ─────────────────────────────────────────────
const { items: customers } = useCodes('CUSTOMER', {
    temp: [
        { label: '한빛전자', value: 'hanbit' },
        { label: '대성모터스', value: 'daesung' },
        { label: '유진테크', value: 'eugene' },
    ],
});
const { items: statuses } = useCodes('SALES_ORDER_STATUS', {
    temp: [
        { label: '확정', value: 'confirmed' },
        { label: '생산중', value: 'working' },
        { label: '완료', value: 'done' },
    ],
});

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// const fetchSalesOrder = (id) => salesOrderApi.get(id);          // → { ...기본 정보, lines: [...] }
// const saveSalesOrder = (form) => salesOrderApi.save(form);
const fetchSalesOrder = async (id) => ({
    orderNo: id,
    customer: 'hanbit',
    orderDate: '2026-08-14',
    dueDate: '2026-08-20',
    manager: '김영업',
    status: 'working',
    memo: '포장 라벨에 고객사 LOT 번호 표기',
    lines: [
        { code: 'FG-10021', name: '모터 하우징 A', spec: 'AL6061 / 120mm', qty: 800, price: 40000 },
        { code: 'FG-10022', name: '하우징 커버', spec: 'AL6061 / 118mm', qty: 800, price: 20000 },
    ],
});
const saveSalesOrder = () => new Promise((resolve) => setTimeout(resolve, 400));
// temp 데이터 끝

// ── 폼 · 품목 ─────────────────────────────────────────────
const won = (value) => \`₩\${value.toLocaleString()}\`;
const lineColumns = [
    { key: 'code', label: '품목코드', width: 110 },
    { key: 'name', label: '품목명', align: 'left' },
    { key: 'spec', label: '규격', align: 'left' },
    { key: 'qty', label: '수량', width: 90, align: 'right' },
    { key: 'price', label: '단가', width: 110, align: 'right', format: won },
    { key: 'amount', label: '공급가액', width: 130, align: 'right', format: (_, row) => won(row.qty * row.price) },
];
const lines = shallowRef([]);
const totalAmount = computed(() => lines.value.reduce((sum, row) => sum + row.qty * row.price, 0));

const { form, field, validate, isDirty, setForm } = useForm(
    () => ({ orderNo: '', customer: null, orderDate: '', dueDate: '', manager: '', status: 'confirmed', memo: '' }),
    { customer: [required('거래처를 선택하세요.')], dueDate: [required('납기일을 선택하세요.')] },
);
const customerName = computed(() => customers.value.find((customer) => customer.value === form.customer)?.label ?? '');

/** 주소의 id 로 수주를 불러와 폼 · 품목에 넣습니다. (불러온 값이 '변경 없음' 기준) */
async function load() {
    const { lines: orderLines = [], ...order } = await fetchSalesOrder(route.params.id);
    setForm(order);
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
        setForm(form); // 저장한 값이 새 기준 (isDirty = false)
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
<\/script>

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
`;export{e as default};