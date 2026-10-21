/**
 * 토스트 팝업 목록을 관리하는 Pinia store 파일입니다.
 */
import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ToastItem, ToastOptions } from '~/types/appToast';

const TOAST_DEFAULT_DURATION = 2500;
const TOAST_MAX_COUNT = 5;

export const useToastStore = defineStore('toast', () => {
    const toasts = ref<ToastItem[]>([]);
    let seq = 0;
    const timers = new Map<number, ReturnType<typeof setTimeout>>();

    function remove(id: number) {
        const timer = timers.get(id);
        if (timer) clearTimeout(timer);
        timers.delete(id);
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }

    function show(payload: string | ToastOptions) {
        const options = typeof payload === 'string' ? { message: payload } : payload;
        const item: ToastItem = { duration: TOAST_DEFAULT_DURATION, closable: false, ...options, id: ++seq };

        toasts.value = [...toasts.value, item].slice(-TOAST_MAX_COUNT);

        if (item.duration && item.duration > 0 && import.meta.client) {
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
