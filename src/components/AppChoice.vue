<template>
    <label
        class="app-choice"
        :class="[
            `app-choice--${type}`,
            `app-choice--${variant}`,
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
                :type="type"
                :name="name"
                :value="value"
                :checked="isChecked"
                :disabled="disabled || readonly"
                :aria-invalid="state === 'error'"
                :aria-label="ariaLabel"
                :role="variant === 'toggle' ? 'switch' : undefined"
                @change="handleChange"
            />

            <span v-if="!chipVariants.includes(variant)" class="app-choice__visual" aria-hidden="true">
                <span v-if="isChecked || indeterminate" class="app-choice__inner">
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

        <span v-if="variant === 'toggle' && !label" class="app-choice__toggle-text">
            {{ isChecked ? toggleLabels?.checked : toggleLabels?.unchecked }}
        </span>
    </label>
</template>

<script setup>
import { STATES, oneOf } from '@/utils/props';
import { IconCheck, IconMinus } from '@/components/icons';
import { computed } from 'vue';

const props = defineProps({
    type: { type: String, default: 'checkbox', validator: oneOf(['checkbox', 'radio']) },
    modelValue: { type: [Boolean, String, Number, null], required: true },
    value: { type: [String, Number] },
    name: { type: String },
    label: { type: String },
    hint: { type: String },
    toggleLabels: { type: Object },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
    id: { type: String },
    /** 화면에 label 이 없을 때 스크린리더용 이름 (표 선택 체크박스 등) */
    ariaLabel: { type: String },
    variant: { type: String, default: 'default', validator: oneOf(['default', 'round', 'chip', 'chip-outline', 'fill', 'ghost', 'toggle']) },
    state: { type: [String, null], default: null, validator: oneOf(STATES) },
    size: { type: String, default: 'md', validator: oneOf(['sm', 'md']) },
});

const emit = defineEmits(['update:modelValue']);
const chipVariants = ['chip', 'chip-outline', 'fill', 'ghost', 'toggle'];
const isChecked = computed(() => (props.type === 'checkbox' ? Boolean(props.modelValue) : props.modelValue === props.value));

function handleChange(event) {
    const input = event.target;
    emit('update:modelValue', props.type === 'checkbox' ? input.checked : (props.value ?? input.value));
}
</script>
