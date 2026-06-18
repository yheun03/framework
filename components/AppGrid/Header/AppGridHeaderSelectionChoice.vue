<template>
    <div class="app-grid-cell-control" @click.stop>
        <AppChoice :model-value="checked" :indeterminate="indeterminate" type="checkbox" size="sm"
            @update:model-value="handleChange" />
    </div>
</template>

<script setup lang="ts">
import type { IHeaderParams, RowNode } from "ag-grid-community";

const props = defineProps<{
    params: IHeaderParams;
}>();

const checked = ref(false);
const indeterminate = ref(false);

function getDisplayedNodes() {
    const nodes: RowNode[] = [];

    props.params.api.forEachNodeAfterFilterAndSort((node) => {
        if (node.selectable !== false) nodes.push(node);
    });

    return nodes;
}

function syncChecked() {
    const nodes = getDisplayedNodes();
    const selectedCount = nodes.filter((node) => node.isSelected()).length;

    checked.value = nodes.length > 0 && selectedCount === nodes.length;
    indeterminate.value = selectedCount > 0 && selectedCount < nodes.length;
}

function handleChange(value: boolean | string | number | null) {
    getDisplayedNodes().forEach((node) => node.setSelected(Boolean(value)));
    syncChecked();
}

onMounted(() => {
    syncChecked();
    props.params.api.addEventListener("selectionChanged", syncChecked);
    props.params.api.addEventListener("filterChanged", syncChecked);
    props.params.api.addEventListener("modelUpdated", syncChecked);
});

onBeforeUnmount(() => {
    props.params.api.removeEventListener("selectionChanged", syncChecked);
    props.params.api.removeEventListener("filterChanged", syncChecked);
    props.params.api.removeEventListener("modelUpdated", syncChecked);
});
</script>
