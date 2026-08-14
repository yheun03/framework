<template>
    <div class="app-progress-slider" :class="[
        `app-progress-slider--${mode}`,
        { 'app-progress-slider--disabled': disabled },
    ]">
        <label v-if="mode === 'single'" class="app-progress-slider__control">
            <span v-if="label" class="app-progress-slider__label">{{ label }}</span>
            <input class="app-progress-slider__range" type="range" min="0" max="100" :value="value"
                :disabled="disabled" @input="updateValue" />
            <span v-if="showValue" class="app-progress-slider__value">{{ value }}%</span>
        </label>

        <div v-else class="app-progress-slider__control">
            <span v-if="label" class="app-progress-slider__label">{{ label }}</span>
            <label>
                <span class="app-progress-slider__value">시작 {{ range.start }}%</span>
                <input class="app-progress-slider__range" type="range" min="0" max="100" :value="range.start"
                    :disabled="disabled" @input="updateRange('start', $event)" />
            </label>
            <label>
                <span class="app-progress-slider__value">종료 {{ range.end }}%</span>
                <input class="app-progress-slider__range" type="range" min="0" max="100" :value="range.end"
                    :disabled="disabled" @input="updateRange('end', $event)" />
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProgressRange } from "~/utils/progress";

const props = withDefaults(defineProps<{
    value?: number;
    range?: ProgressRange;
    mode?: "single" | "range";
    label?: string;
    disabled?: boolean;
    showValue?: boolean;
}>(), {
    value: 0,
    range: () => ({ start: 0, end: 100 }),
    mode: "single",
    disabled: false,
    showValue: false,
});

const emit = defineEmits<{
    "update:value": [number];
    "update:range": [ProgressRange];
}>();

function updateValue(event: Event) {
    emit("update:value", Number((event.target as HTMLInputElement).value));
}

function updateRange(key: "start" | "end", event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    emit("update:range", {
        ...props.range,
        [key]: key === "start" ? Math.min(value, props.range.end) : Math.max(value, props.range.start),
    });
}
</script>
