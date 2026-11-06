<template>
    <div class="site-sample">
        <AppLineBanner size="sm" variant="brand" title="2026 스마트 제조 세미나 사전 등록" description="11월 28일 코엑스 · 선착순 200명" closable />

        <AppSiteHeader :items="menus" logo="JONSOFT">
            <template #utils>
                <AppButton class="site-sample__header-button" variant="fill" tone="primary" shape="pill" size="sm" to="#contact">도입 문의</AppButton>
            </template>
        </AppSiteHeader>

        <AppBillboard
            tag="h1"
            :image="base + hero.image"
            :eyebrow="hero.eyebrow"
            :title="hero.title"
            :description="hero.description"
            weight="sb"
            :height="560"
        >
            <template #actions>
                <AppButton variant="fill" tone="primary" size="xl" shape="square">솔루션 살펴보기</AppButton>
            </template>
        </AppBillboard>

        <!-- 숫자로 보는 회사 -->
        <section class="site-sample__section site-sample__section--light">
            <div class="ds-container">
                <h2 class="sr-only">숫자로 보는 조앤소프트</h2>
                <ul class="site-sample__stats">
                    <li v-for="stat in stats" :key="stat.label" class="site-sample__stat">
                        <strong class="site-sample__stat-value">{{ stat.value }}</strong>
                        <span class="site-sample__stat-label">{{ stat.label }}</span>
                    </li>
                </ul>
            </div>
        </section>

        <!-- 사업 영역 -->
        <section class="site-sample__section">
            <div class="ds-container">
                <AppHeading
                    eyebrow="BUSINESS"
                    size="lg"
                    title="제조 현장의 데이터를 하나로"
                    description="생산 · 품질 · 설비 정보를 연결해 더 빠른 의사결정을 돕습니다."
                />
                <div class="ds-grid">
                    <AppFeatureCard
                        v-for="business in businesses"
                        :key="business.title"
                        class="ds-col-4"
                        :icon="business.icon"
                        :title="business.title"
                        :description="business.description"
                        to="#"
                    />
                </div>
            </div>
        </section>

        <AppLineBanner
            size="lg"
            :image="base + 'images/projects/framework/sample/banner-02.svg'"
            title="도입 기업 평균 생산성 18% 향상"
            description="고객 성공 사례를 확인해 보세요"
            to="#"
        />

        <!-- 연혁 / 소식 -->
        <section class="site-sample__section">
            <div class="ds-container">
                <div class="ds-grid">
                    <div class="ds-col-4 ds-col-t-8">
                        <AppHeading eyebrow="HISTORY" title="걸어온 길" size="md" align="left" />
                        <AppTimeline :items="history" time-position="left" />
                    </div>
                    <div class="ds-col-8">
                        <AppHeading eyebrow="NEWSROOM" title="새로운 소식" size="md" align="left">
                            <template #actions>
                                <AppTextButton to="#">전체보기 <IconChevronRight /></AppTextButton>
                            </template>
                        </AppHeading>
                        <div class="site-sample__cards">
                            <AppPromotionCard
                                v-for="news in newsList"
                                :key="news.title"
                                :image="base + news.image"
                                :eyebrow="news.label"
                                :title="news.title"
                                :period="news.date"
                                rounded
                                to="#"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 문의 -->
        <section id="contact" class="site-sample__section site-sample__section--light">
            <div class="ds-container">
                <AppHeading eyebrow="CONTACT" title="도입 문의" description="담당자가 영업일 기준 1일 이내에 연락드립니다." />
                <form class="site-sample__form" @submit.prevent="submitted = true">
                    <AppInput v-model="form.company" label="회사명" name="company" autocomplete="organization" />
                    <AppInput v-model="form.name" label="담당자명" name="name" autocomplete="name" />
                    <AppInput v-model="form.email" label="이메일" type="email" name="email" autocomplete="email" />
                    <AppSelect v-model="form.type" label="문의 유형" :items="inquiryTypes" />
                    <AppTextarea v-model="form.message" class="site-sample__form-full" label="문의 내용" :max-length="500" show-count />
                    <div class="site-sample__form-full site-sample__form-actions">
                        <AppButton type="submit" variant="fill" tone="primary" size="xl" shape="square" :width="240">문의 접수</AppButton>
                        <p v-if="submitted" class="site-sample__form-done" role="status">문의가 접수되었습니다. (퍼블리싱 예시)</p>
                    </div>
                </form>
            </div>
        </section>

        <AppSiteFooter
            title="조앤소프트"
            :links="footer.links"
            :sns="footer.sns"
            :infos="footer.infos"
            :copyright="footer.copyright"
            :tel="footer.tel"
            :hours="footer.hours"
            variant="dark"
        />
    </div>
