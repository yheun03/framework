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

<script setup>
import { IconClose } from '@/components/icons';

import { toCssWidth } from '@/utils/css';
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppDrawer - 화면 옆에서 열리는 패널 (상세 조회 / 빠른 등록 / 필터)
 * v-model:open 으로 열고 닫습니다.
 */
const props = defineProps({
    open: { type: Boolean, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    placement: { type: String, default: 'right' },
    width: { type: [Number, String], default: 480 },
    overlay: { type: Boolean, default: true },
    closeOnBackdrop: { type: Boolean, default: true },
    closeOnEsc: { type: Boolean, default: true },
});

const emit = defineEmits(['update:open', 'close']);
const panelEl = ref(null);
const panelStyle = computed(() => ({ width: `min(${toCssWidth(props.width)}, 100vw)` }));

function close() {
    emit('update:open', false);
    emit('close');
}

watch(
    () => props.open,
    async (value) => {
        document.documentElement.classList.toggle('is-drawer-open', value);
        if (value) {
            await nextTick();
            panelEl.value?.focus();
        }
    },
);

onBeforeUnmount(() => document.documentElement.classList.remove('is-drawer-open'));
</script>
