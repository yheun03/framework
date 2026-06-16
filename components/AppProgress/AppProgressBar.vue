<template>
    <div :class="rootClasses">
        <div v-if="showHeader" class="app-progress-bar__header">
            <span v-if="label" class="app-progress-bar__label">
                {{ label }}
            </span>

            <span v-if="showValue" class="app-progress-bar__value">
                {{ displayEnd }}%
            </span>
        </div>

        <div class="app-progress-bar__track" role="progressbar" :aria-valuenow="displayEnd" aria-valuemin="0"
            aria-valuemax="100" :aria-label="label">
            <div class="app-progress-bar__fill" :style="rangeStyle" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { normalizeProgressRange, type ProgressRange } from "~/utils/progress";

const props = withDefaults(
    defineProps<{
        value?: number;
        range?: ProgressRange;
        label?: string;
        showValue?: boolean;
        disabled?: boolean;
    }>(),
    {
        value: 0,
        label: undefined,
        showValue: false,
        disabled: false,
    },
);

const normalizedRange = computed(() =>
    normalizeProgressRange(props.range, {}, props.value),
);
const displayEnd = computed(() => normalizedRange.value.end);
const showHeader = computed(() => !!props.label || props.showValue);

const rootClasses = computed(() => [
    "app-progress-bar",
    {
        "app-progress-bar--disabled": props.disabled,
    },
]);

const rangeStyle = computed(() => ({
    "--progress-start": normalizedRange.value.start,
    "--progress-end": normalizedRange.value.end,
}));
</script>
