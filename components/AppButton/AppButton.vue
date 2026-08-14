<template>
    <NuxtLink v-if="to" :to="to" :class="buttonClasses" :style="{ width, height }"
        :aria-disabled="isDisabled || undefined" :tabindex="isDisabled ? -1 : undefined" @click="handleClick">
        <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-button__icon app-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-button__icon app-button__icon--right"><slot name="iconRight" /></i>
    </NuxtLink>

    <a v-else-if="href" :href="isDisabled ? undefined : href" :target="newTab ? '_blank' : undefined"
        :rel="newTab ? 'noopener noreferrer' : undefined" :class="buttonClasses" :style="{ width, height }"
        :aria-disabled="isDisabled || undefined" :tabindex="isDisabled ? -1 : undefined" @click="handleClick">
        <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-button__icon app-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-button__icon app-button__icon--right"><slot name="iconRight" /></i>
    </a>

    <button v-else :type="type" :class="buttonClasses" :style="{ width, height }" :disabled="isDisabled"
        :aria-busy="loading || undefined" @click="handleClick">
        <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-button__icon app-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-button__icon app-button__icon--right"><slot name="iconRight" /></i>
    </button>
</template>

<script setup lang="ts">
type ButtonType = "button" | "submit" | "reset";
type ButtonVariant = "fill" | "outline";
type ButtonShape = "square" | "round" | "pill";
type ButtonTone = "primary" | "secondary" | "gray" | "danger" | "warning" | "success" | "info";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

const props = withDefaults(defineProps<{
    type?: ButtonType;
    to?: string;
    href?: string;
    newTab?: boolean;
    variant?: ButtonVariant;
    shape?: ButtonShape;
    tone?: ButtonTone;
    size?: ButtonSize;
    width?: string | number;
    height?: string | number;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
    unstyled?: boolean;
}>(), {
    type: "button",
    variant: "outline",
    shape: "round",
    tone: "gray",
    size: "md",
    disabled: false,
    loading: false,
    block: false,
    unstyled: false,
});

const emit = defineEmits<{ click: [MouseEvent] }>();
const isDisabled = computed(() => props.disabled || props.loading);
const buttonClasses = computed(() => props.unstyled ? "app-button-unstyled" : [
    "app-button",
    `app-button--variant-${props.variant}`,
    `app-button--shape-${props.shape}`,
    `app-button--size-${props.size}`,
    `app-button--tone-${props.tone}`,
    {
        "app-button--disabled": isDisabled.value,
        "app-button--loading": props.loading,
        "app-button--block": props.block,
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
