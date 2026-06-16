/**
 * 사용자 화면 설정 및 환경설정 상태를 관리하는 Pinia store 파일입니다.
 */
import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Locale} from '~/i18n';

export type AppTheme = 'light' | 'dark';

const LOCALE_KEY = 'framework:locale';
const THEME_KEY = 'framework:theme';

export const usePreferencesStore = defineStore('preferences', () => {
    const locale = ref<Locale>('ko');
    const theme = ref<AppTheme>('light');

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
    }

    function applyTheme(next: AppTheme) {
        if (!import.meta.client) return;
        document.documentElement.dataset.theme = next;
    }

    return {
        locale,
        theme,
        setLocale,
        setTheme,
        hydrate,
    };
});
