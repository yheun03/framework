<template>
    <div class="app-grid-cell-file" @dragenter.stop @dragover.stop @dragleave.stop @drop.stop>
        <AppUploadFile v-model="value" :multiple="fileOptions.multiple" :max-count="fileOptions.maxCount"
            :accept="fileOptions.accept" :hint="fileOptions.hint" :trigger-text="fileOptions.triggerText"
            :allow-drop="fileOptions.allowDrop" :max-size-bytes="fileOptions.maxSizeBytes" />
    </div>
</template>

<script setup lang="ts">
import { useCellRendererValue, type AppGridCellRendererProps } from './useCellRendererValue'

type FileCellValue =
    | string
    | {
        id: string
        name: string
        type: string
        size: number
        path?: string
        file?: File
        source?: 'sample' | 'upload'
    }
    | Array<string | {
        id: string
        name: string
        type: string
        size: number
        path?: string
        file?: File
        source?: 'sample' | 'upload'
    }>
    | null

type FileCellParams = {
    multiple?: boolean
    maxCount?: number
    accept?: string
    hint?: string
    triggerText?: string
    allowDrop?: boolean
    maxSizeBytes?: number
}

const props = defineProps<AppGridCellRendererProps>()

const params = props.params
const { rendererParams, value } = useCellRendererValue<FileCellValue>(params)

const fileOptions = computed<FileCellParams>(() => ({
    multiple: Boolean(rendererParams.value.multiple),
    maxCount: rendererParams.value.maxCount,
    accept: rendererParams.value.accept,
    hint: rendererParams.value.hint,
    triggerText: rendererParams.value.triggerText,
    allowDrop: rendererParams.value.allowDrop ?? true,
    maxSizeBytes: rendererParams.value.maxSizeBytes,
}))
</script>
