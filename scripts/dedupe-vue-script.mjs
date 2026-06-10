/**
 * Vue 파일의 중복 <script setup> 블록을 제거합니다. (첫 번째만 유지)
 */
import fs from "node:fs";
import path from "node:path";

function collectVueFiles(dir) {
  const abs = path.resolve(dir);
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

function dedupeScriptBlocks(content) {
  const marker = '<script setup lang="ts">';
  const first = content.indexOf(marker);
  if (first === -1) return null;

  const second = content.indexOf(marker, first + marker.length);
  if (second === -1) return null;

  const endTag = "</script>";
  const secondEnd = content.indexOf(endTag, second);
  if (secondEnd === -1) return null;

  let next = content.slice(0, second) + content.slice(secondEnd + endTag.length);
  next = next.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
  return next;
}

const roots = ["pages", "layouts", "components", "app.vue", "error.vue"];
const files = roots.flatMap((root) => collectVueFiles(root));
let changed = 0;

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const next = dedupeScriptBlocks(original);
  if (next && next !== original) {
    fs.writeFileSync(file, next);
    changed += 1;
    console.log(`deduped: ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`done: ${changed} file(s) fixed`);
