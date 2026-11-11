/**
 * GitHub Pages 새로고침 대응: dist/index.html 을 dist/404.html 로 복사합니다.
 * (cp 명령은 Windows 기본 터미널에서 동작하지 않아 node 로 처리)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
console.log('· dist/404.html 생성');
