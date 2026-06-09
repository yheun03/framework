<template>
    <AppAccordion v-if="summary" class="page-demo-accordion" :items="summaryItems" mode="multiple" initial-open="none"
        aria-label="컴포넌트 속성 요약">
        <template #props>
            <div class="page-demo-prop-table">
                <div v-for="prop in summary.props" :key="prop.name" class="page-demo-prop-row">
                    <code class="page-demo-prop-name">{{ prop.name }}</code>
                    <span class="page-demo-prop-desc">{{ prop.description }}</span>
                </div>
            </div>
        </template>

        <template #values>
            <p class="page-demo-prop-note">주요 값</p>
            <div class="page-demo-prop-chip-list">
                <code v-for="value in summary.values" :key="value" class="page-demo-prop-chip">
                    {{ value }}
                </code>
            </div>
        </template>
    </AppAccordion>
</template>

<script setup lang="ts">
import type { AppAccordionItem } from '~/components/AppAccordion.vue'

type DemoProp = {
    name: string
    description: string
}

type DemoSummary = {
    description: string
    props: DemoProp[]
    values?: string[]
}

const route = useRoute()

const summaries: Record<string, DemoSummary> = {
    'demo-button': {
        description: '라벨이 있는 액션 버튼과 아이콘 전용 액션 버튼을 역할별로 구분합니다.',
        props: [
            { name: 'AppButton.variant', description: '라벨 버튼의 강조 방식: fill, outline' },
            { name: 'AppButton.size', description: '라벨 버튼의 표준 크기: xs, sm, md, lg, xl' },
            { name: 'AppButton.iconLeft / iconRight', description: '텍스트 옆에 붙는 보조 아이콘 슬롯' },
            { name: 'AppTextButton.variant', description: '텍스트 액션 표현: text, underline' },
            { name: 'AppIconButton.buttonSize', description: '아이콘 전용 버튼의 클릭 영역 크기' },
            { name: 'AppIconButton.iconSize', description: '아이콘 자체의 시각 크기' },
            { name: 'to / href', description: 'NuxtLink 또는 a 태그 전환' },
            { name: 'disabled / loading', description: '클릭 불가와 로딩 상태' },
        ],
        values: ['AppButton', 'AppTextButton', 'AppIconButton', 'fill', 'outline', 'text', 'underline', 'plain', 'soft'],
    },
    'demo-input': {
        description: '텍스트 입력 필드의 라벨, 상태, 아이콘, 제약을 다룹니다.',
        props: [
            { name: 'modelValue', description: '입력 값' },
            { name: 'label / hint', description: '필드 설명과 보조 문구' },
            { name: 'size / shape', description: '높이와 외곽선 형태' },
            { name: 'state', description: 'error, warning, success 상태' },
            { name: 'clearable / passwordToggle', description: '입력 보조 액션' },
        ],
        values: ['xs', 'sm', 'md', 'lg', 'square', 'round', 'pill', 'underline'],
    },
    'demo-grid': {
        description: '검색 툴바와 AG Grid 컬럼 정의를 함께 확인합니다.',
        props: [
            { name: 'gridId', description: '그리드 상태 저장용 고유 ID' },
            { name: 'rowData', description: '렌더링할 행 데이터' },
            { name: 'columnDefs', description: '컬럼, 에디터, 포맷 설정' },
            { name: 'searchFields', description: '상단 검색 조건 구성' },
            { name: 'excelFileName', description: '엑셀 다운로드 파일명' },
        ],
    },
    'demo-chart': {
        description: 'Chart.js 타입과 데이터셋 구성을 확인합니다.',
        props: [
            { name: 'type', description: 'line, bar, doughnut, pie 타입' },
            { name: 'variant', description: 'semi-doughnut 같은 확장 표현' },
            { name: 'data', description: 'labels와 datasets 구조' },
            { name: 'options', description: 'Chart.js 옵션 전달' },
            { name: 'height', description: '차트 높이 제어' },
        ],
        values: ['line', 'bar', 'doughnut', 'semi-doughnut', 'pie'],
    },
    'demo-progress': {
        description: '표시용 바, 조작용 슬라이더, 게이지를 역할별로 비교합니다.',
        props: [
            { name: 'AppProgressBar.value / range', description: '표시 전용 단일 값 또는 범위 값' },
            { name: 'AppProgressSlider.value / range', description: '드래그로 변경하는 단일 값 또는 범위 값' },
            { name: 'AppProgressGauge.type', description: 'gauge, semi-doughnut-range 표시 타입' },
            { name: 'mode', description: 'display, control-single, control-range 조작 방식' },
            { name: 'label / showValue', description: '라벨과 값 노출 여부' },
        ],
        values: ['AppProgressBar', 'AppProgressSlider', 'AppProgressGauge', 'single', 'range'],
    },
    'demo-datepicker': {
        description: '날짜 선택 모드와 입력 상태를 조합합니다.',
        props: [
            { name: 'modelValue', description: '선택한 날짜 또는 범위' },
            { name: 'mode', description: 'single, range 등 선택 방식' },
            { name: 'minDate / maxDate', description: '선택 가능한 날짜 제한' },
            { name: 'size / shape', description: '입력 UI 크기와 형태' },
            { name: 'state / disabled', description: '검증 상태와 비활성 제어' },
        ],
    },
    'demo-select': {
        description: '옵션 선택 필드의 값, 상태, 표시 방식을 다룹니다.',
        props: [
            { name: 'modelValue', description: '선택된 option value' },
            { name: 'options', description: 'value, label, disabled 배열' },
            { name: 'placeholder', description: '미선택 상태 문구' },
            { name: 'required', description: 'placeholder 재선택 제한' },
            { name: 'readonly / disabled', description: '읽기 전용과 비활성 상태' },
        ],
        values: ['xs', 'sm', 'md', 'lg', 'error', 'warning', 'success'],
    },
    'demo-choice': {
        description: 'checkbox, radio, chip 선택 패턴을 한 컴포넌트로 다룹니다.',
        props: [
            { name: 'type', description: 'checkbox 또는 radio' },
            { name: 'uiType', description: '기본 컨트롤 형태 a, b' },
            { name: 'variant', description: 'chip, chip-outline, fill, ghost' },
            { name: 'size', description: 'md, sm 크기' },
            { name: 'disabled', description: '선택 불가 상태' },
        ],
        values: ['checkbox', 'radio', 'chip', 'chip-outline', 'fill', 'ghost'],
    },
    'demo-upload-image': {
        description: '이미지 선택, 미리보기, 제거, 읽기 모드를 확인합니다.',
        props: [
            { name: 'modelValue', description: '선택된 이미지 파일 또는 목록' },
            { name: 'multiple', description: '다중 이미지 선택' },
            { name: 'dragDrop', description: '드래그 앤 드롭 사용' },
            { name: 'accept', description: '허용 파일 형식' },
            { name: 'readonly / disabled', description: '읽기 모드와 비활성 상태' },
        ],
    },
    'demo-upload-file': {
        description: '파일 선택, 다중 업로드, 규칙 제한을 확인합니다.',
        props: [
            { name: 'modelValue', description: '선택된 파일 또는 파일 목록' },
            { name: 'multiple', description: '다중 파일 선택' },
            { name: 'dragDrop', description: '드래그 앤 드롭 사용' },
            { name: 'accept / maxSize', description: '파일 형식과 용량 제한' },
            { name: 'disabled', description: '파일 선택 불가 상태' },
        ],
    },
    'demo-modal': {
        description: '모달 타입, 닫기 정책, 스택 동작을 확인합니다.',
        props: [
            { name: 'type', description: 'alert, confirm, custom 모달' },
            { name: 'title / message', description: '헤더와 본문 문구' },
            { name: 'closeOnEsc', description: 'ESC 닫기 허용' },
            { name: 'closeOnBackdrop', description: '배경 클릭 닫기 허용' },
            { name: 'actions', description: '버튼 구성과 콜백' },
        ],
    },
    'demo-table': {
        description: '행/셀 정의로 폼형 테이블을 구성합니다.',
        props: [
            { name: 'modelValue', description: '테이블 필드 값 객체' },
            { name: 'rows', description: '행과 셀 타입 정의' },
            { name: 'title', description: '테이블 제목' },
            { name: 'defaultLabelWidth', description: '라벨 컬럼 기본 너비' },
            { name: 'readonly / disabled', description: '전체 입력 상태 제어' },
        ],
    },
    'demo-section': {
        description: '업무 화면 섹션의 헤더, 본문, 푸터 영역을 조합합니다.',
        props: [
            { name: 'title', description: '섹션 제목' },
            { name: 'description', description: '섹션 보조 설명' },
            { name: 'collapsible', description: '접기/펼치기 지원' },
            { name: 'footer', description: '하단 액션 영역' },
            { name: 'slots', description: 'header, body, footer 구성' },
        ],
    },
    'demo-accordion': {
        description: '접이식 패널의 선택 방식과 초기 열림 상태를 확인합니다.',
        props: [
            { name: 'items', description: '패널 제목과 본문 데이터' },
            { name: 'multiple', description: '여러 패널 동시 열림' },
            { name: 'initialOpen', description: 'none, first, all 초기 상태' },
            { name: 'disabled', description: '패널 조작 제한' },
            { name: 'variant', description: '표현 스타일' },
        ],
    },
    'demo-tabs': {
        description: '탭 목록, 활성 값, 배치와 크기를 확인합니다.',
        props: [
            { name: 'modelValue', description: '현재 활성 탭 값' },
            { name: 'items', description: '탭 라벨과 값 배열' },
            { name: 'variant', description: 'line, box, pill 스타일' },
            { name: 'size', description: 'sm, md, lg 크기' },
            { name: 'disabled', description: '탭 비활성 상태' },
        ],
        values: ['line', 'box', 'pill', 'sm', 'md', 'lg'],
    },
    'demo-form-field': {
        description: '라벨, 힌트, 필수/상태 표기를 입력 컴포넌트와 결합합니다.',
        props: [
            { name: 'label', description: '필드 라벨' },
            { name: 'hint', description: '보조 설명 또는 메시지' },
            { name: 'required', description: '필수 입력 표시' },
            { name: 'state', description: 'error, warning, success 상태' },
            { name: 'slots', description: 'control 영역에 입력 컴포넌트 배치' },
        ],
    },
    'demo-pagination': {
        description: '페이지 이동, 노출 범위, 크기 변화를 확인합니다.',
        props: [
            { name: 'modelValue', description: '현재 페이지' },
            { name: 'total', description: '전체 아이템 수' },
            { name: 'pageSize', description: '페이지당 아이템 수' },
            { name: 'siblingCount', description: '현재 페이지 주변 노출 수' },
            { name: 'disabled', description: '페이지 이동 비활성' },
        ],
    },
    'demo-textarea': {
        description: '긴 텍스트 입력의 높이, 리사이즈, 상태를 확인합니다.',
        props: [
            { name: 'modelValue', description: '입력 텍스트' },
            { name: 'rows', description: '기본 표시 줄 수' },
            { name: 'size', description: 'sm, md, lg 크기' },
            { name: 'resize', description: 'none, vertical, horizontal, both' },
            { name: 'disabled / readonly', description: '입력 가능 상태' },
        ],
        values: ['sm', 'md', 'lg', 'none', 'vertical', 'horizontal', 'both'],
    },
}

const demoKey = computed(() => String(route.path.split('/').pop() ?? ''))
const summary = computed(() => summaries[demoKey.value])

const summaryItems = computed<AppAccordionItem[]>(() => {
    if (!summary.value) return []

    const items: AppAccordionItem[] = [
        {
            id: 'props',
            title: 'Props',
            desc: summary.value.description,
            slot: 'props',
        },
    ]

    if (summary.value.values?.length) {
        items.push({
            id: 'values',
            title: 'Values',
            desc: '주요 옵션 값만 확인합니다.',
            slot: 'values',
        })
    }

    return items
})
</script>
