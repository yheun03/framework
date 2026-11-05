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
import { APP_INPUT_GROUP_KEY } from '~/components/AppInputGroup.vue';

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

// for 를 지정하지 않아도 안쪽 AppInput / AppSelect 가 조회 조건 이름(label)을 스크린리더 이름으로 사용합니다.
// (한 칸에 입력이 여러 개일 수 있어 id 대신 이름을 전달합니다)
provide(
    APP_INPUT_GROUP_KEY,
    computed(() => props.label),
);
</script>
