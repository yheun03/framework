<template>
    <div class="app-grid-cell-control">
        <AppInput v-model="value" size="sm" :type="inputOptions.type" :placeholder="inputOptions.placeholder" />
    </div>
</template>

<script setup lang="ts">
import { useCellRendererValue, type AppGridCellRendererProps } from './useCellRendererValue'

const props = defineProps<AppGridCellRendererProps>()

const params = props.params
const { rendererParams, value } = useCellRendererValue<string | number | null>(params)

const inputOptions = computed(() => ({
    type: rendererParams.value.type ?? 'text',
    placeholder: rendererParams.value.placeholder ?? '',
}))
</script>
