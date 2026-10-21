<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Title / Description -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Title / Description"
                    description="화면 안에 고정 노출되는 안내 배너입니다. 잠깐 띄우는 알림은 Toast, 확인이 필요한 팝업은 Modal 을 사용합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>title</b> : 제목</li>
                        <li><b>description</b> : 내용 (기본 슬롯 가능)</li>
                    </ul>

                    <div class="page-demo-stack">
                        <AppAlert title="안내" description="작업지시는 매일 06:00 에 자동 생성됩니다." />
                        <AppAlert description="제목 없이 내용만 표시할 수 있습니다." />
                    </div>
                </PageDemoSection>

                <!-- Tone -->
                <PageDemoSection class="page-demo-section" title="Tone" description="색상 의미와 아이콘입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>info</b> : 안내 (기본값)</li>
                        <li><b>success</b> : 완료</li>
                        <li><b>warning</b> : 주의</li>
                        <li><b>danger</b> : 오류/알람</li>
                        <li><b>primary / secondary / gray</b> : 기타</li>
                    </ul>

                    <div class="page-demo-stack">
                        <AppAlert
                            v-for="tone in ['info', 'success', 'warning', 'danger']"
                            :key="tone"
                            :tone="tone"
                            :title="tone"
                            description="tone 에 따라 아이콘과 색상이 바뀝니다."
                        />
                    </div>
                </PageDemoSection>

                <!-- Variant -->
                <PageDemoSection class="page-demo-section" title="Variant" description="배너 스타일입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>soft</b> : 연한 면 (기본값)</li>
                        <li><b>outline</b> : 라인</li>
                        <li><b>fill</b> : 진한 면</li>
                    </ul>

                    <div class="page-demo-stack">
                        <AppAlert
                            v-for="variant in ['soft', 'outline', 'fill']"
                            :key="variant"
                            :variant="variant"
                            tone="warning"
                            :title="`variant ${variant}`"
                            description="10/25(토) 08:00 ~ 12:00 2라인 설비 점검 예정"
                        />
                    </div>
                </PageDemoSection>

                <!-- Closable / ShowIcon -->
                <PageDemoSection class="page-demo-section" title="Closable / ShowIcon" description="닫기 버튼(AppIconButton)과 아이콘 노출입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>closable</b> : 닫기 버튼 - close 이벤트</li>
                        <li><b>showIcon</b> : 아이콘 노출 (기본값 true)</li>
                        <li><b>#icon</b> : 아이콘 교체 슬롯</li>
                    </ul>

                    <div class="page-demo-stack">
                        <AppAlert
                            tone="warning"
                            title="닫을 수 있는 배너"
                            description="X 를 누르면 사라집니다."
                            closable
                            @close="toast.info('배너를 닫았습니다.')"
                        />
                        <AppAlert tone="gray" description="아이콘 없는 배너" :show-icon="false" />
                    </div>
                </PageDemoSection>

                <!-- #actions -->
                <PageDemoSection class="page-demo-section" title="#actions" description="오른쪽 버튼 영역입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>#actions</b> : AppButton 배치</li>
                    </ul>

                    <AppAlert tone="danger" variant="outline" title="설비 알람 3건" description="EQ-0102 사출기 온도 상한 초과">
                        <template #actions>
                            <AppButton size="xs" tone="danger" variant="soft">알람 보기</AppButton>
                        </template>
                    </AppAlert>
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
const { title, description } = useDemoI18n('alert');
const toast = useToast();
</script>
