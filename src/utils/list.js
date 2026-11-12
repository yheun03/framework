/**
 * 목록 API 응답을 { items, total } 하나의 모양으로 맞춥니다. (useSearchList 에서 사용)
 * - 배열                                   → 화면에서 나눠 보여줌(클라이언트 페이지)
 * - { items | list | content | rows, total | totalCount | totalElements } → 서버 페이지
 *   (Spring Page 의 content · totalElements 도 그대로 받습니다)
 */
const ITEM_KEYS = ['items', 'list', 'content', 'rows'];
const TOTAL_KEYS = ['total', 'totalCount', 'totalElements'];

export function normalizeListResponse(response) {
    if (Array.isArray(response)) return { items: response, total: response.length, paged: false };
    if (!response || typeof response !== 'object') return { items: [], total: 0, paged: false };

    const items = ITEM_KEYS.map((key) => response[key]).find(Array.isArray) ?? [];
    const total = TOTAL_KEYS.map((key) => response[key]).find((value) => typeof value === 'number');
    return { items, total: total ?? items.length, paged: total !== undefined };
}

/** 클라이언트 페이지: 전체 목록에서 현재 페이지만 잘라냅니다. */
export function slicePage(items, page, pageSize) {
    return items.slice((page - 1) * pageSize, page * pageSize);
}
