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
                :aria-disabled="readonly || undefined"
                :aria-label="label ? undefined : (ariaLabel ?? inputGroupLabel ?? undefined)"
                aria-haspopup="listbox"
                :aria-controls="isOpen ? menuId : undefined"
                @click="toggleMenu"
                @keydown.esc="closeMenu"
            >
                <span class="app-select__value" :class="{ 'app-select__value--placeholder': !selectedOption }">
                    <img v-if="selectedOption?.image" class="app-select__thumb" :src="selectedOption.image" alt="" />
                    <span class="app-select__value-text">
                        <span class="app-select__value-label">{{ selectedOption?.label ?? placeholderText }}</span>
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
                <li v-if="placeholderText && !required" class="app-select__option-item">
                    <button
                        type="button"
                        class="app-select__option"
                        :class="{ 'is-selected': modelValue === null }"
                        role="option"
                        :aria-selected="modelValue === null"
                        @click="selectOption(null)"
                    >
                        {{ placeholderText }}
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

<script setup>
import { useLabelWarning } from '@/utils/a11y';
import i18n from '@/i18n';
import { FORM_SHAPES, FORM_SIZES, STATES, oneOf } from '@/utils/props';
import { APP_FORM_FIELD_KEY } from '@/components/AppFormField.vue';
import { APP_INPUT_GROUP_KEY } from '@/components/AppInputGroup.vue';
import { IconChevronDown } from '@/components/icons';
import { getBodyOverlayStyle, useBodyOverlay } from '@/composables/useBodyOverlay';

import { toSizeStyle } from '@/utils/css';
import { computed, inject, nextTick, onDeactivated, ref, useId } from 'vue';

/** value, label, description?, image?, disabled? */

const props = defineProps({
    modelValue: { type: [String, Number, Boolean, null], required: true },
    items: { type: Array, required: true },
    label: { type: String },
    hint: { type: String },
    /** 기본 '선택하세요' (i18n ui.selectPlaceholder). 빈 문자열이면 '선택 안 함' 항목을 숨김 */
    placeholder: { type: String, default: undefined },
    required: { type: Boolean, default: false },
    size: { type: String, default: 'md', validator: oneOf(FORM_SIZES) },
    shape: { type: String, default: 'round', validator: oneOf(FORM_SHAPES) },
    state: { type: [String, null], default: null, validator: oneOf(STATES) },
    /** number(px) | '50%' | 'full' */
    width: { type: [Number, String] },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    id: { type: String },
    /** label 이 없을 때 스크린리더용 이름 */
    ariaLabel: { type: String },
    name: { type: String },
});

const emit = defineEmits(['update:modelValue', 'change']);

const fallbackId = useId();
const formField = inject(APP_FORM_FIELD_KEY, null);
const inputGroupLabel = inject(APP_INPUT_GROUP_KEY, null);
const inputId = computed(() => props.id ?? formField?.id.value ?? `app-select-${fallbackId}`);
const menuId = computed(() => `${inputId.value}-menu`);
const placeholderText = computed(() => props.placeholder ?? i18n.global.t('ui.selectPlaceholder'));

useLabelWarning('AppSelect', () => triggerEl.value);
const isOpen = ref(false);
const triggerEl = ref(null);
const menuEl = ref(null);
const menuStyle = ref({});
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

// 탭 전환(KeepAlive)으로 화면이 숨겨지면 목록을 닫습니다.
onDeactivated(() => {
    if (isOpen.value) closeMenu();
});

function selectOption(option) {
    emit('update:modelValue', option?.value ?? null);
    emit('change', new Event('change'));
    closeMenu();
}
</script>
