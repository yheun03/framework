/**
 * Props 패널(PageDemoPropsSummary.vue)과 실제 컴포넌트 props 가 맞는지 확인합니다. (npm run check 에 포함)
 *
 * - 컴포넌트에 있는데 패널에 없는 prop → 실패 (새 prop 을 만들면 패널에도 적어야 합니다)
 * - 패널에 있는데 컴포넌트에 없는 prop → 실패 (이름이 바뀌었거나 삭제된 prop)
 *
 * 패널 이름 규칙
 * - 데모의 대표 컴포넌트는 prop 이름만: 'size', 'v-model'(= modelValue), 'v-model:open'(= open)
 * - 다른 컴포넌트는 'AppIconButton.size' 처럼 앞에 컴포넌트 이름
 * - 여러 개는 ' · ' 로 묶기: 'id · name · autocomplete'
 * - '#slot', '@event', 'useX()' 처럼 prop 이 아닌 항목은 검사하지 않습니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = path.join(root, 'src/components');

// 데모 화면 → 대표 컴포넌트 (이름 규칙 demo-{kebab} → App{Pascal} 과 다른 것만)
const MAIN_COMPONENT = {
    'demo-datepicker': 'AppDatePicker',
    'demo-progress': 'AppProgress',
};
// 앞에 컴포넌트 이름이 없는 항목을 여러 컴포넌트의 공통 prop 으로 보는 데모 (패널의 '위 컴포넌트 공통')
const SHARED_COMPONENTS = {
    'demo-button': ['AppButton', 'AppTextButton', 'AppIconButton'],
    'demo-progress': ['AppProgress', 'AppProgressBar', 'AppProgressSlider', 'AppProgressGauge'],
};
// prop 패널이 없거나 컴포넌트가 아닌 데모
const SKIP_DEMOS = new Set(['demo-design-tokens', 'demo-modal', 'demo-toast']);

function findComponentFiles(dir, result = {}) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) findComponentFiles(full, result);
        else if (entry.name.endsWith('.vue')) result[entry.name.replace('.vue', '')] = full;
    }
    return result;
}

function readProps(file) {
    const source = fs.readFileSync(file, 'utf8');
    const start = source.indexOf('defineProps({');
    if (start < 0) return [];
    let depth = 0;
    let end = start + 'defineProps('.length;
    for (; end < source.length; end += 1) {
        if (source[end] === '{') depth += 1;
        if (source[end] === '}') depth -= 1;
        if (depth === 0) break;
    }
    const body = source.slice(start, end);
    return [...body.matchAll(/^ {4}(\w+):/gm)].map((match) => match[1]);
}

function readSummaries() {
    const file = path.join(componentsDir, 'PageDemo/content/PageDemoPropsSummary.vue');
    const source = fs.readFileSync(file, 'utf8');
    const start = source.indexOf('const sizes');
    const end = source.indexOf('\n};', source.indexOf('const summaries')) + 3;
    const code = source.slice(start, end).replace(/^const /gm, 'var ');
    return new Function(`${code}; return summaries;`)();
}

const toPascal = (demo) =>
    'App' +
    demo
        .replace(/^demo-/, '')
        .split('-')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('');

function parseDocName(name, mainComponent) {
    let component = mainComponent;
    let rest = name.trim();
    const prefixed = rest.match(/^(App\w+)[. ](.+)$/);
    if (prefixed) {
        component = prefixed[1];
        rest = prefixed[2].trim();
    }
    const shared = !prefixed;
    if (/^[#@]|\(|^\.|^\$|^--/.test(rest)) return [];
    return rest
        .split(/\s*[·/]\s*/)
        .map((part) => part.trim())
        .map((part) => (part === 'v-model' ? 'modelValue' : part.replace(/^v-model:/, '')))
        .filter((part) => /^[a-zA-Z]\w*$/.test(part))
        .map((prop) => ({ component, prop, shared }));
}

const files = findComponentFiles(componentsDir);
const summaries = readSummaries();
const errors = [];

for (const [demo, summary] of Object.entries(summaries)) {
    if (SKIP_DEMOS.has(demo)) continue;
    const mainComponent = MAIN_COMPONENT[demo] ?? toPascal(demo);
    const documented = new Map();
    const sharedProps = new Set();

    for (const item of summary.props) {
        // attr: true → 컴포넌트 prop 이 아니라 안쪽 라이브러리로 넘기는 속성 (예: AG Grid 의 rowData)
        if (item.attr) continue;
        for (const { component, prop, shared } of parseDocName(item.name, mainComponent)) {
            const isShared = shared && Boolean(SHARED_COMPONENTS[demo]);
            if (isShared) sharedProps.add(prop);
            const targets = isShared ? SHARED_COMPONENTS[demo] : [component];
            for (const target of targets) {
                if (!documented.has(target)) documented.set(target, new Set());
                documented.get(target).add(prop);
            }
        }
    }
    if (!documented.has(mainComponent)) documented.set(mainComponent, new Set());

    for (const [component, docProps] of documented) {
        if (!files[component]) {
            errors.push(`${demo}: 패널의 '${component}' 컴포넌트 파일이 없습니다.`);
            continue;
        }
        const actual = readProps(files[component]);
        const undocumented = actual.filter((prop) => !docProps.has(prop));
        // 공통 항목은 묶인 컴포넌트 중 하나에만 있어도 됩니다.
        const unknown = [...docProps].filter((prop) => !actual.includes(prop) && !sharedProps.has(prop));
        if (undocumented.length) errors.push(`${demo}: ${component} 의 prop 이 패널에 없습니다 → ${undocumented.join(', ')}`);
        if (unknown.length) errors.push(`${demo}: 패널의 ${component} prop 이 컴포넌트에 없습니다 → ${unknown.join(', ')}`);
    }
}

// 공통 항목이 묶인 컴포넌트 어디에도 없으면 실패
for (const [demo, components] of Object.entries(SHARED_COMPONENTS)) {
    const summary = summaries[demo];
    if (!summary) continue;
    const all = new Set(components.flatMap((component) => (files[component] ? readProps(files[component]) : [])));
    const mainComponent = MAIN_COMPONENT[demo] ?? toPascal(demo);
    for (const item of summary.props) {
        if (item.attr) continue;
        for (const { prop, shared } of parseDocName(item.name, mainComponent)) {
            if (shared && !all.has(prop)) errors.push(`${demo}: 공통 항목 '${prop}' 이 ${components.join(' · ')} 어디에도 없습니다.`);
        }
    }
}

if (errors.length) {
    console.error(errors.map((message) => `✗ ${message}`).join('\n'));
    console.error(`\nsrc/components/PageDemo/content/PageDemoPropsSummary.vue 를 실제 props 에 맞게 고치세요. (${errors.length}건)`);
    process.exit(1);
}

console.log(`✓ Props 패널 = 실제 props (${Object.keys(summaries).length - SKIP_DEMOS.size}개 데모)`);
