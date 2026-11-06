<template>
    <RouterLink v-if="to" :to="to" :class="buttonClasses" :style="buttonStyle" :aria-label="ariaLabel">
        <slot />
    </RouterLink>

    <a
        v-else-if="href"
        :href="href"
        :target="newTab ? '_blank' : undefined"
        :rel="newTab ? 'noopener noreferrer' : undefined"
        :class="buttonClasses"
        :style="buttonStyle"
        :aria-label="ariaLabel"
    >
        <slot />
    </a>

    <button
        v-else
        :type="type"
        :class="buttonClasses"
        :style="buttonStyle"
        :aria-label="ariaLabel"
        :disabled="disabled"
        @click="$emit('click', $event)"
    >
        <slot />
    </button>
</template>

<script setup>
import { toSizeStyle } from '@/utils/css';
import { computed } from 'vue';

const props = defineProps({
    ariaLabel: { type: String },
    type: { type: String, default: 'button' },
    to: { type: String },
    href: { type: String },
    newTab: { type: Boolean },
    variant: { type: String, default: 'plain' },
    shape: { type: String, default: 'round' },
    tone: { type: String, default: 'gray' },
    size: { type: [String, Number], default: 'md' },
    iconSize: { type: [String, Number], default: 'md' },
    width: { type: [String, Number] },
    height: { type: [String, Number] },
    disabled: { type: Boolean, default: false },
});

defineEmits(['click']);

const controlSizes = { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 };
const iconSizes = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 };
const toSize = (value, sizes) => `${typeof value === 'number' ? value : sizes[value]}px`;

const buttonClasses = computed(() => [
    'app-icon-button',
    `app-icon-button--variant-${props.variant}`,
    `app-icon-button--shape-${props.shape}`,
    `app-icon-button--tone-${props.tone}`,
    { 'app-icon-button--disabled': props.disabled },
]);

const buttonStyle = computed(() => ({
    ...toSizeStyle(props.width, props.height),
    '--icon-button-size': toSize(props.size, controlSizes),
    '--icon-size': toSize(props.iconSize, iconSizes),
}));
</script>
