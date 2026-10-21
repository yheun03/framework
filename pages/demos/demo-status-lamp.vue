<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Tone -->
                <PageDemoSection class="page-demo-section" title="Tone" description="설비/라인 상태 색상입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>success</b> : 가동 (기본값)</li>
                        <li><b>warning</b> : 대기</li>
                        <li><b>danger</b> : 정지 / 알람</li>
                        <li><b>info</b> : 점검</li>
                        <li><b>gray / primary / secondary</b> : 기타</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppStatusLamp tone="success" label="가동" />
                        <AppStatusLamp tone="warning" label="대기" />
                        <AppStatusLamp tone="danger" label="정지" />
                        <AppStatusLamp tone="info" label="점검" />
                        <AppStatusLamp tone="gray" label="gray" />
                    </div>
                </PageDemoSection>

                <!-- Blink / Off -->
                <PageDemoSection class="page-demo-section" title="Blink / Off" description="깜빡임(알람)과 꺼짐(미연결) 상태입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>blink</b> : 깜빡임</li>
                        <li><b>off</b> : 꺼짐 - 회색</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppStatusLamp tone="danger" blink label="알람 (blink)" />
                        <AppStatusLamp off label="미연결 (off)" />
                    </div>
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="램프 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 8px</li>
                        <li><b>md</b> : 10px (기본값)</li>
                        <li><b>lg</b> : 14px</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppStatusLamp v-for="size in ['sm', 'md', 'lg']" :key="size" :size="size" :label="`size ${size}`" />
                    </div>
                </PageDemoSection>

                <!-- Label / Slot -->
                <PageDemoSection class="page-demo-section" title="Label / Slot" description="옆에 붙는 텍스트입니다. 없으면 램프만 표시됩니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>label</b> : 텍스트</li>
                        <li><b>default slot</b> : 텍스트 슬롯</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppStatusLamp tone="success" />
                        <AppStatusLamp tone="warning"><b>EQ-0202</b> 자재 대기</AppStatusLamp>
                    </div>
                </PageDemoSection>

                <!-- Example -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Example"
                    description="설비 현황 목록 예시입니다. v-for + JSON 데이터의 status 를 tone 으로 매핑합니다."
                >
                    <div class="demo-equipment">
                        <div v-for="eq in equipments" :key="eq.code" class="demo-equipment__item">
                            <AppStatusLamp :tone="lampTone[eq.status]" :off="eq.status === 'off'" :blink="eq.status === 'stop'" size="lg" />
                            <div>
                                <strong>{{ eq.code }}</strong>
                                <p>{{ eq.name }}</p>
                            </div>
                            <AppTag size="xs" variant="soft" :tone="lampTone[eq.status]" :label="statusLabel[eq.status]" />
                        </div>
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
const { title, description } = useDemoI18n('statusLamp');
// ---------- temp data ----------
type EqStatus = 'run' | 'idle' | 'stop' | 'check' | 'off';
const lampTone: Record<EqStatus, 'success' | 'warning' | 'danger' | 'info' | 'gray'> = {
    run: 'success',
    idle: 'warning',
    stop: 'danger',
    check: 'info',
    off: 'gray',
};
const statusLabel: Record<EqStatus, string> = { run: '가동', idle: '대기', stop: '정지', check: '점검', off: '미연결' };
const equipments: { code: string; name: string; status: EqStatus }[] = [
    { code: 'EQ-0101', name: '사출기 #1', status: 'run' },
    { code: 'EQ-0102', name: '사출기 #2', status: 'stop' },
    { code: 'EQ-0201', name: 'CNC 선반 #1', status: 'run' },
    { code: 'EQ-0202', name: 'CNC 선반 #2', status: 'idle' },
    { code: 'EQ-0301', name: '프레스 #1', status: 'check' },
    { code: 'EQ-0302', name: '프레스 #2', status: 'off' },
];
</script>

<style scoped lang="scss">
.demo-equipment {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 8px;

    &__item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border: 1px solid var(--border-stat-card);
        border-radius: 8px;

        p {
            margin: 0;
            color: var(--color-stat-card-title);
            font-size: 12px;
        }

        .app-tag {
            margin-left: auto;
        }
    }
}
</style>
