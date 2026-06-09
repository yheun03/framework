<template>
    <div class="app-grid-cell-control app-grid-cell-control--textarea">
        <AppTextarea v-model="value" size="sm" :rows="rows" :resize="resize" :placeholder="placeholder" />
    </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from '~/composables/useAppGridCellRendererValue'
import type { AppGridCellRendererProps } from '~/types/app-grid-cell'

const props = defineProps<AppGridCellRendererProps>()

const params = props.params
const { rendererParams, value } = useAppGridCellRendererValue<string | number | null>(params)

const rows = computed(() => rendererParams.value.rows ?? 2)
const resize = computed(() => rendererParams.value.resize ?? 'none')
const placeholder = computed(() => rendererParams.value.placeholder ?? '')
</script>
