<template>
    <component ref="buttonEl" :is="tag" v-bind="componentAttrs" :class="classes" :style="mergedStyles"
        :aria-label="resolvedAriaLabel" :aria-disabled="ariaDisabled" :tabindex="tabIndex" @click="handleClick">
        <slot>
            <component :is="icon" v-if="icon" />
        </slot>
    </component>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { toCssSize, toSyncedSizeStyles, type CssSize } from "~/utils/css";
import { useButtonAction } from "~/composables/useButtonAction";

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrs();
const buttonEl = ref<HTMLElement | null>(null);

type IconButtonType = "button" | "submit" | "reset";
type IconButtonVariant = "plain" | "soft" | "outline";
type IconButtonShape = "square" | "round" | "pill";
type IconButtonTone =
    | "primary"
    | "secondary"
    | "gray"
    | "danger"
    | "warning"
    | "success"
    | "info";

type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

const props = withDefaults(
    defineProps<{
        icon?: Component;
        ariaLabel?: string;
        "aria-label"?: string;
        type?: IconButtonType;
        to?: string;
        href?: string;
        newTab?: boolean;
        variant?: IconButtonVariant;
        shape?: IconButtonShape;
        tone?: IconButtonTone;
        buttonSize?: IconButtonSize | number;
        iconSize?: IconButtonSize | number;
        width?: CssSize;
        height?: CssSize;
        disabled?: boolean;
    }>(),
    {
        type: "button",
        variant: "plain",
        shape: "round",
        tone: "gray",
        buttonSize: "md",
        iconSize: "md",
        width: undefined,
        height: undefined,
        newTab: false,
        disabled: false,
    },
);

const emit = defineEmits<{
    click: [MouseEvent];
}>();

const resolvedAriaLabel = computed(
    () =>
        props.ariaLabel ??
        props["aria-label"] ??
        (attrs["aria-label"] as string | undefined),
);

const { tag, componentAttrs, ariaDisabled, tabIndex, handleClick } =
    useButtonAction({
        attrs,
        type: () => props.type,
        to: () => props.to,
        href: () => props.href,
        newTab: () => props.newTab,
        disabled: () => props.disabled,
        onClick: (event) => emit("click", event),
    });

function sizeToCss(
    size: IconButtonSize | number,
    map: Record<IconButtonSize, number>,
) {
    if (typeof size === "number") return toCssSize(size);
    return toCssSize(map[size]);
}

const buttonSizeMap: Record<IconButtonSize, number> = {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 36,
    xl: 40,
};

const iconSizeMap: Record<IconButtonSize, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
};

const styles = computed(() => ({
    "--icon-button-size": sizeToCss(props.buttonSize, buttonSizeMap),
    "--icon-size": sizeToCss(props.iconSize, iconSizeMap),
}));

const syncedSizeStyles = computed(() =>
    toSyncedSizeStyles(props.width, props.height),
);

const mergedStyles = computed(() => [
    attrs.style as string | Record<string, string> | undefined,
    syncedSizeStyles.value,
    styles.value,
]);

const classes = computed(() => [
    attrs.class,
    "app-icon-button",
    `app-icon-button--variant-${props.variant}`,
    `app-icon-button--shape-${props.shape}`,
    `app-icon-button--tone-${props.tone}`,
    {
        "app-icon-button--disabled": props.disabled,
    },
]);

function focus() {
    buttonEl.value?.focus();
}

defineExpose({
    focus,
});
</script>
