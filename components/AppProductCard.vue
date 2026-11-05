<template>
    <article class="app-product-card" :class="[`app-product-card--${size}`, { 'app-product-card--rounded': rounded }]">
        <div class="app-product-card__thumb">
            <img v-if="image" class="app-product-card__image" :src="image" :alt="name" loading="lazy" />
            <div class="app-product-card__actions">
                <AppIconButton :size="40" :icon-size="28" aria-label="미리보기" @click="emit('view')"><IconSearch /></AppIconButton>
                <AppIconButton :size="40" :icon-size="28" aria-label="장바구니 담기" @click="emit('cart')"><IconShoppingBag /></AppIconButton>
                <AppIconButton
                    class="app-product-card__wish"
                    :class="{ 'is-active': active }"
                    :size="40"
                    :icon-size="28"
                    :aria-label="active ? '찜 해제' : '찜하기'"
                    :aria-pressed="active"
                    @click="emit('update:active', !active)"
                >
                    <IconHeartFill v-if="active" />
                    <IconHeart v-else />
                </AppIconButton>
            </div>
        </div>

        <div class="app-product-card__info">
            <div class="app-product-card__text">
                <strong v-if="brand" class="app-product-card__brand">{{ brand }}</strong>
                <NuxtLink v-if="to" class="app-product-card__name" :to="to">{{ name }}</NuxtLink>
                <p v-else class="app-product-card__name">{{ name }}</p>
            </div>

            <div class="app-product-card__price">
                <span v-if="discount" class="app-product-card__discount">{{ discount }}%</span>
                <strong class="app-product-card__amount">{{ price.toLocaleString() }}<span>원</span></strong>
                <del v-if="originalPrice" class="app-product-card__original">
                    <span class="sr-only">정가</span>{{ originalPrice.toLocaleString() }}
                </del>
            </div>

            <AppRating v-if="rating != null" :model-value="rating" :count="reviewCount" readonly show-value :size="size === 'sm' ? 'sm' : 'md'" />

            <ul v-if="tags.length" class="app-product-card__tags">
                <li v-for="tag in tags" :key="tag" class="app-product-card__tag">#{{ tag }}</li>
            </ul>
        </div>
    </article>
</template>

<script setup lang="ts">
import { IconHeart, IconHeartFill, IconSearch, IconShoppingBag } from '~/components/icons';

/**
 * AppProductCard (Figma 14·15. Thumbnail Guide - 상품 썸네일 바닥형)
 * - 썸네일은 정사각형, 회색 BG 효과(#000 3%)를 기본 적용합니다.
 * - 마우스 오버 / 키보드 포커스 시 미리보기·장바구니·찜 버튼을 노출합니다.
 * - BG 형은 목록을 감싸는 영역에 .bg-light 를 적용합니다.
 * size : md(3·4단, 브랜드/상품명 15 · 가격 20) / sm(5·6단, 14 · 상품명 2줄 · 가격 18)
 * rounded : 썸네일 크기별 라운드 자동 적용 (~120 10 / ~216 12 / ~500 20 / 그 이상 28)
 * v-model:active : 찜 상태
 */
withDefaults(
    defineProps<{
        name: string;
        price: number;
        brand?: string;
        image?: string;
        /** 할인율(%) */
        discount?: number | null;
        /** 정가 (취소선) */
        originalPrice?: number | null;
        rating?: number | null;
        reviewCount?: number | null;
        tags?: string[];
        to?: string;
        size?: 'sm' | 'md';
        rounded?: boolean;
        active?: boolean;
    }>(),
    {
        brand: '',
        image: '',
        discount: null,
        originalPrice: null,
        rating: null,
        reviewCount: null,
        tags: () => [],
        to: '',
        size: 'md',
        rounded: false,
        active: false,
    },
);

const emit = defineEmits<{ 'update:active': [boolean]; view: []; cart: [] }>();
</script>
