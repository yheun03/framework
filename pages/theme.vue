<template>
    <div class="page-demo theme-page">
        <main class="page-demo-main">
            <header class="page-demo__header">
                <h1 class="page-demo__title">{{ locale === 'ko' ? '색상 테마' : 'Color theme' }}</h1>
                <p class="page-demo__desc">
                    {{
                        locale === 'ko'
                            ? '라이트와 다크 모드의 컴포넌트 및 레이아웃 색상을 각각 변경합니다. 변경값은 현재 탭의 세션에 저장됩니다.'
                            : 'Customize component and layout colors separately for light and dark modes. Changes are saved for this tab session.'
                    }}
                </p>
            </header>

            <section class="page-demo-card theme-page__toolbar">
                <div class="theme-page__toolbar-top">
                    <div>
                        <strong>{{ locale === 'ko' ? '편집 모드' : 'Editing mode' }}</strong>
                        <span>{{ locale === 'ko' ? '선택한 모드를 바로 미리봅니다.' : 'Preview the selected mode instantly.' }}</span>
                    </div>
                    <div class="theme-page__mode-switch" role="group" :aria-label="locale === 'ko' ? '편집할 모드' : 'Mode to edit'">
                        <button type="button" :class="{ 'is-active': theme === 'light' }" @click="handleThemeChange('light')">
                            <span aria-hidden="true">☀</span>{{ locale === 'ko' ? '라이트' : 'Light' }}
                        </button>
                        <button type="button" :class="{ 'is-active': theme === 'dark' }" @click="handleThemeChange('dark')">
                            <span aria-hidden="true">●</span>{{ locale === 'ko' ? '다크' : 'Dark' }}
                        </button>
                    </div>
                    <div class="theme-page__change-status" aria-live="polite">
                        <strong>{{ changedCount }}</strong>
                        <span>{{ locale === 'ko' ? '개 변경됨' : 'changed' }}</span>
                    </div>
                    <AppButton size="sm" variant="outline" tone="gray" :disabled="changedCount === 0" @click="preferences.resetThemeColors()">
                        {{ locale === 'ko' ? '현재 모드 초기화' : 'Reset mode' }}
                    </AppButton>
                </div>

                <div class="theme-page__toolbar-bottom">
                    <label class="theme-page__search">
                        <span aria-hidden="true">⌕</span>
                        <input
                            v-model.trim="searchQuery"
                            type="search"
                            :placeholder="locale === 'ko' ? '색상명 또는 CSS 변수 검색' : 'Search color or CSS variable'"
                        />
                        <button
                            v-if="searchQuery"
                            type="button"
                            :aria-label="locale === 'ko' ? '검색어 지우기' : 'Clear search'"
                            @click="searchQuery = ''"
                        >
                            ×
                        </button>
                    </label>
                    <div class="theme-page__filters" role="group" :aria-label="locale === 'ko' ? '색상 범위' : 'Color scope'">
                        <button
                            v-for="filter in filters"
                            :key="filter.value"
                            type="button"
                            :class="{ 'is-active': activeFilter === filter.value }"
                            @click="activeFilter = filter.value"
                        >
                            {{ locale === 'ko' ? filter.label : filter.labelEn }}
                            <span>{{ filterCount(filter.value) }}</span>
                        </button>
                    </div>
                </div>
            </section>

            <section class="page-demo-card theme-page__preview">
                <div class="theme-page__preview-header">
                    <div>
                        <h2 class="page-demo-card__title">{{ locale === 'ko' ? '실시간 미리보기' : 'Live preview' }}</h2>
                        <p>
                            {{
                                locale === 'ko'
                                    ? '색상을 바꾸면 실제 컴포넌트에 즉시 반영됩니다.'
                                    : 'Changes are applied to real components instantly.'
                            }}
                        </p>
                    </div>
                    <span>{{
                        theme === 'light' ? (locale === 'ko' ? '라이트 모드' : 'Light mode') : locale === 'ko' ? '다크 모드' : 'Dark mode'
                    }}</span>
                </div>
                <div class="theme-page__preview-body">
                    <div class="theme-page__preview-panel">
                        <strong>{{ locale === 'ko' ? '프로젝트 현황' : 'Project overview' }}</strong>
                        <span>{{ locale === 'ko' ? '선택한 테마가 적용된 화면 예시입니다.' : 'A sample screen using the selected theme.' }}</span>
                        <div class="theme-page__preview-actions">
                            <AppButton size="sm" variant="fill" tone="primary">{{ locale === 'ko' ? '저장' : 'Save' }}</AppButton>
                            <AppButton size="sm" variant="outline" tone="gray">{{ locale === 'ko' ? '취소' : 'Cancel' }}</AppButton>
                        </div>
                    </div>
                    <div class="theme-page__preview-field">
                        <span>{{ locale === 'ko' ? '담당자' : 'Owner' }}</span>
                        <div>{{ locale === 'ko' ? '홍길동' : 'Alex Kim' }}</div>
                    </div>
                    <div class="theme-page__preview-status">
                        <span class="is-success">{{ locale === 'ko' ? '완료' : 'Complete' }}</span>
                        <span class="is-warning">{{ locale === 'ko' ? '대기' : 'Pending' }}</span>
                        <span class="is-error">{{ locale === 'ko' ? '오류' : 'Error' }}</span>
                    </div>
                </div>
            </section>

            <section v-for="group in visibleColorGroups" :key="group.title" class="page-demo-card theme-page__group">
                <div class="theme-page__group-header">
                    <div>
                        <h2 class="page-demo-card__title">{{ locale === 'ko' ? group.title : group.titleEn }}</h2>
                        <p>{{ group.items.length }} {{ locale === 'ko' ? '개 색상' : 'colors' }}</p>
                    </div>
                </div>
                <div class="theme-page__colors">
                    <label v-for="item in group.items" :key="item.name" class="theme-page__color">
                        <span class="theme-page__swatch" :style="{ background: `var(--theme-${item.name})` }">
                            <input
                                type="color"
                                :value="pickerColor(item.name)"
                                :aria-label="`${item.label} 색상 선택`"
                                @input="handleColorChange(item.name, $event)"
                            />
                        </span>
                        <span class="theme-page__color-info">
                            <strong>{{ locale === 'ko' ? item.label : item.labelEn }}</strong>
                            <small>--theme-{{ item.name }}</small>
                        </span>
                        <input
                            class="theme-page__hex"
                            type="text"
                            maxlength="7"
                            spellcheck="false"
                            :value="pickerColor(item.name)"
                            :aria-label="`${item.label} HEX 색상`"
                            @input="handleHexInput(item.name, $event)"
                            @blur="handleHexBlur(item.name, $event)"
                        />
                        <button
                            v-if="themeColors[item.name]"
                            class="theme-page__reset"
                            type="button"
                            :aria-label="`${item.label} 기본값으로 복원`"
                            :title="locale === 'ko' ? '기본값으로 복원' : 'Restore default'"
                            @click="preferences.setThemeColor(item.name, null)"
                        >
                            ↺
                        </button>
                    </label>
                </div>
            </section>

            <header v-if="showComponentSection && visibleComponentColorGroups.length" class="theme-page__section-header">
                <div>
                    <h2>{{ locale === 'ko' ? '컴포넌트 색상' : 'Component colors' }}</h2>
                    <p>
                        {{
                            locale === 'ko'
                                ? '같은 색상 계열이나 속성별로 묶어서 비교하며 수정할 수 있습니다.'
                                : 'Compare and edit colors grouped by color family or property.'
                        }}
                    </p>
                </div>
                <div
                    class="theme-page__group-mode"
                    role="group"
                    :aria-label="locale === 'ko' ? '컴포넌트 색상 그룹 기준' : 'Component color grouping'"
                >
                    <span>{{ locale === 'ko' ? '그룹 기준' : 'Group by' }}</span>
                    <button type="button" :class="{ 'is-active': componentGroupMode === 'tone' }" @click="componentGroupMode = 'tone'">
                        {{ locale === 'ko' ? '색상 계열' : 'Color family' }}
                    </button>
                    <button type="button" :class="{ 'is-active': componentGroupMode === 'property' }" @click="componentGroupMode = 'property'">
                        {{ locale === 'ko' ? '속성' : 'Property' }}
                    </button>
                </div>
            </header>

            <details
                v-for="group in visibleComponentColorGroups"
                :key="group.key"
                class="page-demo-card theme-page__component"
                :open="Boolean(searchQuery) || activeFilter === 'changed'"
            >
                <summary class="theme-page__component-summary">
                    <strong>{{ locale === 'ko' ? group.title : group.titleEn }}</strong>
                    <span>{{ group.items.length }}</span>
                </summary>

                <div class="theme-page__component-body">
                    <section v-for="itemGroup in group.itemGroups" :key="itemGroup.key" class="theme-page__token-group">
                        <header class="theme-page__token-group-header">
                            <span
                                class="theme-page__token-dot"
                                :style="itemGroup.previewColor ? { background: itemGroup.previewColor } : undefined"
                            />
                            <h3>{{ itemGroup.label }}</h3>
                            <span>{{ itemGroup.items.length }}</span>
                        </header>
                        <div class="theme-page__colors">
                            <label v-for="item in itemGroup.items" :key="item.name" class="theme-page__color">
                                <span class="theme-page__swatch" :style="{ background: `var(${themeVariable(item.name)})` }">
                                    <input
                                        type="color"
                                        :value="pickerColor(item.name)"
                                        :aria-label="`${item.name} 색상 선택`"
                                        @input="handleColorChange(item.name, $event)"
                                    />
                                </span>
                                <span class="theme-page__color-info">
                                    <strong>{{ componentColorLabel(item.name, itemGroup.key) }}</strong>
                                    <small>{{ themeVariable(item.name) }}</small>
                                </span>
                                <input
                                    class="theme-page__hex"
                                    type="text"
                                    maxlength="7"
                                    spellcheck="false"
                                    :value="pickerColor(item.name)"
                                    :aria-label="`${item.name} HEX 색상`"
                                    @input="handleHexInput(item.name, $event)"
                                    @blur="handleHexBlur(item.name, $event)"
                                />
                                <button
                                    v-if="themeColors[item.name]"
                                    class="theme-page__reset"
                                    type="button"
                                    :aria-label="`${item.name} 기본값으로 복원`"
                                    :title="locale === 'ko' ? '기본값으로 복원' : 'Restore default'"
                                    @click="preferences.setThemeColor(item.name, null)"
                                >
                                    ↺
                                </button>
                            </label>
                        </div>
                    </section>
                </div>
            </details>

            <div v-if="!visibleColorGroups.length && !visibleComponentColorGroups.length" class="page-demo-card theme-page__empty">
                <strong>{{ locale === 'ko' ? '검색 결과가 없습니다.' : 'No colors found.' }}</strong>
                <p>{{ locale === 'ko' ? '검색어를 바꾸거나 다른 필터를 선택해 주세요.' : 'Try another search or filter.' }}</p>
                <AppButton size="sm" variant="outline" tone="gray" @click="clearFilters">
                    {{ locale === 'ko' ? '필터 초기화' : 'Clear filters' }}
                </AppButton>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { themeColorNames, usePreferencesStore, type AppTheme, type ThemeColorName } from '~/stores/preferences';

