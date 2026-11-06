<template>
    <section
        v-if="!closed"
        class="app-line-banner"
        :class="[`app-line-banner--${size}`, `app-line-banner--${variant}`, `app-line-banner--align-${align}`]"
        :style="image ? { backgroundImage: `url(${image})` } : undefined"
        :aria-label="title"
    >
        <component :is="to ? RouterLink : 'div'" class="app-line-banner__inner" :to="to || undefined">
            <span v-if="$slots.object" class="app-line-banner__object" aria-hidden="true"><slot name="object" /></span>
            <span class="app-line-banner__text">
                <strong class="app-line-banner__title">{{ title }}</strong>
                <span v-if="description" class="app-line-banner__desc">{{ description }}</span>
            </span>
            <span v-if="$slots.actions" class="app-line-banner__actions"><slot name="actions" /></span>
        </component>

        <AppIconButton v-if="closable" class="app-line-banner__close" :size="32" :icon-size="16" aria-label="배너 닫기" @click="close">
            <IconClose />
        </AppIconButton>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { IconClose } from '@/components/icons';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppLineBanner (Figma 17. Line Banner Guide - 띠배너)
 * size : sm 90(최상단, 닫기) / md 120(약한, 서브) / lg 180(중간, 서브) / xl 240(강한, 메인)
 * align: center(기본형) / right(예외 케이스 - 오브젝트와 텍스트를 함께 우측 정렬)
 * 텍스트는 시스템 폰트(코딩)로 구현하고, 타이틀·본문 각각 1줄을 기준으로 합니다.
 * 오브젝트(이미지)는 #object 슬롯, 버튼은 #actions 슬롯을 사용합니다.
 */
defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    size: { type: String, default: 'md' },
    variant: { type: String, default: 'dark' },
    align: { type: String, default: 'center' },
    image: { type: String, default: '' },
    to: { type: String, default: '' },
    closable: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);
const closed = ref(false);

function close() {
    closed.value = true;
    emit('close');
}
</script>
