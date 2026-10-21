<template>
    <form
        class="app-search-panel"
        :class="{ 'is-collapsed': collapsible && collapsed }"
        :style="panelStyle"
        role="search"
        @submit.prevent="emit('search')"
        @reset.prevent="emit('reset')"
    >
        <div class="app-search-panel__grid">
            <slot />
        </div>

        <div class="app-search-panel__actions">
            <slot name="actions" />
            <AppButton v-if="showReset" type="reset" variant="outline" tone="gray" size="sm">
                <template #iconLeft><IconRefresh /></template>
                {{ resetText }}
            </AppButton>
            <AppButton type="submit" variant="fill" tone="primary" size="sm" :loading="loading">
                <template #iconLeft><IconSearch /></template>
                {{ searchText }}
            </AppButton>
            <AppIconButton
                v-if="collapsible"
                class="app-search-panel__toggle"
                variant="outline"
                size="lg"
                :aria-label="collapsed ? '상세 조건 펼치기' : '상세 조건 접기'"
                :aria-expanded="!collapsed"
                @click="collapsed = !collapsed"
            >
                <IconChevronDown :class="{ 'is-open': !collapsed }" />
            </AppIconButton>
        </div>
    </form>
</template>

<script setup lang="ts">
import { IconChevronDown, IconRefresh, IconSearch } from '~/components/icons';
import { toCssSize } from '~/utils/css';

/**
 * AppSearchPanel - MES/ERP 목록 화면 상단 조회 조건 영역
 * <AppSearchItem label="..." :span="2"> 로 조건을 배치하고, Enter / 조회 버튼 시 search 이벤트가 발생합니다.
 */
const props = withDefaults(
    defineProps<{
        /** 한 줄에 배치할 조건 수 */
        columns?: number;
        /** AppSearchItem 라벨 너비 */
        labelWidth?: number | string;
        /** 접기/펼치기 사용 (접힌 상태에서는 첫 줄만 노출) */
        collapsible?: boolean;
        /** 처음 접힌 상태로 시작 */
        initialCollapsed?: boolean;
        searchText?: string;
        resetText?: string;
        showReset?: boolean;
        /** 조회 버튼 로딩 */
        loading?: boolean;
    }>(),
    {
        columns: 4,
        labelWidth: 80,
        collapsible: false,
        initialCollapsed: true,
        searchText: '조회',
        resetText: '초기화',
        showReset: true,
        loading: false,
    },
);

const emit = defineEmits<{ search: []; reset: [] }>();
const collapsed = ref(props.initialCollapsed);
const panelStyle = computed(() => ({
    '--app-search-columns': String(props.columns),
    '--app-search-label-width': toCssSize(props.labelWidth),
}));
</script>
