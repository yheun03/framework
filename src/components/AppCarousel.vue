<template>
    <div
        class="app-carousel"
        :class="[`app-carousel--nav-${navVariant}`, `app-carousel--indicator-${indicator}`]"
        :style="rootStyle"
        role="region"
        aria-roledescription="carousel"
        @mouseenter="pauseOnHover && (hovering = true)"
        @mouseleave="hovering = false"
    >
        <div class="app-carousel__viewport">
            <div class="app-carousel__track" :style="{ transform: `translateX(-${current * 100}%)` }">
                <div
                    v-for="(item, index) in items"
                    :key="item.id ?? index"
                    class="app-carousel__slide"
                    role="group"
                    :aria-label="`${index + 1} / ${items.length}`"
                    :aria-hidden="index !== current"
                >
                    <slot :item="item" :index="index">
                        <img v-if="item.image" class="app-carousel__image" :src="item.image" :alt="item.title ?? ''" />
                        <div v-if="item.title || item.description" class="app-carousel__caption">
                            <strong v-if="item.title" class="app-carousel__title">{{ item.title }}</strong>
                            <p v-if="item.description" class="app-carousel__desc">{{ item.description }}</p>
                        </div>
                    </slot>
                </div>
            </div>
        </div>

        <template v-if="arrows && items.length > 1">
            <AppIconButton
                class="app-carousel__nav app-carousel__nav--prev"
                :shape="navShape"
                :size="navSize"
                :icon-size="navIconSize"
                :disabled="!loop && current === 0"
                :aria-label="$t('ui.prev')"
                @click="prev"
            >
                <IconChevronLeft />
            </AppIconButton>
            <AppIconButton
                class="app-carousel__nav app-carousel__nav--next"
                :shape="navShape"
                :size="navSize"
                :icon-size="navIconSize"
                :disabled="!loop && current === items.length - 1"
                :aria-label="$t('ui.next')"
                @click="next"
            >
                <IconChevronRight />
            </AppIconButton>
        </template>

        <div v-if="indicator !== 'none' && items.length > 1" class="app-carousel__indicator">
            <span v-if="indicator === 'fraction'" class="app-carousel__fraction">
                <strong>{{ current + 1 }}</strong
                >/{{ items.length }}
            </span>
            <template v-else>
                <AppButton
                    v-for="(item, index) in items"
                    :key="item.id ?? index"
                    unstyled
                    class="app-carousel__dot"
                    :class="{ 'is-active': index === current }"
                    :aria-label="$t('ui.carousel.slideN', { n: index + 1 })"
                    :aria-current="index === current || undefined"
                    @click="goTo(index)"
                />
            </template>
            <AppIconButton
                v-if="autoplay"
                class="app-carousel__play"
                shape="pill"
                :size="22"
                :icon-size="9"
                :aria-label="playing ? $t('ui.carousel.pause') : $t('ui.carousel.play')"
                @click="playing = !playing"
            >
                <IconPause v-if="playing" />
                <IconPlay v-else />
            </AppIconButton>
        </div>
    </div>
</template>

<script setup>
import { SHAPES, SIZES, oneOf } from '@/utils/props';
import { IconChevronLeft, IconChevronRight, IconPause, IconPlay } from '@/components/icons';

import { toSizeStyle } from '@/utils/css';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppCarousel (Figma 11. ETC - 좌우 슬라이드 버튼 / 인디케이터 / 플레이 버튼)
 * indicator: dots / bar(활성 막대) / line(진행 라인) / fraction(1/10) / none
 * navVariant: fill(배경 있는 화살표) / plain(배경 없는 화살표) · navShape: square / round / pill · navSize: AppIconButton 과 같은 크기
 * 자동 재생 시 재생/일시정지 버튼을 항상 함께 제공합니다. (Figma 접근성 가이드)
 * 좌우/재생 버튼은 AppIconButton, 인디케이터 점은 AppButton(unstyled) 으로 구성합니다.
 */
const props = defineProps({
    items: { type: Array, required: true },
    /** v-model: 현재 슬라이드 index */
    modelValue: { type: Number, default: undefined },
    autoplay: { type: Boolean, default: false },
    /** 자동 재생 간격(ms) */
    interval: { type: Number, default: 4000 },
    loop: { type: Boolean, default: true },
    arrows: { type: Boolean, default: true },
    /** 좌우 버튼 - fill: 배경 있음(Figma 좌우화살표_BG) / plain: 배경 없음(Figma 좌우화살표_NO_BG) */
    navVariant: { type: String, default: 'fill', validator: oneOf(['fill', 'plain']) },
    /** 좌우 버튼 모서리 (AppButton 과 같은 이름) */
    navShape: { type: String, default: 'pill', validator: oneOf(SHAPES) },
    /** 좌우 버튼 크기 - AppIconButton 과 같은 이름(xs 24 · sm 36 · md 44 · lg 48 · xl 56) 또는 숫자(px, 예: 72) */
    navSize: { type: [String, Number], default: 'lg', validator: oneOf(SIZES, { number: true }) },
    indicator: { type: String, default: 'dots', validator: oneOf(['dots', 'bar', 'line', 'fraction', 'none']) },
    pauseOnHover: { type: Boolean, default: true },
    width: { type: [Number, String] },
    height: { type: [Number, String], default: 280 },
});

const emit = defineEmits(['update:modelValue', 'change']);

const innerIndex = ref(0);
const playing = ref(props.autoplay);
const hovering = ref(false);
const current = computed(() => props.modelValue ?? innerIndex.value);
const NAV_PX = { xs: 24, sm: 36, md: 44, lg: 48, xl: 56 };
const navPx = computed(() => (typeof props.navSize === 'number' ? props.navSize : NAV_PX[props.navSize]));
// 아이콘은 버튼의 1/3 (배경 없는 화살표는 버튼 크기의 2/3)
const navIconSize = computed(() => Math.round(navPx.value * (props.navVariant === 'plain' ? 2 / 3 : 1 / 3)));
const rootStyle = computed(() => ({
    ...toSizeStyle(props.width, props.height),
    '--app-carousel-interval': `${props.interval}ms`,
    // 캡션이 좌우 버튼과 겹치지 않도록 버튼 크기만큼 띄움
    '--app-carousel-caption-inset': props.arrows ? `${navPx.value + 24}px` : '24px',
}));
let timer = null;

function goTo(index) {
    const total = props.items.length;
    if (!total) return;
    const next = props.loop ? (index + total) % total : Math.min(total - 1, Math.max(0, index));
    innerIndex.value = next;
    emit('update:modelValue', next);
    emit('change', next);
}

function prev() {
    goTo(current.value - 1);
}

function next() {
    goTo(current.value + 1);
}

function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
}

function startTimer() {
    stopTimer();
    if (!playing.value || hovering.value || props.items.length < 2) return;
    timer = setInterval(next, props.interval);
}

watch([playing, hovering, () => props.items.length, () => props.interval], startTimer);
onMounted(startTimer);
onBeforeUnmount(stopTimer);
</script>
