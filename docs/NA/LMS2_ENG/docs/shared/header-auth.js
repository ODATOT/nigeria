(function initLms2HeaderAuth() {
  "use strict";

  var slot = document.getElementById("nav-user-item");
  var profile = document.querySelector(".topbar .profile");
  if (!slot && !profile) return;

  function readCookie(name) {
    var prefix = name + "=";
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var index = 0; index < parts.length; index += 1) {
      var part = parts[index].trim();
      if (part.indexOf(prefix) === 0) {
        try {
          return decodeURIComponent(part.slice(prefix.length));
        } catch (error) {
          return part.slice(prefix.length);
        }
      }
    }
    return null;
  }

  function readCurrentUser() {
    var storedUser = readCookie("currentUser");
    if (storedUser) return storedUser;

    var sessionString = localStorage.getItem("currentUserSession");
    if (!sessionString) return null;

    try {
      var session = JSON.parse(sessionString);
      if (Number(session.expiresAt || 0) <= Date.now()) {
        localStorage.removeItem("currentUserSession");
        return null;
      }
      return session.value || null;
    } catch (error) {
      localStorage.removeItem("currentUserSession");
      return null;
    }
  }

  function clearCurrentUser() {
    document.cookie = "currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
    localStorage.removeItem("currentUserSession");
    localStorage.removeItem("currentUser");
  }

  function logout() {
    if (!window.confirm("Do you want to log out?")) return;
    clearCurrentUser();
    window.location.replace("login/login.html");
  }

  function makeProfileAction(action, label) {
    profile.setAttribute("role", "button");
    profile.setAttribute("tabindex", "0");
    profile.setAttribute("aria-label", label);
    profile.title = label;
    profile.style.cursor = "pointer";
    profile.addEventListener("click", action);
    profile.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        action();
      }
    });
  }

  var userValue = readCurrentUser();
  if (!userValue) {
    if (profile) {
      var emptyName = profile.querySelector("#profileName");
      var emptyId = profile.querySelector("#profileId");
      if (emptyName) emptyName.textContent = "Log in";
      if (emptyId) emptyId.textContent = "Choose participant";
      makeProfileAction(function () {
        window.location.href = "login/login.html";
      }, "Participant Login");
    }
    return;
  }

  try {
    var user = typeof userValue === "string" ? JSON.parse(userValue) : userValue;
    if (profile) {
      var profileName = profile.querySelector("#profileName");
      var profileId = profile.querySelector("#profileId");
      var profileAvatar = profile.querySelector("#profileAvatar");
      if (profileName) profileName.textContent = user.name || "Student";
      if (profileId) profileId.textContent = user.studentId || user.id || "ACE AI SW";
      if (profileAvatar) profileAvatar.textContent = user.avatar || "👤";
      makeProfileAction(logout, (user.name || "Student") + " — log out of account");
      return;
    }

    var button = document.createElement("button");
    button.type = "button";
    button.title = "Click to log out";
    button.setAttribute("aria-label", (user.name || "Student") + " — log out of account");
    button.style.cssText = "display:flex;align-items:center;gap:8px;background:rgba(43,92,166,0.11);border:1px solid rgba(43,92,166,0.2);border-radius:50px;padding:6px 14px;font:inherit;font-size:.9rem;font-weight:700;color:#2B5CA6;cursor:pointer";

    var avatar = document.createElement("span");
    avatar.textContent = user.avatar || "👤";
    avatar.setAttribute("aria-hidden", "true");

    var name = document.createElement("span");
    name.textContent = user.name || "Student";

    var label = document.createElement("span");
    label.textContent = "Log out";
    label.style.cssText = "font-size:.72rem;opacity:.75";

    button.append(avatar, name, label);
    button.addEventListener("click", logout);
    slot.replaceChildren(button);
  } catch (error) {
    localStorage.removeItem("currentUserSession");
  }
})();
