/**
 * 새 기업 프로젝트 시작 스크립트
 *
 *   npm run init-project -- <key> "<회사명>" "<서비스명>"
 *   예) npm run init-project -- acme "ACME" "ACME MES"
 *
 * 하는 일
 * 1. 기업 전용 폴더 3곳을 현재 key 폴더에서 복사합니다.
 *    - src/assets/styles/projects/{key}
 *    - src/components/projects/{key}
 *    - public/images/projects/{key}
 * 2. src/project.config.js 의 key · companyName · serviceName 을 바꾸고, 데모용 showSourceViewer 를 끕니다.
 * 3. .env* 의 VITE_TITLE 을 서비스명으로 바꿉니다.
 * 4. Docker 이미지 · 컨테이너 이름을 key 로 바꿉니다. (docker-compose-dev/prd.yml · package.json docker:build)
 *    docker.jonsoft.co.kr/{key}/client:latest|release · {key}-client
 *
 * 기존 폴더는 지우지 않습니다. 확인 후 필요 없으면 직접 정리하세요.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [key, companyName, serviceName] = process.argv.slice(2);

if (!key || !/^[a-z][a-z0-9-]*$/.test(key)) {
    console.error('사용법: npm run init-project -- <key> "<회사명>" "<서비스명>"');
    console.error('key 는 영문 소문자로 시작하고 영문 소문자 · 숫자 · - 만 씁니다. (예: acme, sp-samhwa)');
    process.exit(1);
}

const configPath = path.join(root, 'src/project.config.js');
let config = fs.readFileSync(configPath, 'utf8');
const currentKey = config.match(/key:\s*'([^']+)'/)?.[1];

if (!currentKey) {
    console.error('src/project.config.js 에서 key 를 찾지 못했습니다.');
    process.exit(1);
}

const folders = ['src/assets/styles/projects', 'src/components/projects', 'public/images/projects'];

for (const folder of folders) {
    const from = path.join(root, folder, currentKey);
    const to = path.join(root, folder, key);
    if (fs.existsSync(to)) {
        console.log(`· 이미 있음: ${folder}/${key}`);
        continue;
    }
    if (!fs.existsSync(from)) {
        fs.mkdirSync(to, { recursive: true });
        fs.writeFileSync(path.join(to, '.gitkeep'), '');
        console.log(`· 새로 만듦: ${folder}/${key}`);
        continue;
    }
    fs.cpSync(from, to, { recursive: true });
    console.log(`· 복사함: ${folder}/${currentKey} → ${folder}/${key}`);
}

config = config.replace(/key:\s*'[^']+'/, `key: '${key}'`);
// 실제 프로젝트에서는 화면 소스 보기 버튼을 끕니다.
config = config.replace(/showSourceViewer:\s*true/, 'showSourceViewer: false');
if (companyName) config = config.replace(/companyName:\s*'[^']*'/, `companyName: '${companyName}'`);
if (serviceName) config = config.replace(/const serviceName = '[^']*';/, `const serviceName = '${serviceName}';`);
fs.writeFileSync(configPath, config);
console.log('· 수정함: src/project.config.js');

if (serviceName) {
    for (const file of ['.env', '.env.dev', '.env.prd', '.env.pub']) {
        const envPath = path.join(root, file);
        if (!fs.existsSync(envPath)) continue;
        const env = fs.readFileSync(envPath, 'utf8');
        const suffix = env.match(/VITE_TITLE=.*?(\s\((?:dev|pub)\))?$/m)?.[1] ?? '';
        fs.writeFileSync(envPath, env.replace(/VITE_TITLE=.*$/m, `VITE_TITLE=${serviceName}${suffix}`));
    }
    console.log('· 수정함: .env · .env.dev · .env.prd · .env.pub (VITE_TITLE)');
}

// Docker 이미지 · 컨테이너 이름 (실무 예: docker.jonsoft.co.kr/orc-mes/client · orchem-client 처럼 다르면 직접 수정)
const dockerFiles = ['docker-compose-dev.yml', 'docker-compose-prd.yml', 'package.json'];
for (const file of dockerFiles) {
    const filePath = path.join(root, file);
    if (!fs.existsSync(filePath)) continue;
    const before = fs.readFileSync(filePath, 'utf8');
    const after = before
        .replace(/docker\.jonsoft\.co\.kr\/[a-z0-9-]+\/client/g, `docker.jonsoft.co.kr/${key}/client`)
        .replace(/container_name:\s*[a-z0-9-]+-client/g, `container_name: ${key}-client`);
    if (after !== before) fs.writeFileSync(filePath, after);
}
console.log(
    `· 수정함: docker-compose-dev.yml · docker-compose-prd.yml · package.json (이미지 docker.jonsoft.co.kr/${key}/client, 컨테이너 ${key}-client)`,
);

console.log(`
다음 단계
1. 색상: src/assets/styles/projects/${key}/_theme.scss 의 $primary · $secondary · $tertiary
2. 이미지: public/images/projects/${key}/favicon.svg 교체
3. 설명: src/project.config.js 의 description (index.html 에 자동 반영)
4. nginx.conf 의 백엔드 주소(server:8080) 가 다르면 수정
5. npm run serve 로 확인`);
