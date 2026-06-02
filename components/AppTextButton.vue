<template>
    <component
        ref="buttonEl"
        :is="tag"
        v-bind="componentAttrs"
        :class="classes"
        :style="mergedStyles"
        :aria-disabled="ariaDisabled"
        :aria-busy="loading ? 'true' : undefined"
        :tabindex="tabIndex"
        @click="onClick"
    >
        <span v-if="loading" class="app-button__spinner" aria-hidden="true" />

        <i v-else-if="$slots.iconLeft" class="app-button__icon app-button__icon--left" aria-hidden="true">
            <slot name="iconLeft" />
        </i>

        <span v-if="$slots.default" class="app-button__label">
            <slot />
        </span>

        <i v-if="$slots.iconRight && !loading" class="app-button__icon app-button__icon--right" aria-hidden="true">
            <slot name="iconRight" />
        </i>
    </component>
</template>

<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
})

const attrs = useAttrs()
const buttonEl = ref<HTMLElement | null>(null)

type TextButtonVariant = 'text' | 'underline'
type CssSize = number | string
type TextButtonTone =
    | 'primary'
    | 'secondary'
    | 'gray'
    | 'danger'
    | 'warning'
    | 'success'
    | 'info'
type TextButtonSize = 'sm' | 'md' | 'lg'
type TextButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
    defineProps<{
        type?: TextButtonType
        to?: string
        href?: string
        newTab?: boolean
        variant?: TextButtonVariant
        tone?: TextButtonTone
        size?: TextButtonSize
        width?: CssSize
        height?: CssSize
        disabled?: boolean
        loading?: boolean
    }>(),
    {
        type: 'button',
        variant: 'text',
        tone: 'gray',
        size: 'md',
        width: undefined,
        height: undefined,
        newTab: false,
        disabled: false,
        loading: false,
    },
)

const emit = defineEmits<{
    click: [MouseEvent]
}>()

const NuxtLinkComp = resolveComponent('NuxtLink')
const isDisabled = computed(() => props.disabled || props.loading)
const isLink = computed(() => !!props.to || !!props.href)

const tag = computed(() => {
    if (props.to) return NuxtLinkComp
    if (props.href) return 'a'
    return 'button'
})

const componentAttrs = computed(() => {
    const { class: _class, style: _style, ...passthroughAttrs } = attrs

    if (props.to) {
        return {
            to: props.to,
            ...passthroughAttrs,
        }
    }

    if (props.href) {
        return {
            href: props.href,
            target: props.newTab ? '_blank' : undefined,
            rel: props.newTab ? 'noopener noreferrer' : undefined,
            ...passthroughAttrs,
        }
    }

    return {
        type: props.type,
        disabled: isDisabled.value,
        ...passthroughAttrs,
    }
})

const mergedStyles = computed(() => [
    attrs.style as string | Record<string, string> | undefined,
    syncedSizeStyles.value,
])

function toCssSize(value?: CssSize) {
    if (value == null || value === '') return undefined
    return typeof value === 'number' ? `${value}px` : value
}

const syncedSizeStyles = computed(() => {
    const width = toCssSize(props.width)
    const height = toCssSize(props.height)

    return {
        width,
        minWidth: width,
        height,
        minHeight: height,
    }
})

const ariaDisabled = computed(() => {
    if (!isLink.value) return undefined
    return isDisabled.value ? 'true' : undefined
})

const tabIndex = computed(() => {
    if (isLink.value && isDisabled.value) return -1
    return undefined
})

const classes = computed(() => [
    'app-button',
    `app-button--variant-${props.variant}`,
    `app-button--size-${props.size}`,
    `app-button--tone-${props.tone}`,
    {
        'app-button--disabled': isDisabled.value,
        'app-button--loading': props.loading,
    },
])

function onClick(e: MouseEvent) {
    if (isDisabled.value) {
        e.preventDefault()
        e.stopPropagation()
        return
    }

    emit('click', e)
}

function focus() {
    buttonEl.value?.focus()
}

defineExpose({
    focus,
})
</script>
