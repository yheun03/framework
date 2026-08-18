<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 생산관리</p>
                <h1 class="business-page__title">생산계획</h1>
                <p class="business-page__desc">수주와 설비 부하를 기준으로 일별 생산계획을 편성합니다.</p>
            </div>
            <div class="business-page__actions"><AppButton size="md" variant="fill">계획 등록</AppButton></div>
        </header>
        <section class="business-toolbar">
            <AppDatePicker v-model="planDate" class="business-toolbar__field" size="sm" /><AppSelect
                v-model="line"
                class="business-toolbar__field"
                size="sm"
                :options="lines"
                placeholder="전체 라인"
            /><AppSelect v-model="shift" class="business-toolbar__field" size="sm" :options="shifts" placeholder="전체 근무조" />
            <div class="business-toolbar__actions"><AppButton size="md" variant="fill">조회</AppButton></div>
        </section>
        <section class="business-summary business-summary--compact">
            <article v-for="item in summary" :key="item.label" class="business-summary__item">
                <span class="business-summary__label">{{ item.label }}</span
                ><strong class="business-summary__value">{{ item.value }}</strong>
            </article>
        </section>
        <AppSection title="2026년 8월 14일 생산계획"
            ><div class="business-table-wrap">
                <table class="business-table">
                    <thead>
                        <tr>
                            <th>라인</th>
                            <th>작업지시</th>
                            <th>품목</th>
                            <th>계획수량</th>
                            <th>계획시간</th>
                            <th>부하율</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rows" :key="row.order">
                            <td>{{ row.line }}</td>
                            <td>{{ row.order }}</td>
                            <td>{{ row.item }}</td>
                            <td>{{ row.qty }}</td>
                            <td>{{ row.time }}</td>
                            <td class="business-table__progress"><AppProgressBar :value="row.load" show-value /></td>
                            <td>
                                <span class="business-status" :class="`business-status--${row.state}`">{{ row.status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div></AppSection
        >
    </div>
</template>
<script setup lang="ts">
const planDate = ref('2026-08-14');
const line = ref(null);
const shift = ref(null);
const lines = [
    { label: '가공 1라인', value: 'line-1' },
    { label: '가공 2라인', value: 'line-2' },
    { label: '조립 라인', value: 'assembly' },
];
const shifts = [
    { label: '주간 A조', value: 'a' },
    { label: '야간 B조', value: 'b' },
];
const summary = [
    { label: '계획 수량', value: '8,400 EA' },
    { label: '계획 공수', value: '186 h' },
    { label: '평균 부하율', value: '82%' },
    { label: '미배정', value: '2건' },
];
const rows = [
    {
        line: '가공 1라인',
        order: 'WO-260814-01',
        item: '모터 하우징 A',
        qty: '1,200 EA',
        time: '08:00 ~ 14:00',
        load: 86,
        status: '확정',
        state: 'success',
    },
    { line: '가공 2라인', order: 'WO-260814-02', item: '샤프트 B', qty: '800 EA', time: '08:00 ~ 12:30', load: 72, status: '확정', state: 'success' },
    {
        line: '조립 라인',
        order: 'WO-260814-05',
        item: '모터 ASSY',
        qty: '600 SET',
        time: '13:00 ~ 20:00',
        load: 94,
        status: '부하주의',
        state: 'warning',
    },
];
</script>
