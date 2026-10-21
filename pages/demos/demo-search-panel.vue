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
                    description="목록 화면 상단 조회 조건 영역입니다. AppSearchItem 으로 조건을 배치하고, 조회·초기화는 AppButton 입니다. Enter 키로도 조회됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>@search</b> : 조회 버튼 / Enter</li>
                        <li><b>@reset</b> : 초기화 버튼</li>
                    </ul>

                    <AppSearchPanel @search="search" @reset="reset">
                        <AppSearchItem label="라인"><AppSelect v-model="form.line" :items="lines" size="xs" placeholder="전체" /></AppSearchItem>
                        <AppSearchItem label="품목"
                            ><AppInput v-model="form.keyword" size="xs" placeholder="품목코드/품목명" clearable
                        /></AppSearchItem>
                        <AppSearchItem label="상태"><AppSelect v-model="form.status" :items="statuses" size="xs" placeholder="전체" /></AppSearchItem>
                        <AppSearchItem label="작업자"><AppInput v-model="form.worker" size="xs" /></AppSearchItem>
                    </AppSearchPanel>
                    <p class="page-demo-output">{{ lastEvent }}</p>
                </PageDemoSection>

                <!-- Columns / AppSearchItem.span -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Columns / AppSearchItem.span"
                    description="한 줄에 놓을 조건 수와 조건이 차지할 칸 수입니다. 화면이 좁으면 2열 → 1열로 줄어듭니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>columns</b> : 한 줄 조건 수 (기본값 4)</li>
                        <li><b>AppSearchItem.span</b> : 차지할 칸 수 (기본값 1)</li>
                    </ul>

                    <AppSearchPanel :columns="3" @search="search" @reset="reset">
                        <AppSearchItem label="작업일자" :span="2"><AppDatePicker v-model="form.period" type="range-input" size="xs" /></AppSearchItem>
                        <AppSearchItem label="라인"><AppSelect v-model="form.line" :items="lines" size="xs" placeholder="전체" /></AppSearchItem>
                    </AppSearchPanel>
                </PageDemoSection>

                <!-- LabelWidth / required -->
                <PageDemoSection class="page-demo-section" title="LabelWidth / required" description="라벨 너비와 필수 표시입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>labelWidth</b> : 라벨 너비 (기본값 80)</li>
                        <li><b>AppSearchItem.required</b> : 라벨 옆 * 표시</li>
                    </ul>

                    <AppSearchPanel :columns="2" :label-width="120" @search="search" @reset="reset">
                        <AppSearchItem label="공장" required><AppSelect v-model="form.plant" :items="plants" size="xs" required /></AppSearchItem>
                        <AppSearchItem label="설비코드"><AppInput v-model="form.equipment" size="xs" /></AppSearchItem>
                    </AppSearchPanel>
                </PageDemoSection>

                <!-- Collapsible -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Collapsible"
                    description="조건이 많을 때 첫 줄만 보이고, 펼침 버튼(AppIconButton)으로 나머지를 엽니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>collapsible</b> : 접기/펼치기 사용</li>
                        <li><b>initialCollapsed</b> : 처음 접힌 상태 (기본값 true)</li>
                    </ul>

                    <AppSearchPanel collapsible @search="search" @reset="reset">
                        <AppSearchItem v-for="field in manyFields" :key="field" :label="field"
                            ><AppInput v-model="form.extra[field]" size="xs"
                        /></AppSearchItem>
                    </AppSearchPanel>
                </PageDemoSection>

                <!-- Loading / Button Text -->
                <PageDemoSection class="page-demo-section" title="Loading / Button Text" description="조회 버튼 로딩과 버튼 문구입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>loading</b> : 조회 버튼(AppButton) 로딩</li>
                        <li><b>searchText / resetText</b> : 버튼 문구 (기본값 조회 / 초기화)</li>
                        <li><b>showReset</b> : 초기화 버튼 노출 (기본값 true)</li>
                    </ul>

                    <AppSearchPanel :columns="2" :loading="loading" search-text="검색" :show-reset="false" @search="searchWithLoading">
                        <AppSearchItem label="LOT 번호"><AppInput v-model="form.lot" size="xs" /></AppSearchItem>
                    </AppSearchPanel>
                </PageDemoSection>

                <!-- #actions -->
                <PageDemoSection class="page-demo-section" title="#actions" description="조회 버튼 앞에 버튼을 추가합니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>#actions</b> : AppButton 배치</li>
                    </ul>

                    <AppSearchPanel :columns="2" @search="search" @reset="reset">
                        <AppSearchItem label="품목"><AppInput v-model="form.keyword" size="xs" /></AppSearchItem>
                        <template #actions>
                            <AppButton size="sm">
                                <template #iconLeft><IconFileUpload /></template>
                                엑셀
                            </AppButton>
                        </template>
                    </AppSearchPanel>
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
import { IconFileUpload } from '~/components/icons';

const { title, description } = useDemoI18n('searchPanel');
const toast = useToast();

// ---------- temp data ----------
type OptionValue = string | number | boolean | null;
const plants = [
    { value: 'P1', label: '화성 1공장' },
    { value: 'P2', label: '평택 2공장' },
];
const lines = ['1라인', '2라인', '3라인'].map((label) => ({ value: label, label }));
const statuses = ['대기', '진행', '완료'].map((label) => ({ value: label, label }));
const manyFields = ['공장', '라인', '설비', '근무조', 'LOT 번호', '작업자', '품목군', '거래처'];

const initialForm = () => ({
    period: { start: '2026-10-01', end: '2026-10-21' } as { start: string | null; end: string | null } | null,
    plant: 'P1' as OptionValue,
    line: null as OptionValue,
    status: null as OptionValue,
    keyword: '',
    worker: '',
    equipment: '',
    lot: '',
    extra: Object.fromEntries(manyFields.map((field) => [field, ''])) as Record<string, string>,
});

const form = reactive(initialForm());
const lastEvent = ref('조회 / 초기화 버튼을 눌러보세요.');
const loading = ref(false);

function search() {
    lastEvent.value = `search: ${JSON.stringify({ line: form.line, keyword: form.keyword, status: form.status })}`;
}

function reset() {
    Object.assign(form, initialForm());
    lastEvent.value = 'reset';
}

function searchWithLoading() {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
        toast.success('조회가 완료되었습니다.');
    }, 800);
}
</script>
