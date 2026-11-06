<template>
    <DefaultLayout v-if="useLayout">
        <!-- 라우트 전환 시 전체 페이지를 안전하게 리마운트 -->
        <RouterView :key="route.fullPath" />
    </DefaultLayout>
    <RouterView v-else :key="route.fullPath" />

    <AppModalHost />
    <AppToastHost />
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppModalHost from '@/components/Modal/AppModalHost.vue';
import AppToastHost from '@/components/AppToastHost.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useProjectConfig } from '@/composables/useProjectConfig';
import { getRouteTitle, isVisibleRoute } from '@/router/routeTabs';
import { useNavigationStore } from '@/store/navigation';
import { useRouteTabsStore } from '@/store/routeTabs';

const route = useRoute();
const project = useProjectConfig();
const navigationStore = useNavigationStore();
const routeTabsStore = useRouteTabsStore();

navigationStore.fetchMenus();

// meta.layout === false 인 화면(로그인 등)은 LNB · 탭 없이 단독으로 보여줍니다.
const useLayout = computed(() => route.meta?.layout !== false);

const currentMenu = computed(() => {
    const path = route.path.replace(/\/$/, '') || '/';
    return navigationStore.localizedMenus.find((menu) => menu.to === path);
});

// 문서 제목: 화면 meta.title → LNB 메뉴명 → 기본(VITE_TITLE)
const defaultTitle = document.title;
watch(
    () => [route.fullPath, currentMenu.value?.label],
    () => {
        const title = route.meta?.title || (route.path !== '/' && currentMenu.value?.label);
        document.title = title ? project.titleTemplate.replace('%s', title) : defaultTitle;

        // 최근 방문 탭 기록
        if (!isVisibleRoute(route.path)) return;
        routeTabsStore.visit({
            key: route.fullPath,
            path: route.fullPath,
            title: currentMenu.value?.label ?? getRouteTitle({ path: route.path, name: route.name, meta: route.meta }),
            labelKey: currentMenu.value?.labelKey,
        });
    },
    { immediate: true },
);
</script>
