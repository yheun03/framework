/**
 * LNB 상단 메모 도구 버튼 목록입니다.
 */
import { IconFilter, IconFolderPlus, IconMagnify, IconPencil, IconTarget } from '@/components/icons';

export const NAVIGATION_HEADER_ACTIONS = [
    { label: '메모 추가', icon: IconPencil },
    { label: '메모 폴더 추가', icon: IconFolderPlus },
    { label: '메모 필터 적용', icon: IconFilter },
    { label: '현재 열린 메모 표시', icon: IconTarget },
    { label: '메모 검색', icon: IconMagnify },
];
