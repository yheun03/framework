<template>
    <div class="app-grid-cell-image" @dragenter.stop @dragover.stop @dragleave.stop @drop.stop>
        <AppUploadImage v-model="value" :multiple="imageOptions.multiple" :max-count="imageOptions.maxCount"
            :accept="imageOptions.accept" :hint="imageOptions.hint" :trigger-text="imageOptions.triggerText"
            :allow-drop="imageOptions.allowDrop" :max-size-bytes="imageOptions.maxSizeBytes"
            :read-mode="imageOptions.readMode" />
    </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from '~/composables/useAppGridCellRendererValue'
import type { AppGridCellRendererProps } from '~/types/appGrid'

type ReadMode = 'dataUrl' | 'objectUrl'
type ImageCellValue =
    | string
    | {
        id: string
        name: string
        type: string
        size: number
        url: string
        alt?: string
        file?: File
        source?: 'sample' | 'upload'
    }
    | Array<string | {
        id: string
        name: string
        type: string
        size: number
        url: string
        alt?: string
        file?: File
        source?: 'sample' | 'upload'
    }>
    | null

type ImageCellParams = {
    multiple?: boolean
    maxCount?: number
    accept?: string
    hint?: string
    triggerText?: string
    allowDrop?: boolean
    maxSizeBytes?: number
    readMode?: ReadMode
}

const props = defineProps<AppGridCellRendererProps<ImageCellValue, ImageCellParams>>()

const params = props.params
const { rendererParams, value } = useAppGridCellRendererValue<ImageCellValue, ImageCellParams>(params)

const imageOptions = computed<ImageCellParams>(() => ({
    multiple: Boolean(rendererParams.value.multiple),
    maxCount: rendererParams.value.maxCount,
    accept: rendererParams.value.accept,
    hint: rendererParams.value.hint,
    triggerText: rendererParams.value.triggerText,
    allowDrop: rendererParams.value.allowDrop ?? true,
    maxSizeBytes: rendererParams.value.maxSizeBytes,
    readMode: rendererParams.value.readMode,
}))
</script>
