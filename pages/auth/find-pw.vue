<template>
    <AuthPageShell
        panel-label="비밀번호 찾기"
        eyebrow="Account recovery"
        hero-title="안전하게 계정을\n다시 이용할 수 있도록"
        hero-description="가입한 이메일을 확인한 뒤 비밀번호를 안전하게 재설정할 수 있습니다."
        :features="['이메일 본인 확인', '안전한 재설정 링크', '간편한 로그인 복귀']"
    >
        <template v-if="!isSent">
            <header class="auth-page__header">
                <p class="auth-page__step">Reset password</p>
                <h1 class="auth-page__title">비밀번호 찾기</h1>
                <p class="auth-page__desc">가입한 이메일로 비밀번호 재설정 링크를 보내드릴게요.</p>
            </header>
            <form class="auth-page__form" novalidate @submit.prevent="handleSubmit">
                <AppInput
                    v-model="email"
                    id="find-password-email"
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
                <AppButton type="submit" variant="fill" tone="primary" size="xl" block>재설정 링크 보내기</AppButton>
            </form>
            <div class="auth-page__footer">
                <NuxtLink class="auth-page__link" to="/auth/sign-in">로그인으로 돌아가기</NuxtLink>
            </div>
        </template>

        <section v-else class="auth-page__complete" aria-live="polite">
            <span class="auth-page__complete-icon" aria-hidden="true"><IconEmail /></span>
            <div class="auth-page__header auth-page__header--center">
                <p class="auth-page__step">Email sent</p>
                <h1 class="auth-page__title">이메일을 확인해 주세요</h1>
                <p class="auth-page__desc">
                    <strong>{{ email }}</strong> 주소로 비밀번호 재설정 링크를 보냈습니다.
                </p>
            </div>
            <AppButton to="/auth/sign-in" variant="fill" tone="primary" size="xl" block>로그인으로 돌아가기</AppButton>
            <AppButton variant="outline" tone="gray" size="lg" block @click="isSent = false">이메일 다시 입력</AppButton>
        </section>
    </AuthPageShell>
</template>

<script setup lang="ts">
import { IconEmail } from '~/components/icons';

definePageMeta({ layout: false });
useHead({ title: '비밀번호 찾기 | Framework' });

const email = ref('');
const submitted = ref(false);
const isSent = ref(false);
const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const emailState = computed(() => (submitted.value && !isEmailValid.value ? 'error' : null));
const emailHint = computed(() => (submitted.value && !isEmailValid.value ? '올바른 이메일 주소를 입력해 주세요.' : undefined));

function handleSubmit() {
    submitted.value = true;
    if (!isEmailValid.value) return;
    isSent.value = true;
}
</script>
