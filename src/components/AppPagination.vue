<template>
    <nav class="app-pagination" :class="[`app-pagination--${variant}`, { 'is-disabled': disabled }]" :aria-label="$t('ui.pagination.name')">
        <div v-if="showTotal" class="app-pagination__total">
            {{ $t('ui.totalPrefix') }} <strong>{{ total.toLocaleString() }}</strong
            >{{ $t('ui.totalSuffix') }}
        </div>

        <div class="app-pagination__controls">
            <template v-if="!ellipsis">
                <button
                    v-if="!isFirstBlock"
                    type="button"
                    class="app-pagination__button app-pagination__arrow"
                    :disabled="disabled"
                    :aria-label="$t('ui.pagination.first')"
                    @click="handlePageChange(1)"
                >
                    <IconDoubleLeft />
                </button>
                <button
                    v-if="!isFirstBlock"
                    type="button"
                    class="app-pagination__button app-pagination__arrow"
                    :disabled="disabled"
                    :aria-label="$t('ui.pagination.prevBlock', { n: blockSize })"
                    @click="handlePageChange(blockStart - 1)"
                >
                    <IconChevronLeft />
                </button>
            </template>
            <button
                v-else-if="!isFirstPage"
                type="button"
                class="app-pagination__button app-pagination__arrow"
                :disabled="disabled"
                :aria-label="$t('ui.pagination.prev')"
                @click="handlePageChange(normalizedPage - 1)"
            >
                <IconChevronLeft />
            </button>

            <template v-for="item in pageItems" :key="item.key">
                <span v-if="item.gap" class="app-pagination__gap" aria-hidden="true">...</span>
                <button
                    v-else
                    type="button"
                    class="app-pagination__button app-pagination__page"
                    :class="{ 'is-active': item.page === normalizedPage }"
                    :disabled="disabled"
                    :aria-current="item.page === normalizedPage ? 'page' : undefined"
                    @click="handlePageChange(item.page)"
                >
                    {{ item.page }}
                </button>
            </template>

            <template v-if="!ellipsis">
                <button
                    v-if="!isLastBlock"
                    type="button"
                    class="app-pagination__button app-pagination__arrow"
                    :disabled="disabled"
                    :aria-label="$t('ui.pagination.nextBlock', { n: blockSize })"
                    @click="handlePageChange(blockEnd + 1)"
                >
                    <IconChevronRight />
                </button>
                <button
                    v-if="!isLastBlock"
                    type="button"
                    class="app-pagination__button app-pagination__arrow"
                    :disabled="disabled"
                    :aria-label="$t('ui.pagination.last')"
                    @click="handlePageChange(totalPages)"
                >
                    <IconDoubleRight />
                </button>
            </template>
            <button
                v-else-if="!isLastPage"
                type="button"
                class="app-pagination__button app-pagination__arrow"
                :disabled="disabled"
                :aria-label="$t('ui.pagination.next')"
                @click="handlePageChange(normalizedPage + 1)"
            >
                <IconChevronRight />
            </button>
        </div>

        <div v-if="showPageSize" class="app-pagination__size">
            <AppSelect
                :model-value="pageSize"
                :items="pageSizeSelectOptions"
                :disabled="disabled"
                size="sm"
                :aria-label="$t('ui.pagination.pageSizeLabel')"
                @update:model-value="handlePageSizeChange"
            />
        </div>
    </nav>
</template>

<script setup>
import i18n from '@/i18n';
import { oneOf } from '@/utils/props';
import { IconChevronLeft, IconChevronRight, IconDoubleLeft, IconDoubleRight } from '@/components/icons';
import { computed, watch } from 'vue';
import AppSelect from '@/components/AppSelect.vue';

const props = defineProps({
    page: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    total: { type: Number, required: true },
    pageSizeOptions: { type: Array, default: () => [10, 20, 50, 100] },
    /**
     * 현재 페이지 표시 (Figma 페이지네이션)
     * - text: A타입 - 현재 페이지 굵은 글자
     * - outline: B타입 - 현재 페이지 원형 테두리
     */
    variant: { type: String, default: 'text', validator: oneOf(['text', 'outline']) },
    /** false: blockSize 개씩 묶어 « ‹ › » 로 이동 (A·B타입) / true: 1 … 현재 주변 … 마지막 + ‹ › (C타입) */
    ellipsis: { type: Boolean, default: false },
    /** 묶음 단위 페이지 수 (ellipsis 가 false 일 때) */
    blockSize: { type: Number, default: 10 },
    /** 현재 페이지 앞뒤로 보여줄 페이지 수 (ellipsis 가 true 일 때) */
    siblingCount: { type: Number, default: 2 },
    showTotal: { type: Boolean, default: true },
    showPageSize: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:page', 'update:pageSize', 'change']);

const totalPages = computed(() => {
    if (!props.total || !props.pageSize) return 1;

    return Math.max(1, Math.ceil(props.total / props.pageSize));
});

const normalizedPage = computed(() => {
    return Math.min(Math.max(props.page, 1), totalPages.value);
});

const isFirstPage = computed(() => normalizedPage.value <= 1);
const isLastPage = computed(() => normalizedPage.value >= totalPages.value);

// 묶음(block) 이동 - A·B타입
const blockStart = computed(() => Math.floor((normalizedPage.value - 1) / props.blockSize) * props.blockSize + 1);
const blockEnd = computed(() => Math.min(blockStart.value + props.blockSize - 1, totalPages.value));
const isFirstBlock = computed(() => blockStart.value === 1);
const isLastBlock = computed(() => blockEnd.value >= totalPages.value);

const pageSizeSelectOptions = computed(() =>
    props.pageSizeOptions.map((size) => ({
        label: i18n.global.t('ui.pagination.pageSize', { n: size }),
        value: size,
    })),
);

// 화면에 그릴 페이지 번호 ({ page } 또는 말줄임 { gap })
const pageItems = computed(() => {
    const total = totalPages.value;
    const toItem = (page) => ({ key: `p${page}`, page });

    if (!props.ellipsis) {
        const pages = [];
        for (let page = blockStart.value; page <= blockEnd.value; page += 1) pages.push(toItem(page));
        return pages;
    }

    const current = normalizedPage.value;
    const sibling = props.siblingCount;
    const start = Math.max(1, Math.min(current - sibling, total - sibling * 2));
    const end = Math.min(total, Math.max(current + sibling, 1 + sibling * 2));
    const items = [];

    if (start > 1) items.push(toItem(1));
    if (start > 2) items.push({ key: 'gap-start', gap: true });
    for (let page = start; page <= end; page += 1) items.push(toItem(page));
    if (end < total - 1) items.push({ key: 'gap-end', gap: true });
    if (end < total) items.push(toItem(total));

    return items;
});

watch(
    () => [props.page, props.pageSize, props.total],
    () => {
        if (props.page === normalizedPage.value) return;

        emit('update:page', normalizedPage.value);
        emit('change', {
            page: normalizedPage.value,
            pageSize: props.pageSize,
        });
    },
);

function handlePageChange(nextPage) {
    const next = Math.min(Math.max(nextPage, 1), totalPages.value);

    if (next === props.page) return;

    emit('update:page', next);
    emit('change', {
        page: next,
        pageSize: props.pageSize,
    });
}

function handlePageSizeChange(value) {
    if (typeof value === 'boolean' || value === null) return;

    const nextPageSize = Number(value);

    if (!Number.isFinite(nextPageSize) || nextPageSize <= 0) return;

    emit('update:pageSize', nextPageSize);
    emit('update:page', 1);
    emit('change', {
        page: 1,
        pageSize: nextPageSize,
    });
}
</script>
