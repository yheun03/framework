<template>
    <AppAccordion class="page-demo-accordion" :items="[
        {
            id: 'content',
            title: props.title,
            desc: props.desc,
            slot: 'content',
        },
    ]" mode="multiple" initial-open="all">
        <template #content>
            <slot />
        </template>
    </AppAccordion>
</template>

<script setup lang="ts">
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
</script>
