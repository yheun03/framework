import { toCssSize } from '~/utils/css';

export type SectionDirection = 'row' | 'column';
export type SectionRatio = number[] | string | null;
export type SectionGap = number | string;

export function normalizeSectionGap(value: SectionGap) {
    return toCssSize(value);
}

export function normalizeSectionRatio(value: SectionRatio) {
    if (!value) return undefined;

    if (Array.isArray(value)) {
        return value.map((item) => `${item}fr`).join(' ');
    }

    return value;
}
