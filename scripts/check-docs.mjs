/**
 * 문서 예제와 실제 코드가 같은지 확인합니다. (npm run check 에 포함)
 *
 * - COMPONENT_GUIDE.md 4장 예제 코드 = src/views/demos/demo-page-example.vue
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');

const errors = [];

const guide = read('COMPONENT_GUIDE.md');
const section = guide.indexOf('## 4. 작성 패턴');
const start = guide.indexOf('```vue\n', section);
const end = guide.indexOf('```', start + 7);
const example = start >= 0 && end > start ? guide.slice(start + 7, end) : null;

if (!example) {
    errors.push('COMPONENT_GUIDE.md 4장에서 ```vue 예제 블록을 찾지 못했습니다.');
} else if (example !== read('src/views/demos/demo-page-example.vue')) {
    errors.push('COMPONENT_GUIDE.md 4장 예제와 src/views/demos/demo-page-example.vue 가 다릅니다. 파일 내용을 문서에 그대로 복사하세요.');
}

if (errors.length) {
    console.error(errors.map((message) => `✗ ${message}`).join('\n'));
    process.exit(1);
}

console.log('✓ 문서 예제 = 실제 코드');
