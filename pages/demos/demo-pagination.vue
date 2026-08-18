<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- BASIC -->
                <PageDemoSection class="page-demo-section" title="Basic" description="page, pageSize, total을 사용하는 기본 페이지네이션입니다.">
                    <AppPagination v-model:page="basicPage" v-model:page-size="basicPageSize" :total="basicTotal" />
                </PageDemoSection>

                <!-- PAGE SIZE -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Page Size Options"
                    description="pageSizeOptions로 페이지 크기 선택 목록을 변경합니다."
                >
                    <AppPagination
                        v-model:page="pageSizePage"
                        v-model:page-size="pageSize"
                        :total="pageSizeTotal"
                        :page-size-options="[5, 10, 30, 50]"
                    />
                </PageDemoSection>

                <!-- SIBLING COUNT -->
                <PageDemoSection class="page-demo-section" title="Sibling Count" description="현재 페이지 주변에 노출할 페이지 개수를 조절합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">siblingCount = 1</div>

                            <AppPagination
                                v-model:page="siblingOnePage"
                                v-model:page-size="siblingPageSize"
                                :total="siblingTotal"
                                :sibling-count="1"
                                :show-page-size="false"
                            />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">siblingCount = 2</div>

                            <AppPagination
                                v-model:page="siblingTwoPage"
                                v-model:page-size="siblingPageSize"
                                :total="siblingTotal"
                                :sibling-count="2"
                                :show-page-size="false"
                            />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- SIZE -->
                <PageDemoSection class="page-demo-section" title="Size" description="sm / md 크기를 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "sm"</div>

                            <AppPagination
                                v-model:page="smallPage"
                                v-model:page-size="smallPageSize"
                                :total="smallTotal"
                                size="sm"
                                :show-page-size="false"
                            />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "md"</div>

                            <AppPagination
                                v-model:page="mediumPage"
                                v-model:page-size="mediumPageSize"
                                :total="mediumTotal"
                                size="md"
                                :show-page-size="false"
                            />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- HIDE OPTIONS -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Hide Total / Page Size"
                    description="showTotal, showPageSize 옵션으로 보조 영역을 숨길 수 있습니다."
                >
                    <AppPagination
                        v-model:page="simplePage"
                        v-model:page-size="simplePageSize"
                        :total="simpleTotal"
                        :show-total="false"
                        :show-page-size="false"
                    />
                </PageDemoSection>

                <!-- DISABLED -->
                <PageDemoSection class="page-demo-section" title="Disabled" description="disabled 상태에서는 페이지를 변경할 수 없습니다.">
                    <AppPagination v-model:page="disabledPage" v-model:page-size="disabledPageSize" :total="disabledTotal" disabled />
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
const { title, description } = useDemoI18n('pagination');

const basicPage = ref(1);
const basicPageSize = ref(10);
const basicTotal = ref(128);

const pageSizePage = ref(1);
const pageSize = ref(5);
const pageSizeTotal = ref(83);

const siblingOnePage = ref(8);
const siblingTwoPage = ref(8);
const siblingPageSize = ref(10);
const siblingTotal = ref(230);

const smallPage = ref(1);
const smallPageSize = ref(10);
const smallTotal = ref(80);

const mediumPage = ref(1);
const mediumPageSize = ref(10);
const mediumTotal = ref(80);

const simplePage = ref(3);
const simplePageSize = ref(10);
const simpleTotal = ref(95);

const disabledPage = ref(2);
const disabledPageSize = ref(10);
const disabledTotal = ref(42);
</script>
