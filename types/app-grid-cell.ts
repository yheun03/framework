export type AppGridCellRendererParams<Value = unknown, RendererParams extends Record<string, unknown> = Record<string, unknown>> = {
    value?: Value;
    colDef?: {
        cellRendererParams?: RendererParams;
    };
    node?: {
        id?: string;
        setDataValue?: (key: string | undefined, value: unknown) => void;
    };
    column?: {
        getColId?: () => string;
    };
};

export type AppGridCellRendererProps<Value = unknown, RendererParams extends Record<string, unknown> = Record<string, unknown>> = {
    params: AppGridCellRendererParams<Value, RendererParams>;
};
