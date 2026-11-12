/**
 * 저장소 규칙 검사 - 언어는 JavaScript 하나 (TypeScript 파일 · 문법을 쓰지 않음, DEVELOPMENT_GUIDE 2 · 10장)
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIRS = ['src', 'scripts', 'tests'];

/** 폴더 아래 파일 경로를 모두 모읍니다. */
function listFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? listFiles(full) : [full];
    });
}

const files = SOURCE_DIRS.flatMap((dir) => listFiles(path.join(root, dir)));
const rel = (file) => path.relative(root, file);

test('TypeScript 파일이 없다 (.ts · .tsx · .mts · .cts · tsconfig)', () => {
    const tsFiles = [...files, ...fs.readdirSync(root).map((name) => path.join(root, name))].filter((file) =>
        /\.(ts|tsx|mts|cts)$|tsconfig.*\.json$/.test(file),
    );
    assert.deepEqual(tsFiles.map(rel), []);
});

test('Vue 파일에 lang="ts" 블록이 없다', () => {
    const found = files.filter((file) => file.endsWith('.vue') && /<script[^>]*\blang=["']tsx?["']/.test(fs.readFileSync(file, 'utf8')));
    assert.deepEqual(found.map(rel), []);
});

test('JSDoc 타입은 JavaScript 기본 이름만 쓴다 (TypeScript 전용 문법 없음)', () => {
    // @template · import('…') 타입 · Record<…> · Partial<…> · keyof · 화살표 함수 타입 { () => … }
    const TS_ONLY = /@template\b|@\w+\s*\{[^}]*(import\(|Record<|Partial<|keyof\b|=>)/;
    const found = files
        .filter((file) => /\.(js|mjs|vue)$/.test(file) && !file.endsWith('conventions.test.mjs'))
        .flatMap((file) =>
            fs
                .readFileSync(file, 'utf8')
                .split('\n')
                .map((line, index) => ({ line, at: `${rel(file)}:${index + 1}` }))
                .filter(({ line }) => TS_ONLY.test(line))
                .map(({ at }) => at),
        );
    assert.deepEqual(found, []);
});
