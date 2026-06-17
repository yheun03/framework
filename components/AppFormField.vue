<template>
    <div class="app-form-field" :class="{
        'is-required': required,
        'is-disabled': disabled,
        'is-error': hasError,
    }">
        <div v-if="label || $slots.label" class="app-form-field__head">
            <label v-if="label" class="app-form-field__label" :for="forId">
                {{ label }}

                <span v-if="required" class="app-form-field__required" aria-hidden="true">
                    *
                </span>
            </label>

            <slot v-else name="label" />

            <span v-if="optionalText && !required" class="app-form-field__optional">
                {{ optionalText }}
            </span>
        </div>

        <p v-if="description" class="app-form-field__description">
            {{ description }}
        </p>

        <div class="app-form-field__control">
            <RenderControl />
        </div>

        <p v-if="hasError" :id="errorId" class="app-form-field__message app-form-field__message--error">
            {{ errorMessage }}
        </p>

        <p v-else-if="hint" :id="hintId" class="app-form-field__message app-form-field__message--hint">
            {{ hint }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { cloneVNode, useSlots } from "vue";

const props = withDefaults(
    defineProps<{
        label?: string;
        for?: string;
        required?: boolean;
        disabled?: boolean;
        description?: string;
        hint?: string;
        error?: string | boolean | null;
        optionalText?: string;
    }>(),
    {
        label: "",
        for: "",
        required: false,
        disabled: false,
        description: "",
        hint: "",
        error: null,
        optionalText: "선택",
    },
);

const uid = useId();
const slots = useSlots();

const forId = computed(() => props.for || `app-form-field-${uid}`);
const errorId = computed(() => `${forId.value}-error`);
const hintId = computed(() => `${forId.value}-hint`);

const hasError = computed(() => Boolean(props.error));

const errorMessage = computed(() => {
    if (typeof props.error === "string") {
        return props.error;
    }

    return "입력값을 확인해주세요.";
});

const describedBy = computed(() => {
    if (hasError.value) return errorId.value;
    if (props.hint) return hintId.value;

    return undefined;
});

function RenderControl() {
    const nodes = slots.default?.({
        id: forId.value,
        invalid: hasError.value,
        disabled: props.disabled,
        describedby: describedBy.value,
    }) ?? [];
    const injectedProps: Record<string, unknown> = {
        id: forId.value,
        ariaDescribedby: describedBy.value,
        "aria-describedby": describedBy.value,
    };

    if (hasError.value) {
        injectedProps.invalid = true;
        injectedProps.state = "error";
    }

    if (props.disabled) {
        injectedProps.disabled = true;
    }

    return nodes.map((node) =>
        typeof node.type === "symbol" ? node : cloneVNode(node, injectedProps),
    );
}
</script>
