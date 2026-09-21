<template>
    <div class="home">
        <header class="home__hero" aria-label="메인 소개 영역">
            <div class="home__hero-top">
                <div class="home__brand">
                    <span class="home__brand-icon" aria-hidden="true">
                        <IconApp />
                    </span>
                    <span class="home__brand-name">{{ project.serviceName }}</span>
                </div>
                <NuxtLink class="home__signin" to="/auth/sign-in">Sign in</NuxtLink>
            </div>
            <div class="home__hero-content">
                <p class="home__eyebrow">Workspace + Components</p>
                <h1 class="home__title">팀이 바로 시작할 수 있는<br />Vue/Nuxt 프레임워크</h1>
                <p class="home__desc">
                    인증/에러 페이지와 동일한 톤으로 구성한 메인 화면입니다. 워크스페이스, 컴포넌트 데모, 가이드 페이지로 빠르게 이동할 수 있습니다.
                </p>
                <div class="home__hero-actions">
                    <AppButton to="/workspace" size="lg" variant="fill">워크스페이스 시작</AppButton>
                    <AppButton to="/demos/demo-button" size="lg" variant="outline">UI 데모 보기</AppButton>
                </div>
            </div>
        </header>

        <main class="home__main" aria-label="메인 콘텐츠">
            <section class="home__grid" aria-label="주요 이동">
                <NuxtLink class="home__card" to="/workspace">
                    <span class="home__card-icon" aria-hidden="true">
                        <IconDashboard />
                    </span>
                    <strong class="home__card-title">Workspace</strong>
                    <p class="home__card-desc">프로젝트 탭, 작업 흐름, 생산성 도구를 한 화면에서 관리합니다.</p>
                </NuxtLink>

                <NuxtLink class="home__card" to="/demos/demo-button">
                    <span class="home__card-icon" aria-hidden="true">
                        <IconWidgets />
                    </span>
                    <strong class="home__card-title">UI Demos</strong>
                    <p class="home__card-desc">AppInput, AppChoice 등 공통 UI를 예제로 빠르게 검증합니다.</p>
                </NuxtLink>

                <NuxtLink class="home__card" to="/auth/sign-up">
                    <span class="home__card-icon" aria-hidden="true">
                        <IconAccountPlus />
                    </span>
                    <strong class="home__card-title">Get Started</strong>
                    <p class="home__card-desc">새 계정으로 가입하고 팀 워크스페이스를 바로 생성할 수 있습니다.</p>
                </NuxtLink>
            </section>

            <footer class="home__footer">
                <p>© {{ currentYear }} {{ project.companyName }}. All rights reserved.</p>
            </footer>
        </main>
    </div>
</template>

<script setup lang="ts">
import { IconAccountPlus, IconApp, IconDashboard, IconWidgets } from '~/components/icons';

const project = useProjectConfig();
const currentYear = new Date().getFullYear();
</script>

<style scoped lang="scss">
.home {
    min-height: 100vh;
    background:
        radial-gradient(900px 520px at 8% 5%, var(--theme-primary-500-alpha-25), transparent 52%),
        radial-gradient(840px 560px at 95% 2%, var(--theme-primary-200-alpha-30), transparent 52%),
        linear-gradient(180deg, var(--theme-gray-0), var(--theme-primary-50));
    color: var(--theme-gray-900);
    padding: 22px 22px 28px;

    &__hero {
        position: relative;
        overflow: hidden;
        border-radius: 24px;
        padding: 24px;
        margin-bottom: 16px;
        background:
            radial-gradient(900px 540px at 20% 10%, var(--theme-primary-500-alpha-55), transparent 60%),
            radial-gradient(820px 560px at 90% 20%, var(--theme-primary-200-alpha-58), transparent 60%),
            radial-gradient(860px 640px at 40% 105%, var(--theme-status-info-alpha-25), transparent 62%),
            linear-gradient(180deg, var(--theme-primary-900), var(--theme-primary-700));
        border: 1px solid var(--theme-gray-0-alpha-18);
        box-shadow:
            0 24px 58px var(--theme-primary-900-alpha-14),
            0 10px 22px var(--theme-primary-900-alpha-12);
        color: var(--theme-gray-0);

        &::before {
            content: '';
            position: absolute;
            inset: -1px;
            background:
                linear-gradient(135deg, var(--theme-gray-0-alpha-14), var(--theme-gray-0-alpha-0) 35%),
                repeating-linear-gradient(
                    135deg,
                    var(--theme-gray-0-alpha-8) 0px,
                    var(--theme-gray-0-alpha-8) 1px,
                    var(--theme-gray-0-alpha-0) 1px,
                    var(--theme-gray-0-alpha-0) 10px
                );
            opacity: 0.45;
            pointer-events: none;
        }

        &-top {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 24px;
        }

        &-content {
            position: relative;
            max-width: 760px;
            display: grid;
            gap: 12px;
        }

        &-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 4px;
        }
    }

    &__brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;

        &-icon {
            width: 28px;
            height: 28px;
            display: inline-grid;
            place-items: center;
            border-radius: 999px;
            background: var(--theme-gray-0-alpha-16);
            border: 1px solid var(--theme-gray-0-alpha-28);
        }

        &-name {
            @include font(btn2, sb);
        }
    }

    &__signin {
        @include font(btn3, sb);
        color: var(--theme-gray-0-alpha-92);
        text-decoration: none;
        border: 1px solid var(--theme-gray-0-alpha-28);
        border-radius: 999px;
        height: 36px;
        padding: 0 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--theme-gray-0-alpha-8);
    }

    &__eyebrow {
        margin: 0;
        @include font(c1, sb);
        color: var(--theme-gray-0-alpha-82);
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    &__title {
        margin: 0;
        @include font(t4, sb);
        line-height: 1.25;
    }

    &__desc {
        margin: 0;
        @include font(b3, rg);
        color: var(--theme-gray-0-alpha-82);
        line-height: 1.55;
        max-width: 680px;
    }

    &__main {
        max-width: 1180px;
        width: 100%;
        margin: 0 auto;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
    }

    &__card {
        display: grid;
        gap: 8px;
        padding: 18px;
        border-radius: 16px;
        border: 1px solid var(--theme-gray-900-alpha-10);
        background: var(--theme-gray-0-alpha-86);
        text-decoration: none;
        box-shadow:
            0 18px 44px var(--theme-primary-900-alpha-8),
            0 8px 18px var(--theme-primary-900-alpha-6);
        transition:
            transform 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease;

        &:hover {
            transform: translateY(-2px);
            border-color: var(--theme-primary-500-alpha-30);
            box-shadow:
                0 24px 54px var(--theme-primary-900-alpha-10),
                0 10px 20px var(--theme-primary-900-alpha-8);
        }

        &-icon {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            display: inline-grid;
            place-items: center;
            color: var(--theme-primary-700);
            background: var(--theme-primary-100-alpha-90);
        }

        &-title {
            @include font(btn2, sb);
            color: var(--theme-gray-900);
        }

        &-desc {
            margin: 0;
            @include font(c1, rg);
            color: var(--theme-gray-900-alpha-62);
            line-height: 1.55;
        }
    }

    &__footer {
        margin-top: 14px;
        text-align: center;

        p {
            margin: 0;
            @include font(c2, rg);
            color: var(--theme-gray-900-alpha-54);
        }
    }
}

@media (max-width: 980px) {
    .home {
        padding: 14px 14px 20px;

        &__hero {
            border-radius: 18px;
            padding: 16px;
        }

        &__title {
            @include font(t5, sb);
        }

        &__grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
