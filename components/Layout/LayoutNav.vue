<template>
    <nav class="layout-nav" aria-label="Sidebar navigation">
        <div class="layout-nav__header">
            <div class="layout-nav__brand">
                <div class="layout-nav__logo nav-logo" aria-hidden="true">
                    <IconApp class="nav-logo__mark" />
                </div>

                <AppIconButton class="layout-nav__mobile-close" :icon="IconClose" aria-label="메뉴 닫기" :button-size="36"
                    :icon-size="18" @click="handleClose" />
            </div>

            <div class="layout-nav__actions" :aria-label="t('nav.demos')">
                <AppIconButton v-for="action in headerActions" :key="action.label" class="nav-action"
                    :icon="action.icon" :aria-label="action.label" button-size="md" icon-size="lg" />
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
            <AppIconButton class="nav-action" :icon="IconCog" :aria-label="t('settings.title')" button-size="md"
                icon-size="lg" to="/settings" />
        </div>
    </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useI18nText } from "~/composables/useI18nText";
import { useNavigationStore } from "~/stores/navigation";
import { NAVIGATION_HEADER_ACTIONS } from "~/types/appNavigation";
import { IconApp, IconClose, IconCog } from "~/components/icons";

const emit = defineEmits<{
    close: [];
}>();

const { t } = useI18nText();
const navigationStore = useNavigationStore();
const { menuTree } = storeToRefs(navigationStore);
const headerActions = NAVIGATION_HEADER_ACTIONS;

function handleClose() {
    emit("close");
}

callOnce("navigation:menus", () => navigationStore.fetchMenus());
</script>
