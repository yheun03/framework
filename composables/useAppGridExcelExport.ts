/**
 * AppGrid 데이터를 Excel 파일로보내기 위한 composable 파일입니다.
 */
import type {GridApi, IRowNode} from 'ag-grid-community';
import {useApi} from '~/composables/useApi';
import type {AppGridExportColumn, AppGridExportRow} from '~/types/appGrid';
import {ensureXlsxExtension, makeTimestampedExportName} from '~/utils/exportFilename';

function getColumns<T>(api: GridApi<T>): AppGridExportColumn[] {
    return api
        .getAllDisplayedColumns()
        .filter((col) => Boolean(col.getColDef().field))
        .map((col) => ({
            field: col.getColId(),
            headerName: (col.getColDef().headerName as string) || col.getColId(),
        }));
}

function normalizeExportValue(value: unknown) {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return '';

    return value;
}

function toExportRow<T>(
    node: IRowNode<T>,
    columns: AppGridExportColumn[],
): AppGridExportRow | null {
    if (!node.data) return null;

    const row: AppGridExportRow = {};
    for (const col of columns) {
        row[col.field] = normalizeExportValue(
            (node.data as Record<string, unknown>)[col.field],
        );
    }

    return row;
}

function getDisplayedRows<T>(
    api: GridApi<T>,
    columns: AppGridExportColumn[],
    filter?: (index: number) => boolean,
): AppGridExportRow[] {
    const rows: AppGridExportRow[] = [];
    const count = api.getDisplayedRowCount();

    for (let i = 0; i < count; i++) {
        const node = api.getDisplayedRowAtIndex(i);
        if (!node?.data || (filter && !filter(i))) continue;

        const row = toExportRow(node, columns);
        if (row) rows.push(row);
    }

    return rows;
}

function getDisplayedSelectedRows<T>(api: GridApi<T>, columns: AppGridExportColumn[]): AppGridExportRow[] {
    const rows: AppGridExportRow[] = [];
    const count = api.getDisplayedRowCount();

    for (let i = 0; i < count; i++) {
        const node = api.getDisplayedRowAtIndex(i);
        if (!node?.isSelected()) continue;

        const row = toExportRow(node, columns);
        if (row) rows.push(row);
    }

    return rows;
}

async function downloadBlobAsFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function useAppGridExcelExport(options?: {origin?: string}) {
    const origin = options?.origin ?? 'A1';
    const api = useApi();

    async function requestExcelDownload(params: {
        gridId: string;
        columns: AppGridExportColumn[];
        rows: AppGridExportRow[];
        fileNameBase?: string;
        sheetName?: string;
    }) {
        const fileNameBase = params.fileNameBase ?? params.gridId;
        const fileName = makeTimestampedExportName(fileNameBase);
        const sheetName = params.sheetName ?? params.gridId;

        const res = await api.post<Blob>(
            '/api/export/excel',
            {
                gridId: params.gridId,
                columns: params.columns,
                rows: params.rows,
                fileName,
                sheetName,
                origin,
            },
            {responseType: 'blob'},
        );

        await downloadBlobAsFile(res, ensureXlsxExtension(fileName));
    }

    async function exportDisplayed<T>(gridId: string, api: GridApi<T>) {
        const columns = getColumns(api);
        const rows = getDisplayedRows(api, columns);
        if (!columns.length || !rows.length) return;
        await requestExcelDownload({gridId, columns, rows});
    }

    async function exportDisplayedSelected<T>(gridId: string, api: GridApi<T>) {
        const columns = getColumns(api);
        const rows = getDisplayedSelectedRows(api, columns);
        if (!columns.length || !rows.length) return;
        await requestExcelDownload({
            gridId: `${gridId}_selected`,
            columns,
            rows,
            fileNameBase: `${gridId}_선택`,
            sheetName: `${gridId}_선택`,
        });
    }

    return {
        exportDisplayed,
        exportDisplayedSelected,
    };
}
