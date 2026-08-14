<template>
    <label class="app-choice" :class="[
        `app-choice--${type}`,
        `app-choice--${variant}`,
        `app-choice--${size}`,
        {
            'is-disabled': disabled,
            'is-readonly': readonly,
            'is-checked': isChecked,
            'is-indeterminate': indeterminate,
            [`is-${state}`]: state,
        },
    ]">
        <span class="app-choice__control">
            <input :id="id" class="app-choice__input" :type="type" :name="name" :value="value"
                :checked="isChecked" :disabled="disabled || readonly" :aria-invalid="state === 'error'"
                @change="handleChange" />

            <span v-if="!chipVariants.includes(variant)" class="app-choice__visual" aria-hidden="true">
                <span v-if="isChecked || indeterminate" class="app-choice__inner">
                    <IconMinus v-if="indeterminate" />
                    <IconCheck v-else-if="type === 'checkbox'" />
                    <span v-else class="app-choice__dot" />
                </span>
            </span>
        </span>

        <span v-if="label || hint" class="app-choice__body">
            <span v-if="label" class="app-choice__label">{{ label }}</span>
            <span v-if="hint" class="app-choice__hint">{{ hint }}</span>
        </span>

        <span v-if="variant === 'toggle' && !label" class="app-choice__toggle-text">
            {{ isChecked ? toggleLabels?.checked : toggleLabels?.unchecked }}
        </span>
    </label>
</template>

<script setup lang="ts">
import { IconCheck, IconMinus } from "~/components/icons";

type ChoiceType = "checkbox" | "radio";
type ChoiceVariant = "default" | "round" | "chip" | "chip-outline" | "fill" | "ghost" | "toggle";
type ChoiceState = "error" | "warning" | "success" | null;
type ChoiceSize = "sm" | "md";

const props = withDefaults(defineProps<{
    type?: ChoiceType;
    modelValue: boolean | string | number | null;
    value?: string | number;
    name?: string;
    label?: string;
    hint?: string;
    toggleLabels?: { checked?: string; unchecked?: string };
    disabled?: boolean;
    readonly?: boolean;
    indeterminate?: boolean;
    id?: string;
    variant?: ChoiceVariant;
    state?: ChoiceState;
    size?: ChoiceSize;
}>(), {
    type: "checkbox",
    variant: "default",
    state: null,
    disabled: false,
    readonly: false,
    indeterminate: false,
    size: "md",
});

const emit = defineEmits<{ "update:modelValue": [boolean | string | number | null] }>();
const chipVariants: ChoiceVariant[] = ["chip", "chip-outline", "fill", "ghost", "toggle"];
const isChecked = computed(() => props.type === "checkbox" ? Boolean(props.modelValue) : props.modelValue === props.value);

function handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    emit("update:modelValue", props.type === "checkbox" ? input.checked : (props.value ?? input.value));
}
</script>
