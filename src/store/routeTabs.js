/**
 * 상단 탭(최근 방문 화면) 목록과 현재 탭 (Pinia)
 * - 기록 규칙(어떤 화면을 탭으로 남기나)은 router/routeTabs.js, 화면 유지(KeepAlive)는 App.vue
 */
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useRouteTabsStore = defineStore('route-tabs', () => {
    const tabs = ref([]);
    const activeKey = ref(null);

    const activeTab = computed(() => (activeKey.value ? tabs.value.find((t) => t.key === activeKey.value) : null) ?? null);

    function visit(tab, opts) {
        const existing = tabs.value.find((t) => t.key === tab.key);
        if (existing) {
            existing.path = tab.path;
            existing.title = tab.title;
            existing.labelKey = tab.labelKey;
        } else {
            tabs.value.push({ ...tab });
        }

        if (opts?.activate ?? true) activeKey.value = tab.key;
    }

    function activate(key) {
        if (!tabs.value.some((t) => t.key === key)) return;
        activeKey.value = key;
    }

    function close(key) {
        const idx = tabs.value.findIndex((t) => t.key === key);
        if (idx < 0) return;
        tabs.value.splice(idx, 1);

        if (activeKey.value !== key) return;
        // 닫은 탭이 현재 탭이면 바로 왼쪽 탭(없으면 첫 탭)으로
        activeKey.value = tabs.value[Math.max(0, idx - 1)]?.key ?? null;
    }

    function reset() {
        tabs.value.splice(0, tabs.value.length);
        activeKey.value = null;
    }

    return {
        tabs,
        activeKey,
        activeTab,
        visit,
        activate,
        close,
        reset,
    };
});
