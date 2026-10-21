<template>
    <span class="app-status-lamp" :class="[`app-status-lamp--${size}`, `app-status-lamp--tone-${tone}`, { 'is-blink': blink, 'is-off': off }]">
        <span class="app-status-lamp__light" aria-hidden="true" />
        <span v-if="label || $slots.default" class="app-status-lamp__label"
            ><slot>{{ label }}</slot></span
        >
    </span>
</template>

<script setup lang="ts">
import type { AppTone } from '~/types/appCommon';

/**
 * AppStatusLamp - 설비/라인 상태 표시등
 * 권장 매핑: 가동(success) / 대기(warning) / 정지(danger) / 점검(info) / 미연결(off)
 */
withDefaults(
    defineProps<{
        label?: string;
        tone?: AppTone;
        size?: 'sm' | 'md' | 'lg';
        /** 깜빡임 (알람) */
        blink?: boolean;
        /** 꺼짐 (미연결/전원 off) */
        off?: boolean;
    }>(),
    {
        label: '',
        tone: 'success',
        size: 'md',
        blink: false,
        off: false,
    },
);
</script>
