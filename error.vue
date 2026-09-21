<template>
    <div class="app-error">
        <div class="app-error__card">
            <div class="app-error__top">
                <div class="app-error__badge" :data-code="statusCode">
                    <span class="app-error__badge-code">{{ statusCode }}</span>
                    <span class="app-error__badge-label">{{ badgeLabel }}</span>
                </div>
                <div class="app-error__ornament" aria-hidden="true">
                    <span class="app-error__orb app-error__orb--a" />
                    <span class="app-error__orb app-error__orb--b" />
                    <span class="app-error__orb app-error__orb--c" />
                </div>
            </div>

            <h1 class="app-error__title">{{ title }}</h1>
            <p class="app-error__message">{{ message }}</p>

            <div class="app-error__actions">
                <AppButton size="md" variant="fill" @click="handleGoHome">홈으로</AppButton>
                <AppButton size="md" variant="outline" @click="handleGoBack">뒤로</AppButton>
            </div>

            <details v-if="isDev && debugText" class="app-error__debug">
                <summary>개발용 디버그 정보</summary>
                <pre>{{ debugText }}</pre>
            </details>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
    error: NuxtError;
}>();

const isDev = import.meta.dev;

const statusCode = computed(() => {
    const code = Number((props.error as any)?.statusCode ?? (props.error as any)?.status ?? 500);
    return Number.isFinite(code) ? code : 500;
});

const title = computed(() => {
    if (statusCode.value === 404) return '페이지를 찾을 수 없습니다';
    if (statusCode.value >= 500) return '서버 오류가 발생했습니다';
    return '오류가 발생했습니다';
});

const badgeLabel = computed(() => {
    if (statusCode.value === 404) return 'Not Found';
    if (statusCode.value >= 500) return 'Server Error';
    return 'Error';
});

const message = computed(() => {
    const msg = (props.error as any)?.message;
    if (statusCode.value === 404) return '요청하신 페이지가 존재하지 않거나 이동되었습니다.';
    if (statusCode.value >= 500) return '잠시 후 다시 시도해 주세요.';
    return msg || '알 수 없는 오류가 발생했습니다.';
});

const debugText = computed(() => {
    const e: any = props.error;
    const parts = [
        e?.message ? `message: ${e.message}` : '',
        e?.url ? `url: ${e.url}` : '',
        e?.statusCode ? `statusCode: ${e.statusCode}` : '',
        e?.stack ? `stack:\n${e.stack}` : '',
    ].filter(Boolean);
    return parts.join('\n');
});

function handleGoHome() {
    clearError({ redirect: '/' });
}

function handleGoBack() {
    // 에러 화면에서 history back이 불가능할 수 있어, 실패 시 홈으로 보냅니다.
    try {
        history.back();
        setTimeout(() => {
            // 여전히 에러 상태로 남아있으면 홈으로
            clearError({ redirect: '/' });
        }, 250);
    } catch {
        clearError({ redirect: '/' });
    }
}
</script>

<style scoped lang="scss">
.app-error {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 28px 18px;
    background:
        radial-gradient(900px 520px at 10% 12%, color-mix(in srgb, var(--theme-primary-500) 38%, transparent), transparent 55%),
        radial-gradient(820px 560px at 92% 18%, color-mix(in srgb, var(--theme-primary-200) 42%, transparent), transparent 55%),
        radial-gradient(760px 520px at 58% 96%, color-mix(in srgb, var(--theme-status-info) 18%, transparent), transparent 58%),
        linear-gradient(180deg, var(--theme-gray-0), var(--theme-primary-50));
    color: var(--theme-gray-900);
}

.app-error__card {
    width: min(560px, 100%);
    border: 1px solid color-mix(in srgb, var(--theme-primary-200) 90%, transparent);
    border-radius: 22px;
    padding: 22px 22px 20px;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--theme-gray-0) 78%, transparent),
        color-mix(in srgb, var(--theme-gray-0) 62%, transparent)
    );
    box-shadow:
        0 30px 80px color-mix(in srgb, var(--theme-primary-900) 12%, transparent),
        0 12px 30px color-mix(in srgb, var(--theme-primary-700) 10%, transparent);
    backdrop-filter: blur(14px);
}

