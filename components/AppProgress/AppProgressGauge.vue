<template>
    <div class="app-progress-gauge" :class="[
        `app-progress-gauge--${variant}`,
        `app-progress-gauge--${mode}`,
        { 'is-disabled': disabled },
    ]">
        <div class="app-progress-gauge__svg-wrap">
            <svg class="app-progress-gauge__svg" viewBox="0 0 120 70" role="img" :aria-label="label || 'progress'">
                <path class="app-progress-gauge__track" d="M 16 60 A 44 44 0 0 1 104 60" pathLength="100"
                    :stroke-width="strokeWidth" />
                <path v-if="variant === 'gauge'" class="app-progress-gauge__value"
                    d="M 16 60 A 44 44 0 0 1 104 60" pathLength="100" :stroke-width="strokeWidth"
                    :stroke-dasharray="`${valuePercent} 100`" />
                <path v-else class="app-progress-gauge__range" d="M 16 60 A 44 44 0 0 1 104 60"
                    pathLength="100" :stroke-width="strokeWidth" :stroke-dasharray="`${rangePercent} 100`"
                    :stroke-dashoffset="-rangeStartPercent" />
            </svg>

            <div class="app-progress-gauge__content">
                <span v-if="showLabel && label" class="app-progress-gauge__label">{{ label }}</span>
                <strong v-if="showValue && variant === 'gauge'" class="app-progress-gauge__value-text">{{ value }}</strong>
                <span v-if="showRangeText && variant !== 'gauge'" class="app-progress-gauge__range-text">
                    {{ range.start }} ~ {{ range.end }}
                </span>
            </div>
        </div>

        <input v-if="mode === 'control-single'" class="app-progress-gauge__input" type="range" :min="min" :max="max"
            :step="step" :value="value" :disabled="disabled" @input="updateValue" />

        <div v-if="mode === 'control-range'" class="app-progress-gauge__controls">
            <input type="range" :min="min" :max="max" :step="step" :value="range.start" :disabled="disabled"
                @input="updateRange('start', $event)" />
            <input type="range" :min="min" :max="max" :step="step" :value="range.end" :disabled="disabled"
                @input="updateRange('end', $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProgressRange } from "~/utils/progress";

const props = withDefaults(defineProps<{
    variant?: "gauge" | "semi-doughnut-range";
    mode?: "display" | "control-single" | "control-range";
    value?: number;
    range?: ProgressRange;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    disabled?: boolean;
    showLabel?: boolean;
    showValue?: boolean;
    showRangeText?: boolean;
    strokeWidth?: number;
}>(), {
    variant: "gauge",
    mode: "display",
    value: 0,
    range: () => ({ start: 0, end: 100 }),
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showLabel: true,
    showValue: true,
    showRangeText: true,
    strokeWidth: 5,
});

const emit = defineEmits<{
    "update:value": [number];
    "update:range": [ProgressRange];
}>();

const toPercent = (value: number) => Math.max(0, Math.min(100, ((value - props.min) / (props.max - props.min)) * 100));
const valuePercent = computed(() => toPercent(props.value));
const rangeStartPercent = computed(() => toPercent(props.range.start));
const rangePercent = computed(() => Math.max(0, toPercent(props.range.end) - rangeStartPercent.value));

function updateValue(event: Event) {
    emit("update:value", Number((event.target as HTMLInputElement).value));
}

function updateRange(key: "start" | "end", event: Event) {
    emit("update:range", { ...props.range, [key]: Number((event.target as HTMLInputElement).value) });
}
</script>
