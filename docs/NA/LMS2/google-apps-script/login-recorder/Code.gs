var LOGIN_CONFIG = Object.freeze({
  spreadsheetId: "14Glwk8uzmeebH5QZ6_snHKxkSFwoLvPgEEcm882pjRo",
  rosterSheetName: "출석부",
  loginLogSheetName: "로그인기록",
  rosterStartRow: 8,
  duplicateCacheSeconds: 21600,
  lockTimeoutMs: 10000
});

var LOGIN_LOG_HEADERS = [
  "서버 기록 일시",
  "참가자 ID",
  "이름",
  "소속/기관",
  "이벤트 ID",
  "세션 ID",
  "클라이언트 시각",
  "페이지 경로",
  "기기 유형",
  "User Agent",
  "플랫폼",
  "언어",
  "시간대",
  "화면 해상도",
  "기기 메모리(GB)",
  "CPU 코어"
];

function doGet(e) {
  var action = String((e && e.parameter && e.parameter.action) || "");
  if (action === "students") {
    try {
      return jsonResponse_({ ok: true, students: getStudents_() });
    } catch (error) {
      console.error(error);
      return jsonResponse_({ ok: false, error: "참가자 명부를 불러오지 못했습니다." });
    }
  }

  return jsonResponse_({
    ok: true,
    service: "ACE AI SW Startup Training LMS Login Recorder",
    spreadsheetId: LOGIN_CONFIG.spreadsheetId
  });
}

function doPost(e) {
  try {
    var request = readLoginRequest_(e);
    var participant = findParticipantById_(request.studentId);
    if (!participant) throw new Error("등록되지 않은 참가자 ID입니다.");

    var cache = CacheService.getScriptCache();
    var cacheKey = "na-lms-login:" + request.eventId;
    if (cache.get(cacheKey)) {
      return jsonResponse_({ ok: true, duplicate: true, student: participant });
    }

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(LOGIN_CONFIG.lockTimeoutMs)) {
      throw new Error("로그인 요청이 많습니다. 잠시 후 다시 시도해 주세요.");
    }

    try {
      if (!cache.get(cacheKey)) {
        appendLoginLog_(participant, request);
        cache.put(cacheKey, "1", LOGIN_CONFIG.duplicateCacheSeconds);
      }
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ ok: true, student: participant });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  }
}

function getStudents_() {
  var sheet = getSpreadsheet_().getSheetByName(LOGIN_CONFIG.rosterSheetName);
  if (!sheet) throw new Error("출석부 시트를 찾을 수 없습니다.");

  var rowCount = Math.max(sheet.getLastRow() - LOGIN_CONFIG.rosterStartRow + 1, 0);
  if (!rowCount) return [];

  return sheet.getRange(LOGIN_CONFIG.rosterStartRow, 2, rowCount, 3)
    .getDisplayValues()
    .filter(function (row) { return String(row[0]).trim() !== ""; })
    .map(function (row) {
      return {
        studentId: safeText_(row[0], 60),
        name: safeText_(row[1], 80),
        team: safeText_(row[2], 120)
      };
    })
    .sort(function (a, b) { return a.studentId.localeCompare(b.studentId); });
}

function findParticipantById_(studentId) {
  var normalizedId = safeText_(studentId, 60);
  if (normalizedId === "ADMIN") {
    return {
      studentId: "ADMIN",
      name: "에듀니티랩 운영자",
      team: "운영팀"
    };
  }
  var participants = getStudents_();
  for (var i = 0; i < participants.length; i += 1) {
    if (participants[i].studentId === normalizedId) return participants[i];
  }
  return null;
}

function readLoginRequest_(e) {
  var params = (e && e.parameter) || {};
  var studentId = safeText_(params.studentId, 60);
  var eventId = safeText_(params.eventId, 120);

  if (!studentId) throw new Error("참가자 ID가 없습니다.");
  if (!eventId) throw new Error("이벤트 ID가 없습니다.");

  return {
    studentId: studentId,
    eventId: eventId,
    sessionId: safeText_(params.sessionId, 120),
    clientTimestamp: safeText_(params.clientTimestamp, 60),
    pagePath: safeText_(params.pagePath, 300),
    deviceType: safeText_(params.deviceType, 40),
    userAgent: safeText_(params.userAgent, 500),
    platform: safeText_(params.platform, 120),
    language: safeText_(params.language, 40),
    timeZone: safeText_(params.timeZone, 80),
    screenResolution: safeText_(params.screenResolution, 40),
    deviceMemory: safeText_(params.deviceMemory, 20),
    hardwareConcurrency: safeText_(params.hardwareConcurrency, 20)
  };
}

function appendLoginLog_(participant, request) {
  var sheet = getLoginLogSheet_();
  sheet.appendRow([
    new Date(),
    safeCell_(participant.studentId),
    safeCell_(participant.name),
    safeCell_(participant.team),
    safeCell_(request.eventId),
    safeCell_(request.sessionId),
    safeCell_(request.clientTimestamp),
    safeCell_(request.pagePath),
    safeCell_(request.deviceType),
    safeCell_(request.userAgent),
    safeCell_(request.platform),
    safeCell_(request.language),
    safeCell_(request.timeZone),
    safeCell_(request.screenResolution),
    safeCell_(request.deviceMemory),
    safeCell_(request.hardwareConcurrency)
  ]);
}

function getLoginLogSheet_() {
  var sheet = getSpreadsheet_().getSheetByName(LOGIN_CONFIG.loginLogSheetName);
  if (!sheet) throw new Error("로그인기록 시트를 찾을 수 없습니다.");

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, LOGIN_LOG_HEADERS.length).setValues([LOGIN_LOG_HEADERS]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getSpreadsheet_() {
  return SpreadsheetApp.openById(LOGIN_CONFIG.spreadsheetId);
}

function safeText_(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function safeCell_(value) {
  var text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function testGetStudents() {
  console.log(JSON.stringify(getStudents_()));
}
