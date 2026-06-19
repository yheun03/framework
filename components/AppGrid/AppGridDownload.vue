<template>
    <div class="app-grid-download">
        <AppButton size="sm" variant="outline" :loading="downloadingAll" @click="handleDownloadAll">
            엑셀 다운로드
        </AppButton>

        <AppButton size="sm" variant="outline" :loading="downloadingSelected" @click="handleDownloadSelected">
            선택 엑셀
        </AppButton>
    </div>
</template>

<script setup lang="ts">
import type { GridApi } from "ag-grid-community";
import { useAppGridExcelExport } from "~/composables/useAppGridExcelExport";

const props = withDefaults(
    defineProps<{
        api?: GridApi | null;
        gridId?: string;
    }>(),
    {
        api: null,
        gridId: undefined,
    },
);

const { exportDisplayed, exportDisplayedSelected } = useAppGridExcelExport();
const downloadingAll = ref(false);
const downloadingSelected = ref(false);

function getDownloadGrid() {
    const gridId = props.gridId;
    if (!gridId) return null;

    const api = props.api;
    if (!api) return null;

    return { gridId, api };
}

async function handleDownloadAll() {
    if (downloadingAll.value) return;
    const grid = getDownloadGrid();
    if (!grid) return;

    downloadingAll.value = true;

    try {
        await exportDisplayed(grid.gridId, grid.api);
    } finally {
        downloadingAll.value = false;
    }
}

async function handleDownloadSelected() {
    if (downloadingSelected.value) return;
    const grid = getDownloadGrid();
    if (!grid) return;

    downloadingSelected.value = true;

    try {
        await exportDisplayedSelected(grid.gridId, grid.api);
    } finally {
        downloadingSelected.value = false;
    }
}
</script>