const preferences = usePreferencesStore();
const project = useProjectConfig();
const { locale, theme, themeColors } = storeToRefs(preferences);
const defaultColors = ref<Record<string, string>>({});
const searchQuery = ref('');
const activeFilter = ref<'all' | 'foundation' | 'component' | 'changed'>('all');
const componentGroupMode = ref<'tone' | 'property'>('tone');

const filters = [
    { value: 'all', label: '전체', labelEn: 'All' },
    { value: 'foundation', label: '기본 색상', labelEn: 'Foundation' },
    { value: 'component', label: '컴포넌트', labelEn: 'Components' },
    { value: 'changed', label: '변경됨', labelEn: 'Changed' },
] as const;

const componentDefinitions = [
    ['button', '버튼', 'Button'],
    ['icon-button', '아이콘 버튼', 'Icon Button'],
    ['checkbox', '체크박스 · 라디오 · 칩', 'Checkbox · Radio · Chip'],
    ['date-picker', '날짜 선택', 'Date Picker'],
    ['form-field', '폼 필드', 'Form Field'],
    ['input', '입력창', 'Input'],
    ['select', '셀렉트', 'Select'],
    ['textarea', '텍스트 영역', 'Textarea'],
    ['upload-file', '파일 업로드', 'File Upload'],
    ['upload-image', '이미지 업로드', 'Image Upload'],
    ['accordion', '아코디언', 'Accordion'],
    ['ag-grid', 'AG Grid', 'AG Grid'],
    ['grid-search', '그리드 검색', 'Grid Search'],
    ['chart', '차트', 'Chart'],
    ['gauge', '게이지', 'Gauge'],
    ['modal', '모달', 'Modal'],
    ['pagination', '페이지네이션', 'Pagination'],
    ['progress', '프로그레스', 'Progress'],
    ['section', '섹션', 'Section'],
    ['table', '테이블', 'Table'],
    ['tabs', '탭', 'Tabs'],
    ['layout', '레이아웃', 'Layout'],
    ['lnb', '사이드 메뉴', 'LNB'],
    ['page-tabs', '페이지 탭', 'Page Tabs'],
    ['responsive-layout', '반응형 레이아웃', 'Responsive Layout'],
    ['workspace-pane', '워크스페이스 패널', 'Workspace Pane'],
] as const;

