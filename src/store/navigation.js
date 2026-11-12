/**
 * LNB 메뉴 상태 (Pinia)
 *
 * 메뉴를 어디서 가져오나
 * - project.config.js 의 menuUrl 이 비어 있으면 → src/constants/menus.js (퍼블리싱 · 데모)
 * - menuUrl 이 있으면 → 로그인 후 서버에서 받습니다. 응답 행 모양은 menus.js 와 같습니다. (API_GUIDE.md 4장)
 *
 * 화면에서 쓰는 값
 * - menuTree       : LNB 가 그리는 트리 (children · depth 포함)
 * - localizedMenus : 평평한 목록 (문서 제목 · 탭 이름 찾기용, App.vue)
 */
import { computed, ref, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { MENU_ROWS } from '@/constants/menus';
import { projectConfig } from '@/project.config';
import { useI18nText } from '@/composables/useI18nText';
import apiClient from '@/services/api/apiClient';

/** 서버 · 파일 어느 쪽 행이든 같은 모양으로 맞춥니다. (빠진 값은 기본값) */
function normalizeMenuRow(row) {
    return {
        id: String(row.id),
        parentId: row.parentId ? String(row.parentId) : null,
        order: Number(row.order ?? 0),
        to: row.to || '',
        labelKey: row.labelKey || '',
        label: row.label || row.labelKey || '',
        icon: row.icon,
        newTab: Boolean(row.newTab),
    };
}

/** 평평한 행 → 트리. 상위가 없는 행은 1단계로 올리고, depth 는 트리 위치로 계산합니다. */
function buildMenuTree(rows) {
    const nodes = new Map(rows.map((row) => [row.id, { ...row, children: undefined }]));
    const roots = [];

    for (const node of nodes.values()) {
        const parent = node.parentId && nodes.get(node.parentId);
        if (parent) (parent.children ||= []).push(node);
        else roots.push(node);
    }

    const sortAndSetDepth = (list, depth) =>
        list
            .sort((a, b) => a.order - b.order)
            .map((node) => ({ ...node, depth, children: node.children && sortAndSetDepth(node.children, depth + 1) }));

    return sortAndSetDepth(roots, 1);
}

export const useNavigationStore = defineStore('navigation', () => {
    const { t } = useI18nText();
    const rows = shallowRef([]);
    const isLoading = ref(false);
    const isLoaded = ref(false);

    // labelKey 가 있으면 현재 언어로 번역, 없으면 label 그대로 (언어를 바꾸면 다시 계산)
    const localizedMenus = computed(() => rows.value.map((row) => ({ ...row, label: row.labelKey ? t(row.labelKey, row.label) : row.label })));
    const menuTree = computed(() => buildMenuTree(localizedMenus.value));

    /** 메뉴 불러오기 (App.vue 가 로그인 상태가 되면 호출). force: 이미 불러왔어도 다시 */
    async function fetchMenus(force = false) {
        if (isLoading.value || (isLoaded.value && !force)) return;

        isLoading.value = true;
        try {
            const source = projectConfig.menuUrl ? await apiClient.get(projectConfig.menuUrl) : MENU_ROWS;
            rows.value = source.filter((row) => row.isActive !== false).map(normalizeMenuRow);
            isLoaded.value = true;
        } catch {
            rows.value = []; // 오류 토스트는 apiClient 가 띄웁니다.
        } finally {
            isLoading.value = false;
        }
    }

    /** 로그아웃 시 메뉴 비우기 */
    function reset() {
        rows.value = [];
        isLoaded.value = false;
    }

    return { localizedMenus, menuTree, isLoading, isLoaded, fetchMenus, reset };
});
