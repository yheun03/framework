var e=`<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <div class="page-demo-main">
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

                <!-- VARIANT -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Variant"
                    description="Figma 페이지네이션 A·B타입 - text(현재 페이지 굵게, 기본값) / outline(현재 페이지 원형 테두리). 크기는 한 가지(32px)입니다."
                >
                    <div class="page-demo-stack">
                        <template v-for="variant in ['text', 'outline']" :key="variant">
                            <div class="page-demo-hint">variant = "{{ variant }}"</div>
                            <AppPagination
                                v-model:page="variantPage[variant]"
                                :page-size="10"
                                :total="300"
                                :variant="variant"
                                :show-total="false"
                                :show-page-size="false"
                            />
                        </template>
                    </div>
                </PageDemoSection>

                <!-- BLOCK / ELLIPSIS -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Block / Ellipsis"
                    description="기본은 blockSize(10)개씩 묶어 « ‹ › » 로 이동합니다(A·B타입). ellipsis 를 켜면 1 … 현재 주변(siblingCount) … 마지막 + ‹ › 로 표시합니다(C타입)."
                >
                    <div class="page-demo-stack">
                        <div class="page-demo-hint">:block-size="5"</div>
                        <AppPagination
                            v-model:page="blockPage"
                            :page-size="10"
                            :total="300"
                            :block-size="5"
                            :show-total="false"
                            :show-page-size="false"
                        />
                        <div class="page-demo-hint">ellipsis (siblingCount = 2, 기본값)</div>
                        <AppPagination
                            v-model:page="ellipsisPage"
                            :page-size="10"
                            :total="300"
                            ellipsis
                            :show-total="false"
                            :show-page-size="false"
                        />
                        <div class="page-demo-hint">ellipsis :sibling-count="1"</div>
                        <AppPagination
                            v-model:page="ellipsisPage"
                            :page-size="10"
                            :total="300"
                            ellipsis
                            :sibling-count="1"
                            :show-total="false"
                            :show-page-size="false"
                        />
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
            </div>

            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useDemoI18n } from '@/composables/useI18nText';
import AppPagination from '@/components/AppPagination.vue';
import PageDemoPropsSummary from '@/components/PageDemo/content/PageDemoPropsSummary.vue';
import PageDemoSection from '@/components/PageDemoSection.vue';

const { title, description } = useDemoI18n('pagination');

const basicPage = ref(1);
const basicPageSize = ref(10);
const basicTotal = ref(128);

const pageSizePage = ref(1);
const pageSize = ref(5);
const pageSizeTotal = ref(83);

const variantPage = reactive({ text: 11, outline: 11 });
const blockPage = ref(1);
const ellipsisPage = ref(11);

const simplePage = ref(3);
const simplePageSize = ref(10);
const simpleTotal = ref(95);

const disabledPage = ref(2);
const disabledPageSize = ref(10);
const disabledTotal = ref(42);
<\/script>
`;export{e as default};