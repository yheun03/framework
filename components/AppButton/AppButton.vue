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
        <slot v-if="unstyled" />

        <template v-else>
            <!-- loading -->
            <span v-if="loading" class="app-button__spinner" aria-hidden="true" />

            <!-- left icon -->
            <i v-else-if="$slots.iconLeft" class="app-button__icon app-button__icon--left" aria-hidden="true">
                <slot name="iconLeft" />
            </i>

            <!-- label -->
            <span v-if="$slots.default" class="app-button__label">
                <slot />
            </span>

            <!-- right icon -->
            <i v-if="$slots.iconRight && !loading" class="app-button__icon app-button__icon--right" aria-hidden="true">
                <slot name="iconRight" />
            </i>
        </template>
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

type ButtonVariant = 'fill' | 'outline';
type ButtonShape = 'square' | 'round' | 'pill';
type ButtonTone = 'primary' | 'secondary' | 'gray' | 'danger' | 'warning' | 'success' | 'info';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonType = 'button' | 'submit' | 'reset';

const props = withDefaults(
    defineProps<{
        type?: ButtonType;
        to?: string;
        href?: string;
        newTab?: boolean;

        variant?: ButtonVariant;
        shape?: ButtonShape;
        tone?: ButtonTone;
        size?: ButtonSize;
        width?: CssSize;
        height?: CssSize;

        disabled?: boolean;
        loading?: boolean;
        block?: boolean;
        unstyled?: boolean;
    }>(),
    {
        type: 'button',
        variant: 'outline',
        shape: 'round',
        tone: 'gray',
        size: 'md',
        width: undefined,
        height: undefined,
        newTab: false,
        disabled: false,
        loading: false,
        block: false,
        unstyled: false,
    },
);

const emit = defineEmits<{
    click: [MouseEvent];
}>();

/* -------------------------------------------------------
   상태
------------------------------------------------------- */

const isDisabled = computed(() => props.disabled || props.loading);

/* -------------------------------------------------------
   attributes
------------------------------------------------------- */

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

const classes = computed(() => {
    if (props.unstyled) {
        return [
            'app-button-unstyled',
            {
                'is-disabled': isDisabled.value,
            },
        ];
    }

    return [
        'app-button',
        `app-button--variant-${props.variant}`,
        `app-button--shape-${props.shape}`,
        `app-button--size-${props.size}`,
        `app-button--tone-${props.tone}`,
        {
            'app-button--disabled': isDisabled.value,
            'app-button--loading': props.loading,
            'app-button--block': props.block,
        },
    ];
});

function focus() {
    buttonEl.value?.focus();
}

defineExpose({
    focus,
});
</script>
