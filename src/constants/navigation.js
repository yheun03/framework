/**
 * LNB 상단 메모 도구 버튼 목록입니다. (문구는 i18n labelKey)
 */
import { IconFilter, IconFolderPlus, IconMagnify, IconPencil, IconTarget } from '@/components/icons';

export const NAVIGATION_HEADER_ACTIONS = [
    { labelKey: 'ui.nav.memoAdd', icon: IconPencil },
    { labelKey: 'ui.nav.memoFolderAdd', icon: IconFolderPlus },
    { labelKey: 'ui.nav.memoFilter', icon: IconFilter },
    { labelKey: 'ui.nav.memoCurrent', icon: IconTarget },
    { labelKey: 'ui.nav.memoSearch', icon: IconMagnify },
];
