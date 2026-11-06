/**
 * 그리드 엑셀보내기용 워크북을 브라우저에서 생성하는 유틸 함수 파일입니다.
 */
import * as XLSX from 'xlsx';

import { ensureXlsxExtension, sanitizeExportBaseName } from '@/utils/exportFilename';

export function buildGridExcelBuffer(body) {
    const { gridId, columns, rows } = body;
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
        throw new Error('origin 형식이 올바르지 않습니다. 예: A1, B3');
    }

    const ws = XLSX.utils.aoa_to_sheet([], {});
    XLSX.utils.sheet_add_aoa(ws, aoa, { origin });
    const wb = XLSX.utils.book_new();
    const sheetName = (body.sheetName || gridId || 'export').slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
}

export function resolveGridExcelFilename(body) {
    const { gridId } = body;
    const baseName = sanitizeExportBaseName(body.fileName || gridId || 'export');
    return ensureXlsxExtension(baseName);
}
