(function () {
  "use strict";

  var APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwPNW10w782cWrajXBFC4f7X1vhC_Qf_gLIWWgnCvPoc0khX9WUKkjpt6grzBcqGqbs/exec";
  var SESSION_HOURS = 10;
  var students = [
    { studentId: "AI-TOT-001", name: "Neksummi Hammadu Matthias", team: "Nekslove Web Solutions", avatar: "👨🏽‍💻" },
    { studentId: "AI-TOT-002", name: "Umar Adam Ibrahim", team: "Nile University of Nigeria", avatar: "👨🏽‍💻" },
    { studentId: "AI-TOT-003", name: "IDRIS ADEIZA ALIYU", team: "Drisa Engineering Solutions Limited", avatar: "👨🏽‍💻", photo: "profile-photos/AI-TOT-003.jpg" },
    { studentId: "AI-TOT-004", name: "Blessing Ozioma Iwuchukwu", team: "BiZmarrow Technologies", avatar: "👨🏽‍💻", photo: "profile-photos/AI-TOT-004.jpg" },
    { studentId: "AI-TOT-005", name: "Collins Anietie Nyong", team: "Youth for Change Initiative", avatar: "👨🏽‍💻" },
    { studentId: "AI-TOT-006", name: "Joshua Ityover Mishi", team: "Jobberman Nigeria", avatar: "👨🏽‍💻", photo: "profile-photos/AI-TOT-006.jpg" },
    { studentId: "AI-TOT-007", name: "DUUNEBARI GOSPEL VAREBA", team: "ByteStreams Consulting Ltd", avatar: "👨🏽‍💻", photo: "profile-photos/AI-TOT-007.png" },
    { studentId: "AI-TOT-008", name: "Frank Onyekachi Uchehara", team: "Frankbotics Technologies Limited", avatar: "👨🏽‍💻", photo: "profile-photos/AI-TOT-008.jpg" },
    { studentId: "AI-TOT-009", name: "Oluwaseyi Adetunji Adebayo", team: "Coderina EdTech Foundation", avatar: "👨🏽‍💻", photo: "profile-photos/AI-TOT-009.png" },
    { studentId: "AI-TOT-010", name: "Peter Oluwayomi Kolapo", team: "ECOWAS", avatar: "👨🏽‍💻", photo: "profile-photos/AI-TOT-010.jpg" },
    { studentId: "AI-TOT-011", name: "Archibong Effiong Nsa", team: "AUP Digital Africa", avatar: "👨🏽‍💻" },
    { studentId: "AI-TOT-012", name: "Princess Elo Ahante", team: "HerCraft", avatar: "👩🏽‍💻", photo: "profile-photos/AI-TOT-012.png" },
    { studentId: "AI-TOT-013", name: "Kolawole Allen Akoni", team: "Goreel", avatar: "👨🏽‍💻" },
    { studentId: "AI-TOT-014", name: "Zitamary Chidimma Anumenwe", team: "Foothills Consulting", avatar: "👩🏽‍💻", photo: "profile-photos/AI-TOT-014.jpg" },
    { studentId: "AI-TOT-015", name: "Samira Abdulhamid Lawal", team: "Ummzie Nig Ltd", avatar: "👩🏽‍💻", photo: "profile-photos/AI-TOT-015.jpg" }
  ];
  var isAuthenticating = false;
  var activeRequestController = null;

  var cardsGrid = document.getElementById("cardsGrid");
  var searchBar = document.getElementById("searchBar");
  var authOverlay = document.getElementById("authOverlay");
  var authTitle = document.getElementById("authTitle");
  var authStatus = document.getElementById("authStatus");

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return prefix + "_" + window.crypto.randomUUID();
    }
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
  }

  function getSessionId() {
    var key = "lmsLoginSessionId";
    var sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
      sessionId = makeId("session");
      sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
  }

  function showGridMessage(title, description) {
    cardsGrid.replaceChildren();

    var panel = document.createElement("div");
    panel.style.cssText = "grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-desc);";

    var heading = document.createElement("h4");
    heading.textContent = title;
    panel.appendChild(heading);

    if (description) {
      var copy = document.createElement("p");
      copy.textContent = description;
      copy.style.marginTop = "8px";
      panel.appendChild(copy);
    }

    cardsGrid.appendChild(panel);
  }

  function createProfileCard(student) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "profile-card";
    card.setAttribute("aria-label", student.name + " (" + student.studentId + ") 로그인");
    card.addEventListener("click", function () { startAuth(student); });

    var scanLine = document.createElement("span");
    scanLine.className = "scan-line";

    var teamNum = (student.team || "").replace(/[^0-9]/g, "");
    var teamBadge = document.createElement("span");
    teamBadge.className = "track-badge" + (teamNum ? " team-" + teamNum : " team-none");
    teamBadge.textContent = student.team || "기관 미등록";

    var avatarWrapper = document.createElement("span");
    avatarWrapper.className = "avatar-wrapper";
    var avatar = document.createElement(student.photo ? "img" : "span");
    if (student.photo) {
      avatar.className = "profile-photo";
      avatar.src = student.photo;
      avatar.alt = "";
      avatar.loading = "lazy";
      avatar.decoding = "async";
    } else {
      avatar.textContent = student.avatar;
    }
    avatarWrapper.appendChild(avatar);

    var name = document.createElement("span");
    name.className = "founder-name";
    name.textContent = student.name;

    var studentId = document.createElement("span");
    studentId.className = "student-id-badge startup-name";
    studentId.innerHTML = '<span class="id-label">참가자 ID</span><span class="id-value">' + student.studentId + '</span>';

    var actionHint = document.createElement("span");
    actionHint.className = "login-action-hint email-label";
    actionHint.innerHTML = '로그인하기 <span class="arrow-icon">→</span>';

    card.append(scanLine, teamBadge, avatarWrapper, name, studentId, actionHint);
    return card;
  }

  function renderCards(filterQuery) {
    var query = String(filterQuery || "").trim().toLowerCase();
    var filtered = students.filter(function (student) {
      return student.name.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query) ||
        student.team.toLowerCase().includes(query);
    });

    cardsGrid.replaceChildren();
    if (!filtered.length) {
      showGridMessage("검색 결과가 없습니다.", "이름, 참가자 ID 또는 소속/기관을 다시 확인해 주세요.");
      return;
    }

    filtered.forEach(function (student) {
      cardsGrid.appendChild(createProfileCard(student));
    });
  }

  async function requestLogin(student) {
    activeRequestController = new AbortController();
    var timeoutId = window.setTimeout(function () {
      activeRequestController.abort();
    }, 12000);

    var userAgent = navigator.userAgent || "";
    var deviceType = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent) ? "Mobile/Tablet" : "Desktop";
    var body = new URLSearchParams({
      studentId: student.studentId,
      eventId: makeId("login"),
      sessionId: getSessionId(),
      clientTimestamp: new Date().toISOString(),
      pagePath: window.location.pathname,
      deviceType: deviceType,
      userAgent: userAgent,
      platform: navigator.userAgentData && navigator.userAgentData.platform ? navigator.userAgentData.platform : (navigator.platform || ""),
      language: navigator.language || "",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      screenResolution: window.screen ? window.screen.width + "x" + window.screen.height : "",
      deviceMemory: navigator.deviceMemory == null ? "" : String(navigator.deviceMemory),
      hardwareConcurrency: navigator.hardwareConcurrency == null ? "" : String(navigator.hardwareConcurrency)
    });

    try {
      var response = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: body,
        redirect: "follow",
        signal: activeRequestController.signal
      });
      if (!response.ok) throw new Error("HTTP " + response.status);

      var result = await response.json();
      if (!result.ok) throw new Error(result.error || "로그인 기록에 실패했습니다.");
      return result.student;
    } finally {
      window.clearTimeout(timeoutId);
      activeRequestController = null;
    }
  }

  function saveUserSession(student) {
    var userData = JSON.stringify({
      id: student.studentId,
      studentId: student.studentId,
      name: student.name,
      team: student.team,
      avatar: student.avatar
    });

    var expiresAt = Date.now() + (SESSION_HOURS * 60 * 60 * 1000);
    document.cookie = "currentUser=" + encodeURIComponent(userData) +
      "; expires=" + new Date(expiresAt).toUTCString() + "; path=/; SameSite=Lax";
    localStorage.setItem("currentUserSession", JSON.stringify({
      value: userData,
      expiresAt: expiresAt
    }));
  }

  async function startAuth(student) {
    if (isAuthenticating) return;
    isAuthenticating = true;
    authOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    authTitle.textContent = "로그인 기록 중...";
    authStatus.textContent = student.name + " · " + student.studentId;

    try {
      var verifiedStudent = await requestLogin(student);

      var sessionStudent = {
        studentId: String((verifiedStudent && verifiedStudent.studentId) || student.studentId),
        name: String((verifiedStudent && verifiedStudent.name) || student.name),
        team: String((verifiedStudent && verifiedStudent.team) || student.team || ""),
        avatar: student.avatar
      };
      saveUserSession(sessionStudent);

      authTitle.textContent = "로그인되었습니다.";
      authStatus.textContent = sessionStudent.name + "님, 환영합니다.";
      window.setTimeout(function () {
        window.location.href = "../index.html";
      }, 700);
    } catch (error) {
      if (error.name === "AbortError") {
        authTitle.textContent = "요청 시간이 초과되었습니다.";
      } else {
        authTitle.textContent = "로그인 기록에 실패했습니다.";
      }
      authStatus.textContent = "인증 취소 후 다시 시도해 주세요.";
      console.error("로그인 실패:", error);
      isAuthenticating = false;
    }
  }

  function cancelAuth() {
    if (activeRequestController) activeRequestController.abort();
    isAuthenticating = false;
    authOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  searchBar.addEventListener("input", function (event) {
    renderCards(event.target.value);
  });

  function loginAsOperator() {
    var operator = {
      studentId: "ADMIN",
      name: "에듀니티랩 운영자",
      team: "운영팀",
      avatar: "🛡️"
    };
    startAuth(operator);
  }

  window.cancelAuth = cancelAuth;
  window.loginAsOperator = loginAsOperator;
  renderCards();
})();
