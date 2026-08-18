<template>
    <div class="layout" :class="{ 'layout--nav-open': isNavOpen }">
        <div class="layout__mobile-bar">
            <AppTextButton class="layout__nav-toggle" size="sm" aria-label="메뉴 열기" @click="handleNavOpen">
                <template #iconLeft>
                    <IconMenu />
                </template>
                메뉴
            </AppTextButton>

            <strong class="layout__mobile-title">Framework</strong>
        </div>

        <AppButton v-if="isNavOpen" class="layout__nav-dim" unstyled type="button" aria-label="메뉴 닫기" @click="handleNavClose" />

        <LayoutNav class="layout__nav" @close="handleNavClose" />
        <main class="layout__main">
            <LayoutTabsPage class="layout__tabs" />
            <div class="layout__content">
                <slot />
            </div>
            <div id="layout__page-bottom-fixed" class="layout__page-bottom-fixed" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { IconMenu } from '~/components/icons';

const route = useRoute();
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
