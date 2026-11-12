<template>
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
                <AppSelect
                    v-model="form.line"
                    label="라인"
                    :items="lines"
                    placeholder="선택"
                    required
                    :state="errors.line ? 'error' : null"
                    :hint="errors.line"
                />
                <AppDatePicker v-model="form.workDate" label="작업일자" :state="errors.workDate ? 'error' : null" :hint="errors.workDate" />
                <AppInput v-model="form.item" label="품목" placeholder="품목명 입력" :state="errors.item ? 'error' : null" :hint="errors.item" />
                <AppInputNumber v-model="form.qty" label="지시수량" :min="0" :state="errors.qty ? 'error' : null" :hint="errors.qty" />
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
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// const api = useApi();
// const fetchWorkOrder = (id) => api.get(`/work-orders/${id}`);
// const saveWorkOrder = (form) => (isEdit.value ? api.put(`/work-orders/${route.params.id}`, form) : api.post('/work-orders', form));
const lines = [
    { value: 'L1', label: '1라인' },
    { value: 'L2', label: '2라인' },
];
const priorities = [
    { value: 'normal', label: '보통' },
    { value: 'urgent', label: '긴급' },
];
const fetchWorkOrder = async () => ({ orderNo: 'WO-2611-001', line: 'L1', item: '브래킷 A형', qty: 1200 });
const saveWorkOrder = () => new Promise((resolve) => setTimeout(resolve, 400));
// temp 데이터 끝

// ── 폼 ────────────────────────────────────────────────────
const emptyForm = () => ({ orderNo: '', line: null, workDate: '2026-11-12', item: '', qty: 0, priority: 'normal', memo: '' });
const form = reactive(emptyForm());
const errors = reactive({ line: '', workDate: '', item: '', qty: '' });

// 마지막으로 불러오거나 저장한 값 - 지금 값과 다르면 '저장하지 않은 변경'
const savedSnapshot = ref(JSON.stringify(form));
const isDirty = computed(() => JSON.stringify(form) !== savedSnapshot.value);

/** 저장 전 검사 - 칸마다 오류 문구를 넣고(없으면 ''), 하나라도 있으면 false */
function validate() {
    errors.line = form.line ? '' : '라인을 선택하세요.';
    errors.workDate = form.workDate ? '' : '작업일자를 선택하세요.';
    errors.item = form.item.trim() ? '' : '품목을 입력하세요.';
    errors.qty = form.qty > 0 ? '' : '지시수량은 1 이상 입력하세요.';
    return !Object.values(errors).some(Boolean);
}

/** 수정 화면이면 저장된 값을 불러옵니다. */
async function load() {
    Object.assign(form, emptyForm(), await fetchWorkOrder(route.params.id));
    savedSnapshot.value = JSON.stringify(form);
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
        savedSnapshot.value = JSON.stringify(form);
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
</script>
