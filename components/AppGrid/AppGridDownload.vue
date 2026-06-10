<template>
  <div class="app-grid-download">
    <AppButton size="sm" variant="outline" @click="downloadAll">
      엑셀 다운로드
    </AppButton>

    <AppButton size="sm" variant="outline" @click="downloadSelected">
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

async function downloadAll() {
  if (!target) return;

  const api = getApi(target);

  if (!api) return;

  await exportDisplayed(target, api);
}

async function downloadSelected() {
  if (!target) return;

  const api = getApi(target);

  if (!api) return;

  await exportDisplayedSelected(target, api);
}
</script>
