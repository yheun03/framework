/**
 * 토스트 팝업 목록을 관리하는 Pinia store 파일입니다.
 */
import { ref } from 'vue';
import { defineStore } from 'pinia';

const TOAST_DEFAULT_DURATION = 2500;
const TOAST_MAX_COUNT = 5;

export const useToastStore = defineStore('toast', () => {
    const toasts = ref([]);
    let seq = 0;
    const timers = new Map();

    function remove(id) {
        const timer = timers.get(id);
        if (timer) clearTimeout(timer);
        timers.delete(id);
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }

    function show(payload) {
        const options = typeof payload === 'string' ? { message: payload } : payload;
        const item = { duration: TOAST_DEFAULT_DURATION, closable: false, ...options, id: ++seq };

        toasts.value = [...toasts.value, item].slice(-TOAST_MAX_COUNT);

        if (item.duration && item.duration > 0) {
            timers.set(
                item.id,
                setTimeout(() => remove(item.id), item.duration),
            );
        }

        return item.id;
    }

    function clear() {
        [...timers.keys()].forEach(remove);
        toasts.value = [];
    }

    return { toasts, show, remove, clear };
});
