<template>
    <section class="app-section" :class="`app-section--${direction}`" :style="sectionStyle">
        <header v-if="title || description" class="app-section__header">
            <div class="app-section__header-text">
                <component :is="tag" v-if="title" class="app-section__title">
                    {{ title }}
                </component>

                <p v-if="description" class="app-section__desc">
                    {{ description }}
                </p>
            </div>
        </header>

        <div class="app-section__content">
            <slot />
        </div>
    </section>
</template>

<script setup>
import { DIRECTIONS, oneOf } from '@/utils/props';
import { buildSectionStyleVars } from '@/utils/section';
import { computed } from 'vue';

const props = defineProps({
    /** vertical: 위아래로 쌓기 / horizontal: 좌우로 나란히 (ratio 로 비율) */
    direction: { type: String, default: 'vertical', validator: oneOf(DIRECTIONS) },
    ratio: { type: [Array, String, null], default: null },
    title: { type: String, default: '' },
    /** 제목 태그 - 페이지 제목(h1) 아래 순서에 맞게 지정 (기본 h2) */
    tag: { type: String, default: 'h2' },
    description: { type: String, default: '' },
    gap: { type: [Number, String], default: 12 },
});

const sectionStyle = computed(() => {
    return buildSectionStyleVars({
        gapVarName: '--app-section-gap',
        ratioVarName: '--app-section-template',
        gap: props.gap,
        ratio: props.ratio,
    });
});
</script>
