<template>
    <AppProgressSlider v-if="isControlType" :value="singleValue" :range="normalizedRange" :type="sliderType"
        :label="label" :show-value="showValue" :disabled="disabled" @update:value="handleValueUpdate"
        @update:range="handleRangeUpdate" />

    <AppProgressBar v-else :value="singleValue" :range="range" :label="label" :show-value="showValue"
        :disabled="disabled" />
</template>

<script setup lang="ts">
import {
    normalizeProgressRange,
    normalizeProgressValue,
    type ProgressRange,
} from "~/utils/progress";

type Variant = "linear";
type ProgressType = "display" | "control-single" | "control-range";

const props = withDefaults(
    defineProps<{
        value: number;
        range?: ProgressRange;
        rangeSelectable?: boolean;
        type?: ProgressType;
        label?: string;
        disabled?: boolean;
        variant?: Variant;
        showValue?: boolean;
    }>(),
    {
        variant: "linear",
        type: "display",
        showValue: false,
        rangeSelectable: false,
        label: undefined,
        disabled: false,
    },
);

const emit = defineEmits<{
    (e: "update:range", value: ProgressRange): void;
    (e: "update:value", value: number): void;
}>();

const singleValue = computed(() => normalizeProgressValue(props.value));
const normalizedRange = computed(() => normalizeProgressRange(props.range));

const isSingleControl = computed(() => {
    return props.variant === "linear" && props.type === "control-single";
});

const isRangeControl = computed(() => {
    return (
        props.variant === "linear" &&
        !!props.range &&
        (props.type === "control-range" || props.rangeSelectable)
    );
});

const isControlType = computed(
    () => isSingleControl.value || isRangeControl.value,
);
const sliderType = computed(() => (isRangeControl.value ? "range" : "single"));

function handleValueUpdate(value: number) {
    emit("update:value", value);
}

function handleRangeUpdate(value: ProgressRange) {
    emit("update:range", value);
}
</script>
