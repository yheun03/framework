/**
 * AppGrid 데이터를 Excel 파일로 보내기 위한 composable 파일입니다.
 */

import { buildGridExcelBlob } from '@/utils/gridExcelWorkbook';

import { ensureXlsxExtension, makeTimestampedExportName } from '@/utils/exportFilename';

function getColumns(api) {
    return api
        .getAllDisplayedColumns()
        .filter((col) => Boolean(col.getColDef().field))
        .map((col) => ({
            field: col.getColId(),
            headerName: col.getColDef().headerName || col.getColId(),
        }));
}

function normalizeExportValue(value) {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return '';

    return value;
}

function toExportRow(node, columns) {
    if (!node.data) return null;

    const row = {};
    for (const col of columns) {
        row[col.field] = normalizeExportValue(node.data[col.field]);
    }

    return row;
}

function getDisplayedRows(api, columns, filter) {
    const rows = [];
    const count = api.getDisplayedRowCount();

    for (let i = 0; i < count; i++) {
        const node = api.getDisplayedRowAtIndex(i);
        if (!node?.data || (filter && !filter(i))) continue;

        const row = toExportRow(node, columns);
        if (row) rows.push(row);
    }

    return rows;
}

function getDisplayedSelectedRows(api, columns) {
    const rows = [];
    const count = api.getDisplayedRowCount();

    for (let i = 0; i < count; i++) {
        const node = api.getDisplayedRowAtIndex(i);
        if (!node?.isSelected()) continue;

        const row = toExportRow(node, columns);
        if (row) rows.push(row);
    }

    return rows;
}

function downloadBlobAsFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function useAppGridExcelExport(options) {
    const origin = options?.origin ?? 'A1';

    async function requestExcelDownload(params) {
        const fileNameBase = params.fileNameBase ?? params.gridId;
        const fileName = makeTimestampedExportName(fileNameBase);
        const sheetName = params.sheetName ?? params.gridId;

        // 서버 없이 브라우저에서 바로 xlsx 파일을 만듭니다.
        const res = await buildGridExcelBlob({ gridId: params.gridId, columns: params.columns, rows: params.rows, sheetName, origin });

        downloadBlobAsFile(res, ensureXlsxExtension(fileName));
    }

    async function exportDisplayed(gridId, api) {
        const columns = getColumns(api);
        const rows = getDisplayedRows(api, columns);
        if (!columns.length || !rows.length) return;
        await requestExcelDownload({ gridId, columns, rows });
    }

    async function exportDisplayedSelected(gridId, api) {
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
