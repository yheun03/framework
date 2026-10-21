<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Items -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Items"
                    description="LOT 추적, 설비 이벤트, 변경 이력입니다. 최신 항목을 위에 둡니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : { title, description, time, tag, tone } 배열</li>
                    </ul>

                    <AppTimeline :items="lotHistory" />
                </PageDemoSection>

                <!-- items[].tone / tag -->
                <PageDemoSection class="page-demo-section" title="items[].tone / tag" description="점 색상과 제목 옆 태그(AppTag)입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>tone</b> : primary / secondary / gray / danger / warning / success / info</li>
                        <li><b>tag</b> : 태그 문구</li>
                    </ul>

                    <AppTimeline :items="alarmHistory" />
                </PageDemoSection>

                <!-- TimePosition -->
                <PageDemoSection class="page-demo-section" title="TimePosition" description="시간 표시 위치입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>right</b> : 제목 오른쪽 (기본값)</li>
                        <li><b>left</b> : 왼쪽 열</li>
                    </ul>

                    <AppTimeline :items="alarmHistory" time-position="left" />
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="글자/간격 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 작게</li>
                        <li><b>md</b> : 기본값</li>
                    </ul>

                    <AppTimeline :items="alarmHistory" size="sm" />
                </PageDemoSection>

                <!-- Slot -->
                <PageDemoSection class="page-demo-section" title="Slot" description="기본 슬롯으로 항목 내용을 직접 구성합니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>#default</b> : { item, index }</li>
                    </ul>

                    <AppTimeline :items="lotHistory.slice(0, 2)">
                        <template #default="{ item }">
                            <div class="page-demo-row">
                                <strong>{{ item.title }}</strong>
                                <AppTextButton size="sm" tone="primary">상세</AppTextButton>
                            </div>
                        </template>
                    </AppTimeline>
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
import type { AppTimelineItem } from '~/components/AppTimeline.vue';

const { title, description } = useDemoI18n('timeline');

// ---------- temp data ----------
const lotHistory: AppTimelineItem[] = [
    { title: '출하 대기', description: '창고 B-03 적치', time: '10-21 15:20', tone: 'primary' },
    { title: '최종 검사 합격', description: '검사자 김OO / 샘플 20EA', time: '10-21 13:05', tone: 'success' },
    { title: '가공 완료', description: 'CNC 선반 #1 / 1,200EA', time: '10-21 11:40' },
    { title: '자재 투입', description: 'LOT RM-2610-0042 투입', time: '10-21 08:10' },
];
const alarmHistory: AppTimelineItem[] = [
    { title: 'EQ-0102 온도 상한 초과', time: '13:42', tag: '알람', tone: 'danger' },
    { title: 'EQ-0202 자재 대기', time: '12:10', tag: '경고', tone: 'warning' },
    { title: 'EQ-0301 정기 점검 시작', time: '10:00', tag: '점검', tone: 'info' },
    { title: '1라인 가동 시작', time: '08:00', tone: 'success' },
];
</script>
