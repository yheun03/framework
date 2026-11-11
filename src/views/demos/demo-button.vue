<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <div class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- -------------------------------------------------- -->
                <!-- Variant -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="Variant">
                    <p class="page-demo-hint">버튼 유형별 기본 스타일을 정의합니다.</p>

                    <ul class="page-demo-hint-list">
                        <li><b>fill</b> : 배경 채움 버튼 (AppButton)</li>
                        <li><b>soft</b> : 연한 배경 버튼 - Figma "BG 비강조" (AppButton)</li>
                        <li><b>outline</b> : 테두리 버튼 (AppButton)</li>
                        <li><b>text</b> : 배경 없는 텍스트 버튼 (AppTextButton)</li>
                        <li><b>underline</b> : 링크 스타일 버튼 (AppTextButton)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton variant="fill">fill</AppButton>
                        <AppButton variant="soft">soft</AppButton>
                        <AppButton variant="outline">outline</AppButton>
                        <AppTextButton>text</AppTextButton>
                        <AppTextButton variant="underline">underline </AppTextButton>
                    </div>
                </PageDemoSection>

                <!-- -------------------------------------------------- -->
                <!-- Text Button -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="Text Button">
                    <p class="page-demo-hint">Figma 텍스트 버튼 - 언더바 / 느낌표 / 화살표 / 아이콘. 크기는 글자 sm 12 · md 13 · lg 14 입니다.</p>

                    <ul class="page-demo-hint-list">
                        <li><b>variant</b> : text / underline(언더바) / info(느낌표) / arrow(화살표)</li>
                        <li><b>아이콘형</b> : #iconLeft · #iconRight 슬롯</li>
                        <li><b>상태</b> : 마우스오버 연한 배경 · disabled · loading</li>
                    </ul>

                    <div v-for="size in ['lg', 'md', 'sm']" :key="size" class="page-demo-row">
                        <AppTextButton variant="underline" :size="size">새창링크호출</AppTextButton>
                        <AppTextButton variant="info" :size="size">새창링크호출</AppTextButton>
                        <AppTextButton variant="arrow" :size="size">새창링크호출</AppTextButton>
                        <AppTextButton :size="size">
                            <template #iconLeft><IconStar /></template>
                            즐겨찾기
                        </AppTextButton>
                        <AppTextButton variant="info" :size="size" disabled>새창링크호출</AppTextButton>
                        <AppTextButton variant="arrow" :size="size" loading>새창링크호출</AppTextButton>
                    </div>
                </PageDemoSection>

                <!-- -------------------------------------------------- -->
                <!-- Size -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="Size">
                    <p class="page-demo-hint">버튼 크기를 정의합니다.</p>

                    <ul class="page-demo-hint-list">
                        <li>xs</li>
                        <li>sm</li>
                        <li>md (default)</li>
                        <li>lg</li>
                        <li>xl</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="xs">XS</AppButton>
                        <AppButton size="sm">SM</AppButton>
                        <AppButton size="md">MD</AppButton>
                        <AppButton size="lg">LG</AppButton>
                        <AppButton size="xl">XL</AppButton>
                    </div>

                    <p class="page-demo-hint">fill 버튼과 함께 사용</p>

                    <div class="page-demo-row">
                        <AppButton variant="fill" size="xs">XS</AppButton>
                        <AppButton variant="fill" size="sm">SM</AppButton>
                        <AppButton variant="fill" size="md">MD</AppButton>
                        <AppButton variant="fill" size="lg">LG</AppButton>
                        <AppButton variant="fill" size="xl">XL</AppButton>
                    </div>

                    <p class="page-demo-hint">text / underline 버튼은 typography가 별도로 적용됩니다.</p>

                    <div class="page-demo-row">
                        <AppTextButton size="sm">SM</AppTextButton>
                        <AppTextButton size="md">MD</AppTextButton>
                        <AppTextButton size="lg">LG</AppTextButton>
                    </div>

                    <div class="page-demo-row">
                        <AppTextButton variant="underline" size="sm">SM</AppTextButton>
                        <AppTextButton variant="underline" size="md">MD</AppTextButton>
                        <AppTextButton variant="underline" size="lg">LG</AppTextButton>
                    </div>
                </PageDemoSection>

                <!-- -------------------------------------------------- -->
                <!-- Shape -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="Shape">
                    <p class="page-demo-hint">버튼 모서리 스타일</p>

                    <ul class="page-demo-hint-list">
                        <li><b>square</b> : 직각</li>
                        <li><b>round</b> : 기본 (6px)</li>
                        <li><b>pill</b> : 완전 둥근 버튼</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton variant="fill" shape="square">Square</AppButton>
                        <AppButton variant="fill" shape="round">Round</AppButton>
                        <AppButton variant="fill" shape="pill">Pill</AppButton>
                    </div>
                </PageDemoSection>

                <!-- -------------------------------------------------- -->
                <!-- Tone -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="Tone">
                    <p class="page-demo-hint">버튼 색상 스타일</p>

                    <div class="page-demo-row">
                        <AppButton variant="fill" tone="primary">Primary</AppButton>
                        <AppButton variant="fill" tone="secondary">Secondary</AppButton>
                        <AppButton variant="outline" tone="gray">Gray</AppButton>
                        <AppButton variant="fill" tone="danger">Danger</AppButton>
                        <AppButton variant="fill" tone="warning">Warning</AppButton>
                        <AppButton variant="fill" tone="success">Success</AppButton>
                        <AppButton variant="fill" tone="info">Info</AppButton>
                    </div>
                </PageDemoSection>

                <!-- -------------------------------------------------- -->
                <!-- Icon -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="Icon">
                    <p class="page-demo-hint">AppButton / AppTextButton 모두 아이콘 슬롯을 지원합니다.</p>

                    <div class="page-demo-row">
                        <AppButton variant="fill">
                            <template #iconLeft>
                                <IconStar />
                            </template>
                            왼쪽 아이콘
                        </AppButton>

                        <AppButton variant="fill">
                            오른쪽 아이콘
                            <template #iconRight>
                                <IconStar />
                            </template>
                        </AppButton>
                    </div>

                    <p class="page-demo-hint">더보기 버튼 (Figma 더보기) - outline + #iconRight 로 만듭니다. size · shape 는 다른 버튼과 같습니다.</p>

                    <div class="page-demo-row">
                        <AppButton v-for="shape in ['square', 'round', 'pill']" :key="shape" :shape="shape" size="lg">
                            더보기
                            <template #iconRight><IconChevronDown /></template>
                        </AppButton>
                    </div>
                </PageDemoSection>

                <!-- -------------------------------------------------- -->
                <!-- Icon Button -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="Icon Button">
                    <p class="page-demo-hint">아이콘만 있는 액션은 AppIconButton을 사용합니다. 버튼 영역과 아이콘 크기를 따로 지정할 수 있습니다.</p>

                    <ul class="page-demo-hint-list">
                        <li><b>size</b> : 클릭 영역 크기</li>
                        <li><b>icon-size</b> : 아이콘 시각 크기</li>
                        <li><b>icon</b> : 아이콘 컴포넌트</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppIconButton aria-label="즐겨찾기" size="xs" icon-size="xs"><IconStar /></AppIconButton>
                        <AppIconButton aria-label="즐겨찾기" size="md" icon-size="md"><IconStar /></AppIconButton>
                        <AppIconButton aria-label="즐겨찾기" size="xl" icon-size="lg"><IconStar /></AppIconButton>
                        <AppIconButton aria-label="즐겨찾기" variant="soft" tone="primary"><IconStar /></AppIconButton>
                        <AppIconButton aria-label="삭제" variant="outline" tone="danger"><IconTrash /></AppIconButton>
                    </div>
                </PageDemoSection>

                <!-- -------------------------------------------------- -->
                <!-- Link -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="Link">
                    <p class="page-demo-hint">AppTextButton은 버튼 / 링크 / RouterLink를 자동으로 처리합니다.</p>

                    <ul class="page-demo-hint-list">
                        <li><b>to</b> → RouterLink</li>
                        <li><b>href</b> → a 태그</li>
                        <li><b>newTab</b> → target="_blank"</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTextButton to="/demos/demo-input"> 내부 라우팅 </AppTextButton>

                        <AppTextButton href="https://example.com" new-tab> 외부 링크 </AppTextButton>
                    </div>
                </PageDemoSection>

                <!-- -------------------------------------------------- -->
                <!-- State -->
                <!-- -------------------------------------------------- -->

                <PageDemoSection class="page-demo-section" title="State">
                    <p class="page-demo-hint">버튼 상태</p>

                    <ul class="page-demo-hint-list">
                        <li><b>disabled</b> : 클릭 불가</li>
                        <li><b>loading</b> : spinner 표시</li>
                        <li><b>active</b> : 선택/완료(Completion) 상태 유지</li>
                        <li><b>width</b> : 공통 가로 속성 - number(px) / '50%' / 'full'(100%)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton disabled> Disabled </AppButton>

                        <AppButton loading> Loading </AppButton>

                        <AppButton active variant="fill" tone="primary"> Active </AppButton>

                        <AppButton :width="200"> width=200 </AppButton>
                    </div>

                    <div class="page-demo-row">
                        <AppButton width="full" variant="fill" tone="primary"> width="full" </AppButton>
                    </div>
                </PageDemoSection>
            </div>

            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { IconChevronDown, IconStar, IconTrash } from '@/components/icons';
import { useDemoI18n } from '@/composables/useI18nText';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';
import PageDemoPropsSummary from '@/components/PageDemo/content/PageDemoPropsSummary.vue';
import PageDemoSection from '@/components/PageDemoSection.vue';

const { title, description } = useDemoI18n('button');
</script>

<!-- demo 공통 스타일: assets/styles/pages/_demo.scss -->
