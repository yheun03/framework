<template>
    <div :class="rootClasses">
        <div v-if="showHeader" class="app-progress-bar__header">
            <span v-if="label" class="app-progress-bar__label">
                {{ label }}
            </span>

            <span v-if="showValue" class="app-progress-bar__value"> {{ displayEnd }}% </span>
        </div>

        <div
            class="app-progress-bar__track"
            role="progressbar"
            :aria-valuenow="displayEnd"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="label || `진행률 ${displayEnd}%`"
        >
            <div class="app-progress-bar__fill" :style="rangeStyle" />
        </div>
    </div>
</template>

<script setup>
import { normalizeProgressRange } from '@/utils/progress';
import { computed } from 'vue';

const props = defineProps({
    value: { type: Number, default: 0 },
    range: { type: Object },
    label: { type: String, default: undefined },
    showValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

const normalizedRange = computed(() => normalizeProgressRange(props.range, {}, props.value));
const displayEnd = computed(() => normalizedRange.value.end);
const showHeader = computed(() => !!props.label || props.showValue);

const rootClasses = computed(() => [
    'app-progress-bar',
    {
        'app-progress-bar--disabled': props.disabled,
    },
]);

const rangeStyle = computed(() => ({
    '--progress-start': normalizedRange.value.start,
    '--progress-end': normalizedRange.value.end,
}));
</script>
