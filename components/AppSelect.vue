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
        <label v-if="label" class="form-field__label app-select__label" :for="inputId">{{ label }}</label>

        <div class="form-field__control app-select__control">
            <input v-if="name" type="hidden" :name="name" :value="String(modelValue ?? '')" />
            <button :id="inputId" ref="triggerEl" type="button" class="app-select__trigger" :disabled="disabled"
                :aria-expanded="isOpen" :aria-readonly="readonly || undefined" aria-haspopup="listbox"
                :aria-controls="isOpen ? menuId : undefined" @click="toggleMenu" @keydown.esc="closeMenu">
                <span class="app-select__value" :class="{ 'app-select__value--placeholder': !selectedOption }">
                    {{ selectedOption?.label ?? placeholder }}
                </span>
                <span class="app-select__icon app-select__icon--right" aria-hidden="true">
                    <slot name="iconRight"><IconChevronDown /></slot>
                </span>
            </button>
        </div>

        <Teleport to="body">
            <ul v-if="isOpen" :id="menuId" ref="menuEl" class="app-select__menu"
                :class="`app-select__menu--${size}`" :style="menuStyle" role="listbox">
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
        </Teleport>

        <p v-if="hint" class="form-field__hint app-select__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import { IconChevronDown } from "~/components/icons";
import { getBodyOverlayStyle, useBodyOverlay } from "~/composables/useBodyOverlay";

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

const fallbackId = useId();
const inputId = computed(() => props.id ?? `app-select-${fallbackId}`);
const menuId = computed(() => `${inputId.value}-menu`);
const isOpen = ref(false);
const triggerEl = ref<HTMLElement | null>(null);
const menuEl = ref<HTMLElement | null>(null);
const menuStyle = ref<Record<string, string>>({});
const selectedOption = computed(() => props.options.find((option) => option.value === props.modelValue));
const overlay = useBodyOverlay({
    trigger: () => triggerEl.value,
    overlay: () => menuEl.value,
    close: closeMenu,
});

async function toggleMenu() {
    if (props.readonly) return;
    if (isOpen.value) {
        closeMenu();
        return;
    }

    isOpen.value = true;
    await nextTick();

    if (triggerEl.value && menuEl.value) {
        menuStyle.value = getBodyOverlayStyle(triggerEl.value, menuEl.value);
    }
    overlay.start();
}

function closeMenu() {
    overlay.stop();
    isOpen.value = false;
}

function selectOption(option: AppSelectOption | null) {
    emit("update:modelValue", option?.value ?? null);
    emit("change", new Event("change"));
    closeMenu();
}
</script>
