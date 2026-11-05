<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- AppHeading -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppHeading"
                    description="홈페이지 섹션 제목입니다. Figma 레이아웃 가이드의 'Title name' 위치와 타이포그래피 토큰을 따릅니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>size</b> : sm(T3 24) / md(H3 32, 기본) / lg(H2 40) - MO 자동 축소</li>
                        <li><b>align</b> : center(기본) / left · <b>eyebrow</b> : 제목 위 라벨 · <b>tag</b> : h2 / h3 / h4</li>
                        <li><b>#actions</b> : 전체보기 등 (left 정렬 시 우측)</li>
                    </ul>

                    <AppHeading
                        size="lg"
                        eyebrow="WHY JONSOFT"
                        title="제조 현장의 데이터를 하나로"
                        description="생산 · 품질 · 설비 정보를 실시간으로 연결합니다."
                    />
                    <AppHeading title="베스트 상품" eyebrow="BEST" align="left" size="md">
                        <template #actions>
                            <AppTextButton to="#">전체보기 <IconChevronRight /></AppTextButton>
                        </template>
                    </AppHeading>
                    <AppHeading size="sm" title="Title name" />
                </PageDemoSection>

                <!-- AppFeatureCard -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppFeatureCard"
                    description="사업 영역 · 제품 특징 · 서비스 소개 카드입니다. to 가 있으면 카드 전체가 링크가 되고 hover / focus 상태가 표시됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>variant</b> : line(기본) / box / plain</li>
                        <li><b>icon</b> : bulb · rocket · shield · chart · cube · globe · building · headset · factory</li>
                        <li><b>to · moreLabel</b> : 링크 / '자세히 보기' 문구</li>
                    </ul>

                    <div class="ds-grid">
                        <AppFeatureCard
                            v-for="feature in features"
                            :key="feature.title"
                            class="ds-col-4"
                            :icon="feature.icon"
                            :title="feature.title"
                            :description="feature.description"
                            to="#"
                        />
                    </div>
                    <div class="ds-grid mt-24">
                        <AppFeatureCard class="ds-col-4" variant="box" icon="globe" title="box" description="BG Light 면 타입입니다." />
                        <AppFeatureCard class="ds-col-4" variant="plain" icon="cube" title="plain" description="테두리 없는 타입입니다." />
                        <AppFeatureCard class="ds-col-4" title="아이콘 없음" description="icon 을 비우면 아이콘 영역이 사라집니다." />
                    </div>
                </PageDemoSection>

                <!-- AppPricingCard -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppPricingCard"
                    description="요금제 / 라이선스 카드입니다. 추천 플랜은 active 로 브랜드 라인과 badge 를 표시합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>title · description · price · unit · features</b></li>
                        <li><b>active · badge</b> : 추천 강조 · <b>#actions</b> : AppButton</li>
                    </ul>

                    <div class="ds-grid">
                        <AppPricingCard
                            v-for="plan in plans"
                            :key="plan.title"
                            class="ds-col-4"
                            :title="plan.title"
                            :description="plan.description"
                            :price="plan.price"
                            :unit="plan.unit"
                            :features="plan.features"
                            :badge="plan.badge"
                            :active="plan.active"
                        >
                            <template #actions>
                                <AppButton
                                    :variant="plan.active ? 'fill' : 'outline'"
                                    :tone="plan.active ? 'primary' : 'gray'"
                                    size="lg"
                                    width="full"
                                >
                                    {{ plan.action }}
                                </AppButton>
                            </template>
                        </AppPricingCard>
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
import { IconChevronRight } from '~/components/icons';

const { title, description } = useDemoI18n('siteContent');

// temp 데이터 - API 연동 시 이 영역만 교체
const features = [
    { icon: 'factory', title: '스마트 팩토리', description: '설비 · 공정 데이터를 수집해\n생산 현황을 실시간으로 보여줍니다.' },
    { icon: 'chart', title: '데이터 분석', description: '품질 · 수율 지표를 대시보드로\n한눈에 비교합니다.' },
    { icon: 'shield', title: '보안 · 인증', description: '권한별 접근 제어와 이력 관리로\n안전하게 운영합니다.' },
];

const plans = [
    {
        title: 'Basic',
        description: '소규모 라인 도입',
        price: 290000,
        unit: '원 / 월',
        features: ['라인 1개', '기본 대시보드', '이메일 지원'],
        badge: '',
        active: false,
        action: '시작하기',
    },
    {
        title: 'Standard',
        description: '가장 많이 선택한 플랜',
        price: 790000,
        unit: '원 / 월',
        features: ['라인 5개', '품질 · 설비 모듈', '전담 매니저', '월간 리포트'],
        badge: '추천',
        active: true,
        action: '상담 신청',
    },
    {
        title: 'Enterprise',
        description: '전사 구축 / 온프레미스',
        price: '별도 문의',
        unit: '',
        features: ['라인 무제한', 'ERP 연동', '커스터마이징', '24시간 지원'],
        badge: '',
        active: false,
        action: '문의하기',
    },
];
</script>
