<template>
    <span class="app-status-lamp" :class="[`app-status-lamp--${size}`, `app-status-lamp--tone-${tone}`, { 'is-blink': blink, 'is-off': off }]">
        <span class="app-status-lamp__light" aria-hidden="true" />
        <span v-if="label || $slots.default" class="app-status-lamp__label"
            ><slot>{{ label }}</slot></span
        >
    </span>
</template>

<script setup>
/**
 * AppStatusLamp - 설비/라인 상태 표시등
 * 권장 매핑: 가동(success) / 대기(warning) / 정지(danger) / 점검(info) / 미연결(off)
 */
defineProps({
    label: { type: String, default: '' },
    tone: { type: String, default: 'success' },
    size: { type: String, default: 'md' },
    /** 깜빡임 (알람) */
    blink: { type: Boolean, default: false },
    /** 꺼짐 (미연결/전원 off) */
    off: { type: Boolean, default: false },
});
</script>
