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
            <label v-if="label" class="app-form-field__label" :for="fieldId">
                {{ label }}
                <span v-if="required" class="app-form-field__required" aria-hidden="true">*</span>
            </label>
            <slot v-else name="label" />
            <span v-if="optionalText && !required" class="app-form-field__optional">{{ optionalText }}</span>
        </div>

        <p v-if="description" :id="`${fieldId}-desc`" class="app-form-field__description">{{ description }}</p>

        <div class="app-form-field__control">
            <slot :id="fieldId" :disabled="disabled" :state="state" />
        </div>

        <p v-if="hint" :id="`${fieldId}-hint`" class="app-form-field__message" :class="`app-form-field__message--${state ?? 'hint'}`">{{ hint }}</p>
    </div>
</template>

<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue';

export const APP_FORM_FIELD_KEY: InjectionKey<{ id: ComputedRef<string>; describedby: ComputedRef<string | undefined> }> = Symbol('AppFormField');
</script>

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

// label · 설명 · 안내 문구를 안쪽 입력 요소(AppInput / AppTextarea / AppSelect)와 자동 연결합니다.
// (for 를 지정하지 않아도 스크린리더가 '라벨 + 설명'을 함께 읽습니다)
const fallbackId = useId();
const fieldId = computed(() => props.for || `app-form-field-${fallbackId}`);
const describedby = computed(
    () => [props.description && `${fieldId.value}-desc`, props.hint && `${fieldId.value}-hint`].filter(Boolean).join(' ') || undefined,
);

provide(APP_FORM_FIELD_KEY, { id: fieldId, describedby });
</script>
