<template>
    <component
        ref="buttonEl"
        :is="tag"
        v-bind="componentAttrs"
        :class="classes"
        :style="mergedStyles"
        :aria-disabled="ariaDisabled"
        :aria-busy="loading ? 'true' : undefined"
        :tabindex="tabIndex"
        @click="handleClick"
    >
        <span v-if="loading" class="app-text-button__spinner" aria-hidden="true" />

        <i v-else-if="$slots.iconLeft" class="app-text-button__icon app-text-button__icon--left" aria-hidden="true">
            <slot name="iconLeft" />
        </i>

        <span v-if="$slots.default" class="app-text-button__label">
            <slot />
        </span>

        <i v-if="$slots.iconRight && !loading" class="app-text-button__icon app-text-button__icon--right" aria-hidden="true">
            <slot name="iconRight" />
        </i>
    </component>
</template>

<script setup lang="ts">
import { toSyncedSizeStyles, type CssSize } from '~/utils/css';
import { useButtonAction } from '~/composables/useButtonAction';

defineOptions({
    inheritAttrs: false,
});

const attrs = useAttrs();
const buttonEl = ref<HTMLElement | null>(null);

type TextButtonVariant = 'text' | 'underline';
type TextButtonTone = 'primary' | 'secondary' | 'gray' | 'danger' | 'warning' | 'success' | 'info';
type TextButtonSize = 'sm' | 'md' | 'lg';
type TextButtonType = 'button' | 'submit' | 'reset';

const props = withDefaults(
    defineProps<{
        type?: TextButtonType;
        to?: string;
        href?: string;
        newTab?: boolean;
        variant?: TextButtonVariant;
        tone?: TextButtonTone;
        size?: TextButtonSize;
        width?: CssSize;
        height?: CssSize;
        disabled?: boolean;
        loading?: boolean;
    }>(),
    {
        type: 'button',
        variant: 'text',
        tone: 'gray',
        size: 'md',
        width: undefined,
        height: undefined,
        newTab: false,
        disabled: false,
        loading: false,
    },
);

const emit = defineEmits<{
    click: [MouseEvent];
}>();

const isDisabled = computed(() => props.disabled || props.loading);
const { tag, componentAttrs, ariaDisabled, tabIndex, handleClick } = useButtonAction({
    attrs,
    type: () => props.type,
    to: () => props.to,
    href: () => props.href,
    newTab: () => props.newTab,
    disabled: () => isDisabled.value,
    onClick: (event) => emit('click', event),
});

const mergedStyles = computed(() => [attrs.style as string | Record<string, string> | undefined, syncedSizeStyles.value]);

const syncedSizeStyles = computed(() => toSyncedSizeStyles(props.width, props.height));

const classes = computed(() => [
    'app-text-button',
    `app-text-button--variant-${props.variant}`,
    `app-text-button--size-${props.size}`,
    `app-text-button--tone-${props.tone}`,
    {
        'app-text-button--disabled': isDisabled.value,
        'app-text-button--loading': props.loading,
    },
]);

function focus() {
    buttonEl.value?.focus();
}

defineExpose({
    focus,
});
</script>
