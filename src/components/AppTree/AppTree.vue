<template>
    <div class="app-tree" :class="[`app-tree--${size}`, { 'is-guide': guide }]" role="tree" :aria-multiselectable="checkable || undefined">
        <AppTreeNode v-for="item in visibleItems" :key="item.id" :item="item" :depth="0" />
        <AppEmpty v-if="!visibleItems.length" size="sm" type="search" :title="emptyText ?? $t('ui.empty.search')" :show-icon="false" />
    </div>
</template>

<script setup>
import { oneOf } from '@/utils/props';
import { APP_TREE_KEY } from '@/constants/appTree';
import { computed, provide, ref } from 'vue';
import AppEmpty from '@/components/AppEmpty.vue';
import AppTreeNode from '@/components/AppTree/AppTreeNode.vue';

/**
 * AppTree - BOM / 공정 / 조직 / 메뉴 트리
 * v-model: 선택된 id,  v-model:checked: 체크된 id 배열(checkable)
 */
const props = defineProps({
    items: { type: Array, required: true },
    modelValue: { type: [String, Number, null], default: null },
    checked: { type: Array, default: () => [] },
    checkable: { type: Boolean, default: false },
    /** 최초 펼침: none / first(1depth) / all */
    initial: { type: String, default: 'first', validator: oneOf(['none', 'first', 'all']) },
    /** 라벨 검색어 - 일치 항목과 상위 경로만 노출 */
    filter: { type: String, default: '' },
    /** 들여쓰기 가이드 라인 */
    guide: { type: Boolean, default: true },
    size: { type: String, default: 'md', validator: oneOf(['sm', 'md']) },
    /** 기본 '검색 결과가 없습니다.' (i18n ui.empty.search) */
    emptyText: { type: String, default: undefined },
});

const emit = defineEmits(['update:modelValue', 'update:checked', 'select']);

function collectIds(items, depthLimit, depth = 0) {
    return items.flatMap((item) =>
        item.children?.length && depth <= depthLimit ? [item.id, ...collectIds(item.children, depthLimit, depth + 1)] : [],
    );
}

function collectAll(item) {
    return [item.id, ...(item.children ?? []).flatMap(collectAll)];
}

const expanded = ref(
    new Set(props.initial === 'all' ? collectIds(props.items, Infinity) : props.initial === 'first' ? collectIds(props.items, 0) : []),
);

function filterItems(items, keyword) {
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

function isExpanded(id) {
    return Boolean(keyword.value) || expanded.value.has(id);
}

function toggleExpand(id) {
    const next = new Set(expanded.value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    expanded.value = next;
}

function select(item) {
    if (item.disabled) return;
    emit('update:modelValue', item.id);
    emit('select', item);
}

function checkState(item) {
    if (!item.children?.length) return checkedSet.value.has(item.id) ? 'checked' : 'none';
    const states = item.children.map(checkState);
    if (states.every((state) => state === 'checked')) return 'checked';
    if (states.some((state) => state !== 'none')) return 'partial';
    return 'none';
}

function toggleCheck(item) {
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

<!-- 이 컴포넌트를 쓰는 화면에서만 불러오는 스타일 (전역 CSS 를 줄이기 위해 컴포넌트 조각으로 분리) -->
<style lang="scss">
@use 'components/base/tree';
</style>
