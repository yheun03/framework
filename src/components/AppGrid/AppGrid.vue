<template>
    <AgGridVue ref="gridRef" v-bind="gridAttrs" :locale-text="localeText" :class="gridClasses" :style="gridStyles" @grid-ready="handleGridReady" />
</template>

<script setup>
import i18n from '@/i18n';
defineOptions({
    inheritAttrs: false,
});
// AG Grid 는 그리드를 쓰는 화면에서만 불러옵니다. (main.js 전역 등록 시 모든 화면 첫 로딩에 포함됨)
import {
    CellStyleModule,
    ClientSideRowModelApiModule,
    ClientSideRowModelModule,
    ColumnApiModule,
    ColumnAutoSizeModule,
    DateFilterModule,
    EventApiModule,
    LocaleModule,
    ModuleRegistry,
    NumberEditorModule,
    NumberFilterModule,
    RenderApiModule,
    RowApiModule,
    RowAutoHeightModule,
    RowSelectionModule,
    RowStyleModule,
    ScrollApiModule,
    TextEditorModule,
    TextFilterModule,
    TooltipModule,
    ValidationModule,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridVue } from 'ag-grid-vue3';

// 쓰는 기능만 등록합니다. (AllCommunityModule 전체 대비 그리드 조각이 작아짐)
// 새 기능을 쓰면 개발 모드 콘솔의 'AG Grid: error #200 … Module' 안내대로 여기 한 줄 추가합니다. (ValidationModule 은 개발 모드에서만)
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ClientSideRowModelApiModule,
    RowSelectionModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    TextEditorModule,
    NumberEditorModule,
    CellStyleModule,
    RowStyleModule,
    RowAutoHeightModule,
    ColumnAutoSizeModule,
    TooltipModule,
    LocaleModule,
    RowApiModule,
    ColumnApiModule,
    ScrollApiModule,
    RenderApiModule,
    EventApiModule,
    ...(import.meta.env.DEV ? [ValidationModule] : []),
]);

import AppGridCellSelectionChoice from '@/components/AppGrid/Cell/AppGridCellSelectionChoice.vue';
import AppGridHeaderSelectionChoice from '@/components/AppGrid/Header/AppGridHeaderSelectionChoice.vue';
import { computed, nextTick, onBeforeUnmount, ref, useAttrs } from 'vue';

const APP_SELECT_CLOSE_ALL_EVENT = 'app-select:close-all';
const APP_CHOICE_SELECTION_COL_ID = 'appChoiceSelection';

const attrs = useAttrs();
const gridRef = ref(null);
const gridApi = ref(null);
let headerCheckboxObserver = null;
const props = defineProps({
    autoHeight: { type: Boolean, default: false },
    headerHeight: { type: Number, default: 40 },
    rowHeight: { type: Number, default: 48 },
    height: { type: [Number, String], default: undefined },
});

const emit = defineEmits(['grid-ready']);

function handleCloseOpenSelects() {
    window.dispatchEvent(new Event(APP_SELECT_CLOSE_ALL_EVENT));
}

function handleBodyScroll() {
    handleCloseOpenSelects();
}

function removeAgHeaderCheckboxPlaceholders() {
    const el = gridRef.value?.$el;

    if (!el) return;

    el.querySelectorAll('.ag-header-select-all.ag-hidden').forEach((node) => {
        node.remove();
    });
}

function scheduleRemoveAgHeaderCheckboxPlaceholders() {
    nextTick(() => {
        removeAgHeaderCheckboxPlaceholders();
    });
}

// 헤더 영역만 감시하고, 한 프레임에 한 번만 정리합니다. (그리드 전체를 감시하면 스크롤로 행이 그려질 때마다 실행되어 느려짐)
let cleanupFrame = 0;
function scheduleCleanupInFrame() {
    if (cleanupFrame) return;
    cleanupFrame = requestAnimationFrame(() => {
        cleanupFrame = 0;
        removeAgHeaderCheckboxPlaceholders();
    });
}

