<template>
    <AppButton
        v-if="isButton"
        unstyled
        class="app-tag"
        :class="tagClasses"
        :disabled="disabled"
        :aria-pressed="active"
        @click="emit('click', $event)"
    >
        <span v-if="dot" class="app-tag__dot" aria-hidden="true" />
        <span v-if="$slots.icon" class="app-tag__icon" aria-hidden="true"><slot name="icon" /></span>
        <span v-if="label || $slots.default" class="app-tag__label"
            ><slot>{{ label }}</slot></span
        >
    </AppButton>

    <span v-else class="app-tag" :class="tagClasses">
        <span v-if="dot" class="app-tag__dot" aria-hidden="true" />
        <span v-if="$slots.icon" class="app-tag__icon" aria-hidden="true"><slot name="icon" /></span>
        <span v-if="label || $slots.default" class="app-tag__label"
            ><slot>{{ label }}</slot></span
        >
        <AppIconButton
            v-if="closable"
            class="app-tag__close"
            :size="closeSize.size"
            :icon-size="closeSize.icon"
            shape="pill"
            :disabled="disabled"
            aria-label="삭제"
            @click.stop="emit('close')"
        >
            <IconCloseSmall />
        </AppIconButton>
    </span>
</template>

<script setup lang="ts">
import { IconCloseSmall } from '~/components/icons';
import type { AppShape, AppTone } from '~/types/appCommon';

/**
 * AppTag
 * Figma 11. ETC Component - 태그 / 셀링아이콘, MES 상태 배지에 공통 사용합니다.
 * tone 은 공통 tone + Figma 셀링아이콘 색상(black, red, orange, green, blue, navy, purple)을 지원합니다.
 */
export type AppTagTone = AppTone | 'black' | 'red' | 'orange' | 'green' | 'blue' | 'navy' | 'purple';

const props = withDefaults(
    defineProps<{
        label?: string;
        /** fill(면) / soft(연한 면) / outline(라인) / default(흰 바탕 회색 라인 - 선택 태그) */
        variant?: 'fill' | 'soft' | 'outline' | 'default';
        tone?: AppTagTone;
        size?: 'xs' | 'sm' | 'md';
        shape?: AppShape;
        /** 앞쪽 상태 점 */
        dot?: boolean;
        /** 삭제(X) 버튼 노출 - close 이벤트 */
        closable?: boolean;
        /** 클릭 가능한 필터 칩으로 사용 - click 이벤트 */
        clickable?: boolean;
        active?: boolean;
        disabled?: boolean;
    }>(),
    {
        label: '',
        variant: 'outline',
        tone: 'gray',
        size: 'sm',
        shape: 'square',
        dot: false,
        closable: false,
        clickable: false,
        active: false,
        disabled: false,
    },
);

const emit = defineEmits<{ close: []; click: [MouseEvent] }>();
// clickable 태그는 AppButton(unstyled) 으로 렌더링합니다. 삭제 버튼이 있으면 button 중첩을 피하기 위해 span 으로 렌더링합니다.
const isButton = computed(() => props.clickable && !props.closable);
const CLOSE_SIZES = { xs: { size: 14, icon: 10 }, sm: { size: 16, icon: 12 }, md: { size: 20, icon: 14 } } as const;
const closeSize = computed(() => CLOSE_SIZES[props.size]);
const tagClasses = computed(() => [
    `app-tag--${props.variant}`,
    `app-tag--${props.size}`,
    `app-tag--shape-${props.shape}`,
    `app-tag--tone-${props.tone}`,
    { 'is-active': props.active, 'is-disabled': props.disabled, 'is-clickable': props.clickable },
]);
</script>
