/**
 * 다국어 텍스트 값을 안전하게 가져오기 위한 composable 파일입니다.
 */
import { storeToRefs } from 'pinia';
import { I18N_MESSAGES } from '~/i18n';
import { usePreferencesStore } from '~/stores/preferences';

export function useI18nText() {
    const preferences = usePreferencesStore();
    const { locale } = storeToRefs(preferences);

    function t(key: string, fallback?: string) {
        return I18N_MESSAGES[locale.value][key] ?? fallback ?? key;
    }

    return {
        locale,
        t,
    };
}
