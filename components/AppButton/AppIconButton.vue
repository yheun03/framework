<template>
    <NuxtLink v-if="to" :to="to" :class="buttonClasses" :style="buttonStyle" :aria-label="ariaLabel">
        <slot />
    </NuxtLink>

    <a v-else-if="href" :href="href" :target="newTab ? '_blank' : undefined"
        :rel="newTab ? 'noopener noreferrer' : undefined" :class="buttonClasses" :style="buttonStyle"
        :aria-label="ariaLabel">
        <slot />
    </a>

    <button v-else :type="type" :class="buttonClasses" :style="buttonStyle" :aria-label="ariaLabel"
        :disabled="disabled" @click="$emit('click', $event)">
        <slot />
    </button>
</template>

<script setup lang="ts">
type IconButtonType = "button" | "submit" | "reset";
type IconButtonVariant = "plain" | "soft" | "outline";
type IconButtonShape = "square" | "round" | "pill";
type IconButtonTone = "primary" | "secondary" | "gray" | "danger" | "warning" | "success" | "info";
type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

const props = withDefaults(defineProps<{
    ariaLabel?: string;
    type?: IconButtonType;
    to?: string;
    href?: string;
    newTab?: boolean;
    variant?: IconButtonVariant;
    shape?: IconButtonShape;
    tone?: IconButtonTone;
    size?: IconButtonSize | number;
    iconSize?: IconButtonSize | number;
    width?: string | number;
    height?: string | number;
    disabled?: boolean;
}>(), {
    type: "button",
    variant: "plain",
    shape: "round",
    tone: "gray",
    size: "md",
    iconSize: "md",
    disabled: false,
});

defineEmits<{ click: [MouseEvent] }>();

const controlSizes = { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 };
const iconSizes = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 };
const toSize = (value: IconButtonSize | number, sizes: Record<IconButtonSize, number>) =>
    `${typeof value === "number" ? value : sizes[value]}px`;

const buttonClasses = computed(() => [
    "app-icon-button",
    `app-icon-button--variant-${props.variant}`,
    `app-icon-button--shape-${props.shape}`,
    `app-icon-button--tone-${props.tone}`,
    { "app-icon-button--disabled": props.disabled },
]);

const buttonStyle = computed(() => ({
    width: props.width,
    height: props.height,
    "--icon-button-size": toSize(props.size, controlSizes),
    "--icon-size": toSize(props.iconSize, iconSizes),
}));
</script>
