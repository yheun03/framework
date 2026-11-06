<template>
    <Teleport to="body">
        <div
            v-for="(modalItem, modalIndex) in modalStore.modals"
            :key="modalItem.id"
            :class="getModalClass(modalItem)"
            :style="{ zIndex: String(getModalZIndex(modalIndex)) }"
        >
            <div v-if="modalItem.overlay" class="app-modal__backdrop" @click="handleBackdropClick(modalItem)" />

            <div
                :class="getDialogClass(modalItem)"
                :style="getDialogStyle(modalItem)"
                role="dialog"
                aria-modal="true"
                :aria-label="getAriaLabel(modalItem)"
                @click.stop
            >
                <header v-if="modalItem.title || modalItem.closable" class="app-modal__header">
                    <div class="app-modal__header-left">
                        <h2 v-if="modalItem.title" class="app-modal__title">
                            {{ modalItem.title }}
                        </h2>
                    </div>

                    <AppIconButton
                        v-if="modalItem.closable"
                        class="app-modal__close"
                        aria-label="닫기"
                        :size="34"
                        :icon-size="18"
                        @click="handleModalClose(modalItem.id, 'close')"
                    >
                        <IconClose />
                    </AppIconButton>
                </header>

                <section class="app-modal__body">
                    <div v-if="modalItem.type === 'alert'" class="app-alert-modal__message">
                        {{ modalItem.message }}
                    </div>

                    <div v-else-if="modalItem.type === 'confirm'" class="app-confirm-modal__message">
                        {{ modalItem.message }}
                    </div>

                    <component v-else :is="modalItem.component" v-bind="modalItem.componentProps" />
                </section>

                <footer v-if="hasFooter(modalItem)" class="app-modal__footer">
                    <div v-if="modalItem.type === 'alert'" class="app-modal__actions app-alert-modal__actions">
                        <AppButton variant="fill" @click="handleModalConfirm(modalItem.id)">
                            {{ modalItem.confirmText }}
                        </AppButton>
                    </div>

                    <div v-else-if="modalItem.type === 'confirm'" class="app-modal__actions app-confirm-modal__actions">
                        <AppButton variant="outline" @click="handleModalCancel(modalItem.id)">
                            {{ modalItem.cancelText }}
                        </AppButton>

                        <AppButton variant="fill" @click="handleModalConfirm(modalItem.id)">
                            {{ modalItem.confirmText }}
                        </AppButton>
                    </div>

                    <component v-else-if="modalItem.footerComponent" :is="modalItem.footerComponent" v-bind="modalItem.footerProps" />

                    <div v-else-if="modalItem.footer" class="app-modal__actions app-custom-modal__actions">
                        <AppButton variant="outline" @click="handleCustomModalCancel(modalItem)">
                            {{ modalItem.cancelText }}
                        </AppButton>

                        <AppButton variant="fill" @click="handleCustomModalConfirm(modalItem)">
                            {{ modalItem.confirmText }}
                        </AppButton>
                    </div>
                </footer>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { IconClose } from '@/components/icons';
import { useModalStore } from '@/store/modal';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';

const modalStore = useModalStore();

const topModal = computed(() => {
    return modalStore.modals.find((modalItem) => modalItem.id === modalStore.topModalId) ?? null;
});

function getModalZIndex(modalIndex) {
    return 2000 + modalIndex * 10;
}

function getModalClass(modalItem) {
    return ['app-modal', getModifierClass('app-modal', modalItem.variant)];
}

function getDialogClass(modalItem) {
    return ['app-modal__dialog', getModifierClass('app-modal__dialog', modalItem.variant)];
}

function getModifierClass(block, variant) {
    return variant ? `${block}--${variant}` : null;
}

function getDialogStyle(modalItem) {
    return {
        width: modalItem.width,
        height: modalItem.height,
    };
}

function hasFooter(modalItem) {
    if (modalItem.type !== 'custom') return true;
    return Boolean(modalItem.footerComponent || modalItem.footer);
}

function getAriaLabel(modalItem) {
    return modalItem.title || '모달';
}

function isTopModal(modalId) {
    return modalId === modalStore.topModalId;
}

function handleBackdropClick(modalItem) {
    if (!modalItem.closeOnBackdrop) return;
    if (!isTopModal(modalItem.id)) return;
    handleModalClose(modalItem.id, 'backdrop');
}

function handleKeydown(event) {
    const modalItem = topModal.value;

    if (!modalItem?.closeOnEsc) return;
    if (event.key !== 'Escape') return;

    event.preventDefault();
    handleModalClose(modalItem.id, 'esc');
}

function handleModalClose(modalId, reason) {
    if (modalId == null) return;
    modalStore.modalClose(modalId, reason);
}

function handleModalCancel(modalId) {
    if (modalId == null) return;
    modalStore.modalCancel(modalId);
}

function handleModalConfirm(modalId) {
    if (modalId == null) return;
    modalStore.modalConfirm(modalId);
}

function handleCustomModalCancel(modalItem) {
    if (modalItem.type !== 'custom') return;
    modalItem.onCancel?.();
    modalStore.modalClose(modalItem.id, 'cancel');
}

function handleCustomModalConfirm(modalItem) {
    if (modalItem.type !== 'custom') return;

    if (modalItem.keepOnConfirm !== true) {
        modalStore.modalClose(modalItem.id, 'confirm');
    }

    modalItem.onConfirm?.();
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>
