export type AppGridExportColumn = {
    field: string;
    headerName: string;
};

export type AppGridExportRow = Record<string, unknown>;

export type AppGridExportRequestBody = {
    gridId: string;
    columns: AppGridExportColumn[];
    rows: AppGridExportRow[];
    fileName?: string;
    sheetName?: string;
    origin?: string;
};
