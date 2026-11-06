/**
 * vue-i18n 설정
 * - 메시지는 ko.js / en.js 에 'nav.home' 처럼 점(.)으로 구분한 key 로 작성합니다. (flatJson)
 * - 화면에서는 useI18nText() 의 t(key, fallback) 또는 템플릿의 $t(key) 를 사용합니다.
 * - 언어 변경은 preferences store 의 setLocale() 을 사용합니다. (localStorage 저장)
 */
import { createI18n } from 'vue-i18n';
import en from './en';
import ko from './ko';

export const SUPPORTED_LOCALES = ['ko', 'en'];

const i18n = createI18n({
    legacy: false,
    locale: 'ko',
    fallbackLocale: 'ko',
    flatJson: true,
    messages: { ko, en },
    missingWarn: false,
    fallbackWarn: false,
});

export function setI18nLocale(locale) {
    if (!SUPPORTED_LOCALES.includes(locale)) return;
    i18n.global.locale.value = locale;
    document.documentElement.lang = locale;
}

export default i18n;
