import type {AlertModalInput, ConfirmModalInput, CustomModalInput, ModalCloseReason} from '~/types/appModal';
import {useModalStore} from '~/stores/modal';
import {storeToRefs} from 'pinia';

type AlertOptions = Omit<AlertModalInput, 'type'>;
type ConfirmOptions = Omit<ConfirmModalInput, 'type'>;
type CustomOptions = Omit<CustomModalInput, 'type' | 'component'>;

export function useModal() {
    const modalStore = useModalStore();
    const {modals, topModalId} = storeToRefs(modalStore);

    function openAlert(payload: string | AlertOptions) {
        return modalStore.alert(payload);
    }

    function openConfirm(payload: string | ConfirmOptions) {
        return modalStore.confirm(payload);
    }

    function openCustom(component: CustomModalInput['component'], options?: CustomOptions) {
        return modalStore.custom(component, options);
    }

    function close(id: number, reason: ModalCloseReason = 'close') {
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
