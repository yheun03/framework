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
                <PageDemoAccordionSection class="page-demo-accordion" title="Basic"
                    desc="label, description, hint를 가진 기본 FormField 예시입니다.">
                    <AppFormField label="이름" description="사용자의 실명을 입력합니다." hint="한글 또는 영문 이름을 입력하세요.">
                        <template #default="{ id, describedby }">
                            <AppInput :id="id" v-model="name" placeholder="이름 입력" :aria-describedby="describedby" />
                        </template>
                    </AppFormField>
                </PageDemoAccordionSection>

                <!-- REQUIRED -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Required" desc="required 상태에서는 label 옆에 필수 표시가 노출됩니다.">
                    <AppFormField label="이메일" required hint="업무용 이메일을 입력하세요.">
                        <template #default="{ id, describedby }">
                            <AppInput :id="id" v-model="email" placeholder="email@example.com"
                                :aria-describedby="describedby" />
                        </template>
                    </AppFormField>
                </PageDemoAccordionSection>

                <!-- OPTIONAL -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Optional" desc="optionalText로 선택 입력 필드를 표시할 수 있습니다.">
                    <AppFormField label="닉네임" optional-text="선택 입력" hint="입력하지 않아도 됩니다.">
                        <template #default="{ id, describedby }">
                            <AppInput :id="id" v-model="nickname" placeholder="닉네임 입력"
                                :aria-describedby="describedby" />
                        </template>
                    </AppFormField>
                </PageDemoAccordionSection>

                <!-- ERROR -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Error" desc="error가 있으면 hint 대신 error message가 표시됩니다.">
                    <AppFormField label="비밀번호" required hint="8자 이상 입력하세요." :error="passwordError">
                        <template #default="{ id, invalid, describedby }">
                            <AppInput :id="id" v-model="password" type="password" placeholder="비밀번호 입력"
                                :invalid="invalid" :aria-describedby="describedby" />
                        </template>
                    </AppFormField>
                </PageDemoAccordionSection>

                <!-- DISABLED -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Disabled"
                    desc="disabled 상태의 label, description, message 표현을 확인합니다.">
                    <AppFormField label="부서" disabled description="비활성 상태의 필드입니다." hint="현재 수정할 수 없습니다.">
                        <template #default="{ id, disabled, describedby }">
                            <AppInput :id="id" v-model="department" disabled placeholder="부서 입력"
                                :aria-describedby="describedby" />
                        </template>
                    </AppFormField>
                </PageDemoAccordionSection>

                <!-- SLOT LABEL -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Label Slot" desc="label slot으로 커스텀 라벨을 렌더링할 수 있습니다.">
                    <AppFormField hint="slot label 예시입니다.">
                        <template #label>
                            <div class="page-demo-inline">
                                <strong>커스텀 라벨</strong>
                                <AppBadge color="info">NEW</AppBadge>
                            </div>
                        </template>

                        <template #default="{ id, describedby }">
                            <AppInput :id="id" v-model="customLabelValue" placeholder="값 입력"
                                :aria-describedby="describedby" />
                        </template>
                    </AppFormField>
                </PageDemoAccordionSection>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />

                    <PageDemoAccordionSection class="page-demo-accordion" title="Current Value">
                        <pre class="page-demo-output">{{ output }}</pre>
                    </PageDemoAccordionSection>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
const { title, description } = useDemoI18n("form");

const name = ref("");
const email = ref("");
const nickname = ref("");
const password = ref("");
const department = ref("플랫폼팀");
const customLabelValue = ref("");

const passwordError = computed(() => {
    if (!password.value) return "";

    return password.value.length < 8 ? "비밀번호는 8자 이상 입력해주세요." : "";
});

const output = computed(() =>
    JSON.stringify(
        {
            name: name.value,
            email: email.value,
            nickname: nickname.value,
            password: password.value,
            department: department.value,
            customLabelValue: customLabelValue.value,
            passwordError: passwordError.value,
            propsSummary: {
                label: true,
                required: true,
                disabled: true,
                description: true,
                hint: true,
                error: ["string", "boolean", "null"],
                optionalText: true,
                slots: ["default", "label"],
            },
        },
        null,
        2,
    ),
);
</script>
