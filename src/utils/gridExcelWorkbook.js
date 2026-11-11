/**
 * 그리드 엑셀보내기용 워크북을 브라우저에서 생성하는 유틸 함수 파일입니다.
 * - write-excel-file (쓰기 전용 · 의존성 fflate 하나). 기존 xlsx(SheetJS 0.18.5)는 npm 판이 더 이상
 *   보안 수정되지 않아 교체했습니다.
 */
import writeXlsxFile from 'write-excel-file/browser';

import { ensureXlsxExtension, sanitizeExportBaseName } from '@/utils/exportFilename';

const COLUMN_LETTERS = /^([A-Z]+)([1-9]\d*)$/;

// 'B3' → { col: 1, row: 2 } (0 부터)
function parseOrigin(origin) {
    const matched = (origin || 'A1').toUpperCase().match(COLUMN_LETTERS);
    if (!matched) throw new Error('origin 형식이 올바르지 않습니다. 예: A1, B3');
    const col = [...matched[1]].reduce((sum, char) => sum * 26 + (char.charCodeAt(0) - 64), 0) - 1;
    return { col, row: Number(matched[2]) - 1 };
}

function toCell(value) {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) return { value };
    return { value: String(value) };
}

/** 그리드 데이터 → xlsx Blob */
export async function buildGridExcelBlob(body) {
    const { gridId, columns, rows } = body;
    const { col, row } = parseOrigin(body.origin);
    const padding = Array.from({ length: col }, () => null);

    const headerRow = [...padding, ...columns.map((column) => ({ value: String(column.headerName || column.field), fontWeight: 'bold' }))];
    const dataRows = rows.map((item) => [...padding, ...columns.map((column) => toCell(item[column.field]))]);
    const sheetData = [...Array.from({ length: row }, () => [null]), headerRow, ...dataRows];

    const sheet = (body.sheetName || gridId || 'export').replace(/[\\/?*[\]:]/g, '_').slice(0, 31);
    return writeXlsxFile(sheetData, { sheet }).toBlob();
}

export function resolveGridExcelFilename(body) {
    const { gridId } = body;
    const baseName = sanitizeExportBaseName(body.fileName || gridId || 'export');
    return ensureXlsxExtension(baseName);
}
