/**
 * LNB 메뉴 (Pinia) - src/constants/menus.js 의 행을 트리로 만들어 줍니다.
 * - menuTree       : LNB 가 그리는 트리 (children · depth 포함)
 * - localizedMenus : 평평한 목록 (문서 제목 · 탭 이름 찾기용, App.vue)
 * - 서버 메뉴를 쓰는 프로젝트는 MENU_ROWS 대신 API 응답을 rows 에 넣으면 됩니다. (행 모양 같음)
 */
import { computed } from 'vue';
import { defineStore } from 'pinia';
import { MENU_ROWS } from '@/constants/menus';
import { useI18nText } from '@/composables/useI18nText';

/** 평평한 행 → 트리. 상위가 없는 행은 1단계로 두고, depth 는 트리 위치로 정합니다. */
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
    const rows = MENU_ROWS.filter((row) => row.isActive !== false);

    // labelKey 가 있으면 현재 언어로 번역, 없으면 label 그대로 (언어를 바꾸면 다시 계산)
    const localizedMenus = computed(() =>
        rows.map((row) => ({ ...row, to: row.to ?? '', label: row.labelKey ? t(row.labelKey, row.label) : row.label })),
    );
    const menuTree = computed(() => buildMenuTree(localizedMenus.value));

    return { localizedMenus, menuTree };
});
