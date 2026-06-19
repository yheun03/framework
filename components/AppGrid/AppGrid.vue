<template>
    <AgGridVue ref="gridRef" v-bind="gridAttrs" :locale-text="localeText" :class="gridClasses" :style="gridStyles"
        @grid-ready="handleGridReady" />
</template>

<script setup lang="ts">
defineOptions({
    ssr: false,
    inheritAttrs: false,
});
import { AgGridVue } from "ag-grid-vue3";
import type {
    CellClassParams,
    ColDef,
    GridApi,
    GridOptions,
    GridReadyEvent,
    FilterChangedEvent,
    BodyScrollEvent,
    CellClickedEvent,
} from "ag-grid-community";
import type { AppGridCellAlign, AppGridCellVerticalAlign, AppGridColDef } from "~/types/appGrid";
import AppGridCellSelectionChoice from "~/components/AppGrid/Cell/AppGridCellSelectionChoice.vue";
import AppGridHeaderSelectionChoice from "~/components/AppGrid/Header/AppGridHeaderSelectionChoice.vue";

const APP_SELECT_CLOSE_ALL_EVENT = "app-select:close-all";
const APP_CHOICE_SELECTION_COL_ID = "appChoiceSelection";
type AppGridRowSelectionOptions = Exclude<GridOptions["rowSelection"], string | undefined> & {
    headerCheckbox?: boolean;
    headerCheckboxSelection?: boolean;
};

const attrs = useAttrs();
const gridRef = ref<{ $el?: HTMLElement } | null>(null);
const gridApi = ref<GridApi | null>(null);
let headerCheckboxObserver: MutationObserver | null = null;
const props = withDefaults(
    defineProps<{
        autoHeight?: boolean;
        headerHeight?: number;
        rowHeight?: number;
        height?: number | string;
    }>(),
    {
        autoHeight: false,
        headerHeight: 40,
        rowHeight: 48,
        height: undefined,
    },
);

const emit = defineEmits<{
    (e: "grid-ready", value: GridReadyEvent): void;
}>();

function handleCloseOpenSelects() {
    window.dispatchEvent(new Event(APP_SELECT_CLOSE_ALL_EVENT));
}

function handleBodyScroll() {
    handleCloseOpenSelects();
}

function removeAgHeaderCheckboxPlaceholders() {
    const el = gridRef.value?.$el;

    if (!el) return;

    el.querySelectorAll(".ag-header-select-all.ag-hidden").forEach((node) => {
        node.remove();
    });
}

function scheduleRemoveAgHeaderCheckboxPlaceholders() {
    nextTick(() => {
        removeAgHeaderCheckboxPlaceholders();
    });
}

function observeAgHeaderCheckboxPlaceholders() {
    const el = gridRef.value?.$el;

    if (!el || headerCheckboxObserver) return;

    headerCheckboxObserver = new MutationObserver(removeAgHeaderCheckboxPlaceholders);
    headerCheckboxObserver.observe(el, {
        childList: true,
        subtree: true,
    });
}

function handleGridReady(e: GridReadyEvent) {
    gridApi.value = e.api;
    emit("grid-ready", e);
    e.api.addEventListener(
        "bodyScroll",
        handleBodyScroll as (event: BodyScrollEvent) => void,
    );
    e.api.addEventListener("displayedColumnsChanged", scheduleRemoveAgHeaderCheckboxPlaceholders);
    e.api.addEventListener("newColumnsLoaded", scheduleRemoveAgHeaderCheckboxPlaceholders);
    observeAgHeaderCheckboxPlaceholders();
    scheduleRemoveAgHeaderCheckboxPlaceholders();
}

onBeforeUnmount(() => {
    gridApi.value?.removeEventListener(
        "bodyScroll",
        handleBodyScroll as (event: BodyScrollEvent) => void,
    );
    gridApi.value?.removeEventListener("displayedColumnsChanged", scheduleRemoveAgHeaderCheckboxPlaceholders);
    gridApi.value?.removeEventListener("newColumnsLoaded", scheduleRemoveAgHeaderCheckboxPlaceholders);
    headerCheckboxObserver?.disconnect();
    headerCheckboxObserver = null;
});

function getAlignClass(align?: AppGridCellAlign) {
    if (!align) return "";
    return `app-grid-cell--align-${align}`;
}

function getVerticalAlignClass(align?: AppGridCellVerticalAlign) {
    if (!align) return "";
    return `app-grid-cell--valign-${align}`;
}

function toCellClassList(cellClass: unknown): string[] {
    if (!cellClass) return [];
    if (Array.isArray(cellClass)) {
        return cellClass.filter((className): className is string =>
            typeof className === "string" && Boolean(className),
        );
    }
    if (typeof cellClass === "string") return [cellClass];
    return [];
}

