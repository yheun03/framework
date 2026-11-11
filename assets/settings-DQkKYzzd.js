var e=`<template>
    <div class="page-demo">
        <div class="page-demo-main">
            <header class="page-demo__header">
                <h1 class="page-demo__title">{{ t('settings.title') }}</h1>
                <p class="page-demo__desc">{{ t('settings.desc') }}</p>
            </header>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">{{ t('settings.theme.title') }}</h2>
                <p class="page-demo-hint">{{ t('settings.theme.desc') }}</p>

                <div class="page-demo-actions">
                    <AppButton :variant="theme === 'light' ? 'fill' : 'outline'" @click="handleThemeChange('light')">
                        {{ t('theme.light') }}
                    </AppButton>
                    <AppButton :variant="theme === 'dark' ? 'fill' : 'outline'" @click="handleThemeChange('dark')">
                        {{ t('theme.dark') }}
                    </AppButton>
                </div>
            </section>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">{{ t('settings.locale.title') }}</h2>
                <p class="page-demo-hint">{{ t('settings.locale.desc') }}</p>

                <div class="page-demo-actions">
                    <AppButton :variant="locale === 'ko' ? 'fill' : 'outline'" @click="handleLocaleChange('ko')">
                        {{ t('lang.ko') }}
                    </AppButton>
                    <AppButton :variant="locale === 'en' ? 'fill' : 'outline'" @click="handleLocaleChange('en')">
                        {{ t('lang.en') }}
                    </AppButton>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
/**
 * 테마와 언어 설정을 변경하는 환경설정 페이지 컴포넌트입니다.
 */

/* imports */
import { storeToRefs } from 'pinia';

import { useI18nText } from '@/composables/useI18nText';
import { usePreferencesStore } from '@/store/preferences';
import AppButton from '@/components/AppButton/AppButton.vue';

/* stores/composables */
const preferences = usePreferencesStore();
const { locale, theme } = storeToRefs(preferences);
const { t } = useI18nText();

/* event handlers */
function handleLocaleChange(next) {
    preferences.setLocale(next);
}

function handleThemeChange(next) {
    preferences.setTheme(next);
}
<\/script>
`;export{e as default};