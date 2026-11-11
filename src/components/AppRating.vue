<template>
    <div
        class="app-rating"
        :class="[`app-rating--${size}`, { 'is-readonly': readonly, 'is-disabled': disabled }]"
        :role="readonly ? 'img' : 'radiogroup'"
        :aria-label="$t('ui.rating.value', { current, max })"
        @mouseleave="hoverValue = null"
    >
        <span class="app-rating__stars">
            <template v-for="index in max" :key="index">
                <span v-if="readonly" class="app-rating__star">
                    <IconStarFill class="app-rating__icon app-rating__icon--empty" />
                    <span class="app-rating__fill" :style="{ width: `${fillPercent(index)}%` }"><IconStarFill class="app-rating__icon" /></span>
                </span>
                <AppButton
                    v-else
                    unstyled
                    class="app-rating__star"
                    :disabled="disabled"
                    :aria-label="$t('ui.rating.point', { n: index })"
                    @mouseenter="!disabled && (hoverValue = index)"
                    @click="select(index)"
                >
                    <IconStarFill class="app-rating__icon app-rating__icon--empty" />
                    <span class="app-rating__fill" :style="{ width: `${fillPercent(index)}%` }"><IconStarFill class="app-rating__icon" /></span>
                </AppButton>
            </template>
        </span>

        <span v-if="showValue" class="app-rating__value">{{ current.toFixed(1) }}</span>
        <span v-if="count != null" class="app-rating__count">({{ count.toLocaleString() }})</span>
    </div>
</template>

<script setup>
import { SIZES, oneOf } from '@/utils/props';
import { IconStarFill } from '@/components/icons';
import { computed, ref } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';

/**
 * AppRating (Figma 11. ETC - 평점)
 * 입력 모드의 별은 AppButton(unstyled) 으로 렌더링합니다.
 * size 5단계: xs / sm / md / lg / xl
 * readonly 에서는 소수점(4.5 등) 부분 채움을 지원합니다.
 */
const props = defineProps({
    modelValue: { type: Number, default: 0 },
    max: { type: Number, default: 5 },
    size: { type: String, default: 'md', validator: oneOf(SIZES) },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** 숫자 평점 노출 */
    showValue: { type: Boolean, default: false },
    /** 리뷰 수 (괄호로 노출) */
    count: { type: [Number, null], default: null },
});

const emit = defineEmits(['update:modelValue']);
const hoverValue = ref(null);
const current = computed(() => hoverValue.value ?? props.modelValue);

function fillPercent(index) {
    return Math.max(0, Math.min(1, current.value - (index - 1))) * 100;
}

function select(index) {
    if (props.readonly || props.disabled) return;
    emit('update:modelValue', index);
}
</script>
