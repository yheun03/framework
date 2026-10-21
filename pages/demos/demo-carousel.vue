<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Items / v-model -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Items / v-model"
                    description="슬라이드 데이터와 현재 index 입니다. 좌우 버튼은 AppIconButton, 인디케이터 점은 AppButton(unstyled) 입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : { id, image, title, description } 배열</li>
                        <li><b>v-model</b> : 현재 슬라이드 index</li>
                    </ul>

                    <AppCarousel v-model="current" :items="slides" :height="220" />
                    <p class="page-demo-output">v-model: {{ current }}</p>
                </PageDemoSection>

                <!-- Indicator -->
                <PageDemoSection class="page-demo-section" title="Indicator" description="Figma 인디케이터 스타일입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>dots</b> : 점 (기본값)</li>
                        <li><b>bar</b> : 활성 점이 막대로 길어짐</li>
                        <li><b>line</b> : 진행 라인</li>
                        <li><b>fraction</b> : 1/10 숫자</li>
                        <li><b>none</b> : 숨김</li>
                    </ul>

                    <div class="demo-carousel-grid">
                        <div v-for="indicator in ['dots', 'bar', 'line', 'fraction']" :key="indicator" class="page-demo-stack">
                            <p class="page-demo-hint">indicator = "{{ indicator }}"</p>
                            <AppCarousel :items="slides" :indicator="indicator" :height="150" />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- NavVariant -->
                <PageDemoSection class="page-demo-section" title="NavVariant" description="좌우 슬라이드 버튼 모양입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>circle</b> : 원형 (기본값)</li>
                        <li><b>square</b> : 사각</li>
                        <li><b>plain</b> : 배경 없는 화살표</li>
                    </ul>

                    <div class="demo-carousel-grid">
                        <div v-for="nav in ['circle', 'square', 'plain']" :key="nav" class="page-demo-stack">
                            <p class="page-demo-hint">navVariant = "{{ nav }}"</p>
                            <AppCarousel :items="slides" :nav-variant="nav" :height="150" />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- Autoplay / Interval -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Autoplay / Interval"
                    description="자동 재생입니다. 자동 재생 시 재생/일시정지 버튼(AppIconButton)이 함께 나옵니다. 마우스를 올리면 멈춥니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>autoplay</b> : 자동 재생</li>
                        <li><b>interval</b> : 간격(ms) - 기본값 4000</li>
                        <li><b>pauseOnHover</b> : 마우스 오버 시 일시정지 (기본값 true)</li>
                    </ul>

                    <AppCarousel :items="slides" autoplay :interval="2500" indicator="bar" :height="180" />
                </PageDemoSection>

                <!-- Loop / Arrows -->
                <PageDemoSection class="page-demo-section" title="Loop / Arrows" description="반복과 좌우 버튼 노출입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>loop</b> : 마지막 → 처음 반복 (기본값 true)</li>
                        <li><b>arrows</b> : 좌우 버튼 노출 (기본값 true)</li>
                    </ul>

                    <div class="demo-carousel-grid">
                        <AppCarousel :items="slides" :loop="false" :height="150" />
                        <AppCarousel :items="slides" :arrows="false" :height="150" />
                    </div>
                </PageDemoSection>

                <!-- Slot -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Slot"
                    description="기본 슬롯으로 슬라이드 내용을 직접 구성합니다. (대시보드 롤링 공지 등)"
                >
                    <ul class="page-demo-hint-list">
                        <li><b>#default</b> : { item, index }</li>
                    </ul>

                    <AppCarousel
                        class="demo-notice-carousel"
                        :items="notices"
                        :height="64"
                        indicator="fraction"
                        nav-variant="plain"
                        autoplay
                        :interval="3000"
                    >
                        <template #default="{ item }">
                            <div class="demo-notice">
                                <AppTag variant="fill" :tone="item.tone" size="sm" :label="String(item.type)" />
                                <strong>{{ item.title }}</strong>
                                <span class="demo-notice__date">{{ item.date }}</span>
                            </div>
                        </template>
                    </AppCarousel>
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
const { title, description } = useDemoI18n('carousel');
const current = ref(0);

// temp data - image 가 없으면 caption 만 노출됩니다.
const slides = [
    { id: 1, title: '2026 하반기 생산 목표 달성', description: '전 라인 가동률 92% 달성', image: svgSlide('#2f6bff', '#39508e') },
    { id: 2, title: '설비 예지보전 시스템 오픈', description: '진동/온도 센서 기반 알람', image: svgSlide('#39982a', '#1e4c40') },
    { id: 3, title: '품질 혁신 캠페인', description: '불량률 0.5% 이하 도전', image: svgSlide('#ec6337', '#b04121') },
    { id: 4, title: '안전 점검의 날', description: '매월 첫째 주 월요일', image: svgSlide('#8331a4', '#441d87') },
];

const notices = [
    { id: 1, type: '공지', tone: 'primary', title: '10/25(토) 설비 정기 점검으로 2라인 가동 중지', date: '2026-10-21' },
    { id: 2, type: '알람', tone: 'danger', title: 'EQ-0102 사출기 온도 상한 초과 (3회)', date: '2026-10-21' },
    { id: 3, type: '안내', tone: 'success', title: '신규 작업표준서 v3.2 배포 완료', date: '2026-10-20' },
];

function svgSlide(from: string, to: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="1200" height="400" fill="url(#g)"/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
</script>

<style scoped lang="scss">
.demo-carousel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
}

.demo-notice {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 100%;
    padding: 0 56px;

    &__date {
        margin-left: auto;
        color: var(--color-steps-desc);
    }
}

// 롤링 공지형: 인디케이터를 우측 세로 중앙으로 배치
.demo-notice-carousel {
    .demo-notice {
        padding-right: 170px;
    }

    :deep(.app-carousel__indicator) {
        left: auto;
        right: 56px;
        bottom: 50%;
        transform: translateY(50%);
    }
}
</style>
