<template>
    <AppAccordion class="page-demo-accordion" :items="items" mode="multiple" initial-open="all">
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
        desc?: string;
    }>(),
    {
        title: "",
        desc: "",
    },
);

const items = computed<AppAccordionItem[]>(() => [
    {
        id: "content",
        title: props.title,
        desc: props.desc,
        slot: "content",
    },
]);
</script>
