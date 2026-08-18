<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- BASIC -->
                <PageDemoSection class="page-demo-section" title="Basic" description="기본적인 line 탭 예시입니다.">
                    <AppTabs :items="basicItems" variant="line">
                        <template #basicInfo>
                            <div class="page-demo-stack">
                                <p>기본 탭 콘텐츠입니다.</p>
                                <AppInput model-value="sample text" placeholder="입력하세요." />
                            </div>
                        </template>

                        <template #basicSelect>
                            <AppSelect
                                :model-value="null"
                                :options="[
                                    { label: '옵션 A', value: 'a' },
                                    { label: '옵션 B', value: 'b' },
                                ]"
                                placeholder="선택하세요."
                            />
                        </template>

                        <template #basicButton>
                            <AppButton variant="fill">확인</AppButton>
                        </template>
                    </AppTabs>
                </PageDemoSection>

                <!-- VARIANT -->
                <PageDemoSection class="page-demo-section" title="Variant" description="line / box / pill / vertical 스타일을 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">variant = "line"</div>

                            <AppTabs :items="variantItems" variant="line">
                                <template #account>Account Content</template>
                                <template #profile>Profile Content</template>
                                <template #security>Security Content</template>
                            </AppTabs>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">variant = "box"</div>

                            <AppTabs :items="variantItems" variant="box">
                                <template #account>Account Content</template>
                                <template #profile>Profile Content</template>
                                <template #security>Security Content</template>
                            </AppTabs>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">variant = "pill"</div>

                            <AppTabs :items="variantItems" variant="pill">
                                <template #account>Account Content</template>
                                <template #profile>Profile Content</template>
                                <template #security>Security Content</template>
                            </AppTabs>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">variant = "vertical"</div>

                            <AppTabs :items="verticalItems" variant="line" orientation="vertical">
                                <template #overview>Overview Content</template>
                                <template #members>Members Content</template>
                                <template #settings>Settings Content</template>
                            </AppTabs>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- DEFAULT ACTIVE -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Default Active Id"
                    description="defaultActiveId로 특정 탭을 기본 활성 상태로 지정할 수 있습니다."
                >
                    <AppTabs :items="defaultItems" variant="line" default-active-id="default-2">
                        <template #default1>Default Content 1</template>
                        <template #default2>Default Content 2</template>
                        <template #default3>Default Content 3</template>
                    </AppTabs>
                </PageDemoSection>

                <!-- DISABLED -->
                <PageDemoSection class="page-demo-section" title="Disabled" description="disabled 탭은 선택할 수 없습니다.">
                    <AppTabs :items="disabledItems" variant="box">
                        <template #active1>Active Content</template>
                        <template #disabled>Disabled Content</template>
                        <template #active2>Active Content 2</template>
                    </AppTabs>
                </PageDemoSection>

                <!-- SIZE -->
                <PageDemoSection class="page-demo-section" title="Size" description="sm / md / lg 크기를 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "sm"</div>

                            <AppTabs :items="sizeItems" size="sm" variant="pill">
                                <template #small>Small Content</template>
                                <template #medium>Medium Content</template>
                                <template #large>Large Content</template>
                            </AppTabs>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "md"</div>

                            <AppTabs :items="sizeItems" size="md" variant="pill">
                                <template #small>Small Content</template>
                                <template #medium>Medium Content</template>
                                <template #large>Large Content</template>
                            </AppTabs>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "lg"</div>

                            <AppTabs :items="sizeItems" size="lg" variant="pill">
                                <template #small>Small Content</template>
                                <template #medium>Medium Content</template>
                                <template #large>Large Content</template>
                            </AppTabs>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- SLOT -->
                <PageDemoSection class="page-demo-section" title="Slot" description="탭 본문을 슬롯으로 연결합니다.">
                    <AppTabs :items="slotItems" variant="line">
                        <template #progress>
                            <div class="page-demo-stack">
                                <p>이 콘텐츠는 슬롯으로 렌더링됩니다.</p>
                                <AppProgress :value="65" variant="linear" />
                            </div>
                        </template>

                        <template #actions>
                            <div class="page-demo-stack">
                                <div>
                                    <strong>액션 영역</strong>
                                    <p>탭 안에 버튼을 직접 배치한 예시입니다.</p>
                                </div>

                                <div class="page-demo-actions">
                                    <AppButton variant="fill">새로고침</AppButton>
                                    <AppButton variant="outline">상세 보기</AppButton>
                                </div>
                            </div>
                        </template>

                        <template #custom="{ item }">
                            <div class="page-demo-stack">
                                <p>{{ item.title }} 슬롯 콘텐츠입니다.</p>
                                <AppButton variant="fill"> Slot Button </AppButton>
                            </div>
                        </template>
                    </AppTabs>
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
import type { AppTabItem } from '~/components/AppTabs.vue';
import { IconAccountGroup, IconCog, IconDashboard, IconForm, IconInfo, IconTap } from '~/components/icons';

