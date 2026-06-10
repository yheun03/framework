<template>
  <AgGridVue
    v-bind="gridAttrs"
    :locale-text="localeText"
    :class="gridClasses"
    @grid-ready="handleGridReady"
  />
</template>

<script setup lang="ts">
defineOptions({
  ssr: false,
});
import { AgGridVue } from "ag-grid-vue3";
import type {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  FilterChangedEvent,
  BodyScrollEvent,
} from "ag-grid-community";
import { useAppGridRegistry } from "~/composables/useAppGridRegistry";

const APP_SELECT_CLOSE_ALL_EVENT = "app-select:close-all";
const { register, unregister } = useAppGridRegistry();

const { $agGridLocale } = useNuxtApp();
const attrs = useAttrs();
const gridApi = ref<GridApi | null>(null);
const registeredGridId = ref<string | null>(null);
const props = withDefaults(
  defineProps<{
    autoHeight?: boolean;
    headerHeight?: number;
    rowHeight?: number;
  }>(),
  {
    autoHeight: false,
    headerHeight: 40,
    rowHeight: 48,
  },
);

function handleCloseOpenSelects() {
  window.dispatchEvent(new Event(APP_SELECT_CLOSE_ALL_EVENT));
}

function handleBodyScroll() {
  handleCloseOpenSelects();
}

function handleGridReady(e: GridReadyEvent) {
  gridApi.value = e.api;
  e.api.addEventListener(
    "bodyScroll",
    handleBodyScroll as (event: BodyScrollEvent) => void,
  );

  const id = e.api.getGridId();

  if (!id) {
    console.warn("gridId missing");
    return;
  }

  register(id, e.api);
  registeredGridId.value = id;
}

onBeforeUnmount(() => {
  gridApi.value?.removeEventListener(
    "bodyScroll",
    handleBodyScroll as (event: BodyScrollEvent) => void,
  );
  if (registeredGridId.value) {
    unregister(registeredGridId.value);
  }
});

function normalizeColumnDefs(columnDefs?: ColDef[]) {
  if (!Array.isArray(columnDefs)) return columnDefs;

  return columnDefs.map((col) => {
    if (!col.cellRenderer || col.cellDataType !== undefined) return col;

    return {
      ...col,
      cellDataType: false,
      valueFormatter:
        col.valueFormatter ??
        ((params) => {
          if (params.value == null) return "";
          if (Array.isArray(params.value)) return params.value.join(", ");
          if (typeof params.value === "object") return "";

          return String(params.value);
        }),
    };
  });
}

function normalizeDefaultColDef(defaultColDef?: ColDef) {
  return {
    cellDataType: false,
    ...defaultColDef,
  };
}

function resolveNumberAttr(value: unknown, fallback: number): number {
  return typeof value === "number" ? value : fallback;
}

/* attrs -> grid-id 전달 */

const gridAttrs = computed((): GridOptions => {
  const a = attrs as Record<string, unknown>;

  const {
    localeText: _,
    class: __,
    gridId,
    "grid-id": gridIdKebab,
    domLayout,
    "dom-layout": domLayoutKebab,
    headerHeight,
    "header-height": headerHeightKebab,
    rowHeight,
    "row-height": rowHeightKebab,
    getRowHeight,
    "get-row-height": getRowHeightKebab,
    rowSelection,
    "row-selection": rowSelectionKebab,
    columnDefs,
    "column-defs": columnDefsKebab,
    defaultColDef,
    "default-col-def": defaultColDefKebab,
    onFilterChanged,
    ...rest
  } = a;

  const id = (gridId ?? gridIdKebab) as string | undefined;
  const normalizedColumnDefs = normalizeColumnDefs(
    (columnDefs ?? columnDefsKebab) as ColDef[] | undefined,
  );
  const normalizedDefaultColDef = normalizeDefaultColDef(
    (defaultColDef ?? defaultColDefKebab) as ColDef | undefined,
  );
  const resolvedDomLayout = (domLayout ??
    domLayoutKebab) as GridOptions["domLayout"];
  const resolvedGetRowHeight = getRowHeight ?? getRowHeightKebab;
  const resolvedHeaderHeight = headerHeight ?? headerHeightKebab;
  const resolvedRowHeight = rowHeight ?? rowHeightKebab;
  const resolvedRowSelection = (rowSelection ??
    rowSelectionKebab) as GridOptions["rowSelection"];

  return {
    ...rest,

    overlayLoadingTemplate: '<div class="ag-overlay-loading">로딩중...</div>',

    overlayNoRowsTemplate:
      '<div class="ag-overlay-no-rows">검색된 결과가 없습니다</div>',

    domLayout: props.autoHeight ? "autoHeight" : resolvedDomLayout,
    headerHeight: resolveNumberAttr(resolvedHeaderHeight, props.headerHeight),
    rowHeight: resolveNumberAttr(resolvedRowHeight, props.rowHeight),
    getRowHeight: resolvedGetRowHeight as GridOptions["getRowHeight"],
    ...(resolvedRowSelection ? { rowSelection: resolvedRowSelection } : {}),
    defaultColDef: normalizedDefaultColDef,
    ...(normalizedColumnDefs ? { columnDefs: normalizedColumnDefs } : {}),

    onFilterChanged(params: FilterChangedEvent) {
      const api = params.api;

      if (api.getDisplayedRowCount() === 0 && api.isAnyFilterPresent()) {
        api.showNoRowsOverlay();
      } else {
        api.hideOverlay();
      }

      if (typeof onFilterChanged === "function") {
        onFilterChanged(params);
      }
    },

    gridId: id,
  } as GridOptions;
});

const gridClasses = computed(() => [
  "ag-theme-quartz",
  "app-grid",
  {
    "app-grid--auto-height": props.autoHeight,
  },
  attrs.class,
]);

const localeText = computed<GridOptions["localeText"]>(() => {
  return (attrs.localeText as GridOptions["localeText"]) ?? $agGridLocale;
});
</script>
