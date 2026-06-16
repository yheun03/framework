/**
 * 그리드 엑셀보내기용 워크북 버퍼를 생성하는 서버 유틸 함수 파일입니다.
 */
import * as XLSX from 'xlsx';
import type {AppGridExportRequestBody} from '~/types/appGrid';

export function buildGridExcelBuffer(body: AppGridExportRequestBody): Buffer {
    const {gridId, columns, rows} = body;
    const headerRow = columns.map((c) => c.headerName || c.field);
    const dataRows = rows.map((row) =>
        columns.map((col) => {
            const v = row[col.field];
            if (v === null || v === undefined) return '';
            return v;
        }),
    );

    const aoa = [headerRow, ...dataRows];
    const origin = (body.origin || 'A1').toUpperCase();
    if (!/^[A-Z]+[1-9]\d*$/.test(origin)) {
        throw createError({
            statusCode: 400,
            message: 'origin 형식이 올바르지 않습니다. 예: A1, B3',
        });
    }

    const ws = XLSX.utils.aoa_to_sheet([], {});
    XLSX.utils.sheet_add_aoa(ws, aoa, {origin});
    const wb = XLSX.utils.book_new();
    const sheetName = (body.sheetName || gridId || 'export').slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return XLSX.write(wb, {type: 'buffer', bookType: 'xlsx'}) as Buffer;
}

export function resolveGridExcelFilename(body: AppGridExportRequestBody): string {
    const {gridId} = body;
    const baseName = (body.fileName || gridId || 'export').replace(/[\\/:*?"<>|]/g, '_');
    return baseName.toLowerCase().endsWith('.xlsx') ? baseName : `${baseName}.xlsx`;
}
