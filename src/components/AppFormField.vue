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
            <label v-else class="app-form-field__label" :for="fieldId"><slot name="label" /></label>
            <span v-if="optionalText !== '' && !required" class="app-form-field__optional">{{ optionalText ?? $t('ui.optional') }}</span>
        </div>

        <p v-if="description" :id="`${fieldId}-desc`" class="app-form-field__description">{{ description }}</p>

        <div class="app-form-field__control">
            <slot :id="fieldId" :disabled="disabled" :state="state" />
        </div>

        <p v-if="hint" :id="`${fieldId}-hint`" class="app-form-field__message" :class="`app-form-field__message--${state ?? 'hint'}`">{{ hint }}</p>
    </div>
</template>

<script>
export const APP_FORM_FIELD_KEY = Symbol('AppFormField');
</script>

<script setup>
import { STATES, oneOf } from '@/utils/props';
import { toSizeStyle } from '@/utils/css';
import { computed, provide, useId } from 'vue';

const props = defineProps({
    label: { type: String, default: '' },
    for: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    description: { type: String, default: '' },
    /** 하단 보조 문구. state가 있으면 state 색상으로 표시됩니다. */
    hint: { type: String, default: '' },
    /** 검증 상태: error | warning | success */
    state: { type: [String, null], default: null, validator: oneOf(STATES) },
    /** 기본 '선택' (i18n ui.optional). 빈 문자열이면 숨김 */
    optionalText: { type: String, default: undefined },
    /** number(px) | '50%' | 'full' */
    width: { type: [Number, String] },
});

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