const componentColorNames = ref<ThemeColorName[]>([]);
const foundationColorNames = new Set<string>(themeColorNames);

const colorGroups = [
    {
        title: '브랜드 색상',
        titleEn: 'Brand colors',
        items: [
            { name: 'primary', label: '기본 색상', labelEn: 'Primary' },
            { name: 'secondary', label: '보조 색상', labelEn: 'Secondary' },
            { name: 'tertiary', label: '강조 색상', labelEn: 'Tertiary' },
            ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => ({
                name: `primary-${shade}`,
                label: `기본 ${shade}`,
                labelEn: `Primary ${shade}`,
            })),
        ],
    },
    {
        title: '중립 및 상태 색상',
        titleEn: 'Neutral and status colors',
        items: [
            ...[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => ({
                name: `gray-${shade}`,
                label: `회색 ${shade}`,
                labelEn: `Gray ${shade}`,
            })),
            { name: 'status-success', label: '성공', labelEn: 'Success' },
            { name: 'status-warning', label: '경고', labelEn: 'Warning' },
            { name: 'status-error', label: '오류', labelEn: 'Error' },
            { name: 'status-info', label: '정보', labelEn: 'Info' },
        ],
    },
    {
        title: '레이아웃 색상',
        titleEn: 'Layout colors',
        items: [
            { name: 'header-background', label: '헤더 배경', labelEn: 'Header background' },
            { name: 'header-hover-color', label: '헤더 호버', labelEn: 'Header hover' },
            { name: 'header-active-color', label: '헤더 활성', labelEn: 'Header active' },
            { name: 'header-accent-color', label: '헤더 강조', labelEn: 'Header accent' },
            { name: 'lnb-background', label: '사이드 메뉴 배경', labelEn: 'Sidebar background' },
            { name: 'lnb-hover-color', label: '사이드 메뉴 호버', labelEn: 'Sidebar hover' },
            { name: 'lnb-active-color', label: '사이드 메뉴 활성', labelEn: 'Sidebar active' },
            { name: 'page-navigator-background', label: '페이지 탭 배경', labelEn: 'Page tabs background' },
            { name: 'page-navigator-hover-color', label: '페이지 탭 호버', labelEn: 'Page tabs hover' },
            { name: 'page-navigator-active-color', label: '페이지 탭 활성', labelEn: 'Page tabs active' },
            { name: 'page-navigator-accent-color', label: '페이지 탭 강조', labelEn: 'Page tabs accent' },
            { name: 'page-navigator-control-active-color', label: '페이지 탭 컨트롤', labelEn: 'Page tabs control' },
        ],
    },
    {
        title: '표면 및 경계선',
        titleEn: 'Surfaces and borders',
        items: [
            ...[
                ['color-01-white', '흰색', 'White'],
                ['color-02-black', '검정', 'Black'],
                ['color-03-gray', '본문 회색', 'Text gray'],
                ['color-04-gray', '보조 회색', 'Muted gray'],
                ['color-05-gray-disabled', '비활성 회색', 'Disabled gray'],
                ['line-light', '연한 선', 'Light border'],
                ['line-regular', '기본 선', 'Regular border'],
                ['line-black', '검은 선', 'Black border'],
                ['line-white', '흰 선', 'White border'],
                ['line-disabled', '비활성 선', 'Disabled border'],
                ['bg-light', '연한 배경', 'Light surface'],
                ['bg-regular', '기본 배경', 'Regular surface'],
                ['bg-black', '검은 배경', 'Black surface'],
                ['bg-white', '흰 배경', 'White surface'],
                ['bg-btn-black', '검은 버튼', 'Black button'],
                ['bg-btn-white', '흰 버튼', 'White button'],
                ['bg-btn-light', '연한 버튼', 'Light button'],
                ['bg-btn-regular', '기본 버튼', 'Regular button'],
                ['bg-btn-disabled', '비활성 버튼', 'Disabled button'],
            ].map(([name, label, labelEn]) => ({ name, label, labelEn })),
        ],
    },
] as const;

