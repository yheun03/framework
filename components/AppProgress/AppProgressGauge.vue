<template>
    <div class="app-progress-gauge" :class="[
        `app-progress-gauge--${variant}`,
        `app-progress-gauge--${type}`,
        { 'is-disabled': disabled },
    ]">
        <div class="app-progress-gauge__svg-wrap">
            <svg ref="svgEl" class="app-progress-gauge__svg" viewBox="0 0 120 70" role="img"
                :aria-label="ariaLabel" @pointerdown="handleTrackPointerDown">
                <path class="app-progress-gauge__track" :d="trackPath" :stroke-width="strokeWidth" />
                <path v-if="hasRange" class="app-progress-gauge__range" :d="rangePath"
                    :stroke-width="strokeWidth" />
                <path v-if="isGauge" class="app-progress-gauge__value" :d="valuePath"
                    :stroke-width="strokeWidth" />

                <circle v-if="showRangeHandles" class="app-progress-gauge__handle app-progress-gauge__handle--start"
                    :cx="rangeStartPoint.x" :cy="rangeStartPoint.y" r="4"
                    @pointerdown.stop="handleRangeHandlePointerDown('start', $event)" />
                <circle v-if="showRangeHandles" class="app-progress-gauge__handle app-progress-gauge__handle--end"
                    :cx="rangeEndPoint.x" :cy="rangeEndPoint.y" r="4"
                    @pointerdown.stop="handleRangeHandlePointerDown('end', $event)" />

                <line v-if="showValueNeedle" class="app-progress-gauge__needle" :x1="center.x" :y1="center.y"
                    :x2="needlePoint.x" :y2="needlePoint.y" />
                <circle v-if="showValueNeedle" class="app-progress-gauge__needle-center"
                    :cx="center.x" :cy="center.y" r="3.5" />
            </svg>

            <div v-if="showContent" class="app-progress-gauge__content">
                <span v-if="showLabel && label" class="app-progress-gauge__label">{{ label }}</span>
                <strong v-if="showValue && isGauge" class="app-progress-gauge__value-text">
                    {{ normalizedValue }}
                </strong>
                <span v-if="showRangeText && hasRange" class="app-progress-gauge__range-text">
                    {{ normalizedRange.start }} ~ {{ normalizedRange.end }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    normalizeProgressRange,
    normalizeProgressValue,
    type ProgressRange,
} from "~/utils/progress";

type GaugeVariant = "gauge" | "semi-doughnut-range";
type GaugeType = "display" | "control-single" | "control-range";
type ActiveHandle = "value" | "start" | "end" | null;

const viewBoxWidth = 120;
const viewBoxHeight = 70;
const center = { x: 60, y: 60 };
const radius = 44;

const props = withDefaults(defineProps<{
    variant?: GaugeVariant;
    type?: GaugeType;
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
    showNeedle?: boolean;
    strokeWidth?: number;
}>(), {
    variant: "gauge",
    type: "display",
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showLabel: true,
    showValue: true,
    showRangeText: true,
    showNeedle: true,
    strokeWidth: 5,
});

const emit = defineEmits<{
    "update:value": [number];
    "update:range": [ProgressRange];
}>();

const svgEl = ref<SVGSVGElement | null>(null);
const bounds = computed(() => ({ min: props.min, max: props.max, step: props.step }));
const normalizedValue = computed(() => normalizeProgressValue(props.value, bounds.value));
const normalizedRange = computed(() => normalizeProgressRange(props.range, bounds.value));
const isGauge = computed(() => props.variant === "gauge");
const hasRange = computed(() => Boolean(props.range));
const isControlSingle = computed(() => props.type === "control-single");
const isControlRange = computed(() => props.type === "control-range" && hasRange.value);
const showValueNeedle = computed(() => isGauge.value && props.showNeedle);
const showRangeHandles = computed(() => isControlRange.value);
const showContent = computed(() => props.showLabel || props.showValue || props.showRangeText);
const ariaLabel = computed(() => hasRange.value
    ? `${props.label ?? "range"} ${normalizedRange.value.start}에서 ${normalizedRange.value.end}`
    : `${props.label ?? "progress"} ${normalizedValue.value}`);

