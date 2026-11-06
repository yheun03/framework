<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <div class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- AppBillboard variant -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppBillboard · variant"
                    description="Figma 16. 1920 풀 화면(overlay) 과 1580 카드형(card) 메인 빌보드입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>overlay</b> : 이미지 위 흰 글자 · Brand name B1 / 타이틀 H1 48 / 본문 B1 16</li>
                        <li><b>card</b> : 이미지 아래 캡션 · B3 / H4 28 / B3 회색</li>
                        <li><b>#actions</b> : 버튼 · <b>#object</b> : 오브젝트 이미지 영역</li>
                    </ul>

                    <AppBillboard
                        :image="base + billboards[0].image"
                        :eyebrow="billboards[0].eyebrow"
                        :title="billboards[0].title"
                        :description="billboards[0].description"
                        :height="400"
                    >
                        <template #actions>
                            <AppButton variant="fill" tone="primary" shape="square" size="lg">자세히 보기</AppButton>
                        </template>
                    </AppBillboard>

                    <AppBillboard
                        class="mt-24"
                        variant="card"
                        :image="base + billboards[1].image"
                        :eyebrow="billboards[1].eyebrow"
                        :title="billboards[1].title"
                        :description="billboards[1].description"
                        :height="320"
                    />
                </PageDemoSection>

                <!-- AppBillboard weight / align -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppBillboard · weight / align"
                    description="타이틀 굵기로 디자인 느낌을 정합니다. (Figma: 세련된 / 가벼운 / 무거운 느낌)"
                >
                    <ul class="page-demo-hint-list">
                        <li><b>weight</b> : lt(세련된) / rg(가벼운, 기본) / sb(무거운)</li>
                        <li><b>align</b> : center(기본) / left</li>
                    </ul>

                    <div class="demo-banner-grid">
                        <AppBillboard
                            v-for="weight in ['lt', 'rg', 'sb']"
                            :key="weight"
                            :weight="weight"
                            eyebrow="Brand name"
                            :title="`weight ${weight}`"
                            description="진짜 살만한 혜택 오직 하루만!"
                            :height="240"
                        />
                    </div>
                    <AppBillboard
                        class="mt-12"
                        align="left"
                        :image="base + billboards[2].image"
                        eyebrow="Brand name"
                        title="align left 빌보드"
                        description="텍스트를 컨테이너 왼쪽에 정렬합니다."
                        :height="280"
                    />
                </PageDemoSection>

                <!-- AppBillboard + AppCarousel -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppBillboard + AppCarousel"
                    description="여러 장은 AppCarousel navVariant='banner' (56x80 사각 화살표, hover 시 진하게) 안에 넣어 사용합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>AppCarousel navVariant</b> : banner (Figma 좌우화살표_BG)</li>
                        <li>자동 재생 시 재생/일시정지 버튼을 함께 노출합니다.</li>
                    </ul>

                    <AppCarousel :items="billboards" nav-variant="banner" indicator="dots" autoplay :interval="5000" :height="400">
                        <template #default="{ index }">
                            <AppBillboard
                                :image="base + billboards[index].image"
                                :eyebrow="billboards[index].eyebrow"
                                :title="billboards[index].title"
                                :description="billboards[index].description"
                                :height="400"
                            />
                        </template>
                    </AppCarousel>
                </PageDemoSection>

                <!-- AppLineBanner size -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppLineBanner · size"
                    description="Figma 17. 띠배너 4가지 사이즈입니다. 타이틀은 Light, 반응형을 위해 이미지가 아닌 텍스트로 구현합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 90px 최상단 (닫기 버튼과 함께)</li>
                        <li><b>md</b> : 120px 약한 띠배너 (서브페이지)</li>
                        <li><b>lg</b> : 180px 중간 띠배너 (서브페이지)</li>
                        <li><b>xl</b> : 240px 강한 띠배너 (메인)</li>
                    </ul>

                    <div class="demo-banner-stack">
                        <AppLineBanner size="sm" title="10% 추가 할인 혜택" description="온라인 단독 신상 할인 20%" closable @close="closed++" />
                        <AppLineBanner size="md" title="진짜 혜택 오직 하루만!" description="온라인 단독 신상 할인 20%" />
                        <AppLineBanner size="lg" title="진짜 살만한 혜택 오직 하루만!" description="10% 추가 할인 혜택 온라인 단독 신상 할인 20%" />
                        <AppLineBanner
                            size="xl"
                            :image="base + billboards[1].image"
                            title="2026 트렌드를 선도하는 신제품"
                            description="사전 예약 고객 전원 무이자 할부 혜택"
                        />
                    </div>
                    <p class="page-demo-output">@close 횟수 : {{ closed }}</p>
                </PageDemoSection>

                <!-- AppLineBanner variant / align -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppLineBanner · variant / align"
                    description="배경 톤과 우측 정렬(예외 케이스)입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>variant</b> : dark(기본) / light / brand</li>
                        <li><b>align</b> : center(기본형) / right(예외 케이스)</li>
                        <li><b>#object</b> : 오브젝트(텍스트와 겹치지 않게 배치) · <b>#actions</b> : 버튼 · <b>to</b> : 배너 링크</li>
                    </ul>

                    <div class="demo-banner-stack">
                        <AppLineBanner variant="light" title="오늘은 비가 많이 내려요" description="우산을 꼭 들고 나가세요" />
                        <AppLineBanner variant="brand" title="지금 당장 창의력을 올려봐" description="크리에이티브 전용관 혜택 이벤트!" to="#">
                            <template #object>
                                <img class="demo-banner-object" :src="base + 'images/projects/framework/sample/product-01.svg'" alt="" />
                            </template>
                        </AppLineBanner>
                        <AppLineBanner align="right" title="우리 집 이사 갈 때 되지 않았어?" description="불러만 주시면 언제든 갑니다">
                            <template #actions>
                                <AppButton size="sm" shape="pill" variant="fill" tone="primary">신청하기</AppButton>
                            </template>
                        </AppLineBanner>
                    </div>
                </PageDemoSection>

                <!-- AppLineBanner + AppCarousel -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppLineBanner + AppCarousel"
                    description="자동 롤링 띠배너입니다. 좌우 화살표는 48x48, 인디케이터를 함께 노출합니다."
                >
                    <AppCarousel class="demo-banner-rolling" :items="lineBanners" nav-variant="banner" autoplay :height="120">
                        <template #default="{ index }">
                            <AppLineBanner
                                :variant="lineBanners[index].variant"
                                :title="lineBanners[index].title"
                                :description="lineBanners[index].description"
                            />
                        </template>
                    </AppCarousel>
                </PageDemoSection>
            </div>
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDemoI18n } from '@/composables/useI18nText';
import AppBillboard from '@/components/AppBillboard.vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppCarousel from '@/components/AppCarousel.vue';
import AppLineBanner from '@/components/AppLineBanner.vue';
import PageDemoPropsSummary from '@/components/PageDemo/content/PageDemoPropsSummary.vue';
import PageDemoSection from '@/components/PageDemoSection.vue';

