/**
 * vue-i18n 설정
 * - 언어: ko · en · ja · vi (실무 MES 와 같음). 메시지는 ko.js / en.js / ja.js / vi.js 에 'nav.home' 처럼 점(.)으로 구분한 key 로 작성합니다. (flatJson)
 * - 화면에서는 useI18nText() 의 t(key, fallback) 또는 템플릿의 $t(key) 를 사용합니다.
 * - 언어 변경은 preferences store 의 setLocale() 을 사용합니다. (localStorage 저장)
 */
import { createI18n } from 'vue-i18n';
import en from './en';
import ja from './ja';
import ko from './ko';
import vi from './vi';

export const SUPPORTED_LOCALES = ['ko', 'en', 'ja', 'vi'];

const i18n = createI18n({
    legacy: false,
    locale: 'ko',
    // 일본어 · 베트남어에 없는 문구(데모 설명 demo.*)는 영어로, 그 외 언어는 한국어로
    fallbackLocale: { ja: ['en'], vi: ['en'], default: ['ko'] },
    flatJson: true,
    messages: { ko, en, ja, vi },
    missingWarn: false,
    fallbackWarn: false,
});

export function setI18nLocale(locale) {
    if (!SUPPORTED_LOCALES.includes(locale)) return;
    i18n.global.locale.value = locale;
    document.documentElement.lang = locale;
}

export default i18n;
