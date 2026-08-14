<template>
    <div class="app-image-viewer" :class="{ 'app-image-viewer--gallery': isGallery }">
        <div v-if="isGallery" class="app-image-viewer__toolbar">
            <span class="app-image-viewer__count">
                {{ currentIndex + 1 }} / {{ imageItems.length }}
            </span>

            <div class="app-image-viewer__nav">
                <AppIconButton :icon="IconChevronLeft" aria-label="이전 이미지" variant="outline" :size="34"
                    :icon-size="18" :disabled="currentIndex <= 0" @click="handlePrevious" />

                <AppIconButton :icon="IconChevronRight" aria-label="다음 이미지" variant="outline" :size="34"
                    :icon-size="18" :disabled="currentIndex >= imageItems.length - 1" @click="handleNext" />
            </div>
        </div>

        <div class="app-image-viewer__stage">
            <img v-if="currentItem" class="app-image-viewer__image" :src="currentItem.url" :alt="currentItem.alt" />
        </div>

        <div v-if="isGallery" class="app-image-viewer__thumbs" aria-label="이미지 목록">
            <button v-for="(item, index) in imageItems" :key="`${item.url}-${index}`" type="button"
                class="app-image-viewer__thumb" :class="{ 'is-active': index === currentIndex }"
                :aria-label="`${index + 1}번 이미지 보기`" @click="setCurrentIndex(index)">
                <img class="app-image-viewer__thumb-image" :src="item.url" :alt="item.alt" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from "~/components/icons";

type ImageViewerItem = {
    url: string;
    alt?: string;
};

const props = defineProps<{
    src: string;
    alt?: string;
    items?: ImageViewerItem[];
}>();

const currentIndex = ref(0);

const imageItems = computed(() => {
    if (props.items?.length) return props.items;

    return [
        {
            url: props.src,
            alt: props.alt,
        },
    ];
});

const currentItem = computed(() => imageItems.value[currentIndex.value] ?? null);
const isGallery = computed(() => imageItems.value.length > 1);

watch(
    imageItems,
    () => {
        currentIndex.value = 0;
    },
    { deep: true },
);

function setCurrentIndex(index: number) {
    currentIndex.value = index;
}

function handlePrevious() {
    currentIndex.value = Math.max(0, currentIndex.value - 1);
}

function handleNext() {
    currentIndex.value = Math.min(imageItems.value.length - 1, currentIndex.value + 1);
}
</script>
