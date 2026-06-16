export type AppRoute = {
    path: string;
    name?: string | symbol | null;
    meta?: Record<string, unknown>;
};

export const ROUTE_HIDDEN_PATHS = ['/auth/sign-in', '/auth/sign-up', '/auth/find-pw', '/demos'] as const;
const ROUTE_VISIBLE_EXACT_PATHS = ['/', '/workspace', '/settings'] as const;
const ROUTE_VISIBLE_PREFIXES = ['/demos/'] as const;

export function isVisibleRoute(path: string): boolean {
    if (!path) return false;
    if (path.includes(':')) return false;
    if (ROUTE_HIDDEN_PATHS.includes(path as (typeof ROUTE_HIDDEN_PATHS)[number])) return false;

    if (ROUTE_VISIBLE_EXACT_PATHS.includes(path as (typeof ROUTE_VISIBLE_EXACT_PATHS)[number])) return true;
    return ROUTE_VISIBLE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function getRouteLabel(path: string, route?: AppRoute): string {
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

export function getRouteTitle(route: AppRoute): string {
    return getRouteLabel(route.path, route);
}
