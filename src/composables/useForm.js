/**
 * 등록 · 수정 화면 공통 폼 로직 (입력값 · 검증 · 변경 여부)
 *
 * const { form, errors, field, validate, isDirty, setForm } = useForm(
 *     () => ({ orderNo: '', qty: null }),                 // 빈 폼 (등록 화면의 처음 값)
 *     { orderNo: [required('작업지시번호를 입력하세요.')], qty: [required(), (v) => v > 0 || '1 이상 입력하세요.'] },
 * );
 * <AppInput v-model="form.orderNo" label="작업지시번호" required v-bind="field('orderNo')" />   // 오류면 state · hint 자동
 * if (!validate()) return;                                   // 저장 전 전체 검사 (첫 오류 칸으로 포커스)
 * setForm(await api.get(`/work-orders/${id}`));              // 수정 화면: 조회한 값을 넣고 '변경 없음' 기준으로 삼음
 *
 * - 규칙은 (값, 폼) => true | '오류 문구'. 입력이 바뀌면 그 칸의 오류는 지웁니다. (다시 검사는 저장 시)
 * - isDirty: 마지막 setForm(또는 처음) 이후 바뀌었는지 → 취소 · 목록 이동 전 확인에 씁니다.
 */
import { computed, nextTick, reactive, ref, watch } from 'vue';

/** 필수 입력 규칙 */
export const required =
    (message = '필수 입력 항목입니다.') =>
    (value) =>
        (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && String(value).trim() !== '') || message;

/**
 * @template {Record<string, any>} T
 * @param {() => T} createForm 빈 폼을 만드는 함수 (등록 화면의 처음 값 · setForm 의 기본값)
 * @param {Partial<Record<keyof T, Array<(value: any, form: T) => true | string>>>} [rules] 칸별 검사 규칙
 */
export function useForm(createForm, rules = {}) {
    const form = reactive(createForm());
    const errors = reactive({});
    const baseline = ref(JSON.stringify(form));

    const isDirty = computed(() => JSON.stringify(form) !== baseline.value);

    function validateField(key) {
        const message = (rules[key] ?? []).map((rule) => rule(form[key], form)).find((result) => result !== true);
        errors[key] = message || '';
        return !message;
    }

    function validate() {
        const ok = Object.keys(rules).map(validateField).every(Boolean);
        if (!ok) nextTick(() => document.querySelector('[aria-invalid="true"]')?.focus());
        return ok;
    }

    /** 입력 컴포넌트에 v-bind 로 넘길 오류 표시 (state · hint) */
    function field(key) {
        return errors[key] ? { state: 'error', hint: errors[key] } : {};
    }

    /** 폼 값을 바꾸고 '변경 없음' 기준으로 삼습니다. (수정 화면 조회 · 저장 후) */
    function setForm(values = createForm()) {
        Object.assign(form, { ...createForm(), ...values }); // values 가 form 자신이어도 안전하도록 먼저 복사
        Object.keys(errors).forEach((key) => (errors[key] = ''));
        baseline.value = JSON.stringify(form);
    }

    // 입력이 바뀌면 그 칸 오류는 지움
    for (const key of Object.keys(rules)) {
        watch(
            () => form[key],
            () => {
                if (errors[key]) errors[key] = '';
            },
            { deep: true },
        );
    }

    return { form, errors, field, validate, isDirty, setForm };
}
