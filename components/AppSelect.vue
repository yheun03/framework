<template>
    <div :class="[
        'form-field',
        'app-select',
        `app-select--${size}`,
        `app-select--shape-${shape}`,
        {
            'app-select--open': isOpen,
            'is-readonly': readonly,
            'is-disabled': disabled,
            [`is-${state}`]: state,
        },
    ]" ref="rootEl">
        <label v-if="label" class="form-field__label app-select__label" :for="selectId">
            {{ label }}
        </label>

        <div class="form-field__control app-select__control">
            <component :is="'button'" :id="selectId" class="app-select__trigger" type="button" :name="name"
                :disabled="disabled" :aria-invalid="state === 'error'" :aria-describedby="describedBy"
                :aria-expanded="isOpen" :aria-readonly="readonly || undefined" aria-haspopup="listbox"
                @click="handleToggle">
                <span class="app-select__value" :class="{ 'app-select__value--placeholder': !selectedOption }"
                    v-html="selectedOption?.label ?? placeholder" />

                <span class="app-select__icon app-select__icon--right" aria-hidden="true">
                    <slot name="iconRight">
                        <Icon icon="mdi:chevron-down" />
                    </slot>
                </span>
            </component>

            <Teleport to="body">
                <ul v-if="isOpen" ref="menuEl" class="app-select__menu" :style="menuStyle" role="listbox"
                    @mousedown.stop>
                    <li v-if="placeholder && !required" class="app-select__option"
                        :class="{ 'is-selected': modelValue === null }" role="option"
                        :aria-selected="modelValue === null" @click="handleSelectValue(null)" v-html="placeholder" />

                    <li v-for="opt in options" :key="getOptionKey(opt)" class="app-select__option" :class="{
                        'is-selected': modelValue === opt.value,
                        'is-disabled': !!opt.disabled,
                    }" role="option" :aria-selected="modelValue === opt.value" @click="handleSelectValue(opt)"
                        v-html="opt.label" />
                </ul>
            </Teleport>
        </div>

        <p v-if="hint" class="form-field__hint app-select__hint" :id="hintId">
            {{ hint }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const APP_SELECT_CLOSE_ALL_EVENT = "app-select:close-all";
const SELECT_MENU_GAP = 8;

export type AppSelectOption = {
    value: string | number | boolean | null;
    label: string;
    disabled?: boolean;
};

type SelectSize = "xs" | "sm" | "md" | "lg";
type SelectShape = "square" | "round" | "pill" | "underline";
type SelectState = "error" | "warning" | "success" | null;

const props = withDefaults(
    defineProps<{
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
    }>(),
    {
        size: "md",
        shape: "round",
        state: null,
        placeholder: "선택하세요",
        required: false,
        disabled: false,
        readonly: false,
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string | number | boolean | null): void;
    (e: "change", ev: Event): void;
}>();

const fallbackId = useId();
const rootEl = ref<HTMLElement | null>(null);
const menuEl = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const menuStyle = ref<Record<string, string>>({});

const selectId = computed(() => props.id ?? `app-select-${fallbackId}`);
const hintId = computed(() => `hint-${selectId.value}`);
const describedBy = computed(() => (props.hint ? hintId.value : undefined));
const selectedOption = computed(
    () => props.options.find((opt) => opt.value === props.modelValue) ?? null,
);

function getOptionKey(option: AppSelectOption) {
    return `option-${String(option.value)}`;
}

async function handleToggle() {
    if (props.disabled || props.readonly) return;

    if (isOpen.value) {
        close();
        return;
    }

    isOpen.value = true;
    await nextTick();
    updateMenuPosition();
}

function close() {
    isOpen.value = false;
    menuStyle.value = {};
}

function updateMenuPosition() {
    const trigger = rootEl.value?.querySelector<HTMLElement>(".app-select__trigger");
    const rect = trigger?.getBoundingClientRect();
    if (!rect) return;

    menuStyle.value = {
        top: `${rect.bottom + SELECT_MENU_GAP}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
    };
}

function handleSelectValue(option: AppSelectOption | null) {
    if (props.disabled || props.readonly) return;
    if (option?.disabled) return;

    emit("update:modelValue", option ? option.value : null);
    emit("change", new Event("change"));
    close();
}

function handleDocumentClick(e: MouseEvent) {
    if (!isOpen.value) return;

    const target = e.target as Node;
    if (rootEl.value?.contains(target) || menuEl.value?.contains(target)) return;

    close();
}

function handleDocumentKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
}

function handleCloseAll() {
    close();
}

function handleDocumentScroll() {
    if (isOpen.value) close();
}

onMounted(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleDocumentKeydown);
    window.addEventListener("scroll", handleDocumentScroll, true);
    window.addEventListener("resize", handleDocumentScroll);
    window.addEventListener(APP_SELECT_CLOSE_ALL_EVENT, handleCloseAll);
});

onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handleDocumentClick);
    document.removeEventListener("keydown", handleDocumentKeydown);
    window.removeEventListener("scroll", handleDocumentScroll, true);
    window.removeEventListener("resize", handleDocumentScroll);
    window.removeEventListener(APP_SELECT_CLOSE_ALL_EVENT, handleCloseAll);
});
</script>
