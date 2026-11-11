<template>
    <DefaultLayout v-if="useLayout">
        <!--
            탭 화면 유지 (KeepAlive)
            - 열린 탭(store/routeTabs)의 화면은 입력값 · 스크롤 · 조회 결과를 그대로 유지합니다.
            - 탭을 닫으면 캐시도 지웁니다. 다시 보일 때 새로 조회하려면 화면에서 onActivated 를 씁니다.
            - 주소(fullPath)마다 별도 화면입니다. (예: /work-order-detail?id=1 과 ?id=2 는 서로 다른 탭)
        -->
        <RouterView v-slot="{ Component, route: viewRoute }">
            <KeepAlive :include="cachedViewNames" :max="TAB_CACHE_MAX">
                <component :is="toTabView(Component, viewRoute.fullPath)" v-if="Component" :key="viewRoute.fullPath" />
            </KeepAlive>
        </RouterView>
    </DefaultLayout>
    <RouterView v-else :key="route.fullPath" />

    <AppModalHost />
    <AppToastHost />
</template>

<script setup>
import { computed, defineComponent, markRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppModalHost from '@/components/Modal/AppModalHost.vue';
import AppToastHost from '@/components/AppToastHost.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useProjectConfig } from '@/composables/useProjectConfig';
import { getRouteTitle, isVisibleRoute } from '@/router/routeTabs';
import { useNavigationStore } from '@/store/navigation';
import { useRouteTabsStore } from '@/store/routeTabs';

const TAB_CACHE_MAX = 20;

const route = useRoute();
const project = useProjectConfig();
const navigationStore = useNavigationStore();
const routeTabsStore = useRouteTabsStore();

navigationStore.fetchMenus();

// meta.layout === false 인 화면(로그인 등)은 LNB · 탭 없이 단독으로 보여줍니다.
const useLayout = computed(() => route.meta?.layout !== false);

// KeepAlive 는 컴포넌트 name 으로 캐시를 고르므로, 탭 주소(fullPath)를 name 으로 갖는 감싸기 컴포넌트를 만듭니다.
const tabViews = new Map();

function toTabView(component, key) {
    let view = tabViews.get(key);
    if (!view) {
        view = { vnode: null };
        view.component = markRaw(
            defineComponent({
                name: key,
                setup: () => () => view.vnode,
            }),
        );
        tabViews.set(key, view);
    }
    view.vnode = component;
    return view.component;
}

const cachedViewNames = computed(() => routeTabsStore.tabs.map((tab) => tab.key));

// 닫힌 탭의 감싸기 컴포넌트 정리
watch(cachedViewNames, (keys) => {
    for (const key of tabViews.keys()) {
        if (!keys.includes(key) && key !== route.fullPath) tabViews.delete(key);
    }
});

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
        if (!isVisibleRoute(route)) return;
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
