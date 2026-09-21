/**
 * 사용자 화면 설정 및 환경설정 상태를 관리하는 Pinia store 파일입니다.
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Locale } from '~/i18n';

export type AppTheme = 'light' | 'dark';

const LOCALE_KEY = 'framework:locale';
const THEME_KEY = 'framework:theme';
const THEME_COLORS_KEY = 'framework:theme-colors';

export const themeColorNames = [
    'primary',
    'secondary',
    'tertiary',
    ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => `primary-${shade}`),
    ...[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => `gray-${shade}`),
    'status-success',
    'status-warning',
    'status-error',
    'status-info',
    'header-background',
    'header-hover-color',
    'header-active-color',
    'header-accent-color',
    'lnb-background',
    'lnb-hover-color',
    'lnb-active-color',
    'page-navigator-background',
    'page-navigator-hover-color',
    'page-navigator-active-color',
    'page-navigator-accent-color',
    'page-navigator-control-active-color',
    'color-01-white',
    'color-02-black',
    'color-03-gray',
    'color-04-gray',
    'color-05-gray-disabled',
    'line-light',
    'line-regular',
    'line-black',
    'line-white',
    'line-disabled',
    'bg-light',
    'bg-regular',
    'bg-black',
    'bg-white',
    'bg-btn-black',
    'bg-btn-white',
    'bg-btn-light',
    'bg-btn-regular',
    'bg-btn-disabled',
] as const;

type FoundationThemeColorName = (typeof themeColorNames)[number];
type ComponentThemeColorPrefix = 'bg' | 'color' | 'border' | 'outline' | 'shadow' | 'fill' | 'stroke';
type ComponentThemeColorName = `${ComponentThemeColorPrefix}-${string}`;
export type ThemeColorName = FoundationThemeColorName | ComponentThemeColorName;
type ThemeColorMap = Partial<Record<ThemeColorName, string>>;
type ThemeColorsByMode = Record<AppTheme, ThemeColorMap>;
const themeColorSet = new Set<string>(themeColorNames);
const componentThemeColorPattern = /^(?:bg|color|border|outline|shadow|fill|stroke)-[a-z0-9-]+$/;
const isHexColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);

function isThemeColorName(name: string): name is ThemeColorName {
    return themeColorSet.has(name) || componentThemeColorPattern.test(name);
}

function getThemeColorProperty(name: ThemeColorName) {
    return themeColorSet.has(name) ? `--theme-${name}` : `--${name}`;
}

export const usePreferencesStore = defineStore('preferences', () => {
    const locale = ref<Locale>('ko');
    const theme = ref<AppTheme>('light');
    const themeColorsByMode = ref<ThemeColorsByMode>({ light: {}, dark: {} });
    const themeColors = computed(() => themeColorsByMode.value[theme.value]);

    function setLocale(next: Locale) {
        locale.value = next;
        if (import.meta.client) localStorage.setItem(LOCALE_KEY, next);
    }

    function setTheme(next: AppTheme) {
        clearThemeColors(themeColors.value);
        theme.value = next;
        applyTheme(next);
        applyThemeColors(themeColors.value);
        if (import.meta.client) localStorage.setItem(THEME_KEY, next);
    }

    function hydrate() {
        if (!import.meta.client) return;
        const savedLocale = localStorage.getItem(LOCALE_KEY);
        const savedTheme = localStorage.getItem(THEME_KEY);

        if (savedLocale === 'ko' || savedLocale === 'en') locale.value = savedLocale;
        if (savedTheme === 'light' || savedTheme === 'dark') theme.value = savedTheme;

        try {
            const savedColors = JSON.parse(sessionStorage.getItem(THEME_COLORS_KEY) || '{}');
            if (savedColors && typeof savedColors === 'object' && !Array.isArray(savedColors)) {
                if ('light' in savedColors || 'dark' in savedColors) {
                    themeColorsByMode.value = {
                        light: sanitizeThemeColors(savedColors.light),
                        dark: sanitizeThemeColors(savedColors.dark),
                    };
                } else {
                    // 기존 단일 테마 저장값은 현재 선택된 테마의 색상으로 이전합니다.
                    themeColorsByMode.value[theme.value] = sanitizeThemeColors(savedColors);
                }
            }
        } catch {
            sessionStorage.removeItem(THEME_COLORS_KEY);
        }

        applyTheme(theme.value);
        applyThemeColors(themeColors.value);
    }

    function setThemeColor(name: ThemeColorName, color: string | null, targetTheme: AppTheme = theme.value) {
        if (!isThemeColorName(name) || (color !== null && !isHexColor(color))) return;

        const next = { ...themeColorsByMode.value[targetTheme] };
        if (color) next[name] = color;
        else delete next[name];
        themeColorsByMode.value = { ...themeColorsByMode.value, [targetTheme]: next };

        if (!import.meta.client) return;
        if (targetTheme === theme.value) {
            const property = getThemeColorProperty(name);
            if (color) document.documentElement.style.setProperty(property, color);
            else document.documentElement.style.removeProperty(property);
        }
        persistThemeColors();
    }

    function resetThemeColors(targetTheme: AppTheme = theme.value) {
        if (targetTheme === theme.value) clearThemeColors(themeColorsByMode.value[targetTheme]);
        themeColorsByMode.value = { ...themeColorsByMode.value, [targetTheme]: {} };
        persistThemeColors();
    }

    function applyTheme(next: AppTheme) {
        if (!import.meta.client) return;
        document.documentElement.dataset.theme = next;
    }

    function sanitizeThemeColors(value: unknown): ThemeColorMap {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
        return Object.fromEntries(Object.entries(value).filter(([name, color]) => isThemeColorName(name) && isHexColor(color))) as ThemeColorMap;
    }

    function applyThemeColors(colors: ThemeColorMap) {
        if (!import.meta.client) return;
        for (const [name, color] of Object.entries(colors) as [ThemeColorName, string][]) {
            document.documentElement.style.setProperty(getThemeColorProperty(name), color);
        }
    }

    function clearThemeColors(colors: ThemeColorMap) {
        if (!import.meta.client) return;
        for (const name of Object.keys(colors) as ThemeColorName[]) {
            document.documentElement.style.removeProperty(getThemeColorProperty(name));
        }
    }

    function persistThemeColors() {
        if (!import.meta.client) return;
        const hasColors = Object.values(themeColorsByMode.value).some((colors) => Object.keys(colors).length);
        if (hasColors) sessionStorage.setItem(THEME_COLORS_KEY, JSON.stringify(themeColorsByMode.value));
        else sessionStorage.removeItem(THEME_COLORS_KEY);
    }

    return {
        locale,
        theme,
        themeColors,
        themeColorsByMode,
        setLocale,
        setTheme,
        setThemeColor,
        resetThemeColors,
        hydrate,
    };
});
