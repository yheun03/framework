<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- useToast() -->
                <PageDemoSection
                    class="page-demo-section"
                    title="useToast()"
                    description="토스트는 app.vue 의 AppToastHost 가 그리고, 화면에서는 useToast() 로 호출합니다. Figma 토스트 팝업처럼 딤 없이 잠깐 노출됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>show(message | options)</b> : 기본 토스트</li>
                        <li><b>success / error / warning / info</b> : tone 이 지정된 토스트</li>
                        <li><b>remove(id) / clear()</b> : 닫기</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" @click="toast.show('즐겨찾기로 표시되었습니다.')">show</AppButton>
                        <AppButton size="sm" @click="toast.clear()">clear</AppButton>
                    </div>
                    <pre class="page-demo-output">
const toast = useToast();
                    toast.show('즐겨찾기로 표시되었습니다.');</pre
                    >
                </PageDemoSection>

                <!-- Tone -->
                <PageDemoSection class="page-demo-section" title="Tone" description="왼쪽 아이콘과 색상 의미입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>success</b> : 완료</li>
                        <li><b>danger</b> : 오류 (toast.error)</li>
                        <li><b>warning</b> : 경고</li>
                        <li><b>info</b> : 안내</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" tone="success" variant="soft" @click="toast.success('작업실적이 저장되었습니다.')">success</AppButton>
                        <AppButton size="sm" tone="danger" variant="soft" @click="toast.error('저장에 실패했습니다.')">error</AppButton>
                        <AppButton size="sm" tone="warning" variant="soft" @click="toast.warning('재고가 안전재고 이하입니다.')">warning</AppButton>
                        <AppButton size="sm" tone="info" variant="soft" @click="toast.info('작업지시가 생성되었습니다.')">info</AppButton>
                    </div>
                </PageDemoSection>

                <!-- Meta -->
                <PageDemoSection class="page-demo-section" title="Meta" description="오른쪽 보조 텍스트입니다. (Figma 알림 수 9,999)">
                    <ul class="page-demo-hint-list">
                        <li><b>meta</b> : string</li>
                    </ul>

                    <AppButton size="sm" @click="toast.show({ message: '알림 표시가 되었습니다.', meta: '9,999' })">meta</AppButton>
                </PageDemoSection>

                <!-- Duration / Closable -->
                <PageDemoSection class="page-demo-section" title="Duration / Closable" description="노출 시간과 닫기 버튼(AppIconButton)입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>duration</b> : ms (기본값 2500), 0 이면 자동으로 닫히지 않음</li>
                        <li><b>closable</b> : 닫기 버튼 노출</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" @click="toast.show({ message: '5초 동안 노출됩니다.', duration: 5000 })">duration 5000</AppButton>
                        <AppButton size="sm" @click="toast.info({ message: '닫기 전까지 유지됩니다.', duration: 0, closable: true })"
                            >duration 0 + closable</AppButton
                        >
                    </div>
                </PageDemoSection>

                <!-- Action -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Action"
                    description="토스트 안의 실행 버튼(AppTextButton)입니다. 클릭하면 onAction 실행 후 닫힙니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>actionText</b> : 버튼 문구</li>
                        <li><b>onAction</b> : 클릭 시 실행 함수</li>
                    </ul>

                    <AppButton
                        size="sm"
                        tone="danger"
                        variant="soft"
                        @click="toast.error({ message: '저장에 실패했습니다.', actionText: '재시도', onAction: retry })"
                    >
                        error + action
                    </AppButton>
                </PageDemoSection>

                <!-- Placement -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Placement"
                    description="AppToastHost 의 노출 위치입니다. app.vue 에서 한 번 지정합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>bottom</b> : 하단 중앙 (기본값)</li>
                        <li><b>top</b> : 상단 중앙</li>
                        <li><b>bottom-right / top-right</b> : 우측 하단 / 우측 상단</li>
                    </ul>

                    <pre class="page-demo-output">&lt;AppToastHost placement="bottom-right" /&gt;</pre>
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
const { title, description } = useDemoI18n('toast');
const toast = useToast();

function retry() {
    toast.success('다시 저장했습니다.');
}
</script>
