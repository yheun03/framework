<template>
    <div class="app-grid-cell-control">
        <AppDatePicker v-model="value" size="sm" :mode="mode" :min="min" :max="max" :placeholder="placeholder" />
    </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from '~/composables/useAppGridCellRendererValue'
import type { AppGridCellRendererProps } from '~/types/app-grid-cell'
import type { DateRangeValue } from '~/components/AppDatePicker.vue'

type DatePickerModelValue = string | string[] | DateRangeValue | null | undefined

const props = defineProps<AppGridCellRendererProps>()

const params = props.params
const { rendererParams, value } = useAppGridCellRendererValue<DatePickerModelValue>(params)

const mode = computed(() => rendererParams.value.mode ?? 'single')
const min = computed(() => rendererParams.value.min)
const max = computed(() => rendererParams.value.max)
const placeholder = computed(() => rendererParams.value.placeholder ?? '날짜 선택')
</script>
