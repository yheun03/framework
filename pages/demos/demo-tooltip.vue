<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Text / #content -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Text / #content"
                    description="말풍선 문구입니다. 강조가 필요하면 #content 슬롯에서 &lt;em&gt; 으로 감쌉니다(Figma 오렌지 강조)."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>text</b> : 문구 (string)</li>
                        <li><b>#content</b> : 문구 슬롯</li>
                        <li><b>default slot</b> : 말풍선을 띄울 대상</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTooltip text="좋아요 😀"><AppButton size="sm">text</AppButton></AppTooltip>
                        <AppTooltip>
                            <template #content><em>이 페이지를</em> 확인해 보세요</template>
                            <AppButton size="sm">#content + em</AppButton>
                        </AppTooltip>
                    </div>
                </PageDemoSection>

                <!-- Variant -->
                <PageDemoSection class="page-demo-section" title="Variant" description="말풍선 스타일입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>dark</b> : 검정 (기본값)</li>
                        <li><b>light</b> : 흰색 + 그림자</li>
                        <li><b>outline</b> : 흰색 + 라인</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTooltip
                            v-for="variant in ['dark', 'light', 'outline']"
                            :key="variant"
                            :variant="variant"
                            text="이 페이지를 확인해 보세요"
                        >
                            <AppButton size="sm">{{ variant }}</AppButton>
                        </AppTooltip>
                    </div>
                </PageDemoSection>

                <!-- Shape -->
                <PageDemoSection class="page-demo-section" title="Shape" description="모서리 형태입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>square</b> : 각진 (기본값)</li>
                        <li><b>round</b> : 4px</li>
                        <li><b>pill</b> : 완전 라운드</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTooltip v-for="shape in ['square', 'round', 'pill']" :key="shape" :shape="shape" :text="shape">
                            <AppButton size="sm" variant="soft">{{ shape }}</AppButton>
                        </AppTooltip>
                    </div>
                </PageDemoSection>

                <!-- Placement -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Placement"
                    description="대상 기준 위치입니다. 화면 밖으로 나가면 반대쪽으로 자동 전환됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>top</b> : 위 (기본값)</li>
                        <li><b>bottom</b> : 아래</li>
                        <li><b>left</b> : 왼쪽</li>
                        <li><b>right</b> : 오른쪽</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTooltip v-for="placement in ['top', 'bottom', 'left', 'right']" :key="placement" :placement="placement" :text="placement">
                            <AppButton size="sm" variant="soft">{{ placement }}</AppButton>
                        </AppTooltip>
                    </div>
                </PageDemoSection>

                <!-- Trigger -->
                <PageDemoSection class="page-demo-section" title="Trigger" description="노출 방식입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>hover</b> : 마우스 오버/포커스 (기본값)</li>
                        <li><b>click</b> : 클릭 시 열고 닫기, 바깥 클릭 시 닫힘</li>
                        <li><b>always</b> : 항상 노출 (신규 기능 안내 등)</li>
                    </ul>

                    <div class="page-demo-row" style="padding-top: 36px">
                        <AppTooltip text="hover"><AppButton size="sm">hover</AppButton></AppTooltip>
                        <AppTooltip trigger="click" text="click 으로 열렸습니다"><AppButton size="sm">click</AppButton></AppTooltip>
                        <AppTooltip trigger="always" variant="outline" text="신규 기능이 추가되었습니다"
                            ><AppTag variant="fill" tone="red" label="NEW"
                        /></AppTooltip>
                    </div>
                </PageDemoSection>

                <!-- Closable / v-model:open -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Closable / v-model:open"
                    description="닫기 버튼(AppIconButton)과 외부 열림 제어입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>closable</b> : 닫기 버튼 노출</li>
                        <li><b>v-model:open</b> : 열림 여부 제어 (boolean)</li>
                    </ul>

                    <div class="page-demo-row" style="padding-top: 36px">
                        <AppTooltip v-model:open="open" trigger="click" closable text="X 로 닫을 수 있습니다">
                            <AppButton size="sm" tone="primary" variant="outline">closable</AppButton>
                        </AppTooltip>
                        <AppButton size="sm" @click="open = !open">외부에서 토글 (open: {{ open }})</AppButton>
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
const { title, description } = useDemoI18n('tooltip');
const open = ref(false);
</script>
