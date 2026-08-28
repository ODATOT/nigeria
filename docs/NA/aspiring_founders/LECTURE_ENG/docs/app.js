// Global functions defined with var and window for 100% accessibility in inline HTML handlers
var currentSlideIdx = 0;
var isDashboardOpen = false;
var currentDashDay = 'all';
var currentDashQuery = '';

function getSlideElements() {
  return Array.from(document.querySelectorAll('.slide-card'));
}

var showSlide = window.showSlide = function(index) {
  var allSlides = getSlideElements();
  if (!allSlides || allSlides.length === 0) return;
  
  if (index < 0) index = 0;
  if (index >= allSlides.length) index = allSlides.length - 1;
  currentSlideIdx = index;

  allSlides.forEach(function(slide, idx) {
    slide.classList.remove('active', 'prev');
    if (idx === index) {
      slide.classList.add('active');
    } else if (idx < index) {
      slide.classList.add('prev');
    }
  });

  // Progress UI
  var progressBar = document.querySelector('.progress-bar');
  var progressInfo = document.querySelector('.slide-progress-info');
  if (progressBar) {
    progressBar.style.width = (((index + 1) / allSlides.length) * 100) + '%';
  }
  if (progressInfo) {
    progressInfo.textContent = (index + 1) + ' / ' + allSlides.length;
  }

  // Prev / Next button states
  var prevBtn = document.getElementById('prev-btn');
  var nextBtn = document.getElementById('next-btn');
  var sidePrev = document.getElementById('side-prev-btn');
  var sideNext = document.getElementById('side-next-btn');
  if (prevBtn) prevBtn.disabled = (index === 0);
  if (nextBtn) nextBtn.disabled = (index === allSlides.length - 1);
  if (sidePrev) sidePrev.style.opacity = (index === 0) ? '0.3' : '1';
  if (sideNext) sideNext.style.opacity = (index === allSlides.length - 1) ? '0.3' : '1';

  // Highlight Top Day Chip
  updateActiveDayChip(index);

  try {
    history.replaceState(null, null, '#slide-' + (index + 1));
  } catch (e) {}
};

var nextSlide = window.nextSlide = function() {
  var allSlides = getSlideElements();
  if (currentSlideIdx < allSlides.length - 1) {
    showSlide(currentSlideIdx + 1);
  }
};

var prevSlide = window.prevSlide = function() {
  if (currentSlideIdx > 0) {
    showSlide(currentSlideIdx - 1);
  }
};

var jumpToDay = window.jumpToDay = function(dayNum) {
  var allSlides = getSlideElements();
  var target = 0;
  for (var i = 0; i < allSlides.length; i++) {
    var s = allSlides[i];
    if (s.classList.contains('session-' + dayNum) || (s.id && s.id.startsWith('day' + dayNum))) {
      target = i;
      break;
    }
  }
  closeDashboard();
  showSlide(target);
};

var toggleView = window.toggleView = function() {
  if (isDashboardOpen) {
    closeDashboard();
  } else {
    openDashboard();
  }
};

var openDashboard = window.openDashboard = function() {
  isDashboardOpen = true;
  var dashEl = document.querySelector('.dashboard-viewport');
  var toggleBtn = document.getElementById('toggle-view');
  if (dashEl) {
    dashEl.classList.add('active');
    dashEl.style.display = 'block';
  }
  if (toggleBtn) {
    toggleBtn.classList.add('active');
    toggleBtn.innerHTML = '<svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M21,16V4H3V16H21M21,2H3C1.89,2 1,2.89 1,4V16C1,17.1 1.89,18 3,18H10V20H8V22H16V20H14V18H21C22.1,18 23,17.1 23,16V4C23,2.89 22.1,2 21,2Z"></path></svg> Slide View <span class="badge">Esc</span>';
  }
  renderDashboard();
};

var closeDashboard = window.closeDashboard = function() {
  isDashboardOpen = false;
  var dashEl = document.querySelector('.dashboard-viewport');
  var toggleBtn = document.getElementById('toggle-view');
  if (dashEl) {
    dashEl.classList.remove('active');
    dashEl.style.display = 'none';
  }
  if (toggleBtn) {
    toggleBtn.classList.remove('active');
    toggleBtn.innerHTML = '<svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24"><path d="M4,4H20V12H4V4M4,14H11V20H4V14M13,14H20V20H13V14Z"></path></svg> Dashboard <span class="badge">Esc</span>';
  }
};

