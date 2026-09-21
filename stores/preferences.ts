/**
 * 사용자 화면 설정 및 환경설정 상태를 관리하는 Pinia store 파일입니다.
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Locale } from '~/i18n';

export type AppTheme = 'light' | 'dark';

const LOCALE_KEY = 'framework:locale';
const THEME_KEY = 'framework:theme';
const THEME_COLORS_KEY = 'framework:theme-colors';

export const themeColorNames = [
    'primary', 'secondary', 'tertiary',
    ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => `primary-${shade}`),
    ...[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => `gray-${shade}`),
    'status-success', 'status-warning', 'status-error', 'status-info',
    'header-background', 'header-hover-color', 'header-active-color', 'header-accent-color',
    'lnb-background', 'lnb-hover-color', 'lnb-active-color',
    'page-navigator-background', 'page-navigator-hover-color', 'page-navigator-active-color',
    'page-navigator-accent-color', 'page-navigator-control-active-color',
    'color-01-white', 'color-02-black', 'color-03-gray', 'color-04-gray', 'color-05-gray-disabled',
    'line-light', 'line-regular', 'line-black', 'line-white', 'line-disabled',
    'bg-light', 'bg-regular', 'bg-black', 'bg-white',
    'bg-btn-black', 'bg-btn-white', 'bg-btn-light', 'bg-btn-regular', 'bg-btn-disabled',
] as const;

export type ThemeColorName = typeof themeColorNames[number];
const themeColorSet = new Set<string>(themeColorNames);
const isHexColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);

export const usePreferencesStore = defineStore('preferences', () => {
    const locale = ref<Locale>('ko');
    const theme = ref<AppTheme>('light');
    const themeColors = ref<Partial<Record<ThemeColorName, string>>>({});

    function setLocale(next: Locale) {
        locale.value = next;
        if (import.meta.client) localStorage.setItem(LOCALE_KEY, next);
    }

    function setTheme(next: AppTheme) {
        theme.value = next;
        applyTheme(next);
        if (import.meta.client) localStorage.setItem(THEME_KEY, next);
    }

    function hydrate() {
        if (!import.meta.client) return;
        const savedLocale = localStorage.getItem(LOCALE_KEY);
        const savedTheme = localStorage.getItem(THEME_KEY);

        if (savedLocale === 'ko' || savedLocale === 'en') locale.value = savedLocale;
        if (savedTheme === 'light' || savedTheme === 'dark') theme.value = savedTheme;

        applyTheme(theme.value);

        try {
            const savedColors = JSON.parse(sessionStorage.getItem(THEME_COLORS_KEY) || '{}');
            if (savedColors && typeof savedColors === 'object' && !Array.isArray(savedColors)) {
                for (const [name, color] of Object.entries(savedColors)) {
                    if (themeColorSet.has(name) && isHexColor(color)) {
                        setThemeColor(name as ThemeColorName, color, false);
                    }
                }
            }
        } catch {
            sessionStorage.removeItem(THEME_COLORS_KEY);
        }
    }

    function setThemeColor(name: ThemeColorName, color: string | null, persist = true) {
        if (!themeColorSet.has(name) || (color !== null && !isHexColor(color))) return;

        const next = { ...themeColors.value };
        if (color) next[name] = color;
        else delete next[name];
        themeColors.value = next;

        if (!import.meta.client) return;
        const property = `--theme-${name}`;
        if (color) document.documentElement.style.setProperty(property, color);
        else document.documentElement.style.removeProperty(property);
        if (persist) sessionStorage.setItem(THEME_COLORS_KEY, JSON.stringify(next));
    }

    function resetThemeColors() {
        if (!import.meta.client) return;
        for (const name of Object.keys(themeColors.value) as ThemeColorName[]) {
            document.documentElement.style.removeProperty(`--theme-${name}`);
        }
        themeColors.value = {};
        sessionStorage.removeItem(THEME_COLORS_KEY);
    }

    function applyTheme(next: AppTheme) {
        if (!import.meta.client) return;
        document.documentElement.dataset.theme = next;
    }

    return {
        locale,
        theme,
        themeColors,
        setLocale,
        setTheme,
        setThemeColor,
        resetThemeColors,
        hydrate,
    };
});