</template>

<script setup>
import { IconChevronRight } from '@/components/icons';
import { reactive, ref } from 'vue';
import { useDemoI18n } from '@/composables/useI18nText';
import AppBillboard from '@/components/AppBillboard.vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';
import AppFeatureCard from '@/components/AppFeatureCard.vue';
import AppHeading from '@/components/AppHeading.vue';
import AppInput from '@/components/AppInput.vue';
import AppLineBanner from '@/components/AppLineBanner.vue';
import AppPromotionCard from '@/components/AppPromotionCard.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppSiteFooter from '@/components/AppSite/AppSiteFooter.vue';
import AppSiteHeader from '@/components/AppSite/AppSiteHeader.vue';
import AppTextarea from '@/components/AppTextarea.vue';
import AppTimeline from '@/components/AppTimeline.vue';

useDemoI18n('corporateSample');
const base = import.meta.env.BASE_URL;

// temp 데이터 - API 연동 시 이 영역만 교체
const menus = [
    { label: '회사소개', to: '#', active: true },
    { label: '사업영역', to: '#' },
    { label: '솔루션', to: '#' },
    { label: '고객사례', to: '#' },
    { label: '홍보센터', to: '#' },
    { label: '채용', to: '#', divider: true },
    { label: '고객지원', to: '#' },
];

const hero = {
    image: 'images/projects/framework/sample/banner-01.svg',
    eyebrow: 'SMART FACTORY PLATFORM',
    title: '현장을 연결하는 가장 쉬운 방법',
    description: '설비부터 경영까지, 하나의 플랫폼에서 시작하세요.',
};

const stats = [
    { value: '1,200+', label: '도입 고객사' },
    { value: '18%', label: '평균 생산성 향상' },
    { value: '99.9%', label: '서비스 가용성' },
    { value: '24/7', label: '기술 지원' },
];

const businesses = [
    { icon: 'factory', title: 'MES', description: '작업지시부터 실적까지\n생산 전 과정을 관리합니다.' },
    { icon: 'chart', title: '품질 분석', description: 'SPC · 불량 원인을\n데이터로 추적합니다.' },
    { icon: 'globe', title: '글로벌 운영', description: '다국어 · 다공장 환경을\n하나로 통합합니다.' },
];

const history = [
    { title: '스마트팩토리 플랫폼 2.0 출시', time: '2026', tone: 'primary' },
    { title: '해외 법인 설립', time: '2024' },
    { title: '누적 고객사 1,000곳 돌파', time: '2022' },
    { title: '회사 설립', time: '2018' },
];

const newsList = [
    { image: 'images/projects/framework/sample/promo-01.svg', label: 'Press', title: '스마트 제조 혁신 대상 수상', date: '2026.10.21' },
    { image: 'images/projects/framework/sample/promo-02.svg', label: 'Event', title: '2026 스마트 제조 세미나 개최', date: '2026.10.02' },
];

const inquiryTypes = [
    { value: 'demo', label: '데모 신청' },
    { value: 'price', label: '견적 문의' },
    { value: 'partner', label: '파트너 제휴' },
];

const form = reactive({ company: '', name: '', email: '', type: 'demo', message: '' });
const submitted = ref(false);

const footer = {
    links: [
        { label: '회사소개', to: '#' },
        { label: '개인정보처리방침', to: '#', strong: true },
        { label: '이용약관', to: '#' },
        { label: '윤리경영', to: '#' },
    ],
    sns: [
        { type: 'youtube', href: '#' },
        { type: 'instagram', href: '#' },
        { type: 'facebook', href: '#' },
    ],
    infos: ['대표이사 : 홍길동', '서울특별시 강남구 테헤란로 000, 0층', '사업자등록번호 : 123-45-67890'],
    copyright: 'Copyright ⓒ JONSOFT ALL RIGHTS RESERVED.',
    tel: '1234-5678',
    hours: '평일 09:00 ~ 18:00',
};
</script>
