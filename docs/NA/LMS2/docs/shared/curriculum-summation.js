(function () {
  "use strict";

  var match = window.location.pathname.match(/day(10|[1-9])\/day\1-ai-codex-summation\.html$/i);
  var day = match ? Number(match[1]) : 0;
  var curriculum = window.LMS_CURRICULUM && window.LMS_CURRICULUM[day];
  if (!curriculum) return;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }

  function list(values, ordered, className) {
    var tag = ordered ? "ol" : "ul";
    return "<" + tag + ' class="' + className + '">' +
      values.map(function (value) { return "<li>" + escapeHtml(value) + "</li>"; }).join("") +
      "</" + tag + ">";
  }

  function files(values) {
    return '<div class="pbl-summary-files">' + values.map(function (value) {
      return "<code>" + escapeHtml(value) + "</code>";
    }).join("") + "</div>";
  }

  function labLink(type, index) {
    return "../shared/learning-lab.html?day=" + day + "&type=" + type + "&id=" + (index + 1);
  }

  function skillCard(item, index) {
    return '<article class="pbl-summary-card skill">' +
      '<div class="pbl-summary-card-head"><span>DEVELOPER SKILL ' + (index + 1) + '</span><h3>' + escapeHtml(item.title) + '</h3></div>' +
      '<p class="pbl-summary-lead">' + escapeHtml(item.pbl.brief) + '</p>' +
      '<div class="pbl-summary-scenario"><strong>Persona 예시 상황</strong><b>' + escapeHtml(item.pbl.scenario.persona) + '</b><p>' + escapeHtml(item.pbl.scenario.situation) + '</p></div>' +
      '<div class="pbl-summary-note"><strong>익혀야 할 핵심</strong><p>' + escapeHtml(item.concept) + '</p></div>' +
      '<h4>시작 자료</h4>' + files(item.pbl.inputs) +
      '<h4>학생 수행 미션</h4>' + list(item.pbl.work, true, "pbl-summary-steps") +
      '<h4>완료 기준</h4>' + list(item.pbl.done, false, "pbl-summary-checks") +
      '<div class="pbl-summary-output"><strong>제출 산출물</strong><code>' + escapeHtml(item.artifact) + '</code><span>' + escapeHtml(item.check) + '</span></div>' +
      '<a class="pbl-summary-action" href="' + labLink("skill", index) + '">Skill 실습 상세 보기 →</a>' +
    '</article>';
  }

  function missionCard(item, index) {
    return '<article class="pbl-summary-card mission">' +
      '<div class="pbl-summary-card-head"><span>PLANNER × DEVELOPER MISSION ' + (index + 1) + '</span><h3>' + escapeHtml(item.title) + '</h3></div>' +
      '<p class="pbl-summary-lead">' + escapeHtml(item.pbl.brief) + '</p>' +
      '<div class="pbl-summary-scenario"><strong>Persona 예시 상황</strong><b>' + escapeHtml(item.pbl.scenario.persona) + '</b><p>' + escapeHtml(item.pbl.scenario.situation) + '</p></div>' +
      '<div class="pbl-summary-issue"><strong>AI Agent 활용 이슈</strong><p>' + escapeHtml(item.issue) + '</p></div>' +
      '<div class="pbl-summary-roles"><div><strong>기획자</strong><p>' + escapeHtml(item.planner) + '</p></div><div><strong>개발자</strong><p>' + escapeHtml(item.developer) + '</p></div></div>' +
      '<h4>시작 자료</h4>' + files(item.pbl.inputs) +
      '<h4>공동 수행 미션</h4>' + list(item.pbl.work, true, "pbl-summary-steps") +
      '<h4>완료 기준</h4>' + list(item.pbl.done, false, "pbl-summary-checks") +
      '<div class="pbl-summary-output"><strong>공동 산출물</strong><code>' + escapeHtml(item.artifact) + '</code><span>AI의 결론이 아니라 기획자와 개발자의 근거·판단·승인 기록을 제출합니다.</span></div>' +
      '<a class="pbl-summary-action" href="' + labLink("mission", index) + '">Mission 실습 상세 보기 →</a>' +
    '</article>';
  }

  function removeLegacyMissionNavigation() {
    document.querySelectorAll(".nav-links a").forEach(function (anchor) {
      if (/^Mission\s+\d+/i.test(anchor.textContent.trim())) anchor.remove();
    });
  }

  function addStyles() {
    var style = document.createElement("style");
    style.textContent =
      ".pbl-summary-shell{max-width:1240px;margin:0 auto;padding:36px 24px 80px;color:#243B35}" +
      ".pbl-summary-overview{display:grid;grid-template-columns:minmax(0,1.5fr) repeat(3,minmax(130px,.5fr));gap:14px;margin-bottom:28px}" +
      ".pbl-summary-overview>div{background:#F6F9F4;border:1px solid rgba(36,59,53,0.081);border-radius:16px;padding:20px}" +
      ".pbl-summary-overview .project{border-left:4px solid #2B5CA6}" +
      ".pbl-summary-overview strong{display:block;color:#2B5CA6;font-size:.72rem;letter-spacing:.06em;margin-bottom:8px}" +
      ".pbl-summary-overview p{margin:0;color:#4A605A;line-height:1.65;font-size:.9rem}" +
      ".pbl-summary-number{font-size:1.8rem;font-weight:900;color:#243B35;line-height:1.1}" +
      ".pbl-summary-rule{background:linear-gradient(135deg,rgba(43,92,166,0.132),rgba(93,74,168,0.143));border:1px solid rgba(43,92,166,0.2);border-radius:16px;padding:20px 22px;margin-bottom:36px}" +
      ".pbl-summary-rule h2,.pbl-summary-section-title{margin:0 0 10px;color:#243B35}.pbl-summary-rule ol{margin:0;padding-left:20px;color:#4A605A;line-height:1.75}" +
      ".pbl-summary-section{margin-top:38px}.pbl-summary-section-title{font-size:1.35rem;border-left:4px solid rgba(43,92,166,0.55);padding-left:12px}.pbl-summary-section.missions .pbl-summary-section-title{border-color:rgba(93,74,168,0.55)}" +
      ".pbl-summary-section-desc{color:#4A605A;margin:0 0 18px;line-height:1.6}.pbl-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;align-items:start}.pbl-summary-grid.mission-grid{grid-template-columns:repeat(2,minmax(0,1fr))}" +
      ".pbl-summary-card{background:#F6F9F4;border:1px solid rgba(43,92,166,0.25);border-radius:18px;padding:22px;box-shadow:0 14px 34px rgba(36,59,53,0.056)}.pbl-summary-card.mission{border-color:rgba(93,74,168,0.28)}" +
      ".pbl-summary-card-head span{display:inline-block;color:#2B5CA6;background:rgba(43,92,166,0.132);border:1px solid rgba(43,92,166,0.22);border-radius:999px;padding:5px 9px;font-size:.65rem;font-weight:800;letter-spacing:.04em}.pbl-summary-card.mission .pbl-summary-card-head span{color:#5D4AA8;background:rgba(93,74,168,0.143);border-color:rgba(93,74,168,0.25)}" +
      ".pbl-summary-card h3{font-size:1.05rem;line-height:1.42;margin:12px 0;color:#243B35}.pbl-summary-card h4{font-size:.78rem;color:#243B35;margin:18px 0 8px}.pbl-summary-lead{color:#4A605A;line-height:1.65;font-size:.84rem;min-height:4.1em}" +
      ".pbl-summary-note,.pbl-summary-issue,.pbl-summary-scenario{background:#F6F9F4;border-radius:11px;padding:13px;margin-top:14px}.pbl-summary-note strong,.pbl-summary-issue strong,.pbl-summary-scenario strong,.pbl-summary-output strong{display:block;color:#2B5CA6;font-size:.7rem;margin-bottom:6px}.pbl-summary-issue strong{color:#5D4AA8}" +
      ".pbl-summary-scenario{border-left:3px solid rgba(43,92,166,0.55);background:rgba(43,92,166,0.066)}.pbl-summary-card.mission .pbl-summary-scenario{border-color:rgba(93,74,168,0.55);background:rgba(93,74,168,0.077)}.pbl-summary-scenario b{display:block;color:#243B35;font-size:.75rem;margin-bottom:6px}.pbl-summary-note p,.pbl-summary-issue p,.pbl-summary-scenario p,.pbl-summary-roles p{margin:0;color:#4A605A;font-size:.78rem;line-height:1.58}.pbl-summary-roles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.pbl-summary-roles>div{background:rgba(93,74,168,0.077);border-radius:10px;padding:11px}.pbl-summary-roles strong{color:#243B35;font-size:.7rem}" +
      ".pbl-summary-files{display:flex;flex-wrap:wrap;gap:6px}.pbl-summary-files code,.pbl-summary-output code{font-size:.7rem;color:#2B5CA6;background:#F6F9F4;border:1px solid rgba(36,59,53,0.08);border-radius:6px;padding:5px 7px;overflow-wrap:anywhere}" +
      ".pbl-summary-steps,.pbl-summary-checks{margin:0;padding-left:20px;color:#4A605A;font-size:.78rem;line-height:1.62}.pbl-summary-steps li,.pbl-summary-checks li{margin:5px 0;padding-left:3px}.pbl-summary-checks li::marker{color:#27765B}" +
      ".pbl-summary-output{display:grid;gap:7px;background:rgba(43,92,166,0.077);border-radius:11px;padding:13px;margin-top:17px}.pbl-summary-card.mission .pbl-summary-output{background:rgba(93,74,168,0.088)}.pbl-summary-output span{font-size:.72rem;color:#4A605A;line-height:1.5}" +
      ".pbl-summary-action{display:block;text-align:center;text-decoration:none;color:#243B35;background:linear-gradient(135deg,#D2E0FB,#D2E0FB);border-radius:10px;padding:11px 12px;margin-top:16px;font-size:.78rem;font-weight:800}.pbl-summary-card.mission .pbl-summary-action{background:linear-gradient(135deg,#DFD8F6,#DFD8F6)}" +
      "@media(max-width:980px){.pbl-summary-overview{grid-template-columns:1fr 1fr}.pbl-summary-overview .project{grid-column:1/-1}.pbl-summary-grid,.pbl-summary-grid.mission-grid{grid-template-columns:1fr 1fr}}" +
      "@media(max-width:640px){.pbl-summary-shell{padding:28px 16px 60px}.pbl-summary-overview,.pbl-summary-grid,.pbl-summary-grid.mission-grid{grid-template-columns:1fr}.pbl-summary-overview .project{grid-column:auto}.pbl-summary-roles{grid-template-columns:1fr}.pbl-summary-lead{min-height:0}}";
    document.head.appendChild(style);
  }

  function render() {
    removeLegacyMissionNavigation();
    addStyles();
    document.title = "Day " + day + ". " + curriculum.theme + " PBL 학습 요약 | ACE AI SW Startup Training";

    var hero = document.querySelector(".hero");
    var heroContent = hero && (hero.querySelector(".hero-content") || hero);
    if (heroContent) {
      heroContent.innerHTML = '<div class="hero-badge-wrap"><span class="hero-badge">DAY ' + day + '</span><span class="hero-badge">PBL SUMMARY</span><span class="hero-badge">EVIDENCE BASED</span></div>' +
        '<h1>Day ' + day + '. ' + escapeHtml(curriculum.theme) + '</h1>' +
        '<p>' + escapeHtml(curriculum.project) + ' 개발자는 AI를 튜터·리뷰어로 활용해 직접 구현하고, 기획자와 개발자는 AI Agent 활용 과정의 이슈를 근거 중심으로 함께 해결합니다.</p>';
    }

    var footer = document.querySelector("footer");
    if (!hero || !footer) return;
    var current = hero.nextElementSibling;
    while (current && current !== footer) {
      var next = current.nextElementSibling;
      current.remove();
      current = next;
    }

    var section = document.createElement("section");
    section.className = "pbl-summary-shell";
    section.innerHTML =
      '<div class="pbl-summary-overview">' +
        '<div class="project"><strong>DAY PROJECT</strong><p>' + escapeHtml(curriculum.project) + '</p></div>' +
        '<div><strong>DEVELOPER SKILL</strong><div class="pbl-summary-number">' + curriculum.skills.length + '</div></div>' +
        '<div><strong>COLLAB MISSION</strong><div class="pbl-summary-number">' + curriculum.missions.length + '</div></div>' +
        '<div><strong>FINAL OUTPUTS</strong><div class="pbl-summary-number">' + (curriculum.skills.length + curriculum.missions.length) + '</div></div>' +
      '</div>' +
      '<div class="pbl-summary-rule"><h2>PBL 수행 원칙</h2><ol><li>AI를 실행하기 전에 학생이 먼저 입력 자료의 근거와 자신의 가설을 기록합니다.</li><li>Skill은 개발자가 표·다이어그램·코드·테스트를 직접 만들고 AI에는 누락과 반례를 질문합니다.</li><li>Mission은 기획자와 개발자가 역할별 판단을 작성한 뒤 공동 결정과 완료 기준을 확정합니다.</li><li>최종 제출물에는 AI 결과뿐 아니라 수정 전후 차이, 검증 증거, 유지·기각한 제안의 이유가 포함되어야 합니다.</li></ol></div>' +
      '<section class="pbl-summary-section"><h2 class="pbl-summary-section-title">Developer Skill 학습 요약</h2><p class="pbl-summary-section-desc">AI Agent에게 작업을 대신 시키는 과제가 아니라, 개발자가 직접 설계·구현·검증하면서 해당 기술을 익히는 실습입니다.</p><div class="pbl-summary-grid">' + curriculum.skills.map(skillCard).join("") + '</div></section>' +
      '<section class="pbl-summary-section missions"><h2 class="pbl-summary-section-title">Planner × Developer Mission 요약</h2><p class="pbl-summary-section-desc">AI Agent 활용 중 발생하는 누락·왜곡·과잉 가정·검증 착시를 기획자와 개발자가 역할별 근거로 해결하는 공동 미션입니다.</p><div class="pbl-summary-grid mission-grid">' + curriculum.missions.map(missionCard).join("") + '</div></section>';
    footer.parentNode.insertBefore(section, footer);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
