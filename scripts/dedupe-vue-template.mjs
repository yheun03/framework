/**
 * Vue 파일에서 script 뒤에 중복된 <template> 블록을 제거합니다.
 */
import fs from 'node:fs';
import path from 'node:path';

function collectVueFiles(dir) {
    const abs = path.resolve(dir);
    if (!fs.existsSync(abs)) return [];
    const stat = fs.statSync(abs);
    if (stat.isFile() && abs.endsWith('.vue')) return [abs];
    const files = [];
    for (const entry of fs.readdirSync(abs, {withFileTypes: true})) {
        const next = path.join(abs, entry.name);
        if (entry.isDirectory()) files.push(...collectVueFiles(next));
        else if (entry.name.endsWith('.vue')) files.push(next);
    }
    return files;
}

function removeDuplicateTemplateAfterScript(content) {
    const scriptEnd = content.indexOf('</script>');
    if (scriptEnd === -1) return null;

    const afterScript = content.slice(scriptEnd + '</script>'.length);
    const duplicateTemplate = afterScript.match(/^\s*<template>[\s\S]*?<\/template>/);
    if (!duplicateTemplate) return null;

    const next = content.slice(0, scriptEnd + '</script>'.length) + afterScript.slice(duplicateTemplate[0].length);

    return next.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

const roots = ['pages', 'layouts', 'components', 'app.vue', 'error.vue'];
const files = roots.flatMap((root) => collectVueFiles(root));
let changed = 0;

for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const next = removeDuplicateTemplateAfterScript(original);
    if (next && next !== original) {
        fs.writeFileSync(file, next);
        changed += 1;
        console.log(`deduped template: ${path.relative(process.cwd(), file)}`);
    }
}

console.log(`done: ${changed} file(s) fixed`);
