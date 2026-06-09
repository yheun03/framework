<template>
    <div class="app-grid-cell-control">
        <AppSelect v-model="value" :options="options" size="sm" />
    </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from '~/composables/useAppGridCellRendererValue'
import type { AppGridCellRendererProps } from '~/types/app-grid-cell'

const props = defineProps<AppGridCellRendererProps>()

const params = props.params
const { rendererParams, value } = useAppGridCellRendererValue<string | number | boolean | null>(params)
const options = computed(() => rendererParams.value.options ?? [])
</script>
