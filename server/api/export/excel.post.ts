/**
 * 서버 API 요청을 처리하는 Nitro route handler 파일입니다.
 * POST /api/export/excel — 그리드 표시 데이터를 엑셀 파일로 다운로드합니다.
 */
import {
  buildGridExcelBuffer,
  resolveGridExcelFilename,
} from "~/utils/gridExcelWorkbook";
import type { AppGridExportRequestBody } from "~/types/appGrid";

export default defineEventHandler(async (event) => {
  const body = await readBody<AppGridExportRequestBody>(event);
  if (
    !body?.gridId ||
    !Array.isArray(body.columns) ||
    !Array.isArray(body.rows)
  ) {
    throw createError({
      statusCode: 400,
      message: "gridId, columns, rows 가 필요합니다.",
    });
  }

  const buffer = buildGridExcelBuffer(body);
  const filename = resolveGridExcelFilename(body);
  const encoded = encodeURIComponent(filename);

  // Nitro/h3 환경에서 헤더 헬퍼(setResponseHeader)가 타입에 없을 수 있어
  // 서버 res 객체에 직접 세팅합니다.
  event.node.res.setHeader(
    "Content-Disposition",
    `attachment; filename="export.xlsx"; filename*=UTF-8''${encoded}`,
  );
  event.node.res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  return buffer;
});
