var e=`<template>
    <KioskLayout>
        <template #info>{{ station.lineName }} · {{ station.equipmentCode }} · 작업자 {{ station.workerName }}</template>

        <div class="kiosk-work">
            <!-- 왼쪽: 오늘 이 설비의 작업지시 (카드를 눌러 선택) -->
            <section class="kiosk-work__orders" aria-labelledby="kiosk-orders-title">
                <h1 id="kiosk-orders-title" class="kiosk-work__title">오늘 작업지시</h1>
                <button
                    v-for="order in orders"
                    :key="order.orderNo"
                    type="button"
                    class="kiosk-order"
                    :class="{ 'is-selected': order.orderNo === selected?.orderNo }"
                    :aria-pressed="order.orderNo === selected?.orderNo"
                    @click="select(order)"
                >
                    <span class="kiosk-order__no">{{ order.orderNo }}</span>
                    <strong class="kiosk-order__item">{{ order.itemName }}</strong>
                    <span class="kiosk-order__qty">{{ order.goodQty.toLocaleString() }} / {{ order.planQty.toLocaleString() }} {{ order.unit }}</span>
                    <AppProgressBar :value="Math.round((order.goodQty / order.planQty) * 100)" show-value />
                </button>
            </section>

            <!-- 오른쪽: 실적 입력 (양품 · 불량 칸을 누르고 숫자판으로 입력) -->
            <section class="kiosk-work__input" aria-labelledby="kiosk-input-title">
                <h2 id="kiosk-input-title" class="kiosk-work__title">{{ selected ? \`\${selected.itemName} 실적 등록\` : '작업지시를 선택하세요' }}</h2>

                <div class="kiosk-fields" role="group" aria-label="입력할 수량">
                    <button
                        v-for="field in QTY_FIELDS"
                        :key="field.key"
                        type="button"
                        class="kiosk-field"
                        :class="[\`kiosk-field--\${field.key}\`, { 'is-active': activeField === field.key }]"
                        :aria-pressed="activeField === field.key"
                        :disabled="!selected"
                        @click="activeField = field.key"
                    >
                        <span class="kiosk-field__label">{{ field.label }}</span>
                        <strong class="kiosk-field__value">{{ form[field.key].toLocaleString() }}</strong>
                    </button>
                </div>

                <div v-if="form.defectQty > 0" class="kiosk-reasons" role="radiogroup" aria-label="불량 사유">
                    <AppButton
                        v-for="reason in defectCodes"
                        :key="reason.value"
                        size="xl"
                        :variant="form.defectCode === reason.value ? 'fill' : 'outline'"
                        tone="gray"
                        role="radio"
                        :aria-checked="form.defectCode === reason.value"
                        @click="form.defectCode = reason.value"
                    >
                        {{ reason.label }}
                    </AppButton>
                </div>

                <div class="kiosk-keypad" role="group" aria-label="숫자판">
                    <AppButton v-for="key in KEYS" :key="key" size="xl" variant="outline" tone="gray" :disabled="!selected" @click="press(key)">
                        {{ key }}
                    </AppButton>
                </div>

                <AppButton
                    class="kiosk-work__submit"
                    size="xl"
                    variant="fill"
                    tone="primary"
                    :disabled="!canSubmit"
                    :loading="saving"
                    @click="submit"
                >
                    실적 등록
                </AppButton>
            </section>
        </div>
    </KioskLayout>
</template>

<script setup>
import { computed, reactive, ref, shallowRef } from 'vue';
import { useModal } from '@/composables/useModal';
import { useToast } from '@/composables/useToast';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import KioskLayout from '@/layouts/KioskLayout.vue';

const modal = useModal();
const toast = useToast();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const defectCodes = useCodes('DEFECT'); // import { useCodes } from '@/composables/useCodes'
// const fetchStation = () => api.get('/kiosk/station');                                   // 이 단말의 라인 · 설비 · 작업자
// const fetchOrders = (equipmentCode) => api.get('/kiosk/work-orders', { params: { equipmentCode } });
// const saveResult = (result) => api.post('/work-results', result);
const defectCodes = ref(DEMO_DEFECT_CODES);
const fetchStation = async () => DEMO_STATION;
const fetchOrders = async () => structuredClone(DEMO_KIOSK_WORK_ORDERS);
const saveResult = () => new Promise((resolve) => setTimeout(resolve, 400));
// temp 데이터 끝

// ── 화면 값 ───────────────────────────────────────────────
const QTY_FIELDS = [
    { key: 'goodQty', label: '양품' },
    { key: 'defectQty', label: '불량' },
];
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '←'];
const MAX_QTY = 99999;

const station = shallowRef({});
const orders = ref([]);
const selected = ref(null);
const activeField = ref('goodQty');
const emptyForm = () => ({ goodQty: 0, defectQty: 0, defectCode: null });
const form = reactive(emptyForm());
const saving = ref(false);

const canSubmit = computed(() => selected.value && form.goodQty + form.defectQty > 0 && (form.defectQty === 0 || form.defectCode));

async function load() {
    station.value = await fetchStation();
    orders.value = await fetchOrders(station.value.equipmentCode);
}
load();

// ── 동작 ──────────────────────────────────────────────────
function select(order) {
    selected.value = order;
    Object.assign(form, emptyForm());
    activeField.value = 'goodQty';
}

/** 숫자판: 숫자는 뒤에 붙이고, ← 한 자리 지움, C 0 으로 */
function press(key) {
    const current = String(form[activeField.value]);
    let next = current;
    if (key === 'C') next = '0';
    else if (key === '←') next = current.slice(0, -1) || '0';
    else next = current === '0' ? key : current + key;
    form[activeField.value] = Math.min(Number(next), MAX_QTY);
    if (activeField.value === 'defectQty' && form.defectQty === 0) form.defectCode = null;
}

/** 실적 등록 → 확인 → 저장 → 카드 수량 반영 */
async function submit() {
    const message = \`\${selected.value.itemName}\\n양품 \${form.goodQty.toLocaleString()} · 불량 \${form.defectQty.toLocaleString()} 을 등록할까요?\`;
    if (!(await modal.confirm(message))) return;
    saving.value = true;
    try {
        await saveResult({ orderNo: selected.value.orderNo, ...form });
        selected.value.goodQty += form.goodQty;
        toast.success('실적을 등록했습니다.');
        Object.assign(form, emptyForm());
    } finally {
        saving.value = false;
    }
}
<\/script>

<style scoped lang="scss">
.kiosk-work {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: 20px;
    height: 100%;

    &__title {
        margin-bottom: 12px;
        @include font(h4, sb);
        color: var(--theme-gray-900);
    }

    &__orders,
    &__input {
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-height: 0;
        padding: 20px;
        border-radius: 16px;
        background: var(--theme-gray-0);
    }

    &__orders {
        overflow-y: auto;
    }

    &__submit {
        min-height: 72px;
        @include font(h4, sb);
    }

    @include tablet {
        grid-template-columns: minmax(0, 1fr);
    }
}

.kiosk-order {
    display: grid;
    gap: 6px;
    padding: 16px 18px;
    border: 2px solid var(--theme-gray-200);
    border-radius: 12px;
    background: var(--theme-gray-0);
    text-align: left;
    cursor: pointer;

    &.is-selected {
        border-color: var(--theme-primary);
        background: var(--theme-primary-50);
    }

    &__no {
        @include font(b3, md);
        color: var(--theme-gray-600);
    }

    &__item {
        @include font(h5, sb);
        color: var(--theme-gray-900);
    }

    &__qty {
        @include font(b1, md);
        color: var(--theme-gray-700);
        font-variant-numeric: tabular-nums;
    }
}

.kiosk-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.kiosk-field {
    display: grid;
    gap: 4px;
    padding: 14px 18px;
    border: 2px solid var(--theme-gray-200);
    border-radius: 12px;
    background: var(--theme-gray-0);
    text-align: right;
    cursor: pointer;

    &.is-active {
        border-color: var(--theme-primary);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    &__label {
        text-align: left;
        @include font(b1, sb);
        color: var(--theme-gray-700);
    }

    &__value {
        @include font(h3, sb);
        color: var(--theme-gray-900);
        font-variant-numeric: tabular-nums;
    }

    &--defectQty &__value {
        color: var(--theme-status-error-text);
    }
}

.kiosk-reasons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.kiosk-keypad {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;

    :deep(.app-button) {
        min-height: 64px;
        @include font(h4, sb);
    }
}
</style>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/DEFECT (공통코드: [{ value, label }]) */
const DEMO_DEFECT_CODES = [
    { value: 'dimension', label: '치수 불량' },
    { value: 'scratch', label: '외관 긁힘' },
    { value: 'burr', label: '버(Burr)' },
    { value: 'etc', label: '기타' },
];

/** GET /api/kiosk/station → 이 단말(키오스크)의 라인 · 설비 · 로그인 작업자 */
const DEMO_STATION = { lineCode: 'line-1', lineName: '가공 1라인', equipmentCode: 'CNC-04', workerName: '김현장' };

/**
 * GET /api/kiosk/work-orders?equipmentCode=CNC-04 → 오늘 이 설비의 작업지시 [ ... ]
 * POST /api/work-results 요청 본문: { orderNo, goodQty, defectQty, defectCode }
 */
const DEMO_KIOSK_WORK_ORDERS = [
    { orderNo: 'WO-260814-01', itemCode: 'FG-10021', itemName: '모터 하우징 A', unit: 'EA', planQty: 1200, goodQty: 780 },
    { orderNo: 'WO-260814-03', itemCode: 'FG-10031', itemName: '샤프트 B', unit: 'EA', planQty: 800, goodQty: 120 },
    { orderNo: 'WO-260814-07', itemCode: 'FG-10044', itemName: '브래킷 C', unit: 'EA', planQty: 2400, goodQty: 0 },
];
<\/script>
`;export{e as default};