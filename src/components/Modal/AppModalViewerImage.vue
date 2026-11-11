<template>
    <div class="app-image-viewer" :class="{ 'app-image-viewer--gallery': isGallery }">
        <div v-if="isGallery" class="app-image-viewer__toolbar">
            <span class="app-image-viewer__count"> {{ currentIndex + 1 }} / {{ imageItems.length }} </span>

            <div class="app-image-viewer__nav">
                <AppIconButton
                    :aria-label="$t('ui.viewer.prevImage')"
                    variant="outline"
                    :size="34"
                    :icon-size="18"
                    :disabled="currentIndex <= 0"
                    @click="handlePrevious"
                >
                    <IconChevronLeft />
                </AppIconButton>

                <AppIconButton
                    :aria-label="$t('ui.viewer.nextImage')"
                    variant="outline"
                    :size="34"
                    :icon-size="18"
                    :disabled="currentIndex >= imageItems.length - 1"
                    @click="handleNext"
                >
                    <IconChevronRight />
                </AppIconButton>
            </div>
        </div>

        <div class="app-image-viewer__stage">
            <img v-if="currentItem" class="app-image-viewer__image" :src="currentItem.url" :alt="currentItem.alt" />
        </div>

        <div v-if="isGallery" class="app-image-viewer__thumbs" :aria-label="$t('ui.viewer.imageList')">
            <button
                v-for="(item, index) in imageItems"
                :key="`${item.url}-${index}`"
                type="button"
                class="app-image-viewer__thumb"
                :class="{ 'is-active': index === currentIndex }"
                :aria-label="$t('ui.viewer.imageN', { n: index + 1 })"
                @click="setCurrentIndex(index)"
            >
                <img class="app-image-viewer__thumb-image" :src="item.url" :alt="item.alt" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { IconChevronLeft, IconChevronRight } from '@/components/icons';
import { computed, ref, watch } from 'vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String },
    items: { type: Array },
});

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

function setCurrentIndex(index) {
    currentIndex.value = index;
}

function handlePrevious() {
    currentIndex.value = Math.max(0, currentIndex.value - 1);
}

function handleNext() {
    currentIndex.value = Math.min(imageItems.value.length - 1, currentIndex.value + 1);
}
</script>
