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
            :aria-label="$t('ui.tag.remove')"
            @click.stop="emit('close')"
        >
            <IconCloseSmall />
        </AppIconButton>
    </span>
</template>

<script setup>
import { SHAPES, TAG_TONES, oneOf } from '@/utils/props';
import { IconCloseSmall } from '@/components/icons';
import { computed } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppTag
 * Figma 11. ETC Component - 태그 / 셀링아이콘, MES 상태 배지에 공통 사용합니다.
 * tone 은 공통 tone + Figma 셀링아이콘 색상(black, red, orange, green, blue, navy, purple)을 지원합니다.
 */

const props = defineProps({
    label: { type: String, default: '' },
    /** fill(면) / soft(연한 면) / outline(라인) / default(흰 바탕 회색 라인 - 선택 태그) */
    variant: { type: String, default: 'outline', validator: oneOf(['default', 'outline', 'soft', 'fill']) },
    tone: { type: String, default: 'gray', validator: oneOf(TAG_TONES) },
    size: { type: String, default: 'sm', validator: oneOf(['xs', 'sm', 'md']) },
    shape: { type: String, default: 'square', validator: oneOf(SHAPES) },
    /** 앞쪽 상태 점 */
    dot: { type: Boolean, default: false },
    /** 삭제(X) 버튼 노출 - close 이벤트 */
    closable: { type: Boolean, default: false },
    /** 클릭 가능한 필터 칩으로 사용 - click 이벤트 */
    clickable: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'click']);
// clickable 태그는 AppButton(unstyled) 으로 렌더링합니다. 삭제 버튼이 있으면 button 중첩을 피하기 위해 span 으로 렌더링합니다.
const isButton = computed(() => props.clickable && !props.closable);
const CLOSE_SIZES = { xs: { size: 14, icon: 10 }, sm: { size: 16, icon: 12 }, md: { size: 20, icon: 14 } };
const closeSize = computed(() => CLOSE_SIZES[props.size]);
const tagClasses = computed(() => [
    `app-tag--${props.variant}`,
    `app-tag--${props.size}`,
    `app-tag--shape-${props.shape}`,
    `app-tag--tone-${props.tone}`,
    { 'is-active': props.active, 'is-disabled': props.disabled, 'is-clickable': props.clickable },
]);
</script>
