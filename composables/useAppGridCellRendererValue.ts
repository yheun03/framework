import type { AppGridCellRendererParams } from '~/types/app-grid-cell';

export function useAppGridCellRendererValue<Value = unknown, RendererParams extends Record<string, unknown> = Record<string, unknown>>(
    params?: AppGridCellRendererParams<Value, RendererParams>,
) {
    const rendererParams = computed<RendererParams>(() => (params?.colDef?.cellRendererParams ?? {}) as RendererParams);

    const value = computed<Value>({
        get: () => params?.value as Value,
        set: (v: Value) => {
            params?.node?.setDataValue?.(params?.column?.getColId?.(), v);
        },
    });

    return {
        rendererParams,
        value,
    };
}
