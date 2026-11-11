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
 * - 세션(쿠키) 방식 백엔드는 토큰 없이도 동작합니다. (axios withCredentials: true)
 */
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { projectConfig } from '@/project.config';
import apiClient from '@/services/api/apiClient';

const TOKEN_KEY = `${projectConfig.key}:access-token`;
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
    const user = ref(JSON.parse(readStorage(USER_KEY) || 'null'));

    const isEnabled = computed(() => Boolean(projectConfig.auth?.enabled));
    const isLoggedIn = computed(() => !isEnabled.value || Boolean(token.value || user.value));

    function setSession(nextToken, nextUser) {
        token.value = nextToken ?? null;
        user.value = nextUser ?? null;
        writeStorage(TOKEN_KEY, token.value);
        writeStorage(USER_KEY, user.value ? JSON.stringify(user.value) : null);
    }

    async function login(credentials) {
        if (!isEnabled.value) {
            setSession(null, { name: credentials?.email ?? 'demo' });
            return user.value;
        }
        const result = await apiClient.post(projectConfig.auth.loginUrl, credentials, { toast: false });
        setSession(result?.accessToken ?? result?.token ?? null, result?.user ?? { name: credentials?.email });
        return user.value;
    }

    async function logout({ callApi = true } = {}) {
        if (callApi && isEnabled.value && projectConfig.auth.logoutUrl) {
            await apiClient.post(projectConfig.auth.logoutUrl, null, { toast: false }).catch(() => {});
        }
        setSession(null, null);
    }

    return { token, user, isEnabled, isLoggedIn, login, logout, setSession };
});
