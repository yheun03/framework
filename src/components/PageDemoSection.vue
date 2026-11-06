<template>
    <AppAccordion class="page-demo-section" :items="items" initial="all" tag="h2">
        <template #content>
            <slot />
        </template>
    </AppAccordion>
</template>

<script setup>
import { computed } from 'vue';
import AppAccordion from '@/components/AppAccordion.vue';

const props = defineProps({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
});

const items = computed(() => [
    {
        id: 'content',
        title: props.title,
        description: props.description,
        slot: 'content',
    },
]);
</script>
