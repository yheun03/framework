<template>
    <div class="app-chart" :class="wrapperClasses" :style="{ height: `${resolvedHeight}px` }">
        <Line v-if="isLine" class="app-chart__canvas" :data="lineData" :options="lineOptions" :aria-label="chartLabel" />

        <Bar v-else-if="isBar" class="app-chart__canvas" :data="barData" :options="barOptions" :aria-label="chartLabel" />

        <Doughnut v-else-if="isDoughnut" class="app-chart__canvas" :data="doughnutData" :options="doughnutOptions" :aria-label="chartLabel" />

        <Pie v-else class="app-chart__canvas" :data="pieData" :options="pieOptions" :aria-label="chartLabel" />
    </div>
</template>

<script setup>
import i18n from '@/i18n';
import { oneOf } from '@/utils/props';
import { computed } from 'vue';
import { Bar, Line, Doughnut, Pie } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const props = defineProps({
    type: { type: String, required: true, validator: oneOf(['line', 'bar', 'doughnut', 'semi-doughnut', 'pie']) },
    data: { type: Object, required: true },
    height: { type: Number, default: 260 },
    cutout: { type: [String, Number], default: '68%' },
    options: { type: Object, default: () => ({}) },
    /** 스크린리더용 차트 설명. 비우면 데이터셋 이름과 항목으로 자동 생성합니다. */
    ariaLabel: { type: String },
});

// canvas 는 내용을 읽을 수 없으므로 차트 요약을 aria-label 로 제공합니다.
const chartLabel = computed(() => {
    if (props.ariaLabel) return props.ariaLabel;
    const series = props.data.datasets
        .map((dataset) => dataset.label)
        .filter(Boolean)
        .join(', ');
    const labels = (props.data.labels ?? []).join(', ');
    return [i18n.global.t('ui.chart.name'), series, labels && i18n.global.t('ui.chart.items', { labels })].filter(Boolean).join(' - ');
});

function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(...sources) {
    const result = {};

    for (const source of sources) {
        if (!isObject(source)) continue;

        for (const key of Object.keys(source)) {
            const prev = result[key];
            const next = source[key];

            if (Array.isArray(next)) {
                result[key] = next.slice();
                continue;
            }

            if (isObject(prev) && isObject(next)) {
                result[key] = deepMerge(prev, next);
                continue;
            }

            result[key] = next;
        }
    }

    return result;
}

const isSemiDoughnut = computed(() => props.type === 'semi-doughnut');

const resolvedType = computed(() => {
    return props.type === 'semi-doughnut' ? 'doughnut' : props.type;
});

const isLine = computed(() => resolvedType.value === 'line');
const isBar = computed(() => resolvedType.value === 'bar');
const isDoughnut = computed(() => resolvedType.value === 'doughnut');

function getChartThemeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || undefined;
}

const resolvedHeight = computed(() => {
    if (isSemiDoughnut.value) {
        return Math.max(220, Math.floor(Number(props.height) || 260));
    }

    return Math.max(120, Math.floor(Number(props.height) || 260));
});

const wrapperClasses = computed(() => ({
    'app-chart--semi-doughnut': isSemiDoughnut.value,
}));

const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
        legend: {
            display: true,
        },
        tooltip: {
            enabled: true,
        },
    },
};

const defaultLineOptions = {
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: {
                color: getChartThemeColor('--border-chart-grid'),
            },
        },
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
    },
};

const defaultBarOptions = {
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            suggestedMax: 100,
            grid: {
                color: getChartThemeColor('--border-chart-grid'),
            },
        },
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
    },
};

const defaultDoughnutOptions = {
    cutout: props.cutout,
    plugins: {
        legend: {
            position: 'bottom',
            align: 'center',
            labels: {
                boxWidth: 14,
                boxHeight: 14,
                padding: 12,
                usePointStyle: false,
            },
        },
    },
};

const defaultSemiDoughnutOptions = {
    rotation: -90,
    circumference: 180,
    cutout: props.cutout,
    layout: {
        padding: {
            top: 16,
            right: 16,
            bottom: 0,
            left: 16,
        },
    },
    plugins: {
        legend: {
            position: 'bottom',
            align: 'center',
            labels: {
                boxWidth: 14,
                boxHeight: 14,
                padding: 12,
                usePointStyle: false,
            },
        },
    },
};

const defaultPieOptions = {
    plugins: {
        legend: {
            position: 'bottom',
            align: 'center',
            labels: {
                boxWidth: 14,
                boxHeight: 14,
                padding: 12,
                usePointStyle: false,
            },
        },
    },
};

const chartData = computed(() => {
    if (!isSemiDoughnut.value) {
        return props.data;
    }

    return {
        ...props.data,
        datasets: (props.data.datasets ?? []).map((dataset) => ({
            ...dataset,
            borderWidth: dataset.borderWidth ?? 0,
            cutout: dataset.cutout ?? props.cutout,
        })),
    };
});

const lineData = computed(() => props.data);
const barData = computed(() => props.data);
const doughnutData = computed(() => chartData.value);
const pieData = computed(() => props.data);

const lineOptions = computed(() => {
    return deepMerge(baseOptions, defaultLineOptions, props.options);
});

const barOptions = computed(() => {
    return deepMerge(baseOptions, defaultBarOptions, props.options);
});

const doughnutOptions = computed(() => {
    const preset = isSemiDoughnut.value ? defaultSemiDoughnutOptions : defaultDoughnutOptions;

    return deepMerge(baseOptions, preset, props.options);
});

const pieOptions = computed(() => {
    return deepMerge(baseOptions, defaultPieOptions, props.options);
});
</script>
