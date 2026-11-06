/**
 * 토스트 팝업을 띄우는 composable 입니다.
 *
 * const toast = useToast();
 * toast.show('저장되었습니다.');
 * toast.success('등록 완료');
 * toast.error({ message: '실패했습니다.', actionText: '재시도', onAction: retry });
 */
import { useToastStore } from '@/store/toast';

export function useToast() {
    const store = useToastStore();

    function withTone(tone) {
        return (payload) => store.show(typeof payload === 'string' ? { message: payload, tone } : { ...payload, tone });
    }

    return {
        show: store.show,
        success: withTone('success'),
        error: withTone('danger'),
        warning: withTone('warning'),
        info: withTone('info'),
        remove: store.remove,
        clear: store.clear,
    };
}
