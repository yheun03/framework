<template>
    <div class="app-data-table" :class="[`app-data-table--${variant}`, `app-data-table--${size}`, { 'is-hoverable': hoverable }]" :style="rootStyle">
        <div v-if="title || $slots.toolbar" class="app-data-table__head">
            <strong v-if="title" class="app-data-table__title">{{ title }}</strong>
            <span v-if="showTotal" class="app-data-table__total"
                >{{ $t('ui.totalPrefix') }} <b>{{ (total ?? items.length).toLocaleString() }}</b
                >{{ $t('ui.totalSuffix') }}</span
            >
            <div v-if="$slots.toolbar" class="app-data-table__toolbar"><slot name="toolbar" /></div>
        </div>

        <div class="app-data-table__scroll" :style="scrollStyle">
            <table class="app-data-table__table" :style="tableStyle">
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
                                :aria-label="$t('ui.table.selectAll')"
                                @update:model-value="toggleAll"
                            />
                        </th>
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            scope="col"
                            :class="[`is-${column.align ?? 'center'}`, { 'is-sortable': column.sortable }]"
                            :aria-sort="currentSort.key === column.key ? (currentSort.order === 'asc' ? 'ascending' : 'descending') : undefined"
                        >
                            <AppButton v-if="column.sortable" unstyled class="app-data-table__sort-button" @click="toggleSort(column.key)">
                                {{ column.label }}
                                <span
                                    class="app-data-table__sort"
                                    :class="currentSort.key === column.key && `is-${currentSort.order}`"
                                    aria-hidden="true"
                                />
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
                        :tabindex="clickable ? 0 : undefined"
                        @click="clickable && emit('row-click', row, rowIndex)"
                        @keydown.enter.self="clickable && emit('row-click', row, rowIndex)"
                    >
                        <td v-if="selectable" class="app-data-table__check" @click.stop>
                            <AppChoice
                                :model-value="isSelected(row)"
                                :aria-label="$t('ui.table.selectRow', { n: rowIndex + 1 })"
                                @update:model-value="toggleRow(row)"
                            />
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
                                <AppEmpty size="sm" :title="error ? $t('ui.table.loadError') : (emptyText ?? $t('ui.empty.data'))" />
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { FORM_SIZES, oneOf } from '@/utils/props';
import { toCssSize, toCssWidth, toSizeStyle } from '@/utils/css';
import { computed, ref } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppChoice from '@/components/AppChoice.vue';
import AppEmpty from '@/components/AppEmpty.vue';

/**
 * AppDataTable (Figma 13. Table Guide - 게시판 형태의 테이블 / 라인·면 구분 테이블)
 * AG Grid 없이 HTML table 로 가볍게 쓰는 목록 테이블입니다.
 * 셀 커스텀: <template #cell-{key}="{ row, value }">
 * 정렬: v-model:sort 를 주면 서버 정렬(헤더 클릭 → sort 값만 바꾸고 행은 그대로), 없으면 지금 받은 행만 화면에서 정렬합니다.
 *       서버 페이지 목록은 반드시 v-model:sort (useSearchList 의 sort) - 화면 정렬은 현재 페이지 안에서만 정렬되기 때문입니다.
 */
