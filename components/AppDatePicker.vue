<template>
    <div
        class="form-field app-date-picker"
        :class="[
            `app-date-picker--${size}`,
            `app-date-picker--shape-${shape}`,
            {
                'app-date-picker--range-input': type === 'range-input',
                'is-readonly': readonly,
                'is-disabled': disabled,
                [`is-${state}`]: state,
            },
        ]"
        :style="rootStyle"
    >
        <label v-if="label" class="form-field__label app-date-picker__label" :for="inputId">{{ label }}</label>

        <div v-if="type === 'range-input'" class="app-date-picker__range">
            <div class="form-field__control app-date-picker__control">
                <input
                    :id="inputId"
                    ref="startInputEl"
                    class="app-date-picker__field"
                    type="text"
                    :value="rangeValue.start ?? ''"
                    :name="name ? `${name}Start` : undefined"
                    :placeholder="startPlaceholder"
                    :disabled="disabled"
                    readonly
                    :aria-label="label ? `${label} 시작일` : '시작일'"
                    :aria-readonly="readonly || undefined"
                />
                <span class="app-date-picker__icon app-date-picker__icon--right" aria-hidden="true">
                    <slot name="iconRight"><IconCalendar /></slot>
                </span>
            </div>

            <span class="app-date-picker__separator" aria-hidden="true">~</span>

            <div class="form-field__control app-date-picker__control" :class="{ 'app-date-picker__control--disabled': !rangeValue.start }">
                <input
                    :id="endInputId"
                    ref="endInputEl"
                    class="app-date-picker__field"
                    type="text"
                    :value="rangeValue.end ?? ''"
                    :name="name ? `${name}End` : undefined"
                    :placeholder="endPlaceholder"
                    :disabled="disabled || !rangeValue.start"
                    readonly
                    :aria-label="label ? `${label} 종료일` : '종료일'"
                    :aria-readonly="readonly || undefined"
                />
                <span class="app-date-picker__icon app-date-picker__icon--right" aria-hidden="true">
                    <slot name="iconRight"><IconCalendar /></slot>
                </span>
            </div>
        </div>

        <div v-else class="form-field__control app-date-picker__control">
            <input
                :id="inputId"
                ref="inputEl"
                class="app-date-picker__field"
                type="text"
                :value="displayValue"
                :name="name"
                :placeholder="placeholder"
                :disabled="disabled"
                readonly
                :aria-invalid="state === 'error'"
                :aria-readonly="readonly || undefined"
            />
            <span class="app-date-picker__icon app-date-picker__icon--right" aria-hidden="true">
                <slot name="iconRight"><IconClock v-if="type === 'time'" /><IconCalendar v-else /></slot>
            </span>
        </div>

        <p v-if="hint" class="form-field__hint app-date-picker__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import flatpickr from 'flatpickr';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import type { Options as FlatpickrOptions } from 'flatpickr/dist/types/options';
