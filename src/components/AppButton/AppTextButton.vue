<template>
    <RouterLink v-if="to" :to="to" :class="buttonClasses" :style="buttonStyle" @click="handleClick">
        <span v-if="loading" class="app-text-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-text-button__icon app-text-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-text-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-text-button__icon app-text-button__icon--right"><slot name="iconRight" /></i>
    </RouterLink>

    <a
        v-else-if="href"
        :href="isDisabled ? undefined : href"
        :target="newTab ? '_blank' : undefined"
        :rel="newTab ? 'noopener noreferrer' : undefined"
        :class="buttonClasses"
        :style="buttonStyle"
        @click="handleClick"
    >
        <span v-if="loading" class="app-text-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-text-button__icon app-text-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-text-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-text-button__icon app-text-button__icon--right"><slot name="iconRight" /></i>
    </a>

    <button v-else :type="type" :class="buttonClasses" :style="buttonStyle" :disabled="isDisabled" @click="handleClick">
        <span v-if="loading" class="app-text-button__spinner" aria-hidden="true" />
        <i v-else-if="$slots.iconLeft" class="app-text-button__icon app-text-button__icon--left"><slot name="iconLeft" /></i>
        <span class="app-text-button__label"><slot /></span>
        <i v-if="$slots.iconRight && !loading" class="app-text-button__icon app-text-button__icon--right"><slot name="iconRight" /></i>
    </button>
</template>

<script setup>
import { BUTTON_TYPES, TONES, oneOf } from '@/utils/props';
import { toSizeStyle } from '@/utils/css';
import { computed } from 'vue';

const props = defineProps({
    type: { type: String, default: 'button', validator: oneOf(BUTTON_TYPES) },
    to: { type: String },
    href: { type: String },
    newTab: { type: Boolean },
    variant: { type: String, default: 'text', validator: oneOf(['text', 'underline']) },
    tone: { type: String, default: 'gray', validator: oneOf(TONES) },
    size: { type: String, default: 'md', validator: oneOf(['sm', 'md', 'lg']) },
    width: { type: [String, Number] },
    height: { type: [String, Number] },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);
const isDisabled = computed(() => props.disabled || props.loading);
const buttonStyle = computed(() => toSizeStyle(props.width, props.height));
const buttonClasses = computed(() => [
    'app-text-button',
    `app-text-button--variant-${props.variant}`,
    `app-text-button--size-${props.size}`,
    `app-text-button--tone-${props.tone}`,
    {
        'app-text-button--disabled': isDisabled.value,
        'app-text-button--loading': props.loading,
    },
]);

function handleClick(event) {
    if (isDisabled.value) {
        event.preventDefault();
        return;
    }

    emit('click', event);
}
</script>
