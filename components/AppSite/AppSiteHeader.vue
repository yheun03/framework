<template>
    <header class="app-site-header" :class="{ 'app-site-header--sticky': sticky }">
        <div class="app-site-header__top">
            <div class="app-site-header__inner">
                <NuxtLink class="app-site-header__logo" :to="logoTo">
                    <slot name="logo">{{ logo }}</slot>
                </NuxtLink>

                <form v-if="searchPlaceholder" class="app-site-header__search" role="search" @submit.prevent="emit('search', keyword)">
                    <label class="sr-only" :for="searchId">검색어</label>
                    <input :id="searchId" v-model="keyword" class="app-site-header__search-input" type="search" :placeholder="searchPlaceholder" />
                    <AppIconButton class="app-site-header__search-button" type="submit" :size="40" :icon-size="22" aria-label="검색">
                        <IconSearch />
                    </AppIconButton>
                </form>

                <div class="app-site-header__utils">
                    <slot name="utils">
                        <AppIconButton :size="40" :icon-size="24" to="#" aria-label="마이페이지"><IconAccount /></AppIconButton>
                        <AppIconButton :size="40" :icon-size="24" to="#" aria-label="장바구니"><IconShoppingBag /></AppIconButton>
                        <AppIconButton :size="40" :icon-size="24" to="#" aria-label="찜 목록"><IconHeart /></AppIconButton>
                        <AppIconButton :size="40" :icon-size="24" to="#" aria-label="메시지"><IconComment /></AppIconButton>
                    </slot>
                </div>
            </div>
        </div>

        <nav class="app-site-header__nav" aria-label="주 메뉴">
            <div class="app-site-header__inner">
                <AppButton unstyled class="app-site-header__category" :aria-expanded="categoryOpen" @click="emit('category')">
                    <IconMenu class="app-site-header__category-icon" />
                    <span>{{ categoryLabel }}</span>
                </AppButton>

                <ul class="app-site-header__menu">
                    <template v-for="item in items" :key="item.label">
                        <li v-if="item.divider" class="app-site-header__divider" aria-hidden="true" />
                        <li class="app-site-header__menu-item">
                            <NuxtLink
                                class="app-site-header__link"
                                :class="{ 'is-active': item.active }"
                                :to="item.to ?? '#'"
                                :aria-current="item.active ? 'page' : undefined"
                            >
                                {{ item.label }}
                            </NuxtLink>
                        </li>
                    </template>
                </ul>

                <div v-if="$slots.aside" class="app-site-header__aside">
                    <slot name="aside" />
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { IconAccount, IconComment, IconHeart, IconMenu, IconSearch, IconShoppingBag } from '~/components/icons';

export type AppSiteHeaderItem = {
    label: string;
    to?: string;
    active?: boolean;
    /** 앞쪽에 구분선 노출 (Figma: Promotion | Magazine) */
    divider?: boolean;
};

/**
 * AppSiteHeader (Figma 18. GNB Guide - 기본 GNB)
 * 상단(로고 / 검색 / 유틸 아이콘) 100px + 메뉴(카테고리 / 메뉴 / #aside) 56px
 * 컨텐츠 폭은 기본 그리드(.ds-container, 1580) 를 따릅니다.
 * MO(767px 이하)에서는 검색창을 숨기고 메뉴를 가로 스크롤로 전환합니다.
 */
withDefaults(
    defineProps<{
        items: AppSiteHeaderItem[];
        logo?: string;
        logoTo?: string;
        /** 비우면 검색창을 노출하지 않습니다. */
        searchPlaceholder?: string;
        categoryLabel?: string;
        /** 카테고리 레이어 열림 상태 (aria-expanded) */
        categoryOpen?: boolean;
        sticky?: boolean;
    }>(),
    {
        logo: 'LOGO NAME',
        logoTo: '/',
        searchPlaceholder: '',
        categoryLabel: 'Category',
        categoryOpen: false,
        sticky: false,
    },
);

const emit = defineEmits<{ search: [string]; category: [] }>();
const keyword = ref('');
const searchId = useId();
</script>
