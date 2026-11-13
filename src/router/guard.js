/**
 * 화면 이동 전 확인
 * 1. 로그인 (project.config.js 의 auth.enabled 가 true 일 때만)
 *    - ROUTE_META 에 public: true 가 없는 화면은 로그인해야 볼 수 있습니다. 돌아올 주소는 ?redirect=
 * 2. 서버 메뉴 받기 (project.config.js 의 menuUrl 이 있을 때, 로그인 후 1회)
 * 3. 권한 - 메뉴(constants/menus.js 또는 서버 메뉴)의 permission, 또는 ROUTE_META 의 permission(상세 화면 등)
 *    - 없으면 /forbidden (auth.enabled 가 false 면 모두 통과)
 */
import { projectConfig } from '@/project.config';
import { useAuthStore } from '@/store/auth';
import { useNavigationStore } from '@/store/navigation';

export function installAuthGuard(router) {
    router.beforeEach(async (to) => {
        if (!projectConfig.auth?.enabled || to.meta?.public) return true;

        const auth = useAuthStore();
        if (!auth.isLoggedIn) return { path: projectConfig.auth.loginPath, query: { redirect: to.fullPath } };

        const navigation = useNavigationStore();
        await navigation.ensureLoaded();

        const permission = to.meta?.permission ?? navigation.permissionOf(to.path);
        if (!auth.can(permission)) return { path: '/forbidden', query: { from: to.fullPath } };
        return true;
    });
}
