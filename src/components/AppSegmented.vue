<template>
    <div
        class="app-segmented"
        :class="[`app-segmented--${size}`, { 'is-disabled': disabled, 'is-full': width === 'full' }]"
        :style="rootStyle"
        role="radiogroup"
    >
        <AppButton
            v-for="item in items"
            :key="String(item.value)"
            unstyled
            role="radio"
            class="app-segmented__item"
            :class="{ 'is-active': item.value === modelValue }"
            :aria-checked="item.value === modelValue"
            :disabled="disabled || item.disabled"
            @click="select(item)"
        >
            {{ item.label }}
        </AppButton>
    </div>
</template>

<script setup>
import { oneOf } from '@/utils/props';
import { toSizeStyle } from '@/utils/css';
import { computed } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';

/**
 * AppSegmented - 보기 전환 / 기간 단위 선택 (일·주·월, 목록·카드, 전체·가동·정지)
 * 각 항목은 AppButton(unstyled) 으로 렌더링합니다.
 */
const props = defineProps({
    items: { type: Array, required: true },
    modelValue: { type: [String, Number, Boolean, null], required: true },
    size: { type: String, default: 'md', validator: oneOf(['sm', 'md', 'lg']) },
    width: { type: [Number, String] },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'change']);
const rootStyle = computed(() => toSizeStyle(props.width));

function select(item) {
    if (props.disabled || item.disabled || item.value === props.modelValue) return;
    emit('update:modelValue', item.value);
    emit('change', item.value);
}
</script>
