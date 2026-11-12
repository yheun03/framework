<template>
    <section class="app-section-wrapper" :class="`app-section-wrapper--${direction}`" :style="wrapperStyle">
        <header v-if="title || description || $slots.header" class="app-section-wrapper__header">
            <slot name="header">
                <div class="app-section-wrapper__header-text">
                    <h2 v-if="title" class="app-section-wrapper__title">
                        {{ title }}
                    </h2>

                    <p v-if="description" class="app-section-wrapper__desc">
                        {{ description }}
                    </p>
                </div>
            </slot>
        </header>

        <div class="app-section-wrapper__body">
            <slot />
        </div>

        <footer v-if="$slots.footer" class="app-section-wrapper__footer">
            <slot name="footer" />
        </footer>
    </section>
</template>

<script setup>
import { DIRECTIONS, oneOf } from '@/utils/props';
import { toCssSize, toGridTemplate } from '@/utils/css';
import { computed } from 'vue';

const props = defineProps({
    /** vertical: 위아래로 쌓기 / horizontal: 좌우로 나란히 (ratio 로 비율) */
    direction: { type: String, default: 'vertical', validator: oneOf(DIRECTIONS) },
    ratio: { type: [Array, String, null], default: null },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    gap: { type: [Number, String], default: 16 },
});

const wrapperStyle = computed(() => ({
    '--app-section-wrapper-gap': toCssSize(props.gap),
    '--app-section-wrapper-template': toGridTemplate(props.ratio),
}));
</script>
