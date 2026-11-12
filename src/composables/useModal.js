/**
 * 모달을 띄우는 composable 입니다. (화면 렌더링은 App.vue 의 AppModalHost)
 *
 * 1) 결과를 기다리는 방식 (권장)
 *    const modal = useModal();
 *    if (await modal.confirm('삭제할까요?')) remove();
 *    await modal.alert({ title: '완료', message: '저장했습니다.' });
 *
 * 2) 콜백 방식 (id 를 돌려받아 직접 닫을 때)
 *    const id = modal.openConfirm({ message: '진행할까요?', onConfirm, onCancel, onClose });
 *    modal.close(id);
 *
 * 3) 직접 만든 컴포넌트를 모달 본문으로
 *    modal.openCustom(MyForm, { title: '등록', size: 'lg', componentProps: { id: 1 }, footer: true, onConfirm });
 *
 * 4) 선택 팝업 (품목 · 거래처 찾기 등) - 본문 컴포넌트가 emit('select', 값) 하면 닫히고 값을 돌려줍니다. 그냥 닫으면 null
 *    const item = await modal.pick(ItemPicker, { title: '품목 찾기', size: 'lg', componentProps: { keyword } });
 *    if (item) form.itemCode = item.code;
 *
 * 옵션: title · message · size(sm 420 · md 640 · lg 900) · width(직접 지정 시) · height · closable · closeOnEsc · closeOnBackdrop · overlay
 *       confirmText · cancelText · keepOnConfirm(확인 후 닫지 않음)
 *       onConfirm · onCancel · onClose(reason: 'confirm' | 'cancel' | 'close')
 *       custom 전용: componentProps · footer · footerComponent · footerProps
 */
import { useModalStore } from '@/store/modal';
import { storeToRefs } from 'pinia';

const toOptions = (payload) => (typeof payload === 'string' ? { message: payload } : { ...payload });

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

    /** 확인 → true, 취소 · 닫기 → false */
    function confirm(payload) {
        const options = toOptions(payload);
        return new Promise((resolve) => {
            modalStore.confirm({
                ...options,
                onClose: (reason) => {
                    options.onClose?.(reason);
                    resolve(reason === 'confirm');
                },
            });
        });
    }

    /** 닫히면 끝나는 Promise */
    function alert(payload) {
        const options = toOptions(payload);
        return new Promise((resolve) => {
            modalStore.alert({
                ...options,
                onClose: (reason) => {
                    options.onClose?.(reason);
                    resolve();
                },
            });
        });
    }

    /** 선택 팝업: 본문의 emit('select', 값) → 값, 닫기 · 취소 → null */
    function pick(component, options = {}) {
        return new Promise((resolve) => {
            const id = modalStore.custom(component, {
                ...options,
                componentProps: {
                    ...options.componentProps,
                    onSelect: (value) => {
                        resolve(value);
                        modalStore.modalClose(id, 'confirm');
                    },
                },
                onClose: (reason) => {
                    options.onClose?.(reason);
                    resolve(null);
                },
            });
        });
    }

    return {
        modals,
        topModalId,
        confirm,
        alert,
        openAlert,
        openConfirm,
        openCustom,
        pick,
        close,
        closeTop: modalStore.modalCloseTop,
        clearAll: modalStore.clearAllModals,
    };
}
