/**
 * apiClient - 공통 요청 · 응답 처리 (빈 조건 제거 · { data } 벗기기 · 오류 토스트 · 401 · 토큰 갱신)
 * 로그인을 켠 프로젝트(auth.enabled: true)로 가정합니다.
 */
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@/project.config', () => ({
    projectConfig: {
        key: 'test',
        serviceName: 'Test',
        titleTemplate: '%s | Test',
        auth: { enabled: true, loginPath: '/login', loginUrl: '/auth/login', logoutUrl: '/auth/logout', refreshUrl: '/auth/refresh' },
        menuUrl: null,
    },
}));

const { default: apiClient, setApiHandlers } = await import('@/services/api/apiClient');

/** axios 대신 응답을 돌려주는 가짜 서버 - handler(config) → { status, data } */
function mockServer(handler) {
    const requests = [];
    apiClient.raw.defaults.adapter = async (config) => {
        requests.push(config);
        const { status = 200, data = null } = await handler(config);
        const response = { status, data, statusText: String(status), headers: {}, config };
        if (status >= 400) throw new AxiosError(`status ${status}`, 'ERR_BAD_REQUEST', config, null, response);
        return response;
    };
    return requests;
}

let handlers;
beforeEach(() => {
    handlers = { getToken: vi.fn(() => 'old-token'), refresh: null, onUnauthorized: vi.fn(), onError: vi.fn() };
    setApiHandlers(handlers);
});

describe('apiClient', () => {
    test('빈 조회 조건(null · 빈 문자열 · 빈 배열)은 보내지 않고, false · 0 은 보낸다', async () => {
        const requests = mockServer(() => ({ data: { items: [], total: 0 } }));
        await apiClient.get('/work-orders', { params: { keyword: '', status: null, lines: [], onlyShortage: false, page: 0 } });
        expect(requests[0].params).toEqual({ onlyShortage: false, page: 0 });
        expect(requests[0].headers.Authorization).toBe('Bearer old-token');
    });

    test('{ data } 로 감싼 응답은 data 만 돌려준다', async () => {
        mockServer(() => ({ data: { data: { id: 1 } } }));
        expect(await apiClient.get('/work-orders/1')).toEqual({ id: 1 });
    });

    test('오류는 서버 message 로 토스트를 띄우고, { toast: false } 면 띄우지 않는다', async () => {
        mockServer(() => ({ status: 409, data: { message: '이미 마감된 작업지시입니다.' } }));
        await expect(apiClient.post('/work-orders', {})).rejects.toThrow('이미 마감된 작업지시입니다.');
        expect(handlers.onError).toHaveBeenCalledTimes(1);
        await expect(apiClient.post('/work-orders', {}, { toast: false })).rejects.toThrow('이미 마감된 작업지시입니다.');
        expect(handlers.onError).toHaveBeenCalledTimes(1);
    });

    test('동시에 여러 요청이 401 이어도 로그인 화면 이동은 한 번만', async () => {
        mockServer(() => ({ status: 401, data: {} }));
        await Promise.allSettled([apiClient.get('/a'), apiClient.get('/b'), apiClient.get('/c')]);
        expect(handlers.onUnauthorized).toHaveBeenCalledTimes(1);
    });

    test('토큰 갱신이 있으면 한 번만 갱신하고 원래 요청들을 새 토큰으로 다시 보낸다', async () => {
        handlers.refresh = vi.fn(async () => 'new-token');
        setApiHandlers(handlers);
        const requests = mockServer((config) =>
            config.headers.Authorization === 'Bearer new-token' ? { data: { ok: config.url } } : { status: 401 },
        );
        const results = await Promise.all([apiClient.get('/a'), apiClient.get('/b')]);
        expect(results).toEqual([{ ok: '/a' }, { ok: '/b' }]);
        expect(handlers.refresh).toHaveBeenCalledTimes(1);
        expect(handlers.onUnauthorized).not.toHaveBeenCalled();
        expect(requests).toHaveLength(4);
    });

    test('갱신도 실패하면 로그인 화면으로 (한 번)', async () => {
        handlers.refresh = vi.fn(async () => Promise.reject(new Error('expired')));
        setApiHandlers(handlers);
        mockServer(() => ({ status: 401 }));
        await Promise.allSettled([apiClient.get('/a'), apiClient.get('/b')]);
        expect(handlers.onUnauthorized).toHaveBeenCalledTimes(1);
    });
});
