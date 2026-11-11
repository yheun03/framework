/**
 * 모달 표시 상태와 모달 옵션을 관리하는 Pinia store 파일입니다.
 */
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

const MODAL_DEFAULTS = {
    common: {
        overlay: true,
        closable: true,
        closeOnBackdrop: true,
        closeOnEsc: true,
        keepOnConfirm: false,
        width: undefined,
        height: undefined,
        variant: undefined,
    },
    alert: {
        title: '안내',
        message: '',
        confirmText: '확인',
        size: 'sm',
    },
    confirm: {
        title: '확인',
        message: '',
        confirmText: '확인',
        cancelText: '취소',
        size: 'sm',
    },
    custom: {
        title: '',
        size: 'md',
        height: undefined,
        componentProps: {},
        footer: false,
        confirmText: '확인',
        cancelText: '취소',
        footerComponent: undefined,
        footerProps: {},
    },
};

// 모달 너비 (Figma 12. Popup Guide): size 이름으로 고르고, 특별한 경우만 width 로 직접 지정합니다.
export const MODAL_SIZES = { sm: '420px', md: '640px', lg: '900px' };

const MODAL_TYPE_DEFAULTS = {
    alert: MODAL_DEFAULTS.alert,
    confirm: MODAL_DEFAULTS.confirm,
    custom: MODAL_DEFAULTS.custom,
};

export const useModalStore = defineStore('modal', () => {
    const modals = ref([]);
    const sequence = ref(0);

    const topModalId = computed(() => {
        return modals.value.length ? modals.value[modals.value.length - 1].id : null;
    });

    function createId() {
        sequence.value += 1;
        return sequence.value;
    }

    function normalizePayload(payload) {
        const base = {
            id: createId(),
            ...MODAL_DEFAULTS.common,
            ...MODAL_TYPE_DEFAULTS[payload.type],
            ...payload,
        };
        base.width = payload.width ?? MODAL_SIZES[base.size] ?? MODAL_SIZES.md;

        if (payload.type === 'alert') {
            return base;
        }

        if (payload.type === 'confirm') {
            return base;
        }

        return {
            ...base,
            componentProps: payload.componentProps ?? {},
            footerProps: payload.footerProps ?? {},
        };
    }

    function findModal(id) {
        return modals.value.find((modal) => modal.id === id);
    }

    function removeModal(id) {
        const index = modals.value.findIndex((modal) => modal.id === id);
        if (index < 0) return null;
        return modals.value.splice(index, 1)[0] ?? null;
    }

    function modalOpen(payload) {
        const modal = normalizePayload(payload);
        modals.value.push(modal);
        return modal.id;
    }

    function alert(payload) {
        const options = typeof payload === 'string' ? { message: payload } : payload;
        return modalOpen({
            type: 'alert',
            ...options,
        });
    }

    function confirm(payload) {
        const options = typeof payload === 'string' ? { message: payload } : payload;
        return modalOpen({
            type: 'confirm',
            ...options,
        });
    }

    function custom(component, options = {}) {
        return modalOpen({
            type: 'custom',
            component,
            ...options,
        });
    }

    function modalClose(id, reason = 'close') {
        const target = removeModal(id);
        target?.onClose?.(reason);
    }

    function modalConfirm(id) {
        const modal = findModal(id);
        if (!modal) return;
        const shouldKeep = modal.keepOnConfirm === true;

        if (!shouldKeep) {
            modalClose(id, 'confirm');
        }

        modal.onConfirm?.();
    }

    function modalCancel(id) {
        const modal = findModal(id);
        if (!modal || (modal.type !== 'confirm' && modal.type !== 'custom')) return;
        modal.onCancel?.();
        modalClose(id, 'cancel');
    }

    function modalCloseTop(reason = 'close') {
        const id = topModalId.value;
        if (id == null) return;
        modalClose(id, reason);
    }

    function clearAllModals() {
        const ids = modals.value.map((modal) => modal.id).reverse();
        ids.forEach((id) => modalClose(id, 'close'));
    }

    return {
        modals,
        topModalId,
        modalOpen,
        alert,
        confirm,
        custom,
        modalClose,
        modalConfirm,
        modalCancel,
        modalCloseTop,
        clearAllModals,
    };
});
