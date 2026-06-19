<template>
    <div class="page-demo">
        <main class="page-demo-main">
            <header class="page-demo__header">
                <h1 class="page-demo__title">Flaticon 이용약관</h1>
                <p class="page-demo__desc">
                    본 프로젝트에서 사용하는 Flaticon UIcons의 라이선스 준수 기준입니다.
                    공식 약관을 우선하며, 아이콘 사용 전 최신 약관을 확인합니다.
                </p>
            </header>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">적용 기준</h2>
                <ul class="page-demo-list">
                    <li>기준 문서: Flaticon Terms of use</li>
                    <li>기준 버전: April 2026</li>
                    <li>공식 약관: <a href="https://www.flaticon.com/legal" target="_blank"
                            rel="noopener noreferrer">https://www.flaticon.com/legal</a></li>
                </ul>
            </section>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">무료 사용 조건</h2>
                <ul class="page-demo-list">
                    <li>무료 라이선스는 Flaticon과 저작자 출처 표기를 전제로 사용합니다.</li>
                    <li>본 페이지에서 <a href="https://www.flaticon.com/" target="_blank"
                            rel="noopener noreferrer">Icons by Flaticon</a> 출처를 명시합니다.</li>
                    <li>출처 표기 없이 사용하려면 Premium 구독 기간 중 다운로드한 콘텐츠를 사용합니다.</li>
                    <li>편집용으로 표시된 콘텐츠는 상업 활동, 홍보, 마케팅 목적에 사용하지 않습니다.</li>
                </ul>
            </section>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">사용 제한</h2>
                <ul class="page-demo-list">
                    <li>아이콘 자체가 핵심 상품이 되는 재판매용 인쇄물, 앱, 게임, 템플릿에는 사용하지 않습니다.</li>
                    <li>아이콘 파일을 별도 파일, 아이콘 세트, 데이터베이스 형태로 재배포하거나 재판매하지 않습니다.</li>
                    <li>상표, 로고, 보증 표시처럼 오인될 수 있는 방식으로 사용하지 않습니다.</li>
                    <li>AI, 머신러닝, 개인 식별 기술 학습 목적으로 사용하지 않습니다.</li>
                </ul>
            </section>

            <section class="page-demo-card">
                <h2 class="page-demo-card__title">프로젝트 운영 기준</h2>
                <ul class="page-demo-list">
                    <li>아이콘은 <code>@flaticon/flaticon-uicons</code> 패키지의 UIcons만 사용합니다.</li>
                    <li>컴포넌트 사용 형식은 <code>import { IconMenu } ...</code>, <code>&lt;IconMenu /&gt;</code>로 통일합니다.</li>
                    <li>새 아이콘 추가 시 Flaticon 내 상업적 사용 가능 여부와 출처 표기 필요 여부를 먼저 확인합니다.</li>
                    <li>약관이 변경되면 본 페이지와 아이콘 사용 정책을 함께 갱신합니다.</li>
                </ul>
            </section>
        </main>
    </div>
</template>

<style scoped lang="scss">
.page-demo {
    min-height: 100%;
    background: $gray-0;
}

.page-demo-main {
    width: min(100%, 1180px);
    padding: 28px 24px 56px;
}

.page-demo__header {
    margin-bottom: 24px;
}

.page-demo__title {
    margin: 0;
    color: $gray-900;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.35;
}

.page-demo__desc {
    max-width: 760px;
    margin: 10px 0 0;
    color: $gray-600;
    font-size: 14px;
    line-height: 1.7;
}

.page-demo-card {
    border: 1px solid $gray-200;
    border-radius: 8px;
    background: $gray-0;
    box-shadow: 0 1px 2px rgba($gray-900, 0.04);

    &+& {
        margin-top: 16px;
    }
}

.page-demo-card__title {
    margin: 0;
    padding: 18px 20px 0;
    color: $gray-900;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.4;
}

.page-demo-list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 16px 20px 20px;
    color: $gray-700;
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
            background: $primary-500;
            content: "";
        }
    }

    a {
        color: $primary-700;
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
        background: $gray-100;
        color: $gray-800;
        font-size: 13px;
    }
}
</style>
