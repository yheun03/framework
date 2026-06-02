<template>
    <component ref="buttonEl" :is="tag" v-bind="componentAttrs" :class="classes" :style="mergedStyles"
        :aria-label="ariaLabel" :aria-disabled="ariaDisabled" :tabindex="tabIndex" @click="handleClick">
        <slot>
            <Icon v-if="icon" :icon="icon" />
        </slot>
    </component>
</template>

<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
})

const attrs = useAttrs()
const buttonEl = ref<HTMLElement | null>(null)

type IconButtonType = 'button' | 'submit' | 'reset'
type IconButtonVariant = 'plain' | 'soft' | 'outline'
type IconButtonShape = 'square' | 'round' | 'pill'
type IconButtonTone =
    | 'primary'
    | 'secondary'
    | 'gray'
    | 'danger'
    | 'warning'
    | 'success'
    | 'info'

type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type CssSize = number | string

const props = withDefaults(
    defineProps<{
        icon?: string
        ariaLabel: string
        type?: IconButtonType
        to?: string
        href?: string
        newTab?: boolean
        variant?: IconButtonVariant
        shape?: IconButtonShape
        tone?: IconButtonTone
        buttonSize?: IconButtonSize | number
        iconSize?: IconButtonSize | number
        width?: CssSize
        height?: CssSize
        disabled?: boolean
    }>(),
    {
        type: 'button',
        variant: 'plain',
        shape: 'round',
        tone: 'gray',
        buttonSize: 'md',
        iconSize: 'md',
        width: undefined,
        height: undefined,
        newTab: false,
        disabled: false,
    },
)

const emit = defineEmits<{
    click: [MouseEvent]
}>()

const NuxtLinkComp = resolveComponent('NuxtLink')
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
        disabled: props.disabled,
        ...passthroughAttrs,
    }
})

const ariaDisabled = computed(() => {
    if (!isLink.value) return undefined
    return props.disabled ? 'true' : undefined
})

const tabIndex = computed(() => {
    if (isLink.value && props.disabled) return -1
    return undefined
})

function sizeToCss(size: IconButtonSize | number, map: Record<IconButtonSize, number>) {
    if (typeof size === 'number') return `${size}px`
    return `${map[size]}px`
}

const buttonSizeMap: Record<IconButtonSize, number> = {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 36,
    xl: 40,
}

const iconSizeMap: Record<IconButtonSize, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
}

const styles = computed(() => ({
    '--icon-button-size': sizeToCss(props.buttonSize, buttonSizeMap),
    '--icon-size': sizeToCss(props.iconSize, iconSizeMap),
}))

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

const mergedStyles = computed(() => [
    attrs.style as string | Record<string, string> | undefined,
    syncedSizeStyles.value,
    styles.value,
])

const classes = computed(() => [
    'app-icon-button',
    `app-icon-button--variant-${props.variant}`,
    `app-icon-button--shape-${props.shape}`,
    `app-icon-button--tone-${props.tone}`,
    {
        'app-icon-button--disabled': props.disabled,
    },
])

function handleClick(e: MouseEvent) {
    if (props.disabled) {
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
