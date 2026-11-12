<template>
    <template v-if="sourceFile">
        <AppIconButton class="route-tabs__action" aria-label="이 화면 소스 코드 보기" size="xs" :icon-size="16" @click="openViewer">
            <IconCode />
        </AppIconButton>

        <AppDrawer v-model:open="isOpen" title="소스 코드" :description="sourceFile" :width="760">
            <div class="source-viewer">
                <div class="source-viewer__toolbar">
                    <span class="source-viewer__meta">{{ lineCount }}줄 · 이 파일을 복사해 src/views/ 에 넣으면 같은 화면이 됩니다.</span>
                    <AppButton size="xs" variant="outline" :disabled="!source" @click="copySource">
                        <template #iconLeft><IconCopy /></template>
                        전체 복사
                    </AppButton>
                </div>
                <AppSpinner v-if="loading" size="sm" />
                <pre v-else class="source-viewer__code" tabindex="0" :aria-label="`${sourceFile} 소스 코드`"><code>{{ source }}</code></pre>
            </div>
        </AppDrawer>
    </template>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IconCode, IconCopy } from '@/components/icons';
import { projectConfig as project } from '@/project.config';
import { useToast } from '@/composables/useToast';
import { toRoutePath } from '@/router/routePath';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDrawer from '@/components/AppDrawer.vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';
import AppSpinner from '@/components/AppSpinner.vue';

/**
 * LayoutSourceViewer - 현재 화면(.vue)의 소스 코드를 드로어로 보여줍니다.
 * - project.config.js 의 showSourceViewer 가 true 일 때만 보입니다. (프레임워크 데모용, 실제 프로젝트는 false)
 * - 파일은 버튼을 눌렀을 때만 불러옵니다. (?raw, 화면별 분리 로딩)
 */
const sourceModules = import.meta.glob('@/views/**/*.vue', { query: '?raw', import: 'default' });
const sourceByPath = Object.fromEntries(
    Object.entries(sourceModules).map(([file, load]) => [toRoutePath(file), { file: file.replace(/^\//, ''), load }]),
);

const route = useRoute();
const toast = useToast();

const isOpen = ref(false);
const loading = ref(false);
const source = ref('');

// 동적 주소(/orders/:id)도 찾을 수 있도록 실제 주소 대신 라우트 정의 경로로 찾습니다.
const entry = computed(() => (project.showSourceViewer ? sourceByPath[route.matched.at(-1)?.path ?? route.path] : null));
const sourceFile = computed(() => entry.value?.file ?? '');
const lineCount = computed(() => (source.value ? source.value.split('\n').length : 0));

async function openViewer() {
    isOpen.value = true;
    if (source.value || !entry.value) return;
    loading.value = true;
    try {
        source.value = await entry.value.load();
    } finally {
        loading.value = false;
    }
}

async function copySource() {
    try {
        await navigator.clipboard.writeText(source.value);
        toast.success('소스 코드를 복사했습니다.');
    } catch {
        toast.error('복사하지 못했습니다. 코드를 직접 선택해 복사하세요.');
    }
}

// 화면이 바뀌면 이전 소스를 비웁니다.
watch(
    () => route.path,
    () => {
        source.value = '';
        isOpen.value = false;
    },
);
</script>
