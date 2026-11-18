import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "..");
const docsRoot = path.join(repoRoot, "docs/NA/LMS2/docs");

function excluded(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  return normalized.includes("backup") ||
    normalized === "index_old.html" ||
    normalized === "login/login.html" ||
    normalized.startsWith("shared/") ||
    normalized.startsWith("real-doc-driven-pbl/service-implementation/");
}

async function collectHtml(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await collectHtml(target));
    else if (entry.isFile() && entry.name.endsWith(".html")) output.push(target);
  }
  return output;
}

test("every active LMS page loads the unified header component", async () => {
  const files = (await collectHtml(docsRoot)).filter((file) => !excluded(path.relative(docsRoot, file)));
  assert.ok(files.length >= 120, `expected the active LMS surface, found ${files.length} pages`);
  for (const file of files) {
    const html = await readFile(file, "utf8");
    assert.match(html, /(?:\.\.\/)*shared\/lms-header\.js\?v=20261118-unified/, path.relative(docsRoot, file));
  }
});

test("the component owns navigation, responsive menu, and account state", async () => {
  const script = await readFile(path.join(docsRoot, "shared/lms-header.js"), "utf8");
  assert.match(script, /10일 프로젝트/);
  assert.match(script, /개인 자율학습/);
  assert.match(script, /과제·케이스 스터디/);
  assert.match(script, /공지사항/);
  assert.match(script, /attendance_qr\.html/);
  assert.match(script, /qr_resources\.html/);
  assert.match(script, /currentUserSession/);
  assert.match(script, /로그아웃 하시겠습니까/);
  assert.match(script, /aria-expanded/);
});
