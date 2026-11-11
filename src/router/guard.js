/**
 * 로그인 확인 (project.config.js 의 auth.enabled 가 true 일 때만 동작)
 * - ROUTE_META 에 public: true 가 없는 화면은 로그인해야 볼 수 있습니다.
 * - 로그인 화면으로 보낼 때 돌아올 주소를 ?redirect= 로 넘깁니다.
 */
import { projectConfig } from '@/project.config';
import { useAuthStore } from '@/store/auth';

export function installAuthGuard(router) {
    router.beforeEach((to) => {
        if (!projectConfig.auth?.enabled) return true;
        if (to.meta?.public) return true;

        const auth = useAuthStore();
        if (auth.isLoggedIn) return true;
        return { path: projectConfig.auth.loginPath, query: { redirect: to.fullPath } };
    });
}
