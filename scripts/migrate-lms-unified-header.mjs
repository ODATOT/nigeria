import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const docsRoot = path.join(repoRoot, "docs/NA/LMS2/docs");
const writeChanges = process.argv.includes("--write");

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

const changed = [];
const skipped = [];
for (const file of await collectHtml(docsRoot)) {
  const relative = path.relative(docsRoot, file);
  if (excluded(relative)) {
    skipped.push(relative);
    continue;
  }

  const html = await readFile(file, "utf8");
  if (html.includes("shared/lms-header.js") || html.includes("../shared/lms-header.js")) continue;
  if (!html.includes("</head>")) throw new Error(`Missing </head>: ${relative}`);

  let scriptPath = path.relative(path.dirname(file), path.join(docsRoot, "shared/lms-header.js"));
  scriptPath = scriptPath.split(path.sep).join("/");
  if (!scriptPath.startsWith(".")) scriptPath = "./" + scriptPath;
  const script = `  <script src="${scriptPath}?v=20261118-unified"></script>\n`;
  const next = html.replace("</head>", script + "</head>");
  changed.push(relative);
  if (writeChanges) await writeFile(file, next, "utf8");
}

console.log(`${writeChanges ? "Updated" : "Would update"}: ${changed.length}`);
for (const file of changed) console.log(file);
console.log(`Excluded: ${skipped.length}`);
