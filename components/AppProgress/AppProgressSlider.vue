<template>
    <div class="app-progress-slider" :class="[
        `app-progress-slider--${type}`,
        { 'app-progress-slider--disabled': disabled },
    ]">
        <div v-if="type === 'single'" class="app-progress-slider__control">
            <label v-if="label" class="app-progress-slider__label">{{ label }}</label>
            <div ref="singleSliderEl" class="app-progress-slider__noui" role="slider" aria-orientation="horizontal"
                :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="singleValue" />
            <div v-if="showValue" class="app-progress-slider__value">{{ singleValue }}%</div>
        </div>

        <div v-else class="app-progress-slider__control">
            <label v-if="label" class="app-progress-slider__label">{{ label }}</label>
            <div ref="rangeSliderEl" class="app-progress-slider__noui" role="group" aria-label="프로그레스 범위 선택" />
            <div v-if="showValue" class="app-progress-slider__range-value">
                <span>{{ normalizedRange.start }}%</span>
                <span>{{ normalizedRange.end }}%</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import noUiSlider from "nouislider";
import type { API as NoUiSliderApi } from "nouislider";
import {
    isSameProgressRange,
    normalizeProgressRange,
    normalizeProgressValue,
    type ProgressRange,
} from "~/utils/progress";

const props = withDefaults(defineProps<{
    value?: number;
    range?: ProgressRange;
    type?: "single" | "range";
    label?: string;
    disabled?: boolean;
    showValue?: boolean;
}>(), {
    value: 0,
    type: "single",
    disabled: false,
    showValue: false,
});

const emit = defineEmits<{
    "update:value": [number];
    "update:range": [ProgressRange];
}>();

const singleSliderEl = ref<HTMLElement | null>(null);
const rangeSliderEl = ref<HTMLElement | null>(null);
const singleValue = computed(() => normalizeProgressValue(props.value));
const normalizedRange = computed(() => normalizeProgressRange(props.range));
let singleSlider: NoUiSliderApi | null = null;
let rangeSlider: NoUiSliderApi | null = null;

function handleSingleChange(values: (number | string)[]) {
    const value = normalizeProgressValue(Number(values[0]));
    if (value !== singleValue.value) emit("update:value", value);
}

function handleRangeChange(values: (number | string)[]) {
    const value = normalizeProgressRange({
        start: Number(values[0]),
        end: Number(values[1]),
    });
    if (!isSameProgressRange(value, normalizedRange.value)) emit("update:range", value);
}

function createSingleSlider() {
    if (props.type !== "single" || !singleSliderEl.value) return;

    singleSlider = noUiSlider.create(singleSliderEl.value, {
        start: [singleValue.value],
        connect: [true, false],
        range: { min: 0, max: 100 },
        step: 1,
        behaviour: "tap-drag",
        animate: false,
    });
    singleSlider.on("slide", handleSingleChange);
}

function createRangeSlider() {
    if (props.type !== "range" || !rangeSliderEl.value) return;

    rangeSlider = noUiSlider.create(rangeSliderEl.value, {
        start: [normalizedRange.value.start, normalizedRange.value.end],
        connect: true,
        range: { min: 0, max: 100 },
        step: 1,
        behaviour: "tap-drag",
        animate: false,
    });
    rangeSlider.on("slide", handleRangeChange);
}

function destroySliders() {
    singleSlider?.destroy();
    rangeSlider?.destroy();
    singleSlider = null;
    rangeSlider = null;
}

function createSliders() {
    destroySliders();
    createSingleSlider();
    createRangeSlider();
    syncDisabled();
}

function syncDisabled() {
    if (props.disabled) {
        singleSlider?.disable();
        rangeSlider?.disable();
        return;
    }
    singleSlider?.enable();
    rangeSlider?.enable();
}

function syncValues() {
    if (singleSlider) singleSlider.set([singleValue.value]);
    if (rangeSlider) rangeSlider.set([normalizedRange.value.start, normalizedRange.value.end]);
}

onMounted(createSliders);
onBeforeUnmount(destroySliders);

watch(() => props.type, async () => {
    await nextTick();
    createSliders();
});
watch(() => props.disabled, syncDisabled);
watch([singleValue, normalizedRange], syncValues, { deep: true });
</script>
