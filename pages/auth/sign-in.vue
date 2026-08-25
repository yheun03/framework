<template>
    <AuthPageShell panel-label="로그인 폼">
        <header class="auth-page__header">
            <p class="auth-page__step">Welcome back</p>
            <h1 class="auth-page__title">로그인</h1>
            <p class="auth-page__desc">Framework 워크스페이스에 로그인하세요.</p>
        </header>

        <form class="auth-page__form" novalidate @submit.prevent="handleSubmit">
            <AppInput
                v-model="email"
                id="sign-in-email"
                name="email"
                type="email"
                size="lg"
                label="이메일"
                placeholder="name@company.com"
                autocomplete="email"
                clearable
                :state="emailState"
                :hint="emailHint"
            >
                <template #iconLeft><IconEmail /></template>
            </AppInput>

            <AppInput
                v-model="password"
                id="sign-in-password"
                name="password"
                type="password"
                size="lg"
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                autocomplete="current-password"
                password-toggle
                :state="passwordState"
                :hint="passwordHint"
            >
                <template #iconLeft><IconLock /></template>
            </AppInput>

            <div class="auth-page__row">
                <AppChoice v-model="rememberMe" type="checkbox" size="sm" variant="round" label="로그인 상태 유지" />
                <NuxtLink class="auth-page__link" to="/auth/find-pw">비밀번호 찾기</NuxtLink>
            </div>

            <AppButton type="submit" variant="fill" tone="primary" size="xl" block>로그인</AppButton>
        </form>

        <div class="auth-page__footer">
            <span class="auth-page__footer-text">아직 계정이 없으신가요?</span>
            <NuxtLink class="auth-page__link" to="/auth/sign-up">회원가입</NuxtLink>
        </div>
    </AuthPageShell>
</template>

<script setup lang="ts">
import { IconEmail, IconLock } from '~/components/icons';

definePageMeta({ layout: false });
useHead({ title: '로그인 | Framework' });

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const submitted = ref(false);
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const emailState = computed(() => (submitted.value && !isEmailValid.value ? 'error' : null));
const emailHint = computed(() => (submitted.value && !isEmailValid.value ? '올바른 이메일 주소를 입력해 주세요.' : undefined));
const passwordState = computed(() => (submitted.value && !password.value ? 'error' : null));
const passwordHint = computed(() => (submitted.value && !password.value ? '비밀번호를 입력해 주세요.' : undefined));

function handleSubmit() {
    submitted.value = true;
    if (!isEmailValid.value || !password.value) return;
    navigateTo('/');
}
</script>