function observeAgHeaderCheckboxPlaceholders() {
    const el = gridRef.value?.$el;

    if (!el || headerCheckboxObserver) return;

    headerCheckboxObserver = new MutationObserver(scheduleCleanupInFrame);
    headerCheckboxObserver.observe(el.querySelector('.ag-header') ?? el, {
        childList: true,
        subtree: true,
    });
}

function handleGridReady(e) {
    gridApi.value = e.api;
    emit('grid-ready', e);
    e.api.addEventListener('bodyScroll', handleBodyScroll);
    e.api.addEventListener('displayedColumnsChanged', scheduleRemoveAgHeaderCheckboxPlaceholders);
    e.api.addEventListener('newColumnsLoaded', scheduleRemoveAgHeaderCheckboxPlaceholders);
    observeAgHeaderCheckboxPlaceholders();
    scheduleRemoveAgHeaderCheckboxPlaceholders();
}

onBeforeUnmount(() => {
    gridApi.value?.removeEventListener('bodyScroll', handleBodyScroll);
    gridApi.value?.removeEventListener('displayedColumnsChanged', scheduleRemoveAgHeaderCheckboxPlaceholders);
    gridApi.value?.removeEventListener('newColumnsLoaded', scheduleRemoveAgHeaderCheckboxPlaceholders);
    headerCheckboxObserver?.disconnect();
    headerCheckboxObserver = null;
    cancelAnimationFrame(cleanupFrame);
});

function getAlignClass(align) {
    if (!align) return '';
    return `app-grid-cell--align-${align}`;
}

function getVerticalAlignClass(align) {
    if (!align) return '';
    return `app-grid-cell--valign-${align}`;
}

function toCellClassList(cellClass) {
    if (!cellClass) return [];
    if (Array.isArray(cellClass)) {
        return cellClass.filter((className) => typeof className === 'string' && Boolean(className));
    }
    if (typeof cellClass === 'string') return [cellClass];
    return [];
}

function mergeCellClass(col) {
    const alignClasses = [getAlignClass(col.cellAlign), getVerticalAlignClass(col.cellVerticalAlign)].filter(Boolean);
    const cellClass = col.cellClass;

    if (!alignClasses.length) return cellClass;

    if (typeof cellClass === 'function') {
        return (params) => [...toCellClassList(cellClass(params)), ...alignClasses];
    }

    return [...toCellClassList(cellClass), ...alignClasses];
}

function normalizeColumnDefs(columnDefs) {
    if (!Array.isArray(columnDefs)) return columnDefs;

    return columnDefs.map((rawCol) => {
        // cellAlign · cellVerticalAlign 은 AppGrid 전용 속성 → cellClass 로 바꾸고 AG Grid 에는 넘기지 않음 (invalid colDef 경고 방지)
        const { cellAlign: _cellAlign, cellVerticalAlign: _cellVerticalAlign, ...col } = rawCol;
        const usesAgCheckbox = Boolean(col.checkboxSelection) || Boolean(col.headerCheckboxSelection);
        const normalizedCol = {
            ...col,
            ...(usesAgCheckbox
                ? {
                      checkboxSelection: false,
                      headerCheckboxSelection: false,
                      headerCheckboxSelectionFilteredOnly: false,
                      headerCheckboxSelectionCurrentPageOnly: false,
                      headerComponent: col.headerCheckboxSelection ? AppGridHeaderSelectionChoice : col.headerComponent,
                      cellRenderer: col.checkboxSelection ? AppGridCellSelectionChoice : col.cellRenderer,
                      sortable: false,
                      filter: false,
                  }
                : {}),
            cellClass: mergeCellClass(rawCol),
        };

        if (!normalizedCol.cellRenderer || normalizedCol.cellDataType !== undefined) return normalizedCol;

        return {
            ...normalizedCol,
            cellDataType: false,
            valueFormatter:
                normalizedCol.valueFormatter ??
                ((params) => {
                    if (params.value == null) return '';
                    if (Array.isArray(params.value)) return params.value.join(', ');
                    if (typeof params.value === 'object') return '';

                    return String(params.value);
                }),
        };
    });
}

