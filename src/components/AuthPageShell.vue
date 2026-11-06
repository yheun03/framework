<template>
    <div class="auth-page">
        <section class="auth-page__hero" :aria-label="`${project.serviceName} 소개`">
            <div class="auth-page__hero-inner">
                <RouterLink class="auth-page__brand" to="/" :aria-label="`${project.serviceName} 홈으로 이동`">
                    <span class="auth-page__brand-icon" aria-hidden="true"><IconApp /></span>
                    <span class="auth-page__brand-name">{{ project.serviceName }}</span>
                </RouterLink>

                <div class="auth-page__hero-content">
                    <p class="auth-page__eyebrow">{{ eyebrow }}</p>
                    <h2 class="auth-page__hero-title">{{ heroTitle }}</h2>
                    <p class="auth-page__hero-desc">{{ heroDescription }}</p>
                    <ul class="auth-page__features">
                        <li v-for="feature in features" :key="feature" class="auth-page__feature">
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
import { useProjectConfig } from '@/composables/useProjectConfig';

const project = useProjectConfig();
const currentYear = new Date().getFullYear();

defineProps({
    eyebrow: { type: String, default: 'Workspace + Components' },
    heroTitle: { type: String, default: '업무에 필요한 화면을\n더 빠르고 일관되게' },
    heroDescription: { type: String, default: '검증된 공통 컴포넌트로 팀의 업무 화면을 한곳에서 관리하세요.' },
    features: { type: Array, default: () => ['일관된 UI 컴포넌트', '반응형 업무 환경', '빠른 워크스페이스 구성'] },
    panelLabel: { type: String, required: true },
});
</script>
