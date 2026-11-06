<template>
    <nav class="app-breadcrumb" :class="`app-breadcrumb--${size}`" aria-label="breadcrumb">
        <ol class="app-breadcrumb__list">
            <li v-for="(item, index) in items" :key="index" class="app-breadcrumb__item">
                <IconHome v-if="index === 0 && showHome" class="app-breadcrumb__home" />
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

<script setup>
import { IconChevronSmallRight, IconHome } from '@/components/icons';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';

/**
 * AppBreadcrumb - 화면 경로 표시 (예: 생산관리 > 작업지시 > 작업지시 상세)
 * 이동 가능한 경로는 AppTextButton(to) 으로 렌더링합니다.
 */
defineProps({
    items: { type: Array, required: true },
    /** 문자 구분자 (미지정 시 > 아이콘) */
    separator: { type: String, default: '' },
    showHome: { type: Boolean, default: true },
    size: { type: String, default: 'md' },
});
</script>
