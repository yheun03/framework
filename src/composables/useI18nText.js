/**
 * 다국어 텍스트를 가져오는 composable 입니다. (vue-i18n 전역 인스턴스 사용 - store 안에서도 사용 가능)
 * t(key, fallback): 번역이 없으면 fallback(없으면 key) 을 돌려줍니다.
 */
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import i18n from '@/i18n';
import { usePreferencesStore } from '@/store/preferences';

export function useI18nText() {
    const preferences = usePreferencesStore();
    const { locale } = storeToRefs(preferences);

    function t(key, fallback) {
        return i18n.global.te(key) ? i18n.global.t(key) : (fallback ?? key);
    }

    return {
        locale,
        t,
    };
}

export function useDemoI18n(key) {
    const { t } = useI18nText();

    const title = computed(() => t(`demo.${key}.title`));
    const description = computed(() => t(`demo.${key}.desc`));

    return {
        title,
        description,
    };
}
