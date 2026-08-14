<template>
    <AppAccordion v-if="summary" class="page-demo-accordion" :items="summaryItems" mode="multiple" initial-open="all"
        aria-label="컴포넌트 속성 요약">
        <template #props>
            <div class="page-demo-prop-table">
                <div v-for="prop in summary.props" :key="prop.name" class="page-demo-prop-row">
                    <div class="page-demo-prop-title">
                        <code class="page-demo-prop-name">{{ prop.name }}</code>
                        <span v-if="prop.required" class="page-demo-prop-required">required</span>
                    </div>

                    <div class="page-demo-prop-meta">
                        <dl class="page-demo-prop-spec">
                            <div>
                                <dt>type</dt>
                                <dd><code>{{ getPropType(prop) }}</code></dd>
                            </div>
                            <div>
                                <dt>default</dt>
                                <dd><code>{{ prop.default ?? "—" }}</code></dd>
                            </div>
                        </dl>

                        <span class="page-demo-prop-desc">{{ prop.description }}</span>

                        <div v-if="prop.values?.length" class="page-demo-prop-chip-list">
                            <code v-for="value in prop.values" :key="`${prop.name}-${value}`"
                                class="page-demo-prop-chip">
                                {{ value }}
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AppAccordion>
</template>

<script setup lang="ts">
import type { AppAccordionItem } from "~/components/AppAccordion.vue";

type DemoProp = {
    name: string;
    description: string;
    values?: string[];
    type?: string;
    default?: string;
    required?: boolean;
};

type DemoSummary = {
    description: string;
    props: DemoProp[];
};

const route = useRoute();

const sizes = ["xs", "sm", "md", "lg", "xl"];
const formSizes = ["xs", "sm", "md", "lg"];
const controlSizes = ["sm", "md"];
const shapes = ["square", "round", "pill", "underline"];
const buttonShapes = ["square", "round", "pill"];
const states = ["error", "warning", "success"];
const tones = ["primary", "secondary", "gray", "danger", "warning", "success", "info"];
const buttonTypes = ["button", "submit", "reset"];

