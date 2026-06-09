export type SelectModelValue = string | number | boolean | null;
export type ChoiceModelValue = string | number | boolean | null;

export type RangeModelValue = {
    start?: unknown;
    end?: unknown;
};

export function getModelValue(model: Record<string, unknown>, key?: string) {
    if (!key) return '';
    return model?.[key] ?? '';
}

export function toStringModelValue(value: unknown) {
    return value === null || value === undefined ? '' : String(value);
}

export function toScalarStringModelValue(value: unknown) {
    return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

export function toBooleanModelValue(value: unknown) {
    return Boolean(value);
}

export function toSelectModelValue(value: unknown): SelectModelValue {
    return value == null || value === '' ? null : (value as string | number | boolean);
}

export function toChoiceModelValue(value: unknown): ChoiceModelValue {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null ? value : null;
}

export function toDateModelValue(value: unknown) {
    return typeof value === 'string' ? value : null;
}

export function toRangeModelValue<T extends RangeModelValue>(value: unknown): T | null {
    if (value && typeof value === 'object' && 'start' in (value as Record<string, unknown>) && 'end' in (value as Record<string, unknown>)) {
        return value as T;
    }

    return null;
}

export function includesArrayValue(current: unknown, value: unknown) {
    return Array.isArray(current) ? current.includes(value) : false;
}

export function toggleArrayValue(current: unknown, optionValue: unknown, checked: unknown) {
    const next = Array.isArray(current) ? [...current] : [];

    if (checked) {
        if (!next.includes(optionValue)) next.push(optionValue);
    } else {
        const index = next.indexOf(optionValue);
        if (index > -1) next.splice(index, 1);
    }

    return next;
}
