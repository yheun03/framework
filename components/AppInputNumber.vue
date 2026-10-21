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
                aria-label="감소"
                @click="step(-1)"
            >
                <IconMinus />
            </AppIconButton>

            <AppInput
                :id="inputId"
                class="app-input-number__field"
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
                aria-label="증가"
                @click="step(1)"
            >
                <IconPlus />
            </AppIconButton>
        </div>

        <p v-if="hint" class="app-input-number__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import { IconMinus, IconPlus } from '~/components/icons';
import type { AppState, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

/**
 * AppInputNumber (Figma 11. ETC - 수량 버튼)
 * 구성: AppIconButton(-) + AppInput + AppIconButton(+)
 * variant: box(A타입 사각) / circle(B타입 원형 버튼) / plain(C타입 테두리 없음)
 * size: xs(24px) / sm(36px) / md(44px) / lg(48px)
 */
const props = withDefaults(
    defineProps<{
        modelValue: number | null;
        min?: number;
        max?: number;
        step?: number;
        /** 소수점 자리수 */
        precision?: number;
        variant?: 'box' | 'circle' | 'plain';
        size?: 'xs' | 'sm' | 'md' | 'lg';
        label?: string;
        hint?: string;
        state?: AppState;
        width?: AppWidth;
        disabled?: boolean;
        readonly?: boolean;
        id?: string;
        name?: string;
    }>(),
    {
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        step: 1,
        precision: 0,
        variant: 'box',
        size: 'sm',
        label: '',
        hint: '',
        state: null,
        disabled: false,
        readonly: false,
    },
);

const emit = defineEmits<{ 'update:modelValue': [number]; change: [number] }>();

const fallbackId = useId();
const inputId = computed(() => props.id ?? `app-input-number-${fallbackId}`);
const rootStyle = computed(() => toSizeStyle(props.width));
// Figma 수량 버튼 높이 (24 / 36 / 44 / 48px) 에 맞춘 AppIconButton 크기
const BUTTON_SIZES = { xs: { size: 24, icon: 10 }, sm: { size: 36, icon: 12 }, md: { size: 44, icon: 14 }, lg: { size: 48, icon: 16 } } as const;
const buttonSize = computed(() => BUTTON_SIZES[props.size]);
const current = computed(() => props.modelValue ?? props.min);
const isMin = computed(() => current.value <= props.min);
const isMax = computed(() => current.value >= props.max);
const displayValue = computed(() => (props.modelValue == null ? '' : props.modelValue.toFixed(props.precision)));

function clamp(value: number) {
    const fixed = Number(value.toFixed(props.precision));
    return Math.min(props.max, Math.max(props.min, fixed));
}

function update(value: number) {
    const next = clamp(value);
    emit('update:modelValue', next);
    emit('change', next);
}

function step(direction: 1 | -1) {
    if (props.disabled || props.readonly) return;
    update(current.value + props.step * direction);
}

function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const parsed = Number(input.value.replace(/[^\d.-]/g, ''));
    const next = Number.isFinite(parsed) ? clamp(parsed) : current.value;
    input.value = next.toFixed(props.precision);
    update(next);
}
</script>
