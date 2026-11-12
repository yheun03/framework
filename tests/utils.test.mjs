/**
 * 순수 함수 단위 테스트 (Node 내장 테스트 러너 - 추가 설치 없음)
 *   npm test
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { accessibleTextColor, contrastRatio, primaryTextColor } from '../src/utils/color.js';
import { oneOf, SIZES } from '../src/utils/props.js';
import { toRoutePath } from '../src/router/routePath.js';
import { isVisibleRoute } from '../src/router/routeTabs.js';
import { sampleImage } from '../src/utils/sampleImage.js';
import { resolveApiUrl, resolveAppMode } from '../src/utils/common.js';
import { normalizeListResponse, slicePage } from '../src/utils/list.js';

test('대비 계산: 흰색-검정 21:1, 같은 색 1:1', () => {
    assert.equal(Math.round(contrastRatio('#ffffff', '#000000')), 21);
    assert.equal(contrastRatio('#ff5900', '#ff5900'), 1);
});

test('글자용 브랜드색은 연한 색도 흰 배경 4.5:1 이상', () => {
    for (const primary of ['#ff5900', '#ffd400', '#00b050', '#39b5e0', '#0057b8']) {
        assert.ok(contrastRatio(primaryTextColor(primary), '#ffffff') >= 4.5, primary);
        assert.ok(contrastRatio(primaryTextColor(primary, 'dark'), '#2a2f38') >= 4.5, `${primary} dark`);
        assert.ok(contrastRatio(accessibleTextColor(primary), '#ffffff') >= 4.5, `${primary} fill`);
    }
});

test('기본 오렌지는 기존 디자인 값(#bf4300)을 유지', () => {
    assert.equal(primaryTextColor('#ff5900'), '#bf4300');
});

test('oneOf: 허용 값 · 빈 값 통과, 오타는 실패, number 옵션', () => {
    const validate = oneOf(SIZES);
    assert.equal(validate('md'), true);
    assert.equal(validate(undefined), true);
    assert.equal(validate('medium'), false);
    assert.equal(oneOf(SIZES, { number: true })(36), true);
    assert.equal(validate(36), false);
});

test('views 파일 경로 → 주소', () => {
    assert.equal(toRoutePath('/src/views/index.vue'), '/');
    assert.equal(toRoutePath('/src/views/demos/demo-button.vue'), '/demos/demo-button');
    assert.equal(toRoutePath('/src/views/work-orders/index.vue'), '/work-orders');
    assert.equal(toRoutePath('/src/views/work-orders/[id].vue'), '/work-orders/:id');
});

test('탭 기록: 레이아웃 화면은 기록, 로그인 · 404 · tab:false 는 제외', () => {
    assert.equal(isVisibleRoute({ path: '/work-orders', meta: {} }), true);
    assert.equal(isVisibleRoute({ path: '/login', meta: { layout: false } }), false);
    assert.equal(isVisibleRoute({ path: '/x', name: 'not-found', meta: {} }), false);
    assert.equal(isVisibleRoute({ path: '/popup', meta: { tab: false } }), false);
});

test('샘플 이미지는 외부 주소가 아닌 data URI', () => {
    const url = sampleImage(3, 80);
    assert.ok(url.startsWith('data:image/svg+xml'));
    assert.ok(decodeURIComponent(url).includes('width="80"'));
});

test('실행 모드: npm 스크립트 모드 > 컨테이너 api-config.js > local', () => {
    const configs = {
        local: { VITE_API_URL: 'http://localhost:8080' },
        dev: { VITE_API_URL: '/api' },
        prd: { VITE_API_URL: '/api' },
        pub: { VITE_API_URL: '/api' },
    };
    // npm run prd 를 IP 로 열어도 public/api-config.js 의 'dev' 에 덮이지 않음
    assert.equal(resolveAppMode({ configs, buildMode: 'prd', runtimeMode: 'dev' }), 'prd');
    // Docker 이미지(모드 없이 빌드)는 컨테이너 MODE 를 따름
    assert.equal(resolveAppMode({ configs, buildMode: undefined, runtimeMode: 'prd' }), 'prd');
    assert.equal(resolveAppMode({ configs, buildMode: undefined, runtimeMode: undefined }), 'local');
    assert.equal(resolveAppMode({ configs, buildMode: undefined, runtimeMode: 'oops' }), 'local');
    // localhost 접속은 항상 local API
    assert.equal(resolveApiUrl({ configs, mode: 'prd', hostname: 'localhost' }), 'http://localhost:8080');
    assert.equal(resolveApiUrl({ configs, mode: 'prd', hostname: '10.0.0.5' }), '/api');
});

test('목록 응답: 배열은 화면 페이지, { items|content, total|totalElements } 는 서버 페이지', () => {
    assert.deepEqual(normalizeListResponse([1, 2]), { items: [1, 2], total: 2, paged: false });
    assert.deepEqual(normalizeListResponse({ items: [1], total: 30 }), { items: [1], total: 30, paged: true });
    assert.deepEqual(normalizeListResponse({ content: [1], totalElements: 12 }), { items: [1], total: 12, paged: true });
    assert.deepEqual(normalizeListResponse(null), { items: [], total: 0, paged: false });
    assert.deepEqual(slicePage([1, 2, 3, 4, 5], 2, 2), [3, 4]);
});