var filterDashboardByDay = window.filterDashboardByDay = function(day, btn) {
  currentDashDay = day;
  var buttons = document.querySelectorAll('.dash-tab-btn');
  buttons.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderDashboard();
};

var handleSearch = window.handleSearch = function(query) {
  currentDashQuery = query;
  renderDashboard();
};

var renderDashboard = window.renderDashboard = function() {
  var cardsGrid = document.querySelector('.cards-grid');
  if (!cardsGrid) return;
  cardsGrid.innerHTML = '';

  var allSlides = getSlideElements();
  var query = (currentDashQuery || '').toLowerCase().trim();
  var matchCount = 0;

  allSlides.forEach(function(slide, idx) {
    var titleEl = slide.querySelector('.slide-title, .divider-title');
    var categoryEl = slide.querySelector('.slide-category, .divider-tag');
    var title = titleEl ? titleEl.textContent.trim() : 'Slide ' + (idx + 1);
    var category = categoryEl ? categoryEl.textContent.trim() : 'Lecture Slide';

    var dayNum = 1;
    for (var i = 0; i < slide.classList.length; i++) {
      if (slide.classList[i].startsWith('session-')) {
        dayNum = parseInt(slide.classList[i].replace('session-', ''), 10) || 1;
        break;
      }
    }
    if (slide.id && slide.id.startsWith('day')) {
      var m = slide.id.match(/^day(\d+)/);
      if (m) dayNum = parseInt(m[1], 10);
    }

    if (currentDashDay !== 'all' && currentDashDay !== String(dayNum)) {
      return;
    }

    var desc = '';
    var pEls = slide.querySelectorAll('.slide-body p, .slide-body li, .divider-subtitle');
    if (pEls.length > 0) {
      desc = Array.from(pEls).slice(0, 2).map(function(p) { return p.textContent.trim(); }).join(' ').substring(0, 75) + '...';
    }

    if (
      title.toLowerCase().includes(query) ||
      category.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query)
    ) {
      matchCount++;
      var card = document.createElement('div');
      card.className = 'dashboard-card session-' + dayNum;

      var dayColors = { 1: '#00f2fe', 2: '#60a5fa', 3: '#a855f7', 4: '#f43f5e', 5: '#10b981' };
      var color = dayColors[dayNum] || '#00f2fe';

      card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '<span style="font-weight:700;color:#94a3b8;font-size:0.85rem;">Slide ' + (idx + 1) + '</span>' +
        '<span style="background:rgba(255,255,255,0.08);color:' + color + ';padding:2px 8px;border-radius:4px;font-size:0.8rem;font-weight:800;">Day ' + dayNum + '</span>' +
        '</div>' +
        '<div style="font-weight:800;font-size:1.02rem;color:#fff;margin-bottom:6px;">' + title + '</div>' +
        '<div style="font-size:0.82rem;color:#94a3b8;line-height:1.4;">' + desc + '</div>' +
        '<div style="margin-top:12px;"><span style="font-size:0.75rem;padding:3px 8px;border-radius:4px;background:rgba(255,255,255,0.05);color:#cbd5e1;">' + category + '</span></div>';

      card.onclick = function() {
        closeDashboard();
        showSlide(idx);
      };

      cardsGrid.appendChild(card);
    }
  });

  if (matchCount === 0) {
    cardsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#94a3b8;font-size:1.1rem;">🔍 No slides match your search criteria.</div>';
  }
};

