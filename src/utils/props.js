/**
 * 컴포넌트 props 공통 값 목록 + 검사 함수
 *
 * - 공통 속성(COMPONENT_GUIDE 1장)의 값 목록을 한 곳에 모읍니다.
 * - oneOf(values) 를 validator 로 쓰면, 개발 모드에서 지원하지 않는 값(오타 등)을 넣었을 때
 *   콘솔에 사용 가능한 값을 알려줍니다. (운영 빌드에서는 검사하지 않습니다)
 *
 *   size: { type: String, default: 'md', validator: oneOf(SIZES) },
 */

// 높이 기준 크기 이름 - 모든 컴포넌트에서 같은 이름 = 같은 높이 (xs 24 · sm 36 · md 44 · lg 48 · xl 56)
export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
// 입력 계열(Input · Select · DatePicker · Textarea) · Tabs · DataTable 행은 24px 이 없어 sm 부터
export const FORM_SIZES = ['sm', 'md', 'lg', 'xl'];
export const TONES = ['primary', 'secondary', 'gray', 'danger', 'warning', 'success', 'info'];
export const TAG_TONES = [...TONES, 'black', 'red', 'orange', 'green', 'blue', 'navy', 'purple'];
export const SHAPES = ['square', 'round', 'pill'];
export const FORM_SHAPES = [...SHAPES, 'underline'];
export const STATES = ['error', 'warning', 'success'];
export const PLACEMENTS = ['top', 'bottom', 'left', 'right'];
export const DIRECTIONS = ['horizontal', 'vertical'];
export const BUTTON_TYPES = ['button', 'submit', 'reset'];

/**
 * 값 목록 검사 validator
 * @param {Array} values 허용 값
 * @param {{ number?: boolean }} [options] number: true 면 숫자(px)도 허용
 */
export function oneOf(values, { number = false } = {}) {
    return (value) => {
        if (value === null || value === undefined) return true;
        if (number && typeof value === 'number') return true;
        if (values.includes(value)) return true;
        if (import.meta.env?.DEV) {
            // eslint-disable-next-line no-console
            console.warn(`[props] '${value}' 는 지원하지 않는 값입니다. 사용 가능: ${values.join(' | ')}${number ? ' | 숫자(px)' : ''}`);
        }
        return false;
    };
}
