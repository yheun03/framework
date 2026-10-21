<template>
    <ul class="app-timeline" :class="`app-timeline--${size}`">
        <li
            v-for="(item, index) in items"
            :key="item.id ?? index"
            class="app-timeline__item"
            :class="`app-timeline__item--tone-${item.tone ?? 'gray'}`"
        >
            <span v-if="item.time && timePosition === 'left'" class="app-timeline__time app-timeline__time--left">{{ item.time }}</span>
            <span class="app-timeline__marker" aria-hidden="true" />
            <div class="app-timeline__content">
                <slot :item="item" :index="index">
                    <div class="app-timeline__head">
                        <strong class="app-timeline__title">{{ item.title }}</strong>
                        <AppTag v-if="item.tag" size="xs" variant="soft" :tone="item.tone ?? 'gray'">{{ item.tag }}</AppTag>
                        <span v-if="item.time && timePosition === 'right'" class="app-timeline__time">{{ item.time }}</span>
                    </div>
                    <p v-if="item.description" class="app-timeline__desc">{{ item.description }}</p>
                </slot>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { AppId, AppTone } from '~/types/appCommon';

export type AppTimelineItem = {
    id?: AppId;
    title: string;
    description?: string;
    time?: string;
    tag?: string;
    tone?: AppTone;
};

/**
 * AppTimeline - 작업/변경/알람 이력 (LOT 추적, 설비 이벤트 로그 등)
 */
withDefaults(
    defineProps<{
        items: AppTimelineItem[];
        /** 시간 표시 위치 */
        timePosition?: 'left' | 'right';
        size?: 'sm' | 'md';
    }>(),
    {
        timePosition: 'right',
        size: 'md',
    },
);
</script>
