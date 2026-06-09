<template>
    <section class="app-section-wrapper" :class="wrapperClassName" :style="wrapperStyle">
        <header v-if="hasHeader" class="app-section-wrapper__header">
            <slot name="header">
                <div class="app-section-wrapper__header-text">
                    <h2 v-if="title" class="app-section-wrapper__title">
                        {{ title }}
                    </h2>

                    <p v-if="desc" class="app-section-wrapper__desc">
                        {{ desc }}
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

<script setup lang="ts">
import { normalizeSectionGap, normalizeSectionRatio, type SectionDirection, type SectionRatio, type SectionGap } from '~/utils/section'

const slots = useSlots()

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
        gap: 16,
    },
)

const hasHeader = computed(() => !!props.title || !!props.desc || !!slots.header)

const wrapperClassName = computed(() => `app-section-wrapper--${props.direction}`)

const wrapperStyle = computed(() => {
    return {
        '--app-section-wrapper-gap': normalizeSectionGap(props.gap as SectionGap),
        '--app-section-wrapper-template': normalizeSectionRatio(props.ratio),
    }
})
</script>
