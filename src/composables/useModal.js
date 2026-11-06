import { useModalStore } from '@/store/modal';
import { storeToRefs } from 'pinia';

export function useModal() {
    const modalStore = useModalStore();
    const { modals, topModalId } = storeToRefs(modalStore);

    function openAlert(payload) {
        return modalStore.alert(payload);
    }

    function openConfirm(payload) {
        return modalStore.confirm(payload);
    }

    function openCustom(component, options) {
        return modalStore.custom(component, options);
    }

    function close(id, reason = 'close') {
        modalStore.modalClose(id, reason);
    }

    return {
        modals,
        topModalId,
        openAlert,
        openConfirm,
        openCustom,
        close,
        closeTop: modalStore.modalCloseTop,
        clearAll: modalStore.clearAllModals,
    };
}
