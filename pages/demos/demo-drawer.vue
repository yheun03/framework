<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- v-model:open -->
                <PageDemoSection
                    class="page-demo-section"
                    title="v-model:open"
                    description="옆에서 열리는 패널입니다. 상세 조회·빠른 등록·필터에 사용합니다. 닫기 버튼은 AppIconButton 입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>v-model:open</b> : 열림 여부 (boolean)</li>
                        <li><b>@close</b> : 닫힘</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" variant="fill" tone="primary" @click="open.basic = true">열기</AppButton>
                    </div>
                    <AppDrawer v-model:open="open.basic" title="작업지시 상세" description="WO-2610-002 · 하우징 커버 (HC-220)">
                        <AppDataTable :columns="detailColumns" :items="details" size="sm" variant="line" />
                    </AppDrawer>
                </PageDemoSection>

                <!-- Title / Description / #header -->
                <PageDemoSection class="page-demo-section" title="Title / Description / #header" description="헤더 영역입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>title</b> : 제목</li>
                        <li><b>description</b> : 제목 아래 설명</li>
                        <li><b>#header</b> : 헤더 직접 구성</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" @click="open.header = true">#header 슬롯</AppButton>
                    </div>
                    <AppDrawer v-model:open="open.header" title="커스텀 헤더">
                        <template #header>
                            <div class="page-demo-row">
                                <AppStatusLamp tone="danger" blink />
                                <strong>EQ-0102 사출기 #2</strong>
                                <AppTag variant="soft" tone="danger" label="정지" />
                            </div>
                        </template>
                        <AppTimeline :items="history" size="sm" />
                    </AppDrawer>
                </PageDemoSection>

                <!-- Placement / Width -->
                <PageDemoSection class="page-demo-section" title="Placement / Width" description="열리는 방향과 패널 너비입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>placement</b> : right (기본값) / left</li>
                        <li><b>width</b> : number(px) | string - 기본값 480</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" @click="open.left = true">left · 320</AppButton>
                        <AppButton size="sm" @click="open.wide = true">right · 800</AppButton>
                    </div>
                    <AppDrawer v-model:open="open.left" placement="left" title="상세 필터" :width="320">
                        <div class="page-demo-stack">
                            <AppChoice v-for="line in ['1라인', '2라인', '3라인']" :key="line" v-model="lineFilter[line]" :label="line" />
                        </div>
                    </AppDrawer>
                    <AppDrawer v-model:open="open.wide" title="넓은 패널" :width="800">
                        <AppDataTable :columns="detailColumns" :items="details" />
                    </AppDrawer>
                </PageDemoSection>

                <!-- #footer -->
                <PageDemoSection class="page-demo-section" title="#footer" description="하단 버튼 영역입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>#footer</b> : AppButton 배치</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" @click="open.footer = true">등록 폼</AppButton>
                    </div>
                    <AppDrawer v-model:open="open.footer" title="작업실적 등록">
                        <div class="page-demo-stack">
                            <AppInputNumber v-model="qty" label="양품 수량" size="md" />
                            <AppTextarea v-model="memo" label="비고" :rows="3" />
                        </div>
                        <template #footer>
                            <AppButton @click="open.footer = false">취소</AppButton>
                            <AppButton variant="fill" tone="primary" @click="save">저장</AppButton>
                        </template>
                    </AppDrawer>
                </PageDemoSection>

                <!-- Overlay / Close Option -->
                <PageDemoSection class="page-demo-section" title="Overlay / Close Option" description="배경과 닫기 동작입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>overlay</b> : 배경 딤 (기본값 true)</li>
                        <li><b>closeOnBackdrop</b> : 배경 클릭 시 닫기 (기본값 true)</li>
                        <li><b>closeOnEsc</b> : ESC 키로 닫기 (기본값 true)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" @click="open.noOverlay = true">overlay false</AppButton>
                        <AppButton size="sm" @click="open.locked = true">배경·ESC 로 안 닫힘</AppButton>
                    </div>
                    <AppDrawer v-model:open="open.noOverlay" title="overlay false" :overlay="false" :width="360">배경 딤 없이 열립니다.</AppDrawer>
                    <AppDrawer v-model:open="open.locked" title="닫기 버튼으로만 닫힘" :close-on-backdrop="false" :close-on-esc="false" :width="360">
                        배경 클릭이나 ESC 로 닫히지 않습니다.
                    </AppDrawer>
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

const { title, description } = useDemoI18n('drawer');
const toast = useToast();

const open = reactive({ basic: false, header: false, left: false, wide: false, footer: false, noOverlay: false, locked: false });
const lineFilter = reactive<Record<string, boolean | string | number | null>>({ '1라인': true, '2라인': false, '3라인': false });
const qty = ref(512);
const memo = ref('');

// ---------- temp data ----------
const detailColumns = [
    { key: 'label', label: '항목', align: 'left' as const, width: 120 },
    { key: 'value', label: '내용', align: 'left' as const },
];
const details = [
    { id: 1, label: '계획수량', value: '800 EA' },
    { id: 2, label: '실적수량', value: '512 EA' },
    { id: 3, label: '라인 / 설비', value: '1라인 / EQ-0101' },
    { id: 4, label: '작업기간', value: '2026-10-21 08:00 ~ 17:00' },
];
const history: AppTimelineItem[] = [
    { title: '온도 상한 초과', time: '13:42', tag: '알람', tone: 'danger' },
    { title: '가동 시작', time: '08:00', tone: 'success' },
];

function save() {
    open.footer = false;
    toast.success('저장되었습니다.');
}
</script>
