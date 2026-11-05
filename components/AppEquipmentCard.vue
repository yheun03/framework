<template>
    <article class="app-equipment-card" :class="{ 'is-active': active }">
        <header class="app-equipment-card__head">
            <div class="app-equipment-card__name">
                <strong class="app-equipment-card__title">{{ title }}</strong>
                <span v-if="code" class="app-equipment-card__code">{{ code }}</span>
            </div>
            <AppStatusLamp :tone="statusMap[status].tone" :off="status === 'off'" :blink="status === 'stop'" :label="statusMap[status].label" />
        </header>

        <AppProgressBar v-if="value != null" :value="value" :label="valueLabel" show-value :disabled="status === 'off'" />

        <dl v-if="items.length" class="app-equipment-card__metrics">
            <div v-for="item in items" :key="item.label" class="app-equipment-card__metric">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
            </div>
        </dl>

        <div v-if="$slots.actions" class="app-equipment-card__actions">
            <slot name="actions" />
        </div>
    </article>
</template>

<script setup lang="ts">
import type { AppTone } from '~/types/appCommon';

export type AppEquipmentStatus = 'run' | 'idle' | 'stop' | 'check' | 'off';

/**
 * AppEquipmentCard - 설비 현황 카드 (MES 확장)
 * AppStatusLamp + AppProgressBar 조합입니다.
 * status : run(가동) / idle(대기) / stop(정지·깜빡임) / check(점검) / off(미연결)
 * value  : 가동률 등 대표 지표(%) / items : 하단 지표 목록 (label, value)
 * active : 선택된 설비 강조
 */
withDefaults(
    defineProps<{
        title: string;
        code?: string;
        status?: AppEquipmentStatus;
        value?: number | null;
        valueLabel?: string;
        items?: { label: string; value: string | number }[];
        active?: boolean;
    }>(),
    {
        code: '',
        status: 'run',
        value: null,
        valueLabel: '가동률',
        items: () => [],
        active: false,
    },
);

const statusMap: Record<AppEquipmentStatus, { tone: AppTone; label: string }> = {
    run: { tone: 'success', label: '가동' },
    idle: { tone: 'warning', label: '대기' },
    stop: { tone: 'danger', label: '정지' },
    check: { tone: 'info', label: '점검' },
    off: { tone: 'gray', label: '미연결' },
};
</script>
