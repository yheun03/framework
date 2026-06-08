<template>
    <div class="app-grid-cell-control">
        <AppInput v-model="value" size="sm" :type="rendererParams.type || 'text'"
            :placeholder="rendererParams.placeholder || ''" />
    </div>
</template>

<script setup lang="ts">
import { useCellRendererValue } from './useCellRendererValue'

const props = defineProps({
    params: Object
})

const params = props.params
const { rendererParams, value } = useCellRendererValue<string | number | null>(params)

</script>
