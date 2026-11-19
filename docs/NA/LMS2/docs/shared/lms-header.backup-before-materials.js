(function bootstrapUnifiedLmsHeader() {
  "use strict";

  var sourceScript = document.currentScript;
  if (!sourceScript || !sourceScript.src) return;

  var sharedBase = new URL("./", sourceScript.src);
  var docsBase = new URL("../", sharedBase);
  document.documentElement.classList.add("lms-unified-header-booting");

  if (!document.querySelector('link[data-lms-header-style]')) {
    var styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = new URL("lms-header.css?v=20261119-naija", sharedBase).href;
    styleLink.dataset.lmsHeaderStyle = "true";
    document.head.appendChild(styleLink);
  }

  function docsUrl(path) {
    return new URL(path, docsBase).href;
  }

  function svg(paths) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + paths + "</svg>";
  }

  var icons = {
    notice: svg('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>'),
    attendance: svg('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16M9 14l2 2 4-4"/>'),
    resources: svg('<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>'),
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>')
  };

  var mainLinks = [
    { key: "project", label: "10일 프로젝트", href: "index.html#roadmap" },
    { key: "self", label: "개인 자율학습", href: "index.html#projects" },
    { key: "challenge", label: "과제·케이스 스터디", href: "index.html#challenges" }
  ];
  var utilityLinks = [
    { key: "notice", label: "공지사항", href: "notice.html", icon: icons.notice },
    { key: "attendance", label: "출석", href: "attendance_qr.html", icon: icons.attendance },
    { key: "resources", label: "설문 및 자료", href: "qr_resources.html", icon: icons.resources }
  ];

  function currentSection() {
    var path = window.location.pathname.toLowerCase();
    if (/\/notice\.html$/.test(path)) return "notice";
    if (/\/attendance_qr\.html$/.test(path)) return "attendance";
    if (/\/(qr_resources|survey|upload)\.html$/.test(path)) return "resources";
    if (/\/homework_|\/certificate/.test(path)) return "challenge";
    if (/\/day\d+\//.test(path)) return "self";
    if (/\/ai-project-|\/project_day\//.test(path) || /\/real-/.test(path)) return "project";
    return "";
  }

  function linkMarkup(item, iconOnly) {
    var active = currentSection() === item.key ? ' aria-current="page"' : "";
    if (iconOnly) {
      return '<a class="lms-header-icon-link" href="' + docsUrl(item.href) + '" title="' + item.label + '" aria-label="' + item.label + '"' + active + ">" + item.icon + "</a>";
    }
    return '<a class="lms-header-link" href="' + docsUrl(item.href) + '"' + active + ">" + item.label + "</a>";
  }

  function readCookie(name) {
    var prefix = name + "=";
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var index = 0; index < parts.length; index += 1) {
      var part = parts[index].trim();
      if (part.indexOf(prefix) !== 0) continue;
      try {
        return decodeURIComponent(part.slice(prefix.length));
      } catch (error) {
        return part.slice(prefix.length);
      }
    }
    return null;
  }

  function readUser() {
    var rawUser = readCookie("currentUser");
    if (!rawUser) {
      var rawSession = localStorage.getItem("currentUserSession");
      if (rawSession) {
        try {
          var session = JSON.parse(rawSession);
          if (Number(session.expiresAt || 0) > Date.now()) rawUser = session.value;
          else localStorage.removeItem("currentUserSession");
        } catch (error) {
          localStorage.removeItem("currentUserSession");
        }
      }
    }
    if (!rawUser) return null;
    try {
      return typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
    } catch (error) {
      return null;
    }
  }

  function clearUser() {
    document.cookie = "currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
    localStorage.removeItem("currentUserSession");
    localStorage.removeItem("currentUser");
  }

  function hideLegacyHeaders() {
    var selectors = [
      "body > header.topbar",
      "body > header.navbar",
      "body > nav.navbar",
      "body > nav.mobile-nav"
    ];
    document.querySelectorAll(selectors.join(",")).forEach(function (element) {
      element.setAttribute("aria-hidden", "true");
      element.style.setProperty("display", "none", "important");
    });
  }

  function renderHeader() {
    if (!document.body || document.querySelector(".lms-unified-header")) return;
    hideLegacyHeaders();

    var header = document.createElement("header");
    header.className = "lms-unified-header";
    header.innerHTML =
      '<div class="lms-header-shell">' +
        '<a class="lms-header-brand" href="' + docsUrl("index.html") + '" aria-label="학생 학습 홈">' +
          '<span class="lms-header-brand-mark" aria-hidden="true">A</span>' +
          '<span class="lms-header-brand-text">ACE AI SW</span>' +
        "</a>" +
        '<nav class="lms-header-main-nav" aria-label="주요 학습 메뉴">' + mainLinks.map(function (item) { return linkMarkup(item, false); }).join("") + "</nav>" +
        '<nav class="lms-header-utility-nav" aria-label="교육 지원 메뉴">' + utilityLinks.map(function (item) { return linkMarkup(item, true); }).join("") + "</nav>" +
        '<button class="lms-header-account" type="button">' +
          '<span class="lms-header-account-avatar" aria-hidden="true">' + icons.user + "</span>" +
          '<span class="lms-header-account-copy"><strong class="lms-header-account-name">로그인</strong><span class="lms-header-account-id">참가자 선택</span></span>' +
        "</button>" +
        '<button class="lms-header-menu-button" type="button" aria-label="전체 메뉴 열기" aria-expanded="false">' + icons.menu + "</button>" +
        '<nav class="lms-header-mobile-panel" aria-label="모바일 전체 메뉴" data-open="false">' +
          mainLinks.concat(utilityLinks).map(function (item) { return linkMarkup(item, false); }).join("") +
        "</nav>" +
      "</div>";

    document.body.insertBefore(header, document.body.firstChild);

    var account = header.querySelector(".lms-header-account");
    var accountAvatar = header.querySelector(".lms-header-account-avatar");
    var accountName = header.querySelector(".lms-header-account-name");
    var accountId = header.querySelector(".lms-header-account-id");
    var user = readUser();

    if (user) {
      accountName.textContent = user.name || "수강생";
      accountId.textContent = user.studentId || user.id || "ACE AI SW";
      accountAvatar.textContent = user.avatar || String(user.name || "U").trim().charAt(0).toUpperCase();
      account.title = "클릭하여 로그아웃";
      account.setAttribute("aria-label", (user.name || "수강생") + " 계정 로그아웃");
    } else {
      account.title = "로그인";
      account.setAttribute("aria-label", "로그인 페이지로 이동");
    }

    account.addEventListener("click", function () {
      if (!user) {
        window.location.href = docsUrl("login/login.html");
        return;
      }
      if (!window.confirm("로그아웃 하시겠습니까?")) return;
      clearUser();
      window.location.replace(docsUrl("login/login.html"));
    });

    var menuButton = header.querySelector(".lms-header-menu-button");
    var mobilePanel = header.querySelector(".lms-header-mobile-panel");
    function setMenu(open) {
      mobilePanel.dataset.open = open ? "true" : "false";
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
      menuButton.setAttribute("aria-label", open ? "전체 메뉴 닫기" : "전체 메뉴 열기");
    }
    menuButton.addEventListener("click", function () {
      setMenu(mobilePanel.dataset.open !== "true");
    });
    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    document.documentElement.classList.remove("lms-unified-header-booting");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderHeader, { once: true });
  else renderHeader();
})();
