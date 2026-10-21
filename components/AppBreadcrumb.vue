<template>
    <nav class="app-breadcrumb" :class="`app-breadcrumb--${size}`" aria-label="breadcrumb">
        <ol class="app-breadcrumb__list">
            <li v-for="(item, index) in items" :key="index" class="app-breadcrumb__item">
                <IconHome v-if="index === 0 && homeIcon" class="app-breadcrumb__home" />
                <AppTextButton
                    v-if="item.to && index < items.length - 1"
                    :to="item.to"
                    class="app-breadcrumb__link"
                    :size="size === 'sm' ? 'sm' : 'md'"
                >
                    {{ item.label }}
                </AppTextButton>
                <span v-else class="app-breadcrumb__text" :aria-current="index === items.length - 1 ? 'page' : undefined">{{ item.label }}</span>
                <span v-if="index < items.length - 1" class="app-breadcrumb__separator" aria-hidden="true">
                    <template v-if="separator">{{ separator }}</template>
                    <IconChevronSmallRight v-else />
                </span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { IconChevronSmallRight, IconHome } from '~/components/icons';

export type AppBreadcrumbItem = {
    label: string;
    to?: string;
};

/**
 * AppBreadcrumb - 화면 경로 표시 (예: 생산관리 > 작업지시 > 작업지시 상세)
 * 이동 가능한 경로는 AppTextButton(to) 으로 렌더링합니다.
 */
withDefaults(
    defineProps<{
        items: AppBreadcrumbItem[];
        /** 문자 구분자 (미지정 시 > 아이콘) */
        separator?: string;
        homeIcon?: boolean;
        size?: 'sm' | 'md';
    }>(),
    {
        separator: '',
        homeIcon: true,
        size: 'md',
    },
);
</script>
