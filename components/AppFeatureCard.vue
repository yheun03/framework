<template>
    <article class="app-feature-card" :class="[`app-feature-card--${variant}`, { 'app-feature-card--link': to }]">
        <span v-if="icon" class="app-feature-card__icon" aria-hidden="true">
            <component :is="icons[icon]" />
        </span>
        <h3 class="app-feature-card__title">
            <NuxtLink v-if="to" class="app-feature-card__link" :to="to">{{ title }}</NuxtLink>
            <template v-else>{{ title }}</template>
        </h3>
        <p v-if="description" class="app-feature-card__desc">{{ description }}</p>
        <span v-if="to" class="app-feature-card__more" aria-hidden="true">
            {{ moreText }}
            <IconArrowRight />
        </span>
    </article>
</template>

<script setup lang="ts">
import {
    IconArrowRight,
    IconBuilding,
    IconBulb,
    IconChart,
    IconCube,
    IconFactory,
    IconGlobe,
    IconHeadset,
    IconRocket,
    IconShieldCheck,
} from '~/components/icons';

const icons = {
    bulb: IconBulb,
    rocket: IconRocket,
    shield: IconShieldCheck,
    chart: IconChart,
    cube: IconCube,
    globe: IconGlobe,
    building: IconBuilding,
    headset: IconHeadset,
    factory: IconFactory,
};

export type AppFeatureCardIcon = keyof typeof icons;

/**
 * AppFeatureCard - 사업 영역 / 제품 특징 / 서비스 소개 카드 (기업·제품 홈페이지 확장)
 * variant : outline(라인, 기본) / soft(BG Light 면) / plain(테두리 없음) - AppButton · AppTag 와 같은 값
 * to 가 있으면 카드 전체가 클릭 영역이 되고 '자세히 보기' 가 노출됩니다.
 */
withDefaults(
    defineProps<{
        title: string;
        description?: string;
        icon?: AppFeatureCardIcon | '';
        variant?: 'outline' | 'soft' | 'plain';
        to?: string;
        moreText?: string;
    }>(),
    {
        description: '',
        icon: '',
        variant: 'outline',
        to: '',
        moreText: '자세히 보기',
    },
);
</script>
