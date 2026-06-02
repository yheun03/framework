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
type ProgressRange = {
    start: number
    end: number
}

const props = withDefaults(
    defineProps<{
        value?: number
        range?: ProgressRange
        label?: string
        showValue?: boolean
        disabled?: boolean
    }>(),
    {
        value: 0,
        label: undefined,
        showValue: false,
        disabled: false,
    },
)

function normalizeValue(value: number) {
    const next = Number(value)

    if (Number.isNaN(next)) return 0

    return Math.min(100, Math.max(0, Math.round(next)))
}

function normalizeRange(range?: ProgressRange): ProgressRange {
    if (!range) {
        return {
            start: 0,
            end: normalizeValue(props.value),
        }
    }

    const start = normalizeValue(range.start)
    const end = normalizeValue(range.end)

    return {
        start: Math.min(start, end),
        end: Math.max(start, end),
    }
}

const normalizedRange = computed(() => normalizeRange(props.range))
const displayEnd = computed(() => normalizedRange.value.end)
const showHeader = computed(() => !!props.label || props.showValue)

const rootClasses = computed(() => [
    'app-progress-bar',
    {
        'app-progress-bar--disabled': props.disabled,
    },
])

const rangeStyle = computed(() => ({
    '--progress-start': normalizedRange.value.start,
    '--progress-end': normalizedRange.value.end,
}))
</script>