const props = defineProps({
    columns: { type: Array, required: true },
    items: { type: Array, required: true },
    /** 행 고유키 (선택/키 바인딩) */
    rowKey: { type: String, default: 'id' },
    title: { type: String, default: '' },
    caption: { type: String, default: '' },
    /** board(게시판형, 헤더 면) / line(상단 진한 라인) / stripe(짝수행 면) / border(셀 경계선) */
    variant: { type: String, default: 'board', validator: oneOf(['board', 'line', 'stripe', 'border']) },
    /** 행 높이 sm 36 · md 44 · lg 48 · xl 56 (Button · Input 과 같은 이름) */
    size: { type: String, default: 'lg', validator: oneOf(FORM_SIZES) },
    /** v-model: 선택된 rowKey 배열 (selectable 일 때) */
    modelValue: { type: Array, default: () => [] },
    selectable: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
    hoverable: { type: Boolean, default: true },
    showTotal: { type: Boolean, default: false },
    /** 총 건수 (페이지네이션 시 전체 건수, 미지정 시 items.length) */
    total: { type: Number, default: undefined },
    /** 기본 '조회된 데이터가 없습니다.' (i18n ui.empty.data) */
    emptyText: { type: String, default: undefined },
    width: { type: [Number, String] },
    /** 지정 시 tbody 영역 세로 스크롤 + 헤더 고정 */
    height: { type: [Number, String] },
    /** v-model:sort - { key, order: 'asc' | 'desc' } | null. 주면 서버 정렬 (행을 직접 정렬하지 않음) */
    sort: { type: Object, default: undefined },
    /** 조회 실패 - 빈 목록 대신 '목록을 불러오지 못했습니다.' (useSearchList 의 error) */
    error: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'update:sort', 'row-click', 'sort']);

// 화면 정렬일 때만 쓰는 내부 상태 (v-model:sort 가 없을 때)
const localSort = ref({ key: null, order: 'asc' });
const isServerSort = computed(() => props.sort !== undefined);
const currentSort = computed(() => (isServerSort.value ? (props.sort ?? { key: null, order: 'asc' }) : localSort.value));
const rootStyle = computed(() => toSizeStyle(props.width));

// 좁은 화면(태블릿)에서 너비 없는 컬럼이 0 으로 줄어들지 않게 최소 너비를 두고, 넘치면 가로 스크롤합니다.
const AUTO_COLUMN_MIN_WIDTH = 160;
const tableStyle = computed(() => {
    const fixed = props.columns.reduce((sum, column) => sum + (typeof column.width === 'number' ? column.width : 0), 0);
    const autoCount = props.columns.filter((column) => typeof column.width !== 'number').length;
    return { minWidth: `${fixed + autoCount * AUTO_COLUMN_MIN_WIDTH + (props.selectable ? 48 : 0)}px` };
});
const scrollStyle = computed(() => (props.height ? { maxHeight: toCssSize(props.height) } : undefined));

const sortedItems = computed(() => {
    if (isServerSort.value || !localSort.value.key) return props.items;
    const { key } = localSort.value;
    const direction = localSort.value.order === 'asc' ? 1 : -1;
    return [...props.items].sort((a, b) => {
        const left = a[key];
        const right = b[key];
        if (left === right) return 0;
        return (left > right ? 1 : -1) * direction;
    });
});

const selectedKeys = computed(() => new Set(props.modelValue));
const isAllSelected = computed(() => props.items.length > 0 && props.items.every((row) => selectedKeys.value.has(row[props.rowKey])));
const isPartSelected = computed(() => !isAllSelected.value && props.items.some((row) => selectedKeys.value.has(row[props.rowKey])));

function isSelected(row) {
    return selectedKeys.value.has(row[props.rowKey]);
}

function toggleRow(row) {
    const key = row[props.rowKey];
    const next = isSelected(row) ? props.modelValue.filter((value) => value !== key) : [...props.modelValue, key];
    emit('update:modelValue', next);
}

function toggleAll() {
    emit('update:modelValue', isAllSelected.value ? [] : props.items.map((row) => row[props.rowKey]));
}

function toggleSort(key) {
    const { key: currentKey, order } = currentSort.value;
    const next = { key, order: currentKey === key && order === 'asc' ? 'desc' : 'asc' };
    if (isServerSort.value) emit('update:sort', next);
    else localSort.value = next;
    emit('sort', next);
}

function formatCell(row, column) {
    const value = row[column.key];
    if (column.format) return column.format(value, row);
    if (typeof value === 'number') return value.toLocaleString();
    return value ?? '-';
}
</script>
