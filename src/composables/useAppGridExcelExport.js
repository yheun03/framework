/**
 * 목록을 Excel(xlsx) 파일로 내려받습니다. (서버 없이 브라우저에서 생성 - write-excel-file)
 *
 * const { exportRows } = useAppGridExcelExport();
 * // 서버 페이지 목록: 현재 페이지가 아니라 조회 조건 전체를 받아서 → useSearchList 의 fetchAllRows()
 * await exportRows({ name: '재고현황', columns: [{ field: 'itemCode', headerName: '품목코드' }], rows: await fetchAllRows() });
 *
 * - AppGrid: exportDisplayed(gridId, api) · exportDisplayedSelected(gridId, api) (AppGridDownload 버튼이 사용)
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

    /** 행 배열을 그대로 xlsx 로 - columns: [{ field, headerName }] (화면 표에 보이는 순서) */
    async function exportRows({ name, columns, rows }) {
        if (!columns?.length || !rows?.length) return;
        await requestExcelDownload({
            gridId: name,
            columns,
            rows: rows.map((row) => Object.fromEntries(columns.map((col) => [col.field, normalizeExportValue(row[col.field])]))),
        });
    }

    return {
        exportDisplayed,
        exportDisplayedSelected,
        exportRows,
    };
}
