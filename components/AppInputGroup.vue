<template>
    <div
        class="form-field app-input-group"
        :class="{ [`is-${state}`]: state, 'is-disabled': disabled }"
        :style="rootStyle"
        role="group"
        :aria-labelledby="label ? `${groupId}-label` : undefined"
    >
        <span v-if="label" :id="`${groupId}-label`" class="form-field__label app-input-group__label">{{ label }}</span>

        <div class="app-input-group__body" :style="bodyStyle">
            <slot />
        </div>

        <p v-if="hint" class="form-field__hint app-input-group__hint">{{ hint }}</p>
    </div>
</template>

<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue';

/** 안쪽 AppInput 이 label 없이 쓰일 때 그룹 이름을 스크린리더용 이름으로 사용합니다. */
export const APP_INPUT_GROUP_KEY: InjectionKey<ComputedRef<string>> = Symbol('AppInputGroup');
</script>

<script setup lang="ts">
import type { AppState, AppWidth } from '~/types/appCommon';
import { toCssSize, toSizeStyle } from '~/utils/css';

/**
 * AppInputGroup
 * Figma 09. Select Box - 07_전화번호 셀렉트 처럼 여러 입력을 한 필드로 묶습니다.
 * 자식 사이에 separator 문자를 자동으로 넣고 싶으면 separator 속성을 사용합니다.
 */
const props = withDefaults(
    defineProps<{
        label?: string;
        hint?: string;
        state?: AppState;
        /** 자식 사이 구분 문자 (예: '-', '~', '@') */
        separator?: string;
        /** 자식 사이 간격 (기본: separator 있으면 20, 없으면 8) */
        gap?: number | string;
        width?: AppWidth;
        disabled?: boolean;
    }>(),
    {
        label: '',
        hint: '',
        state: null,
        separator: '',
        gap: undefined,
        disabled: false,
    },
);

const rootStyle = computed(() => toSizeStyle(props.width));
const groupId = `app-input-group-${useId()}`;
provide(
    APP_INPUT_GROUP_KEY,
    computed(() => props.label ?? ''),
);
const bodyStyle = computed(() => ({
    '--app-input-group-gap': toCssSize(props.gap ?? (props.separator ? 20 : 8)),
    '--app-input-group-separator': props.separator ? `'${props.separator}'` : 'none',
}));
</script>
