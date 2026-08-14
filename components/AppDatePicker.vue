<template>
    <div class="form-field app-date-picker" :class="[
        `app-date-picker--${size}`,
        `app-date-picker--shape-${shape}`,
        {
            'is-readonly': readonly,
            'is-disabled': disabled,
            [`is-${state}`]: state,
        },
    ]">
        <label v-if="label" class="form-field__label app-date-picker__label" :for="id">{{ label }}</label>

        <div v-if="mode === 'range'" class="form-field__control app-date-picker__control">
            <input :id="id" class="app-date-picker__field" type="date" :value="rangeValue.start ?? ''"
                :min="min" :max="max" :disabled="disabled" :readonly="readonly"
                @input="updateRange('start', $event)" />
            <span aria-hidden="true">~</span>
            <input class="app-date-picker__field" type="date" :value="rangeValue.end ?? ''" :min="min" :max="max"
                :disabled="disabled" :readonly="readonly" @input="updateRange('end', $event)" />
        </div>

        <div v-else class="form-field__control app-date-picker__control">
            <input :id="id" class="app-date-picker__field" type="date" :value="inputValue" :min="min" :max="max"
                :disabled="disabled" :readonly="readonly" :aria-invalid="state === 'error'" @input="updateValue" />

            <span v-if="$slots.iconRight" class="app-date-picker__icon app-date-picker__icon--right">
                <slot name="iconRight" />
            </span>
        </div>

        <p v-if="hint" class="form-field__hint app-date-picker__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
export type DateRangeValue = {
    start: string | null;
    end: string | null;
};

type DatePickerMode = "single" | "range" | "multiple";
type DatePickerSize = "xs" | "sm" | "md" | "lg";
type DatePickerShape = "square" | "round" | "pill" | "underline";
type DatePickerState = "error" | "warning" | "success" | null;

const props = withDefaults(defineProps<{
    modelValue: string | DateRangeValue | string[] | null | undefined;
    label?: string;
    hint?: string;
    placeholder?: string;
    mode?: DatePickerMode;
    min?: string;
    max?: string;
    disabled?: boolean;
    readonly?: boolean;
    id?: string;
    size?: DatePickerSize;
    shape?: DatePickerShape;
    state?: DatePickerState;
}>(), {
    mode: "single",
    placeholder: "날짜 선택",
    disabled: false,
    readonly: false,
    size: "md",
    shape: "round",
    state: null,
});

const emit = defineEmits<{
    "update:modelValue": [string | DateRangeValue | string[] | null];
}>();

const rangeValue = computed<DateRangeValue>(() =>
    props.mode === "range" && props.modelValue && !Array.isArray(props.modelValue) && typeof props.modelValue !== "string"
        ? props.modelValue
        : { start: null, end: null },
);
const inputValue = computed(() => Array.isArray(props.modelValue) ? (props.modelValue[0] ?? "") : String(props.modelValue ?? ""));

function updateValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    emit("update:modelValue", props.mode === "multiple" ? (value ? [value] : []) : (value || null));
}

function updateRange(key: "start" | "end", event: Event) {
    emit("update:modelValue", {
        ...rangeValue.value,
        [key]: (event.target as HTMLInputElement).value || null,
    });
}
</script>
