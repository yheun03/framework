/**
 * 엑셀 파일명 생성 규칙을 클라이언트/서버에서 공통으로 사용합니다.
 */
function pad2(value: number) {
    return String(value).padStart(2, '0');
}

export function makeExportTimestamp(date = new Date()) {
    return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}_${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`;
}

export function sanitizeExportBaseName(name?: string, fallback = 'export') {
    const trimmed = (name ?? '').trim();
    const baseName = (trimmed || fallback).replace(/[\\/:*?"<>|]/g, '_');
    return baseName || fallback;
}

export function ensureXlsxExtension(name: string) {
    return name.toLowerCase().endsWith('.xlsx') ? name : `${name}.xlsx`;
}

export function makeTimestampedExportName(baseName: string) {
    return `${sanitizeExportBaseName(baseName)}_${makeExportTimestamp()}`;
}
