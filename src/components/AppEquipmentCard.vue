<template>
    <article class="app-equipment-card" :class="{ 'is-active': active }">
        <header class="app-equipment-card__head">
            <div class="app-equipment-card__name">
                <strong class="app-equipment-card__title">{{ title }}</strong>
                <span v-if="code" class="app-equipment-card__code">{{ code }}</span>
            </div>
            <AppStatusLamp :tone="statusMap[status].tone" :off="status === 'off'" :blink="status === 'stop'" :label="$t(`ui.equipment.${status}`)" />
        </header>

        <AppProgressBar
            v-if="progress != null"
            :value="progress"
            :label="progressLabel ?? $t('ui.equipment.progress')"
            show-value
            :disabled="status === 'off'"
        />

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

<script setup>
import { oneOf } from '@/utils/props';
/**
 * AppEquipmentCard - 설비 현황 카드 (MES 확장)
 * AppStatusLamp + AppProgressBar 조합입니다.
 * status : run(가동) / idle(대기) / stop(정지·깜빡임) / check(점검) / off(미연결)
 * progress : 가동률 등 대표 지표(%, AppStatCard 와 같은 이름) / items : 하단 지표 목록 (label, value)
 * active : 선택된 설비 강조
 */
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppStatusLamp from '@/components/AppStatusLamp.vue';

defineProps({
    title: { type: String, required: true },
    code: { type: String, default: '' },
    status: { type: String, default: 'run', validator: oneOf(['run', 'idle', 'stop', 'check', 'off']) },
    progress: { type: [Number, null], default: null },
    /** 기본 '가동률' (i18n ui.equipment.progress) */
    progressLabel: { type: String, default: undefined },
    items: { type: Array, default: () => [] },
    active: { type: Boolean, default: false },
});

// 상태 문구: i18n ui.equipment.{run | idle | stop | check | off}
const statusMap = {
    run: { tone: 'success' },
    idle: { tone: 'warning' },
    stop: { tone: 'danger' },
    check: { tone: 'info' },
    off: { tone: 'gray' },
};
</script>
