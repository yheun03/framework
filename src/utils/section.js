/**
 * 섹션 구성과 화면 표시 조건 처리에 사용하는 공통 유틸 함수 파일입니다.
 */
import { toCssSize } from '@/utils/css';

export function normalizeSectionGap(value) {
    return toCssSize(value);
}

export function normalizeSectionRatio(value) {
    if (!value) return undefined;

    if (Array.isArray(value)) {
        return value.map((item) => `${item}fr`).join(' ');
    }

    return value;
}

export function buildSectionStyleVars(options) {
    const { gapVarName, ratioVarName, gap, ratio } = options;

    return {
        [gapVarName]: normalizeSectionGap(gap),
        [ratioVarName]: normalizeSectionRatio(ratio),
    };
}
