<template>
    <nav class="app-dock-bar" :class="{ 'app-dock-bar--fixed': fixed, 'app-dock-bar--icon-only': !showLabel }" aria-label="하단 메뉴">
        <ul class="app-dock-bar__list">
            <li v-for="item in items" :key="item.id" class="app-dock-bar__item">
                <RouterLink
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
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { IconAccount, IconApp, IconHeart, IconHome, IconMenu, IconSearch, IconShoppingBag } from '@/components/icons';

const icons = {
    home: IconHome,
    menu: IconMenu,
    category: IconApp,
    search: IconSearch,
    heart: IconHeart,
    account: IconAccount,
    cart: IconShoppingBag,
};

/**
 * AppDockBar (Figma MO 06. Dock Bar Guide - 기본 하단 독바)
 * v-model: 선택된 메뉴 id
 * fixed: 화면 하단 고정 (MO 전용 화면에서 사용)
 */
defineProps({
    items: { type: Array, required: true },
    modelValue: { type: [String, Number, null], default: null },
    showLabel: { type: Boolean, default: true },
    fixed: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);
</script>
