<template>
    <div class="site-sample site-sample--product">
        <!-- 빌보드가 슬라이드라 화면 제목은 스크린리더 전용으로 둡니다. -->
        <h1 class="sr-only">{{ title }}</h1>
        <AppSiteHeader :items="menus" logo="JONSOFT STORE" search-placeholder="겨울 리빙 아이템 검색하고 쿠폰 받기" sticky>
            <template #aside>
                <span class="site-sample__rank"><b>1.</b> 무드등 스피어 램프</span>
            </template>
        </AppSiteHeader>

        <AppCarousel :items="billboards" nav-variant="banner" autoplay :interval="5000" :height="500">
            <template #default="{ index }">
                <AppBillboard
                    :image="base + billboards[index].image"
                    :eyebrow="billboards[index].eyebrow"
                    :title="billboards[index].title"
                    :description="billboards[index].description"
                    :height="500"
                />
            </template>
        </AppCarousel>

        <!-- 베스트 상품 -->
        <section class="site-sample__section">
            <div class="ds-container">
                <AppHeading eyebrow="BEST" title="이번 주 베스트" align="left">
                    <template #actions>
                        <AppTextButton to="#">전체보기 <IconChevronRight /></AppTextButton>
                    </template>
                </AppHeading>
                <AppTabs v-model="category" class="mb-32" :items="categories" variant="pill" />
                <div class="ds-grid">
                    <AppProductCard
                        v-for="product in filteredProducts"
                        :key="product.id"
                        v-model:active="product.wish"
                        class="ds-col-3"
                        :image="base + product.image"
                        :brand="product.brand"
                        :title="product.name"
                        :price="product.price"
                        :discount="product.discount"
                        :original-price="product.originalPrice"
                        :rating="product.rating"
                        :review-count="product.reviewCount"
                        :tags="product.tags"
                        to="#"
                    />
                </div>
                <AppEmpty v-if="!filteredProducts.length" type="search" size="sm" title="해당 카테고리 상품이 없습니다." />
            </div>
        </section>

        <AppLineBanner size="md" title="신규 회원 첫 구매 10% 할인" description="가입 즉시 쿠폰 지급" to="#" />

        <!-- 기획전 (썸네일 BG 형) -->
        <section class="site-sample__section site-sample__section--light">
            <div class="ds-container">
                <AppHeading eyebrow="PROMOTION" title="진행 중인 기획전" />
                <div class="ds-grid">
                    <AppPromotionCard
                        v-for="promo in promotions"
                        :key="promo.title"
                        class="ds-col-4"
                        :image="base + promo.image"
                        :eyebrow="promo.label"
                        :title="promo.title"
                        :period="promo.period"
                        to="#"
                    />
                </div>
            </div>
        </section>

        <!-- 서비스 특징 -->
        <section class="site-sample__section">
            <div class="ds-container">
                <div class="ds-grid">
                    <AppFeatureCard
                        v-for="service in services"
                        :key="service.title"
                        class="ds-col-3"
                        variant="plain"
                        :icon="service.icon"
                        :title="service.title"
                        :description="service.description"
                    />
                </div>
            </div>
        </section>

        <!-- FAQ -->
        <section class="site-sample__section site-sample__section--light">
            <div class="ds-container ds-container--1280-narrow">
                <AppHeading eyebrow="FAQ" title="자주 묻는 질문" />
                <AppAccordion :items="faqs" variant="line" prefix="Q." :multiple="false" />
            </div>
        </section>

        <AppSiteFooter
            title="조앤 스토어"
            :links="footer.links"
            :sns="footer.sns"
            :infos="footer.infos"
            :copyright="footer.copyright"
            :tel="footer.tel"
            :hours="footer.hours"
        >
            <template #actions>
                <AppButton size="xs" shape="square">1:1 문의하기</AppButton>
                <AppButton size="xs" shape="square">자주 묻는 질문</AppButton>
            </template>
        </AppSiteFooter>

        <AppDockBar v-model="dock" class="site-sample__dock" :items="dockItems" fixed />
    </div>
</template>

<script setup>
import { IconChevronRight } from '@/components/icons';
import { computed, ref } from 'vue';
import { useDemoI18n } from '@/composables/useI18nText';
import AppAccordion from '@/components/AppAccordion.vue';
import AppBillboard from '@/components/AppBillboard.vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';
import AppCarousel from '@/components/AppCarousel.vue';
import AppEmpty from '@/components/AppEmpty.vue';
import AppFeatureCard from '@/components/AppFeatureCard.vue';
import AppHeading from '@/components/AppHeading.vue';
import AppLineBanner from '@/components/AppLineBanner.vue';
import AppProductCard from '@/components/AppProductCard.vue';
import AppPromotionCard from '@/components/AppPromotionCard.vue';
import AppDockBar from '@/components/AppSite/AppDockBar.vue';
import AppSiteFooter from '@/components/AppSite/AppSiteFooter.vue';
import AppSiteHeader from '@/components/AppSite/AppSiteHeader.vue';
import AppTabs from '@/components/AppTabs.vue';

const { title } = useDemoI18n('productSample');
const base = import.meta.env.BASE_URL;

// temp 데이터 - API 연동 시 이 영역만 교체
const menus = [
    { label: 'New', to: '#', active: true },
    { label: 'Best', to: '#' },
    { label: 'Living', to: '#' },
    { label: 'Kitchen', to: '#' },
    { label: 'Lighting', to: '#' },
    { label: 'Sale', to: '#' },
    { label: 'Magazine', to: '#', divider: true },
    { label: 'Event', to: '#' },
];

