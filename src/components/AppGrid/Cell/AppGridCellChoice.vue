<template>
    <div class="app-grid-cell-control">
        <div class="app-grid-choice">
            <AppChoice
                v-for="opt in items"
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

<script setup>
import { useAppGridCellRendererValue } from '@/composables/useAppGridCellRendererValue';
import { computed } from 'vue';
import AppChoice from '@/components/AppChoice.vue';

const props = defineProps({
    params: { type: null, required: true },
});

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue(params);
const items = computed(() => rendererParams.value.items ?? []);
const type = computed(() => rendererParams.value.type ?? 'radio');

const radioName = computed(() => `${params.column?.getColId?.()}-${params.node?.id}`);

function handleCellValueChange(v) {
    params.node?.setDataValue?.(params.column?.getColId?.(), v);
}

function choiceValue(optionValue) {
    if (type.value === 'checkbox') {
        return Array.isArray(value.value) ? value.value.includes(optionValue) : Boolean(value.value);
    }

    return Array.isArray(value.value) ? null : value.value;
}

function updateChoiceValue(optionValue, checkedValue) {
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
