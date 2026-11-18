import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const docsUrl = new URL("../docs/NA/LMS2/docs/", import.meta.url);
const sharedHeaderAuthPages = [
  "attendance_qr.html",
  "qr_resources.html",
  "survey.html",
];
const projectDayPages = Array.from(
  { length: 10 },
  (_, index) => `ai-project-day${index + 1}.html`
);

for (const page of sharedHeaderAuthPages) {
  test(`${page} loads the shared header logout behavior`, async () => {
    const html = await readFile(new URL(page, docsUrl), "utf8");
    assert.match(html, /id="nav-user-item"/);
    assert.match(html, /shared\/header-auth\.js\?v=20261118-logout/);
  });
}

test("shared header logout clears all persisted user state", async () => {
  const script = await readFile(new URL("shared/header-auth.js", docsUrl), "utf8");
  assert.ok(script.includes('localStorage.removeItem("currentUserSession")'));
  assert.ok(script.includes('localStorage.removeItem("currentUser")'));
  assert.ok(script.includes('document.cookie = "currentUser='));
  assert.ok(script.includes('window.location.replace("login/login.html")'));
  assert.match(script, /button\.addEventListener\("click", logout\)/);
});

for (const page of projectDayPages) {
  test(`${page} enables login and logout from the profile header`, async () => {
    const html = await readFile(new URL(page, docsUrl), "utf8");
    assert.match(html, /class="profile"/);
    assert.match(html, /shared\/header-auth\.js\?v=20261118-project-logout/);
  });
}

test("shared auth makes project profiles keyboard-accessible login actions", async () => {
  const script = await readFile(new URL("shared/header-auth.js", docsUrl), "utf8");
  assert.ok(script.includes('document.querySelector(".topbar .profile")'));
  assert.ok(script.includes('profile.setAttribute("role", "button")'));
  assert.ok(script.includes('profile.setAttribute("tabindex", "0")'));
  assert.ok(script.includes('makeProfileAction(logout'));
  assert.ok(script.includes('window.location.href = "login/login.html"'));
});
