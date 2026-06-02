<template>
    <div :class="rootClasses">
        <div v-if="isSingleMode" class="app-progress-slider__control">
            <label v-if="label" class="app-progress-slider__label">
                {{ label }}
            </label>

            <div ref="singleSliderEl" class="app-progress-slider__noui" role="slider" aria-orientation="horizontal"
                :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="singleValue" />

            <div v-if="showValue" class="app-progress-slider__value">
                {{ singleValue }}%
            </div>
        </div>

        <div v-else ref="rangeSliderEl" class="app-progress-slider__noui" role="group" aria-label="프로그레스 범위 선택" />
    </div>
</template>

<script setup lang="ts">
import noUiSlider from 'nouislider'
import type { API as NoUiSliderApi } from 'nouislider'
import 'nouislider/dist/nouislider.css'

type ProgressSliderMode = 'single' | 'range'

type ProgressRange = {
    start: number
    end: number
}

const props = withDefaults(
    defineProps<{
        value?: number
        range?: ProgressRange
        mode?: ProgressSliderMode
        label?: string
        disabled?: boolean
        showValue?: boolean
    }>(),
    {
        value: 0,
        mode: 'single',
        label: undefined,
        disabled: false,
        showValue: false,
    },
)

const emit = defineEmits<{
    (e: 'update:range', value: ProgressRange): void
    (e: 'update:value', value: number): void
}>()

const singleSliderEl = ref<HTMLElement | null>(null)
const rangeSliderEl = ref<HTMLElement | null>(null)

function normalizeValue(value: number) {
    const next = Number(value)

    if (Number.isNaN(next)) return 0

    return Math.min(100, Math.max(0, Math.round(next)))
}

function normalizeRange(range?: ProgressRange): ProgressRange {
    if (!range) {
        return {
            start: 0,
            end: 0,
        }
    }

    const start = normalizeValue(range.start)
    const end = normalizeValue(range.end)

    return {
        start: Math.min(start, end),
        end: Math.max(start, end),
    }
}

function isSameRange(a: ProgressRange, b: ProgressRange) {
    return a.start === b.start && a.end === b.end
}

const isSingleMode = computed(() => props.mode === 'single')
const isRangeMode = computed(() => props.mode === 'range')
const singleValue = computed(() => normalizeValue(props.value))
const normalizedRange = computed(() => normalizeRange(props.range))

const rootClasses = computed(() => [
    'app-progress-slider',
    `app-progress-slider--${props.mode}`,
    {
        'app-progress-slider--disabled': props.disabled,
    },
])

function createSliderManager() {
    let singleSlider: NoUiSliderApi | null = null
    let rangeSlider: NoUiSliderApi | null = null

    function destroySingleSlider() {
        if (!singleSlider) return
        singleSlider.destroy()
        singleSlider = null
    }

    function destroyRangeSlider() {
        if (!rangeSlider) return
        rangeSlider.destroy()
        rangeSlider = null
    }

    function handleSingleSliderChange(values: (number | string)[]) {
        const next = normalizeValue(Number(values[0]))

        if (next !== singleValue.value) {
            emit('update:value', next)
        }
    }

    function handleRangeSliderChange(values: (number | string)[]) {
        const next = normalizeRange({
            start: Number(values[0]),
            end: Number(values[1]),
        })

        if (!isSameRange(next, normalizedRange.value)) {
            emit('update:range', next)
        }
    }

    function syncSingleSlider() {
        if (!isSingleMode.value) {
            destroySingleSlider()
            return
        }

        if (!singleSliderEl.value) return

        if (!singleSlider) {
            singleSlider = noUiSlider.create(singleSliderEl.value, {
                start: [singleValue.value],
                connect: [true, false],
                range: { min: 0, max: 100 },
                step: 1,
                behaviour: 'tap-drag',
                animate: false,
                animationDuration: 0,
            })

            singleSlider.on('slide', handleSingleSliderChange)
            singleSlider.on('set', handleSingleSliderChange)
        } else {
            const raw = singleSlider.get()
            const current = Number(Array.isArray(raw) ? raw[0] : raw)

            if (!Number.isNaN(current) && normalizeValue(current) !== singleValue.value) {
                singleSlider.set([singleValue.value])
            }
        }

        if (props.disabled) singleSlider.disable()
        else singleSlider.enable()
    }

    function syncRangeSlider() {
        if (!isRangeMode.value) {
            destroyRangeSlider()
            return
        }

        if (!rangeSliderEl.value) return

        if (!rangeSlider) {
            rangeSlider = noUiSlider.create(rangeSliderEl.value, {
                start: [normalizedRange.value.start, normalizedRange.value.end],
                connect: true,
                range: { min: 0, max: 100 },
                step: 1,
                behaviour: 'tap-drag',
                animate: false,
                animationDuration: 0,
            })

            rangeSlider.on('slide', handleRangeSliderChange)
            rangeSlider.on('set', handleRangeSliderChange)
        } else {
            const raw = rangeSlider.get()
            const current = Array.isArray(raw)
                ? normalizeRange({
                    start: Number(raw[0]),
                    end: Number(raw[1]),
                })
                : normalizedRange.value

            if (!isSameRange(current, normalizedRange.value)) {
                rangeSlider.set([normalizedRange.value.start, normalizedRange.value.end])
            }
        }

        if (props.disabled) rangeSlider.disable()
        else rangeSlider.enable()
    }

    function destroyAllSliders() {
        destroySingleSlider()
        destroyRangeSlider()
    }

    return {
        syncSingleSlider,
        syncRangeSlider,
        destroyAllSliders,
    }
}

const sliderManager = createSliderManager()

onMounted(() => {
    sliderManager.syncSingleSlider()
    sliderManager.syncRangeSlider()
})

onBeforeUnmount(() => {
    sliderManager.destroyAllSliders()
})

watch(
    [isSingleMode, singleValue, () => props.disabled],
    () => {
        sliderManager.syncSingleSlider()
    },
)

watch(
    [isRangeMode, normalizedRange, () => props.disabled],
    () => {
        sliderManager.syncRangeSlider()
    },
    { deep: true },
)
</script>
