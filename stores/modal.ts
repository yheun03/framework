/**
 * 모달 표시 상태와 모달 옵션을 관리하는 Pinia store 파일입니다.
 */
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type {
    AlertModalInput,
    AlertModalItem,
    ConfirmModalInput,
    ConfirmModalItem,
    CustomModalInput,
    CustomModalItem,
    ModalCloseReason,
    ModalItem,
    ModalOpenPayload,
} from '~/types/appModal';

const MODAL_DEFAULTS = {
    common: {
        overlay: true,
        closable: true,
        closeOnBackdrop: true,
        closeOnEsc: true,
        keepOnConfirm: false,
        width: '560px',
        height: undefined,
        variant: undefined,
    },
    alert: {
        title: '안내',
        message: '',
        confirmText: '확인',
        width: '420px',
    },
    confirm: {
        title: '확인',
        message: '',
        confirmText: '확인',
        cancelText: '취소',
        width: '460px',
    },
    custom: {
        title: '',
        width: '560px',
        height: undefined,
        componentProps: {},
        footer: false,
        confirmText: '확인',
        cancelText: '취소',
        footerComponent: undefined,
        footerProps: {},
    },
} as const;

const MODAL_TYPE_DEFAULTS = {
    alert: MODAL_DEFAULTS.alert,
    confirm: MODAL_DEFAULTS.confirm,
    custom: MODAL_DEFAULTS.custom,
} as const;

export const useModalStore = defineStore('modal', () => {
    const modals = ref<ModalItem[]>([]);
    const sequence = ref(0);

    const topModalId = computed(() => {
        return modals.value.length ? modals.value[modals.value.length - 1].id : null;
    });

    function createId() {
        sequence.value += 1;
        return sequence.value;
    }

    function normalizePayload(payload: ModalOpenPayload): ModalItem {
        const base = {
            id: createId(),
            ...MODAL_DEFAULTS.common,
            ...MODAL_TYPE_DEFAULTS[payload.type],
            ...payload,
        };

        if (payload.type === 'alert') {
            return base as AlertModalItem;
        }

        if (payload.type === 'confirm') {
            return base as ConfirmModalItem;
        }

        return {
            ...base,
            componentProps: payload.componentProps ?? {},
            footerProps: payload.footerProps ?? {},
        } as CustomModalItem;
    }

    function findModal(id: number) {
        return modals.value.find((modal) => modal.id === id);
    }

    function removeModal(id: number) {
        const index = modals.value.findIndex((modal) => modal.id === id);
        if (index < 0) return null;
        return modals.value.splice(index, 1)[0] ?? null;
    }

    function modalOpen(payload: ModalOpenPayload) {
        const modal = normalizePayload(payload);
        modals.value.push(modal);
        return modal.id;
    }

    function alert(payload: string | Omit<AlertModalInput, 'type'>) {
        const options = typeof payload === 'string' ? { message: payload } : payload;
        return modalOpen({
            type: 'alert',
            ...options,
        });
    }

    function confirm(payload: string | Omit<ConfirmModalInput, 'type'>) {
        const options = typeof payload === 'string' ? { message: payload } : payload;
        return modalOpen({
            type: 'confirm',
            ...options,
        });
    }

    function custom(component: CustomModalInput['component'], options: Omit<CustomModalInput, 'type' | 'component'> = {}) {
        return modalOpen({
            type: 'custom',
            component,
            ...options,
        });
    }

    function modalClose(id: number, reason: ModalCloseReason = 'close') {
        const target = removeModal(id);
        target?.onClose?.(reason);
    }

    function modalConfirm(id: number) {
        const modal = findModal(id);
        if (!modal) return;
        const shouldKeep = modal.keepOnConfirm === true;

        if (!shouldKeep) {
            modalClose(id, 'confirm');
        }

        modal.onConfirm?.();
    }

    function modalCancel(id: number) {
        const modal = findModal(id);
        if (!modal || (modal.type !== 'confirm' && modal.type !== 'custom')) return;
        modal.onCancel?.();
        modalClose(id, 'cancel');
    }

    function modalCloseTop(reason: ModalCloseReason = 'close') {
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
