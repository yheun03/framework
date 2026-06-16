<template>
    <section class="app-table">
        <h2 v-if="title" class="app-table__title">{{ title }}</h2>
        <p v-if="description" class="app-table__description">{{ description }}</p>

        <div class="app-table__content">
            <table class="app-table__table">
                <tbody>
                    <template v-for="(row, rowIndex) in visibleRows" :key="row.id ?? rowIndex">
                        <tr v-if="row.layout === 'label-row'" class="app-table__row">
                            <th v-for="(cell, cellIndex) in visibleCells(row)" :key="getCellKey(cell, cellIndex)"
                                class="app-table__th app-table__th--full" :class="cell.labelClass"
                                :colspan="cell.labelColspan" :rowspan="cell.rowspan" scope="col">
                                {{ cell.label }}
                                <span v-if="cell.isRequired" class="app-table__required">*</span>
                            </th>
                        </tr>

                        <template v-else-if="row.layout === 'stacked'">
                            <tr class="app-table__row">
                                <th v-for="(cell, cellIndex) in visibleCells(row)" :key="getCellKey(cell, cellIndex)"
                                    class="app-table__th app-table__th--stacked" :class="cell.labelClass"
                                    :colspan="cell.labelColspan" :rowspan="cell.rowspan" scope="col">
                                    {{ cell.label }}
                                    <span v-if="cell.isRequired" class="app-table__required">*</span>
                                </th>
                            </tr>
                            <tr class="app-table__row">
                                <td v-for="(cell, cellIndex) in visibleCells(row)" :key="getCellKey(cell, cellIndex)"
                                    class="app-table__td" :class="getValueClasses(cell)" :colspan="cell.colspan"
                                    :rowspan="cell.rowspan">
                                    <AppTableField :model-value="modelValue" :cell="cell" :readonly="isReadonly(cell)"
                                        :disabled="isDisabled(cell)" @update-field="handleUpdateField"
                                        @field-action="emit('field-action', cell)" />
                                </td>
                            </tr>
                        </template>

                        <template v-else-if="row.layout === 'label-full'">
                            <template v-for="(cell, cellIndex) in visibleCells(row)"
                                :key="getCellKey(cell, cellIndex)">
                                <tr class="app-table__row">
                                    <th class="app-table__th app-table__th--full" :class="cell.labelClass"
                                        :colspan="tableColspan" scope="row">
                                        {{ cell.label }}
                                        <span v-if="cell.isRequired" class="app-table__required">*</span>
                                    </th>
                                </tr>
                                <tr class="app-table__row">
                                    <td class="app-table__td" :class="getValueClasses(cell)" :colspan="tableColspan">
                                        <AppTableField :model-value="modelValue" :cell="cell"
                                            :readonly="isReadonly(cell)" :disabled="isDisabled(cell)"
                                            @update-field="handleUpdateField"
                                            @field-action="emit('field-action', cell)" />
                                    </td>
                                </tr>
                            </template>
                        </template>

                        <tr v-else class="app-table__row">
                            <template v-for="(cell, cellIndex) in visibleCells(row)" :key="getCellKey(cell, cellIndex)">
                                <th class="app-table__th" :class="cell.labelClass" :colspan="cell.labelColspan"
                                    :rowspan="cell.rowspan"
                                    :style="{ width: cell.labelColspan ? undefined : defaultLabelWidth }" scope="row">
                                    {{ cell.label }}
                                    <span v-if="cell.isRequired" class="app-table__required">*</span>
                                </th>
                                <td class="app-table__td" :class="getValueClasses(cell)" :colspan="cell.colspan"
                                    :rowspan="cell.rowspan">
                                    <AppTableField :model-value="modelValue" :cell="cell" :readonly="isReadonly(cell)"
                                        :disabled="isDisabled(cell)" @update-field="handleUpdateField"
                                        @field-action="emit('field-action', cell)" />
                                </td>
                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { AppTableCell, AppTableRow } from "~/types/appTable";

const props = withDefaults(
    defineProps<{
        modelValue: Record<string, unknown>;
        rows: AppTableRow[];
        title?: string;
        description?: string;
        defaultLabelWidth?: string;
        readonly?: boolean;
        disabled?: boolean;
    }>(),
    {
        title: "",
        description: "",
        defaultLabelWidth: "140px",
        readonly: false,
        disabled: false,
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: Record<string, unknown>): void;
    (e: "field-action", cell: AppTableCell): void;
}>();

const visibleRows = computed(() =>
    props.rows.filter((row) => isVisible(row.visible)),
);

const tableColspan = computed(() =>
    Math.max(...visibleRows.value.map((row) => getRowColspan(row)), 1),
);

function visibleCells(row: AppTableRow) {
    return row.cells.filter((cell) => isVisible(cell.visible));
}

function isVisible(visible: AppTableRow["visible"] | AppTableCell["visible"]) {
    if (typeof visible === "function") return visible(props.modelValue);
    return visible !== false;
}

function isReadonly(cell: AppTableCell) {
    return props.readonly || Boolean(cell.readonly);
}

function isDisabled(cell: AppTableCell) {
    return props.disabled || Boolean(cell.disabled);
}

function getValueClasses(cell: AppTableCell) {
    return [
        cell.valueClass,
        {
            "is-full": cell.full,
            "is-readonly": isReadonly(cell),
            "is-disabled": isDisabled(cell),
            "is-textarea": cell.type === "textarea",
        },
    ];
}

function getRowColspan(row: AppTableRow) {
    const count = visibleCells(row).length;

    if (row.layout === "stacked" || row.layout === "label-row") return count;
    return count * 2;
}

function getCellKey(cell: AppTableCell, index: number) {
    return cell.key ?? cell.keys?.join("-") ?? cell.label ?? index;
}

function handleUpdateField(key: string, value: unknown) {
    emit("update:modelValue", {
        ...props.modelValue,
        [key]: value,
    });
}
</script>