function getSelectionColumn(selectionColumnDef) {
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
        headerComponent: selectionColumnDef?.headerComponent ?? AppGridHeaderSelectionChoice,
        cellRenderer: selectionColumnDef?.cellRenderer ?? AppGridCellSelectionChoice,
    };
}

function hasSelectionColumn(columnDefs) {
    return columnDefs?.some((col) => col.colId === APP_CHOICE_SELECTION_COL_ID);
}

function normalizeRowSelection(rowSelection) {
    if (!rowSelection || typeof rowSelection === 'string') return rowSelection;

    return {
        ...rowSelection,
        checkboxes: false,
        headerCheckbox: false,
        enableClickSelection: rowSelection.enableClickSelection ?? true,
    };
}

// AppChoice 선택 컬럼을 쓸 때: AG Grid 기본 체크박스 · 클릭 선택은 끄고, 행 클릭 선택은 onCellClicked 에서 직접 처리합니다.
// (AG Grid v32.2+ 객체 방식 - 폐지 예정인 'single' | 'multiple' · rowMultiSelectWithClick · suppressRowClickSelection 대체)
function toCustomColumnRowSelection(rowSelection) {
    if (!rowSelection || typeof rowSelection === 'string') return rowSelection;
    return {
        mode: rowSelection.mode === 'singleRow' ? 'singleRow' : 'multiRow',
        checkboxes: false,
        headerCheckbox: false,
        enableClickSelection: false,
        ...(rowSelection.mode === 'singleRow' ? {} : { enableSelectionWithoutKeys: true }),
    };
}

function shouldAddSelectionColumn(rowSelection) {
    const normalizedRowSelection = rowSelection;

    return Boolean(
        normalizedRowSelection &&
        typeof normalizedRowSelection === 'object' &&
        (normalizedRowSelection.checkboxes || normalizedRowSelection.headerCheckbox),
    );
}

function isClickSelectionEnabled(rowSelection) {
    if (!rowSelection || typeof rowSelection === 'string') return Boolean(rowSelection);
    return rowSelection.enableClickSelection !== false;
}

function toggleRowSelection(params, rowSelection) {
    if (!isClickSelectionEnabled(rowSelection)) return;
    if (params.colDef.colId === APP_CHOICE_SELECTION_COL_ID) return;

    const selected = !params.node.isSelected();
    const normalizedRowSelection = rowSelection;

    if (typeof normalizedRowSelection === 'object' && normalizedRowSelection.mode === 'singleRow') {
        params.node.setSelected(selected, true);
        return;
    }

    params.node.setSelected(selected);
}

function normalizeDefaultColDef(defaultColDef) {
    const { cellAlign: _cellAlign, cellVerticalAlign: _cellVerticalAlign, ...rest } = defaultColDef ?? {};
    return {
        cellDataType: false,
        ...rest,
        cellClass: defaultColDef ? mergeCellClass(defaultColDef) : undefined,
    };
}

function resolveNumberAttr(value, fallback) {
    return typeof value === 'number' ? value : fallback;
}

function toCssSize(value) {
    if (typeof value === 'number') return `${value}px`;
    return value;
}

const gridStyles = computed(() => ({
    width: '100%',
    ...(props.height && !props.autoHeight ? { height: toCssSize(props.height) } : {}),
}));

/* attrs -> grid-id 전달 */

