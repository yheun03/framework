<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">ERP · 영업관리</p>
                <h1 class="business-page__title">수주 목록</h1>
                <p class="business-page__desc">거래처별 수주와 납기 상태를 관리합니다.</p>
            </div>
            <div class="business-page__actions"><AppButton size="md" variant="fill">신규 수주 등록</AppButton></div>
        </header>
        <section class="business-toolbar">
            <AppInput
                v-model="keyword"
                class="business-toolbar__field business-toolbar__field--wide"
                size="sm"
                placeholder="수주번호 또는 거래처 검색"
                clearable
            />
            <AppSelect v-model="status" class="business-toolbar__field" size="sm" :options="statusOptions" placeholder="전체 상태" />
            <AppDatePicker v-model="orderDate" class="business-toolbar__field" size="sm" />
            <div class="business-toolbar__actions"><AppButton size="md" variant="fill">조회</AppButton><AppButton size="md">초기화</AppButton></div>
        </section>
        <AppSection title="수주 128건" description="납기 임박 순으로 표시합니다.">
            <div class="business-table-wrap">
                <table class="business-table">
                    <thead>
                        <tr>
                            <th><AppChoice v-model="checkAll" /></th>
                            <th>수주번호</th>
                            <th>거래처</th>
                            <th>품목</th>
                            <th>수량</th>
                            <th>납기일</th>
                            <th>담당자</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rows" :key="row.no">
                            <td><AppChoice v-model="row.checked" /></td>
                            <td>
                                <NuxtLink :to="`/sales-order-detail?id=${row.no}`" class="business-link">{{ row.no }}</NuxtLink>
                            </td>
                            <td>{{ row.customer }}</td>
                            <td>{{ row.item }}</td>
                            <td>{{ row.qty }}</td>
                            <td>{{ row.date }}</td>
                            <td>{{ row.manager }}</td>
                            <td>
                                <span class="business-status" :class="`business-status--${row.state}`">{{ row.status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="128" />
        </AppSection>
    </div>
</template>
<script setup lang="ts">
const keyword = ref('');
const status = ref(null);
const orderDate = ref('2026-08-14');
const checkAll = ref(false);
const page = ref(1);
const pageSize = ref(10);
const statusOptions = [
    { label: '확정', value: 'confirmed' },
    { label: '생산중', value: 'working' },
    { label: '출하완료', value: 'done' },
];
const rows = reactive([
    {
        checked: false,
        no: 'SO-260814-01',
        customer: '한빛전자',
        item: '모터 하우징 A',
        qty: '1,200 EA',
        date: '2026-08-20',
        manager: '김영업',
        status: '생산중',
        state: 'info',
    },
    {
        checked: false,
        no: 'SO-260814-02',
        customer: '대성모터스',
        item: '샤프트 B',
        qty: '800 EA',
        date: '2026-08-22',
        manager: '이수주',
        status: '확정',
        state: 'success',
    },
    {
        checked: false,
        no: 'SO-260813-08',
        customer: '유진테크',
        item: '브래킷 C',
        qty: '2,400 EA',
        date: '2026-08-18',
        manager: '박납기',
        status: '납기주의',
        state: 'warning',
    },
]);
</script>
