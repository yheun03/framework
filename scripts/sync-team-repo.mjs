#!/usr/bin/env node
/**
 * 개인 framework 저장소 → 팀 client 저장소 동기화
 *
 * 저장소 루트는 `git rev-parse --show-toplevel`로 자동 탐지합니다.
 * 클론 경로가 달라도 동일하게 동작합니다.
 *
 * 사용법:
 *   npm run sync:team       # 매주: framework 최신 반영
 *   npm run sync:team:init  # 최초: 팀 저장소를 framework 이력으로 교체
 *
 * 환경 변수 (선택):
 *   FRAMEWORK_REPO      기본 https://github.com/yheun03/framework.git
 *   FRAMEWORK_BRANCH    기본 main
 *   TEAM_BRANCH         기본 master
 *   KEEP_NODE_MODULES=1 clean 시 node_modules 유지
 *
 * 주의: 이 스크립트는 framework(GitHub)에 커밋·푸시된 뒤 sync해야
 *       매주 동기화 후에도 유지됩니다.
 */

import { execSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const FRAMEWORK_REPO =
  process.env.FRAMEWORK_REPO || 'https://github.com/yheun03/framework.git';
const FRAMEWORK_BRANCH = process.env.FRAMEWORK_BRANCH || 'main';
const TEAM_BRANCH = process.env.TEAM_BRANCH || 'master';
const KEEP_NODE_MODULES = process.env.KEEP_NODE_MODULES === '1';
const isInit = process.argv.includes('--init');

function run(cmd, { cwd, silent = false } = {}) {
  return execSync(cmd, {
    cwd,
    encoding: 'utf8',
    stdio: silent ? ['pipe', 'pipe', 'inherit'] : 'inherit',
  });
}

function runQuiet(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch {
    return null;
  }
}

function tryRun(cmd, cwd) {
  try {
    execSync(cmd, { cwd, stdio: 'pipe' });
  } catch {
    /* optional */
  }
}

function ensureFrameworkRemote(repoRoot) {
  const url = runQuiet('git remote get-url framework', repoRoot);
  if (url === FRAMEWORK_REPO) return;
  if (url) {
    run(`git remote set-url framework "${FRAMEWORK_REPO}"`, { cwd: repoRoot });
  } else {
    run(`git remote add framework "${FRAMEWORK_REPO}"`, { cwd: repoRoot });
  }
}

function removeAllExceptNodeModules(repoRoot) {
  for (const entry of readdirSync(repoRoot)) {
    if (entry === 'node_modules' && KEEP_NODE_MODULES) continue;
    rmSync(join(repoRoot, entry), { recursive: true, force: true });
  }
}

function cleanUntracked(repoRoot) {
  const exclude = KEEP_NODE_MODULES ? '-e node_modules' : '';
  run(`git clean -fdx ${exclude}`.trim(), { cwd: repoRoot });
}

function clearBranchUpstream(repoRoot) {
  tryRun(`git config --unset branch.${TEAM_BRANCH}.remote`, repoRoot);
  tryRun(`git config --unset branch.${TEAM_BRANCH}.merge`, repoRoot);
}

function alignTeamBranch(repoRoot) {
  const ref = `framework/${FRAMEWORK_BRANCH}`;
  if (!runQuiet(`git rev-parse ${ref}`, repoRoot)) {
    console.error(`${ref} 브랜치를 찾을 수 없습니다.`);
    process.exit(1);
  }

  const hasBranch = runQuiet(`git show-ref --verify refs/heads/${TEAM_BRANCH}`, repoRoot);
  if (hasBranch) {
    run(`git checkout ${TEAM_BRANCH}`, { cwd: repoRoot });
  } else {
    run(`git checkout -b ${TEAM_BRANCH} ${ref}`, { cwd: repoRoot });
  }

  run(`git reset --hard ${ref}`, { cwd: repoRoot });
  clearBranchUpstream(repoRoot);
  cleanUntracked(repoRoot);
}

function printSummary(repoRoot) {
  const count = runQuiet('git rev-list --count HEAD', repoRoot);
  const latest = runQuiet('git log -1 --oneline', repoRoot);
  console.log('\n--- 동기화 완료 ---');
  console.log(`저장소: ${repoRoot}`);
  console.log(`브랜치: ${TEAM_BRANCH} ← framework/${FRAMEWORK_BRANCH}`);
  console.log(`커밋 수: ${count ?? '?'}`);
  console.log(`최신: ${latest ?? '(없음)'}`);
  console.log(`팀 origin: ${runQuiet('git remote get-url origin', repoRoot)}`);
  console.log('\n팀 서버 반영: git push -u origin master --force');
}

const repoRoot = runQuiet('git rev-parse --show-toplevel');
if (!repoRoot) {
  console.error('git 저장소 안에서 실행해 주세요.');
  process.exit(1);
}

const teamOrigin = runQuiet('git remote get-url origin', repoRoot);
if (!teamOrigin) {
  console.error('origin remote(팀 Git URL)이 없습니다.');
  process.exit(1);
}

console.log(`[sync-team] ${isInit ? '초기 이관' : '주간 동기화'}`);
console.log(`  repo     : ${repoRoot}`);
console.log(`  origin   : ${teamOrigin}`);
console.log(`  framework: ${FRAMEWORK_REPO} (${FRAMEWORK_BRANCH})`);

if (isInit) {
  const tempRoot = mkdtempSync(join(tmpdir(), 'framework-sync-'));
  const cloneDir = join(tempRoot, 'framework');

  try {
    run(`git clone "${FRAMEWORK_REPO}" "${cloneDir}"`);
    removeAllExceptNodeModules(repoRoot);
    rmSync(join(repoRoot, '.git'), { recursive: true, force: true });
    cpSync(join(cloneDir, '.git'), join(repoRoot, '.git'), { recursive: true });

    run(`git remote set-url origin "${teamOrigin}"`, { cwd: repoRoot });
    ensureFrameworkRemote(repoRoot);
    alignTeamBranch(repoRoot);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
} else {
  ensureFrameworkRemote(repoRoot);
  run('git fetch framework --tags', { cwd: repoRoot });
  alignTeamBranch(repoRoot);

  const currentOrigin = runQuiet('git remote get-url origin', repoRoot);
  if (currentOrigin !== teamOrigin) {
    run(`git remote set-url origin "${teamOrigin}"`, { cwd: repoRoot });
  }
}

printSummary(repoRoot);
