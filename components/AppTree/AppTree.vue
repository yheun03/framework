<template>
    <div class="app-tree" :class="[`app-tree--${size}`, { 'is-guide': guide }]" role="tree" :aria-multiselectable="checkable || undefined">
        <AppTreeNode v-for="item in visibleItems" :key="item.id" :item="item" :depth="0" />
        <AppEmpty v-if="!visibleItems.length" size="sm" type="search" :title="emptyText" :show-icon="false" />
    </div>
</template>

<script setup lang="ts">
import type { AppId, AppInitial } from '~/types/appCommon';
import { APP_TREE_KEY, type AppTreeItem } from '~/types/appTree';

/**
 * AppTree - BOM / 공정 / 조직 / 메뉴 트리
 * v-model: 선택된 id,  v-model:checked: 체크된 id 배열(checkable)
 */
const props = withDefaults(
    defineProps<{
        items: AppTreeItem[];
        modelValue?: AppId | null;
        checked?: AppId[];
        checkable?: boolean;
        /** 최초 펼침: none / first(1depth) / all */
        initial?: AppInitial;
        /** 라벨 검색어 - 일치 항목과 상위 경로만 노출 */
        filter?: string;
        /** 들여쓰기 가이드 라인 */
        guide?: boolean;
        size?: 'sm' | 'md';
        emptyText?: string;
    }>(),
    {
        modelValue: null,
        checked: () => [],
        checkable: false,
        initial: 'first',
        filter: '',
        guide: true,
        size: 'md',
        emptyText: '검색 결과가 없습니다.',
    },
);

const emit = defineEmits<{
    'update:modelValue': [AppId | null];
    'update:checked': [AppId[]];
    select: [AppTreeItem];
}>();

function collectIds(items: AppTreeItem[], depthLimit: number, depth = 0): AppId[] {
    return items.flatMap((item) =>
        item.children?.length && depth <= depthLimit ? [item.id, ...collectIds(item.children, depthLimit, depth + 1)] : [],
    );
}

function collectAll(item: AppTreeItem): AppId[] {
    return [item.id, ...(item.children ?? []).flatMap(collectAll)];
}

const expanded = ref<Set<AppId>>(
    new Set(props.initial === 'all' ? collectIds(props.items, Infinity) : props.initial === 'first' ? collectIds(props.items, 0) : []),
);

function filterItems(items: AppTreeItem[], keyword: string): AppTreeItem[] {
    if (!keyword) return items;
    return items.flatMap((item) => {
        const children = filterItems(item.children ?? [], keyword);
        if (item.label.toLowerCase().includes(keyword) || children.length) return [{ ...item, children }];
        return [];
    });
}

const keyword = computed(() => props.filter.trim().toLowerCase());
const visibleItems = computed(() => filterItems(props.items, keyword.value));
const checkedSet = computed(() => new Set(props.checked));

function isExpanded(id: AppId) {
    return Boolean(keyword.value) || expanded.value.has(id);
}

function toggleExpand(id: AppId) {
    const next = new Set(expanded.value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    expanded.value = next;
}

function select(item: AppTreeItem) {
    if (item.disabled) return;
    emit('update:modelValue', item.id);
    emit('select', item);
}

function checkState(item: AppTreeItem): 'checked' | 'partial' | 'none' {
    if (!item.children?.length) return checkedSet.value.has(item.id) ? 'checked' : 'none';
    const states = item.children.map(checkState);
    if (states.every((state) => state === 'checked')) return 'checked';
    if (states.some((state) => state !== 'none')) return 'partial';
    return 'none';
}

function toggleCheck(item: AppTreeItem) {
    const next = new Set(props.checked);
    const ids = collectAll(item);
    const shouldCheck = checkState(item) !== 'checked';
    ids.forEach((id) => (shouldCheck ? next.add(id) : next.delete(id)));
    emit('update:checked', [...next]);
}

provide(APP_TREE_KEY, {
    selectedId: computed(() => props.modelValue),
    checkable: computed(() => props.checkable),
    keyword,
    isExpanded,
    toggleExpand,
    select,
    checkState,
    toggleCheck,
});

defineExpose({
    expandAll: () => (expanded.value = new Set(collectIds(props.items, Infinity))),
    collapseAll: () => (expanded.value = new Set()),
});
</script>
