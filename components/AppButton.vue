<template>
    <component ref="buttonEl" :is="tag" v-bind="componentAttrs" :class="classes"
        :aria-disabled="ariaDisabled" :aria-busy="loading ? 'true' : undefined"
        :tabindex="tabIndex" @click="onClick">
        <slot v-if="unstyled" />

        <template v-else>
        <!-- loading -->
        <span v-if="loading" class="app-button__spinner" aria-hidden="true" />

        <!-- left icon -->
        <i v-else-if="$slots.iconLeft" class="app-button__icon app-button__icon--left" aria-hidden="true">
            <slot name="iconLeft" />
        </i>

        <!-- label -->
        <span v-if="$slots.default" class="app-button__label">
            <slot />
        </span>

        <!-- right icon -->
        <i v-if="$slots.iconRight && !loading" class="app-button__icon app-button__icon--right" aria-hidden="true">
            <slot name="iconRight" />
        </i>
        </template>
    </component>
</template>

<script setup lang="ts">
defineOptions({
    inheritAttrs: false,
})

const attrs = useAttrs()
const buttonEl = ref<HTMLElement | null>(null)

type ButtonVariant = 'fill' | 'outline' | 'text' | 'underline'
type ButtonShape = 'square' | 'round' | 'pill'
type ButtonTone =
    | 'primary'
    | 'secondary'
    | 'gray'
    | 'danger'
    | 'warning'
    | 'success'
    | 'info'

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
    defineProps<{
        type?: ButtonType
        to?: string
        href?: string
        newTab?: boolean

        variant?: ButtonVariant
        shape?: ButtonShape
        tone?: ButtonTone
        size?: ButtonSize

        disabled?: boolean
        loading?: boolean
        block?: boolean
        unstyled?: boolean
    }>(),
    {
        type: 'button',
        variant: 'outline',
        shape: 'round',
        tone: 'gray',
        size: 'md',
        newTab: false,
        disabled: false,
        loading: false,
        block: false,
        unstyled: false
    }
)

const emit = defineEmits<{
    click: [MouseEvent]
}>()

const NuxtLinkComp = resolveComponent('NuxtLink')

/* -------------------------------------------------------
   상태
------------------------------------------------------- */

const isDisabled = computed(() => props.disabled || props.loading)
const isLink = computed(() => !!props.to || !!props.href)

/* -------------------------------------------------------
   component tag
------------------------------------------------------- */

const tag = computed(() => {
    if (props.to) return NuxtLinkComp
    if (props.href) return 'a'
    return 'button'
})

/* -------------------------------------------------------
   attributes
------------------------------------------------------- */

const componentAttrs = computed(() => {
    if (props.to) {
        return {
            to: props.to,
            ...attrs
        }
    }

    if (props.href) {
        return {
            href: props.href,
            target: props.newTab ? '_blank' : undefined,
            rel: props.newTab ? 'noopener noreferrer' : undefined,
            ...attrs
        }
    }

    return {
        type: props.type,
        disabled: isDisabled.value,
        ...attrs
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

const classes = computed(() => {
    if (props.unstyled) {
        return [
            'app-button-unstyled',
            {
                'is-disabled': isDisabled.value,
            }
        ]
    }

    return [
        'app-button',
        `app-button--variant-${props.variant}`,
        `app-button--shape-${props.shape}`,
        `app-button--size-${props.size}`,
        `app-button--tone-${props.tone}`,
        {
            'app-button--disabled': isDisabled.value,
            'app-button--loading': props.loading,
            'app-button--block': props.block,
        }
    ]
})

/* -------------------------------------------------------
   click
------------------------------------------------------- */

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
