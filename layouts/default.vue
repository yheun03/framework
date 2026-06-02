<template>
    <div class="layout" :class="{ 'layout--nav-open': isNavOpen }">
        <div class="layout__mobile-bar">
            <AppButton class="layout__nav-toggle" variant="text" size="sm" aria-label="메뉴 열기" @click="openNav">
                <template #iconLeft>
                    <Icon icon="mdi:menu" />
                </template>
                메뉴
            </AppButton>

            <strong class="layout__mobile-title">Framework</strong>
        </div>

        <AppButton v-if="isNavOpen" class="layout__nav-dim" unstyled type="button" aria-label="메뉴 닫기"
            @click="closeNav" />

        <LayoutNav class="layout__nav" @close="closeNav" />
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
const route = useRoute()
const isNavOpen = ref(false)

function openNav() {
    isNavOpen.value = true
}

function closeNav() {
    isNavOpen.value = false
}

watch(
    () => route.fullPath,
    () => {
        closeNav()
    },
)
</script>
