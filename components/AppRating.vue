<template>
    <div
        class="app-rating"
        :class="[`app-rating--${size}`, { 'is-readonly': readonly, 'is-disabled': disabled }]"
        :role="readonly ? 'img' : 'radiogroup'"
        :aria-label="`평점 ${current} / ${max}`"
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
                    :aria-label="`${index}점`"
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

<script setup lang="ts">
import { IconStarFill } from '~/components/icons';

/**
 * AppRating (Figma 11. ETC - 평점)
 * 입력 모드의 별은 AppButton(unstyled) 으로 렌더링합니다.
 * size 5단계: xs / sm / md / lg / xl
 * readonly 에서는 소수점(4.5 등) 부분 채움을 지원합니다.
 */
const props = withDefaults(
    defineProps<{
        modelValue?: number;
        max?: number;
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        readonly?: boolean;
        disabled?: boolean;
        /** 숫자 평점 노출 */
        showValue?: boolean;
        /** 리뷰 수 (괄호로 노출) */
        count?: number | null;
    }>(),
    {
        modelValue: 0,
        max: 5,
        size: 'md',
        readonly: false,
        disabled: false,
        showValue: false,
        count: null,
    },
);

const emit = defineEmits<{ 'update:modelValue': [number] }>();
const hoverValue = ref<number | null>(null);
const current = computed(() => hoverValue.value ?? props.modelValue);

function fillPercent(index: number) {
    return Math.max(0, Math.min(1, current.value - (index - 1))) * 100;
}

function select(index: number) {
    if (props.readonly || props.disabled) return;
    emit('update:modelValue', index);
}
</script>
