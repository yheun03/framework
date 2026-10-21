<template>
    <Transition name="app-top-button">
        <AppButton
            v-show="visible"
            unstyled
            class="app-top-button"
            :class="[`app-top-button--${variant}`, `app-top-button--shape-${shape}`, { 'is-fixed': fixed }]"
            :style="positionStyle"
            aria-label="맨 위로 이동"
            @click="scrollTop"
        >
            <IconArrowUpToLine v-if="icon === 'bar'" />
            <IconArrowUp v-else-if="icon === 'arrow'" />
            <IconAngleUp v-else />
            <span v-if="label" class="app-top-button__label">{{ label }}</span>
        </AppButton>
    </Transition>
</template>

<script setup lang="ts">
import { IconAngleUp, IconArrowUp, IconArrowUpToLine } from '~/components/icons';
import { toCssSize } from '~/utils/css';

/**
 * AppTopButton (Figma 11. ETC - 탑 버튼) - AppButton(unstyled) 기반
 * variant: outline(흰 바탕 라인) / fill(검정) / shadow(흰 바탕 그림자)
 * shape: square / round / circle,  icon: chevron / arrow / bar
 */
const props = withDefaults(
    defineProps<{
        variant?: 'outline' | 'fill' | 'shadow';
        shape?: 'square' | 'round' | 'circle';
        icon?: 'chevron' | 'arrow' | 'bar';
        label?: string;
        /** 화면 우하단 고정 */
        fixed?: boolean;
        /** 노출 시작 스크롤 위치(px). 0 이면 항상 노출 */
        threshold?: number;
        /** 스크롤 대상 선택자 (기본: 레이아웃 콘텐츠 → window) */
        target?: string;
        right?: number | string;
        bottom?: number | string;
    }>(),
    {
        variant: 'outline',
        shape: 'square',
        icon: 'chevron',
        label: '',
        fixed: true,
        threshold: 200,
        target: '',
        right: 24,
        bottom: 24,
    },
);

const scrollY = ref(0);
const visible = computed(() => !props.fixed || props.threshold <= 0 || scrollY.value > props.threshold);
const positionStyle = computed(() => (props.fixed ? { right: toCssSize(props.right), bottom: toCssSize(props.bottom) } : undefined));
let scroller: HTMLElement | Window | null = null;

function getScroller(): HTMLElement | Window {
    if (props.target) return document.querySelector<HTMLElement>(props.target) ?? window;
    return document.querySelector<HTMLElement>('.layout__content') ?? window;
}

function readScroll() {
    scrollY.value = scroller instanceof Window ? window.scrollY : (scroller?.scrollTop ?? 0);
}

function scrollTop() {
    (scroller ?? window).scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
    scroller = getScroller();
    scroller.addEventListener('scroll', readScroll, { passive: true });
    readScroll();
});

onBeforeUnmount(() => scroller?.removeEventListener('scroll', readScroll));
</script>
