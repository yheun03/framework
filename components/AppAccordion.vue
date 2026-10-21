<template>
    <div class="app-accordion" :class="`app-accordion--${variant}`">
        <div
            v-for="item in items"
            :key="item.id"
            class="app-accordion__item"
            :class="{
                'is-open': isOpen(item.id),
                'is-disabled': item.disabled,
            }"
        >
            <button type="button" class="app-accordion__trigger" :disabled="item.disabled" :aria-expanded="isOpen(item.id)" @click="toggle(item.id)">
                <div class="app-accordion__trigger-content">
                    <span v-if="prefix" class="app-accordion__prefix">{{ prefix }}</span>
                    <div class="app-accordion__text">
                        <div class="app-accordion__title">
                            <slot v-if="item.titleSlot" :name="item.titleSlot" :item="item" />
                            <strong v-else>{{ item.title }}</strong>
                        </div>
                        <p v-if="item.description" class="app-accordion__desc">{{ item.description }}</p>
                        <div v-else-if="item.descriptionSlot" class="app-accordion__desc">
                            <slot :name="item.descriptionSlot" :item="item" />
                        </div>
                    </div>
                    <span class="app-accordion__icon" :class="{ 'is-open': isOpen(item.id) }" aria-hidden="true">
                        <IconChevronDown />
                    </span>
                </div>
            </button>

            <div v-if="isOpen(item.id)" class="app-accordion__panel">
                <div class="app-accordion__panel-inner">
                    <slot v-if="item.slot" :name="item.slot" :item="item" />
                    <p v-else-if="item.content" class="app-accordion__content">{{ item.content }}</p>
                    <div v-else class="app-accordion__empty">내용이 없습니다.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconChevronDown } from '~/components/icons';
import type { AppId, AppInitial } from '~/types/appCommon';

export type AppAccordionItem = {
    id: AppId;
    title: string;
    titleSlot?: string;
    description?: string;
    descriptionSlot?: string;
    /** slot 없이 간단한 텍스트 본문을 넣을 때 */
    content?: string;
    disabled?: boolean;
    slot?: string;
};

const props = withDefaults(
    defineProps<{
        items: AppAccordionItem[];
        /** v-model: 열린 아이템 id 배열 */
        modelValue?: AppId[];
        /** true: 여러 개 동시 열림 / false: 하나만 열림 */
        multiple?: boolean;
        /** 최초 열림 규칙 (v-model 미사용 시) */
        initial?: AppInitial;
        /** card(기본) / line(드롭다운 테이블형, Figma 13. Table - 드롭 다운 테이블) */
        variant?: 'card' | 'line';
        /** 제목 앞 머리글 (예: 'Q.') */
        prefix?: string;
    }>(),
    {
        modelValue: undefined,
        multiple: true,
        initial: 'none',
        variant: 'card',
        prefix: '',
    },
);

const emit = defineEmits<{
    'update:modelValue': [AppId[]];
    toggle: [{ id: AppId; open: boolean }];
}>();

const enabledIds = props.items.filter((item) => !item.disabled).map((item) => item.id);
const initialIds = props.initial === 'all' ? enabledIds : props.initial === 'first' && enabledIds.length ? [enabledIds[0]] : [];
const openedIds = ref<AppId[]>(initialIds);
const currentIds = computed(() => props.modelValue ?? openedIds.value);

function isOpen(id: AppId) {
    return currentIds.value.includes(id);
}

function toggle(id: AppId) {
    const next = isOpen(id) ? currentIds.value.filter((itemId) => itemId !== id) : props.multiple ? [...currentIds.value, id] : [id];

    if (props.modelValue === undefined) openedIds.value = next;
    emit('update:modelValue', next);
    emit('toggle', { id, open: next.includes(id) });
}
</script>
