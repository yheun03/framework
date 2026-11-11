<template>
    <label
        class="app-choice"
        :class="[
            `app-choice--${type}`,
            `app-choice--${visualVariant}`,
            `app-choice--${size}`,
            {
                'is-disabled': disabled,
                'is-readonly': readonly,
                'is-checked': isChecked,
                'is-indeterminate': indeterminate,
                [`is-${state}`]: state,
            },
        ]"
    >
        <span class="app-choice__control">
            <input
                :id="id"
                class="app-choice__input"
                :type="inputType"
                :name="name"
                :value="value"
                :checked="isChecked"
                :disabled="disabled || readonly"
                :aria-invalid="state === 'error'"
                :aria-label="ariaLabel"
                :role="type === 'toggle' ? 'switch' : undefined"
                @change="handleChange"
            />

            <span v-if="!chipVariants.includes(variant)" class="app-choice__visual" aria-hidden="true">
                <span v-if="type !== 'toggle' && (isChecked || indeterminate)" class="app-choice__inner">
                    <IconMinus v-if="indeterminate" />
                    <IconCheck v-else-if="type === 'checkbox'" />
                    <span v-else class="app-choice__dot" />
                </span>
            </span>
        </span>

        <span v-if="label || hint" class="app-choice__body">
            <span v-if="label" class="app-choice__label">{{ label }}</span>
            <span v-if="hint" class="app-choice__hint">{{ hint }}</span>
        </span>
    </label>
</template>

<script setup>
import { STATES, oneOf } from '@/utils/props';
import { IconCheck, IconMinus } from '@/components/icons';
import { computed } from 'vue';

const props = defineProps({
    /** checkbox · radio · toggle(스위치) */
    type: { type: String, default: 'checkbox', validator: oneOf(['checkbox', 'radio', 'toggle']) },
    modelValue: { type: [Boolean, String, Number, null], required: true },
    value: { type: [String, Number] },
    name: { type: String },
    label: { type: String },
    hint: { type: String },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
    id: { type: String },
    /** 화면에 label 이 없을 때 스크린리더용 이름 (표 선택 체크박스 등) */
    ariaLabel: { type: String },
    /**
     * 모양 (Figma 05. ETC)
     * - radio: default(기본형) · line(라인형 - 굵은 테두리)
     * - toggle: default(A타입) · line(B타입 - 얇은 선) · bar(C타입 - 낮은 막대)
     * - 칩 모양(모든 type): chip · chip-outline · fill · ghost
     */
    variant: { type: String, default: 'default', validator: oneOf(['default', 'line', 'bar', 'chip', 'chip-outline', 'fill', 'ghost']) },
    /** 체크박스 모서리: square(직각) · pill(써클) - 다른 컴포넌트의 shape 와 같은 값 */
    shape: { type: String, default: 'square', validator: oneOf(['square', 'pill']) },
    state: { type: [String, null], default: null, validator: oneOf(STATES) },
    size: { type: String, default: 'md', validator: oneOf(['sm', 'md']) },
});

const emit = defineEmits(['update:modelValue']);
const chipVariants = ['chip', 'chip-outline', 'fill', 'ghost'];
const isBoolean = computed(() => props.type !== 'radio');
const inputType = computed(() => (props.type === 'radio' ? 'radio' : 'checkbox'));
const isChecked = computed(() => (isBoolean.value ? Boolean(props.modelValue) : props.modelValue === props.value));
// 스타일 클래스: 써클 체크박스 · 라인형 라디오는 같은 '굵은 원형' 스타일(--round)을 씁니다.
const visualVariant = computed(() => {
    if (props.type === 'checkbox' && props.shape === 'pill' && props.variant === 'default') return 'round';
    if (props.type === 'radio' && props.variant === 'line') return 'round';
    if (props.type === 'toggle' && !chipVariants.includes(props.variant)) return `toggle-${props.variant}`;
    return props.variant;
});

function handleChange(event) {
    const input = event.target;
    emit('update:modelValue', isBoolean.value ? input.checked : (props.value ?? input.value));
}
</script>
