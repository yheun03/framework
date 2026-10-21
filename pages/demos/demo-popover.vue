<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Basic -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Basic"
                    description="Figma 노출 레이어 - 대상 근처에 정보 레이어를 노출합니다. 딤(배경) 없이 표시됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>#trigger</b> : 레이어를 여는 요소 슬롯</li>
                        <li><b>default slot</b> : 레이어 내용</li>
                        <li><b>title</b> : 레이어 제목</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppPopover title="추가 배송비">
                            <template #trigger><AppButton size="sm">클릭해서 열기</AppButton></template>
                            <div class="app-popover__box">제주 : 3,000원<br />도서지역 : 3,000원</div>
                            <ul class="demo-popover-list">
                                <li v-for="note in notes" :key="note">{{ note }}</li>
                            </ul>
                        </AppPopover>
                    </div>
                </PageDemoSection>

                <!-- Trigger -->
                <PageDemoSection class="page-demo-section" title="Trigger" description="노출 방식입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>click</b> : 클릭 시 열고 닫기, 바깥 클릭/ESC 시 닫힘 (기본값)</li>
                        <li><b>hover</b> : 마우스 오버 시 노출, 레이어 위로 이동해도 유지</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppPopover trigger="click" title="click"
                            ><template #trigger><AppButton size="sm">click</AppButton></template
                            >클릭으로 열렸습니다.</AppPopover
                        >
                        <AppPopover trigger="hover" title="설비 EQ-0102" :closable="false" :width="240">
                            <template #trigger><AppStatusLamp tone="danger" blink label="정지 (hover)" /></template>
                            <p>정지 사유: 금형 교체</p>
                            <p>정지 시각: 2026-10-21 13:42</p>
                        </AppPopover>
                    </div>
                </PageDemoSection>

                <!-- Placement -->
                <PageDemoSection class="page-demo-section" title="Placement" description="대상 기준 위치입니다. 화면 밖으로 나가면 자동 전환됩니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>bottom</b> : 아래 (기본값)</li>
                        <li><b>top / left / right</b> : 위 / 왼쪽 / 오른쪽</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppPopover
                            v-for="placement in ['top', 'bottom', 'left', 'right']"
                            :key="placement"
                            :placement="placement"
                            :title="placement"
                            :width="200"
                        >
                            <template #trigger
                                ><AppButton size="sm" variant="soft">{{ placement }}</AppButton></template
                            >
                            placement = {{ placement }}
                        </AppPopover>
                    </div>
                </PageDemoSection>

                <!-- Width / Closable -->
                <PageDemoSection class="page-demo-section" title="Width / Closable" description="레이어 너비와 닫기 버튼(AppIconButton) 노출입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>width</b> : number(px) | string (기본값 320)</li>
                        <li><b>closable</b> : 닫기 버튼 (기본값 true)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppPopover title="width 200" :width="200"
                            ><template #trigger><AppButton size="sm">width 200</AppButton></template
                            >좁은 레이어</AppPopover
                        >
                        <AppPopover title="closable false" :closable="false"
                            ><template #trigger><AppButton size="sm">closable false</AppButton></template
                            >바깥을 클릭하면 닫힙니다.</AppPopover
                        >
                    </div>
                </PageDemoSection>

                <!-- v-model:open -->
                <PageDemoSection class="page-demo-section" title="v-model:open" description="외부 상태로 열림 여부를 제어합니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>v-model:open</b> : boolean</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppPopover v-model:open="open" title="외부 제어" placement="right">
                            <template #trigger
                                ><AppButton size="sm" variant="outline">open: {{ open }}</AppButton></template
                            >
                            v-model:open 으로 제어되는 레이어입니다.
                        </AppPopover>
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
const { title, description } = useDemoI18n('popover');
const open = ref(false);

// temp data
const notes = ['쇼핑백은 최대 100개의 상품을 담을 수 있고, 최대 보관기간은 30일입니다.', '판매 종료된 상품은 14일 이후 자동삭제 됩니다.'];
</script>

<style scoped lang="scss">
.demo-popover-list {
    margin: 12px 0 0;
    padding-left: 14px;
    list-style: disc;
}
</style>
