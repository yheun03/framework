<template>
    <div class="form-field app-select" :class="[
        `app-select--${size}`,
        `app-select--shape-${shape}`,
        {
            'app-select--open': isOpen,
            'is-readonly': readonly,
            'is-disabled': disabled,
            [`is-${state}`]: state,
        },
    ]">
        <label v-if="label" class="form-field__label app-select__label" :for="id">{{ label }}</label>

        <div class="form-field__control app-select__control">
            <input v-if="name" type="hidden" :name="name" :value="String(modelValue ?? '')" />
            <button :id="id" type="button" class="app-select__trigger" :disabled="disabled"
                :aria-expanded="isOpen" :aria-readonly="readonly || undefined" aria-haspopup="listbox"
                @click="toggleMenu" @keydown.esc="isOpen = false">
                <span class="app-select__value" :class="{ 'app-select__value--placeholder': !selectedOption }">
                    {{ selectedOption?.label ?? placeholder }}
                </span>
                <span class="app-select__icon app-select__icon--right" aria-hidden="true">
                    <slot name="iconRight"><IconChevronDown /></slot>
                </span>
            </button>

            <ul v-if="isOpen" class="app-select__menu" role="listbox">
                <li v-if="placeholder && !required" class="app-select__option-item">
                    <button type="button" class="app-select__option" :class="{ 'is-selected': modelValue === null }"
                        role="option" :aria-selected="modelValue === null" @click="selectOption(null)">
                        {{ placeholder }}
                    </button>
                </li>
                <li v-for="option in options" :key="String(option.value)" class="app-select__option-item">
                    <button type="button" class="app-select__option" :class="{
                        'is-selected': modelValue === option.value,
                        'is-disabled': option.disabled,
                    }" role="option" :aria-selected="modelValue === option.value" :disabled="option.disabled"
                        @click="selectOption(option)">
                        {{ option.label }}
                    </button>
                </li>
            </ul>
        </div>

        <p v-if="hint" class="form-field__hint app-select__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import { IconChevronDown } from "~/components/icons";

export type AppSelectOption = {
    value: string | number | boolean | null;
    label: string;
    disabled?: boolean;
};

type SelectSize = "xs" | "sm" | "md" | "lg";
type SelectShape = "square" | "round" | "pill" | "underline";
type SelectState = "error" | "warning" | "success" | null;

const props = withDefaults(defineProps<{
    modelValue: string | number | boolean | null;
    options: AppSelectOption[];
    label?: string;
    hint?: string;
    placeholder?: string;
    required?: boolean;
    size?: SelectSize;
    shape?: SelectShape;
    state?: SelectState;
    disabled?: boolean;
    readonly?: boolean;
    id?: string;
    name?: string;
}>(), {
    placeholder: "선택하세요",
    required: false,
    size: "md",
    shape: "round",
    state: null,
    disabled: false,
    readonly: false,
});

const emit = defineEmits<{
    "update:modelValue": [string | number | boolean | null];
    change: [Event];
}>();

const isOpen = ref(false);
const selectedOption = computed(() => props.options.find((option) => option.value === props.modelValue));

function toggleMenu() {
    if (props.readonly) return;
    isOpen.value = !isOpen.value;
}

function selectOption(option: AppSelectOption | null) {
    emit("update:modelValue", option?.value ?? null);
    emit("change", new Event("change"));
    isOpen.value = false;
}
</script>
