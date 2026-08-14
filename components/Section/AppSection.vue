<template>
    <section class="app-section" :class="`app-section--${direction}`" :style="sectionStyle">
        <header v-if="title || description" class="app-section__header">
            <div class="app-section__header-text">
                <h3 v-if="title" class="app-section__title">
                    {{ title }}
                </h3>

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

<script setup lang="ts">
import {
    buildSectionStyleVars,
    type SectionDirection,
    type SectionRatio,
    type SectionGap,
} from "~/utils/section";

const props = withDefaults(
    defineProps<{
        direction?: SectionDirection;
        ratio?: SectionRatio;
        title?: string;
        description?: string;
        gap?: number | string;
    }>(),
    {
        direction: "column",
        ratio: null,
        title: "",
        description: "",
        gap: 12,
    },
);

const sectionStyle = computed(() => {
    return buildSectionStyleVars({
        gapVarName: "--app-section-gap",
        ratioVarName: "--app-section-template",
        gap: props.gap as SectionGap,
        ratio: props.ratio,
    });
});
</script>
