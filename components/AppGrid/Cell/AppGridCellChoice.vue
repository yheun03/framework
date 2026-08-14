<template>
    <div class="app-grid-cell-control">
        <div class="app-grid-choice">
            <AppChoice
                v-for="opt in options"
                :key="opt.value"
                :model-value="choiceValue(opt.value)"
                :type="type"
                :value="opt.value"
                :label="opt.label"
                :name="radioName"
                size="sm"
                @update:model-value="(v) => updateChoiceValue(opt.value, v)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from '~/composables/useAppGridCellRendererValue';
import type { AppGridCellRendererProps } from '~/types/appGrid';

type ChoiceType = 'checkbox' | 'radio';
type ChoiceValue = string | number | boolean | null;
type ChoiceOption = {
    label: string;
    value: string | number;
};
type ChoiceRendererParams = {
    options?: ChoiceOption[];
    type?: ChoiceType;
};

const props = defineProps<AppGridCellRendererProps<ChoiceValue | Array<string | number>, ChoiceRendererParams>>();

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue<ChoiceValue | Array<string | number>, ChoiceRendererParams>(params);
const options = computed<ChoiceOption[]>(() => rendererParams.value.options ?? []);
const type = computed<ChoiceType>(() => rendererParams.value.type ?? 'radio');

const radioName = computed(() => `${params.column?.getColId?.()}-${params.node?.id}`);

function handleCellValueChange(v: unknown) {
    params.node?.setDataValue?.(params.column?.getColId?.(), v);
}

function choiceValue(optionValue: string | number): ChoiceValue {
    if (type.value === 'checkbox') {
        return Array.isArray(value.value) ? value.value.includes(optionValue) : Boolean(value.value);
    }

    return Array.isArray(value.value) ? null : value.value;
}

function updateChoiceValue(optionValue: string | number, checkedValue: unknown) {
    if (type.value !== 'checkbox') {
        handleCellValueChange(checkedValue);
        return;
    }

    const current = Array.isArray(value.value) ? [...value.value] : [];
    const checked = Boolean(checkedValue);
    const exists = current.includes(optionValue);

    if (checked && !exists) current.push(optionValue);
    if (!checked && exists) current.splice(current.indexOf(optionValue), 1);

    handleCellValueChange(current);
}
</script>
