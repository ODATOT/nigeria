import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homePath = new URL("../docs/NA/LMS2/docs/index.html", import.meta.url);
const html = await readFile(homePath, "utf8");

test("the LMS2 header exposes an accessible account action", () => {
  assert.match(
    html,
    /<button[^>]+id="profileButton"[^>]+type="button"[^>]*>/,
    "the participant profile must remain an actionable button"
  );
  assert.match(html, /id="profileButton"[^>]+aria-label=/);
});

test("logging out clears every persisted session and opens the login page", () => {
  assert.ok(html.includes('localStorage.removeItem("currentUserSession")'));
  assert.ok(html.includes('localStorage.removeItem("currentUser")'));
  assert.ok(html.includes('document.cookie = "currentUser='));
  assert.ok(html.includes('window.location.replace("login/login.html")'));
});
