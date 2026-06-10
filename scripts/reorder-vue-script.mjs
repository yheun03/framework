/**
 * Vue 파일에서 <script setup>을 <template> 앞으로 안전하게 이동합니다.
 * usage: node scripts/reorder-vue-script.mjs [path...]
 */
import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["pages", "layouts", "components", "app.vue", "error.vue"];

function collectVueFiles(target) {
  const abs = path.resolve(target);
  if (!fs.existsSync(abs)) return [];

  const stat = fs.statSync(abs);
  if (stat.isFile() && abs.endsWith(".vue")) return [abs];

  const files = [];
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const next = path.join(abs, entry.name);
    if (entry.isDirectory()) files.push(...collectVueFiles(next));
    else if (entry.name.endsWith(".vue")) files.push(next);
  }
  return files;
}

function reorderVueContent(content) {
  const scriptRe = /<script\s+setup\s+lang="ts">[\s\S]*?<\/script>/;
  const templateRe = /<template>[\s\S]*?<\/template>/;

  const scriptMatch = content.match(scriptRe);
  const templateMatch = content.match(templateRe);

  if (!scriptMatch || !templateMatch) return null;
  if (scriptMatch.index < templateMatch.index) return null;

  const scriptBlock = scriptMatch[0].trimEnd();
  const templateBlock = templateMatch[0].trimEnd();
  const afterTemplate = content.slice(templateMatch.index + templateMatch[0].length);
  const tail = afterTemplate.replace(scriptRe, "").trim();

  const parts = [scriptBlock, "", templateBlock];
  if (tail) parts.push("", tail);
  return `${parts.join("\n")}\n`.replace(/\n{3,}/g, "\n\n");
}

const files = roots.flatMap((root) => collectVueFiles(root));
let changed = 0;

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const next = reorderVueContent(original);
  if (next && next !== original) {
    fs.writeFileSync(file, next);
    changed += 1;
    console.log(`reordered: ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`done: ${changed} file(s) updated`);
