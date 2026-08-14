<template>
    <div class="app-tabs" :class="[
        `app-tabs--${variant}`,
        `app-tabs--${size}`,
        `app-tabs--${orientation}`,
        { 'is-stretch': stretch },
    ]">
        <div class="app-tabs__list" role="tablist" :aria-orientation="orientation">
            <button v-for="item in items" :key="item.id" type="button" class="app-tabs__tab" role="tab"
                :class="{ 'is-active': currentId === item.id, 'is-disabled': item.disabled }"
                :disabled="item.disabled" :aria-selected="currentId === item.id" @click="selectTab(item)">
                <span v-if="item.icon" class="app-tabs__tab-icon" aria-hidden="true">
                    <component :is="item.icon" />
                </span>
                <span class="app-tabs__tab-text">
                    <strong class="app-tabs__tab-title">{{ item.title }}</strong>
                    <span v-if="item.description" class="app-tabs__tab-desc">{{ item.description }}</span>
                </span>
                <span v-if="item.badge" class="app-tabs__tab-badge">{{ item.badge }}</span>
            </button>
        </div>

        <div class="app-tabs__panels">
            <div v-for="item in items" v-show="currentId === item.id" :key="item.id" class="app-tabs__panel"
                role="tabpanel">
                <slot v-if="item.slot" :name="item.slot" :item="item" />
                <div v-else class="app-tabs__empty">내용이 없습니다.</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";

export type AppTabItem = {
    id: string | number;
    title: string;
    description?: string;
    icon?: Component;
    badge?: string | number;
    disabled?: boolean;
    slot?: string;
};

const props = withDefaults(defineProps<{
    items: AppTabItem[];
    activeId?: string | number | null;
    defaultActiveId?: string | number | null;
    initialActive?: "first" | "none";
    variant?: "line" | "box" | "pill";
    size?: "sm" | "md" | "lg";
    orientation?: "horizontal" | "vertical";
    stretch?: boolean;
}>(), {
    initialActive: "first",
    variant: "line",
    size: "md",
    orientation: "horizontal",
    stretch: false,
});

const emit = defineEmits<{
    "update:activeId": [string | number | null];
    change: [{ id: string | number | null; item: AppTabItem | null }];
}>();

const firstId = props.items.find((item) => !item.disabled)?.id ?? null;
const selectedId = ref<string | number | null>(props.defaultActiveId ?? (props.initialActive === "first" ? firstId : null));
const currentId = computed(() => props.activeId === undefined ? selectedId.value : props.activeId);

function selectTab(item: AppTabItem) {
    if (item.disabled) return;
    if (props.activeId === undefined) selectedId.value = item.id;
    emit("update:activeId", item.id);
    emit("change", { id: item.id, item });
}
</script>
