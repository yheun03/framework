/**
 * CSS class 및 style 처리에 사용하는 공통 유틸 함수 파일입니다.
 */
export type CssSize = number | string;

export function toCssSize(value?: CssSize) {
    if (value == null || value === '') return undefined;
    return typeof value === 'number' ? `${value}px` : value;
}

export function toSyncedSizeStyles(widthValue?: CssSize, heightValue?: CssSize) {
    const width = toCssSize(widthValue);
    const height = toCssSize(heightValue);

    return {
        width,
        minWidth: width,
        height,
        minHeight: height,
    };
}
