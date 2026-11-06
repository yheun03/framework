<template>
    <component
        :is="to ? RouterLink : 'article'"
        class="app-promotion-card"
        :class="[`app-promotion-card--${ratio}`, { 'app-promotion-card--rounded': rounded }]"
        :to="to || undefined"
    >
        <div class="app-promotion-card__thumb">
            <img v-if="image" class="app-promotion-card__image" :src="image" alt="" loading="lazy" />
        </div>
        <div class="app-promotion-card__info">
            <span v-if="eyebrow" class="app-promotion-card__eyebrow">{{ eyebrow }}</span>
            <strong class="app-promotion-card__title">{{ title }}</strong>
            <span v-if="period" class="app-promotion-card__period">{{ period }}</span>
        </div>
    </component>
</template>

<script setup>
import { RouterLink } from 'vue-router';

/**
 * AppPromotionCard (Figma 14. Thumbnail Guide - 가로 직사각형 / 프로모션 썸네일)
 * ratio : wide(16:9) / standard(4:3) - 사이트에서 하나의 비율을 정해 통일합니다.
 * 이미지는 장식이므로 alt 를 비우고 title 로 내용을 전달합니다.
 */
defineProps({
    title: { type: String, required: true },
    /** 타이틀 위 짧은 문구 (Exclusive) - AppBillboard · AppHeading 과 같은 이름 */
    eyebrow: { type: String, default: '' },
    /** 기간 (2023.11.30 ~ 2023.12.30) */
    period: { type: String, default: '' },
    image: { type: String, default: '' },
    ratio: { type: String, default: 'wide' },
    to: { type: String, default: '' },
    rounded: { type: Boolean, default: false },
});
</script>
