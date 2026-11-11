/**
 * AppGrid cell renderer의 표시 값을 계산하는 composable 파일입니다.
 */

import { computed } from 'vue';
import i18n from '@/i18n';

export function useAppGridCellRendererValue(params) {
    const rendererParams = computed(() => params?.colDef?.cellRendererParams ?? {});

    const value = computed({
        get: () => params?.value,
        set: (v) => {
            params?.node?.setDataValue?.(params?.column?.getColId?.(), v);
        },
    });

    // 셀 안 입력 요소의 스크린리더 이름 (예: '3행 상품명')
    const cellLabel = computed(() =>
        i18n.global.t('ui.grid.cellLabel', {
            row: (params?.node?.rowIndex ?? 0) + 1,
            column: params?.colDef?.headerName ?? params?.colDef?.field ?? '',
        }),
    );

    return {
        rendererParams,
        value,
        cellLabel,
    };
}
