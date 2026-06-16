/**
 * 진행률 값 계산과 표시 처리에 사용하는 공통 유틸 함수 파일입니다.
 */
export type ProgressRange = {
    start: number;
    end: number;
};

export type ProgressBounds = {
    min?: number;
    max?: number;
    step?: number;
};

export function clampNumber(value: number, min = 0, max = 100) {
    const next = Number(value);

    if (Number.isNaN(next)) {
        return min;
    }

    return Math.min(max, Math.max(min, next));
}

export function roundByStep(value: number, step = 1) {
    if (step <= 0) {
        return value;
    }

    return Math.round(value / step) * step;
}

export function normalizeProgressValue(value: number, bounds: ProgressBounds = {}) {
    const min = bounds.min ?? 0;
    const max = bounds.max ?? 100;
    const step = bounds.step ?? 1;

    return roundByStep(clampNumber(value, min, max), step);
}

export function normalizeProgressRange(range?: ProgressRange, bounds: ProgressBounds = {}, fallbackEnd?: number): ProgressRange {
    const min = bounds.min ?? 0;
    const endFallback = fallbackEnd == null ? min : normalizeProgressValue(fallbackEnd, bounds);

    if (!range) {
        return {
            start: min,
            end: endFallback,
        };
    }

    const start = normalizeProgressValue(range.start, bounds);
    const end = normalizeProgressValue(range.end, bounds);

    return {
        start: Math.min(start, end),
        end: Math.max(start, end),
    };
}

export function isSameProgressRange(a: ProgressRange, b: ProgressRange) {
    return a.start === b.start && a.end === b.end;
}
