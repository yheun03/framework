<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- AppSiteHeader -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppSiteHeader"
                    description="Figma 18. GNB Guide 기본 GNB 입니다. 상단 100px(로고/검색/유틸) + 메뉴 56px. 767px 이하에서는 검색을 숨기고 메뉴가 가로 스크롤됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : 메뉴 목록 - label / to / active / divider(앞쪽 구분선)</li>
                        <li><b>searchPlaceholder</b> : 비우면 검색창 없음 · <b>@search</b> 검색어 전달</li>
                        <li><b>#utils</b> : 우측 아이콘 (기본: 마이페이지 / 장바구니 / 찜 / 메시지)</li>
                        <li><b>#aside</b> : 메뉴 우측 영역 (실시간 키워드 등) · <b>@category</b> 카테고리 버튼</li>
                    </ul>

                    <div class="demo-site-frame">
                        <AppSiteHeader :items="menus" search-placeholder="트렌드 검색하고 총 5종 패션 아이템 받기" @search="onSearch">
                            <template #aside>
                                <span class="demo-site-rank"><b>2.</b> 올 겨울 패션 소장 아이템</span>
                            </template>
                        </AppSiteHeader>
                    </div>
                    <p class="page-demo-output">@search : {{ keyword || '-' }}</p>
                </PageDemoSection>

                <!-- AppSiteFooter -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppSiteFooter"
                    description="Figma 19. Footer Guide 기본 Footer(light) 와 샘플 4번 블랙 타입(dark) 입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>links</b> : 정책 링크 - strong(개인정보처리방침 강조)</li>
                        <li><b>sns</b> : instagram / facebook / youtube / kakao / x</li>
                        <li><b>title · infos · copyright</b> : 회사 정보 · <b>tel · hours</b> : 고객센터</li>
                        <li><b>#actions</b> : 고객센터 버튼 · <b>#extra</b> : APP 다운로드 등</li>
                        <li><b>variant</b> : light(기본) / dark</li>
                    </ul>

                    <div class="demo-site-frame">
                        <AppSiteFooter
                            title="조앤소프트"
                            :links="footer.links"
                            :sns="footer.sns"
                            :infos="footer.infos"
                            :copyright="footer.copyright"
                            :tel="footer.tel"
                            :hours="footer.hours"
                        >
                            <template #actions>
                                <AppButton size="xs" shape="square">1:1 문의하기</AppButton>
                                <AppButton size="xs" shape="square">자주 묻는 질문</AppButton>
                            </template>
                        </AppSiteFooter>
                    </div>

                    <div class="demo-site-frame">
                        <AppSiteFooter
                            variant="dark"
                            title="조앤소프트"
                            :links="footer.links"
                            :sns="footer.sns"
                            :infos="footer.infos"
                            :copyright="footer.copyright"
                            :tel="footer.tel"
                            :hours="footer.hours"
                        />
                    </div>
                </PageDemoSection>

                <!-- AppDockBar -->
                <PageDemoSection
                    class="page-demo-section"
                    title="AppDockBar"
                    description="Figma MO 06. Dock Bar Guide 기본 독바입니다. MO 전용 화면에서 fixed 로 하단에 고정합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : id / label / icon(home · menu · category · search · heart · account · cart) / to / badge</li>
                        <li><b>v-model</b> : 선택된 id · <b>showLabel</b> : 라벨 노출(기본 true) · <b>fixed</b> : 하단 고정</li>
                    </ul>

                    <div class="demo-site-phones">
                        <div class="demo-site-phone">
                            <div class="demo-site-phone__screen" />
                            <AppDockBar v-model="dock" :items="dockItems" />
                        </div>
                        <div class="demo-site-phone">
                            <div class="demo-site-phone__screen" />
                            <AppDockBar v-model="dock" :items="dockItems" :show-label="false" />
                        </div>
                    </div>
                    <p class="page-demo-output">v-model : {{ dock }}</p>
                </PageDemoSection>
            </main>
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AppDockBarItem } from '~/components/AppSite/AppDockBar.vue';
import type { AppSiteFooterLink, AppSiteFooterSns } from '~/components/AppSite/AppSiteFooter.vue';

const { title, description } = useDemoI18n('siteLayout');

// temp 데이터 - API 연동 시 이 영역만 교체
const menus = [
    { label: 'New Releases', to: '#', active: true },
    { label: 'Women', to: '#' },
    { label: 'Men', to: '#' },
    { label: 'Beauty', to: '#' },
    { label: 'Life', to: '#' },
    { label: 'Sale', to: '#' },
    { label: 'Outlet', to: '#' },
    { label: 'Promotion', to: '#' },
    { label: 'Magazine', to: '#', divider: true },
    { label: 'Event', to: '#' },
    { label: 'Best', to: '#' },
];

const footer: { links: AppSiteFooterLink[]; sns: AppSiteFooterSns[]; infos: string[]; copyright: string; tel: string; hours: string } = {
    links: [
        { label: '회사소개', to: '#' },
        { label: '개인정보처리방침', to: '#', strong: true },
        { label: '이용약관', to: '#' },
        { label: '청소년보호방침', to: '#' },
        { label: '입점/제휴문의', to: '#' },
    ],
    sns: [
        { type: 'instagram', href: '#' },
        { type: 'facebook', href: '#' },
        { type: 'youtube', href: '#' },
        { type: 'kakao', href: '#' },
        { type: 'x', href: '#' },
    ],
    infos: [
        '대표이사 : 홍길동',
        '서울특별시 강남구 테헤란로 000, 0층',
        '사업자등록번호 : 123-45-67890 / 통신판매업신고 : 2026-서울강남-0000호',
        '이메일 : help@example.com',
    ],
    copyright: 'Copyright ⓒ JONSOFT ALL RIGHTS RESERVED.',
    tel: '1234-5678',
    hours: '오전 9시 ~ 오후 6시 (토요일, 공휴일 휴무)',
};

const dockItems: AppDockBarItem[] = [
    { id: 'menu', label: '카테고리', icon: 'menu', to: '#' },
    { id: 'search', label: '검색', icon: 'search', to: '#' },
    { id: 'home', label: '홈', icon: 'home', to: '#' },
    { id: 'heart', label: '찜', icon: 'heart', to: '#' },
    { id: 'cart', label: '장바구니', icon: 'cart', to: '#', badge: 3 },
];

const dock = ref('home');
const keyword = ref('');

function onSearch(value: string) {
    keyword.value = value;
}
</script>

<style scoped lang="scss">
.demo-site-frame {
    overflow: hidden;
    border: 1px solid var(--theme-line-regular);
    border-radius: 8px;

    & + & {
        margin-top: 12px;
    }
}

.demo-site-rank b {
    color: var(--theme-brand-main);
}

.demo-site-phones {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.demo-site-phone {
    display: flex;
    flex-direction: column;
    width: 320px;
    overflow: hidden;
    border: 1px solid var(--theme-line-regular);
    border-radius: 20px;

    &__screen {
        height: 160px;
        background: var(--theme-bg-regular);
    }
}
</style>
