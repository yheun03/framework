<template>
    <div class="app-textarea" :class="[
        `app-textarea--${size}`,
        `app-textarea--resize-${resize}`,
        {
            'is-focused': isFocused,
            'is-disabled': disabled,
            'is-readonly': readonly,
            'is-error': invalid || Boolean(error),
        },
    ]">
        <textarea :id="id" class="app-textarea__control" :value="modelValue" :placeholder="placeholder"
            :disabled="disabled" :readonly="readonly" :rows="rows" :maxlength="maxLength"
            :aria-invalid="invalid || Boolean(error)" :aria-describedby="ariaDescribedby" @input="handleInput"
            @focus="isFocused = true" @blur="isFocused = false" />

        <div v-if="showCount || clearable" class="app-textarea__footer">
            <AppButton v-if="clearable && modelValue && !disabled && !readonly" unstyled type="button"
                class="app-textarea__clear" @click="handleClear">
                지우기
            </AppButton>

            <span v-if="showCount" class="app-textarea__count">
                {{ textLength }}<template v-if="maxLength"> / {{ maxLength }}</template>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
type AppTextareaSize = "sm" | "md" | "lg";
type AppTextareaResize = "none" | "vertical" | "horizontal" | "both";

const props = withDefaults(
    defineProps<{
        modelValue?: string | number | null;
        id?: string;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        rows?: number;
        maxLength?: number;
        showCount?: boolean;
        clearable?: boolean;
        invalid?: boolean;
        error?: string | boolean | null;
        size?: AppTextareaSize;
        resize?: AppTextareaResize;
        ariaDescribedby?: string;
    }>(),
    {
        modelValue: "",
        id: undefined,
        placeholder: "",
        disabled: false,
        readonly: false,
        rows: 4,
        maxLength: undefined,
        showCount: false,
        clearable: false,
        invalid: false,
        error: null,
        size: "md",
        resize: "vertical",
        ariaDescribedby: undefined,
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "input", value: string): void;
    (e: "clear"): void;
}>();

const isFocused = ref(false);

const textLength = computed(() => String(props.modelValue ?? "").length);

function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    emit("update:modelValue", value);
    emit("input", value);
}

function handleClear() {
    emit("update:modelValue", "");
    emit("clear");
}
</script>
