<template>
    <AppAccordion class="page-demo-section" :items="items" type="multiple" initial-open="all">
        <template #content>
            <slot />
        </template>
    </AppAccordion>
</template>

<script setup lang="ts">
import type { AppAccordionItem } from "~/components/AppAccordion.vue";

const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
    }>(),
    {
        title: "",
        description: "",
    },
);

const items = computed<AppAccordionItem[]>(() => [
    {
        id: "content",
        title: props.title,
        description: props.description,
        slot: "content",
    },
]);
</script>
