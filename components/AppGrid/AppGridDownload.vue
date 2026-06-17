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
import { inject } from "vue";
import { useAppGridRegistry } from "~/composables/useAppGridRegistry";
import { useAppGridExcelExport } from "~/composables/useAppGridExcelExport";

const target = inject<string>("appGridTarget");

const { getApi } = useAppGridRegistry();
const { exportDisplayed, exportDisplayedSelected } = useAppGridExcelExport();
const downloadingAll = ref(false);
const downloadingSelected = ref(false);

async function handleDownloadAll() {
    if (!target || downloadingAll.value) return;

    const api = getApi(target);

    if (!api) return;

    downloadingAll.value = true;

    try {
        await exportDisplayed(target, api);
    } finally {
        downloadingAll.value = false;
    }
}

async function handleDownloadSelected() {
    if (!target || downloadingSelected.value) return;

    const api = getApi(target);

    if (!api) return;

    downloadingSelected.value = true;

    try {
        await exportDisplayedSelected(target, api);
    } finally {
        downloadingSelected.value = false;
    }
}
</script>
