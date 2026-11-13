/**
 * 권한(auth.can) · 메뉴 숨김 · 공통코드(useCodes) · 코드 색(codeTone)
 */
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@/project.config', () => ({
    projectConfig: {
        key: 'test',
        serviceName: 'Test',
        titleTemplate: '%s | Test',
        auth: { enabled: true, loginPath: '/login', loginUrl: '/auth/login', logoutUrl: null, refreshUrl: null },
        menuUrl: null,
    },
}));
vi.mock('@/constants/menus', () => ({
    MENU_ROWS: [
        { id: 'G1', order: 1, label: '생산' },
        { id: 'M1', parentId: 'G1', order: 1, to: '/work-orders', label: '작업지시', permission: 'WO.READ' },
        { id: 'G2', order: 2, label: '관리자' },
        { id: 'M2', parentId: 'G2', order: 1, to: '/users', label: '사용자', permission: 'ADMIN' },
    ],
}));

const { useAuthStore } = await import('@/store/auth');
const { useNavigationStore } = await import('@/store/navigation');
const { useCodes, clearCodes } = await import('@/composables/useCodes');
const { codeTone } = await import('@/constants/codeTone');
const { default: apiClient } = await import('@/services/api/apiClient');

beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
});

describe('권한', () => {
    test('user.permissions 에 있는 권한만 true, * 는 전체', () => {
        const auth = useAuthStore();
        auth.setSession('t', { name: '작업자', permissions: ['WO.READ'] });
        expect(auth.can('WO.READ')).toBe(true);
        expect(auth.can('WO.WRITE')).toBe(false);
        expect(auth.can(undefined)).toBe(true);
        auth.setSession('t', { name: '관리자', permissions: ['*'] });
        expect(auth.can('ANYTHING')).toBe(true);
    });

    test('권한 없는 메뉴와 하위가 모두 빠진 그룹은 LNB 에서 숨긴다', () => {
        useAuthStore().setSession('t', { name: '작업자', permissions: ['WO.READ'] });
        const navigation = useNavigationStore();
        expect(navigation.menuTree.map((menu) => menu.id)).toEqual(['G1']);
        expect(navigation.permissionOf('/users')).toBe('ADMIN');
    });
});

describe('공통코드', () => {
    test('같은 그룹은 한 번만 조회하고, clearCodes 후 다시 조회한다', async () => {
        const get = vi.spyOn(apiClient, 'get').mockResolvedValue([{ value: 'done', label: '완료' }]);
        const first = useCodes('WO_STATUS');
        const second = useCodes('WO_STATUS');
        await Promise.resolve();
        expect(first).toBe(second);
        expect(get).toHaveBeenCalledTimes(1);
        expect(first.value).toEqual([{ value: 'done', label: '완료' }]);
        clearCodes();
        useCodes('WO_STATUS');
        expect(get).toHaveBeenCalledTimes(2);
        get.mockRestore();
    });

    test('codeTone - 그룹 · 값으로 색, 모르면 gray', () => {
        expect(codeTone('WO_STATUS', 'done')).toBe('success');
        expect(codeTone('QI_RESULT', 'fail')).toBe('danger');
        expect(codeTone('WO_STATUS', 'unknown')).toBe('gray');
        expect(codeTone('NO_GROUP', 'x')).toBe('gray');
    });
});
