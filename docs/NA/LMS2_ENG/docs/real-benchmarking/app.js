(function () {
  'use strict';

  var STORAGE_KEY = 'realBenchmarkPblV1';
  var defaultState = { projectName: '', service: '', activeMission: 1, checks: {} };
  var services = {
    jumia: { label: 'Jumia', slug: 'jumia' },
    youtube: { label: 'YouTube', slug: 'youtube' },
    jiji: { label: 'Jiji', slug: 'jiji' }
  };
  var state = loadState();
  var saveTimer;
  var toastTimer;

  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Object.assign({}, defaultState, saved || {}, { checks: Object.assign({}, (saved && saved.checks) || {}) });
    } catch (error) {
      return Object.assign({}, defaultState, { checks: {} });
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    var indicator = document.getElementById('saveState');
    if (indicator) {
      indicator.textContent = 'Saved';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () { indicator.textContent = 'Auto-save'; }, 1200);
    }
  }

  function showToast(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  function safeSlug(value) {
    var slug = String(value || '').trim().toLowerCase()
      .replace(/[^a-z0-9가-힣_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || 'my-name';
  }

  function currentPath() {
    var service = services[state.service] ? services[state.service].slug : 'service';
    return 'teams/' + safeSlug(state.projectName) + '/' + service + '/';
  }

  function folderCommand() {
    var path = currentPath().replace(/\/$/, '');
    return 'mkdir -p "' + path + '/"{research/evidence,docs/01-product,docs/02-business,docs/03-engineering,development/apps/web,development/packages/ui/src,development/packages/config,development/tests/e2e,reports}';
  }

  function updateSetup() {
    document.getElementById('projectPath').textContent = currentPath();
    document.querySelectorAll('[data-service]').forEach(function (button) {
      var selected = button.dataset.service === state.service;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function selectMission(number, shouldScroll) {
    var mission = Math.max(1, Math.min(4, Number(number) || 1));
    state.activeMission = mission;
    document.querySelectorAll('[data-mission-panel]').forEach(function (panel) {
      var active = Number(panel.dataset.missionPanel) === mission;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    document.querySelectorAll('[data-mission-tab]').forEach(function (tab) {
      var active = Number(tab.dataset.missionTab) === mission;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-current', active ? 'step' : 'false');
    });
    saveState();
    if (shouldScroll) {
      document.getElementById('mission-workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(function () {
        var title = document.getElementById('mission' + mission + '-title');
        if (title) title.setAttribute('tabindex', '-1'), title.focus({ preventScroll: true });
      }, 450);
    }
  }

  function updateProgress() {
    var allChecks = Array.prototype.slice.call(document.querySelectorAll('[data-check]'));
    var completed = allChecks.filter(function (input) { return input.checked; }).length;
    var percent = allChecks.length ? Math.round((completed / allChecks.length) * 100) : 0;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = allChecks.length;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBar').style.width = percent + '%';
    document.querySelector('.progress-track').setAttribute('aria-valuenow', String(percent));

    for (var mission = 1; mission <= 4; mission += 1) {
      var missionChecks = allChecks.filter(function (input) { return input.dataset.check.indexOf('m' + mission + '-') === 0; });
      var missionDone = missionChecks.filter(function (input) { return input.checked; }).length;
      var count = document.querySelector('[data-check-count="' + mission + '"]');
      var status = document.querySelector('[data-mission-status="' + mission + '"]');
      if (count) count.textContent = missionDone + ' / ' + missionChecks.length;
      if (status) status.textContent = missionDone === missionChecks.length ? 'Completed' : missionDone + '/' + missionChecks.length;
      document.querySelectorAll('[data-mission-tab="' + mission + '"]').forEach(function (tab) {
        tab.classList.toggle('is-complete', missionDone === missionChecks.length);
      });
    }
  }

  function copyText(text, successMessage) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { showToast(successMessage); });
      return;
    }
    var area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    showToast(successMessage);
  }

  function downloadProgress() {
    var lines = [
      '# Real Benchmarking PBL Progress Log',
      '',
      '- Name/team name: ' + (state.projectName || 'Not entered'),
      '- Chosen service: ' + (services[state.service] ? services[state.service].label : 'Not chosen'),
      '- Work path: `' + currentPath() + '`',
      '- Downloaded at: ' + new Date().toLocaleString('en-NG'),
      '',
      '## Checkpoints'
    ];
    for (var mission = 1; mission <= 4; mission += 1) {
      lines.push('', '### Mission ' + mission);
      document.querySelectorAll('[data-check^="m' + mission + '-"]').forEach(function (input) {
        var label = input.closest('label').querySelector('span').textContent.trim();
        lines.push('- [' + (input.checked ? 'x' : ' ') + '] ' + label);
      });
    }
    lines.push('', '## Next steps', '- Record where the evidence files are for checkpoints not yet done.', '- Use `EVALUATION_RUBRIC.md` for detailed grading.', '');
    var blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'REAL_BENCHMARK_PROGRESS.md';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    showToast('Progress log saved as Markdown.');
  }

  function initialize() {
    var projectName = document.getElementById('projectName');
    projectName.value = state.projectName;
    projectName.addEventListener('input', function () {
      state.projectName = projectName.value;
      updateSetup();
      saveState();
    });

    document.querySelectorAll('[data-service]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.service = state.service === button.dataset.service ? '' : button.dataset.service;
        updateSetup();
        saveState();
        showToast(state.service ? services[state.service].label + ' Set as your project.' : 'Service selection cleared.');
      });
    });

    document.querySelectorAll('[data-check]').forEach(function (input) {
      input.checked = Boolean(state.checks[input.dataset.check]);
      input.addEventListener('change', function () {
        state.checks[input.dataset.check] = input.checked;
        saveState();
        updateProgress();
      });
    });

    document.querySelectorAll('[data-mission-tab]').forEach(function (button) {
      button.addEventListener('click', function () { selectMission(button.dataset.missionTab, true); });
    });
    document.querySelectorAll('[data-jump-mission]').forEach(function (button) {
      button.addEventListener('click', function () { selectMission(button.dataset.jumpMission, true); });
    });
    document.querySelectorAll('[data-next-mission]').forEach(function (button) {
      button.addEventListener('click', function () { selectMission(button.dataset.nextMission, true); });
    });
    document.querySelectorAll('[data-copy-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var source = document.getElementById(button.dataset.copyTarget);
        copyText(source.textContent, 'Template copied.');
      });
    });

    document.getElementById('copyCommand').addEventListener('click', function () {
      copyText(folderCommand(), 'Folder creation command copied.');
    });
    document.getElementById('downloadProgress').addEventListener('click', downloadProgress);
    document.getElementById('resetProgress').addEventListener('click', function () {
      if (!window.confirm('Reset your chosen service and all check records?')) return;
      localStorage.removeItem(STORAGE_KEY);
      state = Object.assign({}, defaultState, { checks: {} });
      projectName.value = '';
      document.querySelectorAll('[data-check]').forEach(function (input) { input.checked = false; });
      updateSetup();
      updateProgress();
      selectMission(1, false);
      showToast('Progress log reset.');
    });

    updateSetup();
    updateProgress();
    selectMission(state.activeMission, false);
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