const componentColorGroups = computed(() =>
    componentDefinitions
        .map(([key, title, titleEn]) => ({
            key,
            title,
            titleEn,
            items: componentColorNames.value.filter((name) => componentName(name) === key).map((name) => ({ name })),
        }))
        .filter((group) => group.items.length),
);

const changedCount = computed(() => Object.keys(themeColors.value).length);
const foundationCount = computed(() => colorGroups.reduce((count, group) => count + group.items.length, 0));
const componentCount = computed(() => componentColorNames.value.length);
const showComponentSection = computed(() => activeFilter.value !== 'foundation');

const visibleColorGroups = computed(() => {
    if (activeFilter.value === 'component') return [];
    return colorGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) =>
                    matchesColor(item.name, item.label, item.labelEn) &&
                    (activeFilter.value !== 'changed' || Boolean(themeColors.value[item.name as ThemeColorName])),
            ),
        }))
        .filter((group) => group.items.length);
});

const visibleComponentColorGroups = computed(() => {
    if (activeFilter.value === 'foundation') return [];
    const query = searchQuery.value.toLowerCase();
    return componentColorGroups.value
        .map((group) => {
            const groupMatches = [group.title, group.titleEn, group.key].some((value) => value.toLowerCase().includes(query));
            const items = group.items.filter(
                (item) =>
                    (!query || groupMatches || item.name.toLowerCase().includes(query)) &&
                    (activeFilter.value !== 'changed' || Boolean(themeColors.value[item.name])),
            );
            return {
                ...group,
                items,
                itemGroups: groupComponentItems(items),
            };
        })
        .filter((group) => group.items.length);
});

const semanticColorPattern = /^--(?:bg|color|border|outline|shadow|fill|stroke)-[a-z0-9-]+$/;

function themeVariable(name: string) {
    return foundationColorNames.has(name) ? `--theme-${name}` : `--${name}`;
}

function componentName(name: string) {
    const value = name.replace(/^(?:bg|color|border|outline|shadow|fill|stroke)-/, '');
    return [...componentDefinitions].sort(([a], [b]) => b.length - a.length).find(([key]) => value === key || value.startsWith(`${key}-`))?.[0];
}

