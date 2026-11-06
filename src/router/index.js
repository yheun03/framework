/**
 * 라우터
 * - src/views 의 .vue 파일 경로가 그대로 주소가 됩니다. (예: views/demos/demo-button.vue → /demos/demo-button, index.vue → /)
 * - 화면별 옵션(레이아웃 제외 · 문서 제목)은 아래 ROUTE_META 에 적습니다.
 */
import { createRouter, createWebHistory } from 'vue-router';
import NotFoundPage from '@/views/NotFoundPage.vue';

const viewModules = import.meta.glob(['@/views/**/*.vue', '!@/views/NotFoundPage.vue']);

// layout: false → DefaultLayout(LNB · 탭) 없이 단독 화면
const ROUTE_META = {
    '/auth/sign-in': { layout: false, title: '로그인' },
    '/auth/sign-up': { layout: false, title: '회원가입' },
    '/auth/find-pw': { layout: false, title: '비밀번호 찾기' },
};

function toRoutePath(file) {
    const path = file
        .replace(/^\/src\/views/, '')
        .replace(/\.vue$/, '')
        .replace(/\/index$/, '');
    return path || '/';
}

const routes = Object.entries(viewModules).map(([file, component]) => {
    const path = toRoutePath(file);
    return { path, component, meta: ROUTE_META[path] ?? {} };
});

routes.push({ path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { layout: false, title: '페이지를 찾을 수 없습니다' } });

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});

export default router;
