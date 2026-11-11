<template>
    <div v-if="overlay" class="app-spinner-overlay" :class="{ 'is-fullscreen': fullscreen }" role="status" :aria-label="label || $t('ui.loading')">
        <span class="app-spinner" :class="[`app-spinner--${size}`, `app-spinner--tone-${tone}`]" aria-hidden="true" />
        <span v-if="label" class="app-spinner__label">{{ label }}</span>
    </div>
    <span v-else class="app-spinner-inline" role="status" :aria-label="label || $t('ui.loading')">
        <span class="app-spinner" :class="[`app-spinner--${size}`, `app-spinner--tone-${tone}`]" aria-hidden="true" />
        <span v-if="label" class="app-spinner__label">{{ label }}</span>
    </span>
</template>

<script setup>
import { SIZES, TONES, oneOf } from '@/utils/props';
/**
 * AppSpinner - 로딩 표시
 * overlay: 부모(position: relative) 영역을 덮는 로딩,  fullscreen: 화면 전체를 덮는 로딩
 */
defineProps({
    size: { type: String, default: 'md', validator: oneOf(SIZES) },
    tone: { type: String, default: 'primary', validator: oneOf(TONES) },
    label: { type: String, default: '' },
    overlay: { type: Boolean, default: false },
    fullscreen: { type: Boolean, default: false },
});
</script>