.app-error__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
}

.app-error__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--theme-primary-500) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--theme-primary-500) 22%, transparent);
    box-shadow:
        0 14px 30px color-mix(in srgb, var(--theme-primary-900) 10%, transparent),
        0 6px 14px color-mix(in srgb, var(--theme-primary-800) 8%, transparent);
}

.app-error__badge-code {
    @include font(btn2, sb);
    letter-spacing: -0.02em;
}

.app-error__badge-label {
    @include font(btn4, sb);
    color: color-mix(in srgb, var(--theme-gray-900) 58%, transparent);
    letter-spacing: -0.01em;
}

.app-error__badge[data-code='404'] {
    background: color-mix(in srgb, var(--theme-primary-500) 14%, transparent);
    border-color: color-mix(in srgb, var(--theme-primary-500) 22%, transparent);
}

.app-error__badge[data-code='500'],
.app-error__badge[data-code='501'],
.app-error__badge[data-code='502'],
.app-error__badge[data-code='503'],
.app-error__badge[data-code='504'] {
    background: color-mix(in srgb, var(--theme-status-error) 14%, transparent);
    border-color: color-mix(in srgb, var(--theme-status-error) 26%, transparent);
}

.app-error__ornament {
    position: relative;
    width: 84px;
    height: 44px;
    flex: 0 0 auto;
}

.app-error__orb {
    position: absolute;
    border-radius: 999px;
    filter: blur(0.2px);
    opacity: 0.95;
    background:
        radial-gradient(
            circle at 28% 28%,
            color-mix(in srgb, var(--theme-gray-0) 92%, transparent),
            color-mix(in srgb, var(--theme-gray-0) 0%, transparent) 56%
        ),
        radial-gradient(
            circle at 72% 72%,
            color-mix(in srgb, var(--theme-primary-500) 70%, transparent),
            color-mix(in srgb, var(--theme-primary-500) 0%, transparent) 60%
        ),
        radial-gradient(
            circle at 50% 50%,
            color-mix(in srgb, var(--theme-primary-200) 60%, transparent),
            color-mix(in srgb, var(--theme-primary-200) 0%, transparent) 62%
        );
    box-shadow: 0 18px 46px color-mix(in srgb, var(--theme-primary-700) 24%, transparent);
}

.app-error__orb--a {
    width: 34px;
    height: 34px;
    right: 18px;
    top: 0px;
}

.app-error__orb--b {
    width: 22px;
    height: 22px;
    right: 0px;
    top: 18px;
    opacity: 0.8;
}

.app-error__orb--c {
    width: 16px;
    height: 16px;
    right: 42px;
    top: 22px;
    opacity: 0.65;
}

.app-error__title {
    margin: 0 0 8px;
    @include font(t4, sb);
    line-height: 1.2;
}

.app-error__message {
    margin: 0 0 18px;
    @include font(b3, rg);
    color: color-mix(in srgb, var(--theme-gray-900) 68%, transparent);
    line-height: 1.55;
}

.app-error__actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.app-error__debug {
    margin-top: 18px;
    border-top: 1px dashed color-mix(in srgb, var(--theme-gray-900) 14%, transparent);
    padding-top: 14px;
}

.app-error__debug summary {
    cursor: pointer;
    color: color-mix(in srgb, var(--theme-gray-900) 78%, transparent);
    @include font(btn3, sb);
}

.app-error__debug pre {
    white-space: pre-wrap;
    word-break: break-word;
    @include font(c2, rg);
    background: color-mix(in srgb, var(--theme-gray-900) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--theme-gray-900) 8%, transparent);
    padding: 12px;
    border-radius: 14px;
    margin: 10px 0 0;
}
</style>
