<template>
    <div class="app-grid-cell-control">
        <AppSelect v-model="value" :items="items" size="sm" />
    </div>
</template>

<script setup>
import { useAppGridCellRendererValue } from '@/composables/useAppGridCellRendererValue';
import { computed } from 'vue';
import AppSelect from '@/components/AppSelect.vue';

const props = defineProps({
    params: { type: null, required: true },
});

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue(params);
const items = computed(() => rendererParams.value.items ?? []);
</script>
