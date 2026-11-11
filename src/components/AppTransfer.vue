<template>
    <div class="app-transfer" :class="{ 'is-disabled': disabled }" :style="rootStyle">
        <section v-for="side in sides" :key="side.key" class="app-transfer__panel">
            <header class="app-transfer__head">
                <AppChoice
                    size="sm"
                    :model-value="side.checkedCount > 0 && side.checkedCount === side.selectable.length"
                    :indeterminate="side.checkedCount > 0 && side.checkedCount < side.selectable.length"
                    :disabled="disabled || !side.selectable.length"
                    :aria-label="$t('ui.transfer.selectAll', { title: side.title })"
                    @update:model-value="toggleAll(side.key)"
                />
                <strong class="app-transfer__title">{{ side.title }}</strong>
                <span class="app-transfer__count">{{ side.checkedCount }} / {{ side.list.length }}</span>
            </header>

            <div v-if="searchable" class="app-transfer__search">
                <AppInput
                    v-model="keywords[side.key]"
                    size="sm"
                    :placeholder="$t('ui.search')"
                    :aria-label="$t('ui.transfer.search', { title: side.title })"
                    clearable
                >
                    <template #iconLeft><IconSearch /></template>
                </AppInput>
            </div>

            <!-- 비활성 상태에도 키보드로 스크롤할 수 있도록 목록 자체에 포커스를 둡니다. -->
            <ul
                class="app-transfer__list"
                :style="listStyle"
                :tabindex="disabled ? 0 : undefined"
                :aria-label="$t('ui.transfer.list', { title: side.title })"
            >
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
                <li v-if="!side.filtered.length" class="app-transfer__empty">{{ $t('ui.noItems') }}</li>
            </ul>
        </section>

        <div class="app-transfer__actions">
            <AppIconButton
                variant="outline"
                size="sm"
                :aria-label="$t('ui.transfer.toRight')"
                :disabled="disabled || !checked.left.length"
                @click="move('left')"
            >
                <IconChevronRight />
            </AppIconButton>
            <AppIconButton
                variant="outline"
                size="sm"
                :aria-label="$t('ui.transfer.toLeft')"
                :disabled="disabled || !checked.right.length"
                @click="move('right')"
            >
                <IconChevronLeft />
            </AppIconButton>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/i18n';
import { IconChevronLeft, IconChevronRight, IconSearch } from '@/components/icons';

import { toCssSize, toSizeStyle } from '@/utils/css';
import { computed, reactive } from 'vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';
import AppChoice from '@/components/AppChoice.vue';
import AppInput from '@/components/AppInput.vue';

/**
 * AppTransfer - 좌/우 목록 이동 (권한 배정, 설비-라인 배정, 작업자 배치 등)
 * v-model: 오른쪽(선택됨) 목록의 value 배열
 */
const props = defineProps({
    items: { type: Array, required: true },
    modelValue: { type: Array, required: true },
    /** [왼쪽 제목, 오른쪽 제목] */
    titles: { type: Array, default: undefined },
    searchable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    width: { type: [Number, String] },
    /** 목록 영역 높이 */
    height: { type: [Number, String], default: 260 },
});

const emit = defineEmits(['update:modelValue', 'change']);

const checked = reactive({ left: [], right: [] });
const keywords = reactive({ left: '', right: '' });
const rootStyle = computed(() => toSizeStyle(props.width));
const listStyle = computed(() => ({ height: toCssSize(props.height) }));

const selectedSet = computed(() => new Set(props.modelValue));
const lists = computed(() => ({
    left: props.items.filter((item) => !selectedSet.value.has(item.value)),
    right: props.modelValue.map((value) => props.items.find((item) => item.value === value)).filter((item) => Boolean(item)),
}));

const sides = computed(() =>
    ['left', 'right'].map((key, index) => {
        const list = lists.value[key];
        const keyword = keywords[key].trim().toLowerCase();
        const filtered = keyword ? list.filter((item) => item.label.toLowerCase().includes(keyword)) : list;
        const selectable = filtered.filter((item) => !item.disabled);
        return {
            key,
            title: props.titles?.[index] ?? i18n.global.t(index === 0 ? 'ui.transfer.all' : 'ui.transfer.selected'),
            list,
            filtered,
            selectable,
            checkedCount: checked[key].length,
        };
    }),
);

function toggle(side, value) {
    checked[side] = checked[side].includes(value) ? checked[side].filter((item) => item !== value) : [...checked[side], value];
}

function toggleAll(side) {
    const target = sides.value.find((item) => item.key === side);
    checked[side] = checked[side].length === target.selectable.length ? [] : target.selectable.map((item) => item.value);
}

function move(from) {
    const moving = new Set(checked[from]);
    const next = from === 'left' ? [...props.modelValue, ...checked.left] : props.modelValue.filter((value) => !moving.has(value));
    checked[from] = [];
    emit('update:modelValue', next);
    emit('change', next);
}
</script>
