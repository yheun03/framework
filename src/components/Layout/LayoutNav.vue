<template>
    <nav class="layout-nav" :aria-label="$t('ui.nav.name')">
        <div class="layout-nav__header">
            <div class="layout-nav__brand">
                <div class="layout-nav__logo nav-logo" aria-hidden="true">
                    <IconApp class="nav-logo__mark" />
                </div>

                <AppIconButton class="layout-nav__mobile-close" :aria-label="$t('ui.nav.close')" size="sm" :icon-size="18" @click="handleClose"
                    ><IconClose
                /></AppIconButton>
            </div>

            <div class="layout-nav__actions" :aria-label="$t('ui.nav.tools')">
                <AppIconButton
                    v-for="action in headerActions"
                    :key="action.labelKey"
                    class="nav-action"
                    :aria-label="$t(action.labelKey)"
                    :size="32"
                    icon-size="lg"
                >
                    <component :is="action.icon" />
                </AppIconButton>
            </div>
        </div>

        <div class="layout-nav__search" role="search">
            <label class="sr-only" for="layout-nav-search">{{ $t('ui.nav.search') }}</label>
            <IconSearch class="layout-nav__search-icon" />
            <input
                id="layout-nav-search"
                ref="searchInput"
                v-model="keyword"
                class="layout-nav__search-input"
                type="search"
                :placeholder="$t('ui.nav.searchPlaceholder')"
                autocomplete="off"
                @keydown.esc="keyword = ''"
            />
            <kbd v-if="!keyword" class="layout-nav__search-key" aria-hidden="true">/</kbd>
            <AppIconButton
                v-else
                class="layout-nav__search-clear"
                :aria-label="$t('ui.nav.clearSearch')"
                size="xs"
                :icon-size="14"
                @click="clearKeyword"
            >
                <IconClose />
            </AppIconButton>
        </div>

        <div ref="navBody" class="layout-nav__body">
            <div class="layout-nav__list-wrap">
                <p class="sr-only" aria-live="polite">{{ keyword ? $t('ui.nav.resultCount', { n: resultCount }) : '' }}</p>
                <ul v-if="visibleTree.length" class="layout-nav__list" :aria-label="t('nav.home')">
                    <LayoutNavItem v-for="menu in visibleTree" :key="menu.id" :item="menu" :keyword="normalizedKeyword" />
                </ul>
                <p v-else class="layout-nav__empty">{{ $t('ui.nav.noResult', { keyword }) }}</p>
            </div>
        </div>

        <div class="layout-nav__footer">
            <AppIconButton class="nav-action" :aria-label="t('settings.title')" :size="32" icon-size="lg" to="/settings"><IconCog /></AppIconButton>
        </div>
    </nav>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useI18nText } from '@/composables/useI18nText';
import { useNavigationStore } from '@/store/navigation';
import { NAVIGATION_HEADER_ACTIONS } from '@/constants/navigation';
import { IconApp, IconClose, IconCog, IconSearch } from '@/components/icons';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';
import LayoutNavItem from '@/components/Layout/LayoutNavItem.vue';

const emit = defineEmits(['close']);

const { t } = useI18nText();
const navigationStore = useNavigationStore();
const { menuTree } = storeToRefs(navigationStore);
const headerActions = NAVIGATION_HEADER_ACTIONS;

function handleClose() {
    emit('close');
}

/* ----------------------------------------
   메뉴 검색 - 메뉴명 또는 주소(button, tabs ...)로 찾습니다.
---------------------------------------- */
const keyword = ref('');
const searchInput = ref(null);
const navBody = ref(null);
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());

function isMatched(menu) {
    const query = normalizedKeyword.value;
    return menu.label.toLowerCase().includes(query) || menu.to.toLowerCase().includes(query);
}

const visibleTree = computed(() => {
    if (!normalizedKeyword.value) return menuTree.value;

    return menuTree.value.flatMap((menu) => {
        if (isMatched(menu)) return [menu];
        const children = menu.children?.filter(isMatched) ?? [];
        return children.length ? [{ ...menu, children }] : [];
    });
});

const resultCount = computed(() => visibleTree.value.reduce((count, menu) => count + (menu.children?.length || 1), 0));

function clearKeyword() {
    keyword.value = '';
    searchInput.value?.focus();
}

// '/' 키로 메뉴 검색으로 이동 (입력 중일 때는 제외)
function handleShortcut(event) {
    const target = event.target;
    const isTyping = target?.closest('input, textarea, select, [contenteditable="true"]');
    if (event.key !== '/' || isTyping) return;
    event.preventDefault();
    searchInput.value?.focus();
}

/* ----------------------------------------
   현재 페이지 메뉴가 보이도록 스크롤
---------------------------------------- */
const route = useRoute();

function scrollToActive() {
    nextTick(() => {
        const body = navBody.value;
        const active = body?.querySelector('.router-link-exact-active');
        if (!body || !active) return;

        // scrollIntoView 는 브라우저의 Tab 시작 위치까지 옮겨 '본문 바로가기'를 건너뛰게 하므로 LNB 영역만 직접 스크롤합니다.
        const bodyRect = body.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        if (activeRect.top < bodyRect.top) body.scrollTop -= bodyRect.top - activeRect.top;
        else if (activeRect.bottom > bodyRect.bottom) body.scrollTop += activeRect.bottom - bodyRect.bottom;
    });
}

watch(() => route.path, scrollToActive);
onMounted(() => {
    window.addEventListener('keydown', handleShortcut);
    setTimeout(scrollToActive, 300);
});
onBeforeUnmount(() => window.removeEventListener('keydown', handleShortcut));

navigationStore.fetchMenus();
</script>
