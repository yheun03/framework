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
                        <AppIconButton :aria-label="$t('ui.close')" size="sm" @click="close"><IconClose /></AppIconButton>
                    </header>
                    <div class="app-drawer__body"><slot /></div>
                    <footer v-if="$slots.footer" class="app-drawer__footer"><slot name="footer" /></footer>
                </section>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { oneOf } from '@/utils/props';
import { IconClose } from '@/components/icons';

import { toCssWidth } from '@/utils/css';
import { computed, nextTick, onBeforeUnmount, onDeactivated, ref, watch } from 'vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

/**
 * AppDrawer - 화면 옆에서 열리는 패널 (상세 조회 / 빠른 등록 / 필터)
 * v-model:open 으로 열고 닫습니다.
 */
const props = defineProps({
    open: { type: Boolean, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    placement: { type: String, default: 'right', validator: oneOf(['right', 'left']) },
    /** 너비: sm 360 · md 480 · lg 640 (모달과 같은 이름). 특별한 경우만 width 로 직접 지정 */
    size: { type: String, default: 'md', validator: oneOf(['sm', 'md', 'lg']) },
    width: { type: [Number, String], default: undefined },
    overlay: { type: Boolean, default: true },
    closeOnBackdrop: { type: Boolean, default: true },
    closeOnEsc: { type: Boolean, default: true },
});

const emit = defineEmits(['update:open', 'close']);
const panelEl = ref(null);
const DRAWER_SIZES = { sm: 360, md: 480, lg: 640 };
const panelStyle = computed(() => ({ width: `min(${toCssWidth(props.width ?? DRAWER_SIZES[props.size])}, 100vw)` }));

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

// 탭 전환(KeepAlive)으로 화면이 숨겨지면 열린 드로어를 닫습니다.
onDeactivated(() => {
    if (props.open) close();
});
</script>
