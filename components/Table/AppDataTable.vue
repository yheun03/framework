<template>
    <div class="app-data-table" :class="[`app-data-table--${variant}`, `app-data-table--${size}`, { 'is-hoverable': hoverable }]" :style="rootStyle">
        <div v-if="title || $slots.toolbar" class="app-data-table__head">
            <strong v-if="title" class="app-data-table__title">{{ title }}</strong>
            <span v-if="showTotal" class="app-data-table__total"
                >총 <b>{{ (total ?? items.length).toLocaleString() }}</b
                >건</span
            >
            <div v-if="$slots.toolbar" class="app-data-table__toolbar"><slot name="toolbar" /></div>
        </div>

        <div class="app-data-table__scroll" :style="scrollStyle">
            <table class="app-data-table__table">
                <caption v-if="caption" class="sr-only">
                    {{
                        caption
                    }}
                </caption>
                <colgroup>
                    <col v-if="selectable" style="width: 48px" />
                    <col v-for="column in columns" :key="column.key" :style="column.width ? { width: toCssWidth(column.width) } : undefined" />
                </colgroup>
                <thead>
                    <tr>
                        <th v-if="selectable" scope="col" class="app-data-table__check">
                            <AppChoice
                                :model-value="isAllSelected"
                                :indeterminate="isPartSelected"
                                :disabled="!items.length"
                                @update:model-value="toggleAll"
                            />
                        </th>
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            scope="col"
                            :class="[`is-${column.align ?? 'center'}`, { 'is-sortable': column.sortable }]"
                            :aria-sort="sortKey === column.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined"
                        >
                            <AppButton v-if="column.sortable" unstyled class="app-data-table__sort-button" @click="toggleSort(column.key)">
                                {{ column.label }}
                                <span class="app-data-table__sort" :class="sortKey === column.key && `is-${sortOrder}`" aria-hidden="true" />
                            </AppButton>
                            <template v-else>{{ column.label }}</template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, rowIndex) in sortedItems"
                        :key="String(row[rowKey] ?? rowIndex)"
                        :class="{ 'is-selected': isSelected(row), 'is-clickable': clickable }"
                        @click="clickable && emit('row-click', row, rowIndex)"
                    >
                        <td v-if="selectable" class="app-data-table__check" @click.stop>
                            <AppChoice :model-value="isSelected(row)" @update:model-value="toggleRow(row)" />
                        </td>
                        <td v-for="column in columns" :key="column.key" :class="`is-${column.align ?? 'center'}`">
                            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :index="rowIndex">
                                {{ formatCell(row, column) }}
                            </slot>
                        </td>
                    </tr>
                    <tr v-if="!items.length">
                        <td :colspan="columns.length + (selectable ? 1 : 0)" class="app-data-table__empty">
                            <slot name="empty">
                                <AppEmpty size="sm" :title="emptyText" />
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AppWidth } from '~/types/appCommon';
import { toCssSize, toCssWidth, toSizeStyle } from '~/utils/css';

export type AppDataTableColumn = {
    key: string;
    label: string;
    width?: AppWidth;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    /** 값 표시 변환 (천단위 콤마 등) */
    format?: (value: unknown, row: Record<string, unknown>) => string;
};

type Row = Record<string, unknown>;

/**
 * AppDataTable (Figma 13. Table Guide - 게시판 형태의 테이블 / 라인·면 구분 테이블)
 * AG Grid 없이 HTML table 로 가볍게 쓰는 목록 테이블입니다.
 * 셀 커스텀: <template #cell-{key}="{ row, value }">
 */
const props = withDefaults(
    defineProps<{
        columns: AppDataTableColumn[];
        items: Row[];
        /** 행 고유키 (선택/키 바인딩) */
        rowKey?: string;
        title?: string;
        caption?: string;
        /** board(게시판형, 헤더 면) / line(상단 진한 라인) / stripe(짝수행 면) / border(셀 경계선) */
        variant?: 'board' | 'line' | 'stripe' | 'border';
        size?: 'sm' | 'md' | 'lg';
        /** v-model: 선택된 rowKey 배열 (selectable 일 때) */
        modelValue?: unknown[];
        selectable?: boolean;
        clickable?: boolean;
        hoverable?: boolean;
        showTotal?: boolean;
        /** 총 건수 (페이지네이션 시 전체 건수, 미지정 시 items.length) */
        total?: number;
        emptyText?: string;
        width?: AppWidth;
        /** 지정 시 tbody 영역 세로 스크롤 + 헤더 고정 */
        height?: AppWidth;
    }>(),
    {
        rowKey: 'id',
        title: '',
        caption: '',
        variant: 'board',
        size: 'md',
        modelValue: () => [],
        selectable: false,
        clickable: false,
        hoverable: true,
        showTotal: false,
        total: undefined,
        emptyText: '조회된 데이터가 없습니다.',
    },
);

const emit = defineEmits<{
    'update:modelValue': [unknown[]];
    'row-click': [Row, number];
    sort: [{ key: string; order: 'asc' | 'desc' }];
}>();

const sortKey = ref<string | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');
const rootStyle = computed(() => toSizeStyle(props.width));
const scrollStyle = computed(() => (props.height ? { maxHeight: toCssSize(props.height) } : undefined));

const sortedItems = computed(() => {
    if (!sortKey.value) return props.items;
    const key = sortKey.value;
    const direction = sortOrder.value === 'asc' ? 1 : -1;
    return [...props.items].sort((a, b) => {
        const left = a[key] as string | number;
        const right = b[key] as string | number;
        if (left === right) return 0;
        return (left > right ? 1 : -1) * direction;
    });
});

const selectedKeys = computed(() => new Set(props.modelValue));
const isAllSelected = computed(() => props.items.length > 0 && props.items.every((row) => selectedKeys.value.has(row[props.rowKey])));
const isPartSelected = computed(() => !isAllSelected.value && props.items.some((row) => selectedKeys.value.has(row[props.rowKey])));

function isSelected(row: Row) {
    return selectedKeys.value.has(row[props.rowKey]);
}

function toggleRow(row: Row) {
    const key = row[props.rowKey];
    const next = isSelected(row) ? props.modelValue.filter((value) => value !== key) : [...props.modelValue, key];
    emit('update:modelValue', next);
}

function toggleAll() {
    emit('update:modelValue', isAllSelected.value ? [] : props.items.map((row) => row[props.rowKey]));
}

function toggleSort(key: string) {
    if (sortKey.value === key) sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
    emit('sort', { key, order: sortOrder.value });
}

function formatCell(row: Row, column: AppDataTableColumn) {
    const value = row[column.key];
    if (column.format) return column.format(value, row);
    if (typeof value === 'number') return value.toLocaleString();
    return value ?? '-';
}
</script>
