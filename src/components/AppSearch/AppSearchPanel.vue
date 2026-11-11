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
                {{ resetText ?? $t('ui.reset') }}
            </AppButton>
            <AppButton type="submit" variant="fill" tone="primary" size="sm" :loading="loading">
                <template #iconLeft><IconSearch /></template>
                {{ searchText ?? $t('ui.searchPanel.search') }}
            </AppButton>
            <AppIconButton
                v-if="collapsible"
                class="app-search-panel__toggle"
                variant="outline"
                size="sm"
                :aria-label="collapsed ? $t('ui.searchPanel.expand') : $t('ui.searchPanel.collapse')"
                :aria-expanded="!collapsed"
                @click="collapsed = !collapsed"
            >
                <IconChevronDown :class="{ 'is-open': !collapsed }" />
            </AppIconButton>
        </div>
    </form>
</template>

<script setup>
import { IconChevronDown, IconRefresh, IconSearch } from '@/components/icons';
import { toCssSize } from '@/utils/css';
import { computed, ref } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppSearchPanel - MES/ERP 목록 화면 상단 조회 조건 영역
 * <AppSearchItem label="..." :span="2"> 로 조건을 배치하고, Enter / 조회 버튼 시 search 이벤트가 발생합니다.
 */
const props = defineProps({
    /** 한 줄에 배치할 조건 수 */
    columns: { type: Number, default: 4 },
    /** AppSearchItem 라벨 너비 */
    labelWidth: { type: [Number, String], default: 80 },
    /** 접기/펼치기 사용 (접힌 상태에서는 첫 줄만 노출) */
    collapsible: { type: Boolean, default: false },
    /** 처음 접힌 상태로 시작 */
    initialCollapsed: { type: Boolean, default: true },
    /** 기본 '조회' · '초기화' (i18n ui.searchPanel.search · ui.reset) */
    searchText: { type: String, default: undefined },
    resetText: { type: String, default: undefined },
    showReset: { type: Boolean, default: true },
    /** 조회 버튼 로딩 */
    loading: { type: Boolean, default: false },
});

const emit = defineEmits(['search', 'reset']);
const collapsed = ref(props.initialCollapsed);
const panelStyle = computed(() => ({
    '--app-search-columns': String(props.columns),
    '--app-search-label-width': toCssSize(props.labelWidth),
}));
</script>
