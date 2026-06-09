<template>
    <AppProgressSlider v-if="isControlMode" :value="singleValue" :range="normalizedRange" :mode="sliderMode"
        :label="label" :show-value="showLabel" :disabled="disabled" @update:value="handleValueUpdate"
        @update:range="handleRangeUpdate" />

    <AppProgressBar v-else :value="singleValue" :range="range" :label="label" :show-value="showLabel"
        :disabled="disabled" />
</template>

<script setup lang="ts">
import { normalizeProgressRange, normalizeProgressValue, type ProgressRange } from '~/utils/progress'

type Variant = 'linear'
type Mode = 'display' | 'control-single' | 'control-range'

const props = withDefaults(
    defineProps<{
        value: number
        range?: ProgressRange
        rangeSelectable?: boolean
        mode?: Mode
        label?: string
        disabled?: boolean
        variant?: Variant
        showLabel?: boolean
    }>(),
    {
        variant: 'linear',
        mode: 'display',
        showLabel: false,
        rangeSelectable: false,
        label: undefined,
        disabled: false,
    },
)

const emit = defineEmits<{
    (e: 'update:range', value: ProgressRange): void
    (e: 'update:value', value: number): void
}>()

const singleValue = computed(() => normalizeProgressValue(props.value))
const normalizedRange = computed(() => normalizeProgressRange(props.range))

const isSingleControl = computed(() => {
    return props.variant === 'linear' && props.mode === 'control-single'
})

const isRangeControl = computed(() => {
    return props.variant === 'linear' && !!props.range && (props.mode === 'control-range' || props.rangeSelectable)
})

const isControlMode = computed(() => isSingleControl.value || isRangeControl.value)
const sliderMode = computed(() => (isRangeControl.value ? 'range' : 'single'))

function handleValueUpdate(value: number) {
    emit('update:value', value)
}

function handleRangeUpdate(value: ProgressRange) {
    emit('update:range', value)
}
</script>
