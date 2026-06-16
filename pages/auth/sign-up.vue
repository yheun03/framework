<template>
    <div class="login login--signup">
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

        <main class="login__panel" aria-label="가입 폼">
            <div class="login__panel-inner">
                <header class="login__header">
                    <h1 class="login__title">가입하기</h1>
                    <p class="login__desc">간단한 정보로 계정을 만들 수 있어요.</p>
                </header>

                <form class="login__form" @submit.prevent="handleSubmit">
                    <AppInput v-model="name" name="name" label="이름" placeholder="홍길동" />
                    <AppInput v-model="email" name="email" type="email" label="이메일" placeholder="name@company.com" />
                    <AppInput v-model="password" name="password" type="password" label="비밀번호" placeholder="비밀번호 입력" />
                    <AppInput v-model="password2" name="password2" type="password" label="비밀번호 확인"
                        placeholder="비밀번호 확인" />

                    <div class="login__checks">
                        <AppChoice v-model="agreeTerms" type="checkbox" label="이용약관에 동의합니다" />
                        <AppChoice v-model="agreeMarketing" type="checkbox" label="마케팅 정보 수신에 동의합니다 (선택)" />
                    </div>

                    <AppButton class="login__submit" type="submit" variant="fill" size="lg" :disabled="!canSubmit">
                        가입하기
                    </AppButton>

                    <div class="login__helper">
                        <span class="login__helper-text">이미 계정이 있으신가요?</span>
                        <NuxtLink class="login__link" to="/auth/sign-in">로그인</NuxtLink>
                    </div>
                </form>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
/**
 * 회원가입 폼 입력과 데모용 제출 처리를 담당하는 페이지 컴포넌트입니다.
 */

/* 페이지 설정 */
definePageMeta({
    layout: false,
});

/* ref/reactive state */
const name = ref("");
const email = ref("");
const password = ref("");
const password2 = ref("");
const agreeTerms = ref(false);
const agreeMarketing = ref(false);

/* computed */
const canSubmit = computed(() => {
    if (!name.value.trim()) return false;
    if (!email.value.trim()) return false;
    if (!password.value.trim()) return false;
    if (password.value !== password2.value) return false;
    if (!agreeTerms.value) return false;
    return true;
});

/* event handlers */
function handleSubmit() {
    navigateTo("/auth/sign-in");
}
</script>
