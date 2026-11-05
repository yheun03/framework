<template>
    <div class="page-demo">
        <main class="page-demo-main">
            <header class="page-demo__header">
                <h1 class="page-demo__title">Lucide 라이선스</h1>
                <p class="page-demo__desc">
                    본 프로젝트의 공통 아이콘은 Lucide 오픈소스 아이콘을 사용합니다. ISC License 고지문을 아래에 표기하며, 아이콘 추가 전 공식
                    라이선스를 확인합니다.
                </p>
            </header>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">적용 기준</h2>
                <ul class="page-demo-list">
                    <li>패키지: <code>@lucide/vue</code> (Vue 3 컴포넌트)</li>
                    <li>
                        라이선스: ISC License (Feather 에서 파생된 일부 아이콘 - chevron · search · x 등은 MIT License, Copyright (c) 2013-present
                        Cole Bemis)
                    </li>
                    <li>
                        공식 라이선스:
                        <a href="https://lucide.dev/license" target="_blank" rel="noopener noreferrer">https://lucide.dev/license</a>
                    </li>
                </ul>
            </section>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">ISC License 고지</h2>
                <ul class="page-demo-list">
                    <li>Copyright (c) 2026 Lucide Icons and Contributors</li>
                    <li>
                        Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
                        provided that the above copyright notice and this permission notice appear in all copies.
                    </li>
                    <li>
                        THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
                        WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
                        CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
                        NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
                    </li>
                </ul>
            </section>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">프로젝트 운영 기준</h2>
                <ul class="page-demo-list">
                    <li>
                        아이콘은 <code>components/icons.ts</code> 에 등록한 뒤 <code>import { IconMenu } ...</code>,
                        <code>&lt;IconMenu /&gt;</code> 로 사용합니다.
                    </li>
                    <li>
                        새 아이콘은 <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer">lucide.dev/icons</a> 에서 이름을 찾아
                        추가합니다.
                    </li>
                    <li>크기는 font-size, 색상은 color, 선 두께는 <code>--app-icon-stroke-width</code> (기본 2, 큰 아이콘 1.5) 로 조절합니다.</li>
                    <li>Lucide 는 브랜드 로고를 제공하지 않으므로 SNS 아이콘은 같은 규격으로 직접 정의하며, 각 브랜드 가이드라인을 따릅니다.</li>
                </ul>
            </section>
        </main>
    </div>
</template>

<style scoped lang="scss">
.page-demo {
    min-height: 100%;
    background: var(--theme-gray-0);

    &-main {
        width: min(100%, 1180px);
        padding: 28px 24px 56px;
    }

    &__header {
        margin-bottom: 24px;
    }

    &__title {
        margin: 0;
        color: var(--theme-gray-900);
        font-size: 22px;
        font-weight: 700;
        line-height: 1.35;
    }

    &__desc {
        max-width: 760px;
        margin: 10px 0 0;
        color: var(--theme-gray-600);
        font-size: 14px;
        line-height: 1.7;
    }
}

.page-demo-card {
    border: 1px solid var(--theme-gray-200);
    border-radius: 8px;
    background: var(--theme-gray-0);
    box-shadow: 0 1px 2px var(--theme-gray-900-alpha-4);

    & + & {
        margin-top: 16px;
    }

    &__title {
        margin: 0;
        padding: 18px 20px 0;
        color: var(--theme-gray-900);
        font-size: 15px;
        font-weight: 700;
        line-height: 1.4;
    }
}

.page-demo-list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 16px 20px 20px;
    color: var(--theme-gray-700);
    font-size: 14px;
    line-height: 1.55;
    list-style: none;

    li {
        position: relative;
        padding-left: 14px;

        &::before {
            position: absolute;
            top: 0.72em;
            left: 0;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: var(--theme-primary-500);
            content: '';
        }
    }

    a {
        color: var(--theme-primary-700);
        font-weight: 600;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    code {
        display: inline-flex;
        align-items: center;
        min-height: 22px;
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--theme-gray-100);
        color: var(--theme-gray-800);
        font-size: 13px;
    }
}
</style>