import { Korean } from 'flatpickr/dist/l10n/ko.js';
import { IconCalendar, IconClock } from '~/components/icons';
import type { AppFieldShape, AppFormSize, AppState, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';
import { useBodyOverlay } from '~/composables/useBodyOverlay';

export type DateRangeValue = {
    start: string | null;
    end: string | null;
};

/** single 날짜 / datetime 날짜+시간 / time 시간 / range 기간 / range-input 시작·종료 분리 / multiple 복수 날짜 */
type DatePickerType = 'single' | 'datetime' | 'time' | 'range' | 'multiple' | 'range-input';

const props = withDefaults(
    defineProps<{
        modelValue: string | DateRangeValue | string[] | null | undefined;
        label?: string;
        hint?: string;
        placeholder?: string;
        startPlaceholder?: string;
        endPlaceholder?: string;
        type?: DatePickerType;
        min?: string;
        max?: string;
        disabled?: boolean;
        readonly?: boolean;
        id?: string;
        name?: string;
        size?: AppFormSize;
        shape?: AppFieldShape;
        state?: AppState;
        /** number(px) | '50%' | 'full' */
        width?: AppWidth;
    }>(),
    {
        type: 'single',
        placeholder: '날짜 선택',
        startPlaceholder: '시작일',
        endPlaceholder: '종료일',
        disabled: false,
        readonly: false,
        size: 'md',
        shape: 'round',
        state: null,
    },
);

const emit = defineEmits<{
    'update:modelValue': [string | DateRangeValue | string[] | null];
}>();

const fallbackId = useId();
const inputId = computed(() => props.id ?? `app-date-picker-${fallbackId}`);
const endInputId = computed(() => `${inputId.value}-end`);
const inputEl = ref<HTMLInputElement | null>(null);
const startInputEl = ref<HTMLInputElement | null>(null);
const endInputEl = ref<HTMLInputElement | null>(null);
let calendar: FlatpickrInstance | null = null;
let startCalendar: FlatpickrInstance | null = null;
let endCalendar: FlatpickrInstance | null = null;
let activeCalendar: FlatpickrInstance | null = null;
let activeTrigger: HTMLElement | null = null;

const overlay = useBodyOverlay({
    trigger: () => activeTrigger,
    overlay: () => activeCalendar?.calendarContainer ?? null,
    close: closeActiveCalendar,
});

const rootStyle = computed(() => toSizeStyle(props.width));
const isSingleValue = computed(() => props.type === 'single' || props.type === 'datetime' || props.type === 'time');
const flatpickrMode = computed(
    () => (isSingleValue.value ? 'single' : props.type === 'range-input' ? 'single' : props.type) as 'single' | 'range' | 'multiple',
);
const dateFormat = computed(() => (props.type === 'datetime' ? 'Y-m-d H:i' : props.type === 'time' ? 'H:i' : 'Y-m-d'));
const rangeValue = computed<DateRangeValue>(() => {
    if (!props.modelValue || typeof props.modelValue === 'string' || Array.isArray(props.modelValue)) {
        return { start: null, end: null };
    }
    return props.modelValue;
});

const displayValue = computed(() => {
    if (isSingleValue.value) return typeof props.modelValue === 'string' ? props.modelValue : '';
    if (props.type === 'multiple') return Array.isArray(props.modelValue) ? props.modelValue.join(', ') : '';
    return [rangeValue.value.start, rangeValue.value.end].filter(Boolean).join(' ~ ');
});

function selectedValues() {
    if (isSingleValue.value) return typeof props.modelValue === 'string' ? [props.modelValue] : [];
    if (props.type === 'multiple') return Array.isArray(props.modelValue) ? props.modelValue : [];
    return [rangeValue.value.start, rangeValue.value.end].filter((value): value is string => Boolean(value));
}

function formatDate(date?: Date, instance = calendar) {
    return date && instance ? instance.formatDate(date, dateFormat.value) : null;
}

function handleChange(dates: Date[]) {
    if (props.disabled || props.readonly) return;

    if (isSingleValue.value) {
        emit('update:modelValue', formatDate(dates[0]));
        return;
    }

    if (props.type === 'multiple') {
        emit(
            'update:modelValue',
            dates.map((date) => formatDate(date)).filter((value): value is string => Boolean(value)),
        );
        return;
    }

    emit(
        'update:modelValue',
        dates.length
            ? {
                  start: formatDate(dates[0]),
                  end: formatDate(dates[1]),
              }
            : null,
    );
}

function handleStartChange(dates: Date[]) {
    const start = formatDate(dates[0], startCalendar);
    if (!start) {
        emit('update:modelValue', null);
        return;
    }

    const currentEnd = rangeValue.value.end;
    emit('update:modelValue', {
        start,
        end: currentEnd && currentEnd >= start ? currentEnd : null,
    });
}

function handleEndChange(dates: Date[]) {
    emit('update:modelValue', {
        start: rangeValue.value.start,
        end: formatDate(dates[0], endCalendar),
    });
}

function options(onChange: (dates: Date[]) => void, option: Partial<FlatpickrOptions> = {}): Partial<FlatpickrOptions> {
    return {
        dateFormat: dateFormat.value,
        enableTime: props.type === 'datetime' || props.type === 'time',
        noCalendar: props.type === 'time',
        time_24hr: true,
        locale: Korean,
        allowInput: false,
        disableMobile: true,
        clickOpens: !props.disabled && !props.readonly,
        appendTo: document.body,
        onOpen: (_dates, _value, instance) => openCalendarOverlay(instance),
        onClose: (_dates, _value, instance) => closeCalendarOverlay(instance),
        onChange,
        ...option,
    };
}

function openCalendarOverlay(instance: FlatpickrInstance) {
    activeCalendar = instance;
    activeTrigger = instance.input;
    overlay.start();
}

function closeCalendarOverlay(instance: FlatpickrInstance) {
    if (activeCalendar !== instance) return;
    overlay.stop();
    activeCalendar = null;
    activeTrigger = null;
}

function closeActiveCalendar() {
    activeCalendar?.close();
}

function destroyCalendars() {
    overlay.stop();
    calendar?.destroy();
    startCalendar?.destroy();
    endCalendar?.destroy();
    calendar = null;
    startCalendar = null;
    endCalendar = null;
    activeCalendar = null;
    activeTrigger = null;
}

function createCalendars() {
    destroyCalendars();

    if (props.type === 'range-input') {
        if (!startInputEl.value || !endInputEl.value) return;

        startCalendar = flatpickr(
            startInputEl.value,
            options(handleStartChange, {
                mode: 'single',
                minDate: props.min,
                maxDate: rangeValue.value.end ?? props.max,
            }) as FlatpickrOptions,
        );
        endCalendar = flatpickr(
            endInputEl.value,
            options(handleEndChange, {
                mode: 'single',
                minDate: rangeValue.value.start ?? props.min,
                maxDate: props.max,
                clickOpens: !props.disabled && !props.readonly && Boolean(rangeValue.value.start),
            }) as FlatpickrOptions,
        );
        syncCalendars();
        return;
    }

    if (!inputEl.value) return;
    calendar = flatpickr(
        inputEl.value,
        options(handleChange, {
            mode: flatpickrMode.value,
            minDate: props.min,
            maxDate: props.max,
        }) as FlatpickrOptions,
    );
    syncCalendars();
}

function syncCalendars() {
    if (props.type === 'range-input') {
        startCalendar?.set('minDate', props.min);
        startCalendar?.set('maxDate', rangeValue.value.end ?? props.max);
        startCalendar?.set('clickOpens', !props.disabled && !props.readonly);
        startCalendar?.setDate(rangeValue.value.start ?? [], false);

        endCalendar?.set('minDate', rangeValue.value.start ?? props.min);
        endCalendar?.set('maxDate', props.max);
        endCalendar?.set('clickOpens', !props.disabled && !props.readonly && Boolean(rangeValue.value.start));
        endCalendar?.setDate(rangeValue.value.end ?? [], false);
        return;
    }

    if (!calendar) return;
    calendar.set('mode', flatpickrMode.value);
    calendar.set('minDate', props.min);
    calendar.set('maxDate', props.max);
    calendar.set('clickOpens', !props.disabled && !props.readonly);
    calendar.setDate(selectedValues(), false);
}

onMounted(createCalendars);
onBeforeUnmount(destroyCalendars);

watch(
    () => props.type,
    async () => {
        await nextTick();
        createCalendars();
    },
);

watch(() => [props.modelValue, props.min, props.max, props.disabled, props.readonly], syncCalendars, { deep: true });
</script>
