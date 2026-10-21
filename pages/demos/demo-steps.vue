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
                    description="공정·결재 단계입니다. v-model(현재 index) 기준으로 이전 단계는 완료, 현재는 진행, 이후는 대기로 자동 표시됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : { title, description, status?, disabled? } 배열</li>
                        <li><b>v-model</b> : 현재 단계 index (0부터)</li>
                    </ul>

                    <AppSteps v-model="step" :items="processSteps" />
                    <div class="page-demo-row">
                        <AppButton size="sm" :disabled="step === 0" @click="step--">이전 공정</AppButton>
                        <AppButton size="sm" variant="fill" tone="primary" :disabled="step === processSteps.length - 1" @click="step++"
                            >다음 공정</AppButton
                        >
                        <span class="page-demo-output">v-model: {{ step }}</span>
                    </div>
                </PageDemoSection>

                <!-- items[].status -->
                <PageDemoSection class="page-demo-section" title="items[].status" description="특정 단계의 상태를 직접 지정합니다. (반려, 불합격 등)">
                    <ul class="page-demo-hint-list">
                        <li><b>wait</b> : 대기</li>
                        <li><b>current</b> : 진행</li>
                        <li><b>done</b> : 완료</li>
                        <li><b>error</b> : 오류 - 빨간 X</li>
                    </ul>

                    <AppSteps :model-value="2" :items="approvalSteps" />
                </PageDemoSection>

                <!-- Direction -->
                <PageDemoSection class="page-demo-section" title="Direction" description="배치 방향입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>horizontal</b> : 가로 (기본값)</li>
                        <li><b>vertical</b> : 세로</li>
                    </ul>

                    <AppSteps :model-value="1" :items="approvalSteps" direction="vertical" />
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="단계 표시 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 24px</li>
                        <li><b>md</b> : 32px (기본값)</li>
                    </ul>

                    <AppSteps :model-value="2" :items="processSteps" size="sm" />
                </PageDemoSection>

                <!-- Clickable -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Clickable"
                    description="단계를 클릭해서 이동합니다. 각 단계는 AppButton(unstyled) 으로 렌더링됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>clickable</b> : 클릭 이동 - change 이벤트</li>
                        <li><b>items[].disabled</b> : 클릭 불가 단계</li>
                    </ul>

                    <AppSteps v-model="clickStep" :items="clickSteps" clickable />
                    <p class="page-demo-output">v-model: {{ clickStep }}</p>
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
import type { AppStepItem } from '~/components/AppSteps.vue';

const { title, description } = useDemoI18n('steps');
const step = ref(2);
const clickStep = ref(0);

// ---------- temp data ----------
const processSteps: AppStepItem[] = [
    { title: '자재 투입', description: '08:10 완료' },
    { title: '가공', description: '09:40 완료' },
    { title: '검사', description: '진행 중' },
    { title: '포장' },
    { title: '출하' },
];
const approvalSteps: AppStepItem[] = [
    { title: '작성', description: '은영환' },
    { title: '검토', description: '품질팀 반려', status: 'error' },
    { title: '승인', description: '생산팀장' },
];
const clickSteps: AppStepItem[] = [{ title: '기본 정보' }, { title: '자재 선택' }, { title: '공정 설정' }, { title: '확인', disabled: true }];
</script>
