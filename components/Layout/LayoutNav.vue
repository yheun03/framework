<template>
    <nav class="layout-nav" aria-label="Sidebar navigation">
        <div class="layout-nav__header">
            <div class="layout-nav__brand">
                <div class="layout-nav__logo nav-logo" aria-hidden="true">
                    <Icon class="nav-logo__mark" icon="mdi:application-braces-outline" />
                </div>

                <AppButton class="layout-nav__mobile-close" variant="text" size="custom"
                    :custom-size="{ width: 36, height: 36 }" icon-only aria-label="메뉴 닫기" @click="emit('close')">
                    <template #iconLeft>
                        <Icon icon="mdi:close" />
                    </template>
                </AppButton>
            </div>

            <div class="layout-nav__actions" :aria-label="t('nav.demos')">
                <AppButton v-for="action in headerActions" :key="action.label" class="nav-action" variant="text"
                    size="custom" :custom-size="{ width: 32, height: 32 }" :ariaLabel="action.label">
                    <template #iconLeft>
                        <Icon :icon="action.icon" aria-hidden="true" />
                    </template>
                </AppButton>
            </div>
        </div>

        <div class="layout-nav__body">
            <div class="layout-nav__list-wrap">
                <ul class="layout-nav__list" role="menubar" :aria-label="t('nav.home')">
                    <LayoutNavItem v-for="menu in menuTree" :key="menu.id" :item="menu" />
                </ul>
            </div>
        </div>

        <div class="layout-nav__footer">
            <AppButton class="nav-action" variant="text" size="custom" :custom-size="{ width: 32, height: 32 }"
                :ariaLabel="t('settings.title')" to="/settings">
                <template #iconLeft>
                    <Icon icon="mdi:cog-outline" aria-hidden="true" />
                </template>
            </AppButton>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18nText } from '~/composables/useI18nText'
import { useNavigationStore } from '~/stores/navigation'
import { NAVIGATION_HEADER_ACTIONS } from '~/types/navigation'

const emit = defineEmits<{
    close: []
}>()

const { t } = useI18nText()
const navigationStore = useNavigationStore()
const { menuTree } = storeToRefs(navigationStore)
const headerActions = NAVIGATION_HEADER_ACTIONS

callOnce('navigation:menus', () => navigationStore.fetchMenus())
</script>
