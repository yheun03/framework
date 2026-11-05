<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- AppProductCard -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppProductCard · 바닥형"
                    description="Figma 15. 상품 썸네일입니다. 마우스 오버 또는 Tab 포커스 시 미리보기 · 장바구니 · 찜 버튼이 나타납니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>brand · title · price · discount · originalPrice</b> : 상품 정보 (할인율은 브랜드 컬러)</li>
                        <li><b>rating · reviewCount</b> : AppRating(readonly) · <b>tags</b> : 해시태그</li>
                        <li><b>v-model:active</b> : 찜 상태 · <b>@view</b> / <b>@cart</b></li>
                        <li><b>size</b> : md(3·4단) / sm(5·6단, 상품명 2줄)</li>
                    </ul>

                    <div class="demo-thumb-grid demo-thumb-grid--4">
                        <AppProductCard
                            v-for="product in products"
                            :key="product.id"
                            v-model:active="product.wish"
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
                            @cart="lastAction = `장바구니 : ${product.name}`"
                            @view="lastAction = `미리보기 : ${product.name}`"
                        />
                    </div>
                    <p class="page-demo-output">이벤트 : {{ lastAction || '-' }}</p>
                </PageDemoSection>

                <!-- Column / size -->
                <PageDemoSection
                    class="page-demo-section"
                    title="3 · 4 · 5 · 6단 / size"
                    description="Figma 15. 단 수가 달라도 썸네일 간격은 통일합니다. 그리드는 .ds-grid(12 Column) 를 사용합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>3단</b> : ds-col-4 · <b>4단</b> : ds-col-3 · <b>6단</b> : ds-col-2 (5단은 repeat(5))</li>
                        <li>Tablet 8 / MO 4 Column 에서는 환산표대로 줄어듭니다. (4단 → Tablet 4개 · MO 2개)</li>
                    </ul>

                    <p class="page-demo-output">6단 · size sm</p>
                    <div class="ds-grid">
                        <AppProductCard
                            v-for="product in [...products, ...products.slice(0, 2)]"
                            :key="`six-${product.id}-${product.name}`"
                            class="ds-col-2"
                            size="sm"
                            :image="base + product.image"
                            :brand="product.brand"
                            :title="product.name"
                            :price="product.price"
                            :discount="product.discount"
                            :original-price="product.originalPrice"
                        />
                    </div>
                </PageDemoSection>

                <!-- BG 형 / rounded -->
                <PageDemoSection
                    class="page-demo-section"
                    title="BG 형 / rounded"
                    description="Figma 15. 썸네일 BG 형은 목록 영역에 bg-light 를 깔고, Figma 14. 라운드는 썸네일 크기별로 10 / 12 / 20 / 28px 이 자동 적용됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>rounded</b> : ~120px 10 · ~216px 12 · ~500px 20 · 620px 이상 28</li>
                        <li><b>.bg-light</b> : 썸네일 BG 형 배경 (#F7F7FB)</li>
                    </ul>

                    <div class="demo-thumb-bg bg-light">
                        <div class="demo-thumb-grid demo-thumb-grid--3">
                            <AppProductCard
                                v-for="product in products.slice(0, 3)"
                                :key="`round-${product.id}`"
                                rounded
                                :image="base + product.image"
                                :brand="product.brand"
                                :title="product.name"
                                :price="product.price"
                                :discount="product.discount"
                            />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- AppPromotionCard -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppPromotionCard"
                    description="Figma 14. 가로 직사각형 프로모션 썸네일입니다. 사이트에서 16:9 / 4:3 중 하나의 비율을 정해 통일합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>ratio</b> : wide(16:9, 기본) / standard(4:3)</li>
                        <li><b>eyebrow · title · period</b> : Exclusive / 제목 / 기간 · <b>rounded</b> · <b>to</b></li>
                    </ul>

                    <div class="demo-thumb-grid demo-thumb-grid--3">
                        <AppPromotionCard
                            v-for="promo in promotions"
                            :key="promo.id"
                            :image="base + promo.image"
                            :eyebrow="promo.label"
                            :title="promo.title"
                            :period="promo.period"
                            to="#"
                        />
                    </div>
                    <div class="demo-thumb-grid demo-thumb-grid--3 mt-24">
                        <AppPromotionCard
                            v-for="promo in promotions"
                            :key="`std-${promo.id}`"
                            ratio="standard"
                            rounded
                            :image="base + promo.image"
                            :eyebrow="promo.label"
                            :title="promo.title"
                            :period="promo.period"
                        />
                    </div>
                </PageDemoSection>
            </main>
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
const { title, description } = useDemoI18n('thumbnail');
const base = useRuntimeConfig().app.baseURL;

// temp 데이터 - API 연동 시 이 영역만 교체
const products = ref([
    {
        id: 1,
        image: 'images/projects/framework/sample/product-01.svg',
        brand: '조앤 스튜디오',
        name: '모듈형 데스크 오거나이저 큐브 세트 (화이트 / 3종 구성)',
        price: 39000,
        discount: 40,
        originalPrice: 65000,
        rating: 4.0,
        reviewCount: 299,
        tags: ['베스트', '단독'],
        wish: true,
    },
    {
        id: 2,
        image: 'images/projects/framework/sample/product-02.svg',
        brand: '조앤 리빙',
        name: '세라믹 실린더 화병 미디엄',
        price: 24000,
        discount: null,
        originalPrice: null,
        rating: 4.5,
        reviewCount: 82,
        tags: ['신상품'],
        wish: false,
    },
    {
        id: 3,
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
        image: 'images/projects/framework/sample/product-04.svg',
        brand: '조앤 키친',
        name: '스테인리스 링 트리벳 2P',
        price: 18000,
        discount: 10,
        originalPrice: 20000,
        rating: null,
        reviewCount: null,
        tags: ['주방'],
        wish: false,
    },
]);

const promotions = [
    {
        id: 1,
        image: 'images/projects/framework/sample/promo-01.svg',
        label: 'Exclusive',
        title: '올해 특별한 리빙 컬렉션 20% SALE',
        period: '2026.11.01 ~ 2026.11.30',
    },
    {
        id: 2,
        image: 'images/projects/framework/sample/promo-02.svg',
        label: 'Event',
        title: '신규 회원 웰컴 쿠폰팩',
        period: '2026.11.10 ~ 2026.12.31',
    },
    {
        id: 3,
        image: 'images/projects/framework/sample/promo-03.svg',
        label: 'Collaboration',
        title: '겨울 시즌 한정 콜라보 에디션',
        period: '2026.12.01 ~ 2026.12.24',
    },
];

const lastAction = ref('');
</script>

<style scoped lang="scss">
.demo-thumb-grid {
    display: grid;
    gap: 40px 20px;

    &--3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    &--4 {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    @media (max-width: 767px) {
        &--3,
        &--4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
}

.demo-thumb-bg {
    padding: 24px;
    border-radius: 8px;
}
</style>
