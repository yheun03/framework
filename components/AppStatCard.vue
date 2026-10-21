<template>
    <component
        :is="clickable ? AppButton : 'div'"
        v-bind="clickable ? { unstyled: true, active } : {}"
        class="app-stat-card"
        :class="[
            `app-stat-card--${variant}`,
            `app-stat-card--tone-${tone}`,
            `app-stat-card--${size}`,
            { 'is-clickable': clickable, 'is-active': active },
        ]"
        @click="clickable && emit('click', $event)"
    >
        <div class="app-stat-card__head">
            <span class="app-stat-card__title">{{ title }}</span>
            <span v-if="$slots.icon" class="app-stat-card__icon" aria-hidden="true"><slot name="icon" /></span>
        </div>

        <div class="app-stat-card__value">
            <strong>{{ displayValue }}</strong>
            <span v-if="unit" class="app-stat-card__unit">{{ unit }}</span>
        </div>

        <div v-if="diff != null || description" class="app-stat-card__foot">
            <span v-if="diff != null" class="app-stat-card__diff" :class="`is-${trend}`">
                <IconTrendUp v-if="diff > 0" />
                <IconTrendDown v-else-if="diff < 0" />
                {{ diffText }}
            </span>
            <span v-if="description" class="app-stat-card__desc">{{ description }}</span>
        </div>

        <div
            v-if="progress != null"
            class="app-stat-card__progress"
            role="progressbar"
            :aria-valuenow="progress"
            aria-valuemin="0"
            aria-valuemax="100"
        >
            <span :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }" />
        </div>

        <slot />
    </component>
</template>

<script setup lang="ts">
import AppButton from '~/components/AppButton/AppButton.vue';
import { IconTrendDown, IconTrendUp } from '~/components/icons';
import type { AppTone } from '~/types/appCommon';

/**
 * AppStatCard - 대시보드 KPI 카드 (생산량, 가동률, 불량률, 달성률 등)
 * clickable 이면 AppButton(unstyled) 으로 렌더링되어 필터 카드로 사용할 수 있습니다.
 */
const props = withDefaults(
    defineProps<{
        title: string;
        value: number | string;
        unit?: string;
        /** 전일/전월 대비 증감 값 (+면 up, -면 down) */
        diff?: number | null;
        /** 증감 단위 (예: '%', 'EA') */
        diffUnit?: string;
        /** 감소가 좋은 지표(불량률 등)면 true - 색상을 반대로 표시 */
        reverse?: boolean;
        description?: string;
        /** 하단 진행 막대 (0~100) */
        progress?: number | null;
        tone?: AppTone;
        /** default(흰 카드) / soft(톤 연한 면) / fill(톤 진한 면) */
        variant?: 'default' | 'soft' | 'fill';
        size?: 'sm' | 'md' | 'lg';
        /** 소수점 자리수 (숫자 value) */
        precision?: number;
        clickable?: boolean;
        active?: boolean;
    }>(),
    {
        unit: '',
        diff: null,
        diffUnit: '',
        reverse: false,
        description: '',
        progress: null,
        tone: 'primary',
        variant: 'default',
        size: 'md',
        precision: 0,
        clickable: false,
        active: false,
    },
);

const emit = defineEmits<{ click: [MouseEvent] }>();

const displayValue = computed(() =>
    typeof props.value === 'number'
        ? props.value.toLocaleString(undefined, { minimumFractionDigits: props.precision, maximumFractionDigits: props.precision })
        : props.value,
);
// 색상: 좋아짐(up) / 나빠짐(down). reverse 지표는 감소가 좋아짐입니다. 아이콘 방향은 실제 증감 부호를 따릅니다.
const trend = computed(() => {
    if (!props.diff) return 'flat';
    const up = props.diff > 0;
    return (props.reverse ? !up : up) ? 'up' : 'down';
});
const diffText = computed(() => (props.diff == null ? '' : `${props.diff > 0 ? '+' : ''}${props.diff.toLocaleString()}${props.diffUnit}`));
</script>
