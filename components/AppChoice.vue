<template>
    <label :class="rootClasses">
        <span class="app-choice__control">
            <input :id="inputId" ref="inputRef" class="app-choice__input" :type="type" :name="name" :value="inputValue"
                :checked="isChecked" :disabled="disabled" :aria-invalid="state === 'error'"
                :aria-describedby="describedBy" :aria-readonly="readonly || undefined" @change="handleChange" />

            <span v-if="showIndicator" class="app-choice__visual" aria-hidden="true">
                <span v-if="isChecked || indeterminate" class="app-choice__inner">
                    <template v-if="type === 'checkbox'">
                        <Icon :icon="indeterminate ? 'mdi:minus' : 'mdi:check'" />
                    </template>
                    <template v-else>
                        <span class="app-choice__dot" />
                    </template>
                </span>
            </span>
        </span>

        <span v-if="hasBody" class="app-choice__body">
            <span v-if="label" class="app-choice__label">
                {{ label }}
            </span>

            <span v-if="hint" :id="hintId" class="app-choice__hint">
                {{ hint }}
            </span>
        </span>

        <span v-if="isToggleVariant && toggleText" class="app-choice__toggle-text">
            {{ toggleText }}
        </span>
    </label>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

type ChoiceType = "checkbox" | "radio";
type ChoiceVariant =
    | "default"
    | "round"
    | "chip"
    | "chip-outline"
    | "fill"
    | "ghost"
    | "toggle";
type ChoiceState = "error" | "warning" | "success" | null;
type ChoiceSize = "md" | "sm";
type ToggleLabels = {
    checked?: string;
    unchecked?: string;
};

const CHIP_VARIANTS: ChoiceVariant[] = [
    "chip",
    "chip-outline",
    "fill",
    "ghost",
    "toggle",
];

const props = withDefaults(
    defineProps<{
        type?: ChoiceType;
        modelValue: boolean | string | number | null;
        value?: string | number;
        name?: string;
        label?: string;
        hint?: string;
        toggleLabels?: ToggleLabels;
        disabled?: boolean;
        readonly?: boolean;
        indeterminate?: boolean;
        id?: string;
        variant?: ChoiceVariant;
        state?: ChoiceState;
        size?: ChoiceSize;
    }>(),
    {
        type: "checkbox",
        variant: "default",
        state: null,
        disabled: false,
        readonly: false,
        indeterminate: false,
        size: "md",
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean | string | number | null): void;
}>();

const fallbackId = useId();
const inputRef = ref<HTMLInputElement | null>(null);

const inputId = computed(() => props.id ?? `app-choice-${fallbackId}`);
const hintId = computed(() => `${inputId.value}-hint`);
const describedBy = computed(() => (props.hint ? hintId.value : undefined));

const isChipVariant = computed(() => CHIP_VARIANTS.includes(props.variant));
const isToggleVariant = computed(() => props.variant === "toggle");
const showIndicator = computed(() => !isChipVariant.value);
const hasBody = computed(() => Boolean(props.label || props.hint));
const inputValue = computed(() => props.value ?? "");

const isChecked = computed(() => {
    if (props.type === "checkbox") {
        return Boolean(props.modelValue);
    }

    return props.value !== undefined && props.modelValue === props.value;
});

const rootClasses = computed(() => [
    "app-choice",
    `app-choice--${props.type}`,
    `app-choice--${props.variant}`,
    `app-choice--${props.size}`,
    {
        "is-disabled": props.disabled,
        "is-readonly": props.readonly,
        "is-checked": isChecked.value,
        "is-indeterminate": props.indeterminate,
        [`is-${props.state}`]: props.state,
    },
]);

const toggleText = computed(() => {
    if (!isToggleVariant.value || props.label) return "";

    if (isChecked.value) return props.toggleLabels?.checked ?? "";
    return props.toggleLabels?.unchecked ?? "";
});

function handleChange(event: Event) {
    if (props.readonly) {
        event.preventDefault();
        return;
    }

    const target = event.target as HTMLInputElement;

    if (props.type === "checkbox") {
        emit("update:modelValue", target.checked);
        return;
    }

    emit("update:modelValue", props.value ?? target.value ?? null);
}

watch(
    () => props.indeterminate,
    (value) => {
        if (inputRef.value) {
            inputRef.value.indeterminate = value;
        }
    },
    { immediate: true },
);
</script>
