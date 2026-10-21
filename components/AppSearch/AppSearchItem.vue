<template>
    <div class="app-search-item" :style="itemStyle">
        <label class="app-search-item__label" :for="for">
            {{ label }}
            <span v-if="required" class="app-search-item__required" aria-hidden="true">*</span>
        </label>
        <div class="app-search-item__control">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * AppSearchItem - AppSearchPanel 안의 조회 조건 1칸 (라벨 + 입력)
 */
const props = withDefaults(
    defineProps<{
        label: string;
        /** 차지할 칸 수 */
        span?: number;
        for?: string;
        required?: boolean;
    }>(),
    {
        span: 1,
        for: undefined,
        required: false,
    },
);

const itemStyle = computed(() => ({ gridColumn: `span ${props.span}` }));
</script>
