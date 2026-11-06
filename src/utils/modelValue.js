/**
 * v-model 값 변환과 동기화 처리에 사용하는 공통 유틸 함수 파일입니다.
 */

export function toStringModelValue(value) {
    return value === null || value === undefined ? '' : String(value);
}

export function toBooleanModelValue(value) {
    return Boolean(value);
}

export function toSelectModelValue(value) {
    return value == null || value === '' ? null : value;
}

export function toChoiceModelValue(value) {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null ? value : null;
}

export function toDateModelValue(value) {
    return typeof value === 'string' ? value : null;
}

export function toRangeModelValue(value) {
    if (value && typeof value === 'object' && 'start' in value && 'end' in value) {
        return value;
    }

    return null;
}

export function includesArrayValue(current, value) {
    return Array.isArray(current) ? current.includes(value) : false;
}

export function toggleArrayValue(current, optionValue, checked) {
    const next = Array.isArray(current) ? [...current] : [];

    if (checked) {
        if (!next.includes(optionValue)) next.push(optionValue);
    } else {
        const index = next.indexOf(optionValue);
        if (index > -1) next.splice(index, 1);
    }

    return next;
}
