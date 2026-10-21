<template>
    <div class="app-tree-node" role="treeitem" :aria-expanded="hasChildren ? open : undefined" :aria-selected="tree.selectedId.value === item.id">
        <div
            class="app-tree-node__row"
            :class="{ 'is-selected': tree.selectedId.value === item.id, 'is-disabled': item.disabled }"
            :style="{ '--tree-depth': depth }"
            @click="tree.select(item)"
        >
            <AppIconButton
                v-if="hasChildren"
                class="app-tree-node__toggle"
                :class="{ 'is-open': open }"
                :size="18"
                :icon-size="10"
                :aria-label="open ? '접기' : '펼치기'"
                @click.stop="tree.toggleExpand(item.id)"
            >
                <IconChevronRight />
            </AppIconButton>
            <span v-else class="app-tree-node__toggle is-leaf" aria-hidden="true" />

            <AppChoice
                v-if="tree.checkable.value"
                class="app-tree-node__check"
                size="sm"
                :model-value="tree.checkState(item) === 'checked'"
                :indeterminate="tree.checkState(item) === 'partial'"
                :disabled="item.disabled"
                @click.stop
                @update:model-value="tree.toggleCheck(item)"
            />

            <span class="app-tree-node__icon" aria-hidden="true">
                <component :is="item.icon" v-if="item.icon" />
                <IconFolderOpen v-else-if="hasChildren && open" />
                <IconFolder v-else-if="hasChildren" />
                <IconFile v-else />
            </span>

            <span class="app-tree-node__label">
                <template v-for="(part, index) in labelParts" :key="index">
                    <mark v-if="part.match">{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                </template>
            </span>

            <AppTag v-if="item.tag" class="app-tree-node__tag" size="xs" variant="soft" :tone="item.tagTone ?? 'gray'">{{ item.tag }}</AppTag>
        </div>

        <div v-if="hasChildren && open" class="app-tree-node__children" role="group" :style="{ '--tree-depth': depth }">
            <AppTreeNode v-for="child in item.children" :key="child.id" :item="child" :depth="depth + 1" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconChevronRight, IconFile, IconFolder, IconFolderOpen } from '~/components/icons';
import { APP_TREE_KEY, type AppTreeItem } from '~/types/appTree';

const props = defineProps<{
    item: AppTreeItem;
    depth: number;
}>();

const tree = inject(APP_TREE_KEY)!;
const hasChildren = computed(() => Boolean(props.item.children?.length));
const open = computed(() => tree.isExpanded(props.item.id));

const labelParts = computed(() => {
    const keyword = tree.keyword.value;
    const label = props.item.label;
    const index = keyword ? label.toLowerCase().indexOf(keyword) : -1;
    if (index < 0) return [{ text: label, match: false }];
    return [
        { text: label.slice(0, index), match: false },
        { text: label.slice(index, index + keyword.length), match: true },
        { text: label.slice(index + keyword.length), match: false },
    ];
});
</script>
