<template>
    <li
        class="layout-nav__item"
        :class="[
            `layout-nav__item--depth-${item.depth}`,
            { 'layout-nav__item--has-children': hasChildren, 'layout-nav__item--current': containsActive },
        ]"
        :style="{ '--indent': `${(item.depth - 1) * 20}px` }"
    >
        <div class="layout-nav__row">
            <a v-if="isExternalLink" :href="item.to" target="_blank" rel="noopener noreferrer" class="layout-nav__link">
                <span v-if="itemIcon" class="layout-nav__icon app-icon" aria-hidden="true">
                    <component :is="itemIcon" />
                </span>
                <span class="layout-nav__label">
                    <template v-for="(part, index) in labelParts" :key="index">
                        <mark v-if="part.match" class="layout-nav__mark">{{ part.text }}</mark>
                        <template v-else>{{ part.text }}</template>
                    </template>
                </span>
                <span class="sr-only">(새 창)</span>
            </a>

            <RouterLink v-else-if="hasLink" :to="item.to" class="layout-nav__link">
                <span v-if="itemIcon" class="layout-nav__icon app-icon" aria-hidden="true">
                    <component :is="itemIcon" />
                </span>
                <span class="layout-nav__label">
                    <template v-for="(part, index) in labelParts" :key="index">
                        <mark v-if="part.match" class="layout-nav__mark">{{ part.text }}</mark>
                        <template v-else>{{ part.text }}</template>
                    </template>
                </span>
            </RouterLink>

            <!-- 하위 메뉴가 있는 그룹: 제목 영역 전체가 펼치기/접기 버튼 -->
            <button
                v-else
                type="button"
                class="layout-nav__link layout-nav__link--group"
                :aria-expanded="hasChildren ? isOpen : undefined"
                :aria-controls="hasChildren ? `submenu-${item.id}` : undefined"
                @click="handleToggleOpen"
            >
                <span v-if="itemIcon" class="layout-nav__icon app-icon" aria-hidden="true">
                    <component :is="itemIcon" />
                </span>
                <span class="layout-nav__label">
                    <template v-for="(part, index) in labelParts" :key="index">
                        <mark v-if="part.match" class="layout-nav__mark">{{ part.text }}</mark>
                        <template v-else>{{ part.text }}</template>
                    </template>
                </span>
                <span v-if="hasChildren" class="layout-nav__count" :aria-label="`하위 메뉴 ${item.children?.length}개`">{{
                    item.children?.length
                }}</span>
                <span v-if="hasChildren" class="layout-nav__toggle" :class="{ 'is-open': isOpen }" aria-hidden="true">
                    <IconChevronSmallRight />
                </span>
            </button>
        </div>

        <Transition name="layout-nav-sublist">
            <ul v-if="hasChildren && isOpen" :id="`submenu-${item.id}`" class="layout-nav__sublist" :aria-label="item.label">
                <LayoutNavItem v-for="child in item.children" :key="child.id" :item="child" :keyword="keyword" />
            </ul>
        </Transition>
    </li>
</template>

<script setup>
import {
    IconChevronSmallRight,
    IconCog,
    IconDashboard,
    IconFactory,
    IconGlobe,
    IconGuide,
    IconHome,
    IconInfo,
    IconLayout,
    IconPalette,
    IconWidgets,
} from '@/components/icons';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import LayoutNavItem from '@/components/Layout/LayoutNavItem.vue';

/**
 * LayoutNavItem
 * - 그룹은 현재 페이지가 속한 그룹만 처음에 펼칩니다.
 * - keyword(메뉴 검색어)가 있으면 모든 그룹을 펼치고 일치하는 글자를 강조합니다.
 */
const props = defineProps({
    item: { type: Object, required: true },
    keyword: { type: String, default: '' },
});

const route = useRoute();
const navigationIconMap = {
    cog: IconCog,
    dashboard: IconDashboard,
    factory: IconFactory,
    home: IconHome,
    info: IconInfo,
    widgets: IconWidgets,
    guide: IconGuide,
    palette: IconPalette,
    globe: IconGlobe,
    layout: IconLayout,
};

const hasChildren = computed(() => Boolean(props.item.children?.length));
const itemIcon = computed(() => (props.item.icon ? navigationIconMap[props.item.icon] : null));
const hasLink = computed(() => Boolean(props.item.to?.trim()));
const isExternalLink = computed(() => Boolean(props.item.newTab && hasLink.value));
// 정적 배포(GitHub Pages)에서는 주소 끝에 '/' 가 붙으므로 제거하고 비교합니다.
const currentPath = computed(() => route.path.replace(/\/$/, '') || '/');
const containsActive = computed(() => Boolean(props.item.children?.some((child) => child.to && currentPath.value === child.to)));

const open = ref(containsActive.value);
const isOpen = computed(() => Boolean(props.keyword) || open.value);

// 다른 그룹의 페이지로 이동하면 해당 그룹을 펼칩니다. (사용자가 연 그룹은 유지)
watch(containsActive, (active) => {
    if (active) open.value = true;
});

function handleToggleOpen() {
    open.value = !open.value;
}

// 검색어와 일치하는 부분을 <mark> 로 나눕니다.
const labelParts = computed(() => {
    const label = props.item.label;
    const index = props.keyword ? label.toLowerCase().indexOf(props.keyword) : -1;
    if (index < 0) return [{ text: label, match: false }];

    return [
        { text: label.slice(0, index), match: false },
        { text: label.slice(index, index + props.keyword.length), match: true },
        { text: label.slice(index + props.keyword.length), match: false },
    ].filter((part) => part.text);
});
</script>