const { title, description } = useDemoI18n('banner');
const base = import.meta.env.BASE_URL;

// temp 데이터 - API 연동 시 이 영역만 교체
const billboards = [
    {
        id: 1,
        image: 'images/projects/framework/sample/banner-01.svg',
        eyebrow: 'Brand name',
        title: '진짜 살만한 혜택 오직 하루만!',
        description: '10% 추가 할인 혜택 온라인 단독 신상 할인 ~20%\n설렘을 담은 올해 특별한 컬렉션',
    },
    {
        id: 2,
        image: 'images/projects/framework/sample/banner-02.svg',
        eyebrow: 'Brand name',
        title: '한 끗 다른 사람들을 위한 마스터 마켓',
        description: '저마다의 스타일 공식이 있는 마스터를 위한 랜덤 쿠폰 이벤트!',
    },
    {
        id: 3,
        image: 'images/projects/framework/sample/banner-03.svg',
        eyebrow: 'Brand name',
        title: '쏟아진 할인 이번 시즌은 이걸로!',
        description: '쇼핑 고민을 끝내줄 매력적인 제안',
    },
];

const lineBanners = [
    { id: 1, variant: 'dark', title: '진짜 혜택 오직 하루만!', description: '온라인 단독 신상 할인 20%' },
    { id: 2, variant: 'brand', title: '삼성카드 무이자 할부', description: '단 하루 이벤트' },
    { id: 3, variant: 'light', title: '우리 아이들 장난감 기획', description: '오늘만 딱 50% 할인 특가' },
];

const closed = ref(0);
</script>

<style scoped lang="scss">
.demo-banner-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
}

.demo-banner-stack {
    display: grid;
    gap: 12px;
}

.demo-banner-object {
    width: 96px;
    height: 96px;
    border-radius: 50%;
}

.demo-banner-rolling {
    --app-carousel-banner-nav-width: 48px;
    --app-carousel-banner-nav-height: 48px;
}
</style>