function mergeCellClass(col: AppGridColDef) {
    const alignClasses = [
        getAlignClass(col.cellAlign),
        getVerticalAlignClass(col.cellVerticalAlign),
    ].filter(Boolean);
    const cellClass = col.cellClass;

    if (!alignClasses.length) return cellClass;

    if (typeof cellClass === "function") {
        return (params: CellClassParams) => [
            ...toCellClassList(cellClass(params)),
            ...alignClasses,
        ];
    }

    return [...toCellClassList(cellClass), ...alignClasses];
}

function normalizeColumnDefs(columnDefs?: AppGridColDef[]) {
    if (!Array.isArray(columnDefs)) return columnDefs;

    return columnDefs.map((col) => {
        const usesAgCheckbox =
            Boolean(col.checkboxSelection) || Boolean(col.headerCheckboxSelection);
        const normalizedCol = {
            ...col,
            ...(usesAgCheckbox
                ? {
                    checkboxSelection: false,
                    headerCheckboxSelection: false,
                    headerCheckboxSelectionFilteredOnly: false,
                    headerCheckboxSelectionCurrentPageOnly: false,
                    headerComponent:
                        col.headerCheckboxSelection ? AppGridHeaderSelectionChoice : col.headerComponent,
                    cellRenderer:
                        col.checkboxSelection ? AppGridCellSelectionChoice : col.cellRenderer,
                    sortable: false,
                    filter: false,
                }
                : {}),
            cellClass: mergeCellClass(col),
        };

        if (!normalizedCol.cellRenderer || normalizedCol.cellDataType !== undefined) return normalizedCol;

        return {
            ...normalizedCol,
            cellDataType: false,
            valueFormatter:
                normalizedCol.valueFormatter ??
                ((params) => {
                    if (params.value == null) return "";
                    if (Array.isArray(params.value)) return params.value.join(", ");
                    if (typeof params.value === "object") return "";

                    return String(params.value);
                }),
        };
    });
}

function getSelectionColumn(selectionColumnDef?: GridOptions["selectionColumnDef"]): ColDef {
    return {
        colId: APP_CHOICE_SELECTION_COL_ID,
        width: 56,
        minWidth: 56,
        maxWidth: 56,
        sortable: false,
        filter: false,
        resizable: false,
        suppressMovable: true,
        ...(selectionColumnDef ?? {}),
        headerComponent:
            selectionColumnDef?.headerComponent ?? AppGridHeaderSelectionChoice,
        cellRenderer:
            selectionColumnDef?.cellRenderer ?? AppGridCellSelectionChoice,
    };
}

function hasSelectionColumn(columnDefs?: AppGridColDef[]) {
    return columnDefs?.some((col) => col.colId === APP_CHOICE_SELECTION_COL_ID);
}

function normalizeRowSelection(rowSelection?: GridOptions["rowSelection"]) {
    if (!rowSelection || typeof rowSelection === "string") return rowSelection;

    return {
        ...rowSelection,
        checkboxes: false,
        headerCheckbox: false,
        enableClickSelection: rowSelection.enableClickSelection ?? true,
    };
}

function toLegacyRowSelection(rowSelection?: GridOptions["rowSelection"]) {
    if (!rowSelection || typeof rowSelection === "string") return rowSelection;
    return rowSelection.mode === "singleRow" ? "single" : "multiple";
}

function shouldAddSelectionColumn(rowSelection?: GridOptions["rowSelection"]) {
    const normalizedRowSelection = rowSelection as AppGridRowSelectionOptions | undefined;

    return Boolean(
        normalizedRowSelection &&
        typeof normalizedRowSelection === "object" &&
        (normalizedRowSelection.checkboxes || normalizedRowSelection.headerCheckbox),
    );
}

function isClickSelectionEnabled(rowSelection?: GridOptions["rowSelection"]) {
    if (!rowSelection || typeof rowSelection === "string") return Boolean(rowSelection);
    return rowSelection.enableClickSelection !== false;
}

function toggleRowSelection(params: CellClickedEvent, rowSelection?: GridOptions["rowSelection"]) {
    if (!isClickSelectionEnabled(rowSelection)) return;
    if (params.colDef.colId === APP_CHOICE_SELECTION_COL_ID) return;

    const selected = !params.node.isSelected();
    const normalizedRowSelection = rowSelection as AppGridRowSelectionOptions | undefined;

    if (typeof normalizedRowSelection === "object" && normalizedRowSelection.mode === "singleRow") {
        params.node.setSelected(selected, true);
        return;
    }

    params.node.setSelected(selected);
}

