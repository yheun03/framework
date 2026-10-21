<template>
    <div
        v-if="visible"
        class="app-alert"
        :class="[`app-alert--${variant}`, `app-alert--tone-${tone}`]"
        :role="tone === 'danger' ? 'alert' : 'status'"
    >
        <span v-if="showIcon" class="app-alert__icon" aria-hidden="true">
            <slot name="icon">
                <IconCheckCircle v-if="tone === 'success'" />
                <IconCrossCircle v-else-if="tone === 'danger'" />
                <IconWarning v-else-if="tone === 'warning'" />
                <IconInfo v-else />
            </slot>
        </span>
        <div class="app-alert__body">
            <strong v-if="title" class="app-alert__title">{{ title }}</strong>
            <div v-if="description || $slots.default" class="app-alert__desc">
                <slot>{{ description }}</slot>
            </div>
        </div>
        <div v-if="$slots.actions" class="app-alert__actions"><slot name="actions" /></div>
        <AppIconButton v-if="closable" class="app-alert__close" size="sm" shape="pill" aria-label="닫기" @click="close">
            <IconCloseSmall />
        </AppIconButton>
    </div>
</template>

<script setup lang="ts">
import { IconCheckCircle, IconCloseSmall, IconCrossCircle, IconInfo, IconWarning } from '~/components/icons';
import type { AppTone } from '~/types/appCommon';

/**
 * AppAlert - 화면 안에 고정으로 노출하는 안내/경고 배너 (MES 공지, 설비 알람, 검증 결과 요약 등)
 * 팝업 형태의 알림은 useModal().openAlert(), 잠깐 띄우는 알림은 useToast() 를 사용합니다.
 */
withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        tone?: AppTone;
        /** soft(연한 면) / outline(라인) / fill(진한 면) */
        variant?: 'soft' | 'outline' | 'fill';
        closable?: boolean;
        showIcon?: boolean;
    }>(),
    {
        title: '',
        description: '',
        tone: 'info',
        variant: 'soft',
        closable: false,
        showIcon: true,
    },
);

const emit = defineEmits<{ close: [] }>();
const visible = ref(true);

function close() {
    visible.value = false;
    emit('close');
}

defineExpose({ show: () => (visible.value = true), close });
</script>
