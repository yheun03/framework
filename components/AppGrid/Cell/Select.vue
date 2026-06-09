<template>
    <div class="app-grid-cell-control">
        <AppSelect v-model="value" :options="options" size="sm" />
    </div>
</template>

<script setup lang="ts">
import { useCellRendererValue, type AppGridCellRendererProps } from './useCellRendererValue'

const props = defineProps<AppGridCellRendererProps>()

const params = props.params
const { rendererParams, value } = useCellRendererValue<string | number | boolean | null>(params)
const options = computed(() => rendererParams.value.options ?? [])
</script>
