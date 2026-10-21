<template>
    <span
        ref="triggerEl"
        v-bind="$attrs"
        class="app-popover-trigger"
        :aria-expanded="isOpen"
        :aria-controls="isOpen ? layerId : undefined"
        @click="trigger === 'click' && toggle()"
        @mouseenter="trigger === 'hover' && show()"
        @mouseleave="trigger === 'hover' && scheduleHide()"
    >
        <slot name="trigger" />
    </span>

    <Teleport to="body">
        <div
            v-if="isOpen"
            :id="layerId"
            ref="layerEl"
            class="app-popover"
            :class="`app-popover--${resolvedPlacement}`"
            :style="[layerStyle, sizeStyle]"
            role="dialog"
            @mouseenter="cancelHide"
            @mouseleave="trigger === 'hover' && scheduleHide()"
        >
            <div v-if="title || closable" class="app-popover__header">
                <strong v-if="title" class="app-popover__title">{{ title }}</strong>
                <AppIconButton v-if="closable" class="app-popover__close" :size="24" :icon-size="12" aria-label="닫기" @click="hide">
                    <IconClose />
                </AppIconButton>
            </div>
            <div class="app-popover__body">
                <slot />
            </div>
            <span class="app-popover__arrow" aria-hidden="true" />
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { IconClose } from '~/components/icons';
import { getFloatingStyle, useBodyOverlay } from '~/composables/useBodyOverlay';
import type { AppPlacement, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

/**
 * AppPopover (Figma 12. Popup Guide - 04_노출 레이어)
 * 마우스 오버 또는 클릭 시 trigger 근처에 정보 레이어를 노출합니다. (딤 없음)
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        title?: string;
        placement?: AppPlacement;
        trigger?: 'click' | 'hover';
        closable?: boolean;
        width?: AppWidth;
        /** v-model:open */
        open?: boolean;
    }>(),
    {
        title: '',
        placement: 'bottom',
        trigger: 'click',
        closable: true,
        width: 320,
        open: undefined,
    },
);

const emit = defineEmits<{ 'update:open': [boolean] }>();

const layerId = `app-popover-${useId()}`;
const triggerEl = ref<HTMLElement | null>(null);
const layerEl = ref<HTMLElement | null>(null);
const innerOpen = ref(false);
const resolvedPlacement = ref<AppPlacement>(props.placement);
const layerStyle = ref<Record<string, string>>({});
const sizeStyle = computed(() => toSizeStyle(props.width));
const isOpen = computed(() => (props.open === undefined ? innerOpen.value : props.open));
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const overlay = useBodyOverlay({
    trigger: () => triggerEl.value,
    overlay: () => layerEl.value,
    close: hide,
});

async function updatePosition() {
    await nextTick();
    const target = (triggerEl.value?.firstElementChild as HTMLElement | null) ?? triggerEl.value;
    if (!target || !layerEl.value) return;
    const result = getFloatingStyle(target, layerEl.value, props.placement, 12);
    resolvedPlacement.value = result.placement;
    layerStyle.value = result.style;
}

async function show() {
    cancelHide();
    innerOpen.value = true;
    emit('update:open', true);
    await updatePosition();
    overlay.start();
}

function hide() {
    overlay.stop();
    innerOpen.value = false;
    emit('update:open', false);
}

function toggle() {
    if (isOpen.value) hide();
    else show();
}

function scheduleHide() {
    cancelHide();
    hideTimer = setTimeout(hide, 120);
}

function cancelHide() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
}

watch(isOpen, (value) => value && updatePosition());
</script>
