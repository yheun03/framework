var e=`<template>
    <div class="business-page">
        <header class="business-page__header">
            <div>
                <h1 class="business-page__title">{{ isEdit ? '작업지시 수정' : '작업지시 등록' }}</h1>
                <p class="business-page__desc">입력 → 검증 → 저장 순서의 등록 · 수정 화면입니다. 저장 · 취소 버튼은 화면 하단에 고정됩니다.</p>
            </div>
        </header>

        <AppSection title="기본 정보">
            <div class="business-form-grid">
                <AppInput v-model="form.orderNo" label="작업지시번호" placeholder="자동 채번" readonly />
                <AppSelect v-model="form.line" label="라인" :items="lines" placeholder="선택" required v-bind="field('line')" />
                <AppDatePicker v-model="form.workDate" label="작업일자" v-bind="field('workDate')" />
                <AppInput v-model="form.item" label="품목" placeholder="품목명 입력" v-bind="field('item')" />
                <AppInputNumber v-model="form.qty" label="지시수량" :min="0" v-bind="field('qty')" />
                <AppSelect v-model="form.priority" label="우선순위" :items="priorities" />
            </div>
        </AppSection>

        <AppSection title="메모">
            <AppTextarea v-model="form.memo" :rows="4" aria-label="메모" placeholder="현장 전달사항을 입력하세요." />
        </AppSection>

        <LayoutBottomBar>
            <template #left>
                <AppButton size="md" @click="cancel">취소</AppButton>
            </template>
            <template #right>
                <AppButton size="md" variant="fill" tone="primary" :loading="saving" @click="save">저장</AppButton>
            </template>
        </LayoutBottomBar>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCodes } from '@/composables/useCodes';
import { required, useForm } from '@/composables/useForm';
import { useModal } from '@/composables/useModal';
import { useToast } from '@/composables/useToast';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppInput from '@/components/AppInput.vue';
import AppInputNumber from '@/components/AppInputNumber.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTextarea from '@/components/AppTextarea.vue';
import LayoutBottomBar from '@/components/Layout/LayoutBottomBar.vue';

const route = useRoute();
const router = useRouter();
const modal = useModal();
const toast = useToast();

// 파일 위치 예) 등록 views/work-orders/new.vue · 수정 views/work-orders/[id]/edit.vue
// 한 파일로 등록 · 수정을 함께 쓰려면 주소의 id 유무로 구분합니다.
const isEdit = computed(() => Boolean(route.params.id));
const LIST_PATH = '/demos/demo-page-example'; // 실제: '/work-orders'

// ── 코드 목록 ─────────────────────────────────────────────
const { items: lines } = useCodes('LINE', {
    temp: [
        { value: 'L1', label: '1라인' },
        { value: 'L2', label: '2라인' },
    ],
});
const { items: priorities } = useCodes('PRIORITY', {
    temp: [
        { value: 'normal', label: '보통' },
        { value: 'urgent', label: '긴급' },
    ],
});

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// import { workOrderApi } from '@/services/api/workOrderApi';
// const fetchWorkOrder = (id) => workOrderApi.get(id);
// const saveWorkOrder = (form) => workOrderApi.save(form);   // id 가 있으면 PUT, 없으면 POST
const fetchWorkOrder = async () => ({ orderNo: 'WO-2611-001', line: 'L1', item: '브래킷 A형', qty: 1200 });
const saveWorkOrder = () => new Promise((resolve) => setTimeout(resolve, 400));
// temp 데이터 끝

// ── 폼 ────────────────────────────────────────────────────
const { form, field, validate, isDirty, setForm } = useForm(
    () => ({ orderNo: '', line: null, workDate: '2026-11-12', item: '', qty: 0, priority: 'normal', memo: '' }),
    {
        line: [required('라인을 선택하세요.')],
        workDate: [required('작업일자를 선택하세요.')],
        item: [required('품목을 입력하세요.')],
        qty: [(value) => value > 0 || '지시수량은 1 이상 입력하세요.'],
    },
);

/** 수정 화면이면 저장된 값을 불러와 폼에 넣습니다. (불러온 값이 '변경 없음' 기준) */
async function load() {
    setForm(await fetchWorkOrder(route.params.id));
}
if (isEdit.value) load();

// ── 동작 ──────────────────────────────────────────────────
const saving = ref(false);

/** 저장: 검사 → 저장 → 목록으로 (저장 중에는 버튼 로딩 · 중복 클릭 방지) */
async function save() {
    if (!validate()) return;
    saving.value = true;
    try {
        await saveWorkOrder(form);
        setForm(form); // 저장한 값이 새 기준 (isDirty = false)
        toast.success('저장했습니다.');
        router.push(LIST_PATH);
    } finally {
        saving.value = false;
    }
}

/** 취소: 바뀐 내용이 있으면 한 번 묻고 목록으로 */
async function cancel() {
    if (isDirty.value && !(await modal.confirm('저장하지 않은 내용이 있습니다. 나갈까요?'))) return;
    router.push(LIST_PATH);
}
<\/script>
`;export{e as default};