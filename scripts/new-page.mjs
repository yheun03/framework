/**
 * 새 화면 만들기 - 표준 템플릿을 복사하고 LNB 메뉴 한 줄을 추가합니다.
 *
 *   npm run new:page -- <경로> <유형> "<화면명>" [--menu <상위 메뉴 id | root>]
 *
 *   예) npm run new:page -- work-orders list "작업지시 목록" --menu MENU_026000
 *       npm run new:page -- work-orders/[id] detail "작업지시 상세"
 *       npm run new:page -- work-orders/new form "작업지시 등록"
 *       npm run new:page -- item picker "품목 찾기"            → components/projects/{key}/PickerItem.vue
 *
 * 유형
 *   list           목록 (조회 조건 → 목록 → 페이지)          ← views/demos/demo-page-example.vue
 *   form           등록 · 수정 (입력 → 검증 → 하단 저장 바)    ← views/demos/demo-page-form.vue
 *   detail         상세 보기 (요약 · 정보 · 하위 목록)         ← views/work-orders/[id].vue
 *   master-detail  왼쪽 목록 + 오른쪽 상세                   ← views/demos/demo-page-master-detail.vue
 *   picker         찾기 팝업 본문 컴포넌트                    ← components/PageDemo/picker/PageDemoItemPicker.vue
 *
 * 하는 일
 *   1. 템플릿을 복사하고 제목(h1)을 바꿉니다. 이미 있는 파일은 덮어쓰지 않습니다.
 *   2. --menu 를 주면 src/constants/menus.js 맨 아래에 메뉴 한 줄을 추가합니다. (상세 · 팝업은 메뉴 없음)
 *   3. 다음에 할 일(temp 데이터 교체 등)을 알려 줍니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { toRoutePath } from '../src/router/routePath.js';
import { MENU_ROWS } from '../src/constants/menus.js';
import { projectConfig } from '../src/project.config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (file) => path.relative(root, file);

const TEMPLATES = {
    list: 'src/views/demos/demo-page-example.vue',
    form: 'src/views/demos/demo-page-form.vue',
    detail: 'src/views/work-orders/[id].vue',
    'master-detail': 'src/views/demos/demo-page-master-detail.vue',
    picker: 'src/components/PageDemo/picker/PageDemoItemPicker.vue',
};

// ── 입력 확인 ─────────────────────────────────────────────
const args = process.argv.slice(2);
const menuIndex = args.indexOf('--menu');
const menuParent = menuIndex >= 0 ? args.splice(menuIndex, 2)[1] : null;
const [pagePath, type, title] = args;

function fail(message) {
    console.error(`✗ ${message}\n`);
    console.error('사용법: npm run new:page -- <경로> <유형> "<화면명>" [--menu <상위 메뉴 id | root>]');
    console.error(`유형: ${Object.keys(TEMPLATES).join(' · ')}`);
    process.exit(1);
}

if (!pagePath || !type || !title) fail('경로 · 유형 · 화면명을 모두 적어 주세요.');
if (!TEMPLATES[type]) fail(`알 수 없는 유형 '${type}'`);
// 주소는 kebab-case, 동적 주소는 [id] 처럼 대괄호 (views 파일 경로 = 주소)
if (!/^[a-z0-9-]+(\/([a-z0-9-]+|\[[a-zA-Z]+\]))*$/.test(pagePath))
    fail(`경로 '${pagePath}' 는 영문 소문자 · 숫자 · - 와 [id] 만 씁니다. (예: work-orders/[id])`);

// ── 파일 만들기 ───────────────────────────────────────────
const isPicker = type === 'picker';
const pascal = pagePath
    .split(/[/-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
const target = isPicker
    ? path.join(root, 'src/components/projects', projectConfig.key, `Picker${pascal}.vue`)
    : path.join(root, 'src/views', `${pagePath}.vue`);

if (fs.existsSync(target)) fail(`${rel(target)} 이(가) 이미 있습니다.`);

const routePath = isPicker ? null : toRoutePath(`src/views/${pagePath}.vue`);
// 목록 주소 추정: 끝의 new · edit · :id 를 뗀 주소 (form · detail 의 '목록' 버튼용)
const listPath = routePath?.replace(/(\/(new|edit|:\w+))+$/, '') || '/';

let source = fs.readFileSync(path.join(root, TEMPLATES[type]), 'utf8');
source = source
    .replace(/<h1 class="business-page__title">[\s\S]*?<\/h1>/, `<h1 class="business-page__title">${title}</h1>`)
    // 설명 문구는 값을 쓰지 않는 경우({{ }} 없음)만 바꿉니다. (상세 템플릿은 주소 id 를 보여줌)
    .replace(/<p class="business-page__desc">([^{<]*)<\/p>/, '<p class="business-page__desc">화면 설명을 한 줄로 적습니다.</p>')
    .replace(/<p class="business-page__eyebrow">[\s\S]*?<\/p>\n\s*/, '')
    .replace(/const LIST_PATH = .*$/m, `const LIST_PATH = '${listPath}';`)
    .replace(/to="\/demos\/demo-page-form"/, `to="${listPath}/new"`)
    .replace(/to="\/work-orders"/, `to="${listPath}"`);

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, source);
console.log(`✓ 만듦: ${rel(target)}${routePath ? `  (주소 ${routePath})` : ''}`);

// ── 메뉴 한 줄 추가 ───────────────────────────────────────
const canHaveMenu = !isPicker && !routePath.includes(':');
if (menuParent && canHaveMenu) {
    const parentId = menuParent === 'root' ? null : menuParent;
    if (parentId && !MENU_ROWS.some((row) => row.id === parentId)) {
        console.error(`✗ 메뉴: 상위 메뉴 '${parentId}' 가 src/constants/menus.js 에 없습니다. (화면 파일은 만들었습니다)`);
        process.exit(1);
    }
    const id = `MENU_${pagePath.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
    if (MENU_ROWS.some((row) => row.id === id || row.to === routePath)) {
        console.log(`· 메뉴: 이미 있음 (${id} 또는 ${routePath})`);
    } else {
        const order = Math.max(0, ...MENU_ROWS.filter((row) => (row.parentId ?? null) === parentId).map((row) => row.order)) + 1;
        const fields = [`id: '${id}'`, parentId && `parentId: '${parentId}'`, `order: ${order}`, `to: '${routePath}'`, `label: '${title}'`];
        const menuFile = path.join(root, 'src/constants/menus.js');
        const menuSource = fs.readFileSync(menuFile, 'utf8');
        const end = menuSource.lastIndexOf('];');
        fs.writeFileSync(menuFile, `${menuSource.slice(0, end)}    { ${fields.filter(Boolean).join(', ')} },\n${menuSource.slice(end)}`);
        console.log(`✓ 메뉴 추가: src/constants/menus.js → ${id} (다국어가 필요하면 label 대신 labelKey)`);
    }
} else if (menuParent) {
    console.log('· 메뉴: 상세(:id) · 찾기 팝업은 메뉴를 만들지 않습니다.');
}

// ── 다음 할 일 ────────────────────────────────────────────
console.log(`
다음 할 일
1. npm run serve → ${routePath ?? '팝업을 여는 화면'} 에서 확인
2. 화면 문구 · 조회 조건 · 컬럼을 업무에 맞게 수정 (temp 데이터로 먼저 완성)
3. API 연동: '// ── temp 데이터' ~ '// temp 데이터 끝' 영역만 교체 (API_GUIDE.md)
4. npm run check`);
