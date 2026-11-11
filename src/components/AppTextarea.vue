<template>
    <div class="form-field app-textarea-field" :class="{ [`is-${state}`]: state, 'is-disabled': disabled }" :style="rootStyle">
        <label v-if="label" class="form-field__label app-textarea__label" :for="textareaId">{{ label }}</label>

        <div
            class="app-textarea"
            :class="[
                `app-textarea--${size}`,
                `app-textarea--shape-${shape}`,
                `app-textarea--resize-${resize}`,
                {
                    'is-focused': isFocused,
                    'is-disabled': disabled,
                    'is-readonly': readonly,
                    [`is-${state}`]: state,
                },
            ]"
        >
            <textarea
                :id="textareaId"
                class="app-textarea__control"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :rows="rows"
                :maxlength="maxLength"
                :aria-invalid="state === 'error' || undefined"
                :aria-describedby="ariaDescribedby ?? formField?.describedby.value"
                :aria-label="label ? undefined : ariaLabel"
                @input="handleInput"
                @focus="isFocused = true"
                @blur="isFocused = false"
            />

            <div v-if="showCount || clearable" class="app-textarea__footer">
                <AppTextButton
                    v-if="clearable && modelValue && !disabled && !readonly"
                    type="button"
                    class="app-textarea__clear"
                    size="sm"
                    tone="gray"
                    @click="handleClear"
                >
                    {{ $t('ui.clear') }}
                </AppTextButton>

                <span v-if="showCount" class="app-textarea__count">
                    {{ textLength }}<template v-if="maxLength"> / {{ maxLength }}</template>
                </span>
            </div>
        </div>

        <p v-if="hint" class="form-field__hint app-textarea__hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { useLabelWarning } from '@/utils/a11y';
import { FORM_SHAPES, FORM_SIZES, STATES, oneOf } from '@/utils/props';
import { APP_FORM_FIELD_KEY } from '@/components/AppFormField.vue';

import { toSizeStyle } from '@/utils/css';
import { computed, inject, ref, useId } from 'vue';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';

const props = defineProps({
    modelValue: { type: [String, Number, null], default: '' },
    label: { type: String },
    hint: { type: String },
    id: { type: String, default: undefined },
    /** label 이 없을 때 스크린리더용 이름 */
    ariaLabel: { type: String },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    rows: { type: Number, default: 4 },
    maxLength: { type: Number, default: undefined },
    showCount: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    size: { type: String, default: 'lg', validator: oneOf(FORM_SIZES) },
    shape: { type: String, default: 'round', validator: oneOf(FORM_SHAPES) },
    state: { type: [String, null], default: null, validator: oneOf(STATES) },
    /** number(px) | '50%' | 'full' */
    width: { type: [Number, String] },
    resize: { type: String, default: 'vertical' },
    ariaDescribedby: { type: String, default: undefined },
});

const emit = defineEmits(['update:modelValue', 'input', 'clear']);

const isFocused = ref(false);
// label 과 textarea 를 항상 연결하기 위해 id 가 없으면 자동 생성합니다.
const fallbackId = useId();
const formField = inject(APP_FORM_FIELD_KEY, null);
const textareaId = computed(() => props.id ?? formField?.id.value ?? `app-textarea-${fallbackId}`);
const rootStyle = computed(() => toSizeStyle(props.width));

const textLength = computed(() => String(props.modelValue ?? '').length);

useLabelWarning('AppTextarea', () => document.getElementById(textareaId.value));

function handleInput(event) {
    const target = event.target;
    const value = target.value;

    emit('update:modelValue', value);
    emit('input', value);
}

function handleClear() {
    emit('update:modelValue', '');
    emit('clear');
}
</script>
