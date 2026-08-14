<template>
    <div class="app-accordion">
        <div v-for="item in items" :key="item.id" class="app-accordion__item" :class="{
            'is-open': isOpen(item.id),
            'is-disabled': item.disabled,
        }">
            <button type="button" class="app-accordion__trigger" :disabled="item.disabled"
                :aria-expanded="isOpen(item.id)" @click="toggle(item.id)">
                <div class="app-accordion__trigger-content">
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
                    <div v-else class="app-accordion__empty">내용이 없습니다.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconChevronDown } from "~/components/icons";

export type AppAccordionItem = {
    id: string | number;
    title: string;
    titleSlot?: string;
    description?: string;
    descriptionSlot?: string;
    disabled?: boolean;
    slot?: string;
};

const props = withDefaults(defineProps<{
    items: AppAccordionItem[];
    openIds?: Array<string | number>;
    defaultOpenIds?: Array<string | number>;
    type?: "single" | "multiple";
    initialOpen?: "none" | "first" | "all";
}>(), {
    type: "multiple",
    initialOpen: "none",
});

const emit = defineEmits<{
    "update:openIds": [Array<string | number>];
    toggle: [{ id: string | number; open: boolean }];
}>();

const firstOpenItem = props.items.find((item) => !item.disabled);
const initialIds = props.defaultOpenIds ?? (props.initialOpen === "all"
    ? props.items.filter((item) => !item.disabled).map((item) => item.id)
    : props.initialOpen === "first" && firstOpenItem ? [firstOpenItem.id] : []);
const openedIds = ref<Array<string | number>>(initialIds);

function isOpen(id: string | number) {
    return (props.openIds ?? openedIds.value).includes(id);
}

function toggle(id: string | number) {
    const next = isOpen(id)
        ? (props.openIds ?? openedIds.value).filter((itemId) => itemId !== id)
        : props.type === "single" ? [id] : [...(props.openIds ?? openedIds.value), id];

    if (!props.openIds) openedIds.value = next;
    emit("update:openIds", next);
    emit("toggle", { id, open: next.includes(id) });
}
</script>
