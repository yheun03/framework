<template>
    <div class="app-grid-cell-control">
        <AppDatePicker v-model="value" size="sm" :mode="mode" :min="min" :max="max" :placeholder="placeholder" />
    </div>
</template>

<script setup lang="ts">
import { useCellRendererValue } from './useCellRendererValue'

const props = defineProps({
    params: Object
})

const params = props.params
const { rendererParams, value } = useCellRendererValue(params)

const mode = computed(() => rendererParams.value.mode ?? 'single')
const min = computed(() => rendererParams.value.min)
const max = computed(() => rendererParams.value.max)
const placeholder = computed(() => rendererParams.value.placeholder ?? '날짜 선택')

</script>
