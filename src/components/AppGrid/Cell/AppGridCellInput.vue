<template>
    <div class="app-grid-cell-control">
        <AppInput v-model="value" size="sm" :type="inputOptions.type" :placeholder="inputOptions.placeholder" />
    </div>
</template>

<script setup>
import { useAppGridCellRendererValue } from '@/composables/useAppGridCellRendererValue';
import { computed } from 'vue';
import AppInput from '@/components/AppInput.vue';

const props = defineProps({
    params: { type: null, required: true },
});

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue(params);

const inputOptions = computed(() => ({
    type: rendererParams.value.type ?? 'text',
    placeholder: rendererParams.value.placeholder ?? '',
}));
</script>
