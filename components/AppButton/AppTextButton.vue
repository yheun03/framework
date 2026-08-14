<template>
    <NuxtLink v-if="to" :to="to" :class="buttonClasses" :style="{ width, height }" @click="handleClick">
        <span v-if="loading" class="app-text-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-text-button__icon app-text-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-text-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-text-button__icon app-text-button__icon--right"><slot name="iconRight" /></i>
    </NuxtLink>

    <a v-else-if="href" :href="isDisabled ? undefined : href" :target="newTab ? '_blank' : undefined"
        :rel="newTab ? 'noopener noreferrer' : undefined" :class="buttonClasses" :style="{ width, height }"
        @click="handleClick">
        <span v-if="loading" class="app-text-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-text-button__icon app-text-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-text-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-text-button__icon app-text-button__icon--right"><slot name="iconRight" /></i>
    </a>

    <button v-else :type="type" :class="buttonClasses" :style="{ width, height }" :disabled="isDisabled"
        @click="handleClick">
        <span v-if="loading" class="app-text-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-text-button__icon app-text-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-text-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-text-button__icon app-text-button__icon--right"><slot name="iconRight" /></i>
    </button>
</template>

<script setup lang="ts">
type TextButtonType = "button" | "submit" | "reset";
type TextButtonVariant = "text" | "underline";
type TextButtonTone = "primary" | "secondary" | "gray" | "danger" | "warning" | "success" | "info";
type TextButtonSize = "sm" | "md" | "lg";

const props = withDefaults(defineProps<{
    type?: TextButtonType;
    to?: string;
    href?: string;
    newTab?: boolean;
    variant?: TextButtonVariant;
    tone?: TextButtonTone;
    size?: TextButtonSize;
    width?: string | number;
    height?: string | number;
    disabled?: boolean;
    loading?: boolean;
}>(), {
    type: "button",
    variant: "text",
    tone: "gray",
    size: "md",
    disabled: false,
    loading: false,
});

const emit = defineEmits<{ click: [MouseEvent] }>();
const isDisabled = computed(() => props.disabled || props.loading);
const buttonClasses = computed(() => [
    "app-text-button",
    `app-text-button--variant-${props.variant}`,
    `app-text-button--size-${props.size}`,
    `app-text-button--tone-${props.tone}`,
    {
        "app-text-button--disabled": isDisabled.value,
        "app-text-button--loading": props.loading,
    },
]);

function handleClick(event: MouseEvent) {
    if (isDisabled.value) {
        event.preventDefault();
        return;
    }

    emit("click", event);
}
</script>
