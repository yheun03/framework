<template>
    <div class="app-grid-cell-control" @click.stop>
        <AppChoice :model-value="checked" type="checkbox" size="sm" @update:model-value="handleChange" />
    </div>
</template>

<script setup lang="ts">
import type { ICellRendererParams } from "ag-grid-community";

const props = defineProps<{
    params: ICellRendererParams;
}>();

const checked = ref(false);

function syncChecked() {
    checked.value = Boolean(props.params.node?.isSelected?.());
}

function handleChange(value: boolean | string | number | null) {
    props.params.node?.setSelected?.(Boolean(value));
    syncChecked();
}

onMounted(() => {
    syncChecked();
    props.params.node?.addEventListener?.("rowSelected", syncChecked);
});

onBeforeUnmount(() => {
    props.params.node?.removeEventListener?.("rowSelected", syncChecked);
});
</script>
