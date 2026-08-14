<template>
    <div class="form-field app-input" :class="[
        `app-input--${size}`,
        `app-input--shape-${shape}`,
        {
            'app-input--icon-left': $slots.iconLeft,
            'app-input--icon-right': $slots.iconRight || clearable || passwordToggle,
            'is-disabled': disabled,
            [`is-${state}`]: state,
        },
    ]">
        <label v-if="label" class="form-field__label app-input__label" :for="id">{{ label }}</label>

        <div class="form-field__control app-input__control">
            <span v-if="$slots.iconLeft" class="app-input__icon app-input__icon--left">
                <slot name="iconLeft" />
            </span>

            <input :id="id" class="app-input__field" :type="inputType" :value="modelValue ?? ''"
                :placeholder="placeholder" :name="name" :autocomplete="autocomplete" :disabled="disabled"
                :readonly="readonly" :aria-invalid="state === 'error'" @input="handleInput" />

            <AppIconButton v-if="clearable && modelValue" class="app-input__icon app-input__icon--right"
                aria-label="입력값 지우기" @click="emit('update:modelValue', '')">
                <IconClose />
            </AppIconButton>

            <AppIconButton v-if="passwordToggle" class="app-input__icon app-input__icon--right"
                aria-label="비밀번호 표시 전환" @click="showPassword = !showPassword">
                <IconEyeOff v-if="showPassword" />
                <IconEye v-else />
            </AppIconButton>

            <span v-if="$slots.iconRight" class="app-input__icon app-input__icon--right">
                <slot name="iconRight" />
            </span>
        </div>

        <p v-if="hint" class="form-field__hint app-input__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import { IconClose, IconEye, IconEyeOff } from "~/components/icons";

type InputSize = "xs" | "sm" | "md" | "lg";
type InputShape = "square" | "round" | "pill" | "underline";
type InputState = "error" | "warning" | "success" | null;

const props = withDefaults(defineProps<{
    modelValue: string | number | null;
    label?: string;
    hint?: string;
    placeholder?: string;
    type?: string;
    size?: InputSize;
    shape?: InputShape;
    state?: InputState;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    passwordToggle?: boolean;
    id?: string;
    name?: string;
    autocomplete?: string;
}>(), {
    type: "text",
    size: "md",
    shape: "round",
    state: null,
    disabled: false,
    readonly: false,
    clearable: false,
    passwordToggle: false,
});

const emit = defineEmits<{ "update:modelValue": [string] }>();
const showPassword = ref(false);
const inputType = computed(() => props.passwordToggle ? (showPassword.value ? "text" : "password") : props.type);

function handleInput(event: Event) {
    emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>