function componentColorLabel(name: string, groupKey?: string) {
    const role = name.split('-', 1)[0];
    const roleLabels =
        locale.value === 'ko'
            ? { bg: '배경', color: '글자', border: '테두리', outline: '포커스', shadow: '그림자', fill: '채움', stroke: '선' }
            : { bg: 'Background', color: 'Text', border: 'Border', outline: 'Focus', shadow: 'Shadow', fill: 'Fill', stroke: 'Stroke' };
    const component = componentName(name);
    const detail = component ? name.replace(`${role}-${component}`, '').replace(/^-/, '') : '';
    const detailLabels: Record<string, string> =
        locale.value === 'ko'
            ? {
                  hover: '호버',
                  active: '활성',
                  disabled: '비활성',
                  focus: '포커스',
                  error: '오류',
                  warning: '경고',
                  success: '성공',
                  selected: '선택',
                  checked: '체크',
                  placeholder: '안내 문구',
              }
            : {
                  hover: 'Hover',
                  active: 'Active',
                  disabled: 'Disabled',
                  focus: 'Focus',
                  error: 'Error',
                  warning: 'Warning',
                  success: 'Success',
                  selected: 'Selected',
                  checked: 'Checked',
                  placeholder: 'Placeholder',
              };
    let detailParts = detail ? detail.split('-') : [];

    if (componentGroupMode.value === 'tone' && groupKey && groupKey !== 'base') {
        const toneParts = groupKey === 'danger' ? ['danger', 'error'] : [groupKey];
        detailParts = detailParts.filter(
            (part, index) => !toneParts.includes(part) && !(part === 'status' && toneParts.includes(detailParts[index + 1])),
        );
    }

    const detailLabel = detailParts.map((part) => detailLabels[part] || part).join(' · ');
    if (componentGroupMode.value === 'property') return detailLabel || (locale.value === 'ko' ? '기본값' : 'Default');
    return `${roleLabels[role as keyof typeof roleLabels]}${detailLabel ? ` · ${detailLabel}` : ''}`;
}

function componentDetail(name: string) {
    const role = name.split('-', 1)[0];
    const component = componentName(name);
    return component ? name.replace(`${role}-${component}`, '').replace(/^-/, '') : '';
}

function componentTone(name: string) {
    const parts = componentDetail(name).split('-');
    const statusIndex = parts.indexOf('status');
    const tone =
        statusIndex >= 0
            ? parts[statusIndex + 1]
            : parts.find((part) => ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger', 'error'].includes(part));

    if (tone === 'error') return 'danger';
    if (tone) return tone;
    if (parts.some((part) => ['gray', 'black', 'white', 'light', 'regular', 'disabled'].includes(part))) return 'neutral';
    return 'base';
}

function groupComponentItems(items: { name: ThemeColorName }[]) {
    const toneOrder = ['base', 'primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger', 'neutral'];
    const propertyOrder = ['bg', 'color', 'border', 'outline', 'shadow', 'fill', 'stroke'];
    const groups = new Map<string, { name: ThemeColorName }[]>();

    for (const item of items) {
        const key = componentGroupMode.value === 'tone' ? componentTone(item.name) : item.name.split('-', 1)[0];
        const group = groups.get(key) || [];
        group.push(item);
        groups.set(key, group);
    }

    const order = componentGroupMode.value === 'tone' ? toneOrder : propertyOrder;
    return [...groups.entries()]
        .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
        .map(([key, groupItems]) => ({
            key,
            label: componentGroupLabel(key),
            previewColor: componentGroupMode.value === 'tone' ? componentToneColor(key) : '',
            items: groupItems.sort((a, b) => componentItemOrder(a.name) - componentItemOrder(b.name) || a.name.localeCompare(b.name)),
        }));
}

function componentGroupLabel(key: string) {
    const labels =
        locale.value === 'ko'
            ? {
                  base: '기본',
                  primary: 'Primary',
                  secondary: 'Secondary',
                  tertiary: 'Tertiary',
                  info: 'Info',
                  success: 'Success',
                  warning: 'Warning',
                  danger: 'Danger',
                  neutral: 'Neutral',
                  bg: '배경',
                  color: '글자',
                  border: '테두리',
                  outline: '포커스',
                  shadow: '그림자',
                  fill: '채움',
                  stroke: '선',
              }
            : {
                  base: 'Base',
                  primary: 'Primary',
                  secondary: 'Secondary',
                  tertiary: 'Tertiary',
                  info: 'Info',
                  success: 'Success',
                  warning: 'Warning',
                  danger: 'Danger',
                  neutral: 'Neutral',
                  bg: 'Background',
                  color: 'Text',
                  border: 'Border',
                  outline: 'Focus',
                  shadow: 'Shadow',
                  fill: 'Fill',
                  stroke: 'Stroke',
              };
    return labels[key as keyof typeof labels] || key;
}

function componentToneColor(key: string) {
    const colors: Record<string, string> = {
        primary: 'var(--theme-primary)',
        secondary: 'var(--theme-secondary)',
        tertiary: 'var(--theme-tertiary)',
        info: 'var(--theme-status-info)',
        success: 'var(--theme-status-success)',
        warning: 'var(--theme-status-warning)',
        danger: 'var(--theme-status-error)',
        neutral: 'var(--theme-gray-600)',
    };
    return colors[key] || '';
}

function componentItemOrder(name: string) {
    const role = name.split('-', 1)[0];
    const roleOrder = ['bg', 'color', 'border', 'outline', 'shadow', 'fill', 'stroke'].indexOf(role);
    const detail = componentDetail(name);
    const stateOrder = detail.includes('hover') ? 1 : detail.includes('active') ? 2 : detail.includes('disabled') ? 3 : 0;
    return roleOrder * 10 + stateOrder;
}

function matchesColor(name: string, label: string, labelEn: string) {
    const query = searchQuery.value.toLowerCase();
    return !query || [name, label, labelEn].some((value) => value.toLowerCase().includes(query));
}

function filterCount(filter: (typeof filters)[number]['value']) {
    if (filter === 'foundation') return foundationCount.value;
    if (filter === 'component') return componentCount.value;
    if (filter === 'changed') return changedCount.value;
    return foundationCount.value + componentCount.value;
}

function clearFilters() {
    searchQuery.value = '';
    activeFilter.value = 'all';
}

function collectComponentColorNames() {
    const names = new Set<string>();
    const styles = getComputedStyle(document.documentElement);

    for (let index = 0; index < styles.length; index += 1) {
        const property = styles.item(index);
        if (semanticColorPattern.test(property)) names.add(property.slice(2));
    }

    function collectRules(rules: CSSRuleList) {
        for (const rule of Array.from(rules)) {
            if ('style' in rule) {
                const style = (rule as CSSStyleRule).style;
                for (let index = 0; index < style.length; index += 1) {
                    const property = style.item(index);
                    if (semanticColorPattern.test(property)) names.add(property.slice(2));
                }
            }
            if ('cssRules' in rule) collectRules((rule as CSSGroupingRule).cssRules);
        }
    }

    for (const sheet of Array.from(document.styleSheets)) {
        try {
            if (sheet.cssRules) collectRules(sheet.cssRules);
        } catch {
            // 외부 스타일시트는 브라우저 보안 정책상 읽을 수 없으므로 건너뜁니다.
        }
    }

    componentColorNames.value = [...names].filter((name): name is ThemeColorName => Boolean(componentName(name))).sort((a, b) => a.localeCompare(b));
}

function pickerColor(name: string) {
    return themeColors.value[name as ThemeColorName] || defaultColors.value[name] || project.themeColor;
}

function handleColorChange(name: string, event: Event) {
    preferences.setThemeColor(name as ThemeColorName, (event.target as HTMLInputElement).value);
}

function handleHexInput(name: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        preferences.setThemeColor(name as ThemeColorName, value.toUpperCase());
    }
}