const billboards = [
    {
        id: 1,
        image: 'images/projects/framework/sample/banner-03.svg',
        eyebrow: 'WINTER COLLECTION',
        title: '따뜻한 겨울을 위한 리빙 제안',
        description: '시즌 한정 최대 40% 할인',
    },
    {
        id: 2,
        image: 'images/projects/framework/sample/banner-01.svg',
        eyebrow: 'NEW ARRIVAL',
        title: '공간을 채우는 새로운 오브제',
        description: '이번 주 입고된 신상품을 만나보세요',
    },
];

const categories = [
    { id: 'all', title: '전체' },
    { id: 'living', title: '리빙' },
    { id: 'lighting', title: '조명' },
    { id: 'kitchen', title: '키친' },
    { id: 'outdoor', title: '아웃도어' },
];

const products = ref([
    {
        id: 1,
        category: 'living',
        image: 'images/projects/framework/sample/product-01.svg',
        brand: '조앤 스튜디오',
        name: '모듈형 데스크 오거나이저 큐브 세트',
        price: 39000,
        discount: 40,
        originalPrice: 65000,
        rating: 4.0,
        reviewCount: 299,
        tags: ['베스트'],
        wish: false,
    },
    {
        id: 2,
        category: 'living',
        image: 'images/projects/framework/sample/product-02.svg',
        brand: '조앤 리빙',
        name: '세라믹 실린더 화병 미디엄',
        price: 24000,
        discount: null,
        originalPrice: null,
        rating: 4.5,
        reviewCount: 82,
        tags: ['신상품'],
        wish: true,
    },
    {
        id: 3,
        category: 'lighting',
        image: 'images/projects/framework/sample/product-03.svg',
        brand: '조앤 라이트',
        name: '무드등 스피어 램프 (USB-C 충전형)',
        price: 52000,
        discount: 15,
        originalPrice: 61000,
        rating: 3.5,
        reviewCount: 1204,
        tags: [],
        wish: false,
    },
    {
        id: 4,
        category: 'kitchen',
        image: 'images/projects/framework/sample/product-04.svg',
        brand: '조앤 키친',
        name: '스테인리스 링 트리벳 2P',
        price: 18000,
        discount: 10,
        originalPrice: 20000,
        rating: 5.0,
        reviewCount: 12,
        tags: ['주방'],
        wish: false,
    },
]);

const promotions = [
    {
        image: 'images/projects/framework/sample/promo-01.svg',
        label: 'Exclusive',
        title: '올해 특별한 리빙 컬렉션 20% SALE',
        period: '2026.11.01 ~ 2026.11.30',
    },
    { image: 'images/projects/framework/sample/promo-02.svg', label: 'Event', title: '신규 회원 웰컴 쿠폰팩', period: '2026.11.10 ~ 2026.12.31' },
    {
        image: 'images/projects/framework/sample/promo-03.svg',
        label: 'Collaboration',
        title: '겨울 시즌 한정 콜라보 에디션',
        period: '2026.12.01 ~ 2026.12.24',
    },
];

const services = [
    { icon: 'rocket', title: '당일 출발', description: '오후 2시 이전 주문 시\n당일 출고됩니다.' },
    { icon: 'shield', title: '안심 결제', description: '모든 결제는 암호화되어\n안전하게 처리됩니다.' },
    { icon: 'cube', title: '무료 반품', description: '수령 후 7일 이내\n무료로 반품할 수 있습니다.' },
    { icon: 'headset', title: '고객센터', description: '평일 09:00 ~ 18:00\n1:1 상담을 지원합니다.' },
];

const faqs = [
    { id: 1, title: '배송은 얼마나 걸리나요?', content: '결제 완료 후 영업일 기준 1~3일 이내에 받아보실 수 있습니다.' },
    { id: 2, title: '교환 / 반품은 어떻게 신청하나요?', content: '마이페이지 > 주문 내역에서 교환 · 반품을 신청할 수 있습니다.' },
    { id: 3, title: '적립금은 언제 지급되나요?', content: '구매 확정 후 다음 날 자동으로 지급됩니다.' },
];

const dockItems = [
    { id: 'menu', label: '카테고리', icon: 'menu', to: '#' },
    { id: 'search', label: '검색', icon: 'search', to: '#' },
    { id: 'home', label: '홈', icon: 'home', to: '#' },
    { id: 'heart', label: '찜', icon: 'heart', to: '#' },
    { id: 'cart', label: '장바구니', icon: 'cart', to: '#', badge: 2 },
];

const footer = {
    links: [
        { label: '회사소개', to: '#' },
        { label: '개인정보처리방침', to: '#', strong: true },
        { label: '이용약관', to: '#' },
        { label: '입점/제휴문의', to: '#' },
    ],
    sns: [
        { type: 'instagram', href: '#' },
        { type: 'youtube', href: '#' },
        { type: 'kakao', href: '#' },
    ],
    infos: ['대표이사 : 홍길동', '서울특별시 강남구 테헤란로 000, 0층', '사업자등록번호 : 123-45-67890 / 통신판매업신고 : 2026-서울강남-0000호'],
    copyright: 'Copyright ⓒ JONSOFT ALL RIGHTS RESERVED.',
    tel: '1234-5678',
    hours: '오전 9시 ~ 오후 6시 (토요일, 공휴일 휴무)',
};

const category = ref('all');
const dock = ref('home');
const filteredProducts = computed(() =>
    category.value === 'all' ? products.value : products.value.filter((item) => item.category === category.value),
);
</script>
