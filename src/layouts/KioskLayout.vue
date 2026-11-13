<template>
    <!--
        현장 키오스크 · 터치 단말 레이아웃 (ROUTE_META 의 layout: 'kiosk')
        - LNB · 상단 탭 없이 한 화면만 크게 보여 줍니다. 글자 · 버튼이 커지고(터치 영역 56px 이상) 화면 확대 · 텍스트 선택을 막습니다.
        - 상단: 서비스명 · 현재 시각 · 화면별 정보(#info 슬롯) · 전체 화면 · 나가기
    -->
    <div class="kiosk-layout">
        <header class="kiosk-layout__header">
            <strong class="kiosk-layout__brand">{{ project.serviceName }}</strong>
            <div class="kiosk-layout__info"><slot name="info" /></div>
            <time class="kiosk-layout__clock" :datetime="now.toISOString()">{{ clock }}</time>
            <AppButton size="lg" variant="outline" tone="gray" class="kiosk-layout__tool" @click="toggleFullscreen">
                {{ t('ui.kiosk.fullscreen') }}
            </AppButton>
            <AppButton size="lg" variant="outline" tone="gray" class="kiosk-layout__tool" to="/">{{ t('ui.kiosk.exit') }}</AppButton>
        </header>
        <main id="main-content" class="kiosk-layout__main" tabindex="-1">
            <slot />
        </main>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18nText } from '@/composables/useI18nText';
import { projectConfig as project } from '@/project.config';
import AppButton from '@/components/AppButton/AppButton.vue';

const { t } = useI18nText();

// 현재 시각 (1초마다) - 화면을 떠나면 멈춤
const now = ref(new Date());
const timer = setInterval(() => (now.value = new Date()), 1000);
onBeforeUnmount(() => clearInterval(timer));
const clock = computed(() => now.value.toTimeString().slice(0, 8)); // 'HH:mm:ss'

function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
}
</script>

<style scoped lang="scss">
.kiosk-layout {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    min-height: 100dvh;
    background: var(--theme-gray-50);
    // 터치 단말: 두 번 탭 확대 · 길게 눌러 텍스트 선택 방지
    touch-action: manipulation;
    user-select: none;

    &__header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 24px;
        background: var(--theme-gray-900);
        color: var(--theme-gray-0);
    }

    &__brand {
        @include font(h4, sb);
    }

    &__info {
        flex: 1 1 auto;
        min-width: 0;
        @include font(b1, md);
    }

    &__clock {
        @include font(h4, sb);
        font-variant-numeric: tabular-nums;
    }

    &__tool {
        min-width: 96px;
    }

    &__main {
        min-height: 0;
        padding: 20px 24px;
        outline: none;
    }

    @include tablet {
        &__header {
            flex-wrap: wrap;
            gap: 10px;
            padding: 10px 16px;
        }

        &__main {
            padding: 14px 16px;
        }
    }
}
</style>
