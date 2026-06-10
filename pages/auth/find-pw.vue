<template>
  <div class="login login--forgot">
    <section class="login__hero" aria-label="브랜드 이미지 영역">
      <div class="login__hero-inner">
        <div class="login__brand">
          <div class="login__logo" aria-hidden="true">
            <Icon icon="mdi:application-braces-outline" />
          </div>
          <p class="login__tagline">워크스페이스 + UI 데모를 위한 Framework</p>
        </div>

        <p class="login__copyright">
          © {{ new Date().getFullYear() }} Framework. All rights reserved.
        </p>
      </div>
    </section>

    <main class="login__panel" aria-label="비밀번호 찾기 폼">
      <div class="login__panel-inner">
        <header class="login__header">
          <h1 class="login__title">비밀번호 찾기</h1>
          <p class="login__desc">가입한 이메일로 재설정 링크를 보내드릴게요.</p>
        </header>

        <form class="login__form" @submit.prevent="handleSubmit">
          <AppInput
            v-model="email"
            name="email"
            type="email"
            label="이메일"
            placeholder="name@company.com"
          />

          <AppButton
            class="login__submit"
            type="submit"
            variant="fill"
            size="lg"
            :disabled="!canSubmit"
          >
            재설정 링크 보내기
          </AppButton>

          <div class="login__helper">
            <NuxtLink class="login__link" to="/auth/sign-in"
              >로그인으로 돌아가기</NuxtLink
            >
            <span class="login__helper-sep" aria-hidden="true">·</span>
            <NuxtLink class="login__link" to="/auth/sign-up">가입하기</NuxtLink>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 비밀번호 찾기 폼 입력과 데모용 제출 처리를 담당하는 페이지 컴포넌트입니다.
 */

/* 페이지 설정 */
definePageMeta({
  layout: false,
});

/* ref/reactive state */
const email = ref("");

/* computed */
const canSubmit = computed(() => email.value.trim().length > 0);

/* event handlers */
function handleSubmit() {
  navigateTo("/auth/sign-in");
}
</script>
