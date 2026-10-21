<template>
    <div class="app-transfer" :class="{ 'is-disabled': disabled }" :style="rootStyle">
        <section v-for="side in sides" :key="side.key" class="app-transfer__panel">
            <header class="app-transfer__head">
                <AppChoice
                    size="sm"
                    :model-value="side.checkedCount > 0 && side.checkedCount === side.selectable.length"
                    :indeterminate="side.checkedCount > 0 && side.checkedCount < side.selectable.length"
                    :disabled="disabled || !side.selectable.length"
                    @update:model-value="toggleAll(side.key)"
                />
                <strong class="app-transfer__title">{{ side.title }}</strong>
                <span class="app-transfer__count">{{ side.checkedCount }} / {{ side.list.length }}</span>
            </header>

            <div v-if="searchable" class="app-transfer__search">
                <AppInput v-model="keywords[side.key]" size="xs" placeholder="검색" clearable>
                    <template #iconLeft><IconSearch /></template>
                </AppInput>
            </div>

            <ul class="app-transfer__list" :style="listStyle">
                <li v-for="item in side.filtered" :key="String(item.value)" class="app-transfer__item">
                    <AppChoice
                        size="sm"
                        :label="item.label"
                        :hint="item.description"
                        :model-value="checked[side.key].includes(item.value)"
                        :disabled="disabled || item.disabled"
                        @update:model-value="toggle(side.key, item.value)"
                    />
                </li>
                <li v-if="!side.filtered.length" class="app-transfer__empty">항목이 없습니다.</li>
            </ul>
        </section>

        <div class="app-transfer__actions">
            <AppIconButton
                variant="outline"
                size="lg"
                aria-label="오른쪽으로 이동"
                :disabled="disabled || !checked.left.length"
                @click="move('left')"
            >
                <IconChevronRight />
            </AppIconButton>
            <AppIconButton
                variant="outline"
                size="lg"
                aria-label="왼쪽으로 이동"
                :disabled="disabled || !checked.right.length"
                @click="move('right')"
            >
                <IconChevronLeft />
            </AppIconButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight, IconSearch } from '~/components/icons';
import type { AppOptionItem, AppWidth } from '~/types/appCommon';
import { toCssSize, toSizeStyle } from '~/utils/css';

type Side = 'left' | 'right';
type Value = AppOptionItem['value'];

/**
 * AppTransfer - 좌/우 목록 이동 (권한 배정, 설비-라인 배정, 작업자 배치 등)
 * v-model: 오른쪽(선택됨) 목록의 value 배열
 */
const props = withDefaults(
    defineProps<{
        items: AppOptionItem[];
        modelValue: Value[];
        /** [왼쪽 제목, 오른쪽 제목] */
        titles?: [string, string];
        searchable?: boolean;
        disabled?: boolean;
        width?: AppWidth;
        /** 목록 영역 높이 */
        height?: AppWidth;
    }>(),
    {
        titles: () => ['전체 목록', '선택 목록'],
        searchable: true,
        disabled: false,
        height: 260,
    },
);

const emit = defineEmits<{ 'update:modelValue': [Value[]]; change: [Value[]] }>();

const checked = reactive<Record<Side, Value[]>>({ left: [], right: [] });
const keywords = reactive<Record<Side, string>>({ left: '', right: '' });
const rootStyle = computed(() => toSizeStyle(props.width));
const listStyle = computed(() => ({ height: toCssSize(props.height) }));

const selectedSet = computed(() => new Set(props.modelValue));
const lists = computed<Record<Side, AppOptionItem[]>>(() => ({
    left: props.items.filter((item) => !selectedSet.value.has(item.value)),
    right: props.modelValue.map((value) => props.items.find((item) => item.value === value)).filter((item): item is AppOptionItem => Boolean(item)),
}));

const sides = computed(() =>
    (['left', 'right'] as Side[]).map((key, index) => {
        const list = lists.value[key];
        const keyword = keywords[key].trim().toLowerCase();
        const filtered = keyword ? list.filter((item) => item.label.toLowerCase().includes(keyword)) : list;
        const selectable = filtered.filter((item) => !item.disabled);
        return { key, title: props.titles[index], list, filtered, selectable, checkedCount: checked[key].length };
    }),
);

function toggle(side: Side, value: Value) {
    checked[side] = checked[side].includes(value) ? checked[side].filter((item) => item !== value) : [...checked[side], value];
}

function toggleAll(side: Side) {
    const target = sides.value.find((item) => item.key === side)!;
    checked[side] = checked[side].length === target.selectable.length ? [] : target.selectable.map((item) => item.value);
}

function move(from: Side) {
    const moving = new Set(checked[from]);
    const next = from === 'left' ? [...props.modelValue, ...checked.left] : props.modelValue.filter((value) => !moving.has(value));
    checked[from] = [];
    emit('update:modelValue', next);
    emit('change', next);
}
</script>
