<template>
  <div class="page-demo-stack">
    <p>호출 시 전달한 component가 모달 body를 구성합니다.</p>
    <p>현재 마지막 액션: {{ lastAction }}</p>

    <div class="page-demo-actions">
      <AppButton variant="fill" @click="handleActionClick"> 액션 실행 </AppButton>

      <AppButton variant="outline" @click="handleNestedAlertClick">
        Alert 중첩 열기
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 모달 렌더러 데모에서 전달받은 액션과 중첩 알림 실행을 관리하는 예제 컴포넌트입니다.
 */

const props = defineProps<{
  lastAction: string;
  onAction?: () => void;
  onNestedAlert?: () => void;
}>();

/* event handlers */
function handleActionClick() {
  props.onAction?.();
}

function handleNestedAlertClick() {
  props.onNestedAlert?.();
}
</script>
