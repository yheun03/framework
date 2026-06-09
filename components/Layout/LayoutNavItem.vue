<template>
    <li class="layout-nav__item" role="none" :class="itemClasses" :style="itemStyle">
        <div class="layout-nav__row">
            <AppIconButton v-if="hasChildren" class="layout-nav__toggle" :class="{ 'is-open': open }"
                icon="mdi:chevron-right" aria-label="메뉴 펼치기/접기" :button-size="24" :icon-size="16" :aria-expanded="open"
                :aria-controls="submenuId" @click.stop="toggleOpen" />

            <component :is="linkTag" v-bind="linkAttrs" class="layout-nav__link" role="menuitem"
                :aria-haspopup="hasChildren ? 'true' : undefined"
                :aria-expanded="hasChildren ? String(open) : undefined" @click="onClickRow">
                <span v-if="item.icon" class="layout-nav__icon app-icon" aria-hidden="true">
                    <Icon :icon="item.icon" />
                </span>

                <span class="layout-nav__label">
                    {{ item.label }}
                </span>
            </component>
        </div>

        <ul v-if="hasChildren" v-show="open" :id="submenuId" class="layout-nav__sublist" role="menu"
            :aria-label="`${item.label} submenu`">
            <LayoutNavItem v-for="child in item.children" :key="child.id" :item="child" />
        </ul>
    </li>
</template>

<script setup lang="ts">
import type { NavigationMenu } from '~/types/appNavigation'

const props = defineProps<{
    item: NavigationMenu
}>()

const hasChildren = computed(() => Boolean(props.item.children?.length))
const hasLink = computed(() => Boolean(props.item.to?.trim()))
const isExternalLink = computed(() => Boolean(props.item.newTab && hasLink.value))
const isButtonRow = computed(() => !hasLink.value)
const NuxtLinkComp = resolveComponent('NuxtLink')

const submenuId = computed(() => `submenu-${props.item.id}`)

const itemClasses = computed(() => [
    `layout-nav__item--depth-${props.item.depth}`,
    {
        'layout-nav__item--has-children': hasChildren.value,
    },
])

const itemStyle = computed(() => ({
    '--indent': `${(props.item.depth - 1) * 20}px`,
}))

const linkTag = computed(() => {
    if (isButtonRow.value) return 'button'
    if (isExternalLink.value) return 'a'
    return NuxtLinkComp
})

const linkAttrs = computed(() => {
    if (isButtonRow.value) {
        return { type: 'button' }
    }

    if (isExternalLink.value) {
        return {
            href: props.item.to,
            target: '_blank',
            rel: 'noopener noreferrer',
        }
    }

    return {
        to: props.item.to,
    }
})

const open = ref(props.item.depth === 1 && hasChildren.value)

function toggleOpen() {
    open.value = !open.value
}

function onClickRow(event: MouseEvent) {
    if (isButtonRow.value) {
        event.preventDefault()

        if (hasChildren.value) {
            toggleOpen()
        }
    }
}
</script>
