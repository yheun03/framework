<template>
    <AgGridVue v-bind="gridAttrs" :locale-text="localeText" :class="gridClasses" @grid-ready="onGridReady" />
</template>

<script setup lang="ts">
defineOptions({
    ssr: false
})
import { AgGridVue } from 'ag-grid-vue3'
import type { ColDef, GridApi, GridOptions, GridReadyEvent, FilterChangedEvent, BodyScrollEvent } from 'ag-grid-community'
import { useAgGridRegistry } from '~/composables/useAgGridRegistry'

const APP_SELECT_CLOSE_ALL_EVENT = 'app-select:close-all'
const { register } = useAgGridRegistry()

const { $agGridLocale } = useNuxtApp()
const attrs = useAttrs()
const gridApi = ref<GridApi | null>(null)
const props = withDefaults(
    defineProps<{
        autoHeight?: boolean
        headerHeight?: number
        rowHeight?: number
    }>(),
    {
        autoHeight: false,
        headerHeight: 40,
        rowHeight: 48
    }
)

function closeOpenSelects() {
    window.dispatchEvent(new Event(APP_SELECT_CLOSE_ALL_EVENT))
}

function onBodyScroll() {
    closeOpenSelects()
}

function onGridReady(e: GridReadyEvent) {
    gridApi.value = e.api
    e.api.addEventListener('bodyScroll', onBodyScroll as (event: BodyScrollEvent) => void)

    const id = e.api.getGridId()

    if (!id) {
        console.warn('gridId missing')
        return
    }

    register(id, e.api)
}

onBeforeUnmount(() => {
    gridApi.value?.removeEventListener('bodyScroll', onBodyScroll as (event: BodyScrollEvent) => void)
})

function normalizeColumnDefs(columnDefs?: ColDef[]) {
    if (!Array.isArray(columnDefs)) return columnDefs

    return columnDefs.map((col) => {
        if (!col.cellRenderer || col.cellDataType !== undefined) return col

        return {
            ...col,
            cellDataType: false,
            valueFormatter: col.valueFormatter ?? ((params) => {
                if (params.value == null) return ''
                if (Array.isArray(params.value)) return params.value.join(', ')
                if (typeof params.value === 'object') return ''

                return String(params.value)
            })
        }
    })
}

function normalizeDefaultColDef(defaultColDef?: ColDef) {
    return {
        cellDataType: false,
        ...defaultColDef
    }
}

/* attrs -> grid-id 전달 */

const gridAttrs = computed(() => {

    const a = attrs as Record<string, any>

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
        columnDefs,
        'column-defs': columnDefsKebab,
        defaultColDef,
        'default-col-def': defaultColDefKebab,
        onFilterChanged,
        ...rest
    } = a

    const id = gridId ?? gridIdKebab
    const normalizedColumnDefs = normalizeColumnDefs(columnDefs ?? columnDefsKebab)
    const normalizedDefaultColDef = normalizeDefaultColDef(defaultColDef ?? defaultColDefKebab)
    const resolvedDomLayout = domLayout ?? domLayoutKebab
    const resolvedGetRowHeight = getRowHeight ?? getRowHeightKebab
    const resolvedHeaderHeight = headerHeight ?? headerHeightKebab
    const resolvedRowHeight = rowHeight ?? rowHeightKebab
    const resolvedRowSelection = rowSelection ?? rowSelectionKebab

    return {
        ...rest,

        overlayLoadingTemplate:
            '<div class="ag-overlay-loading">로딩중...</div>',

        overlayNoRowsTemplate:
            '<div class="ag-overlay-no-rows">검색된 결과가 없습니다</div>',

        domLayout: props.autoHeight ? 'autoHeight' : resolvedDomLayout,
        headerHeight: resolvedHeaderHeight ?? props.headerHeight,
        rowHeight: resolvedRowHeight ?? props.rowHeight,
        getRowHeight: resolvedGetRowHeight,
        ...(resolvedRowSelection ? { rowSelection: resolvedRowSelection } : {}),
        defaultColDef: normalizedDefaultColDef,
        ...(normalizedColumnDefs ? { columnDefs: normalizedColumnDefs } : {}),

        onFilterChanged(params: FilterChangedEvent) {

            const api = params.api

            if (api.getDisplayedRowCount() === 0 && api.isAnyFilterPresent()) {
                api.showNoRowsOverlay()
            } else {
                api.hideOverlay()
            }

            if (typeof onFilterChanged === 'function') {
                onFilterChanged(params)
            }

        },

        gridId: id
    }

})

const gridClasses = computed(() => [
    'ag-theme-quartz',
    'app-grid',
    {
        'app-grid--auto-height': props.autoHeight
    },
    attrs.class
])

const localeText = computed<GridOptions['localeText']>(() => {
    return (attrs.localeText as GridOptions['localeText']) ?? $agGridLocale
})
</script>
