<template>
    <div class="app-grid-cell-file" @dragenter.stop @dragover.stop @dragleave.stop @drop.stop>
        <AppUploadFile v-model="value" :multiple="fileOptions.multiple" :max-count="fileOptions.maxCount"
            :accept="fileOptions.accept" :hint="fileOptions.hint" :trigger-text="fileOptions.triggerText"
            :allow-drop="fileOptions.allowDrop" :max-size-bytes="fileOptions.maxSizeBytes" />
    </div>
</template>

<script setup lang="ts">
import { useCellRendererValue } from './useCellRendererValue'

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

const props = defineProps({
    params: Object,
})

const params = props.params
const { value } = useCellRendererValue<FileCellValue>(params)

const fileOptions = computed<FileCellParams>(() => ({
    multiple: Boolean(params?.colDef?.cellRendererParams?.multiple),
    maxCount: params?.colDef?.cellRendererParams?.maxCount,
    accept: params?.colDef?.cellRendererParams?.accept,
    hint: params?.colDef?.cellRendererParams?.hint,
    triggerText: params?.colDef?.cellRendererParams?.triggerText,
    allowDrop: params?.colDef?.cellRendererParams?.allowDrop ?? true,
    maxSizeBytes: params?.colDef?.cellRendererParams?.maxSizeBytes,
}))
</script>
