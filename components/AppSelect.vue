<template>
    <div
        class="form-field app-select"
        :class="[
            `app-select--${size}`,
            `app-select--shape-${shape}`,
            {
                'app-select--open': isOpen,
                'is-readonly': readonly,
                'is-disabled': disabled,
                [`is-${state}`]: state,
            },
        ]"
        :style="rootStyle"
    >
        <label v-if="label" class="form-field__label app-select__label" :for="inputId">{{ label }}</label>

        <div class="form-field__control app-select__control">
            <input v-if="name" type="hidden" :name="name" :value="String(modelValue ?? '')" />
            <button
                :id="inputId"
                ref="triggerEl"
                type="button"
                class="app-select__trigger"
                :disabled="disabled"
                :aria-expanded="isOpen"
                :aria-readonly="readonly || undefined"
                aria-haspopup="listbox"
                :aria-controls="isOpen ? menuId : undefined"
                @click="toggleMenu"
                @keydown.esc="closeMenu"
            >
                <span class="app-select__value" :class="{ 'app-select__value--placeholder': !selectedOption }">
                    <img v-if="selectedOption?.image" class="app-select__thumb" :src="selectedOption.image" alt="" />
                    <span class="app-select__value-text">
                        <span class="app-select__value-label">{{ selectedOption?.label ?? placeholder }}</span>
                        <span v-if="selectedOption?.description" class="app-select__value-desc">{{ selectedOption.description }}</span>
                    </span>
                </span>
                <span class="app-select__icon app-select__icon--right" aria-hidden="true">
                    <slot name="iconRight"><IconChevronDown /></slot>
                </span>
            </button>
        </div>

        <Teleport to="body">
            <ul
                v-if="isOpen"
                :id="menuId"
                ref="menuEl"
                class="app-select__menu"
                :class="`app-select__menu--${size}`"
                :style="menuStyle"
                role="listbox"
            >
                <li v-if="placeholder && !required" class="app-select__option-item">
                    <button
                        type="button"
                        class="app-select__option"
                        :class="{ 'is-selected': modelValue === null }"
                        role="option"
                        :aria-selected="modelValue === null"
                        @click="selectOption(null)"
                    >
                        {{ placeholder }}
                    </button>
                </li>
                <li v-for="option in items" :key="String(option.value)" class="app-select__option-item">
                    <button
                        type="button"
                        class="app-select__option"
                        :class="{
                            'is-selected': modelValue === option.value,
                            'is-disabled': option.disabled,
                        }"
                        role="option"
                        :aria-selected="modelValue === option.value"
                        :disabled="option.disabled"
                        @click="selectOption(option)"
                    >
                        <img v-if="option.image" class="app-select__thumb" :src="option.image" alt="" />
                        <span class="app-select__option-text">
                            <span class="app-select__option-label">{{ option.label }}</span>
                            <span v-if="option.description" class="app-select__option-desc">{{ option.description }}</span>
                        </span>
                    </button>
                </li>
            </ul>
        </Teleport>

        <p v-if="hint" class="form-field__hint app-select__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import { IconChevronDown } from '~/components/icons';
import { getBodyOverlayStyle, useBodyOverlay } from '~/composables/useBodyOverlay';

import type { AppFieldShape, AppFormSize, AppOptionItem, AppState, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

/** value, label, description?, image?, disabled? */
export type AppSelectOption = AppOptionItem;

const props = withDefaults(
    defineProps<{
        modelValue: string | number | boolean | null;
        items: AppSelectOption[];
        label?: string;
        hint?: string;
        placeholder?: string;
        required?: boolean;
        size?: AppFormSize;
        shape?: AppFieldShape;
        state?: AppState;
        /** number(px) | '50%' | 'full' */
        width?: AppWidth;
        disabled?: boolean;
        readonly?: boolean;
        id?: string;
        name?: string;
    }>(),
    {
        placeholder: '선택하세요',
        required: false,
        size: 'md',
        shape: 'round',
        state: null,
        disabled: false,
        readonly: false,
    },
);

const emit = defineEmits<{
    'update:modelValue': [string | number | boolean | null];
    change: [Event];
}>();

const fallbackId = useId();
const inputId = computed(() => props.id ?? `app-select-${fallbackId}`);
const menuId = computed(() => `${inputId.value}-menu`);
const isOpen = ref(false);
const triggerEl = ref<HTMLElement | null>(null);
const menuEl = ref<HTMLElement | null>(null);
const menuStyle = ref<Record<string, string>>({});
const rootStyle = computed(() => toSizeStyle(props.width));
const selectedOption = computed(() => props.items.find((option) => option.value === props.modelValue));
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
    emit('update:modelValue', option?.value ?? null);
    emit('change', new Event('change'));
    closeMenu();
}
</script>
