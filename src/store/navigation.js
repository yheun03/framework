/**
 * LNB 메뉴 (Pinia) - 메뉴 행(src/constants/menus.js 또는 서버 응답)을 트리로 만들어 줍니다.
 * - menuTree       : LNB 가 그리는 트리 (children · depth 포함) - 권한(permission) 없는 메뉴 · 빈 그룹은 뺌
 * - localizedMenus : 평평한 목록 (문서 제목 · 탭 이름 찾기용, App.vue)
 * - permissionOf(path) : 그 주소 메뉴의 permission (router/guard.js 가 확인)
 * - 서버 메뉴: project.config.js 의 menuUrl 을 적으면 로그인 후 GET {menuUrl} 의 행 배열을 씁니다. (menus.js 와 같은 모양)
 */
import { computed, shallowRef, watch } from 'vue';
import { defineStore } from 'pinia';
import { MENU_ROWS } from '@/constants/menus';
import { useI18nText } from '@/composables/useI18nText';
import { projectConfig } from '@/project.config';
import apiClient from '@/services/api/apiClient';
import { useAuthStore } from '@/store/auth';

/** 평평한 행 → 트리. 상위가 없는 행은 1단계로 두고, depth 는 트리 위치로 정합니다. 하위가 모두 빠진 그룹은 숨깁니다. */
function buildMenuTree(rows) {
    const nodes = new Map(rows.map((row) => [row.id, { ...row, children: undefined }]));
    const roots = [];

    for (const node of nodes.values()) {
        const parent = node.parentId && nodes.get(node.parentId);
        if (parent) (parent.children ||= []).push(node);
        else if (!node.parentId) roots.push(node);
    }

    const sortAndSetDepth = (list, depth) =>
        list
            .sort((a, b) => a.order - b.order)
            .map((node) => ({ ...node, depth, children: node.children && sortAndSetDepth(node.children, depth + 1) }))
            .filter((node) => node.to || node.children?.length);

    return sortAndSetDepth(roots, 1);
}

export const useNavigationStore = defineStore('navigation', () => {
    const { t } = useI18nText();
    const auth = useAuthStore();

    const rows = shallowRef(projectConfig.menuUrl ? [] : MENU_ROWS);
    let loading = null;

    /** 서버 메뉴를 한 번 받아 둡니다. (menuUrl 이 없으면 아무 일도 하지 않음) - router/guard.js 가 화면 이동 전에 부름 */
    function ensureLoaded() {
        if (!projectConfig.menuUrl || !auth.isLoggedIn) return Promise.resolve();
        loading ??= apiClient
            .get(projectConfig.menuUrl)
            .then((serverRows) => (rows.value = serverRows ?? []))
            .catch(() => (loading = null));
        return loading;
    }

    // 다른 사용자로 로그인하면 메뉴를 다시 받음
    watch(
        () => auth.user,
        () => {
            loading = null;
            if (projectConfig.menuUrl) rows.value = [];
        },
    );

    // 숨김(isActive: false) · 권한 없는 메뉴를 뺀 행. labelKey 가 있으면 현재 언어로 번역 (언어를 바꾸면 다시 계산)
    const localizedMenus = computed(() =>
        rows.value
            .filter((row) => row.isActive !== false && auth.can(row.permission))
            .map((row) => ({ ...row, to: row.to ?? '', label: row.labelKey ? t(row.labelKey, row.label) : row.label })),
    );
    const menuTree = computed(() => buildMenuTree(localizedMenus.value));

    /** 주소에 해당하는 메뉴의 permission (권한 확인용 - 숨긴 메뉴 포함 전체 행에서 찾음) */
    function permissionOf(path) {
        return rows.value.find((row) => row.to === path)?.permission;
    }

    return { localizedMenus, menuTree, ensureLoaded, permissionOf };
});
