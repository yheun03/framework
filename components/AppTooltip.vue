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
                ><slot name="content">{{ text }}</slot></span
            >
            <AppIconButton v-if="closable" class="app-tooltip__close" :size="18" :icon-size="14" shape="pill" aria-label="닫기" @click="hide">
                <IconCloseSmall />
            </AppIconButton>
            <span class="app-tooltip__arrow" aria-hidden="true" />
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { IconCloseSmall } from '~/components/icons';
import { getFloatingStyle, useBodyOverlay } from '~/composables/useBodyOverlay';
import type { AppPlacement, AppShape } from '~/types/appCommon';

/**
 * AppTooltip (Figma 11. ETC - 말풍선)
 * trigger: hover(기본) / click / always(항상 노출)
 * variant: dark(검정) / light(흰색+그림자) / outline(흰색+라인)
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        text?: string;
        placement?: AppPlacement;
        trigger?: 'hover' | 'click' | 'always';
        variant?: 'dark' | 'light' | 'outline';
        shape?: AppShape;
        closable?: boolean;
        /** v-model:open (trigger="click" 일 때 외부 제어용) */
        open?: boolean;
    }>(),
    {
        text: '',
        placement: 'top',
        trigger: 'hover',
        variant: 'dark',
        shape: 'square',
        closable: false,
        open: undefined,
    },
);

const emit = defineEmits<{ 'update:open': [boolean] }>();

const tooltipId = `app-tooltip-${useId()}`;
const triggerEl = ref<HTMLElement | null>(null);
const layerEl = ref<HTMLElement | null>(null);
const innerOpen = ref(false);
const resolvedPlacement = ref<AppPlacement>(props.placement);
const layerStyle = ref<Record<string, string>>({});
const isOpen = computed(() => (props.open === undefined ? innerOpen.value : props.open));

const overlay = useBodyOverlay({
    trigger: () => triggerEl.value,
    overlay: () => layerEl.value,
    close: () => props.trigger !== 'always' && hide(),
});

async function updatePosition() {
    await nextTick();
    const target = (triggerEl.value?.firstElementChild as HTMLElement | null) ?? triggerEl.value;
    if (!target || !layerEl.value) return;
    const result = getFloatingStyle(target, layerEl.value, props.placement);
    resolvedPlacement.value = result.placement;
    layerStyle.value = result.style;
}

function setOpen(value: boolean) {
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
