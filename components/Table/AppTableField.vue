<template>
    <div class="app-table-field" :class="{ 'is-readonly': readonly, 'is-disabled': disabled }">
        <slot v-if="cell.slot" :name="cell.slot" :cell="cell" />

        <span v-else-if="cell.type === 'text'" class="app-table-field__text">
            {{ displayValue }}
        </span>

        <AppInput v-else-if="cell.type === 'input'" class="app-table-field__inline-input" :model-value="inputValue"
            :placeholder="cell.placeholder" :readonly="readonly" :disabled="disabled"
            @update:model-value="updateSingle" />

        <AppSelect v-else-if="cell.type === 'select'" :model-value="selectValue" :options="cell.options ?? []"
            :placeholder="cell.placeholder" :readonly="readonly" :disabled="disabled"
            @update:model-value="updateSingle" />

        <AppTextarea v-else-if="cell.type === 'textarea'" :model-value="inputValue" :placeholder="cell.placeholder"
            :rows="cell.rows" :readonly="readonly" :disabled="disabled" @update:model-value="updateSingle" />

        <AppButton v-else-if="cell.type === 'button'" :disabled="disabled || readonly" @click="emitAction">
            {{ cell.buttonText ?? "버튼" }}
        </AppButton>

        <div v-else-if="cell.type === 'input_button'" class="app-table-field__inline">
            <AppInput class="app-table-field__inline-input" :model-value="inputValue" :placeholder="cell.placeholder"
                :readonly="readonly" :disabled="disabled" @update:model-value="updateSingle" />
            <AppButton class="app-table-field__inline-button" :disabled="disabled || readonly" @click="emitAction">
                {{ cell.buttonText ?? "버튼" }}
            </AppButton>
        </div>

        <div v-else-if="cell.type === 'input_button-text'" class="app-table-field__inline">
            <AppInput class="app-table-field__inline-input" :model-value="inputValue" :placeholder="cell.placeholder"
                :readonly="readonly" :disabled="disabled" @update:model-value="updateSingle" />
            <AppButton class="app-table-field__inline-button" :disabled="disabled || readonly" @click="emitAction">
                {{ cell.buttonText ?? "버튼" }}
            </AppButton>
            <span class="app-table-field__suffix-text">{{ cell.text }}</span>
        </div>

        <div v-else-if="cell.type === 'input-text'" class="app-table-field__inline">
            <AppInput class="app-table-field__inline-input" :model-value="inputValue" :placeholder="cell.placeholder"
                :readonly="readonly" :disabled="disabled" @update:model-value="updateSingle" />
            <span class="app-table-field__suffix-text">{{ cell.text }}</span>
        </div>

        <div v-else-if="cell.type === 'text-button'" class="app-table-field__inline">
            <span class="app-table-field__text">{{ cell.text ?? displayValue }}</span>
            <AppButton class="app-table-field__inline-button" :disabled="disabled || readonly" @click="emitAction">
                {{ cell.buttonText ?? "버튼" }}
            </AppButton>
        </div>

        <div v-else-if="cell.type === 'radio'" class="app-table-field__choice-group">
            <AppChoice v-for="option in cell.options ?? []" :key="String(option.value)" type="radio"
                :model-value="modelValue[cell.key ?? ''] as string | number | boolean | null"
                :value="option.value as string | number" :label="option.label" :disabled="disabled || option.disabled"
                :readonly="readonly" @update:model-value="updateSingle" />
        </div>

        <div v-else-if="cell.type === 'checkbox'" class="app-table-field__choice-group">
            <AppChoice v-for="option in cell.options ?? []" :key="String(option.value)" type="checkbox"
                :model-value="isChecked(option.value)" :label="option.label" :disabled="disabled || option.disabled"
                :readonly="readonly" @update:model-value="updateCheckbox(option.value, $event)" />
        </div>

        <AppChoice v-else-if="cell.type === 'toggle'" type="checkbox" :model-value="Boolean(modelValue[cell.key ?? ''])"
            :label="cell.text" :disabled="disabled" :readonly="readonly" @update:model-value="updateSingle" />

        <AppDatePicker v-else-if="cell.type === 'date'" :model-value="dateValue" :placeholder="cell.placeholder"
            :readonly="readonly" :disabled="disabled" @update:model-value="updateSingle" />

        <AppDatePicker v-else-if="cell.type === 'range_date'" :model-value="rangeValue" mode="range"
            :placeholder="cell.placeholder" :readonly="readonly" :disabled="disabled"
            @update:model-value="updateSingle" />

        <div v-else-if="cell.type === 'phone'" class="app-table-field__inline app-table-field__inline--phone">
            <AppInput v-for="(key, index) in cell.keys ?? []" :key="key" class="app-table-field__phone-input"
                :model-value="stringValue(key)" :placeholder="cell.placeholders?.[index]" :readonly="readonly"
                :disabled="disabled" @update:model-value="updateField(key, $event)" />
        </div>

        <div v-else-if="cell.type === 'email'" class="app-table-field__inline app-table-field__inline--email">
            <AppInput class="app-table-field__email-input" :model-value="stringValue(cell.keys?.[0])"
                :placeholder="cell.placeholders?.[0]" :readonly="readonly" :disabled="disabled"
                @update:model-value="updateField(cell.keys?.[0], $event)" />
            <span class="app-table-field__email-at">@</span>
            <AppInput class="app-table-field__email-input" :model-value="stringValue(cell.keys?.[1])"
                :placeholder="cell.placeholders?.[1]" :readonly="readonly" :disabled="disabled"
                @update:model-value="updateField(cell.keys?.[1], $event)" />
        </div>

        <span v-else class="app-table-field__text">{{ displayValue }}</span>
    </div>
</template>

<script setup lang="ts">
import type { DateRangeValue } from "~/components/AppDatePicker.vue";
import type { AppTableCell } from "~/types/appTable";

const props = withDefaults(
    defineProps<{
        modelValue: Record<string, unknown>;
        cell: AppTableCell;
        readonly?: boolean;
        disabled?: boolean;
    }>(),
    {
        readonly: false,
        disabled: false,
    },
);

const emit = defineEmits<{
    (e: "update-field", key: string, value: unknown): void;
    (e: "field-action", cell: AppTableCell): void;
}>();

const inputValue = computed(() => stringValue(props.cell.key));
const selectValue = computed(() => props.modelValue[props.cell.key ?? ""] as string | number | boolean | null);
const dateValue = computed(() => (props.modelValue[props.cell.key ?? ""] as string | null) ?? null);
const rangeValue = computed(() => props.modelValue[props.cell.key ?? ""] as DateRangeValue | null);
const displayValue = computed(() => String(props.modelValue[props.cell.key ?? ""] ?? ""));

function stringValue(key?: string) {
    if (!key) return "";
    return String(props.modelValue[key] ?? "");
}

function updateField(key: string | undefined, value: unknown) {
    if (!key) return;
    emit("update-field", key, value);
}

function updateSingle(value: unknown) {
    updateField(props.cell.key, value);
}

function isChecked(value: unknown) {
    const current = props.modelValue[props.cell.key ?? ""];
    return Array.isArray(current) && current.includes(value);
}

function updateCheckbox(value: unknown, checked: unknown) {
    if (!props.cell.key) return;

    const current = props.modelValue[props.cell.key];
    const next = Array.isArray(current) ? [...current] : [];
    const index = next.indexOf(value);

    if (checked && index < 0) next.push(value);
    if (!checked && index >= 0) next.splice(index, 1);

    emit("update-field", props.cell.key, next);
}

function emitAction() {
    emit("field-action", props.cell);
}
</script>
