/**
 * useSearchList - 목록 조회 공통 로직
 */
import { nextTick } from 'vue';
import { describe, expect, test, vi } from 'vitest';
import { useSearchList } from '@/composables/useSearchList';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/** 호출마다 끝낼 시점을 테스트가 정하는 fetch */
function controlledFetch() {
    const calls = [];
    const fetch = vi.fn((params) => new Promise((resolve, reject) => calls.push({ params, resolve, reject })));
    return { fetch, calls };
}

describe('useSearchList', () => {
    test('화면을 열면 1페이지를 조회하고 { items, total } 을 넣는다', async () => {
        const fetch = vi.fn(async () => ({ items: [{ id: 1 }], total: 1 }));
        const list = useSearchList({ filter: () => ({ keyword: '' }), fetch });
        await flush();
        expect(fetch).toHaveBeenCalledWith({ keyword: '', page: 1, size: 10 });
        expect(list.items.value).toEqual([{ id: 1 }]);
        expect(list.total.value).toBe(1);
        expect(list.loading.value).toBe(false);
    });

    test('늦게 도착한 이전 응답은 최신 결과를 덮어쓰지 않는다', async () => {
        const { fetch, calls } = controlledFetch();
        const list = useSearchList({ fetch });
        list.search(); // 두 번째 요청
        calls[1].resolve({ items: ['new'], total: 1 });
        await flush();
        calls[0].resolve({ items: ['old'], total: 9 });
        await flush();
        expect(list.items.value).toEqual(['new']);
        expect(list.total.value).toBe(1);
        expect(list.loading.value).toBe(false);
    });

    test('조회 버튼을 누르지 않은 조건은 페이지 이동에 쓰지 않는다', async () => {
        const fetch = vi.fn(async () => ({ items: [], total: 100 }));
        const list = useSearchList({ filter: () => ({ keyword: '' }), fetch });
        await flush();
        list.filter.keyword = '입력만 함';
        list.page.value = 2;
        await nextTick();
        await flush();
        expect(fetch).toHaveBeenLastCalledWith({ keyword: '', page: 2, size: 10 });

        list.search();
        await nextTick();
        await flush();
        expect(fetch).toHaveBeenLastCalledWith({ keyword: '입력만 함', page: 1, size: 10 });
    });

    test('정렬은 sort=키,방향 으로 보내고 1페이지부터 다시 조회한다', async () => {
        const fetch = vi.fn(async () => ({ items: [], total: 100 }));
        const list = useSearchList({ fetch, sort: { key: 'dueDate', order: 'asc' } });
        await flush();
        expect(fetch).toHaveBeenLastCalledWith({ page: 1, size: 10, sort: 'dueDate,asc' });

        list.page.value = 3;
        await nextTick();
        list.sort.value = { key: 'qty', order: 'desc' };
        await nextTick();
        await nextTick();
        await flush();
        expect(list.page.value).toBe(1);
        expect(fetch).toHaveBeenLastCalledWith({ page: 1, size: 10, sort: 'qty,desc' });
    });

    test('실패하면 목록을 비우고 error 를 넣는다', async () => {
        const failure = new Error('서버 오류');
        const list = useSearchList({ fetch: async () => Promise.reject(failure) });
        await flush();
        expect(list.items.value).toEqual([]);
        expect(list.error.value).toBe(failure);
        expect(list.loading.value).toBe(false);
    });

    test('fetchAllRows 는 확정된 조건 · 정렬로 전체를 받는다 (엑셀용)', async () => {
        const fetch = vi.fn(async (params) => ({ items: [params], total: 1 }));
        const list = useSearchList({ filter: () => ({ status: 'done' }), fetch, sort: { key: 'no', order: 'desc' } });
        await flush();
        const rows = await list.fetchAllRows(5000);
        expect(rows).toEqual([{ status: 'done', page: 1, size: 5000, sort: 'no,desc' }]);
    });
});
