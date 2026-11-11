/**
 * 상단 탭(최근 방문 페이지) 기록 규칙
 *
 * - DefaultLayout 으로 보이는 화면은 모두 탭으로 기록합니다.
 * - 제외: 레이아웃 없는 화면(ROUTE_META 의 layout: false — 로그인 등), 404,
 *         ROUTE_META 에 tab: false 를 적은 화면 (예: 팝업용 화면)
 */
export function isVisibleRoute(route) {
    if (!route?.path) return false;
    if (route.name === 'not-found') return false;
    if (route.meta?.layout === false) return false;
    if (route.meta?.tab === false) return false;
    return true;
}

export function getRouteLabel(path, route) {
    const metaTitle = route?.meta?.title;
    if (typeof metaTitle === 'string' && metaTitle.trim()) return metaTitle;

    const nameLabel = route?.name;
    if (typeof nameLabel === 'string' && nameLabel.trim()) return nameLabel;

    const segment = path.split('/').filter(Boolean).at(-1) ?? 'page';
    return segment
        .replace(/^demo-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getRouteTitle(route) {
    return getRouteLabel(route.path, route);
}
