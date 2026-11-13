/**
 * apiClient 에 로그인 토큰 · 401 처리 · 오류 토스트를 연결합니다. (main.js 에서 Pinia · router 준비 후 1회 호출)
 */
import { projectConfig } from '@/project.config';
import { setApiHandlers } from '@/services/api/apiClient';
import { useAuthStore } from '@/store/auth';
import { useToastStore } from '@/store/toast';

export function setupApi(router) {
    const auth = useAuthStore();
    const toast = useToastStore();

    setApiHandlers({
        getToken: () => auth.token,
        // 토큰 갱신 주소가 있을 때만 (없으면 401 → 바로 로그인 화면)
        refresh: projectConfig.auth.refreshUrl ? () => auth.refresh() : null,
        // 401: 로그아웃 후 로그인 화면으로 (돌아올 주소는 ?redirect=)
        onUnauthorized: async () => {
            await auth.logout({ callApi: false });
            const current = router.currentRoute.value;
            if (!current.meta?.public) router.replace({ path: projectConfig.auth.loginPath, query: { redirect: current.fullPath } });
        },
        onError: (error) => toast.show({ message: error.message, tone: 'danger' }),
    });
}
