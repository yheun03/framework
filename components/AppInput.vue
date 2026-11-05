<template>
    <div
        class="form-field app-input"
        :class="[
            `app-input--${size}`,
            `app-input--shape-${shape}`,
            {
                'app-input--icon-left': $slots.iconLeft,
                'app-input--icon-right': $slots.iconRight || clearable || passwordToggle,
                'is-disabled': disabled,
                [`is-${state}`]: state,
            },
        ]"
        :style="rootStyle"
    >
        <label v-if="label" class="form-field__label app-input__label" :for="inputId">{{ label }}</label>

        <div class="form-field__control app-input__control">
            <span v-if="$slots.iconLeft" class="app-input__icon app-input__icon--left">
                <slot name="iconLeft" />
            </span>

            <input
                :id="inputId"
                class="app-input__field"
                :type="inputType"
                :value="modelValue ?? ''"
                :placeholder="placeholder"
                :name="name"
                :autocomplete="autocomplete"
                :maxlength="maxLength"
                :disabled="disabled"
                :readonly="readonly"
                :aria-invalid="state === 'error'"
                :aria-label="inputAriaLabel"
                :aria-describedby="describedby"
                @input="handleInput"
            />

            <AppIconButton
                v-if="clearable && modelValue"
                class="app-input__icon app-input__icon--right"
                aria-label="입력값 지우기"
                @click="emit('update:modelValue', '')"
            >
                <IconClose />
            </AppIconButton>

            <AppIconButton
                v-if="passwordToggle"
                class="app-input__icon app-input__icon--right"
                :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 표시'"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
            >
                <IconEyeOff v-if="showPassword" />
                <IconEye v-else />
            </AppIconButton>

            <span v-if="$slots.iconRight" class="app-input__icon app-input__icon--right">
                <slot name="iconRight" />
            </span>
        </div>

        <p v-if="hint" :id="`${inputId}-hint`" class="form-field__hint app-input__hint">{{ hint }}</p>
    </div>
</template>

<script setup lang="ts">
import { APP_FORM_FIELD_KEY } from '~/components/AppFormField.vue';
import { APP_INPUT_GROUP_KEY } from '~/components/AppInputGroup.vue';
import { IconClose, IconEye, IconEyeOff } from '~/components/icons';
import type { AppFieldShape, AppFormSize, AppState, AppWidth } from '~/types/appCommon';
import { toSizeStyle } from '~/utils/css';

const props = withDefaults(
    defineProps<{
        modelValue: string | number | null;
        label?: string;
        hint?: string;
        placeholder?: string;
        type?: string;
        size?: AppFormSize;
        shape?: AppFieldShape;
        state?: AppState;
        /** number(px) | '50%' | 'full' */
        width?: AppWidth;
        maxLength?: number;
        disabled?: boolean;
        readonly?: boolean;
        clearable?: boolean;
        passwordToggle?: boolean;
        id?: string;
        /** label 이 없을 때 스크린리더용 이름 (검색창 등) */
        ariaLabel?: string;
        name?: string;
        autocomplete?: string;
    }>(),
    {
        type: 'text',
        size: 'md',
        shape: 'round',
        state: null,
        disabled: false,
        readonly: false,
        clearable: false,
        passwordToggle: false,
    },
);

const emit = defineEmits<{ 'update:modelValue': [string] }>();
const showPassword = ref(false);
// label 과 input 을 항상 연결하기 위해 id 가 없으면 자동 생성합니다.
const fallbackId = useId();
const formField = inject(APP_FORM_FIELD_KEY, null);
const inputId = computed(() => props.id ?? formField?.id.value ?? `app-input-${fallbackId}`);
const inputGroupLabel = inject(APP_INPUT_GROUP_KEY, null);
// 이름 우선순위: label > ariaLabel > placeholder(브라우저 기본) > AppInputGroup label
const inputAriaLabel = computed(() => {
    if (props.label) return undefined;
    return props.ariaLabel ?? (props.placeholder ? undefined : inputGroupLabel?.value || undefined);
});
const describedby = computed(() => [formField?.describedby.value, props.hint && `${inputId.value}-hint`].filter(Boolean).join(' ') || undefined);
const rootStyle = computed(() => toSizeStyle(props.width));
const inputType = computed(() => (props.passwordToggle ? (showPassword.value ? 'text' : 'password') : props.type));

function handleInput(event: Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>
