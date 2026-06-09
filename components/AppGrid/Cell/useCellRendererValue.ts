import { computed } from 'vue';

export type AppGridCellRendererParams = {
    value?: unknown;
    colDef?: {
        cellRendererParams?: Record<string, any>;
    };
    node?: {
        id?: string;
        setDataValue?: (key: string | undefined, value: unknown) => void;
    };
    column?: {
        getColId?: () => string;
    };
};

export type AppGridCellRendererProps = {
    params: AppGridCellRendererParams;
};

export function useCellRendererValue<T = unknown>(params?: AppGridCellRendererParams) {
    const rendererParams = computed(() => params?.colDef?.cellRendererParams ?? {});

    const value = computed<T>({
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
