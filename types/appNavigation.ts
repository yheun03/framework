/**
 * AppNavigation 관련 네비게이션 메뉴 타입을 관리하는 공통 타입 정의 파일입니다.
 */
import type { Component } from 'vue';
import { IconFilter, IconMagnify, IconPencil, IconTarget, IconFolderPlus } from '~/components/icons';

export interface NavigationMenu {
    id: string;
    parentId?: string | null;
    label: string;
    labelKey?: string;
    to: string;
    order: number;
    icon?: NavigationIconName;
    newTab?: boolean;
    depth: number;
    children?: NavigationMenu[];
}

export type NavigationIconName = 'cog' | 'dashboard' | 'home' | 'info' | 'widgets';

export type NavigationAction = {
    label: string;
    icon: Component;
};

export const NAVIGATION_HEADER_ACTIONS: NavigationAction[] = [
    { label: '메모 추가', icon: IconPencil },
    { label: '메모 폴더 추가', icon: IconFolderPlus },
    { label: '메모 필터 적용', icon: IconFilter },
    { label: '현재 열린 메모 표시', icon: IconTarget },
    { label: '메모 검색', icon: IconMagnify },
];
