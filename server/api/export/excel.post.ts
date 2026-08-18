/**
 * 서버 API 요청을 처리하는 Nitro route handler 파일입니다.
 * POST /api/export/excel — 그리드 표시 데이터를 엑셀 파일로 다운로드합니다.
 */
import { buildGridExcelBuffer, resolveGridExcelFilename } from '~/utils/gridExcelWorkbook';
import type { AppGridExportRequestBody } from '~/types/appGrid';
import { assertGridExcelRequestBody, setExcelDownloadHeaders } from '~/utils/exportExcel';

export default defineEventHandler(async (event) => {
    const body = await readBody<AppGridExportRequestBody>(event);
    assertGridExcelRequestBody(body);

    const buffer = buildGridExcelBuffer(body);
    const filename = resolveGridExcelFilename(body);
    setExcelDownloadHeaders(event, filename);
    return buffer;
});