function handleHexBlur(name: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (!/^#[0-9a-fA-F]{6}$/.test(input.value.trim())) input.value = pickerColor(name);
}

function handleThemeChange(next: AppTheme) {
    preferences.setTheme(next);
}

function readDefaultColors() {
    // CSS 변수와 color-mix의 계산 결과를 색상 입력에 사용합니다.
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const colors: Record<string, string> = {};
    const groups = [...colorGroups, ...componentColorGroups.value];
    for (const group of groups) {
        for (const item of group.items) {
            if (item.name === 'lnb-background') {
                colors[item.name] = colors['primary-800'] || project.themeColor;
                continue;
            }
            probe.style.color = `var(${themeVariable(item.name)})`;
            const value = getComputedStyle(probe).color;
            const rgb = value.match(/^rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/);
            if (rgb)
                colors[item.name] = `#${rgb
                    .slice(1, 4)
                    .map((part) => Number(part).toString(16).padStart(2, '0'))
                    .join('')}`;
            else {
                const srgb = value.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
                if (srgb)
                    colors[item.name] = `#${srgb
                        .slice(1, 4)
                        .map((part) =>
                            Math.round(Number(part) * 255)
                                .toString(16)
                                .padStart(2, '0'),
                        )
                        .join('')}`;
            }
        }
    }
    probe.remove();
    defaultColors.value = colors;
}

onMounted(() => {
    collectComponentColorNames();
    nextTick(readDefaultColors);
});
watch(themeColors, () => nextTick(readDefaultColors));
</script>

<style scoped lang="scss">
.theme-page {
    &__toolbar {
        position: sticky;
        z-index: 5;
        top: 12px;
        gap: 14px;
        border-color: var(--theme-primary-200);
        box-shadow: 0 8px 24px var(--theme-gray-900-alpha-10);
    }

    &__toolbar-top,
    &__toolbar-bottom {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    &__toolbar-top {
        > div:first-child {
            display: grid;
            margin-right: auto;
            gap: 2px;

            strong {
                color: var(--theme-gray-900);
                font-size: 14px;
            }

            span {
                color: var(--theme-gray-500);
                font-size: 12px;
            }
        }
    }

    &__mode-switch {
        display: flex;
        padding: 3px;
        border: 1px solid var(--theme-gray-200);
        border-radius: 10px;
        background: var(--theme-gray-100);

        button {
            display: flex;
            align-items: center;
            gap: 6px;
            min-height: 34px;
            padding: 0 14px;
            border: 0;
            border-radius: 7px;
            background: transparent;
            color: var(--theme-gray-600);
            cursor: pointer;
            font-weight: 600;

            &.is-active {
                background: var(--theme-gray-0);
                box-shadow: 0 1px 4px var(--theme-gray-900-alpha-10);
                color: var(--theme-primary);
            }
        }
    }

    &__change-status {
        display: flex;
        align-items: baseline;
        gap: 4px;
        min-width: 78px;
        color: var(--theme-gray-500);
        font-size: 12px;

        strong {
            color: var(--theme-primary);
            font-size: 18px;
        }
    }

    &__toolbar-bottom {
        padding-top: 14px;
        border-top: 1px solid var(--theme-gray-200);
    }

    &__search {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 220px;
        height: 38px;
        padding-inline: 12px 8px;
        border: 1px solid var(--theme-gray-300);
        border-radius: 9px;
        background: var(--theme-gray-0);
        color: var(--theme-gray-500);

        &:focus-within {
            border-color: var(--theme-primary);
            box-shadow: 0 0 0 3px var(--theme-primary-alpha-10);
        }

        input {
            flex: 1;
            min-width: 0;
            height: 100%;
            padding-inline: 8px;
            border: 0;
            outline: 0;
            background: transparent;
            color: var(--theme-gray-900);
        }

        button {
            width: 26px;
            height: 26px;
            border: 0;
            background: transparent;
            color: var(--theme-gray-500);
            cursor: pointer;
            font-size: 18px;
        }
    }

    &__filters {
        display: flex;
        gap: 4px;
        overflow-x: auto;

        button {
            display: flex;
            align-items: center;
            gap: 6px;
            height: 34px;
            padding-inline: 11px;
            border: 1px solid transparent;
            border-radius: 8px;
            background: transparent;
            color: var(--theme-gray-600);
            cursor: pointer;
            white-space: nowrap;

            span {
                color: var(--theme-gray-400);
                font-size: 11px;
            }

            &.is-active {
                border-color: var(--theme-primary-200);
                background: var(--theme-primary-50);
                color: var(--theme-primary-700);

                span {
                    color: var(--theme-primary-500);
                }
            }
        }
    }

    &__preview {
        gap: 16px;
        overflow: hidden;
    }

    &__preview-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;

        p {
            margin: 4px 0 0;
            color: var(--theme-gray-500);
            font-size: 12px;
        }

        > span {
            padding: 5px 9px;
            border-radius: 999px;
            background: var(--theme-primary-50);
            color: var(--theme-primary-700);
            font-size: 11px;
            font-weight: 600;
        }
    }

    &__preview-body {
        display: grid;
        grid-template-columns: minmax(260px, 1.4fr) minmax(180px, 1fr) auto;
        align-items: stretch;
        gap: 12px;
        padding: 14px;
        border: 1px solid var(--theme-gray-200);
        border-radius: 12px;
        background: var(--theme-gray-50);
    }

    &__preview-panel,
    &__preview-field {
        display: grid;
        align-content: center;
        gap: 5px;
        padding: 14px;
        border: 1px solid var(--theme-line-regular);
        border-radius: 9px;
        background: var(--theme-bg-white);
        color: var(--theme-color-03-gray);

        > span {
            color: var(--theme-color-04-gray);
            font-size: 12px;
        }
    }

    &__preview-actions,
    &__preview-status {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 7px;
    }

    &__preview-status {
        align-content: center;
        min-width: 130px;
        margin: 0;

        span {
            padding: 5px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
        }

        .is-success {
            background: var(--theme-status-success-alpha-12);
            color: var(--theme-status-success);
        }
        .is-warning {
            background: var(--theme-status-warning-alpha-12);
            color: var(--theme-status-warning);
        }
        .is-error {
            background: var(--theme-status-error-alpha-12);
            color: var(--theme-status-error);
        }
    }

    &__section-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
        padding: 12px 2px 0;

        h2,
        p {
            margin: 0;
        }

        h2 {
            font-size: 18px;
            color: var(--theme-gray-900);
        }

        p {
            font-size: 13px;
            color: var(--theme-gray-600);
        }
    }

    &__group-mode {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        gap: 4px;
        padding: 3px;
        border: 1px solid var(--theme-gray-200);
        border-radius: 9px;
        background: var(--theme-gray-100);

        > span {
            padding-inline: 8px 4px;
            color: var(--theme-gray-500);
            font-size: 11px;
        }

        button {
            height: 30px;
            padding-inline: 10px;
            border: 0;
            border-radius: 6px;
            background: transparent;
            color: var(--theme-gray-600);
            cursor: pointer;
            font-size: 12px;

            &.is-active {
                background: var(--theme-gray-0);
                box-shadow: 0 1px 3px var(--theme-gray-900-alpha-10);
                color: var(--theme-primary);
                font-weight: 600;
            }
        }
    }

    &__group {
        gap: 16px;
    }

    &__group-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        p {
            margin: 4px 0 0;
            color: var(--theme-gray-500);
            font-size: 11px;
        }
    }

    &__component {
        display: block;
        padding: 0;
        overflow: hidden;

        &[open] .theme-page__component-summary {
            border-bottom-color: var(--theme-gray-200);
        }
    }

    &__component-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 16px;
        border-bottom: 1px solid transparent;
        color: var(--theme-gray-900);
        cursor: pointer;
        list-style: none;

        &:hover {
            background: var(--theme-gray-50);
        }

        &::-webkit-details-marker {
            display: none;
        }

        span {
            display: inline-grid;
            place-items: center;
            min-width: 26px;
            height: 22px;
            padding-inline: 6px;
            border-radius: 999px;
            background: var(--theme-gray-100);
            color: var(--theme-gray-600);
            font-size: 11px;
        }
    }

    &__component-body {
        display: grid;
        gap: 12px;
        padding: 16px;
        background: var(--theme-gray-50);
    }

    &__token-group {
        overflow: hidden;
        border: 1px solid var(--theme-gray-200);
        border-radius: 10px;
        background: var(--theme-gray-0);

        .theme-page__colors {
            padding: 12px;
        }
    }

    &__token-group-header {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
        padding-inline: 12px;
        border-bottom: 1px solid var(--theme-gray-200);
        background: var(--theme-gray-50);

        h3 {
            flex: 1;
            margin: 0;
            color: var(--theme-gray-800);
            font-size: 13px;
        }

        > span:last-child {
            display: inline-grid;
            place-items: center;
            min-width: 24px;
            height: 20px;
            padding-inline: 5px;
            border-radius: 999px;
            background: var(--theme-gray-100);
            color: var(--theme-gray-500);
            font-size: 10px;
        }
    }

    &__token-dot {
        width: 10px;
        height: 10px;
        border: 1px solid var(--theme-gray-200);
        border-radius: 50%;
        background: var(--theme-gray-300);
    }

    &__colors {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
        gap: 10px;
    }

    &__color {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        padding: 10px;
        border: 1px solid var(--theme-gray-200);
        border-radius: 8px;
        background: var(--theme-gray-0);
        transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;

        &:hover {
            border-color: var(--theme-primary-300);
        }

        &:focus-within {
            border-color: var(--theme-primary);
            box-shadow: 0 0 0 3px var(--theme-primary-alpha-10);
        }
    }

    &__swatch {
        position: relative;
        flex: 0 0 38px;
        width: 38px;
        height: 38px;
        overflow: hidden;
        border: 1px solid var(--theme-gray-200);
        border-radius: 8px;
        box-shadow: inset 0 0 0 2px var(--theme-gray-0);
        cursor: pointer;

        input {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
    }

    &__color-info {
        display: grid;
        flex: 1;
        min-width: 0;
        gap: 2px;

        strong {
            font-size: 13px;
            color: var(--theme-gray-800);
        }

        small {
            overflow: hidden;
            font-size: 11px;
            color: var(--theme-gray-500);
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    &__hex {
        width: 78px;
        height: 32px;
        padding-inline: 8px;
        border: 1px solid var(--theme-gray-200);
        border-radius: 7px;
        outline: 0;
        background: var(--theme-gray-50);
        color: var(--theme-gray-700);
        font-family: monospace;
        font-size: 12px;
        text-transform: uppercase;

        &:focus {
            border-color: var(--theme-primary);
            background: var(--theme-gray-0);
        }
    }

    &__reset {
        flex: 0 0 28px;
        width: 28px;
        height: 28px;
        border: 1px solid var(--theme-primary-200);
        border-radius: 7px;
        background: var(--theme-primary-50);
        color: var(--theme-primary);
        cursor: pointer;
        font-size: 16px;
    }

    &__empty {
        align-items: center;
        padding-block: 40px;
        text-align: center;

        strong {
            color: var(--theme-gray-800);
        }
        p {
            margin: 0;
            color: var(--theme-gray-500);
            font-size: 13px;
        }
    }
}

@media (max-width: 900px) {
    .theme-page {
        &__toolbar {
            position: static;
        }

        &__toolbar-top,
        &__toolbar-bottom {
            align-items: stretch;
            flex-wrap: wrap;
        }

        &__toolbar-top > div:first-child,
        &__search {
            flex-basis: 100%;
        }

        &__filters {
            width: 100%;
        }

        &__preview-body {
            grid-template-columns: 1fr;
        }

        &__section-header {
            align-items: stretch;
            flex-direction: column;
        }

        &__group-mode {
            align-self: flex-start;
        }
    }
}

@media (max-width: 520px) {
    .theme-page {
        &__mode-switch {
            flex: 1;

            button {
                flex: 1;
                justify-content: center;
            }
        }

        &__change-status {
            margin-left: auto;
        }

        &__colors {
            grid-template-columns: 1fr;
        }

        &__color {
            flex-wrap: wrap;
        }

        &__color-info {
            min-width: calc(100% - 50px);
        }

        &__hex {
            flex: 1;
            width: auto;
            margin-left: 48px;
        }
    }
}
</style>
