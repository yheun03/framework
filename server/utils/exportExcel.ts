import type {AppGridExportRequestBody} from '~/types/appGrid';
import type {H3Event} from 'h3';

export function assertGridExcelRequestBody(body: AppGridExportRequestBody | null | undefined) {
    if (!body?.gridId || !Array.isArray(body.columns) || !Array.isArray(body.rows)) {
        throw createError({
            statusCode: 400,
            message: 'gridId, columns, rows 가 필요합니다.',
        });
    }
}

export function setExcelDownloadHeaders(event: H3Event, fileName: string) {
    const encoded = encodeURIComponent(fileName);
    event.node.res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"; filename*=UTF-8''${encoded}`,
    );
    event.node.res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
}
