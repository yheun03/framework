<template>
    <AppAccordion class="page-demo-accordion" :items="items" mode="multiple" :default-open-ids="defaultOpenIds">
        <template #title>
            <slot name="title" />
        </template>

        <template #desc>
            <slot name="desc" />
        </template>

        <template #content>
            <slot />
        </template>
    </AppAccordion>
</template>

<script setup lang="ts">
import type { AppAccordionItem } from '~/components/AppAccordion.vue'

const props = withDefaults(
    defineProps<{
        open?: boolean
    }>(),
    {
        open: true,
    },
)

const slots = useSlots()
const instance = getCurrentInstance()
const sectionId = `demo-section-${instance?.uid ?? 'default'}`

const items = computed<AppAccordionItem[]>(() => [
    {
        id: sectionId,
        title: '',
        titleSlot: 'title',
        descSlot: slots.desc ? 'desc' : undefined,
        slot: 'content',
    },
])

const defaultOpenIds = computed(() => (props.open ? [sectionId] : []))
</script>
