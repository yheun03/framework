<template>
    <div class="layout" :class="{ 'layout--nav-open': isNavOpen }">
        <!-- 키보드 사용자를 위한 본문 바로가기 (Tab 첫 포커스) -->
        <a class="skip-link" href="#main-content">{{ t('a11y.skipToContent') }}</a>

        <div class="layout__mobile-bar">
            <AppTextButton class="layout__nav-toggle" size="sm" :aria-label="$t('ui.nav.open')" @click="handleNavOpen">
                <template #iconLeft>
                    <IconMenu />
                </template>
                {{ $t('ui.nav.menu') }}
            </AppTextButton>

            <strong class="layout__mobile-title">{{ project.serviceName }}</strong>
        </div>

        <AppButton v-if="isNavOpen" class="layout__nav-dim" unstyled type="button" :aria-label="$t('ui.nav.close')" @click="handleNavClose" />

        <LayoutNav class="layout__nav" @close="handleNavClose" />
        <main id="main-content" class="layout__main" tabindex="-1">
            <LayoutTabsPage class="layout__tabs" />
            <div class="layout__content">
                <slot />
            </div>
            <div id="layout__page-bottom-fixed" class="layout__page-bottom-fixed" />
        </main>
    </div>
</template>

<script setup>
import { IconMenu } from '@/components/icons';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18nText } from '@/composables/useI18nText';
import { projectConfig as project } from '@/project.config';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';
import LayoutNav from '@/components/Layout/LayoutNav.vue';
import LayoutTabsPage from '@/components/Layout/LayoutTabsPage.vue';

const route = useRoute();
const { t } = useI18nText();
const isNavOpen = ref(false);

function handleNavOpen() {
    isNavOpen.value = true;
}

function handleNavClose() {
    isNavOpen.value = false;
}

watch(
    () => route.fullPath,
    () => {
        handleNavClose();
    },
);
</script>