const gridAttrs = computed(() => {
    const a = attrs;

    const {
        localeText: _,
        class: __,
        gridId,
        'grid-id': gridIdKebab,
        domLayout,
        'dom-layout': domLayoutKebab,
        headerHeight,
        'header-height': headerHeightKebab,
        rowHeight,
        'row-height': rowHeightKebab,
        getRowHeight,
        'get-row-height': getRowHeightKebab,
        rowSelection,
        'row-selection': rowSelectionKebab,
        rowselection: rowSelectionLower,
        selectionColumnDef,
        'selection-column-def': selectionColumnDefKebab,
        selectioncolumndef: selectionColumnDefLower,
        columnDefs,
        'column-defs': columnDefsKebab,
        columndefs: columnDefsLower,
        defaultColDef,
        'default-col-def': defaultColDefKebab,
        defaultcoldef: defaultColDefLower,
        onCellClicked,
        onFilterChanged,
        ...rest
    } = a;

    const id = gridId ?? gridIdKebab;
    const normalizedColumnDefs = normalizeColumnDefs(columnDefs ?? columnDefsKebab ?? columnDefsLower);
    const normalizedDefaultColDef = normalizeDefaultColDef(defaultColDef ?? defaultColDefKebab ?? defaultColDefLower);
    const resolvedDomLayout = domLayout ?? domLayoutKebab;
    const resolvedGetRowHeight = getRowHeight ?? getRowHeightKebab;
    const resolvedHeaderHeight = headerHeight ?? headerHeightKebab;
    const resolvedRowHeight = rowHeight ?? rowHeightKebab;
    const resolvedRowSelection = rowSelection ?? rowSelectionKebab ?? rowSelectionLower;
    const resolvedSelectionColumnDef = selectionColumnDef ?? selectionColumnDefKebab ?? selectionColumnDefLower;
    const shouldUseAppChoiceSelectionColumn = shouldAddSelectionColumn(resolvedRowSelection) && !hasSelectionColumn(normalizedColumnDefs);
    const resolvedColumnDefs = shouldUseAppChoiceSelectionColumn
        ? [getSelectionColumn(resolvedSelectionColumnDef), ...(normalizedColumnDefs ?? [])]
        : normalizedColumnDefs;
    const finalRowSelection = shouldUseAppChoiceSelectionColumn
        ? toCustomColumnRowSelection(resolvedRowSelection)
        : normalizeRowSelection(resolvedRowSelection);
    const shouldHandleClickSelection = shouldUseAppChoiceSelectionColumn && isClickSelectionEnabled(resolvedRowSelection);

    return {
        ...rest,

        overlayLoadingTemplate: `<div class="ag-overlay-loading">${i18n.global.t('ui.loadingOverlay')}</div>`,

        overlayNoRowsTemplate: `<div class="ag-overlay-no-rows">${i18n.global.t('ui.grid.noRows')}</div>`,

        domLayout: props.autoHeight ? 'autoHeight' : resolvedDomLayout,
        headerHeight: resolveNumberAttr(resolvedHeaderHeight, props.headerHeight),
        rowHeight: resolveNumberAttr(resolvedRowHeight, props.rowHeight),
        getRowHeight: resolvedGetRowHeight,
        ...(finalRowSelection ? { rowSelection: finalRowSelection } : {}),
        ...(resolvedSelectionColumnDef && !shouldUseAppChoiceSelectionColumn ? { selectionColumnDef: resolvedSelectionColumnDef } : {}),
        defaultColDef: normalizedDefaultColDef,
        ...(resolvedColumnDefs ? { columnDefs: resolvedColumnDefs } : {}),

        onCellClicked(params) {
            if (shouldHandleClickSelection) {
                toggleRowSelection(params, resolvedRowSelection);
            }

            if (typeof onCellClicked === 'function') {
                onCellClicked(params);
            }
        },

        onFilterChanged(params) {
            const api = params.api;

            if (api.getDisplayedRowCount() === 0 && api.isAnyFilterPresent()) {
                api.showNoRowsOverlay();
            } else {
                api.hideOverlay();
            }

            if (typeof onFilterChanged === 'function') {
                onFilterChanged(params);
            }
        },

        gridId: id,
    };
});

const gridClasses = computed(() => [
    'ag-theme-quartz',
    'app-grid',
    {
        'app-grid--auto-height': props.autoHeight,
    },
    attrs.class,
]);

const localeText = computed(() => {
    return attrs.localeText;
});
</script>
