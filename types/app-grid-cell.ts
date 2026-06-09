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
