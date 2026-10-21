<template>
    <div class="form-field app-textarea-field" :class="{ [`is-${state}`]: state, 'is-disabled': disabled }" :style="rootStyle">
        <label v-if="label" class="form-field__label app-textarea__label" :for="id">{{ label }}</label>

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
                :id="id"
                class="app-textarea__control"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                :rows="rows"
                :maxlength="maxLength"
                :aria-invalid="state === 'error' || undefined"
                :aria-describedby="ariaDescribedby"
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
                    지우기
                </AppTextButton>

                <span v-if="showCount" class="app-textarea__count">
                    {{ textLength }}<template v-if="maxLength"> / {{ maxLength }}</template>
                </span>
            </div>
        </div>

        <p v-if="hint" class="form-field__hint app-textarea__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import type { AppFieldShape, AppFormSize, AppState, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

type AppTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

const props = withDefaults(
    defineProps<{
        modelValue?: string | number | null;
        label?: string;
        hint?: string;
        id?: string;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        rows?: number;
        maxLength?: number;
        showCount?: boolean;
        clearable?: boolean;
        size?: AppFormSize;
        shape?: AppFieldShape;
        state?: AppState;
        /** number(px) | '50%' | 'full' */
        width?: AppWidth;
        resize?: AppTextareaResize;
        ariaDescribedby?: string;
    }>(),
    {
        modelValue: '',
        id: undefined,
        placeholder: '',
        disabled: false,
        readonly: false,
        rows: 4,
        maxLength: undefined,
        showCount: false,
        clearable: false,
        size: 'md',
        shape: 'round',
        state: null,
        resize: 'vertical',
        ariaDescribedby: undefined,
    },
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input', value: string): void;
    (e: 'clear'): void;
}>();

const isFocused = ref(false);
const rootStyle = computed(() => toSizeStyle(props.width));

const textLength = computed(() => String(props.modelValue ?? '').length);

function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    emit('update:modelValue', value);
    emit('input', value);
}

function handleClear() {
    emit('update:modelValue', '');
    emit('clear');
}
</script>
