var e=`<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <div class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">
                        단일/다중 이미지 업로드 필드 컴포넌트입니다. multiple, disabled, allowDrop, readMode, maxSize 등의 속성을 확인할 수 있습니다.
                    </p>
                </header>

                <PageDemoSection
                    class="page-demo-section"
                    title="Basic"
                    description="가장 기본적인 이미지 업로드 예시입니다. 업로드 후 각 항목의 미리보기 버튼으로 이미지 뷰어 모달을 열 수 있습니다."
                >
                    <div class="page-demo-row">
                        <AppUploadImage v-model="basic.imageUrl" />

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">단일 이미지 업로드용 기본 예시입니다.</div>

                            <div class="page-demo-actions">
                                <AppButton size="sm" variant="outline" @click="handleBasicSampleSet"> 샘플 이미지 </AppButton>

                                <AppTextButton size="sm" :disabled="!basic.imageUrl" @click="handleBasicClear"> 값 비우기 </AppTextButton>
                            </div>
                        </div>
                    </div>
                </PageDemoSection>

                <PageDemoSection class="page-demo-section" title="State &amp; Control" description="disabled 상태와 외부 제어 예시입니다.">
                    <div class="page-demo-row">
                        <AppUploadImage v-model="state.imageUrl" :disabled="state.disabled" />

                        <div class="page-demo-stack">
                            <div class="page-demo-actions">
                                <AppButton size="sm" variant="outline" @click="handleStateSampleSet"> 샘플 이미지 </AppButton>

                                <AppTextButton size="sm" @click="handleDisabledToggle"> disabled: {{ state.disabled ? 'ON' : 'OFF' }} </AppTextButton>

                                <AppTextButton size="sm" :disabled="!state.imageUrl" @click="handleStateClear"> 값 비우기 </AppTextButton>
                            </div>

                            <div class="page-demo-hint"><strong>disabled</strong> 속성으로 선택/드롭 동작을 막을 수 있습니다.</div>
                        </div>
                    </div>
                </PageDemoSection>

                <PageDemoSection
                    class="page-demo-section"
                    title="Multiple"
                    description="여러 이미지를 업로드하고 최대 개수 제한을 적용하는 예시입니다."
                >
                    <div class="page-demo-row">
                        <AppUploadImage v-model="multiple.images" multiple :max-count="3" />

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">최대 3개까지 업로드할 수 있습니다.</div>

                            <div class="page-demo-actions">
                                <AppButton size="sm" variant="outline" @click="handleMultipleSamplesSet"> 샘플 이미지 </AppButton>

                                <AppTextButton size="sm" :disabled="!multiple.images.length" @click="handleMultipleClear"> 값 비우기 </AppTextButton>
                            </div>
                        </div>
                    </div>
                </PageDemoSection>

                <PageDemoSection
                    class="page-demo-section"
                    title="Read Mode"
                    description='&lt;code>readMode="dataUrl"&lt;/code> 와 &lt;code>readMode="objectUrl"&lt;/code> 차이를 확인합니다.'
                >
                    <div class="page-demo-grid">
                        <div class="page-demo-stack">
                            <AppUploadImage v-model="readMode.dataUrlImage" read-mode="dataUrl" />

                            <div class="page-demo-hint"><strong>dataUrl</strong>은 문자열 데이터로 읽어 바로 바인딩할 때 사용합니다.</div>
                        </div>

                        <div class="page-demo-stack">
                            <AppUploadImage v-model="readMode.objectUrlImage" read-mode="objectUrl" />

                            <div class="page-demo-hint"><strong>objectUrl</strong>은 브라우저 URL을 만들어 미리보기할 때 유리합니다.</div>
                        </div>
                    </div>
                </PageDemoSection>

                <PageDemoSection
                    class="page-demo-section"
                    title="Drag &amp; Drop"
                    description="&lt;code>allowDrop&lt;/code> 속성으로 드래그 앤 드롭 허용 여부를 제어합니다."
                >
                    <div class="page-demo-grid">
                        <div class="page-demo-stack">
                            <AppUploadImage v-model="drop.enabled" :allow-drop="true" />

                            <div class="page-demo-hint">드롭 가능 상태입니다.</div>
                        </div>

                        <div class="page-demo-stack">
                            <AppUploadImage v-model="drop.disabled" :allow-drop="false" />

                            <div class="page-demo-hint">드롭 비허용 상태입니다.</div>
                        </div>
                    </div>
                </PageDemoSection>

                <PageDemoSection class="page-demo-section" title="File Rules" description="파일 형식과 최대 용량 제한 예시입니다.">
                    <div class="page-demo-grid">
                        <div class="page-demo-stack">
                            <AppUploadImage v-model="rules.imageOnly" accept="image/png,image/jpeg,image/webp" />

                            <div class="page-demo-hint"><strong>accept</strong> 속성으로 허용 파일 형식을 제한합니다.</div>
                        </div>

                        <div class="page-demo-stack">
                            <AppUploadImage v-model="rules.maxSizeImage" :max-size="rules.maxSize" />

                            <div class="page-demo-hint"><strong>maxSize</strong> 속성으로 최대 용량을 제한합니다.</div>
                        </div>
                    </div>
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
import { sampleImage } from '@/utils/sampleImage';
import { reactive } from 'vue';
import { useDemoI18n } from '@/composables/useI18nText';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';
import AppUploadImage from '@/components/AppUpload/AppUploadImage.vue';
import PageDemoPropsSummary from '@/components/PageDemo/content/PageDemoPropsSummary.vue';
import PageDemoSection from '@/components/PageDemoSection.vue';

const { title } = useDemoI18n('uploadImage');

const basic = reactive({
    imageUrl: null,
});

const state = reactive({
    imageUrl: null,
    disabled: false,
});

const multiple = reactive({
    images: [],
});

const readMode = reactive({
    dataUrlImage: null,
    objectUrlImage: null,
});

const drop = reactive({
    enabled: null,
    disabled: null,
});

const rules = reactive({
    imageOnly: null,
    maxSizeImage: null,
    maxSize: 2 * 1024 * 1024,
});

function toSampleImage(url, name = 'sample-image') {
    return {
        id: \`sample-\${name}\`,
        name,
        type: 'image/svg+xml',
        size: 0,
        url,
        alt: name,
        source: 'sample',
    };
}

function handleBasicSampleSet() {
    basic.imageUrl = toSampleImage(sampleImage(11, 240), 'basic-sample');
}

function handleStateSampleSet() {
    state.imageUrl = toSampleImage(sampleImage(12, 240), 'state-sample');
}

function handleMultipleSamplesSet() {
    multiple.images = [
        toSampleImage(sampleImage(21, 240), 'multiple-sample-1'),
        toSampleImage(sampleImage(22, 240), 'multiple-sample-2'),
        toSampleImage(sampleImage(23, 240), 'multiple-sample-3'),
    ];
}

function handleBasicClear() {
    basic.imageUrl = null;
}

function handleStateClear() {
    state.imageUrl = null;
}

function handleMultipleClear() {
    multiple.images = [];
}

function handleDisabledToggle() {
    state.disabled = !state.disabled;
}
<\/script>

<!-- demo 공통 스타일: assets/styles/pages/_demo.scss -->
`;export{e as default};