function normalizeDefaultColDef(defaultColDef?: AppGridColDef) {
    return {
        cellDataType: false,
        ...defaultColDef,
        cellClass: defaultColDef ? mergeCellClass(defaultColDef) : undefined,
    };
}

function resolveNumberAttr(value: unknown, fallback: number): number {
    return typeof value === "number" ? value : fallback;
}

function toCssSize(value?: number | string) {
    if (typeof value === "number") return `${value}px`;
    return value;
}

const gridStyles = computed(() => ({
    width: "100%",
    ...(props.height && !props.autoHeight ? { height: toCssSize(props.height) } : {}),
}));

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
        rowselection: rowSelectionLower,
        selectionColumnDef,
        "selection-column-def": selectionColumnDefKebab,
        selectioncolumndef: selectionColumnDefLower,
        columnDefs,
        "column-defs": columnDefsKebab,
        columndefs: columnDefsLower,
        defaultColDef,
        "default-col-def": defaultColDefKebab,
        defaultcoldef: defaultColDefLower,
        onCellClicked,
        onFilterChanged,
        ...rest
    } = a;

    const id = (gridId ?? gridIdKebab) as string | undefined;
    const normalizedColumnDefs = normalizeColumnDefs(
        (columnDefs ?? columnDefsKebab ?? columnDefsLower) as AppGridColDef[] | undefined,
    );
    const normalizedDefaultColDef = normalizeDefaultColDef(
        (defaultColDef ?? defaultColDefKebab ?? defaultColDefLower) as AppGridColDef | undefined,
    );
    const resolvedDomLayout = (domLayout ??
        domLayoutKebab) as GridOptions["domLayout"];
    const resolvedGetRowHeight = getRowHeight ?? getRowHeightKebab;
    const resolvedHeaderHeight = headerHeight ?? headerHeightKebab;
    const resolvedRowHeight = rowHeight ?? rowHeightKebab;
    const resolvedRowSelection = (rowSelection ??
        rowSelectionKebab ??
        rowSelectionLower) as GridOptions["rowSelection"];
    const resolvedSelectionColumnDef = (selectionColumnDef ??
        selectionColumnDefKebab ??
        selectionColumnDefLower) as GridOptions["selectionColumnDef"];
    const shouldUseAppChoiceSelectionColumn =
        shouldAddSelectionColumn(resolvedRowSelection) &&
        !hasSelectionColumn(normalizedColumnDefs);
    const resolvedColumnDefs = shouldUseAppChoiceSelectionColumn
        ? [
            getSelectionColumn(resolvedSelectionColumnDef) as AppGridColDef,
            ...(normalizedColumnDefs ?? []),
        ]
        : normalizedColumnDefs;
    const finalRowSelection = shouldUseAppChoiceSelectionColumn
        ? toLegacyRowSelection(resolvedRowSelection)
        : normalizeRowSelection(resolvedRowSelection);
    const shouldEnableMultiSelectWithClick =
        shouldUseAppChoiceSelectionColumn &&
        typeof resolvedRowSelection === "object" &&
        resolvedRowSelection.mode === "multiRow";
    const shouldHandleClickSelection =
        shouldUseAppChoiceSelectionColumn &&
        isClickSelectionEnabled(resolvedRowSelection);

    return {
        ...rest,

        overlayLoadingTemplate: '<div class="ag-overlay-loading">로딩중...</div>',

        overlayNoRowsTemplate:
            '<div class="ag-overlay-no-rows">검색된 결과가 없습니다</div>',

        domLayout: props.autoHeight ? "autoHeight" : resolvedDomLayout,
        headerHeight: resolveNumberAttr(resolvedHeaderHeight, props.headerHeight),
        rowHeight: resolveNumberAttr(resolvedRowHeight, props.rowHeight),
        getRowHeight: resolvedGetRowHeight as GridOptions["getRowHeight"],
        ...(finalRowSelection ? { rowSelection: finalRowSelection } : {}),
        ...(shouldEnableMultiSelectWithClick ? { rowMultiSelectWithClick: true } : {}),
        ...(shouldHandleClickSelection ? { suppressRowClickSelection: true } : {}),
        ...(resolvedSelectionColumnDef && !shouldUseAppChoiceSelectionColumn
            ? { selectionColumnDef: resolvedSelectionColumnDef }
            : {}),
        defaultColDef: normalizedDefaultColDef,
        ...(resolvedColumnDefs ? { columnDefs: resolvedColumnDefs } : {}),

        onCellClicked(params: CellClickedEvent) {
            if (shouldHandleClickSelection) {
                toggleRowSelection(params, resolvedRowSelection);
            }

            if (typeof onCellClicked === "function") {
                onCellClicked(params);
            }
        },

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
    return attrs.localeText as GridOptions["localeText"];
});
</script>
