<template>
    <div class="app-empty" :class="[`app-empty--${size}`, `app-empty--${type}`]">
        <span v-if="showIcon" class="app-empty__icon" aria-hidden="true">
            <slot name="icon">
                <IconCog v-if="type === 'maintenance'" />
                <IconMagnify v-else-if="type === 'search'" />
                <IconWarning v-else-if="type === 'error'" />
                <IconBox v-else />
            </slot>
        </span>

        <strong class="app-empty__title">
            <slot name="title">{{ title || defaultTitle }}</slot>
        </strong>
        <p v-if="description || $slots.description" class="app-empty__desc">
            <slot name="description">{{ description }}</slot>
        </p>

        <div v-if="$slots.actions" class="app-empty__actions">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/i18n';
import { oneOf } from '@/utils/props';
import { IconBox, IconCog, IconMagnify, IconWarning } from '@/components/icons';
import { computed } from 'vue';

/**
 * AppEmpty (Figma 20. No search result)
 * type: data(데이터 없음) / search(검색 결과 없음) / error(오류) / maintenance(시스템 정기 점검)
 * 버튼이 필요하면 #actions 슬롯을 사용합니다. (버튼 없는 / 있는 / 아이콘 포함 타입)
 */
const props = defineProps({
    type: { type: String, default: 'data', validator: oneOf(['data', 'search', 'error', 'maintenance']) },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    size: { type: String, default: 'md', validator: oneOf(['sm', 'md', 'lg']) },
    /** false 면 아이콘 없는 타입 */
    showIcon: { type: Boolean, default: true },
});

// 기본 문구: i18n ui.empty.{data | search | error | maintenance}
const defaultTitle = computed(() => i18n.global.t(`ui.empty.${props.type}`));
</script>
