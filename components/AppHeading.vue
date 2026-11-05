<template>
    <div class="app-heading" :class="[`app-heading--${size}`, `app-heading--align-${align}`]">
        <div class="app-heading__text">
            <span v-if="eyebrow" class="app-heading__eyebrow">{{ eyebrow }}</span>
            <component :is="tag" class="app-heading__title">{{ title }}</component>
            <p v-if="description" class="app-heading__desc">{{ description }}</p>
        </div>
        <div v-if="$slots.actions" class="app-heading__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * AppHeading - 홈페이지 섹션 제목 (기업·제품 홈페이지 확장, Figma 02 Layout 'Title name' 기준)
 * size : sm(T3 24) / md(H3 32) / lg(H2 40) - PC/MO 자동 전환
 * align: center(기본) / left - left 일 때 #actions(전체보기 등)가 우측에 붙습니다.
 */
withDefaults(
    defineProps<{
        title: string;
        description?: string;
        /** 제목 위 영문 라벨 */
        eyebrow?: string;
        size?: 'sm' | 'md' | 'lg';
        align?: 'center' | 'left';
        tag?: 'h2' | 'h3' | 'h4';
    }>(),
    {
        description: '',
        eyebrow: '',
        size: 'md',
        align: 'center',
        tag: 'h2',
    },
);
</script>
