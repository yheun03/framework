<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Basic -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Basic"
                    description="여러 입력 컴포넌트(AppInput, AppSelect 등)를 하나의 필드로 묶습니다. Figma 전화번호 셀렉트 패턴입니다."
                >
                    <AppInputGroup label="연락처" separator="-" :width="420">
                        <AppSelect v-model="phone.first" :items="phonePrefixes" size="sm" />
                        <AppInput v-model="phone.middle" size="sm" :max-length="4" />
                        <AppInput v-model="phone.last" size="sm" :max-length="4" />
                    </AppInputGroup>
                </PageDemoSection>

                <!-- Separator -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Separator"
                    description="자식 사이에 넣을 구분 문자입니다. 지정하지 않으면 간격만 둡니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>'-'</b> : 전화번호</li>
                        <li><b>'@'</b> : 이메일</li>
                        <li><b>'~'</b> : 기간</li>
                        <li><b>''</b> : 구분 문자 없음 (기본값)</li>
                    </ul>

                    <div class="page-demo-stack">
                        <AppInputGroup label="이메일" separator="@" :width="420">
                            <AppInput v-model="email.id" size="sm" placeholder="아이디" />
                            <AppSelect v-model="email.domain" :items="domains" size="sm" />
                        </AppInputGroup>
                        <AppInputGroup label="수량 범위" separator="~" :width="420">
                            <AppInput v-model="range.min" size="sm" placeholder="최소" />
                            <AppInput v-model="range.max" size="sm" placeholder="최대" />
                        </AppInputGroup>
                        <AppInputGroup label="구분 문자 없음" :width="420">
                            <AppInput v-model="email.id" size="sm" placeholder="코드" />
                            <AppButton size="sm" variant="fill" tone="gray">검색</AppButton>
                        </AppInputGroup>
                    </div>
                </PageDemoSection>

                <!-- Gap -->
                <PageDemoSection class="page-demo-section" title="Gap" description="자식 사이 간격입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>gap</b> : number(px) | string - 기본값: separator 있으면 20, 없으면 8</li>
                    </ul>

                    <AppInputGroup label="gap = 4" :gap="4" :width="420">
                        <AppInput v-model="spec.w" size="sm" placeholder="가로" />
                        <AppInput v-model="spec.h" size="sm" placeholder="세로" />
                        <AppInput v-model="spec.d" size="sm" placeholder="높이" />
                    </AppInputGroup>
                </PageDemoSection>

                <!-- Label / Hint / State -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Label / Hint / State"
                    description="그룹 단위 라벨·문구·상태입니다. 자식의 개별 label 은 숨겨집니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>label</b> : 그룹 라벨</li>
                        <li><b>hint</b> : 그룹 하단 문구</li>
                        <li><b>state</b> : error / warning / success - 그룹 전체에 적용</li>
                    </ul>

                    <AppInputGroup label="규격 (가로 x 세로 x 높이)" separator="x" :width="420" state="error" hint="규격을 모두 입력하세요.">
                        <AppInput v-model="spec.w" size="sm" />
                        <AppInput v-model="spec.h" size="sm" />
                        <AppInput v-model="spec.d" size="sm" />
                    </AppInputGroup>
                </PageDemoSection>

                <!-- Width -->
                <PageDemoSection class="page-demo-section" title="Width" description="공통 가로 속성입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>width</b> : number(px) | '50%' | 'full'</li>
                    </ul>

                    <AppInputGroup label="width = full" separator="-" width="full">
                        <AppSelect v-model="phone.first" :items="phonePrefixes" size="sm" />
                        <AppInput v-model="phone.middle" size="sm" />
                        <AppInput v-model="phone.last" size="sm" />
                    </AppInputGroup>
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
const { title, description } = useDemoI18n('inputGroup');
// temp data
const phonePrefixes = ['010', '011', '016', '02', '031'].map((value) => ({ value, label: value }));
const domains = ['jonsoft.co.kr', 'gmail.com', 'naver.com'].map((value) => ({ value, label: value }));
const phone = reactive({ first: '010' as string | number | boolean | null, middle: '1234', last: '5678' });
const email = reactive({ id: '', domain: 'jonsoft.co.kr' as string | number | boolean | null });
const range = reactive({ min: '10', max: '' });
const spec = reactive({ w: '1200', h: '', d: '' });
</script>
