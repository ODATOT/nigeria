document.addEventListener('DOMContentLoaded', async () => {
  // --- Load Session Files Dynamically ---
  async function loadSessions() {
    const wrapper = document.querySelector('.slides-wrapper');
    if (wrapper.querySelectorAll('.slide-card').length > 0) {
      return; // Skip fetching if slides are already inlined
    }

    const sessions = [
      'session/session1.html',
      'session/session2.html',
      'session/session3.html',
      'session/session4.html',
      'session/session5.html',
      'session/session6.html',
      'session/session7.html',
      'session/session8.html',
      'session/session9.html',
      'session/session10.html'
    ];
    
    const fetches = sessions.map(file => fetch(file).then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.text();
    }));
    
    try {
      const htmlContents = await Promise.all(fetches);
      htmlContents.forEach((html, sessionIndex) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const slideCards = tempDiv.querySelectorAll('.slide-card');
        slideCards.forEach(card => {
          card.classList.add(`session-${sessionIndex + 1}`);
          wrapper.appendChild(card);
        });
      });
    } catch (error) {
      console.error('Error loading session files:', error);
      
      // Render a premium looking CORS warning modal / banner
      const errorDiv = document.createElement('div');
      errorDiv.id = 'cors-warning-overlay';
      errorDiv.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.95);
        display: flex; justify-content: center; align-items: center;
        z-index: 99999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #f8fafc;
        padding: 20px;
        box-sizing: border-box;
      `;
      errorDiv.innerHTML = `<div style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; max-width: 500px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; transform: translateY(0); transition: all 0.3s ease;">
          <div style="background: rgba(239, 68, 68, 0.15); width: 64px; height: 64px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 24px;">
            <svg style="width: 32px; height: 32px; fill: #ef4444;" viewBox="0 0 24 24">
              <path d="M12,2L1,21H23L12,2M12,6L19.53,19H4.47L12,6M11,10V14H13V10H11M11,16V18H13V16H11Z"/>
            </svg>
          </div>
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #f1f5f9;">Could not load slide data</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; text-align: left;">
            Loading of the file is currently blocked by browser security policy (CORS), either directly in the browser via the file system protocol (<code>file://</code>) or because the web server environment is not configured.
          </p>
          <div style="background: #0f172a; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: left; font-size: 13px; line-height: 1.5; border: 1px solid #1e293b;">
            <strong style="color: #38bdf8; display: block; margin-bottom: 8px;">Solution:</strong>
            1. If VS Code is turned on, click the <strong style="color: #fb7185;">Go Live</strong> (Live Server) button in the bottom right.<br>
            2. Alternatively, run the local server using the following command in the terminal:<br>
            <code style="background: #1e293b; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 6px; color: #e2e8f0; font-family: monospace;">python -m http.server 8000</code>
          </div>
          <p style="font-size: 11px; color: #64748b; margin-top: 16px;">Detailed log: ${error.message}</p>
        </div>`;
      document.body.appendChild(errorDiv);
      throw error; // stop execution
    }
  }

  await loadSessions();

  // --- State Initialization ---
  const state = {
    currentSlide: 0,
    viewMode: 'presentation', // 'presentation' | 'dashboard'
    theme: 'dark',
    isDrawing: false,
    drawerOpen: false,
    timer: {
      secondsLeft: 0,
      intervalId: null,
      isRunning: false
    }
  };

  // --- Element Selectors ---
  const slides = document.querySelectorAll('.slide-card');

  // Inject page numbers into slides dynamically
  slides.forEach((slide, index) => {
    const pageNum = document.createElement('div');
    pageNum.className = 'slide-page-number';
    pageNum.textContent = index + 1;
    slide.appendChild(pageNum);
  });

  const progressBar = document.querySelector('.progress-bar');
  const slideProgressText = document.querySelector('.slide-progress-info');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const toggleViewBtn = document.getElementById('toggle-view');
  const printPdfBtn = document.getElementById('print-pdf');

  const presentationViewport = document.querySelector('.slides-wrapper');
  const dashboardViewport = document.querySelector('.dashboard-viewport');
  const searchInput = document.getElementById('search-slides');
  const cardsGrid = document.querySelector('.cards-grid');

  // Drawer / Presenter Tools
  const toolsToggle = document.getElementById('toggle-tools');
  const toolsDrawer = document.getElementById('tools-drawer');
  const themeToggle = document.getElementById('toggle-theme');
  const drawingToggle = document.getElementById('toggle-drawing');
  const clearDrawingBtn = document.getElementById('clear-drawing');
  const scriptDisplay = document.getElementById('script-display');
  const visualDisplay = document.getElementById('visual-display');

  // Timer Elements
  const timerDisplay = document.querySelector('.timer-display');
  const timerStartBtn = document.getElementById('timer-start');
  const timerResetBtn = document.getElementById('timer-reset');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const flashScreen = document.getElementById('flash-screen');

  // Drawing Canvas
  const drawingCanvas = document.getElementById('drawing-canvas');
  const ctx = drawingCanvas.getContext('2d');
  let isDrawingActive = false;
  let lastX = 0;
  let lastY = 0;

  // --- Dynamic Slide Viewport Scaling ---
  function resizeSlides() {
    const mainViewport = document.querySelector('.main-viewport');
    const wrapper = document.querySelector('.slides-wrapper');
    if (!mainViewport || !wrapper) return;

    if (window.innerWidth <= 768) {
      // Mobile vertical scroll mode: clear dynamic scaling
      wrapper.style.transform = '';
      wrapper.style.width = '';
      wrapper.style.height = '';
      return;
    }

    // Design resolution reference
    const designWidth = 1366;
    const designHeight = 768;

    // Viewport padding (defined in CSS: 15px left/right/top, 85px bottom)
    const paddingX = 30; // 15px * 2
    const paddingY = 100; // 15px + 85px

    const availableWidth = mainViewport.clientWidth - paddingX;
    const availableHeight = mainViewport.clientHeight - paddingY;

    // Calculate scale factor to fit the slides-wrapper within available space
    const scale = Math.min(availableWidth / designWidth, availableHeight / designHeight);

    // Apply explicit sizing and scaling transform
    wrapper.style.width = `${designWidth}px`;
    wrapper.style.height = `${designHeight}px`;
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'center center';
    wrapper.style.flexShrink = '0';
  }

  // --- Initialize Canvas Resolution ---
  function resizeCanvas() {
    drawingCanvas.width = drawingCanvas.parentElement.clientWidth;
    drawingCanvas.height = drawingCanvas.parentElement.clientHeight;
    // Retain canvas drawings on resize isn't strictly necessary for a simple pointer pen, 
    // but resetting size clears context variables.
    ctx.strokeStyle = '#f72585';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  // Combined resize handler
  function handleResize() {
    resizeSlides();
    resizeCanvas();
  }

  window.addEventListener('resize', handleResize);
  // Initial size deferred slightly until slide-cards lay out
  setTimeout(handleResize, 300);

  // --- View Control (Presentation vs Dashboard) ---
  function setViewMode(mode) {
    state.viewMode = mode;
    if (mode === 'presentation') {
      presentationViewport.style.display = 'flex';
      dashboardViewport.style.display = 'none';
      document.querySelector('.navigation-bar').style.display = 'flex';
      toggleViewBtn.classList.remove('active');
      toggleViewBtn.innerHTML = `
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M4,4H20V12H4V4M4,14H11V20H4V14M13,14H20V20H13V14Z" />
        </svg>
        Dashboard <span class="badge">Esc</span>
      `;
      // Close draw mode and drawer when leaving dashboard just to be clean
      handleResize();
    } else {
      presentationViewport.style.display ='none';
      dashboardViewport.style.display = 'block';
      document.querySelector('.navigation-bar').style.display = 'none';
      toggleViewBtn.classList.add('active');
      toggleViewBtn.innerHTML = `
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M21,16V4H3V16H21M21,2H3C1.89,2 1,2.89 1,4V16C1,17.1 1.89,18 3,18H10V20H8V22H16V20H14V18H21C22.1,18 23,17.1 23,16V4C23,2.89 22.1,2 21,2Z" />
        </svg>
        View slide <span class="badge">Esc</span>
      `;
      // Render dashboard cards
      renderDashboard();
    }
  }

  toggleViewBtn.addEventListener('click', () => {
    setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
  });

  if (printPdfBtn) {
    printPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- Presenter Drawer Toggle ---
  toolsToggle.addEventListener('click', () => {
    state.drawerOpen = !state.drawerOpen;
    if (state.drawerOpen) {
      toolsDrawer.classList.add('open');
      toolsToggle.style.borderColor = 'var(--accent-cyan)';
    } else {
      toolsDrawer.classList.remove('open');
      toolsToggle.style.borderColor = '';
    }
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (state.drawerOpen && !toolsDrawer.contains(e.target) && !toolsToggle.contains(e.target)) {
      state.drawerOpen = false;
      toolsDrawer.classList.remove('open');
      toolsToggle.style.borderColor = '';
    }
  });

  // --- Theme Control (Dark/Light) ---
  function setTheme(theme) {
    state.theme = theme;
    document.body.setAttribute('data-theme', theme);
    if (theme === 'light') {
      themeToggle.classList.add('active');
      themeToggle.querySelector('.btn-text').textContent = '다크 모드 전환';
    } else {
      themeToggle.classList.remove('active');
      themeToggle.querySelector('.btn-text').textContent = '발표용 라이트 모드';
    }
  }

  themeToggle.addEventListener('click', () => {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // --- Slide Navigation Logic ---
  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;

    // Deactivate current slide
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx < index) {
        slide.classList.add('prev');
      }
    });

    state.currentSlide = index;
    slides[index].classList.add('active');

    // Update hash router
    window.location.hash = `slide-${index + 1}`;

    // Update Navigation UI
    const progressPercent = ((index + 1) / slides.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    slideProgressText.textContent = `${index + 1} / ${slides.length}`;

    // Disable boundary navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    // Reset drawing layer between slides to prevent annotations bleeding across slides
    clearCanvas();

    // Update Presenter Notes and Visual Guide in tools drawer
    const activeSlide = slides[index];
    const scriptEl = activeSlide.querySelector('.presenter-notes');
    const visualEl = activeSlide.querySelector('.visual-guide-notes');

    if (scriptDisplay) {
      scriptDisplay.textContent = scriptEl ? scriptEl.textContent.trim() : '발표자 대본이 작성되지 않았습니다.';
    }
    if (visualDisplay) {
      visualDisplay.textContent = visualEl ? visualEl.textContent.trim() : '시각화 가이드가 작성되지 않았습니다.';
    }
  }

  function nextSlide() {
    if (state.currentSlide < slides.length - 1) {
      showSlide(state.currentSlide + 1);
    }
  }

  function prevSlide() {
    if (state.currentSlide > 0) {
      showSlide(state.currentSlide - 1);
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // If typing in search box, ignore navigation hotkeys
    if (document.activeElement === searchInput) {
      if (e.key === 'Escape') {
        searchInput.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ': // Spacebar
        if (state.viewMode === 'presentation' && !state.isDrawing) {
          e.preventDefault();
          nextSlide();
        }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (state.viewMode === 'presentation' && !state.isDrawing) {
          e.preventDefault();
          prevSlide();
        }
        break;
      case 'Home':
        if (state.viewMode === 'presentation') {
          e.preventDefault();
          showSlide(0);
        }
        break;
      case 'End':
        if (state.viewMode === 'presentation') {
          e.preventDefault();
          showSlide(slides.length - 1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (state.isDrawing) {
          toggleDrawingMode(false);
        } else {
          setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
        }
        break;
      case 'd':
      case 'D':
        if (e.ctrlKey) {
          e.preventDefault();
          setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
        }
        break;
      case 'p':
      case 'P':
        // Ctrl+P is standard print, let's avoid overriding it if Ctrl is pressed
        if (!e.ctrlKey && state.viewMode === 'presentation') {
          e.preventDefault();
          toggleDrawingMode(!state.isDrawing);
        }
        break;
      case 't':
      case 'T':
        if (!e.ctrlKey) {
          e.preventDefault();
          toolsToggle.click();
        }
        break;
    }
  });

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // --- Hash Route Loading ---
  function parseHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (match) {
      const slideNum = parseInt(match[1], 10) - 1;
      if (slideNum >= 0 && slideNum < slides.length) {
        showSlide(slideNum);
        setViewMode('presentation');
        return;
      }
    }
    showSlide(0);
  }

  window.addEventListener('hashchange', parseHash);
  parseHash(); // Trigger on initial load

  // --- Drawing Board Logic (Instructor Pointer Pen) ---
  function toggleDrawingMode(active) {
    state.isDrawing = active;
    const canvasLayer = document.querySelector('.drawing-canvas-layer');
    const drawingIndicator = document.getElementById('drawing-indicator');

    if (active) {
      canvasLayer.classList.add('drawing-active');
      drawingToggle.classList.add('active');
      drawingToggle.querySelector('.btn-text').textContent = 'Turn off pointer pen (P)';
      drawingIndicator.style.display = 'block';
      isDrawingActive = true;
    } else {
      canvasLayer.classList.remove('drawing-active');
      drawingToggle.classList.remove('active');
      drawingToggle.querySelector('.btn-text').textContent = 'Turn on pointer pen (P)';
      drawingIndicator.style.display = 'none';
      isDrawingActive = false;
    }
  }

  drawingToggle.addEventListener('click', () => {
    toggleDrawingMode(!state.isDrawing);
  });

  function clearCanvas() {
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }

  clearDrawingBtn.addEventListener('click', clearCanvas);

  // Drawing event handlers
  let drawing = false;

  function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDrawing(e) {
    if (!isDrawingActive) return;
    drawing = true;
    const pos = getMousePos(drawingCanvas, e);
    [lastX, lastY] = [pos.x, pos.y];
  }

  function draw(e) {
    if (!drawing || !isDrawingActive) return;
    const pos = getMousePos(drawingCanvas, e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    [lastX, lastY] = [pos.x, pos.y];
  }

  function stopDrawing() {
    drawing = false;
  }

  drawingCanvas.addEventListener('mousedown', startDrawing);
  drawingCanvas.addEventListener('mousemove', draw);
  drawingCanvas.addEventListener('mouseup', stopDrawing);
  drawingCanvas.addEventListener('mouseout', stopDrawing);

  // --- Countdown Timer Logic ---
  function updateTimerDisplay() {
    const mins = Math.floor(state.timer.secondsLeft / 60);
    const secs = state.timer.secondsLeft % 60;
    const displayStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    timerDisplay.textContent = displayStr;

    if (state.timer.secondsLeft <= 30 && state.timer.secondsLeft > 0) {
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  }

  function startTimer() {
    if (state.timer.secondsLeft <= 0) return;

    state.timer.isRunning = true;
    timerStartBtn.classList.remove('active-play');
    timerStartBtn.classList.add('active-pause');
    timerStartBtn.textContent = 'pause';

    state.timer.intervalId = setInterval(() => {
      state.timer.secondsLeft--;
      updateTimerDisplay();

      if (state.timer.secondsLeft <= 0) {
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
        triggerTimerFlash();
        resetTimerUI();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(state.timer.intervalId);
    state.timer.isRunning = false;
    timerStartBtn.classList.remove('active-pause');
    timerStartBtn.classList.add('active-play');
    timerStartBtn.textContent = 'Timer starts';
  }

  function resetTimerUI() {
    timerStartBtn.classList.remove('active-pause');
    timerStartBtn.classList.add('active-play');
    timerStartBtn.textContent = 'Timer starts';
  }

  function triggerTimerFlash() {
    // Flash background for visual alarm
    flashScreen.style.display = 'block';

    // Play alert sound if user allowed audio context
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 800);
    } catch (err) {
      console.log('Audio Context not allowed or initialized yet.', err);
    }

    setTimeout(() => {
      flashScreen.style.display = 'none';
    }, 3000);
  }

  timerStartBtn.addEventListener('click', () => {
    if (state.timer.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  timerResetBtn.addEventListener('click', () => {
    clearInterval(state.timer.intervalId);
    state.timer.isRunning = false;
    state.timer.secondsLeft = 0;
    updateTimerDisplay();
    resetTimerUI();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.getAttribute('data-mins'), 10);
      clearInterval(state.timer.intervalId);
      state.timer.isRunning = false;
      state.timer.secondsLeft = mins * 60;
      updateTimerDisplay();
      resetTimerUI();
    });
  });

  updateTimerDisplay();

  // --- Copy Prompt Code Block Logic ---
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('copy-btn')) {
      const btn = e.target;
      const codeBlock = btn.closest('.code-container').querySelector('.code-block');
      const textToCopy = codeBlock.textContent.trim();

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copy complete!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  });

  // --- Dashboard Rendering and Filtering ---
  function renderDashboard(filterQuery = '') {
    cardsGrid.innerHTML = '';
    const lowercaseQuery = filterQuery.toLowerCase();
    let matchesCount = 0;

    slides.forEach((slide, idx) => {
      const titleEl = slide.querySelector('.slide-title');
      const categoryEl = slide.querySelector('.slide-category');
      const title = titleEl ? titleEl.textContent : 'slide';
      const category = categoryEl ? categoryEl.textContent : 'No distinction';

      // Get some description preview text from slide body
      let desc = '';
      const paragraphs = slide.querySelectorAll('.slide-body p, .slide-body li');
      if (paragraphs.length > 0) {
        desc = Array.from(paragraphs)
          .slice(0, 2)
          .map(p => p.textContent)
          .join(' ')
          .substring(0, 100) + '...';
      }

      // Check filters
      if (
        title.toLowerCase().includes(lowercaseQuery) ||
        category.toLowerCase().includes(lowercaseQuery) ||
        desc.toLowerCase().includes(lowercaseQuery)
      ) {
        matchesCount++;
        const card = document.createElement('div');
        card.className = 'dashboard-card';
        card.setAttribute('data-index', idx);

        // Inherit session class from slide
        const sessionClass = Array.from(slide.classList).find(c => c.startsWith('session-'));
        if (sessionClass) {
          card.classList.add(sessionClass);
        }

        // Pick badge day color based on category/meta
        const dayBadgeEl = slide.querySelector('.day-badge');
        const dayTextFromHtml = dayBadgeEl ? dayBadgeEl.textContent.trim() : '';
        const isDay1 = dayTextFromHtml.includes('Day 1') || category.includes('Day 1');
        const dayText = isDay1 ? 'Day 1' : 'Day 2';

        card.innerHTML = `
          <div class="card-num">
            <span>Slide ${idx + 1}</span>
            <span class="card-tag" style="background:${isDay1 ? 'rgba(157,78,221,0.15)' : 'rgba(79,70,229,0.15)'};color:${isDay1 ? 'var(--accent-purple)' : 'var(--accent-blue)'}">${dayText}</span>
          </div>
          <div class="card-title">${title}</div>
          <div class="card-desc">${desc}</div>
          <div class="card-tags">
            <span class="card-tag">${category}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          setViewMode('presentation');
          showSlide(idx);
        });

        cardsGrid.appendChild(card);
      }
    });

    if (matchesCount === 0) {
      cardsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
          There are no slides matching your search results.
        </div>`;
    }
  }

  // Hook up search filter event listener
  searchInput.addEventListener('input', (e) => {
    renderDashboard(e.target.value);
  });

  // --- Session 1 Practice Tabs Logic ---
  const practiceData = {
    1: {
      label: "customer mail",
      situation: "Responding to customer emails regarding delivery delays and refund requests",
      data: `"The product I ordered last week has not yet been delivered. They said it would be delivered in 2-3 days, but it's been a week. Please refund."`,
      prompts: [
        "Reply to customer complaint emails.",
        "You are a friendly customer support representative. Reply to customer complaint emails.",
        "Analyze customer complaint emails and draft a response by dividing them into the cause of the complaint, an apology sentence, a solution, and follow-up actions."
      ]
    },
    2: {
      label: "meeting minutes",
      situation: "Summary of raw meeting minutes with a mix of departmental discussions",
      data: `Design Team: The main UI draft has been released, but the logo position needs to be modified.\nMarketing Team: Promotion scheduled for next Tuesday. Request for budget approval of 5 million won.\nDevelopment team: Login API integration completed, test server deployment possible by this Friday.`,
      prompts: [
        "Please summarize the minutes of this meeting.",
        "You are a meticulous project manager (PM). Please summarize the minutes of this meeting.",
        "From the meeting minutes, classify decisions, action items by department (including person in charge, deadline), and schedule for the next meeting, and organize them in a structured table format."
      ]
    },
    3: {
      label: "source code",
      situation: "Analyzing inefficient code that has bugs or needs refactoring",
      data: `function calculateTotal(items) {\n var total = 0;\n for (var i = 0; i < items.length; i++) {\n total = total + items[i].price;\n }\n return total;\n}\n// An error may occur when an empty array is passed or items are undefined.`,
      prompts: [
        "Please fix this code error.",
        "You are a senior software engineer and code reviewer with 10 years of experience. Please find errors in this code and suggest improvements.",
        "Divide the syntax error causes, performance improvements, refactored safe code, and code operation test cases of the given code and output them in JSON format."
      ]
    },
    4: {
      label: "sales data",
      situation: "Establish marketing strategies based on raw sales data",
      data: `Sales status in the first half of 2026 - January: KRW 12 million (opening effect) | February: 15 million won | March: KRW 9.8 million (seasonal factors) | April: 8 million won (entry to competitors) | May: KRW 11 million (Family Month Promotion) | June: 7.5 million won (rainy season and logistics delays)`,
      prompts: [
        "Please analyze this sales data.",
        "You are a data analyst and marketing strategist. Analyze this sales data and come up with a strategy.",
        "Based on the data, identify three items of rapid decline/increase in sales, cause analysis (hypothesis), and target marketing action plan, and write them in a report format (including table of contents)."
      ]
    },
    5: {
      label: "marketing phrases",
      situation: "Writing multi-channel promotional copy for new product launch",
      data: `New product: AI-based customized prompt creation/management platform 'Antigravity'\nTarget audience: Office workers in their 20s and 30s who want to increase work efficiency\nCore features: Provision of work templates, one-click copy, collaborative storage`,
      prompts: [
        "Write a marketing text for a new product.",
        "You are a creative copywriter. Write a marketing text for a new product.",
        "Organize the core value appeals of the product according to the target audience (2030 office workers), and write them separately with a tone and manner that suits each channel (Instagram short form, blog informational post, email newsletter)."
      ]
    }
  };

  // --- Session 2 Practice Tabs Data ---
  const practiceData2 = {
    1: {
      situation: "Created a notice for the launch of 'Antigravity', an AI-based customized prompt creation/management platform",
      personas: [
        "Friendly customer support agents (email focused on customer benefits)",
        "Logical service planner (technical specification-oriented specifications)",
        "Industry Expert (Market Analysis and Trends Column)"
      ],
      titles: [
        "Persona A: Counselor / Empathic",
        "Persona B: Planner / Logical type",
        "Persona C: Expert/Trend type"
      ],
      prompts: [
`Role: Customer Advisor
Instruction: Write a notice for new service launch
Context: Target marketer, use soft and friendly tone
Output: Email body format focusing on customer benefits`,
`Role: Service Planner
Instruction: Write a notice for new service launch
Context: Emphasize professional and logical technical details and advantages
Output: Markdown table and function description document format`,
`Role: IT trend analysis expert
Instruction: New service launch background and industrial impact column writing
Context: Market change flow (LLM/Agent) contrast, analytical and authoritative tone
Output: 1 title, 3-part composition of introduction, body, and conclusion (within 1,000 characters)`
      ]
    },
    2: {
      situation: "Prepare response plans and responses to claims of delayed delivery and damage",
      personas: [
        "Empathetic CS manager (emotional empathy and apology email)",
        "Legal and Compliance Advisor (Guidance on Scope of Liability and Compensation)",
        "CS general manager (suggesting coupons and resending alternatives)"
      ],
      titles: [
        "Persona A: CS Manager / Empathic",
        "Persona B: Legal Counsel / Compliance",
        "Persona C: CS Manager / Presentation of alternatives"
      ],
      prompts: [
`Role: Emotionally empathetic CS manager
Instruction: Write an apology email to customers with delayed delivery
Context: One week delay, actively empathizing with the customer's disappointment, including comforting words
Output: Emotional and polite apology format`,
`Role: Corporate Legal and Compliance Advisor
Instruction: Write a notice on the scope of compensation for delayed delivery
Context: Based on Article 12 (Indemnification) and Article 15 (Compensation) of the Terms of Use, for the purpose of preventing legal disputes
Output: Objective and clear compensation limit explanation`,
`Role: CS General Manager
Instruction: Write a compensation proposal email to recover customers with delayed delivery
Context: Coupon payment (10,000 won bill) and resending processing proposal, priority to prevent customer churn
Output: Structured email detailing business compromises and alternatives.`
      ]
    },
    3: {
      situation: "Create an explanation manual for the 'One-click prompt optimization' feature",
      personas: [
        "Beginner Tailored Prompt Instructor (Non-Equity Guide)",
        "Senior AI System Engineer (Algorithm and Architecture Specification)",
        "B2B Technical Sales Team Leader (Improved Productivity and Reduced Costs)"
      ],
      titles: [
        "Persona A: Prompt Tutor / Beginner Edition",
        "Persona B: For AI engineers/developers",
        "Persona C: Technical Sales/Business"
      ],
      prompts: [
`Role: Beginner customized prompt instructor
Instruction: Create a manual for the 'One-click prompt optimization' function
Context: For planning/marketing non-majors who are new to AI, using metaphors and examples
Output: Friendly colloquial, step-by-step instructional guide`,
`Role: Senior AI System Engineer
Instruction: Create a functional architecture guide for 'One-click prompt optimization'
Context: For developers and system operators, describing algorithms and data flows
Output: Technical specification statement and API parameter structure (JSON, etc.)`,
`Role: B2B technical sales team leader
Instruction: Write a proposal to introduce 'one-click prompt optimization'
Context: Targeting corporate purchasing decision makers, emphasizing cost-effectiveness, including 40% increase in work productivity
Output: ROI-focused summary report format`
      ]
    },
    4: {
      situation: "Create a notice on personal information and source code security rules when using in-house AI tools",
      personas: [
        "Human Resources Team/Organizational Culture Manager (Notice of request for friendly cooperation)",
        "Chief Information Security Officer CISO (Disciplinary and Control Regulations Official Document)",
        "Development part leader (tips and alternatives for developer practical use)"
      ],
      titles: [
        "Persona A: Human Resources Team / Organizational Culture",
        "Persona B: CISO / Information Security",
        "Persona C: Development Part Manager / Development Practice"
      ],
      prompts: [
`Role: Friendly company culture manager
Instruction: Create a message guiding security rules using in-house AI
Context: For all executives and employees, gentle invitation and request for cooperation, light tone and manner
Output: In the form of an internal messenger notice (active use of emojis)`,
`Role: Strict Chief Information Security Officer (CISO)
Instruction: Create notice of in-house AI tool use regulations and actions taken in case of violation
Context: Mention of provision for referral to security disciplinary committee in case of violation, for strict control purpose
Output: Official document format, bullet list focusing on principles and prohibitions`,
`Role: Development manager who values practical efficiency
Instruction: Create guidelines for safe use of AI tools
Context: Provides practical tips (such as using local models) to avoid source code leakage while maintaining practical efficiency.
Output: Developer customized quick-tip guide format`
      ]
    },
    5: {
      situation: "Write a 1-page summary of a new platform business business plan",
      personas: [
        "Passionate startup entrepreneur (story-driven pitch script)",
        "A strict VC reviewer (figures and investment feasibility opinion)",
        "Global trend analyst (analyzing macro market changes)"
      ],
      titles: [
        "Persona A: Entrepreneur / Pitch Script",
        "Persona B: VC reviewer / feasibility analysis",
        "Persona C: Analyst / Market Forecast"
      ],
      prompts: [
`Role: Passionate technology startup entrepreneur
Instruction: Write a 1-minute pitch and summary for investor meetings
Context: Vision to change the world, motivation for starting a business, and appeal for the value of the problem to be solved
Output: Storytelling pitch script (speech tone)`,
`Role: Strict venture capital (VC) chief reviewer
Instruction: Summary of the investment feasibility review opinion for the business plan
Context: Verification of data on market size (TAM-SAM-SOM), revenue model (LTV/CAC), and superiority over competitors
Output: Summary table focusing on numbers and risk analysis`,
`Role: Macroeconomic and industry trend analyst
Instruction: Create a market trend and growth analysis report for the platform business
Context: Analysis of global platform trend changes and market dominance prospects
Output: Professional report draft format`
      ]
    }
  };

  // --- Session 3 Practice Tabs Data ---
  const practiceData3 = {
    1: {
      situation: "Convert original text of regular meeting minutes to tables, bullets, and JSON",
      step1: "Column: Classification, content, person in charge, deadline",
      step2: "Summary of key points",
      step3: "Output as Decisions and Tasks array structure",
      raw: `At the regular meeting in May, the schedule for promoting new educational programs was discussed.
Kim Min-ji decided to draft the promotional text by this Friday.
The landing page modifications will be completed by Park Jun-ho by next Tuesday.
It was decided to review the budget in the direction of increasing it by 10%.
Student recruitment notices will be sent out next Wednesday morning.
In addition, Seoyeon Lee decided to organize the education satisfaction survey questions.`,
      schema: `{
  "decisions": ["decisions"],
  "tasks": [
    { "task": "to do", "owner": "person in charge", "due_date": "due date" }
  ]
}`
    },
    2: {
      situation: "Structure key issues, inquiries, and follow-up actions from customer call transcript text",
      step1: "Column: Classification, key contents, department/person in charge, processing status",
      step2: "Detailed summary and severity classification of customer claims",
      step3: "Output in the form of customer_issue and action objects",
      raw: `"This is Ji-eun Lee from the customer support team. We received a complaint that the power button of the product purchased yesterday (order number: A-9023) does not work. I checked over the phone and it said that the light only turns on when the charging cable is connected and does not normally turn on. Since it is a free exchange, we covered the round-trip shipping cost at our expense and scheduled delivery of the new product until the day after tomorrow. The customer wanted quick delivery, so we submitted it via post office delivery."`,
      schema: `{
  "customer_issue": {
    "order_number": "Order number",
    "symptom": "symptom description",
    "is_warranty": true
  },
  "action": {
    "type": "Free exchange and reshipment",
    "carrier": "Post office delivery",
    "estimated_ship_date": "the day after tomorrow"
  }
}`
    },
    3: {
      situation: "Refining free-form development bug reports into data for system registration",
      step1: "Column: Bug location, occurrence phenomenon, reproduction conditions, deadline",
      step2: "Summary of causes and emergency action guide",
      step3: "Output in the form of bug_report and debugging objects",
      raw: `"When you press the Kakao Pay payment button on the payment screen, the screen freezes and a 502 error appears. Assistant Manager Choi Young-soo of the development team reproduced it and it only occurred in the Safari browser, but the payment worked fine in Chrome. After checking the API server log, a timeout was occurring in the payment callback URL. This problem must be completed with an emergency patch before the service opens this Thursday."`,
      schema: `{
  "bug_report": {
    "feature": "Kakao Pay payment",
    "error_code": "502 Bad Gateway",
    "environment": "Safari Browser"
  },
  "debugging": {
    "root_cause": "Payment callback URL timeout",
    "assignee": "Choi Young-soo",
    "priority": "Critical",
    "due_date": "This Thursday"
  }
}`
    },
    4: {
      situation: "Extract price, Bluetooth/battery specifications, pros and cons from manual and promotional text",
      step1: "Column: Specification items, detailed specifications, satisfaction, remarks",
      step2: "Summary of headphone strengths and major points of improvement",
      step3: "Output as product_name, price, specs, review objects",
      raw: `"The newly released noise-cancelling headphones 'SoundClear V2' are priced at 299,000 won. They support Bluetooth 5.3 and the battery lasts up to 40 hours. The strengths are excellent low-range sound quality and the soft memory foam ear pads make them comfortable to wear for long periods of time. However, the drawbacks are that the dedicated pouch is bulkier than expected and the charging cable is too short at 30cm."`,
      schema: `{
  "product_name": "SoundClear V2",
  "price": 299000,
  "specs": {
    "bluetooth_version": "5.3",
    "battery_life": "40 hours"
  },
  "review": {
    "pros": ["Excellent sound quality in the low range", "Comfortable to wear"],
    "cons": ["Pouch too bulky", "Cable too short"]
  }
}`
    },
    5: {
      situation: "Refining text information for in-house executives and employees' request for desired books and budget settlement",
      step1: "Column: Order number, book name, publisher, book price, applicant, application date",
      step2: "Summary of total quantity of desired books and total approved budget",
      step3: "Output purchase_status and books array structure",
      raw: `"This is the status of requests for desired books this month. Assistant Manager Ha-eun Kim applied for 'Rust Programming Guide (Hanbit Media, 32,000 won)' on June 5, and Manager Dong-hoon Choi applied for 'Management Strategy in the AI Era (Gilbut, 22,000 won)' on June 8. Both books were approved as they are within the library budget, and we plan to complete the in-house display by next Friday after purchasing the books."`,
      schema: `{
  "purchase_status": {
    "approval_date": "June 5-8",
    "display_due_date": "Next Friday"
  },
  "books": [
    {
      "title": "Rust Programming Guide",
      "publisher": "Hanbit Media",
      "price": 32000,
      "applicant": "Kim Ha-eun"
    },
    {
      "title": "Management Strategy in the AI Era",
      "publisher": "Gilbut",
      "price": 22000,
      "applicant": "Choi Dong-hoon"
    }
  ]
}`
    }
  };

  function updatePracticeSetSession1(setId) {
    const selected = practiceData[setId];
    if (!selected) return;

    // Update Slide 8
    const s8Sit = document.getElementById('slide8-situation-text');
    const s8Lab = document.getElementById('slide8-label-text');
    const s8Data = document.getElementById('slide8-data-block');
    if (s8Sit) s8Sit.textContent = selected.situation;
    if (s8Lab) s8Lab.textContent = selected.label;
    if (s8Data) s8Data.textContent = selected.data;

    // Update Slide 9
    const s9P1 = document.getElementById('slide9-prompt-1');
    const s9P2 = document.getElementById('slide9-prompt-2');
    const s9P3 = document.getElementById('slide9-prompt-3');
    if (s9P1) s9P1.textContent = selected.prompts[0];
    if (s9P2) s9P2.textContent = selected.prompts[1];
    if (s9P3) s9P3.textContent = selected.prompts[2];

    // Sync active tabs on screen for session 1
    document.querySelectorAll('.session-1 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updatePracticeSetSession2(setId) {
    const selected = practiceData2[setId];
    if (!selected) return;

    // Update Slide 18
    const s18Sit = document.getElementById('slide18-situation-text');
    const s18PA = document.getElementById('slide18-persona-a-desc');
    const s18PB = document.getElementById('slide18-persona-b-desc');
    const s18PC = document.getElementById('slide18-persona-c-desc');
    if (s18Sit) s18Sit.textContent = selected.situation;
    if (s18PA) s18PA.textContent = selected.personas[0];
    if (s18PB) s18PB.textContent = selected.personas[1];
    if (s18PC) s18PC.textContent = selected.personas[2];

    // Update Slide 19
    const s19TA = document.getElementById('slide19-title-a');
    const s19TB = document.getElementById('slide19-title-b');
    const s19TC = document.getElementById('slide19-title-c');
    const s19PA = document.getElementById('slide19-persona-a');
    const s19PB = document.getElementById('slide19-persona-b');
    const s19PC = document.getElementById('slide19-persona-c');
    
    if (s19TA) s19TA.textContent = selected.titles[0];
    if (s19TB) s19TB.textContent = selected.titles[1];
    if (s19TC) s19TC.textContent = selected.titles[2];
    if (s19PA) s19PA.textContent = selected.prompts[0];
    if (s19PB) s19PB.textContent = selected.prompts[1];
    if (s19PC) s19PC.textContent = selected.prompts[2];

    // Sync active tabs on screen for session 2
    document.querySelectorAll('.session-2 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updatePracticeSetSession3(setId) {
    const selected = practiceData3[setId];
    if (!selected) return;

    // Update Slide 29
    const s29Sit = document.getElementById('slide29-situation-text');
    const s29S1 = document.getElementById('slide29-step1');
    const s29S2 = document.getElementById('slide29-step2');
    const s29S3 = document.getElementById('slide29-step3');
    if (s29Sit) s29Sit.textContent = selected.situation;
    if (s29S1) s29S1.textContent = selected.step1;
    if (s29S2) s29S2.textContent = selected.step2;
    if (s29S3) s29S3.textContent = selected.step3;

    // Update Slide 30
    const s30Raw = document.getElementById('slide30-raw-text');
    const s30Schema = document.getElementById('slide30-schema-text');
    if (s30Raw) s30Raw.textContent = selected.raw;
    if (s30Schema) s30Schema.textContent = selected.schema;

    // Sync active tabs on screen for session 3
    document.querySelectorAll('.session-3 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Session 4 Practice Tabs Data ---
  const practiceData4 = {
    1: {
      situation: "Establish an action plan by chaining a 3-step workflow based on regular meeting minutes",
      row1: { purpose: "Meeting minutes summary", desc: "200-character summary of key points", output: "Bullet Point" },
      row2: { purpose: "Extract key issues", desc: "Identify problems and delays", output: "JSON schema" },
      row3: { purpose: "Create action item", desc: "Establish action plans for each issue", output: "Markdown table" }
    },
    2: {
      situation: "Analyze sentiment from customer consultation history, identify problem causes, and establish final customer care actions",
      row1: { purpose: "Consultation Summary and Appraisal", desc: "Determine level of anger/dissatisfaction and summarize in 100 characters", output: "Text + Sentiment" },
      row2: { purpose: "Determine the root cause", desc: "Classification of factors among products/delivery/services", output: "JSON schema" },
      row3: { purpose: "Create a care plan", desc: "Customized compensation and customer aftercare guide", output: "Bullet Point" }
    },
    3: {
      situation: "Structural diagnosis, refactoring, and final unit test scenario design of legacy code",
      row1: { purpose: "Structural Problem Diagnosis", desc: "Summary of bottlenecks/memory leaks/readability issues", output: "Bullet Point" },
      row2: { purpose: "Code refactoring", desc: "Write optimized code to maximize readability and efficiency", output: "Refactored Code" },
      row3: { purpose: "Write a test scenario", desc: "Derivation of normal/boundary/error condition cases", output: "JSON schema" }
    },
    4: {
      situation: "Define new product ideas, extract competitive advantage points (USP), and create final SNS copy schedule",
      row1: { purpose: "Summary of planning ideas", desc: "150 character summary of product features and target audience", output: "Bullet Point" },
      row2: { purpose: "USP 3 types of extraction", desc: "Quantifying 3 differentiating points compared to competitors", output: "JSON schema" },
      row3: { purpose: "Create ad copy", desc: "Create target advertising text for each channel such as Instagram/blog", output: "Markdown table" }
    },
    5: {
      situation: "Business plan summary, expected sales model and risk analysis, final investor speech script creation",
      row1: { purpose: "Business Executive Summary", desc: "Problem Definition and Solution 200-character summary", output: "Bullet Point" },
      row2: { purpose: "risk analysis", desc: "Identifying financial/market competitive risk factors", output: "JSON schema" },
      row3: { purpose: "Write a pitch script", desc: "Write a storytelling script for a speech in about 1 minute", output: "Text script" }
    }
  };

  // --- Session 5 Practice Tabs Data ---
  const practiceData5 = {
    1: {
      situation: "Categorize the data from the five customer reviews provided, complete with a table with reasons for your judgment and follow-up actions.",
      samples: [
        "I liked that the lecture content could be applied directly to practice.",
        "Payment was made twice due to an error on the application page. Please check.",
        "When is the next training session held?",
        "The instructor's explanation was good, but the practice time was a bit lacking. (composite)",
        "The resource download link does not open."
      ],
      prompt: `Are you a review analysis expert? Classify the given reviews according to the criteria below.

Classification criteria:
- Affirmation: satisfaction, praise
- Fraud: Complaints, errors, payment failures
- Inquiry: Schedule, procedure request

Exception rules:
- If positive and negative are mixed, it is classified as "negative."
- If the information is ambiguous, classify it as "additional confirmation required."

Output format:
Review: [Original article]
Classification: [Classification result]
Reason: [Judgment basis]`
    },
    2: {
      situation: "Automatically evaluates and assigns the urgency and responsible department of email inquiries to the in-house system.",
      samples: [
        "The login function for the version released today does not work. Please check it out quickly!",
        "What is the process for adding a developer account? Please guide me.",
        "Does anyone know the location of the archive folder for last week's regular meeting materials?",
        "Intermittent screen flickering has been reported when logging into mobile apps.",
        "The office will be deep cleaned this Friday, so please organize your personal belongings."
      ],
      prompt: `You are an IT service desk agent. Classify incoming emails as urgent according to the criteria below.

Classification criteria:
- Urgent failure: core function fails, multiple users fail
- General requests: account creation, permission request, manual inquiry
- Simple notice: Informational such as general event notice, archiving, etc.

Exception rules:
- If it is difficult to determine whether it is a disability or a request, classify it as a "general request" first.
- Security-related emergency requests are treated as equivalent to "emergency failures."

Output format:
Mail: [original text]
Classification: [Classification result]
Reason: [Judgment basis]`
    },
    3: {
      situation: "Automatically determines the severity of system issue reports and classifies the type of follow-up action.",
      samples: [
        "The API key is not encrypted in the payment module and is being exposed in logs.",
        "The right margin of the main page logo image file is offset by 5px.",
        "If you scroll all the way down on the product detail page, it intermittently falls into an infinite loading loop.",
        "When clicking the button to change the quantity of products in the shopping cart, the response time takes more than 2 seconds.",
        "It would be nice to change the design of the password re-confirmation pop-up for the membership withdrawal function to a more modern one."
      ],
      prompt: `You are a software QA engineer and issue tracker. Please classify bug reports according to the criteria below.

Classification criteria:
- Security: Risk of data exposure and privilege theft
- Bug: Function not working, error code generated, loop
- Suggestions (Enhancement): Design changes, simple improvement suggestions

Exception rules:
- If bugs and improvement suggestions are mixed, they will be upgraded to "Bug."
- If the recall rate is not specified, write "additional analysis required" as the reason.

Output format:
Issue: [original text]
Classification: [Classification result]
Reason: [Judgment basis]`
    },
    4: {
      situation: "After marketing promotion, lead level is determined based on customer feedback and purchase intention.",
      samples: [
        "Please send us your price proposal by email and we will review it internally and contact you within the week.",
        "The functionality is interesting, but it doesn't seem to fit within our current budget. I'll contact you later.",
        "I have completed the platform registration process. Can you hold a session on how to actually use the template?",
        "I'm curious about the conditions for unlocking the free trial version's feature restrictions and the annual subscription discount.",
        "I just came across it while searching on the internet and gave it a try. It's useful."
      ],
      prompt: `You are a B2B marketing lead analyst. Analyze customer messages according to the criteria below.

Classification criteria:
- Hot Lead: Immediate purchase intention, quotation and discount inquiry, meeting request
- Warm Lead: Questions about how to use features, need to adjust budget, free trial
- Cold Lead: Simple light evaluation, lack of interest

Exception rules:
- If there is a lack of budget but a specific product inquiry is made, it is classified as a "Warm Lead".
- If you are trying to schedule a meeting, always upgrade to "Hot Lead."

Output format:
Message: [sic]
Classification: [Classification result]
Reason: [Judgment basis]`
    },
    5: {
      situation: "Reads in-house expense receipt history and quarterly processes expense eligibility and approval guides.",
      samples: [
        "I spent 12,000 won for overtime work and attached the corporate card receipt.",
        "I spent 45,000 won to purchase a gift for a business partner and attached a simple receipt.",
        "In order to purchase refreshments in the office bathroom, 89,000 won was spent using a corporate card and a link to the courtesy form was attached.",
        "I spent 55,000 won on books for my personal collection and wrote a spending resolution.",
        "A 27,000 won personal credit card receipt for a train ticket to attend the seminar and a statement explaining the loss of the receipt are attached."
      ],
      prompt: `You are the in-house financial and audit auditor. Review the expenditure details for approval according to the regulations below.

Classification criteria:
- Approved: Expenditure within regulations, eligible receipts attached.
- Pending (Supplementary): Replacement of simple receipt, additional review of explanation required.
- Rejected: Suspicious personal spending, exceeding or violating regulatory limits

Exception rules:
- Expenditures where the simple receipt claim amount exceeds 30,000 won will be treated as "Rejected".
- If the explanation is insufficient, classify it as "Pending" and request supplementation.

Output format:
Expenses: [sic]
Classification: [Classification result]
Reason: [Judgment basis]`
    }
  };

  // --- Session 6 Practice Tabs Data ---
  const practiceData6 = {
    1: {
      situation: "Designed to automate inquiry reception, sentiment analysis, automatic department assignment, and draft sending",
      candidates: [
        { name: "Sorting and drafting customer inquiry emails", rep: 5, rul: 4, dat: 5, tot: "14 (selected)" },
        { name: "Deriving creative design ideas", rep: 3, rul: 1, dat: 2, tot: "6 (eliminated)" },
        { name: "Summary of weekly sales reporting data collection", rep: 4, rul: 5, dat: 5, tot: "14 (candidate)" }
      ],
      design: `# AI agent design (Set 1: CS automatic response)
1. Project name: CS automatic response and ticket issuing bot
2. Problem definition: Accumulation of customer complaints due to manual classification and delay in action
3. Input data: email body, bulletin board customer inquiry text
4. Processing steps (Workflow):
   - Step 1: 3-sentence summary and anger/general emotion analysis
   - Step 2: Assignment to responsible department for cause and resolution of complaint (JSON)
   - Step 3: Draft ticket information and temporary response for departmental delivery
5. Conditional branching: If the negative sentiment is "very high," send an emergency notification (Slack) to the relevant department.
6. Persona: Sophisticated CS planning department leader who prioritizes customer satisfaction`
    },
    2: {
      situation: "Real-time transcription translation, departmental to-do extraction (JSON), and collaboration tool integration design",
      candidates: [
        { name: "Multilingual translation of Zoom transcripts and to-do extraction linked", rep: 5, rul: 5, dat: 4, tot: "14 (selected)" },
        { name: "Planning of in-house year-end networking event program", rep: 3, rul: 2, dat: 2, tot: "7 (eliminated)" },
        { name: "New employee 4-week onboarding training schedule scheduler", rep: 4, rul: 4, dat: 5, tot: "13 (candidate)" }
      ],
      design: `# AI Agent Design (Set 2: Meeting Minutes Translation and Tracker)
1. Project name: Automatic translation of multilingual meeting minutes and to-do tracker
2. Problem definition: Work bottlenecks due to manual summarization and delay in task allocation after global meetings.
3. Input data: Zoom or MS Teams speech-activated text (STT)
4. Processing steps (Workflow):
   - Step 1: 10-line summary of key decisions in the meeting minutes and translation into Korean
   - Step 2: Extract tasks and deadlines for each department based on decisions (JSON)
   - Step 3: Create payload for Jira/Notion API transmission of to-do information
5. Conditional branch: When the keyword 'emergency patch' is included, a P0 rating is notified to the development team's main channel.
6. Persona: A logical and thorough senior PM who coordinates global projects.`
    },
    3: {
      situation: "Git PR source code vulnerability and syntax error inspection, refactoring feedback automation design",
      candidates: [
        { name: "Code security/bug static checking when Git PR occurs", rep: 5, rul: 5, dat: 5, tot: "15 (selected)" },
        { name: "Selection of new product branding logo design font", rep: 2, rul: 1, dat: 2, tot: "5 (eliminated)" },
        { name: "Markdown formatting of in-house wiki technical blog documents", rep: 4, rul: 4, dat: 4, tot: "12 (candidate)" }
      ],
      design: `# AI Agent Design (Set 3: PR Automatic Code Reviewer)
1. Project Name: PR Automatic Code Reviewer and Bug Checker
2. Problem definition: Risk of release delay and distribution of security vulnerabilities due to accumulation of code review time by development team
3. Input data: Git Diff source code text file
4. Processing steps (Workflow):
   - Step 1: Initial inspection for security vulnerabilities such as syntax errors and hard-coded API keys
   - Step 2: Derive a plan to improve code convention violations and inefficient repetitive loops (JSON)
   - Step 3: Write refactored optimized code and PR feedback comments
5. Conditional branching: Merge blocking and warning labeling when a security vulnerability (Critical) is discovered
6. Persona: Meticulous and straightforward senior system developer with more than 10 years of experience`
    },
    4: {
      situation: "Price data comparison monitoring, automatic creation of promotional copies",
      candidates: [
        { name: "Dawn competitor price monitoring and real-time ad copy optimization", rep: 4, rul: 5, dat: 5, tot: "14 (selected)" },
        { name: "New Year promotional event gift packaging box color selection", rep: 2, rul: 1, dat: 1, tot: "4 (eliminated)" },
        { name: "Drafting the body of a regular customer email newsletter", rep: 4, rul: 4, dat: 4, tot: "12 (candidate)" }
      ],
      design: `# AI Agent Blueprint (Set 4: Real-time Marketing Copy Generator)
1. Project name: Competitor price analysis and real-time marketing copy generator
2. Problem definition: Delay in promotion planning and multi-channel copy writing to quickly respond to competitors' price changes
3. Input data: Competitor product price crawling text, our cost data
4. Processing steps (Workflow):
   - Step 1: Analyzing our price competitiveness compared to competitors and suggesting optimal adjustment price
   - Step 2: Create promotional phrases and core value appeals tailored to target customers
   - Step 3: Create customized copy for each channel for Instagram, blog, and email
5. Conditional branch: If our margin rate falls below 15%, price adjustment will be suspended and staff will be warned.
6. Persona: Creative performance marketing team leader who makes data-based decisions`
    },
    5: {
      situation: "Receipt OCR precision matching, in-house compliance screening, and automation design for writing rejection reasons",
      candidates: [
        { name: "Verification of expenditure resolution receipt text and regulatory eligibility", rep: 5, rul: 5, dat: 5, tot: "15 (selected)" },
        { name: "Write a review of a marketing book for each employee to own", rep: 2, rul: 1, dat: 2, tot: "5 (eliminated)" },
        { name: "Approval for purchase of desired books within monthly book budget", rep: 4, rul: 4, dat: 5, tot: "13 (candidate)" }
      ],
      design: `# AI Agent Blueprint (Set 5: Automated Spending Eligibility Check Bot)
1. Project name: Automatic inspection bot for in-house expenditure resolution eligibility
2. Problem definition: Overload of finance team and delay in settlement due to manual review of expenditure documents
3. Input data: expenditure resolution items, card receipt OCR text
4. Processing steps (Workflow):
   - Step 1: Extract receipt date, amount, and affiliated store information and compare receipt authenticity
   - Step 2: Verification of compliance with company spending regulations (overtime meal limit, etc.) (JSON)
   - Step 3: Report the review results (Approved/Pending/Rejected) and write a letter of reason for rejection
5. Conditional quarter: If the simple receipt amount exceeds 30,000 won or a violation of regulations is discovered, an immediate 'Rejected' and email is sent.
6. Persona: Chief accountant of the financial audit team who strictly complies with regulations and makes no mistakes.`
    }
  };

  function updatePracticeSetSession4(setId) {
    const selected = practiceData4[setId];
    if (!selected) return;

    // Update Slide 40
    const s40Sit = document.getElementById('slide40-situation-text');
    if (s40Sit) s40Sit.textContent = selected.situation;

    // Update Slide 41
    const s41R1P = document.getElementById('slide41-row1-purpose');
    const s41R1D = document.getElementById('slide41-row1-desc');
    const s41R1O = document.getElementById('slide41-row1-output');
    const s41R2P = document.getElementById('slide41-row2-purpose');
    const s41R2D = document.getElementById('slide41-row2-desc');
    const s41R2O = document.getElementById('slide41-row2-output');
    const s41R3P = document.getElementById('slide41-row3-purpose');
    const s41R3D = document.getElementById('slide41-row3-desc');
    const s41R3O = document.getElementById('slide41-row3-output');

    if (s41R1P) s41R1P.textContent = selected.row1.purpose;
    if (s41R1D) s41R1D.textContent = selected.row1.desc;
    if (s41R1O) s41R1O.textContent = selected.row1.output;
    if (s41R2P) s41R2P.textContent = selected.row2.purpose;
    if (s41R2D) s41R2D.textContent = selected.row2.desc;
    if (s41R2O) s41R2O.textContent = selected.row2.output;
    if (s41R3P) s41R3P.textContent = selected.row3.purpose;
    if (s41R3D) s41R3D.textContent = selected.row3.desc;
    if (s41R3O) s41R3O.textContent = selected.row3.output;

    // Sync active tabs on screen for session 4
    document.querySelectorAll('.session-4 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Toggle visibility of the sample boxes for Session 4
    const s40SampleBox1 = document.getElementById('slide40-sample-box-1');
    const s40SampleBox4 = document.getElementById('slide40-sample-box-4');

    if (s40SampleBox1) {
      s40SampleBox1.style.display = (setId === 1) ? 'block' : 'none';
    }
    if (s40SampleBox4) {
      s40SampleBox4.style.display = (setId === 4) ? 'block' : 'none';
    }
  }

  function updatePracticeSetSession5(setId) {
    const selected = practiceData5[setId];
    if (!selected) return;

    // Update Slide 52
    const s52Sit = document.getElementById('slide52-situation-text');
    if (s52Sit) s52Sit.textContent = selected.situation;

    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById(`slide52-sample-${i}`);
      if (el) el.textContent = selected.samples[i - 1];
    }

    // Update Slide 53
    const s53Prompt = document.getElementById('slide53-prompt-text');
    if (s53Prompt) s53Prompt.textContent = selected.prompt;

    // Sync active tabs on screen for session 5
    document.querySelectorAll('.session-5 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updatePracticeSetSession6(setId) {
    const selected = practiceData6[setId];
    if (!selected) return;

    // Update Slide 60
    const s60Design = document.getElementById('slide60-design-text');
    if (s60Design) s60Design.textContent = selected.design;

    // Update Slide 61
    const s61Sit = document.getElementById('slide61-situation-text');
    if (s61Sit) s61Sit.textContent = selected.situation;

    // Update Slide 62
    for (let i = 1; i <= 3; i++) {
      const rowName = document.getElementById(`slide62-row${i}-name`);
      const rowRep = document.getElementById(`slide62-row${i}-rep`);
      const rowRul = document.getElementById(`slide62-row${i}-rul`);
      const rowDat = document.getElementById(`slide62-row${i}-dat`);
      const rowTot = document.getElementById(`slide62-row${i}-tot`);

      if (rowName) rowName.textContent = selected.candidates[i - 1].name;
      if (rowRep) rowRep.textContent = selected.candidates[i - 1].rep;
      if (rowRul) rowRul.textContent = selected.candidates[i - 1].rul;
      if (rowDat) rowDat.textContent = selected.candidates[i - 1].dat;
      if (rowTot) rowTot.innerHTML = `<strong>${selected.candidates[i - 1].tot.split(' ')[0]}</strong> ${selected.candidates[i - 1].tot.includes('(') ? selected.candidates[i - 1].tot.substring(selected.candidates[i - 1].tot.indexOf('(')) : ''}`;
    }

    // Sync active tabs on screen for session 6
    document.querySelectorAll('.session-6 .practice-tabs .tab-btn').forEach(btn => {
      if (btn.getAttribute('data-set') === String(setId)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Use event delegation for dynamically loaded slides
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.practice-tabs .tab-btn');
    if (tabBtn) {
      const setId = parseInt(tabBtn.getAttribute('data-set'), 10);
      const slide = tabBtn.closest('.slide-card');
      if (slide) {
        if (slide.classList.contains('session-1')) {
          updatePracticeSetSession1(setId);
        } else if (slide.classList.contains('session-2')) {
          updatePracticeSetSession2(setId);
        } else if (slide.classList.contains('session-3')) {
          updatePracticeSetSession3(setId);
        } else if (slide.classList.contains('session-4')) {
          updatePracticeSetSession4(setId);
        } else if (slide.classList.contains('session-5')) {
          updatePracticeSetSession5(setId);
        } else if (slide.classList.contains('session-6')) {
          updatePracticeSetSession6(setId);
        }
      }
    }
  });
});
