<template>
    <section class="app-section" :class="sectionClassName" :style="sectionStyle">
        <header v-if="hasDefaultHeader" class="app-section__header">
            <div class="app-section__header-text">
                <h3 v-if="title" class="app-section__title">
                    {{ title }}
                </h3>

                <p v-if="desc" class="app-section__desc">
                    {{ desc }}
                </p>
            </div>
        </header>

        <div class="app-section__content">
            <slot />
        </div>
    </section>
</template>

<script setup lang="ts">
import { normalizeSectionGap, normalizeSectionRatio, type SectionDirection, type SectionRatio, type SectionGap } from '~/utils/section'

const props = withDefaults(
    defineProps<{
        direction?: SectionDirection
        ratio?: SectionRatio
        title?: string
        desc?: string
        gap?: number | string
    }>(),
    {
        direction: 'column',
        ratio: null,
        title: '',
        desc: '',
        gap: 12,
    },
)

const hasDefaultHeader = computed(() => !!props.title || !!props.desc)

const sectionClassName = computed(() => `app-section--${props.direction}`)

const sectionStyle = computed(() => {
    return {
        '--app-section-gap': normalizeSectionGap(props.gap as SectionGap),
        '--app-section-template': normalizeSectionRatio(props.ratio),
    }
})
</script>
