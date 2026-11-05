<template>
    <div>
        <NuxtLayout v-if="useLayout">
            <!-- 라우트 전환 시 전체 페이지를 안전하게 리마운트 -->
            <NuxtPage :key="route.fullPath" />
        </NuxtLayout>
        <NuxtPage v-else :key="route.fullPath" />
    </div>

    <AppModalHost />
    <AppToastHost />
</template>

<script setup lang="ts">
import AppModalHost from '~/components/Modal/AppModalHost.vue';
import { useNavigationStore } from '~/stores/navigation';

const route = useRoute();
const project = useProjectConfig();
const navigationStore = useNavigationStore();
const { locale } = useI18nText();

// 페이지에서 title 을 지정하지 않으면 LNB 메뉴 이름을 문서 제목으로 사용합니다. (탭 · 검색 결과 · 북마크 구분)
const menuTitle = computed(() => {
    const path = route.path.replace(/\/$/, '') || '/';
    if (path === '/') return undefined;
    return navigationStore.localizedMenus.find((menu) => menu.to === path)?.label;
});

const canonicalUrl = computed(() => {
    const siteUrl = project.siteUrl.endsWith('/') ? project.siteUrl : `${project.siteUrl}/`;
    // 정적 배포(GitHub Pages)는 '/경로/' 로 서비스되므로 canonical 도 '/' 로 끝맺어 중복 URL 을 막습니다.
    const routePath = route.path.replace(/^\//, '').replace(/([^/])$/, '$1/');

    return new URL(routePath, siteUrl).toString();
});

useHead(() => ({
    title: menuTitle.value,
    // 언어 설정을 바꾸면 <html lang> 도 함께 바뀌어 스크린리더 발음이 맞춰집니다.
    htmlAttrs: { lang: locale.value },
    titleTemplate: (title) => {
        if (!title || title === project.seo.title) return project.seo.title;

        return project.seo.titleTemplate.replace('%s', title);
    },
    link: [{ rel: 'canonical', href: canonicalUrl.value }],
    meta: [{ property: 'og:url', content: canonicalUrl.value }],
}));

useSeoMeta({
    ogTitle: () => (menuTitle.value ? project.seo.titleTemplate.replace('%s', menuTitle.value) : project.seo.title),
    twitterTitle: () => (menuTitle.value ? project.seo.titleTemplate.replace('%s', menuTitle.value) : project.seo.title),
    ogLocale: () => (locale.value === 'en' ? 'en_US' : 'ko_KR'),
});

const useLayout = computed(() => {
    // page에서 definePageMeta({ layout: false })를 설정한 경우 레이아웃 제외
    if (route.meta?.layout === false) return false;
    // 명시적으로 독립 노출되는 페이지들
    if (route.path === '/login') return false;
    return true;
});
</script>
