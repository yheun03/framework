<template>
  <Teleport to="body">
    <div
      v-for="(modalItem, modalIndex) in modalStore.modals"
      :key="modalItem.id"
      class="app-modal"
      :style="{ zIndex: String(getModalZIndex(modalIndex)) }"
    >
      <div
        v-if="modalItem.overlay"
        class="app-modal__backdrop"
        @click="handleBackdropClick(modalItem)"
      />

      <div
        class="app-modal__dialog"
        :style="getDialogStyle(modalItem)"
        role="dialog"
        aria-modal="true"
        :aria-label="getAriaLabel(modalItem)"
        @click.stop
      >
        <header
          v-if="modalItem.title || modalItem.closable"
          class="app-modal__header"
        >
          <div class="app-modal__header-left">
            <h2 v-if="modalItem.title" class="app-modal__title">
              {{ modalItem.title }}
            </h2>
          </div>

          <AppIconButton
            v-if="modalItem.closable"
            class="app-modal__close"
            icon="mdi:close"
            aria-label="닫기"
            :button-size="34"
            :icon-size="18"
            @click="handleModalClose(modalItem.id, 'close')"
          />
        </header>

        <section class="app-modal__body">
          <div
            v-if="modalItem.type === 'alert'"
            class="app-alert-modal__message"
          >
            {{ modalItem.message }}
          </div>

          <div
            v-else-if="modalItem.type === 'confirm'"
            class="app-confirm-modal__message"
          >
            {{ modalItem.message }}
          </div>

          <component
            v-else
            :is="modalItem.component"
            v-bind="modalItem.componentProps"
          />
        </section>

        <footer v-if="modalItem.type !== 'custom'" class="app-modal__footer">
          <div
            v-if="modalItem.type === 'alert'"
            class="app-alert-modal__actions"
          >
            <AppButton variant="fill" @click="handleModalConfirm(modalItem.id)">
              {{ modalItem.confirmText }}
            </AppButton>
          </div>

          <div v-else class="app-confirm-modal__actions">
            <AppButton
              variant="outline"
              @click="handleModalCancel(modalItem.id)"
            >
              {{ modalItem.cancelText }}
            </AppButton>

            <AppButton variant="fill" @click="handleModalConfirm(modalItem.id)">
              {{ modalItem.confirmText }}
            </AppButton>
          </div>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from "~/stores/modal";
import type { ModalItem, ModalViewCloseReason } from "~/types/appModal";

const modalStore = useModalStore();

const topModal = computed(() => {
  return (
    modalStore.modals.find(
      (modalItem) => modalItem.id === modalStore.topModalId,
    ) ?? null
  );
});

function getModalZIndex(modalIndex: number) {
  return 2000 + modalIndex * 10;
}

function getDialogStyle(modalItem: ModalItem) {
  return {
    width: modalItem.width,
    height: modalItem.height,
  };
}

function getAriaLabel(modalItem: ModalItem) {
  return modalItem.title || "모달";
}

function isTopModal(modalId: number) {
  return modalId === modalStore.topModalId;
}

function handleBackdropClick(modalItem: ModalItem) {
  if (!modalItem.closeOnDim) return;
  if (!isTopModal(modalItem.id)) return;
  handleModalClose(modalItem.id, "backdrop");
}

function handleKeydown(event: KeyboardEvent) {
  const modalItem = topModal.value;

  if (!modalItem?.closeOnEsc) return;
  if (event.key !== "Escape") return;

  event.preventDefault();
  handleModalClose(modalItem.id, "esc");
}

function handleModalClose(
  modalId: number | undefined | null,
  reason?: ModalViewCloseReason,
) {
  if (modalId == null) return;
  modalStore.modalClose(modalId, reason);
}

function handleModalCancel(modalId: number | undefined | null) {
  if (modalId == null) return;
  modalStore.modalCancel(modalId);
}

function handleModalConfirm(modalId: number | undefined | null) {
  if (modalId == null) return;
  modalStore.modalConfirm(modalId);
}

onMounted(() => {
  if (import.meta.server) return;
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  if (import.meta.server) return;
  window.removeEventListener("keydown", handleKeydown);
});
</script>
