<template>
    <span
        ref="triggerEl"
        v-bind="$attrs"
        class="app-tooltip-trigger"
        :aria-describedby="isOpen ? tooltipId : undefined"
        @mouseenter="trigger === 'hover' && show()"
        @mouseleave="trigger === 'hover' && hide()"
        @focusin="trigger === 'hover' && show()"
        @focusout="trigger === 'hover' && hide()"
        @click="trigger === 'click' && toggle()"
    >
        <slot />
    </span>

    <Teleport to="body">
        <div
            v-if="isOpen"
            :id="tooltipId"
            ref="layerEl"
            role="tooltip"
            class="app-tooltip"
            :class="[`app-tooltip--${variant}`, `app-tooltip--${resolvedPlacement}`, `app-tooltip--shape-${shape}`]"
            :style="layerStyle"
        >
            <span class="app-tooltip__text"
                ><slot name="content">{{ label }}</slot></span
            >
            <AppIconButton
                v-if="closable"
                class="app-tooltip__close"
                :size="18"
                :icon-size="14"
                shape="pill"
                :aria-label="$t('ui.close')"
                @click="hide"
            >
                <IconCloseSmall />
            </AppIconButton>
            <span class="app-tooltip__arrow" aria-hidden="true" />
        </div>
    </Teleport>
</template>

<script setup>
import { PLACEMENTS, SHAPES, oneOf } from '@/utils/props';
import { IconCloseSmall } from '@/components/icons';
import { getFloatingStyle, useBodyOverlay } from '@/composables/useBodyOverlay';
import { computed, nextTick, onBeforeUnmount, onDeactivated, onMounted, ref, useId, watch } from 'vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppTooltip (Figma 11. ETC - 말풍선)
 * trigger: hover(기본) / click / always(항상 노출)
 * variant: dark(검정) / light(흰색+그림자) / outline(흰색+라인)
 */
defineOptions({ inheritAttrs: false });

const props = defineProps({
    label: { type: String, default: '' },
    placement: { type: String, default: 'top', validator: oneOf(PLACEMENTS) },
    trigger: { type: String, default: 'hover' },
    variant: { type: String, default: 'dark', validator: oneOf(['dark', 'light', 'outline']) },
    shape: { type: String, default: 'square', validator: oneOf(SHAPES) },
    closable: { type: Boolean, default: false },
    /** v-model:open (trigger="click" 일 때 외부 제어용) */
    open: { type: Boolean, default: undefined },
});

const emit = defineEmits(['update:open']);

const tooltipId = `app-tooltip-${useId()}`;
const triggerEl = ref(null);
const layerEl = ref(null);
const innerOpen = ref(false);
const resolvedPlacement = ref(props.placement);
const layerStyle = ref({});
const isOpen = computed(() => (props.open === undefined ? innerOpen.value : props.open));

const overlay = useBodyOverlay({
    trigger: () => triggerEl.value,
    overlay: () => layerEl.value,
    close: () => props.trigger !== 'always' && hide(),
});

async function updatePosition() {
    await nextTick();
    const target = triggerEl.value?.firstElementChild ?? triggerEl.value;
    if (!target || !layerEl.value) return;
    const result = getFloatingStyle(target, layerEl.value, props.placement);
    resolvedPlacement.value = result.placement;
    layerStyle.value = result.style;
}

function setOpen(value) {
    innerOpen.value = value;
    emit('update:open', value);
}

async function show() {
    setOpen(true);
    await updatePosition();
    if (props.trigger === 'click') overlay.start();
}

function hide() {
    overlay.stop();
    setOpen(false);
}

// 탭 전환(KeepAlive)으로 화면이 숨겨지면 닫습니다.
onDeactivated(() => {
    if (isOpen.value) hide();
});

function toggle() {
    if (isOpen.value) hide();
    else show();
}

watch(isOpen, (value) => value && updatePosition());

onMounted(() => {
    if (props.trigger !== 'always') return;
    show();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', updatePosition, true);
});
</script>
