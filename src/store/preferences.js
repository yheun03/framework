/**
 * 사용자 화면 설정 및 환경설정 상태를 관리하는 Pinia store 파일입니다.
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { clearCodes } from '@/composables/useCodes';
import { SUPPORTED_LOCALES, setI18nLocale } from '@/i18n';
import { accessibleTextColor, primaryTextColor } from '@/utils/color';

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
];

const themeColorSet = new Set(themeColorNames);
const componentThemeColorPattern = /^(?:bg|color|border|outline|shadow|fill|stroke)-[a-z0-9-]+$/;
const isHexColor = (value) => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);

function isThemeColorName(name) {
    return themeColorSet.has(name) || componentThemeColorPattern.test(name);
}

function getThemeColorProperty(name) {
    return themeColorSet.has(name) ? `--theme-${name}` : `--${name}`;
}

export const usePreferencesStore = defineStore('preferences', () => {
    const locale = ref('ko');
    const theme = ref('light');
    const themeColorsByMode = ref({ light: {}, dark: {} });
    const themeColors = computed(() => themeColorsByMode.value[theme.value]);

    function setLocale(next) {
        locale.value = next;
        setI18nLocale(next);
        clearCodes(); // 공통코드 이름은 Accept-Language 에 따라 다르므로 다음 화면부터 새로 받음
        localStorage.setItem(LOCALE_KEY, next);
    }

    function setTheme(next) {
        clearThemeColors(themeColors.value);
        theme.value = next;
        applyTheme(next);
        applyThemeColors(themeColors.value);
        syncPrimaryText();
        localStorage.setItem(THEME_KEY, next);
    }

    function hydrate() {
        const savedLocale = localStorage.getItem(LOCALE_KEY);
        const savedTheme = localStorage.getItem(THEME_KEY);

        if (SUPPORTED_LOCALES.includes(savedLocale)) locale.value = savedLocale;
        setI18nLocale(locale.value);
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
        syncPrimaryText();
    }

    function setThemeColor(name, color, targetTheme = theme.value) {
        if (!isThemeColorName(name) || (color !== null && !isHexColor(color))) return;

        const next = { ...themeColorsByMode.value[targetTheme] };
        if (color) next[name] = color;
        else delete next[name];
        themeColorsByMode.value = { ...themeColorsByMode.value, [targetTheme]: next };

        if (targetTheme === theme.value) {
            const property = getThemeColorProperty(name);
            if (color) document.documentElement.style.setProperty(property, color);
            else document.documentElement.style.removeProperty(property);
            if (name === 'primary') syncPrimaryText();
        }
        persistThemeColors();
    }

    function resetThemeColors(targetTheme = theme.value) {
        if (targetTheme === theme.value) clearThemeColors(themeColorsByMode.value[targetTheme]);
        themeColorsByMode.value = { ...themeColorsByMode.value, [targetTheme]: {} };
        if (targetTheme === theme.value) syncPrimaryText();
        persistThemeColors();
    }

    // primary 를 바꾸면 글자용 브랜드색 · 흰 글자용 면 색도 같은 대비 규칙(4.5:1)으로 다시 계산합니다. (utils/color.js)
    function syncPrimaryText() {
        const primary = themeColors.value.primary;
        const style = document.documentElement.style;
        if (primary) {
            style.setProperty('--theme-primary-text', primaryTextColor(primary, theme.value));
            style.setProperty('--theme-primary-fill', accessibleTextColor(primary));
        } else {
            style.removeProperty('--theme-primary-text');
            style.removeProperty('--theme-primary-fill');
        }
    }

    function applyTheme(next) {
        document.documentElement.dataset.theme = next;
    }

    function sanitizeThemeColors(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
        return Object.fromEntries(Object.entries(value).filter(([name, color]) => isThemeColorName(name) && isHexColor(color)));
    }

    function applyThemeColors(colors) {
        for (const [name, color] of Object.entries(colors)) {
            document.documentElement.style.setProperty(getThemeColorProperty(name), color);
        }
    }

    function clearThemeColors(colors) {
        for (const name of Object.keys(colors)) {
            document.documentElement.style.removeProperty(getThemeColorProperty(name));
        }
    }

    function persistThemeColors() {
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
