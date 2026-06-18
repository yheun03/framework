<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- -------------------------------------------------- -->
                <!-- Variant -->
                <!-- -------------------------------------------------- -->

                <PageDemoAccordionSection class="page-demo-accordion" title="Variant">
                    <p class="page-demo-hint">버튼 유형별 기본 스타일을 정의합니다.</p>

                    <ul class="page-demo-hint-list">
                        <li><b>fill</b> : 배경 채움 버튼 (AppButton)</li>
                        <li><b>outline</b> : 테두리 버튼 (AppButton)</li>
                        <li><b>text</b> : 배경 없는 텍스트 버튼 (AppTextButton)</li>
                        <li><b>underline</b> : 링크 스타일 버튼 (AppTextButton)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton variant="fill" @click="handleLogClick('fill')">fill</AppButton>
                        <AppButton variant="outline" @click="handleLogClick('outline')">outline</AppButton>
                        <AppTextButton @click="handleLogClick('text')">text</AppTextButton>
                        <AppTextButton variant="underline" @click="handleLogClick('underline')">underline
                        </AppTextButton>
                    </div>
                </PageDemoAccordionSection>

                <!-- -------------------------------------------------- -->
                <!-- Size -->
                <!-- -------------------------------------------------- -->

                <PageDemoAccordionSection class="page-demo-accordion" title="Size">
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

                    <p class="page-demo-hint">
                        text / underline 버튼은 typography가 별도로 적용됩니다.
                    </p>

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
                </PageDemoAccordionSection>

                <!-- -------------------------------------------------- -->
                <!-- Shape -->
                <!-- -------------------------------------------------- -->

                <PageDemoAccordionSection class="page-demo-accordion" title="Shape">
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
                </PageDemoAccordionSection>

                <!-- -------------------------------------------------- -->
                <!-- Tone -->
                <!-- -------------------------------------------------- -->

                <PageDemoAccordionSection class="page-demo-accordion" title="Tone">
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
                </PageDemoAccordionSection>

                <!-- -------------------------------------------------- -->
                <!-- Icon -->
                <!-- -------------------------------------------------- -->

                <PageDemoAccordionSection class="page-demo-accordion" title="Icon">
                    <p class="page-demo-hint">
                        AppButton / AppTextButton 모두 아이콘 슬롯을 지원합니다.
                    </p>

                    <div class="page-demo-row">
                        <AppButton variant="fill">
                            <template #iconLeft>
                                <Icon icon="mdi:star-outline" />
                            </template>
                            왼쪽 아이콘
                        </AppButton>

                        <AppButton variant="fill">
                            오른쪽 아이콘
                            <template #iconRight>
                                <Icon icon="mdi:star-outline" />
                            </template>
                        </AppButton>
                    </div>
                </PageDemoAccordionSection>

                <!-- -------------------------------------------------- -->
                <!-- Icon Button -->
                <!-- -------------------------------------------------- -->

                <PageDemoAccordionSection class="page-demo-accordion" title="Icon Button">
                    <p class="page-demo-hint">
                        아이콘만 있는 액션은 AppIconButton을 사용합니다. 버튼 영역과 아이콘
                        크기를 따로 지정할 수 있습니다.
                    </p>

                    <ul class="page-demo-hint-list">
                        <li><b>button-size</b> : 클릭 영역 크기</li>
                        <li><b>icon-size</b> : 아이콘 시각 크기</li>
                        <li><b>icon</b> : Iconify 아이콘 이름</li>
                        <li>
                            <b>width / height</b> : 가로/세로 지정 + min-size 자동 동기화
                        </li>
                    </ul>

                    <div class="page-demo-row">
                        <AppIconButton icon="mdi:star-outline" aria-label="즐겨찾기" button-size="xs" icon-size="xs" />
                        <AppIconButton icon="mdi:star-outline" aria-label="즐겨찾기" button-size="md" icon-size="md" />
                        <AppIconButton icon="mdi:star-outline" aria-label="즐겨찾기" button-size="xl" icon-size="lg" />
                        <AppIconButton icon="mdi:star-outline" aria-label="즐겨찾기" :button-size="44" :icon-size="18"
                            variant="soft" tone="primary" />
                        <AppIconButton icon="mdi:star-outline" aria-label="즐겨찾기" :width="80" :height="30"
                            :icon-size="18" variant="soft" tone="secondary" />
                        <AppIconButton icon="mdi:trash-can-outline" aria-label="삭제" :button-size="36" :icon-size="18"
                            variant="outline" tone="danger" />
                    </div>
                </PageDemoAccordionSection>

                <!-- -------------------------------------------------- -->
                <!-- Link -->
                <!-- -------------------------------------------------- -->

                <PageDemoAccordionSection class="page-demo-accordion" title="Link">
                    <p class="page-demo-hint">
                        AppTextButton은 버튼 / 링크 / NuxtLink를 자동으로 처리합니다.
                    </p>

                    <ul class="page-demo-hint-list">
                        <li><b>to</b> → NuxtLink</li>
                        <li><b>href</b> → a 태그</li>
                        <li><b>newTab</b> → target="_blank"</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTextButton to="/demos/demo-input"> 내부 라우팅 </AppTextButton>

                        <AppTextButton href="https://example.com" new-tab>
                            외부 링크
                        </AppTextButton>
                    </div>
                </PageDemoAccordionSection>

                <!-- -------------------------------------------------- -->
                <!-- State -->
                <!-- -------------------------------------------------- -->

                <PageDemoAccordionSection class="page-demo-accordion" title="State">
                    <p class="page-demo-hint">버튼 상태</p>

                    <ul class="page-demo-hint-list">
                        <li><b>disabled</b> : 클릭 불가</li>
                        <li><b>loading</b> : spinner 표시</li>
                        <li><b>block</b> : width 100%</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton disabled> Disabled </AppButton>

                        <AppButton loading> Loading </AppButton>

                        <AppButton block> Block </AppButton>
                    </div>
                </PageDemoAccordionSection>

                <PageDemoAccordionSection class="page-demo-accordion" title="Custom Size">
                    <p class="page-demo-hint">
                        AppButton / AppTextButton / AppIconButton은 width/height 속성으로
                        가로/세로와 min-size를 함께 지정할 수 있습니다.
                    </p>

                    <ul class="page-demo-hint-list">
                        <li><b>width</b> : width + min-width 동기화</li>
                        <li><b>height</b> : height + min-height 동기화</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton variant="fill" :width="120" :height="36">
                            Fill 120x36
                        </AppButton>
                        <AppButton variant="outline" width="140px" height="30px">
                            Outline 140x30
                        </AppButton>
                        <AppTextButton :width="110" :height="32">
                            Text 110x32
                        </AppTextButton>
                        <AppTextButton variant="underline" :width="120" :height="28">
                            Underline 120x28
                        </AppTextButton>
                        <AppIconButton icon="mdi:star-outline" aria-label="커스텀 아이콘 버튼" :width="72" :height="30"
                            :icon-size="16" variant="outline" tone="primary" />
                    </div>
                </PageDemoAccordionSection>
            </main>

            <!-- 로그 패널 -->

            <aside class="page-demo-aside">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />

                    <PageDemoAccordionSection class="page-demo-accordion" title="Actions">
                        <div class="page-demo-actions">
                            <AppButton variant="fill" @click="handleClearClick">
                                로그 비우기
                            </AppButton>
                        </div>
                    </PageDemoAccordionSection>

                    <PageDemoAccordionSection class="page-demo-accordion" title="Click Log">
                        <pre class="page-demo-output">
                {{ output }}
            </pre>
                    </PageDemoAccordionSection>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
const { title, description } = useDemoI18n("button");

type LogItem = { t: number; message: string };
const logs = ref<LogItem[]>([]);

function handleLogClick(message: string) {
    logs.value = [{ t: Date.now(), message }, ...logs.value].slice(0, 30);
}

function handleClearClick() {
    logs.value = [];
}

// 해당 데모 페이지의 클릭/입력 결과를 Current Value 영역에 노출합니다.
const output = computed(() =>
    JSON.stringify({ count: logs.value.length, logs: logs.value }, null, 2),
);
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