function polarToCartesian(angle: number, pointRadius = radius) {
    const radian = (angle * Math.PI) / 180;
    return {
        x: center.x + pointRadius * Math.cos(radian),
        y: center.y + pointRadius * Math.sin(radian),
    };
}

function describeArc(startAngle: number, endAngle: number) {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArc = Math.abs(endAngle - startAngle) <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function valueToAngle(value: number) {
    if (props.max <= props.min) return -180;
    return -180 + ((value - props.min) / (props.max - props.min)) * 180;
}

const trackPath = computed(() => describeArc(-180, 0));
const valuePath = computed(() => describeArc(-180, valueToAngle(normalizedValue.value)));
const rangePath = computed(() => describeArc(
    valueToAngle(normalizedRange.value.start),
    valueToAngle(normalizedRange.value.end),
));
const needlePoint = computed(() => polarToCartesian(valueToAngle(normalizedValue.value), radius - 6));
const rangeStartPoint = computed(() => polarToCartesian(valueToAngle(normalizedRange.value.start)));
const rangeEndPoint = computed(() => polarToCartesian(valueToAngle(normalizedRange.value.end)));

function pointToValue(event: PointerEvent) {
    const rect = svgEl.value?.getBoundingClientRect();
    if (!rect?.width || !rect.height) return props.min;

    const x = ((event.clientX - rect.left) / rect.width) * viewBoxWidth;
    const y = ((event.clientY - rect.top) / rect.height) * viewBoxHeight;
    let angle = (Math.atan2(y - center.y, x - center.x) * 180) / Math.PI;

    if (angle > 0) angle = x < center.x ? -180 : 0;
    angle = Math.min(0, Math.max(-180, angle));

    const ratio = (angle + 180) / 180;
    return normalizeProgressValue(props.min + ratio * (props.max - props.min), bounds.value);
}

function updateValue(value: number) {
    const next = normalizeProgressValue(value, bounds.value);
    if (next !== normalizedValue.value) emit("update:value", next);
}

function updateRange(value: ProgressRange) {
    const next = normalizeProgressRange(value, bounds.value);
    if (next.start !== normalizedRange.value.start || next.end !== normalizedRange.value.end) {
        emit("update:range", next);
    }
}

let activeHandle: ActiveHandle = null;

function updateByPointer(event: PointerEvent) {
    if (!activeHandle || props.disabled) return;
    const value = pointToValue(event);

    if (activeHandle === "value") {
        updateValue(value);
    } else if (activeHandle === "start") {
        updateRange({ start: value, end: normalizedRange.value.end });
    } else {
        updateRange({ start: normalizedRange.value.start, end: value });
    }
}

function stopDragging() {
    activeHandle = null;
    window.removeEventListener("pointermove", updateByPointer);
    window.removeEventListener("pointerup", stopDragging);
    window.removeEventListener("pointercancel", stopDragging);
}

function startDragging(handle: Exclude<ActiveHandle, null>, event: PointerEvent) {
    if (props.disabled) return;
    event.preventDefault();
    activeHandle = handle;
    window.addEventListener("pointermove", updateByPointer);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    updateByPointer(event);
}

function handleTrackPointerDown(event: PointerEvent) {
    if (props.disabled || props.type === "display") return;
    if (isControlSingle.value) {
        startDragging("value", event);
        return;
    }
    if (!isControlRange.value) return;

    const value = pointToValue(event);
    const startDistance = Math.abs(value - normalizedRange.value.start);
    const endDistance = Math.abs(value - normalizedRange.value.end);
    startDragging(startDistance <= endDistance ? "start" : "end", event);
}

function handleRangeHandlePointerDown(handle: "start" | "end", event: PointerEvent) {
    if (isControlRange.value) startDragging(handle, event);
}

onBeforeUnmount(stopDragging);
</script>
