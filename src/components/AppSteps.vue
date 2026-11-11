<template>
    <ol class="app-steps" :class="[`app-steps--${direction}`, `app-steps--${size}`, { 'is-clickable': clickable }]">
        <li v-for="(item, index) in items" :key="item.id ?? index" class="app-steps__item" :class="`is-${statusOf(item, index)}`">
            <component
                :is="clickable ? AppButton : 'div'"
                v-bind="clickable ? { unstyled: true, disabled: item.disabled } : {}"
                class="app-steps__head"
                :aria-current="index === currentIndex ? 'step' : undefined"
                @click="clickable && select(index)"
            >
                <span class="app-steps__marker">
                    <IconCheck v-if="statusOf(item, index) === 'done'" />
                    <IconClose v-else-if="statusOf(item, index) === 'error'" />
                    <template v-else>{{ index + 1 }}</template>
                </span>
                <span class="app-steps__text">
                    <strong class="app-steps__title">{{ item.title }}</strong>
                    <span v-if="item.description" class="app-steps__desc">{{ item.description }}</span>
                </span>
            </component>
        </li>
    </ol>
</template>

<script setup>
import { DIRECTIONS, oneOf } from '@/utils/props';
import AppButton from '@/components/AppButton/AppButton.vue';
import { IconCheck, IconClose } from '@/components/icons';
import { computed } from 'vue';

/**
 * AppSteps - 공정/결재/등록 단계 표시 (예: 자재투입 → 가공 → 검사 → 포장 → 출하)
 */
const props = defineProps({
    items: { type: Array, required: true },
    /** v-model: 현재 단계 index (0부터) */
    modelValue: { type: Number, default: 0 },
    direction: { type: String, default: 'horizontal', validator: oneOf(DIRECTIONS) },
    size: { type: String, default: 'md', validator: oneOf(['sm', 'md']) },
    /** 단계 클릭으로 이동 */
    clickable: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'change']);
const currentIndex = computed(() => props.modelValue);

function statusOf(item, index) {
    if (item.status) return item.status;
    if (index < currentIndex.value) return 'done';
    if (index === currentIndex.value) return 'current';
    return 'wait';
}

function select(index) {
    if (props.items[index]?.disabled) return;
    emit('update:modelValue', index);
    emit('change', index);
}
</script>