function updateActiveDayChip(slideIdx) {
  var allSlides = getSlideElements();
  var currentSlide = allSlides[slideIdx];
  if (!currentSlide) return;

  var dayNum = 1;
  for (var i = 0; i < currentSlide.classList.length; i++) {
    if (currentSlide.classList[i].startsWith('session-')) {
      dayNum = parseInt(currentSlide.classList[i].replace('session-', ''), 10) || 1;
      break;
    }
  }
  if (currentSlide.id && currentSlide.id.startsWith('day')) {
    var match = currentSlide.id.match(/^day(\d+)/);
    if (match) dayNum = parseInt(match[1], 10);
  }

  var chips = document.querySelectorAll('.day-chip');
  chips.forEach(function(chip, idx) {
    if (idx + 1 === dayNum) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

function initListeners() {
  var prevBtn = document.getElementById('prev-btn');
  var nextBtn = document.getElementById('next-btn');
  var sidePrev = document.getElementById('side-prev-btn');
  var sideNext = document.getElementById('side-next-btn');
  var toggleBtn = document.getElementById('toggle-view');
  var printBtn = document.getElementById('print-pdf');
  var searchInput = document.getElementById('search-slides');

  if (prevBtn) prevBtn.onclick = function(e) { e.preventDefault(); prevSlide(); };
  if (nextBtn) nextBtn.onclick = function(e) { e.preventDefault(); nextSlide(); };
  if (sidePrev) sidePrev.onclick = function(e) { e.preventDefault(); prevSlide(); };
  if (sideNext) sideNext.onclick = function(e) { e.preventDefault(); nextSlide(); };
  if (toggleBtn) toggleBtn.onclick = function(e) { e.preventDefault(); toggleView(); };
  if (printBtn) printBtn.onclick = function(e) { e.preventDefault(); window.print(); };

  if (searchInput) {
    searchInput.oninput = function(e) {
      handleSearch(e.target.value);
    };
  }

  // Keyboard navigation
  window.addEventListener('keydown', function(e) {
    if (document.activeElement === searchInput) {
      if (e.key === 'Escape') searchInput.blur();
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        if (!isDashboardOpen) { e.preventDefault(); nextSlide(); }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (!isDashboardOpen) { e.preventDefault(); prevSlide(); }
        break;
      case 'Home':
        if (!isDashboardOpen) { e.preventDefault(); showSlide(0); }
        break;
      case 'End':
        var all = getSlideElements();
        if (!isDashboardOpen) { e.preventDefault(); showSlide(all.length - 1); }
        break;
      case 'Escape':
        e.preventDefault();
        if (isToolsOpen) { toggleTools(); } else { toggleView(); }
        break;
      case 't':
      case 'T':
        if (!isDashboardOpen) { e.preventDefault(); toggleTools(); }
        break;
      case 'p':
      case 'P':
        if (!isDashboardOpen) { e.preventDefault(); toggleDrawing(); }
        break;
    }
  });

  // Wheel navigation
  var wheelTimer = null;
  window.addEventListener('wheel', function(e) {
    if (isDashboardOpen) return;
    if (wheelTimer) return;
    if (e.target.closest('.presenter-tools-drawer, .dashboard-viewport, .code-box, pre')) return;

    if (e.deltaY > 20 || e.deltaX > 20) {
      nextSlide();
      wheelTimer = setTimeout(function() { wheelTimer = null; }, 300);
    } else if (e.deltaY < -20 || e.deltaX < -20) {
      prevSlide();
      wheelTimer = setTimeout(function() { wheelTimer = null; }, 300);
    }
  }, { passive: true });

  function applyHashNavigation() {
    if (!window.location.hash) return;
    var hash = window.location.hash;
    var allSlides = getSlideElements();
    if (!allSlides || allSlides.length === 0) return;

    // #day-2 or #day2 → jump to first slide of that day
    var dayMatch = hash.match(/[#/]day-?(\d+)$/i);
    if (dayMatch) {
      var targetDay = parseInt(dayMatch[1], 10);
      for (var di = 0; di < allSlides.length; di++) {
        if (allSlides[di].classList.contains('session-' + targetDay)) {
          showSlide(di);
          return;
        }
      }
    }

    // #slide-N → jump to that slide number (1-indexed)
    var slideMatch = hash.match(/slide-(\d+)/i);
    if (slideMatch) {
      var p = parseInt(slideMatch[1], 10) - 1;
      if (p >= 0 && p < allSlides.length) {
        showSlide(p);
        return;
      }
    }
  }

  // Initial Slide: support both #day-N and #slide-N hash formats
  var startIdx = 0;
  if (window.location.hash) {
    applyHashNavigation();
  } else {
    showSlide(startIdx);
  }

  window.addEventListener('hashchange', function() {
    applyHashNavigation();
  });
}

/* ============================================================ */
/* Presenter Tools: Drawer Toggle */
/* ============================================================ */
var isToolsOpen = false;
var toggleTools = window.toggleTools = function() {
  var drawer = document.getElementById('tools-drawer');
  var btn = document.getElementById('toggle-tools');
  if (!drawer) return;
  isToolsOpen = !isToolsOpen;
  if (isToolsOpen) {
    drawer.classList.add('open');
    if (btn) btn.classList.add('active');
  } else {
    drawer.classList.remove('open');
    if (btn) btn.classList.remove('active');
  }
};

/* ============================================================ */
/* Presenter Tools: Timer */
/* ============================================================ */
var timerTotalSeconds = 10 * 60;
var timerRemaining = timerTotalSeconds;
var timerInterval = null;
var timerRunning = false;

function updateTimerDisplay() {
  var display = document.querySelector('.timer-display');
  if (!display) return;
  var m = Math.floor(timerRemaining / 60);
  var s = timerRemaining % 60;
  display.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  if (timerRemaining <= 60) {
    display.style.color = '#f72585';
  } else {
    display.style.color = '';
  }
}

var timerStart = window.timerStart = function() {
  var btn = document.getElementById('timer-start');
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    if (btn) btn.textContent = 'Start Timer';
  } else {
    if (timerRemaining <= 0) { timerRemaining = timerTotalSeconds; }
    timerRunning = true;
    if (btn) btn.textContent = 'Pause';
    timerInterval = setInterval(function() {
      timerRemaining--;
      updateTimerDisplay();
      if (timerRemaining <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        var btn2 = document.getElementById('timer-start');
        if (btn2) btn2.textContent = 'Start Timer';
      }
    }, 1000);
  }
};

var timerReset = window.timerReset = function() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerRemaining = timerTotalSeconds;
  var btn = document.getElementById('timer-start');
  if (btn) btn.textContent = 'Start Timer';
  var display = document.querySelector('.timer-display');
  if (display) display.style.color = '';
  updateTimerDisplay();
};

var timerSetMins = window.timerSetMins = function(mins) {
  clearInterval(timerInterval);
  timerRunning = false;
  timerTotalSeconds = mins * 60;
  timerRemaining = timerTotalSeconds;
  var btn = document.getElementById('timer-start');
  if (btn) btn.textContent = 'Start Timer';
  var display = document.querySelector('.timer-display');
  if (display) display.style.color = '';
  updateTimerDisplay();
};

/* ============================================================ */
/* Presenter Tools: Drawing Canvas */
/* ============================================================ */
var isDrawing = false;
var drawingEnabled = false;
var drawCtx = null;
var lastX = 0;
var lastY = 0;

function initCanvas() {
  var canvas = document.getElementById('drawing-canvas');
  if (!canvas) return;
  var wrapper = canvas.parentElement;
  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;
  drawCtx = canvas.getContext('2d');
  drawCtx.strokeStyle = '#f72585';
  drawCtx.lineWidth = 3;
  drawCtx.lineCap = 'round';

  canvas.addEventListener('mousedown', function(e) {
    if (!drawingEnabled) return;
    isDrawing = true;
    var r = canvas.getBoundingClientRect();
    lastX = e.clientX - r.left;
    lastY = e.clientY - r.top;
  });
  canvas.addEventListener('mousemove', function(e) {
    if (!isDrawing || !drawingEnabled) return;
    var r = canvas.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    drawCtx.beginPath();
    drawCtx.moveTo(lastX, lastY);
    drawCtx.lineTo(x, y);
    drawCtx.stroke();
    lastX = x; lastY = y;
  });
  canvas.addEventListener('mouseup', function() { isDrawing = false; });
  canvas.addEventListener('mouseleave', function() { isDrawing = false; });
}

var toggleDrawing = window.toggleDrawing = function() {
  var canvas = document.getElementById('drawing-canvas');
  var btn = document.getElementById('toggle-drawing');
  if (!canvas) return;
  if (!drawCtx) initCanvas();
  drawingEnabled = !drawingEnabled;
  canvas.style.display = drawingEnabled ? 'block' : 'none';
  canvas.style.cursor = drawingEnabled ? 'crosshair' : 'default';
  canvas.style.pointerEvents = drawingEnabled ? 'auto' : 'none';
  if (btn) {
    var span = btn.querySelector('.btn-text');
    if (span) span.textContent = drawingEnabled ? 'Pointer Pen (P) [ON]' : 'Pointer Pen (P)';
    if (drawingEnabled) btn.classList.add('active'); else btn.classList.remove('active');
  }
};

var clearDrawing = window.clearDrawing = function() {
  var canvas = document.getElementById('drawing-canvas');
  if (canvas && drawCtx) drawCtx.clearRect(0, 0, canvas.width, canvas.height);
};

/* ============================================================ */
/* Presenter Tools: Theme Toggle */
/* ============================================================ */
var toggleTheme = window.toggleTheme = function() {
  var root = document.documentElement;
  var btn = document.getElementById('toggle-theme');
  var isLight = root.getAttribute('data-theme') === 'light';
  if (isLight) {
    root.removeAttribute('data-theme');
    if (btn) { var s = btn.querySelector('.btn-text'); if (s) s.textContent = 'Light Mode'; }
  } else {
    root.setAttribute('data-theme', 'light');
    if (btn) { var s2 = btn.querySelector('.btn-text'); if (s2) s2.textContent = 'Dark Mode'; }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initListeners);
} else {
  initListeners();
}
