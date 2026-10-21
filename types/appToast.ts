/**
 * AppToast(토스트 팝업) 공통 타입 정의 파일입니다.
 */
import type { AppTone } from '~/types/appCommon';

export type ToastPlacement = 'top' | 'top-right' | 'bottom' | 'bottom-right';

export type ToastOptions = {
    message: string;
    /** 좌측 아이콘/색상 의미 */
    tone?: AppTone;
    /** 우측 보조 텍스트 (예: 알림 수 '9,999') */
    meta?: string;
    /** 노출 시간(ms). 0 이면 자동으로 닫히지 않습니다. */
    duration?: number;
    closable?: boolean;
    actionText?: string;
    onAction?: () => void;
};

export type ToastItem = ToastOptions & {
    id: number;
};
