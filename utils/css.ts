/**
 * CSS class 및 style 처리에 사용하는 공통 유틸 함수 파일입니다.
 */
export type CssSize = number | string;

/** 숫자는 px로 변환하고 문자열은 그대로 사용합니다. */
export function toCssSize(value?: CssSize | null) {
    if (value == null || value === '') return undefined;
    return typeof value === 'number' ? `${value}px` : value;
}

/**
 * 공통 width 속성 변환 함수입니다.
 * - 'full' → 100%
 * - 'auto' → auto
 * - 숫자 → px
 * - 그 외 문자열('50%', '20rem', 'calc(...)') → 그대로
 */
export function toCssWidth(value?: CssSize | null) {
    if (value === 'full') return '100%';
    return toCssSize(value);
}

/** width / height 속성을 inline style 객체로 변환합니다. 값이 없으면 키를 만들지 않습니다. */
export function toSizeStyle(width?: CssSize | null, height?: CssSize | null) {
    const style: Record<string, string> = {};
    const cssWidth = toCssWidth(width);
    const cssHeight = toCssSize(height);

    if (cssWidth) style.width = cssWidth;
    if (cssHeight) style.height = cssHeight;

    return style;
}
