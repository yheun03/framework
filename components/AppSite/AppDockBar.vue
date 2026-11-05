<template>
    <nav class="app-dock-bar" :class="{ 'app-dock-bar--fixed': fixed, 'app-dock-bar--icon-only': !showLabel }" aria-label="하단 메뉴">
        <ul class="app-dock-bar__list">
            <li v-for="item in items" :key="item.id" class="app-dock-bar__item">
                <NuxtLink
                    class="app-dock-bar__link"
                    :class="{ 'is-active': item.id === modelValue }"
                    :to="item.to ?? '#'"
                    :aria-current="item.id === modelValue ? 'page' : undefined"
                    :aria-label="showLabel ? undefined : item.label"
                    @click="emit('update:modelValue', item.id)"
                >
                    <span class="app-dock-bar__icon">
                        <component :is="icons[item.icon]" />
                        <span v-if="item.badge" class="app-dock-bar__badge">{{ item.badge }}</span>
                    </span>
                    <span v-if="showLabel" class="app-dock-bar__label">{{ item.label }}</span>
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { IconAccount, IconApp, IconHeart, IconHome, IconMenu, IconSearch, IconShoppingBag } from '~/components/icons';
import type { AppId } from '~/types/appCommon';

const icons = {
    home: IconHome,
    menu: IconMenu,
    category: IconApp,
    search: IconSearch,
    heart: IconHeart,
    account: IconAccount,
    cart: IconShoppingBag,
};

export type AppDockBarItem = {
    id: AppId;
    label: string;
    icon: keyof typeof icons;
    to?: string;
    /** 장바구니 수량 등 */
    badge?: string | number;
};

/**
 * AppDockBar (Figma MO 06. Dock Bar Guide - 기본 하단 독바)
 * v-model: 선택된 메뉴 id
 * fixed: 화면 하단 고정 (MO 전용 화면에서 사용)
 */
withDefaults(
    defineProps<{
        items: AppDockBarItem[];
        modelValue?: AppId | null;
        showLabel?: boolean;
        fixed?: boolean;
    }>(),
    {
        modelValue: null,
        showLabel: true,
        fixed: false,
    },
);

const emit = defineEmits<{ 'update:modelValue': [AppId] }>();
</script>
