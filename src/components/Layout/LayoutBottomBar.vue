<template>
    <!--
        화면 하단 고정 버튼 바 (저장 · 취소 등)
        - DefaultLayout 의 #layout__page-bottom-fixed 로 이동해서 그립니다.
        - defer: 대상 요소가 페이지보다 뒤에 그려지므로, 새로고침(첫 진입) 때도 보이도록 마운트 후 이동합니다.
        - 탭 화면 유지(KeepAlive)로 화면이 숨겨지면 버튼 바도 함께 숨깁니다.
        - 사용: <LayoutBottomBar><template #left>…</template><template #right>…</template></LayoutBottomBar>
    -->
    <Teleport defer to="#layout__page-bottom-fixed">
        <div v-if="isActive" class="layout__page-bottom-fixed__content">
            <div v-if="$slots.left" class="layout__page-bottom-fixed__left">
                <slot name="left" />
            </div>
            <div v-if="$slots.default || $slots.right" class="layout__page-bottom-fixed__right">
                <slot name="right">
                    <slot />
                </slot>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { onActivated, onDeactivated, ref } from 'vue';

const isActive = ref(true);

onActivated(() => {
    isActive.value = true;
});

onDeactivated(() => {
    isActive.value = false;
});
</script>
