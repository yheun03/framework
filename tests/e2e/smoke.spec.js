/**
 * 표준 화면 템플릿 · 업무 예제 화면이 오류 없이 열리고 기본 동작을 하는지 확인합니다.
 * 새 표준 템플릿을 추가하면 PAGES 에 한 줄 추가합니다.
 */
import { expect, test } from '@playwright/test';

const PAGES = [
    ['/demos/demo-page-example', '작업지시 목록'],
    ['/demos/demo-page-form', '작업지시 등록'],
    ['/demos/demo-page-master-detail', '마스터 · 디테일'],
    ['/demos/demo-page-picker', '선택 팝업'],
    ['/demos/demo-page-grid', '재고 실사 입력'],
    ['/work-orders', '작업지시 목록'],
    ['/work-orders/WO-260814-01', '작업지시 상세'],
    ['/sales-orders', '수주 목록'],
    ['/sales-orders/SO-260814-01', '수주 상세'],
    ['/purchase-orders', '발주 관리'],
    ['/inventory-status', '재고 현황'],
    ['/production-plan', '생산계획'],
    ['/quality-inspection', '품질검사 현황'],
    ['/equipment-monitoring', '설비 모니터링'],
    ['/erp-dashboard', '경영 현황 대시보드'],
    ['/kiosk/work-result', '오늘 작업지시'],
];

/** 콘솔 오류 · 경고와 화면 오류를 모읍니다. */
function collectErrors(page) {
    const errors = [];
    page.on('console', (message) => ['error', 'warning'].includes(message.type()) && errors.push(message.text()));
    page.on('pageerror', (error) => errors.push(error.message));
    return errors;
}

for (const [path, title] of PAGES) {
    test(`${path} 가 오류 없이 열린다`, async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(title);
        await page.waitForLoadState('networkidle');
        expect(errors).toEqual([]);
    });
}

test('목록: 헤더를 누르면 서버 정렬(sort)로 다시 조회한다', async ({ page }) => {
    await page.goto('/demos/demo-page-example');
    const firstQty = () => page.locator('.app-data-table tbody tr').first().locator('td').nth(4).innerText();
    await page.getByRole('button', { name: '수량' }).click();
    await expect.poll(firstQty).toBe('800');
    await page.getByRole('button', { name: '수량' }).click();
    await expect.poll(firstQty).toBe('3,000');
});

test('목록: 선택 삭제 → 확인 → 다시 조회', async ({ page }) => {
    await page.goto('/demos/demo-page-example');
    const rows = page.locator('.app-data-table tbody tr');
    await expect(rows).toHaveCount(3);
    await page.getByRole('checkbox', { name: '1번째 행 선택' }).check({ force: true });
    await page.getByRole('button', { name: '선택 삭제' }).click();
    await page.getByRole('dialog').getByRole('button', { name: '확인' }).click();
    await expect(rows).toHaveCount(2);
});

test('선택 팝업: 고른 품목이 입력칸에 들어온다', async ({ page }) => {
    await page.goto('/demos/demo-page-picker');
    await page.getByRole('button', { name: '찾기' }).click();
    await page.getByRole('dialog').locator('tbody tr').nth(1).click();
    await expect(page.getByLabel('품목코드')).toHaveValue('FG-10002');
});

test('키오스크: 숫자판으로 양품을 넣고 실적 등록', async ({ page }) => {
    await page.goto('/kiosk/work-result');
    await page.locator('.kiosk-order').first().click();
    const keypad = page.getByRole('group', { name: '숫자판' });
    await keypad.getByRole('button', { name: '5', exact: true }).click();
    await keypad.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: '실적 등록' }).click();
    await page.getByRole('dialog').getByRole('button', { name: '확인' }).click();
    await expect(page.locator('.kiosk-order').first()).toContainText('830 / 1,200');
});

test('태블릿 세로(820px): LNB 는 서랍으로 접히고 메뉴 버튼으로 연다', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto('/work-orders');
    const nav = page.locator('.layout__nav');
    await expect(nav).not.toBeInViewport();
    await page.getByRole('button', { name: '메뉴 열기' }).click();
    await expect(nav).toBeInViewport();
});

test('언어: 일본어로 바꾸면 메뉴가 일본어로 보인다', async ({ page }) => {
    await page.goto('/settings');
    await page.getByRole('button', { name: '일본어' }).click();
    await expect(page.locator('.layout-nav')).toContainText('ERP・MES サンプル画面');
});
