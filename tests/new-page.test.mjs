/**
 * npm run new:page 스크립트 검사 - 저장소를 임시 폴더에 복사해서 실행합니다. (실제 파일은 건드리지 않음)
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function makeSandbox() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'new-page-'));
    for (const item of ['src', 'scripts']) fs.cpSync(path.join(root, item), path.join(dir, item), { recursive: true });
    return dir;
}

const run = (dir, ...args) => execFileSync('node', ['scripts/new-page.mjs', ...args], { cwd: dir, encoding: 'utf8', stdio: 'pipe' });

test('new:page - 유형별 템플릿 복사 · 제목 · 목록 주소 · 메뉴 한 줄', () => {
    const dir = makeSandbox();
    try {
        run(dir, 'shipments', 'list', '출하 목록', '--menu', 'MENU_026000');
        run(dir, 'shipments/[id]', 'detail', '출하 상세', '--menu', 'MENU_026000');
        run(dir, 'shipments/new', 'form', '출하 등록');
        run(dir, 'item', 'picker', '품목 찾기');

        const list = fs.readFileSync(path.join(dir, 'src/views/shipments.vue'), 'utf8');
        assert.match(list, /<h1 class="business-page__title">출하 목록<\/h1>/);
        assert.match(list, /to="\/shipments\/new"/);
        assert.match(fs.readFileSync(path.join(dir, 'src/views/shipments/new.vue'), 'utf8'), /const LIST_PATH = '\/shipments';/);
        assert.match(fs.readFileSync(path.join(dir, 'src/views/shipments/[id].vue'), 'utf8'), /to="\/shipments"/);
        assert.ok(fs.existsSync(path.join(dir, 'src/components/projects/framework/PickerItem.vue')));

        const menus = fs.readFileSync(path.join(dir, 'src/constants/menus.js'), 'utf8');
        assert.match(menus, /\{ id: 'MENU_SHIPMENTS', parentId: 'MENU_026000', order: \d+, to: '\/shipments', label: '출하 목록' \},\n\];/);
        assert.doesNotMatch(menus, /shipments\/:id/, '상세(:id) 는 메뉴를 만들지 않음');
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test('new:page - 이미 있는 파일 · 잘못된 경로 · 없는 상위 메뉴는 실패', () => {
    const dir = makeSandbox();
    try {
        assert.throws(() => run(dir, 'work-orders', 'list', '중복'));
        assert.throws(() => run(dir, 'Bad_Path', 'list', '대문자'));
        assert.throws(() => run(dir, 'new-screen', 'list', '메뉴 오류', '--menu', 'NO_SUCH_MENU'));
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
