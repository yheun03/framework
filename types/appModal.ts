/**
 * AppModal 관련 모달 타입을 관리하는 공통 타입 정의 파일입니다.
 */

import type { Component } from 'vue';

export type ModalCloseReason = 'esc' | 'backdrop' | 'close' | 'cancel' | 'confirm';

export type ModalViewCloseReason = Extract<ModalCloseReason, 'esc' | 'backdrop' | 'close'>;

export type ModalCommonOptions = {
    title?: string;
    width?: string;
    height?: string;
    overlay?: boolean;
    closable?: boolean;
    closeOnDim?: boolean;
    closeOnEsc?: boolean;
    keepOnConfirm?: boolean;
    onClose?: (reason?: ModalCloseReason) => void;
};

export type AlertModalInput = ModalCommonOptions & {
    type: 'alert';
    message?: string;
    confirmText?: string;
    onConfirm?: () => void;
};

export type ConfirmModalInput = ModalCommonOptions & {
    type: 'confirm';
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
};

export type CustomModalInput = ModalCommonOptions & {
    type: 'custom';
    component: Component;
    componentProps?: Record<string, unknown>;
};

export type ModalOpenPayload = AlertModalInput | ConfirmModalInput | CustomModalInput;

export type AlertModalItem = AlertModalInput & {
    id: number;
};

export type ConfirmModalItem = ConfirmModalInput & {
    id: number;
};

export type CustomModalItem = CustomModalInput & {
    id: number;
};

export type ModalItem = AlertModalItem | ConfirmModalItem | CustomModalItem;
