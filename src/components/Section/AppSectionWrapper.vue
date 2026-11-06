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
import { buildSectionStyleVars } from '@/utils/section';
import { computed } from 'vue';

const props = defineProps({
    direction: { type: String, default: 'column' },
    ratio: { type: [Array, String, null], default: null },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    gap: { type: [Number, String], default: 16 },
});

const wrapperStyle = computed(() => {
    return buildSectionStyleVars({
        gapVarName: '--app-section-wrapper-gap',
        ratioVarName: '--app-section-wrapper-template',
        gap: props.gap,
        ratio: props.ratio,
    });
});
</script>
