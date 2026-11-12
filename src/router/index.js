/**
 * 라우터
 * - src/views 의 .vue 파일 경로가 그대로 주소가 됩니다. (예: views/demos/demo-button.vue → /demos/demo-button, index.vue → /)
 * - 대괄호 파일명은 동적 주소입니다: views/work-orders/[id].vue → /work-orders/:id (화면에서 useRoute().params.id)
 * - views 아래 .vue 는 모두 주소가 되므로, 화면 전용 하위 컴포넌트는 components/Page{이름}/ 에 둡니다.
 * - 화면별 옵션(레이아웃 제외 · 탭 제외 · 문서 제목)은 아래 ROUTE_META 에 적습니다.
 */
import { createRouter, createWebHistory } from 'vue-router';
import NotFoundPage from '@/views/NotFoundPage.vue';
import { installAuthGuard } from '@/router/guard';
import { toRoutePath } from '@/router/routePath';

const viewModules = import.meta.glob(['@/views/**/*.vue', '!@/views/NotFoundPage.vue']);

// layout: false → DefaultLayout(LNB · 탭) 없이 단독 화면
// tab: false    → 상단 탭(최근 방문)에 기록하지 않음
// title         → LNB 메뉴에 없는 화면의 문서 제목
// public: true  → 로그인 없이 볼 수 있는 화면 (project.config.js auth.enabled 일 때만 의미 있음)
const ROUTE_META = {
    '/login': { layout: false, public: true, title: '로그인' },
    '/auth/sign-up': { layout: false, public: true, title: '회원가입' },
    '/auth/find-pw': { layout: false, public: true, title: '비밀번호 찾기' },
    // 상세 화면은 LNB 메뉴가 없으므로 제목을 적습니다.
    '/work-orders/:id': { title: '작업지시 상세' },
    '/sales-orders/:id': { title: '수주 상세' },
};
const routes = Object.entries(viewModules).map(([file, component]) => {
    const path = toRoutePath(file);
    return { path, component, meta: ROUTE_META[path] ?? {} };
});

routes.push({
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { layout: false, public: true, title: '페이지를 찾을 수 없습니다' },
});

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});

installAuthGuard(router);

export default router;
