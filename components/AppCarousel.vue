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
                :shape="navVariant === 'circle' ? 'pill' : 'square'"
                :size="40"
                :icon-size="navVariant === 'plain' ? 28 : 16"
                :disabled="!loop && current === 0"
                aria-label="이전"
                @click="prev"
            >
                <IconChevronLeft />
            </AppIconButton>
            <AppIconButton
                class="app-carousel__nav app-carousel__nav--next"
                :shape="navVariant === 'circle' ? 'pill' : 'square'"
                :size="40"
                :icon-size="navVariant === 'plain' ? 28 : 16"
                :disabled="!loop && current === items.length - 1"
                aria-label="다음"
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
                    :aria-label="`${index + 1}번 슬라이드`"
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
                :aria-label="playing ? '일시정지' : '재생'"
                @click="playing = !playing"
            >
                <IconPause v-if="playing" />
                <IconPlay v-else />
            </AppIconButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight, IconPause, IconPlay } from '~/components/icons';
import type { AppId, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

export type AppCarouselItem = {
    id?: AppId;
    image?: string;
    title?: string;
    description?: string;
    [key: string]: unknown;
};

/**
 * AppCarousel (Figma 11. ETC - 좌우 슬라이드 버튼 / 인디케이터 / 플레이 버튼)
 * indicator: dots / bar(활성 막대) / line(진행 라인) / fraction(1/10) / none
 * navVariant: square / circle / plain(배경 없는 화살표)
 * 자동 재생 시 재생/일시정지 버튼을 항상 함께 제공합니다. (Figma 접근성 가이드)
 * 좌우/재생 버튼은 AppIconButton, 인디케이터 점은 AppButton(unstyled) 으로 구성합니다.
 */
const props = withDefaults(
    defineProps<{
        items: AppCarouselItem[];
        /** v-model: 현재 슬라이드 index */
        modelValue?: number;
        autoplay?: boolean;
        /** 자동 재생 간격(ms) */
        interval?: number;
        loop?: boolean;
        arrows?: boolean;
        navVariant?: 'square' | 'circle' | 'plain';
        indicator?: 'dots' | 'bar' | 'line' | 'fraction' | 'none';
        pauseOnHover?: boolean;
        width?: AppWidth;
        height?: AppWidth;
    }>(),
    {
        modelValue: undefined,
        autoplay: false,
        interval: 4000,
        loop: true,
        arrows: true,
        navVariant: 'circle',
        indicator: 'dots',
        pauseOnHover: true,
        height: 280,
    },
);

const emit = defineEmits<{ 'update:modelValue': [number]; change: [number] }>();

const innerIndex = ref(0);
const playing = ref(props.autoplay);
const hovering = ref(false);
const current = computed(() => props.modelValue ?? innerIndex.value);
const rootStyle = computed(() => ({ ...toSizeStyle(props.width, props.height), '--app-carousel-interval': `${props.interval}ms` }));
let timer: ReturnType<typeof setInterval> | null = null;

function goTo(index: number) {
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
