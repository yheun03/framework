<template>
    <div class="app-form-field" :class="{
        'is-required': required,
        'is-disabled': disabled,
        'is-error': error,
    }">
        <div v-if="label || $slots.label" class="app-form-field__head">
            <label v-if="label" class="app-form-field__label" :for="props.for">
                {{ label }}
                <span v-if="required" class="app-form-field__required" aria-hidden="true">*</span>
            </label>
            <slot v-else name="label" />
            <span v-if="optionalText && !required" class="app-form-field__optional">{{ optionalText }}</span>
        </div>

        <p v-if="description" class="app-form-field__description">{{ description }}</p>

        <div class="app-form-field__control">
            <slot :id="props.for" :disabled="disabled" :invalid="Boolean(error)" />
        </div>

        <p v-if="error" class="app-form-field__message app-form-field__message--error">
            {{ typeof error === "string" ? error : "입력값을 확인해주세요." }}
        </p>
        <p v-else-if="hint" class="app-form-field__message app-form-field__message--hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    label?: string;
    for?: string;
    required?: boolean;
    disabled?: boolean;
    description?: string;
    hint?: string;
    error?: string | boolean | null;
    optionalText?: string;
}>(), {
    label: "",
    for: "",
    required: false,
    disabled: false,
    description: "",
    hint: "",
    error: null,
    optionalText: "선택",
});
</script>
