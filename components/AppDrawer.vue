<template>
    <Teleport to="body">
        <Transition name="app-drawer">
            <div v-if="open" class="app-drawer" :class="`app-drawer--${placement}`" @keydown.esc="closeOnEsc && close()">
                <div v-if="overlay" class="app-drawer__backdrop" @click="closeOnBackdrop && close()" />
                <section
                    ref="panelEl"
                    class="app-drawer__panel"
                    :style="panelStyle"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="title"
                    tabindex="-1"
                >
                    <header v-if="title || $slots.header" class="app-drawer__header">
                        <slot name="header">
                            <div class="app-drawer__heading">
                                <h2 class="app-drawer__title">{{ title }}</h2>
                                <p v-if="description" class="app-drawer__desc">{{ description }}</p>
                            </div>
                        </slot>
                        <AppIconButton aria-label="닫기" size="lg" @click="close"><IconClose /></AppIconButton>
                    </header>
                    <div class="app-drawer__body"><slot /></div>
                    <footer v-if="$slots.footer" class="app-drawer__footer"><slot name="footer" /></footer>
                </section>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { IconClose } from '~/components/icons';
import type { AppWidth } from '~/types/appCommon';
import { toCssWidth } from '~/utils/css';

/**
 * AppDrawer - 화면 옆에서 열리는 패널 (상세 조회 / 빠른 등록 / 필터)
 * v-model:open 으로 열고 닫습니다.
 */
const props = withDefaults(
    defineProps<{
        open: boolean;
        title?: string;
        description?: string;
        placement?: 'right' | 'left';
        width?: AppWidth;
        overlay?: boolean;
        closeOnBackdrop?: boolean;
        closeOnEsc?: boolean;
    }>(),
    {
        title: '',
        description: '',
        placement: 'right',
        width: 480,
        overlay: true,
        closeOnBackdrop: true,
        closeOnEsc: true,
    },
);

const emit = defineEmits<{ 'update:open': [boolean]; close: [] }>();
const panelEl = ref<HTMLElement | null>(null);
const panelStyle = computed(() => ({ width: `min(${toCssWidth(props.width)}, 100vw)` }));

function close() {
    emit('update:open', false);
    emit('close');
}

watch(
    () => props.open,
    async (value) => {
        if (!import.meta.client) return;
        document.documentElement.classList.toggle('is-drawer-open', value);
        if (value) {
            await nextTick();
            panelEl.value?.focus();
        }
    },
);

onBeforeUnmount(() => import.meta.client && document.documentElement.classList.remove('is-drawer-open'));
</script>
