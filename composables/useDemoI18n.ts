/**
 * 데모 화면의 다국어 텍스트 처리를 위한 composable 파일입니다.
 */
import { computed } from 'vue';
import { useI18nText } from '~/composables/useI18nText';

export function useDemoI18n(key: string) {
    const { t } = useI18nText();

    const title = computed(() => t(`demo.${key}.title`));
    const description = computed(() => t(`demo.${key}.desc`));

    return {
        title,
        description,
    };
}
