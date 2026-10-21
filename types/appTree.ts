/**
 * AppTree 공통 타입 정의 파일입니다.
 */
import type { Component, ComputedRef, InjectionKey } from 'vue';
import type { AppId, AppTone } from '~/types/appCommon';

export type AppTreeItem = {
    id: AppId;
    label: string;
    children?: AppTreeItem[];
    icon?: Component;
    tag?: string;
    tagTone?: AppTone;
    disabled?: boolean;
    [key: string]: unknown;
};

export type AppTreeContext = {
    selectedId: ComputedRef<AppId | null>;
    checkable: ComputedRef<boolean>;
    keyword: ComputedRef<string>;
    isExpanded: (id: AppId) => boolean;
    toggleExpand: (id: AppId) => void;
    select: (item: AppTreeItem) => void;
    checkState: (item: AppTreeItem) => 'checked' | 'partial' | 'none';
    toggleCheck: (item: AppTreeItem) => void;
};

export const APP_TREE_KEY: InjectionKey<AppTreeContext> = Symbol('AppTree');
