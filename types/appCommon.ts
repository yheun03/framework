/**
 * 모든 App* 컴포넌트가 공유하는 공통 속성 타입입니다.
 *
 * 속성명 규칙 (같은 의미 = 같은 이름)
 * ------------------------------------------------------------
 * v-model     컴포넌트의 값 (입력값, 선택 id, 열린 id 목록 등)
 * v-model:open  레이어(Drawer / Popover / Tooltip)의 열림 여부
 * items       목록 데이터 (Select / Tabs / Accordion / Steps / Tree ...)
 * label       필드 라벨 또는 짧은 표시 텍스트
 * title       블록 제목,  description: 블록 설명
 * hint        필드 하단 보조 문구 (state 색상을 따라감)
 * size        xs | sm | md | lg | xl  (24 / 36 / 44 / 48 / 56px 기준)
 * width       number(px) | string('50%', '20rem') | 'full'(100%)
 * height      number(px) | string
 * tone        색상 의미 primary | secondary | gray | danger | warning | success | info
 * variant     시각 스타일 (fill / outline / soft / plain / line ...)
 * shape       square | round | pill (+ circle / underline 일부)
 * state       검증 상태 error | warning | success
 * placement   top | bottom | left | right
 * initial     최초 열림/선택 규칙 'none' | 'first' | 'all'
 * boolean     disabled / readonly / loading / active / required / clearable / closable / multiple
 */
export type AppSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AppFormSize = 'xs' | 'sm' | 'md' | 'lg';

export type AppWidth = number | string;

export type AppTone = 'primary' | 'secondary' | 'gray' | 'danger' | 'warning' | 'success' | 'info';

export type AppState = 'error' | 'warning' | 'success' | null;

export type AppShape = 'square' | 'round' | 'pill';

export type AppFieldShape = AppShape | 'underline';

export type AppPlacement = 'top' | 'bottom' | 'left' | 'right';

export type AppInitial = 'none' | 'first' | 'all';

export type AppId = string | number;

/** Select / Segmented / Transfer 등 값 선택형 목록 아이템 */
export type AppOptionItem = {
    value: string | number | boolean | null;
    label: string;
    description?: string;
    image?: string;
    disabled?: boolean;
};
