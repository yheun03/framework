<template>
    <div
        class="app-input-number"
        :class="[
            `app-input-number--${variant}`,
            `app-input-number--${size}`,
            { 'is-disabled': disabled, 'is-readonly': readonly, [`is-${state}`]: state },
        ]"
        :style="rootStyle"
    >
        <label v-if="label" class="app-input-number__label" :for="inputId">{{ label }}</label>

        <div class="app-input-number__control">
            <AppIconButton
                class="app-input-number__button"
                :variant="variant === 'plain' ? 'plain' : 'outline'"
                :shape="variant === 'circle' ? 'pill' : 'square'"
                :size="buttonSize.size"
                :icon-size="buttonSize.icon"
                :disabled="disabled || readonly || isMin"
                aria-label="수량 감소"
                @click="step(-1)"
            >
                <IconMinus />
            </AppIconButton>

            <AppInput
                :id="inputId"
                class="app-input-number__field"
                :aria-label="label ? undefined : '수량'"
                :model-value="displayValue"
                :name="name"
                shape="square"
                :disabled="disabled"
                :readonly="readonly"
                :state="state"
                @change="handleInput"
                @keydown.up.prevent="step(1)"
                @keydown.down.prevent="step(-1)"
            />

            <AppIconButton
                class="app-input-number__button"
                :variant="variant === 'plain' ? 'plain' : 'outline'"
                :shape="variant === 'circle' ? 'pill' : 'square'"
                :size="buttonSize.size"
                :icon-size="buttonSize.icon"
                :disabled="disabled || readonly || isMax"
                aria-label="수량 증가"
                @click="step(1)"
            >
                <IconPlus />
            </AppIconButton>
        </div>

        <p v-if="hint" class="app-input-number__hint">{{ hint }}</p>
    </div>
</template>

<script setup>
import { IconMinus, IconPlus } from '@/components/icons';

import { toSizeStyle } from '@/utils/css';
import { computed, useId } from 'vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';
import AppInput from '@/components/AppInput.vue';

/**
 * AppInputNumber (Figma 11. ETC - 수량 버튼)
 * 구성: AppIconButton(-) + AppInput + AppIconButton(+)
 * variant: box(A타입 사각) / circle(B타입 원형 버튼) / plain(C타입 테두리 없음)
 * size: xs(24px) / sm(36px) / md(44px) / lg(48px)
 */
const props = defineProps({
    modelValue: { type: [Number, null], required: true },
    min: { type: Number, default: 0 },
    max: { type: Number, default: Number.MAX_SAFE_INTEGER },
    step: { type: Number, default: 1 },
    /** 소수점 자리수 */
    precision: { type: Number, default: 0 },
    variant: { type: String, default: 'box' },
    size: { type: String, default: 'sm' },
    label: { type: String, default: '' },
    hint: { type: String, default: '' },
    state: { type: [String, null], default: null },
    width: { type: [Number, String] },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    id: { type: String },
    name: { type: String },
});

const emit = defineEmits(['update:modelValue', 'change']);

const fallbackId = useId();
const inputId = computed(() => props.id ?? `app-input-number-${fallbackId}`);
const rootStyle = computed(() => toSizeStyle(props.width));
// Figma 수량 버튼 높이 (24 / 36 / 44 / 48px) 에 맞춘 AppIconButton 크기
const BUTTON_SIZES = { xs: { size: 24, icon: 10 }, sm: { size: 36, icon: 12 }, md: { size: 44, icon: 14 }, lg: { size: 48, icon: 16 } };
const buttonSize = computed(() => BUTTON_SIZES[props.size]);
const current = computed(() => props.modelValue ?? props.min);
const isMin = computed(() => current.value <= props.min);
const isMax = computed(() => current.value >= props.max);
const displayValue = computed(() => (props.modelValue == null ? '' : props.modelValue.toFixed(props.precision)));

function clamp(value) {
    const fixed = Number(value.toFixed(props.precision));
    return Math.min(props.max, Math.max(props.min, fixed));
}

function update(value) {
    const next = clamp(value);
    emit('update:modelValue', next);
    emit('change', next);
}

function step(direction) {
    if (props.disabled || props.readonly) return;
    update(current.value + props.step * direction);
}

function handleInput(event) {
    const input = event.target;
    const parsed = Number(input.value.replace(/[^\d.-]/g, ''));
    const next = Number.isFinite(parsed) ? clamp(parsed) : current.value;
    input.value = next.toFixed(props.precision);
    update(next);
}
</script>
