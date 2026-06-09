<template>
    <div class="app-grid-cell-control">
        <div class="app-grid-choice">

            <AppChoice v-for="opt in options" :key="opt.value" :model-value="choiceValue(opt.value)" :type="type"
                :value="opt.value" :label="opt.label" :name="radioName" size="sm"
                @update:model-value="(v) => updateChoiceValue(opt.value, v)" />

        </div>
    </div>
</template>

<script setup lang="ts">
import { useCellRendererValue, type AppGridCellRendererProps } from './useCellRendererValue'

const props = defineProps<AppGridCellRendererProps>()

const params = props.params
const { rendererParams, value } = useCellRendererValue(params)
const options = computed(() => rendererParams.value.options ?? [])
const type = computed(() => rendererParams.value.type ?? 'radio')

const radioName = computed(() => `${params.column?.getColId?.()}-${params.node?.id}`)

function setCellValue(v: unknown) {
    params.node?.setDataValue?.(
        params.column?.getColId?.(),
        v
    )
}

function choiceValue(optionValue: string | number) {
    if (type.value === 'checkbox') {
        return Array.isArray(value.value)
            ? value.value.includes(optionValue)
            : Boolean(value.value)
    }

    return value.value
}

function updateChoiceValue(optionValue: string | number, checkedValue: unknown) {
    if (type.value !== 'checkbox') {
        setCellValue(checkedValue)
        return
    }

    const current = Array.isArray(value.value) ? [...value.value] : []
    const checked = Boolean(checkedValue)
    const exists = current.includes(optionValue)

    if (checked && !exists) current.push(optionValue)
    if (!checked && exists) current.splice(current.indexOf(optionValue), 1)

    setCellValue(current)
}
</script>
