/**
 * 로그인 상태 (토큰 · 사용자) 를 관리하는 Pinia store 파일입니다.
 *
 * - project.config.js 의 auth.enabled 가 false(데모 기본값)면 로그인 없이 모든 화면을 볼 수 있고,
 *   로그인 화면은 API 호출 없이 메인으로 이동합니다.
 * - auth.enabled 가 true 면
 *   1) 로그인: POST auth.loginUrl → 응답의 accessToken(또는 token)을 저장
 *   2) API 요청마다 Authorization: Bearer {토큰} 자동 첨부 (services/api/apiClient.js)
 *   3) 401 응답 → 로그아웃 후 로그인 화면으로 이동 (돌아올 주소는 ?redirect=)
 *   4) ROUTE_META 에 public: true 가 없는 화면은 로그인해야 볼 수 있음 (router/guard.js)
 *   5) 권한: 로그인 응답 user.permissions (예: ['WO.READ', 'WO.WRITE'], 전체 '*') → can('WO.WRITE')
 *      - 메뉴: constants/menus.js 의 permission 이 없으면 LNB 에서 숨기고 주소로 들어오면 /forbidden
 *      - 버튼: <AppButton v-if="auth.can('WO.WRITE')">작업지시 발행</AppButton>
 *   6) 토큰 갱신(auth.refreshUrl 이 있을 때): 401 → refresh() 한 번 → 원래 요청 다시 보냄 (apiClient)
 * - 세션(쿠키) 방식 백엔드는 토큰 없이도 동작합니다. (axios withCredentials: true)
 * - auth.enabled: false 면 can() 은 항상 true 입니다. (퍼블리싱 · 데모)
 */
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { projectConfig } from '@/project.config';
import { clearCodes } from '@/composables/useCodes';
import apiClient from '@/services/api/apiClient';

const TOKEN_KEY = `${projectConfig.key}:access-token`;
const REFRESH_KEY = `${projectConfig.key}:refresh-token`;
const USER_KEY = `${projectConfig.key}:user`;

function readStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStorage(key, value) {
    try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
    } catch {
        // 저장 불가(사생활 보호 모드 등) - 새로고침 전까지만 유지
    }
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref(readStorage(TOKEN_KEY));
    const refreshToken = ref(readStorage(REFRESH_KEY));
    const user = ref(JSON.parse(readStorage(USER_KEY) || 'null'));

    const isEnabled = computed(() => Boolean(projectConfig.auth?.enabled));
    const isLoggedIn = computed(() => !isEnabled.value || Boolean(token.value || user.value));
    const permissions = computed(() => new Set(user.value?.permissions ?? []));

    /** 권한 확인 - 로그인 응답 user.permissions 에 있으면 true ('*' = 전체). 로그인 미사용이면 항상 true */
    function can(permission) {
        if (!isEnabled.value || !permission) return true;
        return permissions.value.has('*') || permissions.value.has(permission);
    }

    function setSession(nextToken, nextUser, nextRefreshToken = refreshToken.value) {
        token.value = nextToken ?? null;
        user.value = nextUser ?? null;
        refreshToken.value = nextToken ? (nextRefreshToken ?? null) : null;
        writeStorage(TOKEN_KEY, token.value);
        writeStorage(REFRESH_KEY, refreshToken.value);
        writeStorage(USER_KEY, user.value ? JSON.stringify(user.value) : null);
    }

    async function login(credentials) {
        if (!isEnabled.value) {
            setSession(null, { name: credentials?.email ?? 'demo' });
            return user.value;
        }
        const result = await apiClient.post(projectConfig.auth.loginUrl, credentials, { toast: false, skipAuthRefresh: true });
        setSession(result?.accessToken ?? result?.token ?? null, result?.user ?? { name: credentials?.email }, result?.refreshToken);
        return user.value;
    }

    /** 토큰 갱신 (auth.refreshUrl) - 실패하면 reject → apiClient 가 로그인 화면으로 보냄 */
    async function refresh() {
        if (!refreshToken.value) throw new Error('no refresh token');
        const result = await apiClient.post(
            projectConfig.auth.refreshUrl,
            { refreshToken: refreshToken.value },
            { toast: false, skipAuthRefresh: true },
        );
        setSession(result?.accessToken ?? result?.token, user.value, result?.refreshToken ?? refreshToken.value);
        return token.value;
    }

    async function logout({ callApi = true } = {}) {
        if (callApi && isEnabled.value && projectConfig.auth.logoutUrl) {
            await apiClient.post(projectConfig.auth.logoutUrl, null, { toast: false, skipAuthRefresh: true }).catch(() => {});
        }
        setSession(null, null);
        clearCodes(); // 사용자 · 권한에 따라 코드 목록이 다를 수 있으므로 다음 사용자는 새로 받음
    }

    return { token, user, isEnabled, isLoggedIn, can, login, refresh, logout, setSession };
});
