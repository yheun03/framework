/**
 * 작업 영역의 UI 상태와 공통 화면 상태를 관리하는 Pinia store 파일입니다.
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { resolveFallbackTabId } from '@/utils/tab';

export const useWorkspaceStore = defineStore('workspace', () => {
    const tabs = ref([
        {
            id: 'welcome',
            title: 'Welcome',
            content: '# Welcome\n\n옵시디언 스타일 워크스페이스 MVP입니다.\n',
        },
    ]);
    const activeTabId = ref('welcome');

    const split = ref(false);
    const activeTabIdByPane = ref({
        left: 'welcome',
        right: 'welcome',
    });

    const activeTab = computed(() => tabs.value.find((t) => t.id === activeTabId.value) ?? tabs.value[0]);

    const paneTab = (pane) => computed(() => tabs.value.find((t) => t.id === activeTabIdByPane.value[pane]) ?? tabs.value[0]);

    const leftTab = paneTab('left');
    const rightTab = paneTab('right');

    function ensureTab(id) {
        const existing = tabs.value.find((t) => t.id === id);
        if (existing) return existing;
        const t = { id, title: id, content: '' };
        tabs.value.push(t);
        return t;
    }

    function openTab(id, title) {
        const t = ensureTab(id);
        if (title) t.title = title;
        activeTabId.value = t.id;
        activeTabIdByPane.value.left = t.id;
        if (!split.value) activeTabIdByPane.value.right = t.id;
    }

    function closeTab(id) {
        if (tabs.value.length <= 1) return;
        const idx = tabs.value.findIndex((t) => t.id === id);
        if (idx < 0) return;
        tabs.value.splice(idx, 1);

        const fallback = resolveFallbackTabId(
            tabs.value.map((tab) => tab.id),
            idx,
        );
        if (!fallback) return;

        if (activeTabId.value === id) activeTabId.value = fallback;
        ['left', 'right'].forEach((pane) => {
            if (activeTabIdByPane.value[pane] === id) {
                activeTabIdByPane.value[pane] = fallback;
            }
        });
    }

    function setActiveTab(id) {
        if (!tabs.value.some((t) => t.id === id)) return;
        activeTabId.value = id;
        activeTabIdByPane.value.left = id;
        if (!split.value) activeTabIdByPane.value.right = id;
    }

    function setActiveTabForPane(pane, id) {
        if (!tabs.value.some((t) => t.id === id)) return;
        activeTabIdByPane.value[pane] = id;
        if (pane === 'left') activeTabId.value = id;
    }

    function updateTabContent(id, content) {
        const t = tabs.value.find((x) => x.id === id);
        if (!t) return;
        t.content = content;
    }

    function toggleSplit() {
        split.value = !split.value;
        if (!split.value) {
            activeTabIdByPane.value.right = activeTabIdByPane.value.left;
        }
    }

    return {
        tabs,
        activeTabId,
        activeTab,
        split,
        leftTab,
        rightTab,
        activeTabIdByPane,
        openTab,
        closeTab,
        setActiveTab,
        setActiveTabForPane,
        updateTabContent,
        toggleSplit,
    };
});
