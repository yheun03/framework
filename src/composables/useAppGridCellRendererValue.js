/**
 * AppGrid cell renderer의 표시 값을 계산하는 composable 파일입니다.
 */

import { computed } from 'vue';

export function useAppGridCellRendererValue(params) {
    const rendererParams = computed(() => params?.colDef?.cellRendererParams ?? {});

    const value = computed({
        get: () => params?.value,
        set: (v) => {
            params?.node?.setDataValue?.(params?.column?.getColId?.(), v);
        },
    });

    return {
        rendererParams,
        value,
    };
}
