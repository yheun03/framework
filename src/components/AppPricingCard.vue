<template>
    <article class="app-pricing-card" :class="{ 'is-active': active }">
        <span v-if="badge" class="app-pricing-card__badge">{{ badge }}</span>
        <h3 class="app-pricing-card__title">{{ title }}</h3>
        <p v-if="description" class="app-pricing-card__desc">{{ description }}</p>

        <p class="app-pricing-card__price">
            <strong>{{ typeof price === 'number' ? price.toLocaleString() : price }}</strong>
            <span v-if="unit" class="app-pricing-card__unit">{{ unit }}</span>
        </p>

        <ul v-if="items.length" class="app-pricing-card__features">
            <li v-for="item in items" :key="item" class="app-pricing-card__feature">
                <IconCheck class="app-pricing-card__check" />
                {{ item }}
            </li>
        </ul>

        <div v-if="$slots.actions" class="app-pricing-card__actions">
            <slot name="actions" />
        </div>
    </article>
</template>

<script setup>
import { IconCheck } from '@/components/icons';

/**
 * AppPricingCard - 요금제 / 라이선스 카드 (제품 홈페이지 확장)
 * active : 추천 요금제 강조 (브랜드 라인 + badge)
 * 하단 버튼은 #actions 슬롯에 AppButton 을 배치합니다.
 */
defineProps({
    title: { type: String, required: true },
    price: { type: [Number, String], required: true },
    /** 원 / 월, 문의 등 가격 뒤 단위 */
    unit: { type: String, default: '' },
    description: { type: String, default: '' },
    /** 포함 항목 (목록 데이터는 모든 컴포넌트에서 items) */
    items: { type: Array, default: () => [] },
    badge: { type: String, default: '' },
    active: { type: Boolean, default: false },
});
</script>
