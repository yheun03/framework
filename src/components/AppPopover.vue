<template>
    <span
        ref="triggerEl"
        v-bind="$attrs"
        class="app-popover-trigger"
        @click="trigger === 'click' && toggle()"
        @mouseenter="trigger === 'hover' && show()"
        @mouseleave="trigger === 'hover' && scheduleHide()"
        @focusin="trigger === 'hover' && show()"
        @focusout="trigger === 'hover' && scheduleHide()"
        @keydown.esc="hide"
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

<script setup>
import { IconClose } from '@/components/icons';
import { getFloatingStyle, useBodyOverlay } from '@/composables/useBodyOverlay';

import { toSizeStyle } from '@/utils/css';
import { computed, nextTick, ref, useId, watch } from 'vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppPopover (Figma 12. Popup Guide - 04_노출 레이어)
 * 마우스 오버 또는 클릭 시 trigger 근처에 정보 레이어를 노출합니다. (딤 없음)
 */
defineOptions({ inheritAttrs: false });

const props = defineProps({
    title: { type: String, default: '' },
    placement: { type: String, default: 'bottom' },
    trigger: { type: String, default: 'click' },
    closable: { type: Boolean, default: true },
    width: { type: [Number, String], default: 320 },
    /** v-model:open */
    open: { type: Boolean, default: undefined },
});

const emit = defineEmits(['update:open']);

const layerId = `app-popover-${useId()}`;
const triggerEl = ref(null);
const layerEl = ref(null);
const innerOpen = ref(false);
const resolvedPlacement = ref(props.placement);
const layerStyle = ref({});
const sizeStyle = computed(() => toSizeStyle(props.width));
const isOpen = computed(() => (props.open === undefined ? innerOpen.value : props.open));
let hideTimer = null;

const overlay = useBodyOverlay({
    trigger: () => triggerEl.value,
    overlay: () => layerEl.value,
    close: hide,
});

async function updatePosition() {
    await nextTick();
    const target = triggerEl.value?.firstElementChild ?? triggerEl.value;
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

// span 에는 aria-expanded 를 쓸 수 없으므로 안쪽 버튼(trigger 슬롯)에 열림 상태를 연결합니다.
watch(
    [isOpen, triggerEl],
    () => {
        const target = triggerEl.value?.querySelector('button, a, [tabindex]');
        if (!target) return;
        target.setAttribute('aria-expanded', String(isOpen.value));
        if (isOpen.value) target.setAttribute('aria-controls', layerId);
        else target.removeAttribute('aria-controls');
    },
    { flush: 'post' },
);
</script>
