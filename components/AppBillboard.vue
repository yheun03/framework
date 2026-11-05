<template>
    <section
        class="app-billboard"
        :class="[`app-billboard--${variant}`, `app-billboard--align-${align}`, `app-billboard--weight-${weight}`]"
        :style="{ '--app-billboard-height': toCssSize(height) }"
    >
        <div class="app-billboard__visual" :style="image ? { backgroundImage: `url(${image})` } : undefined">
            <span v-if="$slots.object" class="app-billboard__object"><slot name="object" /></span>
        </div>

        <div class="app-billboard__content">
            <span v-if="eyebrow" class="app-billboard__eyebrow">{{ eyebrow }}</span>
            <component :is="tag" class="app-billboard__title">{{ title }}</component>
            <p v-if="description" class="app-billboard__desc">{{ description }}</p>
            <div v-if="$slots.actions" class="app-billboard__actions">
                <slot name="actions" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { AppWidth } from '~/types/appCommon';
import { toCssSize } from '~/utils/css';

/**
 * AppBillboard (Figma 16. Billboard Banner Guide)
 * variant
 *  - overlay : 1920 풀 화면 빌보드 - 이미지 위 흰 글자 (H1 48 / B1 16)
 *  - card    : 1580 카드형 빌보드 - 이미지 아래 캡션 (H4 28 / B3 14)
 * weight : 타이틀 굵기 = 디자인 느낌 (lt 세련된 / rg 가벼운 / sb 무거운)
 * 여러 장은 AppCarousel(navVariant="banner") 슬롯 안에 넣어 사용합니다.
 */
withDefaults(
    defineProps<{
        title: string;
        description?: string;
        /** 타이틀 위 짧은 문구 (Brand name) */
        eyebrow?: string;
        image?: string;
        variant?: 'overlay' | 'card';
        align?: 'center' | 'left';
        weight?: 'lt' | 'rg' | 'sb';
        /** 이미지 영역 높이 (Figma overlay 500 / card 460) */
        height?: AppWidth;
        /** 타이틀 태그 (페이지 대표 배너면 h2) */
        tag?: 'h1' | 'h2' | 'h3' | 'strong';
    }>(),
    {
        description: '',
        eyebrow: '',
        image: '',
        variant: 'overlay',
        align: 'center',
        weight: 'rg',
        height: 500,
        tag: 'h2',
    },
);
</script>
