<template>
    <div
        class="app-tabs"
        :class="[`app-tabs--${variant}`, `app-tabs--${size}`, `app-tabs--${orientation}`, { 'is-stretch': stretch }]"
        :style="rootStyle"
    >
        <div class="app-tabs__list" role="tablist" :aria-orientation="orientation">
            <button
                v-for="item in items"
                :key="item.id"
                type="button"
                class="app-tabs__tab"
                role="tab"
                :class="{ 'is-active': currentId === item.id, 'is-disabled': item.disabled, 'has-image': item.image }"
                :disabled="item.disabled"
                :aria-selected="currentId === item.id"
                @click="selectTab(item)"
            >
                <img v-if="item.image" class="app-tabs__tab-image" :src="item.image" alt="" />
                <span v-else-if="item.icon" class="app-tabs__tab-icon" aria-hidden="true">
                    <component :is="item.icon" />
                </span>
                <span class="app-tabs__tab-text">
                    <strong class="app-tabs__tab-title">{{ item.title }}</strong>
                    <span v-if="item.description" class="app-tabs__tab-desc">{{ item.description }}</span>
                </span>
                <span v-if="item.badge" class="app-tabs__tab-badge">{{ item.badge }}</span>
            </button>
        </div>

        <div v-if="hasPanels" class="app-tabs__panels">
            <div v-for="item in items" v-show="currentId === item.id" :key="item.id" class="app-tabs__panel" role="tabpanel">
                <slot v-if="item.slot" :name="item.slot" :item="item" />
                <slot v-else :item="item" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import type { AppId, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

export type AppTabItem = {
    id: AppId;
    title: string;
    description?: string;
    icon?: Component;
    /** 오브젝트(이미지) 탭 썸네일 */
    image?: string;
    badge?: string | number;
    disabled?: boolean;
    slot?: string;
};

type TabsVariant = 'line' | 'box' | 'pill' | 'group' | 'button' | 'grid' | 'text';

const props = withDefaults(
    defineProps<{
        items: AppTabItem[];
        /** v-model: 활성 탭 id */
        modelValue?: AppId | null;
        /** 최초 활성 규칙 (v-model 미사용 시) */
        initial?: 'first' | 'none';
        /** line / box / pill / group(그룹형) / button(버튼형) / grid(그룹 버튼형) / text(텍스트형) */
        variant?: TabsVariant;
        size?: 'sm' | 'md' | 'lg';
        orientation?: 'horizontal' | 'vertical';
        /** grid variant 의 한 줄 칸 수 */
        columns?: number;
        stretch?: boolean;
        width?: AppWidth;
    }>(),
    {
        modelValue: undefined,
        initial: 'first',
        variant: 'line',
        size: 'md',
        orientation: 'horizontal',
        columns: 6,
        stretch: false,
    },
);

const emit = defineEmits<{
    'update:modelValue': [AppId | null];
    change: [{ id: AppId | null; item: AppTabItem | null }];
}>();

const slots = useSlots();
const firstId = props.items.find((item) => !item.disabled)?.id ?? null;
const selectedId = ref<AppId | null>(props.initial === 'first' ? firstId : null);
const currentId = computed(() => (props.modelValue === undefined ? selectedId.value : props.modelValue));
const hasPanels = computed(() => Boolean(slots.default) || props.items.some((item) => item.slot && slots[item.slot]));
const rootStyle = computed(() => ({ ...toSizeStyle(props.width), '--app-tabs-columns': String(props.columns) }));

function selectTab(item: AppTabItem) {
    if (item.disabled) return;
    if (props.modelValue === undefined) selectedId.value = item.id;
    emit('update:modelValue', item.id);
    emit('change', { id: item.id, item });
}
</script>
