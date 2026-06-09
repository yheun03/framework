<template>
    <div class="route-tabs" role="navigation" aria-label="페이지 탭">
        <div class="route-tabs__scroller">
            <ul class="route-tabs__list" role="tablist" aria-label="최근 방문 페이지">
                <li v-for="t in tabs" :key="t.key" class="route-tabs__item" role="presentation">
                    <NuxtLink class="route-tabs__tab" :class="{ 'is-active': t.key === currentKey }" role="tab"
                        :aria-selected="t.key === currentKey" :to="t.path" @click="() => onClickTab(t.key)">
                        <span class="route-tabs__title">{{ getTabTitle(t) }}</span>
                    </NuxtLink>

                    <AppIconButton class="route-tabs__close" icon="mdi:close" aria-label="탭 닫기" :button-size="20"
                        :icon-size="12" @click="(e) => onClose(e, t.key)" />
                </li>
            </ul>
        </div>
        <div class="route-tabs__actions">
            <AppIconButton icon="mdi:chevron-left" aria-label="왼쪽 탭으로 이동" :button-size="28" :icon-size="20"
                @click="moveToLeftTab" />
            <AppIconButton icon="mdi:chevron-right" aria-label="오른쪽 탭으로 이동" :button-size="28" :icon-size="20"
                @click="moveToRightTab" />
            <AppIconButton icon="mdi:close" aria-label="다른 탭 닫기" :button-size="28" :icon-size="20"
                @click="closeOtherTabs" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouteTabsStore } from '~/stores/routeTabs'
import { useI18nText } from '~/composables/useI18nText'

const router = useRouter()
const route = useRoute()
const store = useRouteTabsStore()
const { t } = useI18nText()

const { tabs, activeKey } = storeToRefs(store)
const currentKey = computed(() => activeKey.value ?? route.fullPath)

function onClickTab(key: string) {
    store.activate(key)
}

function getTabTitle(tab: { title: string; labelKey?: string }) {
    return tab.labelKey ? t(tab.labelKey, tab.title) : tab.title
}

const HOME_PATHS = new Set(['/', './'])

function isHomeTab(path: string) {
    return HOME_PATHS.has(path)
}

async function moveToLeftTab() {
    const idx = tabs.value.findIndex((t) => t.key === currentKey.value)
    if (idx <= 0) return

    const target = tabs.value[idx - 1]
    if (!target) return
    store.activate(target.key)
    await router.push(target.path)
}

async function moveToRightTab() {
    const idx = tabs.value.findIndex((t) => t.key === currentKey.value)
    if (idx < 0 || idx >= tabs.value.length - 1) return

    const target = tabs.value[idx + 1]
    if (!target) return
    store.activate(target.key)
    await router.push(target.path)
}

function closeOtherTabs() {
    tabs.value
        .filter((t) => t.key !== currentKey.value && !isHomeTab(t.path))
        .map((t) => t.key)
        .forEach((key) => store.close(key))
}

async function onClose(e: MouseEvent, key: string) {
    e.preventDefault()
    e.stopPropagation()

    const closingActive = currentKey.value === key
    const idx = tabs.value.findIndex((t) => t.key === key)
    const fallback = tabs.value[Math.max(0, idx - 1)] ?? tabs.value[idx + 1] ?? null

    store.close(key)

    if (closingActive && fallback) {
        await router.push(fallback.path)
    }
}
</script>