const { title, description } = useDemoI18n('tabs');

const basicItems: AppTabItem[] = [
    {
        id: 'basic-1',
        title: '기본 정보',
        description: '텍스트와 입력 필드',
        icon: IconInfo,
        slot: 'basicInfo',
    },
    {
        id: 'basic-2',
        title: '선택 영역',
        description: '셀렉트 컴포넌트',
        icon: IconForm,
        slot: 'basicSelect',
    },
    {
        id: 'basic-3',
        title: '버튼 영역',
        description: '버튼 예시',
        icon: IconTap,
        slot: 'basicButton',
    },
];

const variantItems: AppTabItem[] = [
    {
        id: 'variant-1',
        title: 'Account',
        badge: 3,
        slot: 'account',
    },
    {
        id: 'variant-2',
        title: 'Profile',
        slot: 'profile',
    },
    {
        id: 'variant-3',
        title: 'Security',
        slot: 'security',
    },
];

const defaultItems: AppTabItem[] = [
    {
        id: 'default-1',
        title: 'Default 1',
        slot: 'default1',
    },
    {
        id: 'default-2',
        title: 'Default 2',
        slot: 'default2',
    },
    {
        id: 'default-3',
        title: 'Default 3',
        slot: 'default3',
    },
];

const disabledItems: AppTabItem[] = [
    {
        id: 'disabled-1',
        title: '활성 탭',
        description: '선택할 수 있습니다.',
        slot: 'active1',
    },
    {
        id: 'disabled-2',
        title: '비활성 탭',
        description: 'disabled 상태',
        disabled: true,
        slot: 'disabled',
    },
    {
        id: 'disabled-3',
        title: '활성 탭 2',
        description: '선택할 수 있습니다.',
        slot: 'active2',
    },
];

const sizeItems: AppTabItem[] = [
    {
        id: 'size-1',
        title: 'Small',
        slot: 'small',
    },
    {
        id: 'size-2',
        title: 'Medium',
        slot: 'medium',
    },
    {
        id: 'size-3',
        title: 'Large',
        slot: 'large',
    },
];

const verticalItems: AppTabItem[] = [
    {
        id: 'vertical-1',
        title: 'Overview',
        description: '요약 정보',
        icon: IconDashboard,
        slot: 'overview',
    },
    {
        id: 'vertical-2',
        title: 'Members',
        description: '구성원 정보',
        icon: IconAccountGroup,
        slot: 'members',
    },
    {
        id: 'vertical-3',
        title: 'Settings',
        description: '설정 정보',
        icon: IconCog,
        slot: 'settings',
    },
];

const slotItems: AppTabItem[] = [
    {
        id: 'slot-1',
        title: '진행 상태',
        description: 'slot으로 내용 연결',
        slot: 'progress',
    },
    {
        id: 'slot-2',
        title: '액션',
        description: '버튼 직접 배치',
        slot: 'actions',
    },
    {
        id: 'slot-3',
        title: 'slot 방식',
        description: 'slot name으로 내용 연결',
        slot: 'custom',
    },
];
</script>
