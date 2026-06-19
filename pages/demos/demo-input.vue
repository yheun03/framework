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
                <PageDemoAccordionSection class="page-demo-accordion" title="Basic" desc="가장 기본적인 Input 사용 예시입니다.">
                    <div class="page-demo-grid">
                        <AppInput v-model="basic" label="이름" placeholder="이름을 입력하세요" hint="이름은 2자 이상 입력하세요" />
                        <AppInput v-model="email" label="이메일" placeholder="name@example.com" />
                        <AppInput v-model="search" placeholder="검색" />
                    </div>
                </PageDemoAccordionSection>

                <!-- SIZE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Size" desc="Input의 높이를 제어합니다.">
                    <div class="page-demo-grid">
                        <AppInput size="xs" label="XS" v-model="sizes.xs" />
                        <AppInput size="sm" label="SM" v-model="sizes.sm" />
                        <AppInput size="md" label="MD" v-model="sizes.md" />
                        <AppInput size="lg" label="LG" v-model="sizes.lg" />
                    </div>
                </PageDemoAccordionSection>

                <!-- SHAPE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Shape" desc="Input의 border 스타일을 제어합니다.">
                    <div class="page-demo-grid">
                        <AppInput shape="square" label="Square" v-model="shape.square" />
                        <AppInput shape="round" label="Round" v-model="shape.round" />
                        <AppInput shape="pill" label="Pill" v-model="shape.pill" />
                        <AppInput shape="underline" label="Underline" v-model="shape.underline" />
                    </div>
                </PageDemoAccordionSection>

                <!-- ICON -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Icon" desc="Input 내부에 아이콘을 배치할 수 있습니다.">
                    <div class="page-demo-grid">
                        <AppInput v-model="search" placeholder="검색어"><template #iconLeft>
                                <IconSearch />
                            </template>
                        </AppInput>
                        <AppInput v-model="search" placeholder="검색" clearable />
                        <AppInput v-model="password" placeholder="비밀번호" type="password" passwordToggle />
                    </div>
                </PageDemoAccordionSection>

                <!-- ICON -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Icon"
                    desc="로컬 아이콘을 Input의 좌/우 슬롯에 배치하는 예제입니다.">
                    <div class="page-demo-grid">
                        <AppInput v-model="icon" placeholder="사용자명"><template #iconLeft>
                                <IconAccount />
                            </template>
                        </AppInput>
                        <AppInput v-model="email" placeholder="이메일"><template #iconLeft>
                                <IconEmail />
                            </template><template #iconRight>
                                <IconCheckCircle />
                            </template></AppInput>
                        <AppInput v-model="url" placeholder="https://example.com"><template #iconLeft>
                                <IconLink />
                            </template></AppInput>
                    </div>
                </PageDemoAccordionSection>

                <!-- STATE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="State" desc="입력 상태에 따른 스타일을 제공합니다.">
                    <div class="page-demo-grid">
                        <AppInput v-model="stateError" label="Error" state="error" hint="에러 메시지" />
                        <AppInput v-model="stateWarning" label="Warning" state="warning" hint="경고 메시지" />
                        <AppInput v-model="stateSuccess" label="Success" state="success" hint="사용 가능" />
                    </div>
                </PageDemoAccordionSection>

                <!-- DISABLED / READONLY -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Disabled / Readonly"
                    desc="입력 불가 상태를 제어합니다.">
                    <div class="page-demo-grid">
                        <AppInput v-model="readonlyValue" label="Readonly" readonly hint="읽기 전용" />
                        <AppInput v-model="disabledValue" label="Disabled" disabled hint="비활성 상태" />
                    </div>
                </PageDemoAccordionSection>
            </main>

            <!-- STATE PANEL -->
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconAccount, IconCheckCircle, IconEmail, IconLink, IconSearch } from "~/components/icons";

const { title, description } = useDemoI18n("input");

const basic = ref("");
const email = ref("");
const search = ref("");
const icon = ref("");
const password = ref("");
const url = ref("");

const sizes = reactive({
    xs: "",
    sm: "",
    md: "",
    lg: "",
});

const shape = reactive({
    square: "",
    round: "",
    pill: "",
    underline: "",
});

const stateError = ref("");
const stateWarning = ref("");
const stateSuccess = ref("");

const readonlyValue = ref("읽기 전용 값");
const disabledValue = ref("비활성 값");
</script>
