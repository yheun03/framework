<template>
    <div class="page-demo theme-page">
        <main class="page-demo-main">
            <header class="page-demo__header">
                <h1 class="page-demo__title">{{ locale === 'ko' ? '색상 테마' : 'Color theme' }}</h1>
                <p class="page-demo__desc">
                    {{ locale === 'ko' ? '공통 컴포넌트와 레이아웃의 색상을 변경합니다. 변경값은 현재 탭의 세션에 저장됩니다.' : 'Customize component and layout colors. Changes are saved for this tab session.' }}
                </p>
            </header>

            <section v-for="group in colorGroups" :key="group.title" class="page-demo-card theme-page__group">
                <h2 class="page-demo-card__title">{{ locale === 'ko' ? group.title : group.titleEn }}</h2>
                <div class="theme-page__colors">
                    <label v-for="item in group.items" :key="item.name" class="theme-page__color">
                        <span class="theme-page__swatch" :style="{ background: `var(--theme-${item.name})` }" aria-hidden="true" />
                        <span class="theme-page__color-info">
                            <strong>{{ locale === 'ko' ? item.label : item.labelEn }}</strong>
                            <small>{{ item.name }}</small>
                        </span>
                        <input type="color" :value="pickerColor(item.name)" :aria-label="`${item.label} 색상`"
                            @input="handleColorChange(item.name, $event)" />
                        <button v-if="themeColors[item.name]" class="theme-page__reset" type="button"
                            :aria-label="`${item.label} 기본값으로 복원`" @click="preferences.setThemeColor(item.name, null)">
                            {{ locale === 'ko' ? '기본값' : 'Reset' }}
                        </button>
                    </label>
                </div>
            </section>

            <div class="theme-page__actions">
                <AppButton variant="outline" tone="gray" @click="preferences.resetThemeColors()">
                    {{ locale === 'ko' ? '전체 색상 초기화' : 'Reset all colors' }}
                </AppButton>
                <AppButton to="/settings" variant="outline" tone="primary">
                    {{ locale === 'ko' ? '설정으로 돌아가기' : 'Back to settings' }}
                </AppButton>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePreferencesStore, type ThemeColorName } from '~/stores/preferences';

const preferences = usePreferencesStore();
const project = useProjectConfig();
const { locale, themeColors } = storeToRefs(preferences);
const defaultColors = ref<Record<string, string>>({});

const colorGroups = [
    {
        title: '브랜드 색상', titleEn: 'Brand colors',
        items: [
            { name: 'primary', label: '기본 색상', labelEn: 'Primary' },
            { name: 'secondary', label: '보조 색상', labelEn: 'Secondary' },
            { name: 'tertiary', label: '강조 색상', labelEn: 'Tertiary' },
            ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => ({ name: `primary-${shade}`, label: `기본 ${shade}`, labelEn: `Primary ${shade}` })),
        ],
    },
    {
        title: '중립 및 상태 색상', titleEn: 'Neutral and status colors',
        items: [
            ...[0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => ({ name: `gray-${shade}`, label: `회색 ${shade}`, labelEn: `Gray ${shade}` })),
            { name: 'status-success', label: '성공', labelEn: 'Success' },
            { name: 'status-warning', label: '경고', labelEn: 'Warning' },
            { name: 'status-error', label: '오류', labelEn: 'Error' },
            { name: 'status-info', label: '정보', labelEn: 'Info' },
        ],
    },
    {
        title: '레이아웃 색상', titleEn: 'Layout colors',
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
        title: '표면 및 경계선', titleEn: 'Surfaces and borders',
        items: [
            ...[
                ['color-01-white', '흰색', 'White'], ['color-02-black', '검정', 'Black'],
                ['color-03-gray', '본문 회색', 'Text gray'], ['color-04-gray', '보조 회색', 'Muted gray'],
                ['color-05-gray-disabled', '비활성 회색', 'Disabled gray'],
                ['line-light', '연한 선', 'Light border'], ['line-regular', '기본 선', 'Regular border'],
                ['line-black', '검은 선', 'Black border'], ['line-white', '흰 선', 'White border'],
                ['line-disabled', '비활성 선', 'Disabled border'],
                ['bg-light', '연한 배경', 'Light surface'], ['bg-regular', '기본 배경', 'Regular surface'],
                ['bg-black', '검은 배경', 'Black surface'], ['bg-white', '흰 배경', 'White surface'],
                ['bg-btn-black', '검은 버튼', 'Black button'], ['bg-btn-white', '흰 버튼', 'White button'],
                ['bg-btn-light', '연한 버튼', 'Light button'], ['bg-btn-regular', '기본 버튼', 'Regular button'],
                ['bg-btn-disabled', '비활성 버튼', 'Disabled button'],
            ].map(([name, label, labelEn]) => ({ name, label, labelEn })),
        ],
    },
] as const;

function pickerColor(name: string) {
    return themeColors.value[name as ThemeColorName] || defaultColors.value[name] || project.themeColor;
}

function handleColorChange(name: string, event: Event) {
    preferences.setThemeColor(name as ThemeColorName, (event.target as HTMLInputElement).value);
}

function readDefaultColors() {
    // CSS 변수와 color-mix의 계산 결과를 색상 입력에 사용합니다.
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const colors: Record<string, string> = {};
    for (const group of colorGroups) {
        for (const item of group.items) {
            if (item.name === 'lnb-background') {
                colors[item.name] = colors['primary-800'] || project.themeColor;
                continue;
            }
            probe.style.color = `var(--theme-${item.name})`;
            const value = getComputedStyle(probe).color;
            const rgb = value.match(/^rgba?\((\d+)[, ]+\s*(\d+)[, ]+\s*(\d+)/);
            if (rgb) colors[item.name] = `#${rgb.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
            else {
                const srgb = value.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
                if (srgb) colors[item.name] = `#${srgb.slice(1, 4).map((part) => Math.round(Number(part) * 255).toString(16).padStart(2, '0')).join('')}`;
            }
        }
    }
    probe.remove();
    defaultColors.value = colors;
}

onMounted(readDefaultColors);
watch(themeColors, () => nextTick(readDefaultColors));
</script>

<style scoped lang="scss">
.theme-page {
    &__group {
        gap: 16px;
    }

    &__colors {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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

        input {
            width: 34px;
            height: 34px;
            padding: 0;
            border: 0;
            background: none;
            cursor: pointer;
        }
    }

    &__swatch {
        flex: 0 0 32px;
        width: 32px;
        height: 32px;
        border: 1px solid var(--theme-gray-200);
        border-radius: 6px;
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
            font-size: 11px;
            color: var(--theme-gray-500);
        }
    }

    &__reset {
        border: 0;
        background: none;
        color: var(--theme-primary);
        cursor: pointer;
        font-size: 12px;
        white-space: nowrap;
    }

    &__actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }
}
</style>
