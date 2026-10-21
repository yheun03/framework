<template>
    <Teleport to="body">
        <TransitionGroup tag="div" name="app-toast" class="app-toast-host" :class="`app-toast-host--${placement}`" aria-live="polite">
            <div v-for="toast in toasts" :key="toast.id" class="app-toast" :class="toast.tone && `app-toast--${toast.tone}`" role="status">
                <span v-if="toast.tone" class="app-toast__icon" aria-hidden="true">
                    <IconCheckCircle v-if="toast.tone === 'success'" />
                    <IconCrossCircle v-else-if="toast.tone === 'danger'" />
                    <IconWarning v-else-if="toast.tone === 'warning'" />
                    <IconInfo v-else />
                </span>
                <p class="app-toast__message">{{ toast.message }}</p>
                <span v-if="toast.meta" class="app-toast__meta"><IconBell />{{ toast.meta }}</span>
                <AppTextButton v-if="toast.actionText" class="app-toast__action" variant="underline" size="sm" @click="handleAction(toast)">
                    {{ toast.actionText }}
                </AppTextButton>
                <AppIconButton
                    v-if="toast.closable"
                    class="app-toast__close"
                    size="xs"
                    shape="pill"
                    aria-label="닫기"
                    @click="store.remove(toast.id)"
                >
                    <IconCloseSmall />
                </AppIconButton>
            </div>
        </TransitionGroup>
    </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { IconBell, IconCheckCircle, IconCloseSmall, IconCrossCircle, IconInfo, IconWarning } from '~/components/icons';
import { useToastStore } from '~/stores/toast';
import type { ToastItem, ToastPlacement } from '~/types/appToast';

/**
 * AppToastHost (Figma 12. Popup Guide - 03_토스트 팝업)
 * app.vue 에 한 번만 배치하고, 화면에서는 useToast() 로 호출합니다.
 */
withDefaults(defineProps<{ placement?: ToastPlacement }>(), { placement: 'bottom' });

const store = useToastStore();
const { toasts } = storeToRefs(store);

function handleAction(toast: ToastItem) {
    toast.onAction?.();
    store.remove(toast.id);
}
</script>
