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

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import { toSizeStyle } from '@/utils/css';

const props = defineProps({
    type: { type: String, default: 'button' },
    to: { type: String },
    href: { type: String },
    newTab: { type: Boolean },
    variant: { type: String, default: 'outline' },
    shape: { type: String, default: 'round' },
    tone: { type: String, default: 'gray' },
    size: { type: String, default: 'md' },
    /** number(px) | '50%' | 'full'(100%) */
    width: { type: [Number, String] },
    height: { type: [Number, String] },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    /** 선택/완료(Completion) 상태 */
    active: { type: Boolean, default: false },
    unstyled: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);
const isDisabled = computed(() => props.disabled || props.loading);
const buttonStyle = computed(() => toSizeStyle(props.width, props.height));

const tag = computed(() => {
    if (props.to) return RouterLink;
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

function handleClick(event) {
    if (isDisabled.value) {
        event.preventDefault();
        return;
    }

    emit('click', event);
}
</script>
