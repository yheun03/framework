<template>
    <component
        :is="tag"
        v-bind="linkAttrs"
        :class="buttonClasses"
        :style="buttonStyle"
        :aria-disabled="isDisabled || undefined"
        :aria-busy="loading || undefined"
        :aria-pressed="active || undefined"
        @click="handleClick"
    >
        <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-button__icon app-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-button__icon app-button__icon--right"><slot name="iconRight" /></i>
    </component>
</template>

<script setup lang="ts">
import { resolveComponent } from 'vue';
import type { AppShape, AppSize, AppTone, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'fill' | 'soft' | 'outline';

const props = withDefaults(
    defineProps<{
        type?: ButtonType;
        to?: string;
        href?: string;
        newTab?: boolean;
        variant?: ButtonVariant;
        shape?: AppShape;
        tone?: AppTone;
        size?: AppSize;
        /** number(px) | '50%' | 'full'(100%) */
        width?: AppWidth;
        height?: AppWidth;
        disabled?: boolean;
        loading?: boolean;
        /** 선택/완료(Completion) 상태 */
        active?: boolean;
        unstyled?: boolean;
    }>(),
    {
        type: 'button',
        variant: 'outline',
        shape: 'round',
        tone: 'gray',
        size: 'md',
        disabled: false,
        loading: false,
        active: false,
        unstyled: false,
    },
);

const emit = defineEmits<{ click: [MouseEvent] }>();
const isDisabled = computed(() => props.disabled || props.loading);
const buttonStyle = computed(() => toSizeStyle(props.width, props.height));

const tag = computed(() => {
    if (props.to) return resolveComponent('NuxtLink');
    if (props.href) return 'a';
    return 'button';
});

const linkAttrs = computed(() => {
    if (props.to) return { to: props.to, tabindex: isDisabled.value ? -1 : undefined };
    if (props.href) {
        return {
            href: isDisabled.value ? undefined : props.href,
            target: props.newTab ? '_blank' : undefined,
            rel: props.newTab ? 'noopener noreferrer' : undefined,
            tabindex: isDisabled.value ? -1 : undefined,
        };
    }
    return { type: props.type, disabled: isDisabled.value };
});

const buttonClasses = computed(() =>
    props.unstyled
        ? 'app-button-unstyled'
        : [
              'app-button',
              `app-button--variant-${props.variant}`,
              `app-button--shape-${props.shape}`,
              `app-button--size-${props.size}`,
              `app-button--tone-${props.tone}`,
              {
                  'app-button--disabled': isDisabled.value,
                  'app-button--loading': props.loading,
                  'app-button--active': props.active,
              },
          ],
);

function handleClick(event: MouseEvent) {
    if (isDisabled.value) {
        event.preventDefault();
        return;
    }

    emit('click', event);
}
</script>
