import type { AppGridCellRendererParams } from '~/types/app-grid-cell';

export function useAppGridCellRendererValue<T = unknown>(params?: AppGridCellRendererParams) {
    const rendererParams = computed(() => params?.colDef?.cellRendererParams ?? {});

    const value = computed<T>({
        get: () => params?.value as T,
        set: (v: T) => {
            params?.node?.setDataValue?.(params?.column?.getColId?.(), v);
        },
    });

    return {
        rendererParams,
        value,
    };
}
