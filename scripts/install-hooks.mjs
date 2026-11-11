/**
 * git 커밋 전 검사(.githooks/pre-commit)를 연결합니다. (npm install 시 prepare 로 자동 실행)
 * - git 저장소가 아니거나 git 이 없으면(Docker 빌드 등) 아무것도 하지 않습니다.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (fs.existsSync(path.join(root, '.git'))) {
    try {
        execSync('git config core.hooksPath .githooks', { cwd: root, stdio: 'ignore' });
        console.log('· git pre-commit 검사 연결 (.githooks/pre-commit)');
    } catch {
        // git 이 없으면 건너뜁니다.
    }
}
