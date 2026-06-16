/**
 * 탭 목록 조작 시 공통 fallback 계산 유틸입니다.
 */
export function resolveFallbackTabId<T extends string>(items: T[], removedIndex: number) {
    if (!items.length) return null;
    return items[Math.max(0, removedIndex - 1)] ?? items[0] ?? null;
}
