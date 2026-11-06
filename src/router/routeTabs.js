export const ROUTE_HIDDEN_PATHS = ['/auth/sign-in', '/auth/sign-up', '/auth/find-pw', '/demos'];
const ROUTE_VISIBLE_EXACT_PATHS = ['/', '/workspace', '/settings'];
const ROUTE_VISIBLE_PREFIXES = ['/demos/'];

export function isVisibleRoute(path) {
    if (!path) return false;
    if (path.includes(':')) return false;
    if (ROUTE_HIDDEN_PATHS.includes(path)) return false;

    if (ROUTE_VISIBLE_EXACT_PATHS.includes(path)) return true;
    return ROUTE_VISIBLE_PREFIXES.some((prefix) => path.startsWith(prefix));
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
