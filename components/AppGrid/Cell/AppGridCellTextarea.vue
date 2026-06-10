<template>
  <div class="app-grid-cell-control app-grid-cell-control--textarea">
    <AppTextarea
      v-model="value"
      size="sm"
      :rows="rows"
      :resize="resize"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from "~/composables/useAppGridCellRendererValue";
import type { AppGridCellRendererProps } from "~/types/appGrid";

type TextareaRendererParams = {
  rows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  placeholder?: string;
};

const props =
  defineProps<
    AppGridCellRendererProps<string | number | null, TextareaRendererParams>
  >();

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue<
  string | number | null,
  TextareaRendererParams
>(params);

const rows = computed(() => rendererParams.value.rows ?? 2);
const resize = computed(() => rendererParams.value.resize ?? "none");
const placeholder = computed(() => rendererParams.value.placeholder ?? "");
</script>
