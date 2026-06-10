<template>
  <div class="app-grid-cell-control">
    <AppInput
      v-model="value"
      size="sm"
      :type="inputOptions.type"
      :placeholder="inputOptions.placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from "~/composables/useAppGridCellRendererValue";
import type { AppGridCellRendererProps } from "~/types/appGrid";

type InputRendererParams = {
  type?: string;
  placeholder?: string;
};

const props =
  defineProps<
    AppGridCellRendererProps<string | number | null, InputRendererParams>
  >();

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue<
  string | number | null,
  InputRendererParams
>(params);

const inputOptions = computed(() => ({
  type: rendererParams.value.type ?? "text",
  placeholder: rendererParams.value.placeholder ?? "",
}));
</script>