const summaries: Record<string, DemoSummary> = {
    "demo-button": {
        description:
            "라벨이 있는 액션 버튼과 아이콘 전용 액션 버튼을 역할별로 구분합니다.",
        props: [
            {
                name: "AppButton.variant",
                description: "라벨 버튼의 강조 방식: fill, outline",
                values: ["fill", "outline"],
                default: "outline",
            },
            {
                name: "AppButton.tone",
                description: "버튼의 의미와 색상 톤",
                values: tones,
                default: "gray",
            },
            {
                name: "AppButton.size",
                description: "라벨 버튼의 표준 크기: xs, sm, md, lg, xl",
                values: sizes,
                default: "md",
            },
            {
                name: "AppButton.shape",
                description: "라벨 버튼의 외곽선 형태",
                values: buttonShapes,
                default: "round",
            },
            {
                name: "AppButton.iconLeft / iconRight",
                description: "텍스트 옆에 붙는 보조 아이콘 슬롯",
            },
            {
                name: "AppTextButton.variant",
                description: "텍스트 액션 표현: text, underline",
                values: ["text", "underline"],
                default: "text",
            },
            {
                name: "AppIconButton.size",
                description: "아이콘 전용 버튼의 클릭 영역 크기",
                values: sizes,
                default: "md",
            },
            {
                name: "AppIconButton.iconSize",
                description: "아이콘 자체의 시각 크기",
                values: sizes,
                default: "md",
            },
            { name: "type", description: "button 태그 타입", values: buttonTypes, default: "button" },
            { name: "to / href", description: "NuxtLink 또는 a 태그 전환" },
            { name: "disabled / loading", description: "클릭 불가와 로딩 상태", type: "boolean", default: "false" },
        ],
    },
    "demo-input": {
        description: "텍스트 입력 필드의 라벨, 상태, 아이콘, 제약을 다룹니다.",
        props: [
            { name: "modelValue", description: "입력 값", type: "string | number | null", required: true },
            { name: "label / hint", description: "필드 설명과 보조 문구", type: "string" },
            { name: "size", description: "입력 필드 높이", values: formSizes, default: "md" },
            { name: "shape", description: "입력 필드 외곽선 형태", values: shapes, default: "round" },
            { name: "state", description: "입력 상태", values: states, default: "null" },
            { name: "type", description: "input native type", values: ["text", "password", "email", "number"], default: "text" },
            { name: "clearable / passwordToggle", description: "입력 보조 액션", type: "boolean", default: "false" },
        ],
    },
    "demo-grid": {
        description: "검색 툴바와 AG Grid 컬럼 정의를 함께 확인합니다.",
        props: [
            { name: "gridId", description: "그리드 상태 저장용 고유 ID", type: "string" },
            { name: "rowData", description: "렌더링할 행 데이터", type: "Record<string, unknown>[]" },
            { name: "columnDefs", description: "컬럼, 에디터, 포맷 설정", type: "AppGridColDef[]" },
            { name: "searchFields.type", description: "상단 검색 조건 타입", values: ["input", "select", "calendar", "numberRange"] },
            { name: "height / autoHeight", description: "고정 높이 또는 자동 높이", type: "string | number | boolean" },
            { name: "excelFileName", description: "엑셀 다운로드 파일명", type: "string" },
        ],
    },
    "demo-chart": {
        description: "Chart.js 타입과 데이터셋 구성을 확인합니다.",
        props: [
            { name: "type", description: "차트 타입", values: ["line", "bar", "doughnut", "semi-doughnut", "pie"] },
            { name: "data", description: "labels와 datasets 구조", type: "ChartData", required: true },
            { name: "options", description: "Chart.js 옵션 전달", type: "ChartOptions", default: "{}" },
            { name: "height", description: "차트 높이 제어", type: "number", default: "260" },
        ],
    },
    "demo-progress": {
        description: "표시용 바, 조작용 슬라이더, 게이지를 역할별로 비교합니다.",
        props: [
            {
                name: "AppProgressBar.value / range",
                description: "표시 전용 단일 값 또는 범위 값",
                type: "number | ProgressRange",
            },
            {
                name: "AppProgressSlider.value / range",
                description: "드래그로 변경하는 단일 값 또는 범위 값",
                type: "number | ProgressRange",
            },
            {
                name: "AppProgressGauge.variant",
                description: "게이지 표시 타입",
                values: ["gauge", "semi-doughnut-range"],
                default: "gauge",
            },
            {
                name: "mode",
                description: "display, control-single, control-range 조작 방식",
                values: ["display", "control-single", "control-range"],
                default: "display",
            },
            { name: "label / showValue", description: "라벨과 값 노출 여부", type: "string | boolean" },
        ],
    },
    "demo-datepicker": {
        description: "날짜 선택 타입과 입력 상태를 조합합니다.",
        props: [
            { name: "modelValue", description: "선택한 날짜 또는 범위", type: "string | DateRangeValue | string[] | null", required: true },
            { name: "type", description: "날짜 선택 방식", values: ["single", "range", "range-input", "multiple"], default: "single" },
            { name: "min / max", description: "선택 가능한 날짜 제한", type: "string" },
            { name: "size", description: "입력 UI 크기", values: formSizes, default: "md" },
            { name: "shape", description: "입력 UI 형태", values: shapes, default: "round" },
            { name: "state", description: "검증 상태", values: states, default: "null" },
            { name: "disabled / readonly", description: "비활성 및 읽기 전용 제어", type: "boolean", default: "false" },
        ],
    },
    "demo-select": {
        description: "옵션 선택 필드의 값, 상태, 표시 방식을 다룹니다.",
        props: [
            { name: "modelValue", description: "선택된 option value", type: "string | number | boolean | null", required: true },
            { name: "options", description: "value, label, disabled 배열", type: "AppSelectOption[]", required: true },
            { name: "placeholder", description: "미선택 상태 문구", type: "string", default: "선택하세요" },
            { name: "size", description: "셀렉트 높이", values: formSizes, default: "md" },
            { name: "shape", description: "셀렉트 외곽선 형태", values: shapes, default: "round" },
            { name: "state", description: "검증 상태", values: states, default: "null" },
            { name: "required", description: "placeholder 재선택 제한", type: "boolean", default: "false" },
            { name: "readonly / disabled", description: "읽기 전용과 비활성 상태", type: "boolean", default: "false" },
        ],
    },
    "demo-choice": {
        description: "checkbox, radio, chip 선택 패턴을 한 컴포넌트로 다룹니다.",
        props: [
            { name: "modelValue / value", description: "선택 상태와 radio option 값", type: "boolean | string | number | null", required: true },
            { name: "type", description: "선택 방식", values: ["checkbox", "radio"], default: "checkbox" },
            { name: "variant", description: "선택 UI 형태", values: ["default", "round", "chip", "chip-outline", "fill", "ghost", "toggle"], default: "default" },
            { name: "toggleLabels", description: "toggle 전용 checked / unchecked 문구", type: "{ checked?: string; unchecked?: string }" },
            { name: "size", description: "선택 컴포넌트 크기", values: controlSizes, default: "md" },
            { name: "state", description: "검증 상태", values: states, default: "null" },
            { name: "disabled / readonly", description: "선택 불가와 읽기 전용 상태", type: "boolean", default: "false" },
        ],
    },
    "demo-upload-image": {
        description: "이미지 선택, 미리보기, 제거, 읽기 모드를 확인합니다.",
        props: [
            { name: "modelValue", description: "선택된 이미지 파일 또는 목록", type: "AppImageUploadItem | AppImageUploadItem[] | null", default: "null" },
            { name: "multiple", description: "다중 이미지 선택", type: "boolean", default: "false" },
            { name: "allowDrop", description: "드래그 앤 드롭 허용 여부", type: "boolean", default: "true" },
            { name: "accept", description: "허용 파일 형식", type: "string", default: "image/*" },
            { name: "maxSizeBytes / maxCount", description: "파일 용량과 개수 제한", type: "number" },
            { name: "readMode", description: "이미지 읽기 방식", values: ["dataUrl", "objectUrl"], default: "dataUrl" },
            { name: "disabled", description: "파일 선택 불가 상태", type: "boolean", default: "false" },
        ],
    },
    "demo-upload-file": {
        description: "파일 선택, 다중 업로드, 규칙 제한을 확인합니다.",
        props: [
            { name: "modelValue", description: "선택된 파일 또는 파일 목록", type: "AppFileUploadItem | AppFileUploadItem[] | null", default: "null" },
            { name: "multiple", description: "다중 파일 선택", type: "boolean", default: "false" },
            { name: "allowDrop", description: "드래그 앤 드롭 허용 여부", type: "boolean", default: "true" },
            { name: "accept / maxSizeBytes", description: "파일 형식과 용량 제한", type: "string | number" },
            { name: "maxCount", description: "다중 선택 최대 개수", type: "number" },
            { name: "disabled", description: "파일 선택 불가 상태", type: "boolean", default: "false" },
        ],
    },
    "demo-modal": {
        description: "모달 타입, 닫기 정책, 스택 동작을 확인합니다.",
        props: [
            { name: "type", description: "모달 타입", values: ["alert", "confirm", "custom"], required: true },
            { name: "title / message", description: "헤더와 본문 문구", type: "string" },
            { name: "closeOnEsc", description: "ESC 닫기 허용", type: "boolean", default: "true" },
            { name: "closeOnBackdrop", description: "배경 클릭 닫기 허용", type: "boolean", default: "true" },
            { name: "actions", description: "버튼 구성과 콜백", type: "ModalAction[]" },
        ],
    },
    "demo-table": {
        description: "행/셀 정의로 폼형 테이블을 구성합니다.",
        props: [
            { name: "modelValue", description: "테이블 필드 값 객체", type: "Record<string, unknown>", required: true },
            { name: "rows", description: "행과 셀 타입 정의", type: "AppTableRow[]", required: true },
            { name: "rows.cells.type", description: "셀 렌더링 타입", values: ["input", "select", "textarea", "choice", "date", "button", "file", "image"] },
            { name: "title", description: "테이블 제목", type: "string", default: "''" },
            { name: "defaultLabelWidth", description: "라벨 컬럼 기본 너비", type: "string", default: "140px" },
            { name: "readonly / disabled", description: "전체 입력 상태 제어", type: "boolean", default: "false" },
        ],
    },
    "demo-section": {
        description: "업무 화면 섹션의 헤더, 본문, 푸터 영역을 조합합니다.",
        props: [
            { name: "title", description: "섹션 제목", type: "string", default: "''" },
            { name: "desc", description: "섹션 보조 설명", type: "string", default: "''" },
            { name: "direction", description: "섹션 배치 방향", values: ["column", "row"], default: "column" },
            { name: "ratio", description: "row 배치 시 컬럼 비율", type: "SectionRatio", default: "null" },
            { name: "gap", description: "섹션 내부 간격", type: "number | string", default: "12" },
        ],
    },
    "demo-accordion": {
        description: "접이식 패널의 선택 방식과 초기 열림 상태를 확인합니다.",
        props: [
            { name: "items", description: "패널 제목과 본문 데이터", type: "AppAccordionItem[]", required: true },
            { name: "mode", description: "열림 방식", values: ["single", "multiple"], default: "multiple" },
            { name: "openIds / defaultOpenIds", description: "제어/비제어 열림 값", type: "Array<string | number>" },
            { name: "initialOpen", description: "초기 열림 상태", values: ["none", "first", "all"], default: "none" },
        ],
    },
    "demo-tabs": {
        description: "탭 목록, 활성 값, 배치와 크기를 확인합니다.",
        props: [
            { name: "items", description: "탭 라벨과 값 배열", type: "AppTabItem[]", required: true },
            { name: "activeId / defaultActiveId", description: "제어/비제어 활성 탭 값", type: "string | number | null" },
            { name: "initialActive", description: "초기 활성 탭 선택 방식", values: ["first", "none"], default: "first" },
            { name: "variant", description: "탭 표시 스타일", values: ["line", "box", "pill"], default: "line" },
            { name: "orientation", description: "탭 배치 방향", values: ["horizontal", "vertical"], default: "horizontal" },
            { name: "size", description: "탭 크기", values: ["sm", "md", "lg"], default: "md" },
            { name: "stretch", description: "탭 너비 채움", type: "boolean", default: "false" },
        ],
    },
    "demo-form-field": {
        description: "라벨, 힌트, 필수/상태 표기를 입력 컴포넌트와 결합합니다.",
        props: [
            { name: "label", description: "필드 라벨", type: "string", default: "''" },
            { name: "hint", description: "보조 설명 또는 메시지", type: "string", default: "''" },
            { name: "required", description: "필수 입력 표시", type: "boolean", default: "false" },
            { name: "error", description: "필드 오류 상태와 메시지", type: "string | boolean | null", default: "null" },
            { name: "slots", description: "control 영역에 입력 컴포넌트 배치", type: "Vue slot" },
        ],
    },
    "demo-pagination": {
        description: "페이지 이동, 노출 범위, 크기 변화를 확인합니다.",
        props: [
            { name: "page", description: "현재 페이지", type: "number", required: true },
            { name: "total", description: "전체 아이템 수", type: "number", required: true },
            { name: "pageSize", description: "페이지당 아이템 수", type: "number", required: true },
            { name: "pageSizeOptions", description: "페이지당 개수 옵션", type: "number[]", default: "[10, 20, 50, 100]" },
            { name: "siblingCount", description: "현재 페이지 주변 노출 수", type: "number", default: "1" },
            { name: "size", description: "페이지네이션 크기", values: controlSizes, default: "md" },
            { name: "showTotal / showPageSize", description: "전체 수와 페이지 크기 영역 표시", type: "boolean", default: "true" },
            { name: "disabled", description: "페이지 이동 비활성", type: "boolean", default: "false" },
        ],
    },
    "demo-textarea": {
        description: "긴 텍스트 입력의 높이, 리사이즈, 상태를 확인합니다.",
        props: [
            { name: "modelValue", description: "입력 텍스트", type: "string | number | null", default: "''" },
            { name: "rows", description: "기본 표시 줄 수", type: "number", default: "4" },
            { name: "size", description: "Textarea 크기", values: formSizes, default: "md" },
            { name: "shape", description: "Textarea 외곽선 형태", values: shapes, default: "round" },
            { name: "state", description: "검증 상태", values: states, default: "null" },
            { name: "resize", description: "리사이즈 방향", values: ["none", "vertical", "horizontal", "both"], default: "vertical" },
            { name: "disabled / readonly", description: "입력 가능 상태", type: "boolean", default: "false" },
        ],
    },
};

const demoKey = computed(() => String(route.path.split("/").pop() ?? ""));
const summary = computed(() => summaries[demoKey.value]);

function getPropType(prop: DemoProp) {
    if (prop.type) return prop.type;
    if (!prop.values?.length) return "—";
    if (prop.values.length === 2 && prop.values.includes("true") && prop.values.includes("false")) {
        return "boolean";
    }

    return prop.values.map((value) => `'${value}'`).join(" | ");
}

const summaryItems = computed<AppAccordionItem[]>(() => {
    if (!summary.value) return [];

    const items: AppAccordionItem[] = [
        {
            id: "props",
            title: "Props",
            desc: summary.value.description,
            slot: "props",
        },
    ];

    return items;
});
</script>
