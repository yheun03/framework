<template>
    <AuthPageShell
        panel-label="회원가입 폼"
        eyebrow="Start with Framework"
        hero-title="하나의 계정으로\n팀의 업무를 연결하세요"
        hero-description="공통 컴포넌트로 구성된 안정적인 업무 환경을 바로 시작할 수 있습니다."
        :features="['간편한 계정 생성', '팀 워크스페이스 연결', '모든 디바이스에서 이용']"
    >
        <header class="auth-page__header">
            <p class="auth-page__step">Create account</p>
            <h1 class="auth-page__title">회원가입</h1>
            <p class="auth-page__desc">필수 정보를 입력해 새 계정을 만들어 보세요.</p>
        </header>

        <form class="auth-page__form" novalidate @submit.prevent="handleSubmit">
            <div class="auth-page__field-row">
                <AppInput
                    v-model="name"
                    id="sign-up-name"
                    name="name"
                    size="lg"
                    label="이름"
                    placeholder="홍길동"
                    autocomplete="name"
                    clearable
                    :state="fieldState(name)"
                    :hint="fieldHint(name, '이름을 입력해 주세요.')"
                >
                    <template #iconLeft><IconAccount /></template>
                </AppInput>
                <AppInput
                    v-model="email"
                    id="sign-up-email"
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
            </div>

            <AppInput
                v-model="password"
                id="sign-up-password"
                name="password"
                type="password"
                size="lg"
                label="비밀번호"
                placeholder="8자 이상 입력하세요"
                autocomplete="new-password"
                password-toggle
                :state="passwordState"
                :hint="passwordHint"
            >
                <template #iconLeft><IconLock /></template>
            </AppInput>
            <AppInput
                v-model="passwordConfirm"
                id="sign-up-password-confirm"
                name="passwordConfirm"
                type="password"
                size="lg"
                label="비밀번호 확인"
                placeholder="비밀번호를 한 번 더 입력하세요"
                autocomplete="new-password"
                password-toggle
                :state="passwordConfirmState"
                :hint="passwordConfirmHint"
            >
                <template #iconLeft><IconLock /></template>
            </AppInput>

            <div class="auth-page__agreements">
                <AppChoice
                    v-model="agreeTerms"
                    type="checkbox"
                    variant="round"
                    label="이용약관 및 개인정보 처리방침에 동의합니다."
                    :state="submitted && !agreeTerms ? 'error' : null"
                />
                <AppChoice v-model="agreeMarketing" type="checkbox" variant="round" label="새로운 소식과 혜택을 이메일로 받습니다. (선택)" />
                <p v-if="submitted && !agreeTerms" class="auth-page__error">필수 약관에 동의해 주세요.</p>
            </div>

            <AppButton type="submit" variant="fill" tone="primary" size="xl" block>계정 만들기</AppButton>
        </form>

        <div class="auth-page__footer">
            <span class="auth-page__footer-text">이미 계정이 있으신가요?</span>
            <NuxtLink class="auth-page__link" to="/auth/sign-in">로그인</NuxtLink>
        </div>
    </AuthPageShell>
</template>

<script setup lang="ts">
import { IconAccount, IconEmail, IconLock } from '~/components/icons';

definePageMeta({ layout: false });
useHead({ title: '회원가입 | Framework' });

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const agreeTerms = ref(false);
const agreeMarketing = ref(false);
const submitted = ref(false);
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const emailState = computed(() => (submitted.value && !isEmailValid.value ? 'error' : null));
const emailHint = computed(() => (submitted.value && !isEmailValid.value ? '올바른 이메일 주소를 입력해 주세요.' : undefined));
const passwordState = computed(() => (submitted.value && password.value.length < 8 ? 'error' : null));
const passwordHint = computed(() =>
    submitted.value && password.value.length < 8 ? '비밀번호는 8자 이상 입력해 주세요.' : '영문, 숫자 조합 8자 이상을 권장합니다.',
);
const passwordConfirmState = computed(() => (submitted.value && passwordConfirm.value !== password.value ? 'error' : null));
const passwordConfirmHint = computed(() =>
    submitted.value && passwordConfirm.value !== password.value ? '비밀번호가 일치하지 않습니다.' : undefined,
);

function fieldState(value: string) {
    return submitted.value && !value.trim() ? 'error' : null;
}

function fieldHint(value: string, message: string) {
    return submitted.value && !value.trim() ? message : undefined;
}

function handleSubmit() {
    submitted.value = true;
    if (!name.value.trim() || !isEmailValid.value || password.value.length < 8 || password.value !== passwordConfirm.value || !agreeTerms.value)
        return;
    navigateTo('/auth/sign-in');
}
</script>
