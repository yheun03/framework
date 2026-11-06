<template>
    <AppProgressSlider
        v-if="isControlType"
        :value="singleValue"
        :range="normalizedRange"
        :type="sliderType"
        :label="label"
        :show-value="showValue"
        :disabled="disabled"
        @update:value="handleValueUpdate"
        @update:range="handleRangeUpdate"
    />

    <AppProgressBar v-else :value="singleValue" :range="range" :label="label" :show-value="showValue" :disabled="disabled" />
</template>

<script setup>
import { normalizeProgressRange, normalizeProgressValue } from '@/utils/progress';
import { computed } from 'vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppProgressSlider from '@/components/AppProgress/AppProgressSlider.vue';

const props = defineProps({
    value: { type: Number, required: true },
    range: { type: Object },
    rangeSelectable: { type: Boolean, default: false },
    type: { type: String, default: 'display' },
    label: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    variant: { type: String, default: 'linear' },
    showValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:range', 'update:value']);

const singleValue = computed(() => normalizeProgressValue(props.value));
const normalizedRange = computed(() => normalizeProgressRange(props.range));

const isSingleControl = computed(() => {
    return props.variant === 'linear' && props.type === 'control-single';
});

const isRangeControl = computed(() => {
    return props.variant === 'linear' && !!props.range && (props.type === 'control-range' || props.rangeSelectable);
});

const isControlType = computed(() => isSingleControl.value || isRangeControl.value);
const sliderType = computed(() => (isRangeControl.value ? 'range' : 'single'));

function handleValueUpdate(value) {
    emit('update:value', value);
}

function handleRangeUpdate(value) {
    emit('update:range', value);
}
</script>
