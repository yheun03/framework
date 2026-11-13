<template>
    <div class="auth-page">
        <section class="auth-page__hero" :aria-label="$t('ui.auth.intro', { name: project.serviceName })">
            <div class="auth-page__hero-inner">
                <RouterLink class="auth-page__brand" to="/" :aria-label="$t('ui.auth.home', { name: project.serviceName })">
                    <span class="auth-page__brand-icon" aria-hidden="true"><IconApp /></span>
                    <span class="auth-page__brand-name">{{ project.serviceName }}</span>
                </RouterLink>

                <div class="auth-page__hero-content">
                    <p class="auth-page__eyebrow">{{ eyebrow }}</p>
                    <h2 class="auth-page__hero-title">{{ heroTitle ?? $t('ui.auth.heroTitle') }}</h2>
                    <p class="auth-page__hero-desc">{{ heroDescription ?? $t('ui.auth.heroDesc') }}</p>
                    <ul class="auth-page__features">
                        <li
                            v-for="feature in features ?? [$t('ui.auth.feature1'), $t('ui.auth.feature2'), $t('ui.auth.feature3')]"
                            :key="feature"
                            class="auth-page__feature"
                        >
                            <IconCheckCircle aria-hidden="true" />
                            <span>{{ feature }}</span>
                        </li>
                    </ul>
                </div>

                <p class="auth-page__copyright">© {{ currentYear }} {{ project.companyName }}. All rights reserved.</p>
            </div>
        </section>

        <main class="auth-page__panel" :aria-label="panelLabel">
            <div class="auth-page__panel-inner"><slot /></div>
        </main>
    </div>
</template>

<script setup>
import { IconApp, IconCheckCircle } from '@/components/icons';
import { projectConfig as project } from '@/project.config';

const currentYear = new Date().getFullYear();

defineProps({
    eyebrow: { type: String, default: 'MES · ERP Framework' },
    /** 기본 문구는 i18n ui.auth.heroTitle · heroDesc · feature1~3 */
    heroTitle: { type: String, default: undefined },
    heroDescription: { type: String, default: undefined },
    features: { type: Array, default: undefined },
    panelLabel: { type: String, required: true },
});
</script>
