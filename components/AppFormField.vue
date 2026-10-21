<template>
    <div
        class="app-form-field"
        :class="{
            'is-required': required,
            'is-disabled': disabled,
            [`is-${state}`]: state,
        }"
        :style="rootStyle"
    >
        <div v-if="label || $slots.label" class="app-form-field__head">
            <label v-if="label" class="app-form-field__label" :for="props.for">
                {{ label }}
                <span v-if="required" class="app-form-field__required" aria-hidden="true">*</span>
            </label>
            <slot v-else name="label" />
            <span v-if="optionalText && !required" class="app-form-field__optional">{{ optionalText }}</span>
        </div>

        <p v-if="description" class="app-form-field__description">{{ description }}</p>

        <div class="app-form-field__control">
            <slot :id="props.for" :disabled="disabled" :state="state" />
        </div>

        <p v-if="hint" class="app-form-field__message" :class="`app-form-field__message--${state ?? 'hint'}`">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import type { AppState, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

const props = withDefaults(
    defineProps<{
        label?: string;
        for?: string;
        required?: boolean;
        disabled?: boolean;
        description?: string;
        /** 하단 보조 문구. state가 있으면 state 색상으로 표시됩니다. */
        hint?: string;
        /** 검증 상태: error | warning | success */
        state?: AppState;
        optionalText?: string;
        /** number(px) | '50%' | 'full' */
        width?: AppWidth;
    }>(),
    {
        label: '',
        for: '',
        required: false,
        disabled: false,
        description: '',
        hint: '',
        state: null,
        optionalText: '선택',
    },
);

const rootStyle = computed(() => toSizeStyle(props.width));
</script>
