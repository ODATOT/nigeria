/**
 * PC 관리자 화면 애플리케이션
 * - 기획서의 8개 화면(로그인, 대시보드, 주문 관리, 메뉴 관리, 품절 관리, 매출 조회, 매장 설정, 사용자 및 권한) 구현
 * - 상태 변경·품절·주문 중지 확인 절차, 변경 이력(Audit Log), 소리/아이콘/문구 알림, 동시 수정 및 오프라인 예외 처리 지원
 */

(function () {
  'use strict';

  const ADMIN_SESSION_KEY = 'SANDWICH_ADMIN_SESSION_V1_EN';

  let storeState = window.KioskStore.loadState();

  function loadAdminSession() {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    // 기본값: 바로 테스트할 수 있도록 점장 계정 로그인 상태 제공 (로그아웃하여 로그인 화면 및 계정 잠금 테스트 가능)
    return {
      isLoggedIn: true,
      currentUserId: 'usr-admin',
      currentView: 'DASHBOARD',
      selectedOrderId: 'ord-1001',
      orderFilters: {
        search: '',
        dateRange: 'TODAY',
        status: 'ALL',
        paymentStatus: 'ALL',
        orderType: 'ALL',
        includeCancelled: true
      },
      editingMenuId: null,
      selectedSoldOutMenuIds: [],
      salesPeriod: 'DAILY', // DAILY | WEEKLY | MONTHLY
      salesMenuFilter: 'ALL',
      simOffline: false
    };
  }

  let adminSession = loadAdminSession();

  function saveAdminSession() {
    try {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminSession));
    } catch (e) {}
  }

  function getCurrentUser() {
    return (
      storeState.users.find((u) => u.id === adminSession.currentUserId) ||
      storeState.users[0]
    );
  }

  function hasPermission(perm) {
    const u = getCurrentUser();
    if (!u) return false;
    return (u.permissions || []).includes(perm);
  }

  function playAlertSound() {
    if (!storeState.store.alertSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {}
  }

  function showToast(msg) {
    const el = document.getElementById('admin-toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      el.hidden = true;
    }, 4500);
  }

  function openModal(title, bodyHtml, footerButtons) {
    const backdrop = document.getElementById('admin-modal-backdrop');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const footerEl = document.getElementById('modal-footer');
    if (!backdrop || !titleEl || !bodyEl || !footerEl) return;

    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    footerEl.innerHTML = '';

    (footerButtons || []).forEach(function (btnCfg) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn ' + (btnCfg.className || 'btn-secondary');
      b.textContent = btnCfg.label;
      b.addEventListener('click', function () {
        if (btnCfg.onClick) btnCfg.onClick();
      });
      footerEl.appendChild(b);
    });

    backdrop.hidden = false;
  }

  function closeModal() {
    const backdrop = document.getElementById('admin-modal-backdrop');
    if (backdrop) backdrop.hidden = true;
  }

  /* ============================================================================
   * 상단 바 & 사이드바 업데이트
   * ============================================================================ */

  function updateShellChrome() {
    const loginView = document.getElementById('login-view');
    const adminShell = document.getElementById('admin-shell');
    if (!adminSession.isLoggedIn) {
      if (loginView) loginView.hidden = false;
      if (adminShell) adminShell.hidden = true;
      return;
    }
    if (loginView) loginView.hidden = true;
    if (adminShell) adminShell.hidden = false;

    const user = getCurrentUser();
    const store = storeState.store;

    document.getElementById('topbar-store-name').textContent = store.name;

    const recPill = document.getElementById('topbar-order-status-pill');
    const recIcon = document.getElementById('topbar-reception-icon');
    const recText = document.getElementById('topbar-reception-text');
    const togglePauseBtn = document.getElementById('topbar-toggle-pause-btn');

    if (store.isOrderPaused) {
      recPill.className = 'reception-pill is-paused';
      recIcon.textContent = '⏸️';
      recText.textContent = 'Order intake paused';
      togglePauseBtn.textContent = 'Resume intake';
    } else {
      recPill.className = 'reception-pill is-receiving';
      recIcon.textContent = '🟢';
      recText.textContent = 'Taking mobile orders';
      togglePauseBtn.textContent = 'Pause';
    }

    const newOrdersCount = storeState.orders.filter((o) => o.status === 'PAID').length;
    const activeOrdersCount = storeState.orders.filter((o) =>
      ['PAID', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status)
    ).length;
    const soldOutCount = storeState.menus.filter((m) => m.isSoldOut).length;

    const newOrderAlert = document.getElementById('topbar-new-order-alert');
    const newOrderText = document.getElementById('topbar-new-order-text');
    if (newOrderAlert && newOrderText) {
      newOrderText.textContent =
        newOrdersCount > 0 ? `${newOrdersCount} new unaccepted` : 'No new waiting orders';
      newOrderAlert.style.opacity = newOrdersCount > 0 ? '1' : '0.65';
    }

    const navBadgeNew = document.getElementById('nav-badge-new');
    const navBadgeOrders = document.getElementById('nav-badge-orders');
    const navBadgeSoldout = document.getElementById('nav-badge-soldout');

    if (navBadgeNew) {
      navBadgeNew.hidden = newOrdersCount === 0;
      navBadgeNew.textContent = String(newOrdersCount);
    }
    if (navBadgeOrders) {
      navBadgeOrders.hidden = activeOrdersCount === 0;
      navBadgeOrders.textContent = String(activeOrdersCount);
    }
    if (navBadgeSoldout) {
      navBadgeSoldout.hidden = soldOutCount === 0;
      navBadgeSoldout.textContent = String(soldOutCount);
    }

    document.getElementById('topbar-user-badge').textContent = user.roleName;
    document.getElementById('topbar-user-name').textContent = user.name;
    document.getElementById('topbar-last-sync').textContent = window.KioskStore.formatTimeOnly(
      storeState.lastUpdatedAt
    );

    const offlineBanner = document.getElementById('admin-offline-banner');
    const offlineToggle = document.getElementById('admin-offline-toggle');
    if (offlineBanner) offlineBanner.hidden = !adminSession.simOffline;
    if (offlineToggle) offlineToggle.checked = Boolean(adminSession.simOffline);

    document.querySelectorAll('.nav-item').forEach(function (btn) {
      const v = btn.getAttribute('data-view');
      if (v === adminSession.currentView) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  /* ============================================================================
   * 주문 상태 변경 및 취소 모달 (확인 절차 및 이력 기록)
   * ============================================================================ */

  function changeOrderStatus(orderId, nextStatus, customNote) {
    if (adminSession.simOffline) {
      showToast('🚫 You can\'t change order status while offline.');
      return;
    }
    const user = getCurrentUser();
    const order = storeState.orders.find((o) => o.id === orderId);
    if (!order) return;

    const nextMeta = window.KioskStore.ORDER_STATUS[nextStatus] || { label: nextStatus };

    storeState = window.KioskStore.saveState(
      function (st) {
        const target = st.orders.find((o) => o.id === orderId);
        if (!target) return st;
        target.status = nextStatus;
        target.history.push({
          status: nextStatus,
          note: customNote || `Change status to [${nextMeta.label}]`,
          actor: user.name,
          timestamp: new Date().toISOString()
        });
        return st;
      },
      {
        event: 'ORDER_STATUS_CHANGED',
        orderId: orderId,
        audit: {
          category: 'Order management',
          action: `Changed order ${order.orderNumber} status to [${nextMeta.label}]`,
          actor: user.name
        }
      }
    );

    showToast(`✅ Order ${order.orderNumber} status changed to [${nextMeta.label}].`);
    render();
  }

  function promptCancelOrder(orderId) {
    if (adminSession.simOffline) {
      showToast('🚫 You can\'t cancel orders while offline.');
      return;
    }
    if (!hasPermission('ORDER_CANCEL')) {
      showToast('⚠️ You don\'t have permission to cancel orders. (Manager or store manager required)');
      return;
    }
    const order = storeState.orders.find((o) => o.id === orderId);
    if (!order) return;

    const bodyHtml = `
      <div class="alert-box alert-danger">
        ⚠️ <strong>Confirm order cancel and refund:</strong> If you cancel order <strong>${order.orderNumber}</strong> (${window.KioskStore.formatPrice(order.finalAmount)}), the customer's order status screen will show the cancel and refund notice right away.
      </div>
      <div class="form-group">
        <label for="cancel-reason-select" class="form-label">Choose a cancel reason (required)</label>
        <select id="cancel-reason-select" class="form-select">
          <option value="Cancelled: ingredients ran out">Cancelled: ingredients ran out</option>
          <option value="Cancelled at customer's request">Cancelled at customer's request</option>
          <option value="Cancelled: kitchen delay">Cancelled: kitchen delay</option>
          <option value="Cancelled: duplicate/failed payment">Cancelled: duplicate/failed payment</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cancel-reason-detail" class="form-label">Detailed notice (shown to the customer)</label>
        <input type="text" id="cancel-reason-detail" class="form-input" value="The payment approval will be cancelled right away." />
      </div>
    `;

    openModal(`Cancel order (${order.orderNumber})`, bodyHtml, [
      { label: 'Close', className: 'btn-secondary', onClick: closeModal },
      {
        label: '🚫 Cancel order and refund',
        className: 'btn-danger',
        onClick: function () {
          const reasonSel = document.getElementById('cancel-reason-select');
          const detailInp = document.getElementById('cancel-reason-detail');
          const reason = reasonSel ? reasonSel.value : 'Store cancel';
          const refundNote = detailInp ? detailInp.value : 'Approval cancelled';
          const user = getCurrentUser();

          storeState = window.KioskStore.saveState(
            function (st) {
              const target = st.orders.find((o) => o.id === orderId);
              if (target) {
                target.status = 'CANCELLED';
                target.paymentStatus = 'REFUNDED';
                target.cancelReason = reason;
                target.refundStatus = refundNote;
                target.history.push({
                  status: 'CANCELLED',
                  note: `Order cancelled (reason: ${reason} / refund: ${refundNote})`,
                  actor: user.name,
                  timestamp: new Date().toISOString()
                });
              }
              return st;
            },
            {
              event: 'ORDER_STATUS_CHANGED',
              orderId: orderId,
              audit: {
                category: 'Order cancel',
                action: `Order ${order.orderNumber} cancelled and refunded (reason: ${reason})`,
                actor: user.name
              }
            }
          );

          closeModal();
          showToast(`🚫 Order ${order.orderNumber} has been cancelled and refunded.`);
          render();
        }
      }
    ]);
  }

  function openReceiptModal(orderId) {
    const order = storeState.orders.find((o) => o.id === orderId);
    if (!order) return;
    const pm = window.KioskStore.PAYMENT_METHODS[order.paymentMethod] || { name: order.paymentMethod };
    const itemsRows = order.items
      .map(function (it) {
        const opts = (it.selectedOptions || []).map((o) => o.itemName).join(', ');
        return `
          <tr>
            <td style="padding:4px 0;">
              <strong>${it.menuName}</strong><br/>
              <span style="font-size:0.75rem; color:#6B7F79;">${opts || 'Default'}</span>
            </td>
            <td style="text-align:center;">${it.quantity}</td>
            <td style="text-align:right;">${window.KioskStore.formatPrice(it.totalPrice)}</td>
          </tr>
        `;
      })
      .join('');

    const html = `
      <div style="font-family:monospace; border:1px dashed rgba(36,59,53,0.14); padding:16px; background:#FFFFFF;">
        <div style="text-align:center; border-bottom:1px dashed rgba(36,59,53,0.14); padding-bottom:10px; margin-bottom:10px;">
          <strong style="font-size:1.15rem;">[Receipt / Order slip] ${storeState.store.name}</strong><br/>
          <span>Contact: ${storeState.store.phone} | ${storeState.store.address}</span><br/>
          <strong style="font-size:1.4rem; display:block; margin-top:6px;">Order no.: ${order.orderNumber} (${
            order.orderType === 'DINE_IN' ? 'Dine-in' : 'Takeaway'
          })</strong>
        </div>
        <div style="margin-bottom:10px; font-size:0.82rem;">
          • Paid at: ${window.KioskStore.formatDateTime(order.createdAt)}<br/>
          • Payment method: ${pm.name} (${order.paymentStatus})
        </div>
        <table style="width:100%; border-collapse:collapse; font-size:0.84rem; margin-bottom:10px;">
          <thead>
            <tr style="border-bottom:1px solid rgba(36,59,53,0.14);">
              <th style="text-align:left;">Item/options</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
        <div style="border-top:1px dashed rgba(36,59,53,0.14); padding-top:8px; display:flex; justify-content:space-between; font-size:1rem; font-weight:900;">
          <span>Total paid</span>
          <span>${window.KioskStore.formatPrice(order.finalAmount)}</span>
        </div>
        ${
          order.customerRequest
            ? `<div style="margin-top:8px; padding:6px; background:#F6F9F4; border:1px solid rgba(133,96,0,0.55); font-size:0.8rem;">
                Request: ${order.customerRequest}
              </div>`
            : ''
        }
        <div style="margin-top:12px; font-size:0.75rem; color:#6B7F79; text-align:center;">
          ${storeState.store.receiptFooter}
        </div>
      </div>
    `;

    openModal(`Print receipt and order details (${order.orderNumber})`, html, [
      { label: 'Close', className: 'btn-secondary', onClick: closeModal },
      {
        label: '🖨️ Print',
        className: 'btn-primary',
        onClick: function () {
          closeModal();
          showToast(`🖨️ Sent the print command for order ${order.orderNumber}'s receipt.`);
        }
      }
    ]);
  }

  function promptToggleOrderPause() {
    if (adminSession.simOffline) {
      showToast('🚫 You can\'t change this while offline.');
      return;
    }
    const isPaused = storeState.store.isOrderPaused;
    const user = getCurrentUser();

    if (!isPaused) {
      const bodyHtml = `
        <div class="alert-box alert-warning">
          ⚠️ <strong>Confirm pausing mobile orders:</strong> While paused, customers on mobile can't place new orders.
        </div>
        <div class="form-group">
          <label for="pause-msg-input" class="form-label">Customer notice</label>
          <textarea id="pause-msg-input" class="form-textarea" rows="3">${storeState.store.pauseMessage}</textarea>
        </div>
      `;
      openModal('Mobile order intake paused', bodyHtml, [
        { label: 'Cancel', className: 'btn-secondary', onClick: closeModal },
        {
          label: '⏸️ Pause order intake',
          className: 'btn-danger',
          onClick: function () {
            const msg = document.getElementById('pause-msg-input').value;
            storeState = window.KioskStore.saveState(
              function (st) {
                st.store.isOrderPaused = true;
                st.store.pauseMessage = msg;
                return st;
              },
              {
                event: 'STORE_PAUSE_CHANGED',
                audit: {
                  category: 'Store settings',
                  action: 'Set mobile order intake to paused',
                  actor: user.name
                }
              }
            );
            closeModal();
            showToast('⏸️ Mobile order intake has been paused.');
            render();
          }
        }
      ]);
    } else {
      storeState = window.KioskStore.saveState(
        function (st) {
          st.store.isOrderPaused = false;
          return st;
        },
        {
          event: 'STORE_PAUSE_CHANGED',
          audit: {
            category: 'Store settings',
            action: 'Resume mobile order intake',
            actor: user.name
          }
        }
      );
      showToast('🟢 Mobile order intake has resumed.');
      render();
    }
  }

  /* ============================================================================
   * 2. 대시보드 화면
   * ============================================================================ */

  function renderDashboardView(main) {
    const orders = storeState.orders;
    const menus = storeState.menus;
    const delayLimit = storeState.store.delayThresholdMinutes || 15;

    const newCount = orders.filter((o) => o.status === 'PAID').length;
    const acceptedCount = orders.filter((o) => o.status === 'ACCEPTED').length;
    const preparingCount = orders.filter((o) => o.status === 'PREPARING').length;
    const readyCount = orders.filter((o) => o.status === 'READY').length;
    const cancelledCount = orders.filter((o) => o.status === 'CANCELLED').length;

    const waitingOrders = orders.filter((o) => ['PAID', 'ACCEPTED', 'PREPARING'].includes(o.status));
    let oldestOrder = null;
    let maxWaitMins = 0;
    waitingOrders.forEach(function (o) {
      const mins = window.KioskStore.getElapsedMinutes(o.createdAt);
      if (mins >= maxWaitMins) {
        maxWaitMins = mins;
        oldestOrder = o;
      }
    });

    // 즉시 확인할 알림 생성
    const urgentAlerts = [];
    if (storeState.store.isOrderPaused) {
      urgentAlerts.push({
        type: 'danger',
        icon: '⏸️',
        text: 'Mobile order intake is currently [paused].',
        actionLabel: 'Resume now',
        onClick: promptToggleOrderPause
      });
    }
    if (newCount > 0) {
      urgentAlerts.push({
        type: 'warning',
        icon: '🔔',
        text: `There are ${newCount} new orders not yet accepted. Please check them now.`,
        actionLabel: 'Open order management',
        onClick: function () {
          adminSession.currentView = 'ORDERS';
          saveAdminSession();
          render();
        }
      });
    }
    const delayedOrders = waitingOrders.filter(
      (o) => window.KioskStore.getElapsedMinutes(o.createdAt) >= delayLimit
    );
    if (delayedOrders.length > 0) {
      urgentAlerts.push({
        type: 'danger',
        icon: '⏰',
        text: `There are ${delayedOrders.length} delayed orders past the time limit (${delayLimit} min) (${delayedOrders
          .map((d) => d.orderNumber)
          .join(', ')}).`,
        actionLabel: 'View those orders',
        onClick: function () {
          adminSession.selectedOrderId = delayedOrders[0].id;
          adminSession.currentView = 'ORDERS';
          saveAdminSession();
          render();
        }
      });
    }
    const soldOutMenus = menus.filter((m) => m.isSoldOut);
    if (soldOutMenus.length > 0) {
      urgentAlerts.push({
        type: 'info',
        icon: '🚫',
        text: `There are ${soldOutMenus.length} sold-out menu items right now (${soldOutMenus.map((m) => m.name).join(', ')}).`,
        actionLabel: 'Go to sold-out management',
        onClick: function () {
          adminSession.currentView = 'SOLDOUT';
          saveAdminSession();
          render();
        }
      });
    }

    // 당일 판매 요약 계산
    const validOrders = orders.filter((o) => o.status !== 'CANCELLED');
    const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED');
    const totalSales = validOrders.reduce((acc, o) => acc + o.finalAmount, 0);
    const totalRefund = cancelledOrders.reduce((acc, o) => acc + o.finalAmount, 0);
    const avgOrder = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;

    // 인기 메뉴 집계
    const menuCounts = {};
    validOrders.forEach(function (o) {
      (o.items || []).forEach(function (it) {
        menuCounts[it.menuName] = (menuCounts[it.menuName] || 0) + it.quantity;
      });
    });
    const topMenus = Object.entries(menuCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    // 빠른 주문 처리 테이블
    const activeOrderRows = orders
      .filter((o) => o.status !== 'PICKED_UP' && o.status !== 'CANCELLED')
      .map(function (o) {
        const stMeta = window.KioskStore.ORDER_STATUS[o.status] || { label: o.status, badgeClass: '' };
        const elapsed = window.KioskStore.getElapsedMinutes(o.createdAt);
        let nextActionBtn = '';
        if (o.status === 'PAID') {
          nextActionBtn = `<button type="button" class="btn btn-primary btn-sm dash-quick-status" data-id="${o.id}" data-next="ACCEPTED">Accept order</button>`;
        } else if (o.status === 'ACCEPTED') {
          nextActionBtn = `<button type="button" class="btn btn-primary btn-sm dash-quick-status" data-id="${o.id}" data-next="PREPARING">Start cooking</button>`;
        } else if (o.status === 'PREPARING') {
          nextActionBtn = `<button type="button" class="btn btn-primary btn-sm dash-quick-status" data-id="${o.id}" data-next="READY">Notify ready</button>`;
        } else if (o.status === 'READY') {
          nextActionBtn = `<button type="button" class="btn btn-secondary btn-sm dash-quick-status" data-id="${o.id}" data-next="PICKED_UP">Picked up</button>`;
        }

        return `
          <tr>
            <td><strong>${o.orderNumber}</strong></td>
            <td>${o.orderType === 'DINE_IN' ? '🍽️ Dine-in' : '🛍️ Takeaway'}</td>
            <td>
              ${o.items[0] ? o.items[0].menuName : ''}${o.items.length > 1 ? ` +${o.items.length - 1} more` : ''}
              ${o.customerRequest ? '<span class="badge status-preparing" style="margin-left:4px;">Request</span>' : ''}
            </td>
            <td><span class="badge ${stMeta.badgeClass}">${stMeta.icon} ${stMeta.label}</span></td>
            <td><strong style="color:${elapsed >= delayLimit ? 'var(--danger)' : 'inherit'};">${elapsed} min ago</strong></td>
            <td>
              <div style="display:flex; gap:6px;">
                ${nextActionBtn}
                <button type="button" class="btn btn-outline btn-sm dash-open-detail" data-id="${o.id}">Details</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">📊 Live store dashboard</h1>
        <div style="display:flex; gap:8px;">
          <button type="button" id="dash-pause-btn" class="btn ${storeState.store.isOrderPaused ? 'btn-primary' : 'btn-warning'}">
            ${storeState.store.isOrderPaused ? '🟢 Resume mobile orders' : '⏸️ Pause mobile orders'}
          </button>
        </div>
      </div>

      <!-- 실시간 주문 현황 KPI -->
      <section class="kpi-grid" aria-label="Live order counts">
        <div class="kpi-card" style="border-left:4px solid var(--info);">
          <span class="kpi-label">🔔 New orders (unaccepted)</span>
          <strong class="kpi-value" style="color:var(--info);">${newCount}</strong>
          <span class="kpi-sub">Accept right away</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid rgba(43,92,166,0.55);">
          <span class="kpi-label">📋 Accepted (waiting to cook)</span>
          <strong class="kpi-value">${acceptedCount}</strong>
          <span class="kpi-sub">Waiting to start cooking</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid var(--accent);">
          <span class="kpi-label">🥪 Preparing (cooking)</span>
          <strong class="kpi-value" style="color:var(--accent);">${preparingCount}</strong>
          <span class="kpi-sub">Est. prep ${storeState.store.estimatedPrepMinutes} min</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid var(--primary);">
          <span class="kpi-label">✅ Ready (waiting for pickup)</span>
          <strong class="kpi-value" style="color:var(--primary);">${readyCount}</strong>
          <span class="kpi-sub">Customer called</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid var(--danger);">
          <span class="kpi-label">🚫 Cancelled / payment error</span>
          <strong class="kpi-value" style="color:var(--danger);">${cancelledCount}</strong>
          <span class="kpi-sub">Refunded ${window.KioskStore.formatPrice(totalRefund)}</span>
        </div>
        <div class="kpi-card" style="border-left:4px solid rgba(36,59,53,0.14);">
          <span class="kpi-label">⏳ Longest-waiting order</span>
          <strong class="kpi-value">${oldestOrder ? oldestOrder.orderNumber : 'None'}</strong>
          <span class="kpi-sub">${oldestOrder ? `Waiting ${maxWaitMins} min` : 'No waiting orders'}</span>
        </div>
      </section>

      <!-- 즉시 확인할 알림 -->
      <section class="panel" aria-labelledby="urgent-heading">
        <div class="panel-header">
          <h2 id="urgent-heading" class="panel-title">🚨 Alerts and actions to check now</h2>
        </div>
        <div id="urgent-alerts-container">
          ${
            urgentAlerts.length === 0
              ? '<div class="alert-box alert-info" style="margin:0;">🟢 All orders and systems are running normally.</div>'
              : ''
          }
        </div>
      </section>

      <div class="panel-grid-2">
        <!-- 진행 중인 주문 빠른 처리 -->
        <section class="panel" aria-labelledby="quick-order-heading">
          <div class="panel-header">
            <h2 id="quick-order-heading" class="panel-title">⚡ Quick status change for active orders</h2>
            <button type="button" id="dash-go-orders" class="btn btn-outline btn-sm">All order management →</button>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <caption>Live active order list</caption>
              <thead>
                <tr>
                  <th scope="col">Order no.</th>
                  <th scope="col">Type</th>
                  <th scope="col">Items</th>
                  <th scope="col">Status</th>
                  <th scope="col">Elapsed</th>
                  <th scope="col">Quick action</th>
                </tr>
              </thead>
              <tbody>
                ${activeOrderRows || '<tr><td colspan="6" style="text-align:center;">No active orders.</td></tr>'}
              </tbody>
            </table>
          </div>
        </section>

        <!-- 당일 판매 요약 & 빠른 품절 토글 -->
        <div>
          <section class="panel" aria-labelledby="today-sales-heading">
            <div class="panel-header">
              <h2 id="today-sales-heading" class="panel-title">💰 Today's sales summary</h2>
              <button type="button" id="dash-go-sales" class="btn btn-outline btn-sm">View detailed sales →</button>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div style="padding:10px; background:var(--bg-subtle); border-radius:6px;">
                <span style="font-size:0.78rem; color:var(--text-secondary);">Paid amount (${validOrders.length} orders)</span>
                <strong style="display:block; font-size:1.25rem; color:var(--primary);">${window.KioskStore.formatPrice(totalSales)}</strong>
              </div>
              <div style="padding:10px; background:var(--bg-subtle); border-radius:6px;">
                <span style="font-size:0.78rem; color:var(--text-secondary);">Average order value</span>
                <strong style="display:block; font-size:1.25rem;">${window.KioskStore.formatPrice(avgOrder)}</strong>
              </div>
            </div>
            <h3 style="margin:0 0 6px; font-size:0.86rem;">🔥 Today's best sellers</h3>
            <ul style="margin:0 0 12px; padding-left:18px; font-size:0.84rem;">
              ${topMenus.map(([name, qty]) => `<li><strong>${name}</strong> — ${qty} sold</li>`).join('')}
            </ul>

            <h3 style="margin:0 0 6px; font-size:0.86rem;">🕒 Orders by time of day</h3>
            <div class="bar-chart" aria-hidden="true">
              <div class="bar-col"><div class="bar-fill" style="height:35%;"></div><span class="bar-label">8-10am</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:95%;"></div><span class="bar-label">11am-1pm</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:60%;"></div><span class="bar-label">1-3pm</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:45%;"></div><span class="bar-label">3-5pm</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:75%;"></div><span class="bar-label">5-7pm</span></div>
              <div class="bar-col"><div class="bar-fill" style="height:30%;"></div><span class="bar-label">7-9pm</span></div>
            </div>
            <!-- 접근성 대체 데이터 테이블 -->
            <table class="data-table" style="margin-top:8px; font-size:0.76rem;">
              <caption>Orders by time of day summary</caption>
              <thead>
                <tr>
                  <th scope="col">8-10am</th>
                  <th scope="col">11am-1pm</th>
                  <th scope="col">1-3pm</th>
                  <th scope="col">3-5pm</th>
                  <th scope="col">5-7pm</th>
                  <th scope="col">7-9pm</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>7 orders</td>
                  <td>19 orders</td>
                  <td>12 orders</td>
                  <td>9 orders</td>
                  <td>15 orders</td>
                  <td>6 orders</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="panel" aria-labelledby="quick-soldout-heading">
            <div class="panel-header">
              <h2 id="quick-soldout-heading" class="panel-title">🚫 Quick sold-out toggle</h2>
              <button type="button" id="dash-go-soldout" class="btn btn-outline btn-sm">Detailed sold-out management →</button>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${menus
                .map(
                  (m) => `
                  <button
                    type="button"
                    class="btn btn-sm ${m.isSoldOut ? 'btn-danger' : 'btn-secondary'} dash-toggle-soldout"
                    data-menu-id="${m.id}"
                  >
                    ${m.emoji} ${m.name} (${m.isSoldOut ? 'Sold out·restore' : 'On sale'})
                  </button>
                `
                )
                .join('')}
            </div>
          </section>
        </div>
      </div>
    `;

    // 즉시 확인 알림 렌더링
    const alertBoxContainer = document.getElementById('urgent-alerts-container');
    if (alertBoxContainer && urgentAlerts.length > 0) {
      urgentAlerts.forEach(function (al) {
        const div = document.createElement('div');
        div.className = `alert-box alert-${al.type}`;
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.innerHTML = `<span>${al.icon} ${al.text}</span>`;
        if (al.actionLabel && al.onClick) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn btn-sm btn-secondary';
          b.textContent = al.actionLabel;
          b.addEventListener('click', al.onClick);
          div.appendChild(b);
        }
        alertBoxContainer.appendChild(div);
      });
    }

    const pauseBtn = document.getElementById('dash-pause-btn');
    if (pauseBtn) pauseBtn.addEventListener('click', promptToggleOrderPause);

    const goOrdersBtn = document.getElementById('dash-go-orders');
    if (goOrdersBtn) {
      goOrdersBtn.addEventListener('click', function () {
        adminSession.currentView = 'ORDERS';
        saveAdminSession();
        render();
      });
    }

    const goSalesBtn = document.getElementById('dash-go-sales');
    if (goSalesBtn) {
      goSalesBtn.addEventListener('click', function () {
        adminSession.currentView = 'SALES';
        saveAdminSession();
        render();
      });
    }

    const goSoldoutBtn = document.getElementById('dash-go-soldout');
    if (goSoldoutBtn) {
      goSoldoutBtn.addEventListener('click', function () {
        adminSession.currentView = 'SOLDOUT';
        saveAdminSession();
        render();
      });
    }

    main.querySelectorAll('.dash-quick-status').forEach(function (btn) {
      btn.addEventListener('click', function () {
        changeOrderStatus(btn.getAttribute('data-id'), btn.getAttribute('data-next'));
      });
    });

    main.querySelectorAll('.dash-open-detail').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adminSession.selectedOrderId = btn.getAttribute('data-id');
        adminSession.currentView = 'ORDERS';
        saveAdminSession();
        render();
      });
    });

    main.querySelectorAll('.dash-toggle-soldout').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!hasPermission('SOLD_OUT_MANAGE')) {
          showToast('⚠️ You don\'t have permission to manage sold-out items. (Manager or above)');
          return;
        }
        const mId = btn.getAttribute('data-menu-id');
        const user = getCurrentUser();
        storeState = window.KioskStore.saveState(
          function (st) {
            const m = st.menus.find((x) => x.id === mId);
            if (m) {
              m.isSoldOut = !m.isSoldOut;
              m.soldOutAt = m.isSoldOut ? new Date().toISOString() : null;
              m.soldOutBy = m.isSoldOut ? user.name : null;
              m.soldOutReason = m.isSoldOut ? 'Marked sold out from dashboard' : '';
            }
            return st;
          },
          {
            event: 'SOLD_OUT_CHANGED',
            audit: {
              category: 'Sold-out management',
              action: `Changed menu sold-out status from dashboard`,
              actor: user.name
            }
          }
        );
        showToast('✅ Menu sold-out status updated live on the customer screen.');
        render();
      });
    });
  }

  /* ============================================================================
   * 3. 주문 관리 화면 (좌측 목록 + 우측 상세 분할 화면)
   * ============================================================================ */

  function renderOrdersView(main) {
    const f = adminSession.orderFilters;
    const filteredOrders = storeState.orders.filter(function (o) {
      if (!f.includeCancelled && o.status === 'CANCELLED') return false;
      if (f.status !== 'ALL' && o.status !== f.status) return false;
      if (f.paymentStatus !== 'ALL' && o.paymentStatus !== f.paymentStatus) return false;
      if (f.orderType !== 'ALL' && o.orderType !== f.orderType) return false;
      if (f.search) {
        const q = f.search.toLowerCase();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchMenu = o.items.some((i) => i.menuName.toLowerCase().includes(q));
        if (!matchNum && !matchMenu) return false;
      }
      return true;
    });

    const selectedOrder =
      filteredOrders.find((o) => o.id === adminSession.selectedOrderId) ||
      filteredOrders[0] ||
      null;
    if (selectedOrder) {
      adminSession.selectedOrderId = selectedOrder.id;
    }

    const rowsHtml = filteredOrders
      .map(function (o) {
        const stMeta = window.KioskStore.ORDER_STATUS[o.status] || { label: o.status, badgeClass: '' };
        const elapsed = window.KioskStore.getElapsedMinutes(o.createdAt);
        const isSelected = selectedOrder && selectedOrder.id === o.id;
        return `
          <tr class="clickable-row ${isSelected ? 'is-selected' : ''}" data-order-id="${o.id}">
            <td><strong>${o.orderNumber}</strong></td>
            <td>
              <div>${window.KioskStore.formatTimeOnly(o.createdAt)}</div>
              <small style="color:var(--text-muted);">${elapsed} min ago</small>
            </td>
            <td>${o.orderType === 'DINE_IN' ? '🍽️ Dine-in' : '🛍️ Takeaway'}</td>
            <td>
              <div>${o.items[0] ? o.items[0].menuName : ''}${o.items.length > 1 ? ` +${o.items.length - 1} more` : ''}</div>
              ${o.customerRequest ? '<span class="badge status-preparing">💬 Has request</span>' : ''}
            </td>
            <td><strong>${window.KioskStore.formatPrice(o.finalAmount)}</strong></td>
            <td>${o.paymentStatus === 'REFUNDED' ? '<span class="badge status-cancelled">Refunded</span>' : '<span class="badge status-ready">Paid</span>'}</td>
            <td><span class="badge ${stMeta.badgeClass}">${stMeta.icon} ${stMeta.label}</span></td>
          </tr>
        `;
      })
      .join('');

    let detailHtml = '<div class="panel"><p>Select an order from the list.</p></div>';
    if (selectedOrder) {
      const stMeta = window.KioskStore.ORDER_STATUS[selectedOrder.status] || { label: selectedOrder.status, badgeClass: '' };
      const pmMeta = window.KioskStore.PAYMENT_METHODS[selectedOrder.paymentMethod] || { name: selectedOrder.paymentMethod };

      const itemsDetailHtml = selectedOrder.items
        .map(function (it) {
          const addOpts = (it.selectedOptions || []).filter((o) => o.groupId === 'opt-extra');
          const exclOpts = (it.selectedOptions || []).filter((o) => o.groupId === 'opt-exclude');
          const normalOpts = (it.selectedOptions || []).filter(
            (o) => o.groupId !== 'opt-extra' && o.groupId !== 'opt-exclude'
          );

          return `
            <div style="padding:10px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px; background:var(--bg-subtle);">
              <div style="display:flex; justify-content:space-between; font-weight:800; font-size:0.95rem;">
                <span>${it.menuName} × ${it.quantity}</span>
                <span>${window.KioskStore.formatPrice(it.totalPrice)}</span>
              </div>
              <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:4px;">
                • Default picks: ${normalOpts.map((o) => `${o.groupName}(${o.itemName})`).join(', ') || 'Default'}
              </div>
              ${
                addOpts.length > 0
                  ? `<div style="font-size:0.82rem; color:#27765B; font-weight:700; margin-top:2px;">
                      ➕ Extra ingredients: ${addOpts.map((o) => o.itemName).join(', ')}
                    </div>`
                  : ''
              }
              ${
                exclOpts.length > 0
                  ? `<div style="font-size:0.82rem; color:#A83A45; font-weight:700; margin-top:2px;">
                      ⛔ Removed ingredients: ${exclOpts.map((o) => o.itemName).join(', ')}
                    </div>`
                  : ''
              }
            </div>
          `;
        })
        .join('');

      const historyHtml = (selectedOrder.history || [])
        .map(
          (h) => `
          <li style="margin-bottom:4px; font-size:0.8rem;">
            <strong>[${window.KioskStore.formatTimeOnly(h.timestamp)}]</strong> ${h.note} — <em>By: ${h.actor}</em>
          </li>
        `
        )
        .join('');

      detailHtml = `
        <section class="panel" aria-labelledby="detail-order-title">
          <div class="panel-header">
            <div>
              <span style="font-size:0.78rem; color:var(--text-secondary);">Order details</span>
              <h2 id="detail-order-title" class="panel-title" style="font-size:1.3rem;">
                Order no. ${selectedOrder.orderNumber} (${selectedOrder.orderType === 'DINE_IN' ? '🍽️ Dine-in' : '🛍️ Takeaway'})
              </h2>
            </div>
            <span class="badge ${stMeta.badgeClass}" style="font-size:0.85rem; padding:6px 12px;">
              ${stMeta.icon} ${stMeta.label}
            </span>
          </div>

          <!-- 상태 변경 버튼 그룹 -->
          <div style="margin-bottom:14px; padding:12px; background:var(--bg-subtle); border-radius:8px; border:1px solid var(--border);">
            <strong style="display:block; margin-bottom:8px; font-size:0.82rem;">⚡ Change order status (updates the customer screen instantly)</strong>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" class="btn btn-sm ${selectedOrder.status === 'ACCEPTED' ? 'btn-primary' : 'btn-secondary'} order-status-btn" data-status="ACCEPTED" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>📋 Accept order</button>
              <button type="button" class="btn btn-sm ${selectedOrder.status === 'PREPARING' ? 'btn-primary' : 'btn-secondary'} order-status-btn" data-status="PREPARING" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>🥪 Preparing</button>
              <button type="button" class="btn btn-sm ${selectedOrder.status === 'READY' ? 'btn-primary' : 'btn-secondary'} order-status-btn" data-status="READY" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>🔔 Ready</button>
              <button type="button" class="btn btn-sm ${selectedOrder.status === 'PICKED_UP' ? 'btn-primary' : 'btn-secondary'} order-status-btn" data-status="PICKED_UP" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>✅ Picked up</button>
              <button type="button" id="detail-cancel-order-btn" class="btn btn-sm btn-danger" ${
                selectedOrder.status === 'CANCELLED' ? 'disabled' : ''
              }>🚫 Cancel/refund order</button>
              <button type="button" id="detail-print-receipt-btn" class="btn btn-sm btn-outline" style="margin-left:auto;">
                🖨️ Print receipt/order slip
              </button>
            </div>
          </div>

          ${
            selectedOrder.status === 'CANCELLED'
              ? `<div class="alert-box alert-danger">
                  <strong>🚫 Cancel reason:</strong> ${selectedOrder.cancelReason || '-'}<br/>
                  <strong>💳 Refund status:</strong> ${selectedOrder.refundStatus || 'Refunded'}
                </div>`
              : ''
          }

          ${
            selectedOrder.customerRequest
              ? `<div class="alert-box alert-warning">
                  💬 <strong>Customer request:</strong> ${selectedOrder.customerRequest}
                </div>`
              : '<div style="font-size:0.82rem; color:var(--text-muted); margin-bottom:10px;">• No customer request</div>'
          }

          <h3 style="margin:0 0 8px; font-size:0.9rem;">Options and removed·extra ingredients per item</h3>
          ${itemsDetailHtml}

          <div style="padding:10px; background:var(--bg-subtle); border-radius:8px; margin-bottom:12px; font-size:0.84rem;">
            <div style="display:flex; justify-content:space-between;">
              <span>Payment method and time</span>
              <strong>${pmMeta.name} (${window.KioskStore.formatDateTime(selectedOrder.paidAt)})</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:1rem; color:var(--primary);">
              <strong>Total paid</strong>
              <strong>${window.KioskStore.formatPrice(selectedOrder.finalAmount)}</strong>
            </div>
          </div>

          <h3 style="margin:0 0 6px; font-size:0.88rem;">🕒 Order status and admin history</h3>
          <ul style="margin:0; padding-left:18px;">
            ${historyHtml}
          </ul>
        </section>
      `;
    }

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">📋 Order management</h1>
      </div>

      <!-- 검색 및 필터 바 -->
      <section class="filter-bar" aria-label="Order search and filters">
        <input
          type="search"
          id="order-filter-search"
          class="form-input"
          style="width:200px;"
          placeholder="Search order no. (A-101) or menu name"
          value="${f.search}"
        />
        <select id="order-filter-date" class="form-select" style="width:130px;" aria-label="Order date range">
          <option value="TODAY" ${f.dateRange === 'TODAY' ? 'selected' : ''}>Today's orders</option>
          <option value="WEEK" ${f.dateRange === 'WEEK' ? 'selected' : ''}>Last 7 days</option>
          <option value="ALL" ${f.dateRange === 'ALL' ? 'selected' : ''}>All time</option>
        </select>
        <select id="order-filter-status" class="form-select" style="width:140px;" aria-label="Order status filter">
          <option value="ALL" ${f.status === 'ALL' ? 'selected' : ''}>Order status: All</option>
          <option value="PAID" ${f.status === 'PAID' ? 'selected' : ''}>Paid (new)</option>
          <option value="ACCEPTED" ${f.status === 'ACCEPTED' ? 'selected' : ''}>Received</option>
          <option value="PREPARING" ${f.status === 'PREPARING' ? 'selected' : ''}>Preparing</option>
          <option value="READY" ${f.status === 'READY' ? 'selected' : ''}>Ready</option>
          <option value="PICKED_UP" ${f.status === 'PICKED_UP' ? 'selected' : ''}>Picked up</option>
          <option value="CANCELLED" ${f.status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
        </select>
        <select id="order-filter-pay" class="form-select" style="width:140px;" aria-label="Payment status filter">
          <option value="ALL" ${f.paymentStatus === 'ALL' ? 'selected' : ''}>Payment status: All</option>
          <option value="PAID" ${f.paymentStatus === 'PAID' ? 'selected' : ''}>Payment complete</option>
          <option value="REFUNDED" ${f.paymentStatus === 'REFUNDED' ? 'selected' : ''}>Refunded</option>
        </select>
        <select id="order-filter-type" class="form-select" style="width:130px;" aria-label="Order type filter">
          <option value="ALL" ${f.orderType === 'ALL' ? 'selected' : ''}>Type: All</option>
          <option value="DINE_IN" ${f.orderType === 'DINE_IN' ? 'selected' : ''}>Dine-in</option>
          <option value="TAKEOUT" ${f.orderType === 'TAKEOUT' ? 'selected' : ''}>Takeaway</option>
        </select>
        <label style="display:inline-flex; align-items:center; gap:4px; font-weight:700; font-size:0.82rem; cursor:pointer;">
          <input type="checkbox" id="order-filter-cancel" ${f.includeCancelled ? 'checked' : ''} />
          <span>Include cancelled orders</span>
        </label>
      </section>

      <div class="orders-split-layout">
        <!-- 좌측 주문 목록 -->
        <section class="panel" aria-label="Order list">
          <div class="panel-header">
            <h2 class="panel-title">Order list (${filteredOrders.length})</h2>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <caption>Filtered order list</caption>
              <thead>
                <tr>
                  <th scope="col">Order no.</th>
                  <th scope="col">Time/elapsed</th>
                  <th scope="col">Type</th>
                  <th scope="col">Items</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Order status</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml || '<tr><td colspan="7" style="text-align:center;">No orders match the filters.</td></tr>'}
              </tbody>
            </table>
          </div>
        </section>

        <!-- 우측 주문 상세 -->
        <div>${detailHtml}</div>
      </div>
    `;

    // 필터 이벤트
    document.getElementById('order-filter-search').addEventListener('input', function (e) {
      adminSession.orderFilters.search = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-date').addEventListener('change', function (e) {
      adminSession.orderFilters.dateRange = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-status').addEventListener('change', function (e) {
      adminSession.orderFilters.status = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-pay').addEventListener('change', function (e) {
      adminSession.orderFilters.paymentStatus = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-type').addEventListener('change', function (e) {
      adminSession.orderFilters.orderType = e.target.value;
      saveAdminSession();
      render();
    });
    document.getElementById('order-filter-cancel').addEventListener('change', function (e) {
      adminSession.orderFilters.includeCancelled = e.target.checked;
      saveAdminSession();
      render();
    });

    main.querySelectorAll('tr[data-order-id]').forEach(function (row) {
      row.addEventListener('click', function () {
        adminSession.selectedOrderId = row.getAttribute('data-order-id');
        saveAdminSession();
        render();
      });
    });

    main.querySelectorAll('.order-status-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!selectedOrder) return;
        changeOrderStatus(selectedOrder.id, btn.getAttribute('data-status'));
      });
    });

    const cancelBtn = document.getElementById('detail-cancel-order-btn');
    if (cancelBtn && selectedOrder) {
      cancelBtn.addEventListener('click', function () {
        promptCancelOrder(selectedOrder.id);
      });
    }

    const printBtn = document.getElementById('detail-print-receipt-btn');
    if (printBtn && selectedOrder) {
      printBtn.addEventListener('click', function () {
        openReceiptModal(selectedOrder.id);
      });
    }
  }

  /* ============================================================================
   * 4. 메뉴 관리 화면
   * ============================================================================ */

  function renderMenusView(main) {
    const sortedMenus = storeState.menus
      .slice()
      .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

    const editingMenu =
      storeState.menus.find((m) => m.id === adminSession.editingMenuId) ||
      sortedMenus[0];
    if (editingMenu && !adminSession.editingMenuId) {
      adminSession.editingMenuId = editingMenu.id;
    }

    const rowsHtml = sortedMenus
      .map(function (m, idx) {
        const isSel = editingMenu && editingMenu.id === m.id;
        return `
          <tr class="clickable-row ${isSel ? 'is-selected' : ''}" data-menu-id="${m.id}">
            <td>
              <strong>#${m.displayOrder || idx + 1}</strong>
              <button type="button" class="btn btn-outline btn-sm menu-order-up" data-id="${m.id}" title="Move up">▲</button>
              <button type="button" class="btn btn-outline btn-sm menu-order-down" data-id="${m.id}" title="Move down">▼</button>
            </td>
            <td>
              <span style="font-size:1.3rem;">${m.emoji || '🥪'}</span>
              <strong>${m.name}</strong>
              ${m.badge ? `<span class="badge status-preparing">${m.badge}</span>` : ''}
            </td>
            <td>${m.category === 'SANDWICH' ? 'Sandwich' : 'Drink'}</td>
            <td><strong>${window.KioskStore.formatPrice(m.price)}</strong></td>
            <td>${m.isSelling ? '<span class="badge status-ready">Shown/on sale</span>' : '<span class="badge status-pickedup">Hidden</span>'}</td>
            <td>${m.isSoldOut ? '<span class="badge status-cancelled">🚫 Sold out</span>' : '<span class="badge status-paid">Normal</span>'}</td>
            <td>
              <small>${m.updatedBy || 'Admin'}<br/>${window.KioskStore.formatTimeOnly(m.updatedAt)}</small>
            </td>
          </tr>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">🥪 Menu management</h1>
        <button type="button" id="add-new-menu-btn" class="btn btn-primary">+ Add new menu item</button>
      </div>

      <div class="orders-split-layout">
        <section class="panel" aria-label="Registered menu list">
          <div class="panel-header">
            <h2 class="panel-title">All menu items (${sortedMenus.length})</h2>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <caption>All menu items and display order</caption>
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Menu name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Base price</th>
                  <th scope="col">Shown on mobile</th>
                  <th scope="col">Sold out</th>
                  <th scope="col">Last edited</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </section>

        <!-- 우측 메뉴 편집 패널 -->
        <section class="panel" aria-labelledby="menu-edit-heading">
          <div class="panel-header">
            <h2 id="menu-edit-heading" class="panel-title">
              ✏️ Edit menu details and options
            </h2>
          </div>
          <div id="menu-form-error" class="alert-box alert-danger" role="alert" hidden></div>
          ${
            editingMenu
              ? `
              <form id="menu-edit-form" novalidate>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label for="edit-menu-name" class="form-label">Menu name (required)</label>
                    <input type="text" id="edit-menu-name" class="form-input" value="${editingMenu.name}" required />
                  </div>
                  <div class="form-group">
                    <label for="edit-menu-category" class="form-label">Category</label>
                    <select id="edit-menu-category" class="form-select">
                      <option value="SANDWICH" ${editingMenu.category === 'SANDWICH' ? 'selected' : ''}>Sandwich (bread·size·ingredient·combo options)</option>
                      <option value="BEVERAGE" ${editingMenu.category === 'BEVERAGE' ? 'selected' : ''}>Drink (size·temperature·ice·sweetness options)</option>
                    </select>
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label for="edit-menu-price" class="form-label">Base price (₦)</label>
                    <input type="number" id="edit-menu-price" class="form-input" value="${editingMenu.price}" min="0" step="100" required />
                  </div>
                  <div class="form-group">
                    <label for="edit-menu-badge" class="form-label">Highlight badge</label>
                    <input type="text" id="edit-menu-badge" class="form-input" value="${editingMenu.badge || ''}" placeholder="Popular / New" />
                  </div>
                  <div class="form-group">
                    <label for="edit-menu-emoji" class="form-label">Icon (emoji)</label>
                    <input type="text" id="edit-menu-emoji" class="form-input" value="${editingMenu.emoji || '🥪'}" />
                  </div>
                </div>

                <div class="form-group">
                  <label for="edit-menu-desc" class="form-label">Menu description (required)</label>
                  <textarea id="edit-menu-desc" class="form-textarea" rows="2">${editingMenu.description}</textarea>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label for="edit-menu-allergens" class="form-label">Allergen info</label>
                    <input type="text" id="edit-menu-allergens" class="form-input" value="${editingMenu.allergens || ''}" />
                  </div>
                  <div class="form-group">
                    <label for="edit-menu-origin" class="form-label">Ingredients and origin</label>
                    <input type="text" id="edit-menu-origin" class="form-input" value="${editingMenu.originInfo || ''}" />
                  </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div class="form-group">
                    <label for="edit-menu-hours" class="form-label">Sale hours</label>
                    <input type="text" id="edit-menu-hours" class="form-input" value="${editingMenu.saleHours || '08:00 ~ 20:30'}" />
                  </div>
                  <div class="form-group" style="display:flex; flex-direction:column; justify-content:center; gap:6px; padding-top:14px;">
                    <label style="display:flex; align-items:center; gap:6px; font-weight:700; cursor:pointer;">
                      <input type="checkbox" id="edit-menu-selling" ${editingMenu.isSelling ? 'checked' : ''} />
                      <span>Show on mobile (on sale)</span>
                    </label>
                    <label style="display:flex; align-items:center; gap:6px; font-weight:700; cursor:pointer;">
                      <input type="checkbox" id="edit-menu-recommend" ${editingMenu.isRecommended ? 'checked' : ''} />
                      <span>Show in the recommended tab</span>
                    </label>
                  </div>
                </div>

                <div class="alert-box alert-info" style="font-size:0.8rem;">
                  ℹ️ <strong>Option groups and extra cost rules:</strong> Currently linked to <strong>${
                    editingMenu.category === 'SANDWICH' ? 'standard sandwich options (bread type, size, combo, extra/removed ingredients)' : 'standard drink options (size, temperature, ice, sweetness)'
                  }</strong>. When you save, price change alerts are sent automatically to active orders and customer carts.
                </div>

                <div style="display:flex; justify-content:flex-end; gap:8px;">
                  <button type="submit" class="btn btn-primary">💾 Check and save changes</button>
                </div>
              </form>
            `
              : ''
          }
        </section>
      </div>
    `;

    main.querySelectorAll('tr[data-menu-id]').forEach(function (row) {
      row.addEventListener('click', function (ev) {
        if (ev.target.closest('button')) return;
        adminSession.editingMenuId = row.getAttribute('data-menu-id');
        saveAdminSession();
        render();
      });
    });

    main.querySelectorAll('.menu-order-up').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        moveMenuOrder(id, -1);
      });
    });
    main.querySelectorAll('.menu-order-down').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        moveMenuOrder(id, 1);
      });
    });

    const addMenuBtn = document.getElementById('add-new-menu-btn');
    if (addMenuBtn) {
      addMenuBtn.addEventListener('click', function () {
        if (!hasPermission('MENU_MANAGE')) {
          showToast('⚠️ You don\'t have permission to add/edit menu items.');
          return;
        }
        const user = getCurrentUser();
        const newId = 'menu-custom-' + Date.now();
        storeState = window.KioskStore.saveState(
          function (st) {
            st.menus.push({
              id: newId,
              name: 'New signature item',
              category: 'SANDWICH',
              isRecommended: true,
              badge: 'New',
              price: 6500,
              description: 'Enter a description for the new item made with fresh ingredients.',
              emoji: '🥖',
              bgColor: '#243B35',
              allergens: 'Contains wheat, milk, soy',
              originInfo: 'Locally sourced',
              saleHours: '08:00 ~ 20:30',
              isSelling: true,
              isSoldOut: false,
              displayOrder: st.menus.length + 1,
              updatedBy: user.name,
              updatedAt: new Date().toISOString()
            });
            return st;
          },
          {
            event: 'MENU_UPDATED',
            audit: {
              category: 'Menu management',
              action: 'Created a new menu item draft',
              actor: user.name
            }
          }
        );
        adminSession.editingMenuId = newId;
        saveAdminSession();
        showToast('✅ New menu item added. Edit its details on the right.');
        render();
      });
    }

    const editForm = document.getElementById('menu-edit-form');
    if (editForm && editingMenu) {
      editForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (adminSession.simOffline) {
          showToast('🚫 You can\'t save while offline.');
          return;
        }
        if (!hasPermission('MENU_MANAGE')) {
          showToast('⚠️ You don\'t have permission to edit menu items.');
          return;
        }

        const errEl = document.getElementById('menu-form-error');
        const nameVal = document.getElementById('edit-menu-name').value.trim();
        const descVal = document.getElementById('edit-menu-desc').value.trim();
        const priceVal = Number(document.getElementById('edit-menu-price').value);

        // 저장 전 유효성 검증 (기획서 요구사항)
        if (!nameVal || !descVal) {
          errEl.hidden = false;
          errEl.textContent = '⚠️ Missing required info: menu name and description can\'t be empty.';
          return;
        }
        if (isNaN(priceVal) || priceVal < 0) {
          errEl.hidden = false;
          errEl.textContent = '⚠️ Invalid amount: base price must be a valid number of ₦0 or more.';
          return;
        }

        const duplicate = storeState.menus.find(
          (m) => m.id !== editingMenu.id && m.name.trim() === nameVal
        );
        if (duplicate) {
          errEl.hidden = false;
          errEl.textContent = '⚠️ Duplicate menu name: a menu item with the same name already exists.';
          return;
        }

        const user = getCurrentUser();
        storeState = window.KioskStore.saveState(
          function (st) {
            const target = st.menus.find((m) => m.id === editingMenu.id);
            if (target) {
              target.name = nameVal;
              target.category = document.getElementById('edit-menu-category').value;
              target.price = priceVal;
              target.badge = document.getElementById('edit-menu-badge').value.trim();
              target.emoji = document.getElementById('edit-menu-emoji').value.trim() || '🥪';
              target.description = descVal;
              target.allergens = document.getElementById('edit-menu-allergens').value.trim();
              target.originInfo = document.getElementById('edit-menu-origin').value.trim();
              target.saleHours = document.getElementById('edit-menu-hours').value.trim();
              target.isSelling = document.getElementById('edit-menu-selling').checked;
              target.isRecommended = document.getElementById('edit-menu-recommend').checked;
              target.updatedBy = user.name;
              target.updatedAt = new Date().toISOString();
            }
            return st;
          },
          {
            event: 'MENU_UPDATED',
            audit: {
              category: 'Menu management',
              action: `Edited [${nameVal}] menu info and price (${window.KioskStore.formatPrice(priceVal)})`,
              actor: user.name
            }
          }
        );

        showToast(`💾 [${nameVal}] menu info saved and updated on the customer screen right away.`);
        render();
      });
    }
  }

  function moveMenuOrder(menuId, delta) {
    const user = getCurrentUser();
    storeState = window.KioskStore.saveState(function (st) {
      const sorted = st.menus.slice().sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
      const idx = sorted.findIndex((m) => m.id === menuId);
      const swapIdx = idx + delta;
      if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return st;
      const temp = sorted[idx];
      sorted[idx] = sorted[swapIdx];
      sorted[swapIdx] = temp;
      sorted.forEach(function (m, i) {
        m.displayOrder = i + 1;
      });
      return st;
    });
    render();
  }

  /* ============================================================================
   * 5. 품절 관리 화면 (메뉴 단위 + 옵션/재료 단위 품절 + 재개 시간 예약 + 일괄 변경)
   * ============================================================================ */

  function renderSoldOutView(main) {
    const menus = storeState.menus.slice().sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

    const menuRowsHtml = menus
      .map(function (m) {
        const checked = adminSession.selectedSoldOutMenuIds.includes(m.id);
        return `
          <tr>
            <td>
              <input type="checkbox" class="soldout-bulk-check" value="${m.id}" ${checked ? 'checked' : ''} aria-label="Select ${m.name}" />
            </td>
            <td><strong>${m.emoji} ${m.name}</strong></td>
            <td>${m.isSoldOut ? '<span class="badge status-cancelled">🚫 Sold out</span>' : '<span class="badge status-ready">🟢 On sale</span>'}</td>
            <td>${m.soldOutAt ? `${window.KioskStore.formatTimeOnly(m.soldOutAt)} (${m.soldOutBy || '-'})` : '-'}</td>
            <td>
              <input type="text" class="form-input soldout-reason-input" data-id="${m.id}" value="${m.soldOutReason || ''}" placeholder="e.g. ran out of today's ingredients" style="min-width:150px;" />
            </td>
            <td>
              <input type="time" class="form-input soldout-resume-input" data-id="${m.id}" value="${m.resumeAt || ''}" style="width:125px;" />
            </td>
            <td>
              <button type="button" class="btn btn-sm ${m.isSoldOut ? 'btn-primary' : 'btn-danger'} soldout-single-toggle" data-id="${m.id}">
                ${m.isSoldOut ? 'Resume sale' : 'Mark sold out now'}
              </button>
            </td>
          </tr>
        `;
      })
      .join('');

    // 옵션/재료 단위 품절 관리 렌더링
    const allOptionGroups = []
      .concat(
        (storeState.optionTemplates.SANDWICH || []).map((g) => Object.assign({ catLabel: 'Sandwich' }, g)),
        (storeState.optionTemplates.BEVERAGE || []).map((g) => Object.assign({ catLabel: 'Drink' }, g))
      );

    const optionGroupsHtml = allOptionGroups
      .map(function (grp) {
        const itemsHtml = grp.items
          .map(function (it) {
            return `
              <button
                type="button"
                class="btn btn-sm ${it.soldOut ? 'btn-danger' : 'btn-secondary'} opt-item-soldout-btn"
                data-cat="${grp.catLabel === 'Sandwich' ? 'SANDWICH' : 'BEVERAGE'}"
                data-grp="${grp.id}"
                data-item="${it.id}"
              >
                ${it.soldOut ? '🚫' : '🟢'} ${it.name} (${it.soldOut ? 'Sold out' : 'Normal'})
              </button>
            `;
          })
          .join('');
        return `
          <div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px dashed var(--border);">
            <strong style="display:block; margin-bottom:6px; font-size:0.86rem;">[${grp.catLabel}] ${grp.name}</strong>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">${itemsHtml}</div>
          </div>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">🚫 Sold-out management (by menu item and option·ingredient)</h1>
        <label style="display:flex; align-items:center; gap:6px; background:#FFFFFF; padding:8px 12px; border-radius:8px; border:1px solid var(--border); font-weight:800; cursor:pointer;">
          <input type="checkbox" id="toggle-show-soldout-menus" ${storeState.store.ShowSoldOutMenus ? 'checked' : ''} />
          <span>Show sold-out items on the customer screen with a [Sold out badge] (uncheck to hide them from the list)</span>
        </label>
      </div>

      <section class="panel" aria-labelledby="menu-soldout-heading">
        <div class="panel-header">
          <h2 id="menu-soldout-heading" class="panel-title">1. Sold-out status per menu item and scheduled auto-resume</h2>
          <div style="display:flex; gap:6px;">
            <button type="button" id="bulk-soldout-on-btn" class="btn btn-danger btn-sm">Mark selected sold out</button>
            <button type="button" id="bulk-soldout-off-btn" class="btn btn-primary btn-sm">Restore selected</button>
          </div>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <caption>All menu sold-out and resume schedule table</caption>
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Menu name</th>
                <th scope="col">Status</th>
                <th scope="col">Sold-out time / by</th>
                <th scope="col">Sold-out reason</th>
                <th scope="col">Scheduled resume</th>
                <th scope="col">Working</th>
              </tr>
            </thead>
            <tbody>${menuRowsHtml}</tbody>
          </table>
        </div>
      </section>

      <section class="panel" aria-labelledby="opt-soldout-heading">
        <div class="panel-header">
          <h2 id="opt-soldout-heading" class="panel-title">2. Sold-out by specific option or ingredient (click to update the customer option picker instantly)</h2>
        </div>
        ${optionGroupsHtml}
      </section>
    `;

    const showSoldoutCheck = document.getElementById('toggle-show-soldout-menus');
    if (showSoldoutCheck) {
      showSoldoutCheck.addEventListener('change', function () {
        const user = getCurrentUser();
        storeState = window.KioskStore.saveState(
          function (st) {
            st.store.ShowSoldOutMenus = showSoldoutCheck.checked;
            return st;
          },
          {
            event: 'SOLD_OUT_CHANGED',
            audit: {
              category: 'Sold-out management',
              action: `Changed how sold-out items are shown to customers to [${showSoldoutCheck.checked ? 'Show sold-out badge' : 'Hide from list'}]`,
              actor: user.name
            }
          }
        );
        showToast('✅ Updated how sold-out items are shown to customers.');
      });
    }

    main.querySelectorAll('.soldout-bulk-check').forEach(function (chk) {
      chk.addEventListener('change', function () {
        const id = chk.value;
        if (chk.checked) {
          if (!adminSession.selectedSoldOutMenuIds.includes(id)) {
            adminSession.selectedSoldOutMenuIds.push(id);
          }
        } else {
          adminSession.selectedSoldOutMenuIds = adminSession.selectedSoldOutMenuIds.filter((x) => x !== id);
        }
        saveAdminSession();
      });
    });

    main.querySelectorAll('.soldout-single-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!hasPermission('SOLD_OUT_MANAGE')) {
          showToast('⚠️ You don\'t have permission to manage sold-out items.');
          return;
        }
        const id = btn.getAttribute('data-id');
        const reasonInput = main.querySelector(`.soldout-reason-input[data-id="${id}"]`);
        const resumeInput = main.querySelector(`.soldout-resume-input[data-id="${id}"]`);
        const user = getCurrentUser();

        storeState = window.KioskStore.saveState(
          function (st) {
            const m = st.menus.find((x) => x.id === id);
            if (m) {
              m.isSoldOut = !m.isSoldOut;
              m.soldOutAt = m.isSoldOut ? new Date().toISOString() : null;
              m.soldOutBy = m.isSoldOut ? user.name : null;
              m.soldOutReason = m.isSoldOut ? (reasonInput ? reasonInput.value : 'Ingredients ran out') : '';
              m.resumeAt = m.isSoldOut ? (resumeInput ? resumeInput.value : '') : null;
            }
            return st;
          },
          {
            event: 'SOLD_OUT_CHANGED',
            audit: {
              category: 'Sold-out management',
              action: `Changed menu sold-out status`,
              actor: user.name
            }
          }
        );
        showToast('✅ Menu sold-out status updated.');
        render();
      });
    });

    const bulkOnBtn = document.getElementById('bulk-soldout-on-btn');
    const bulkOffBtn = document.getElementById('bulk-soldout-off-btn');
    if (bulkOnBtn) {
      bulkOnBtn.addEventListener('click', function () {
        applyBulkSoldOut(true);
      });
    }
    if (bulkOffBtn) {
      bulkOffBtn.addEventListener('click', function () {
        applyBulkSoldOut(false);
      });
    }

    main.querySelectorAll('.opt-item-soldout-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!hasPermission('SOLD_OUT_MANAGE')) {
          showToast('⚠️ You don\'t have permission to manage sold-out items.');
          return;
        }
        const cat = btn.getAttribute('data-cat');
        const grpId = btn.getAttribute('data-grp');
        const itemId = btn.getAttribute('data-item');
        const user = getCurrentUser();
        let targetName = '';

        storeState = window.KioskStore.saveState(
          function (st) {
            const groups = st.optionTemplates[cat] || [];
            const grp = groups.find((g) => g.id === grpId);
            const item = grp ? grp.items.find((i) => i.id === itemId) : null;
            if (item) {
              item.soldOut = !item.soldOut;
              item.soldOutReason = item.soldOut ? 'Ingredients ran out' : '';
              targetName = item.name;
            }
            return st;
          },
          {
            event: 'SOLD_OUT_CHANGED',
            audit: {
              category: 'Option sold out',
              action: `Toggled option/ingredient sold-out`,
              actor: user.name
            }
          }
        );
        showToast(`✅ Option [${targetName}] sold-out status updated on the customer screen right away.`);
        render();
      });
    });
  }

  function applyBulkSoldOut(makeSoldOut) {
    if (adminSession.selectedSoldOutMenuIds.length === 0) {
      showToast('ℹ️ First select at least 1 menu item with the checkboxes.');
      return;
    }
    const user = getCurrentUser();
    storeState = window.KioskStore.saveState(
      function (st) {
        st.menus.forEach(function (m) {
          if (adminSession.selectedSoldOutMenuIds.includes(m.id)) {
            m.isSoldOut = makeSoldOut;
            m.soldOutAt = makeSoldOut ? new Date().toISOString() : null;
            m.soldOutBy = makeSoldOut ? user.name : null;
            m.soldOutReason = makeSoldOut ? 'Bulk sold-out' : '';
          }
        });
        return st;
      },
      {
        event: 'SOLD_OUT_CHANGED',
        audit: {
          category: 'Sold-out management',
          action: `Bulk ${makeSoldOut ? 'sold-out' : 'restore'}: ${adminSession.selectedSoldOutMenuIds.length} menu items`,
          actor: user.name
        }
      }
    );
    adminSession.selectedSoldOutMenuIds = [];
    saveAdminSession();
    showToast(`✅ Selected menu items ${makeSoldOut ? 'marked sold out' : 'restored'}.`);
    render();
  }

  /* ============================================================================
   * 6. 매출 조회 화면
   * ============================================================================ */

  function renderSalesView(main) {
    const mult = adminSession.salesPeriod === 'DAILY' ? 1 : adminSession.salesPeriod === 'WEEKLY' ? 6.5 : 27;
    const validOrders = storeState.orders.filter((o) => o.status !== 'CANCELLED');
    const cancelledOrders = storeState.orders.filter((o) => o.status === 'CANCELLED');

    const baseSales = validOrders.reduce((acc, o) => acc + o.finalAmount, 0);
    const totalSales = Math.round(baseSales * mult);
    const totalCount = Math.round(validOrders.length * mult);
    const avgOrder = totalCount > 0 ? Math.round(totalSales / totalCount) : 0;
    const totalRefund = Math.round(cancelledOrders.reduce((acc, o) => acc + o.finalAmount, 0) * mult);

    // 메뉴별 집계
    const menuSalesMap = {};
    storeState.menus.forEach(function (m) {
      menuSalesMap[m.id] = { id: m.id, name: m.name, qty: 0, amount: 0 };
    });
    validOrders.forEach(function (o) {
      (o.items || []).forEach(function (it) {
        if (!menuSalesMap[it.menuId]) {
          menuSalesMap[it.menuId] = { id: it.menuId, name: it.menuName, qty: 0, amount: 0 };
        }
        menuSalesMap[it.menuId].qty += Math.round(it.quantity * mult);
        menuSalesMap[it.menuId].amount += Math.round(it.totalPrice * mult);
      });
    });

    const menuSalesList = Object.values(menuSalesMap)
      .filter((m) => adminSession.salesMenuFilter === 'ALL' || m.id === adminSession.salesMenuFilter)
      .sort((a, b) => b.amount - a.amount);

    // 결제수단별 집계
    const payStats = { CARD: 0, KAKAOPAY: 0, NAVERPAY: 0, MOBILEPAY: 0 };
    validOrders.forEach(function (o) {
      payStats[o.paymentMethod] = (payStats[o.paymentMethod] || 0) + Math.round(o.finalAmount * mult);
    });

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">📈 Sales and end-of-day settlement</h1>
        <div style="display:flex; gap:8px;">
          <button type="button" id="download-sales-csv-btn" class="btn btn-secondary">📥 Download results as CSV</button>
          <button type="button" id="open-closing-modal-btn" class="btn btn-primary">🧾 Check today's closing data</button>
        </div>
      </div>

      <section class="filter-bar" aria-label="Sales period and menu filters">
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn btn-sm ${adminSession.salesPeriod === 'DAILY' ? 'btn-primary' : 'btn-secondary'} sales-period-btn" data-p="DAILY">Daily sales</button>
          <button type="button" class="btn btn-sm ${adminSession.salesPeriod === 'WEEKLY' ? 'btn-primary' : 'btn-secondary'} sales-period-btn" data-p="WEEKLY">Weekly sales</button>
          <button type="button" class="btn btn-sm ${adminSession.salesPeriod === 'MONTHLY' ? 'btn-primary' : 'btn-secondary'} sales-period-btn" data-p="MONTHLY">Monthly sales</button>
        </div>
        <select id="sales-menu-filter" class="form-select" style="width:220px; margin-left:auto;" aria-label="Filter by menu">
          <option value="ALL">Show all menu items</option>
          ${storeState.menus
            .map(
              (m) =>
                `<option value="${m.id}" ${adminSession.salesMenuFilter === m.id ? 'selected' : ''}>${m.name}</option>`
            )
            .join('')}
        </select>
      </section>

      <section class="kpi-grid" aria-label="Key sales metrics">
        <div class="kpi-card">
          <span class="kpi-label">Total net sales</span>
          <strong class="kpi-value" style="color:var(--primary);">${window.KioskStore.formatPrice(totalSales)}</strong>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Paid orders</span>
          <strong class="kpi-value">${totalCount}</strong>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Average order value</span>
          <strong class="kpi-value">${window.KioskStore.formatPrice(avgOrder)}</strong>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Cancelled and refunded</span>
          <strong class="kpi-value" style="color:var(--danger);">${window.KioskStore.formatPrice(totalRefund)}</strong>
        </div>
      </section>

      <div class="panel-grid-2">
        <section class="panel" aria-labelledby="menu-sales-heading">
          <div class="panel-header">
            <h2 id="menu-sales-heading" class="panel-title">Sales quantity and revenue by menu item</h2>
          </div>
          <div class="data-table-wrap">
            <table class="data-table">
              <caption>Sales by menu item table</caption>
              <thead>
                <tr>
                  <th scope="col">Menu name</th>
                  <th scope="col">Qty sold</th>
                  <th scope="col">Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${menuSalesList
                  .map(
                    (m) => `
                  <tr>
                    <td><strong>${m.name}</strong></td>
                    <td>${m.qty}</td>
                    <td><strong>${window.KioskStore.formatPrice(m.amount)}</strong></td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel" aria-labelledby="pay-method-sales-heading">
          <div class="panel-header">
            <h2 id="pay-method-sales-heading" class="panel-title">Sales and cancel·refund by payment method</h2>
          </div>
          <table class="data-table">
            <caption>Payment method sales table</caption>
            <thead>
              <tr>
                <th scope="col">Payment method</th>
                <th scope="col">Payment amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>💳 Credit·debit card</td><td><strong>${window.KioskStore.formatPrice(payStats.CARD)}</strong></td></tr>
              <tr><td>💛 OPay</td><td><strong>${window.KioskStore.formatPrice(payStats.KAKAOPAY)}</strong></td></tr>
              <tr><td>💚 PalmPay</td><td><strong>${window.KioskStore.formatPrice(payStats.NAVERPAY)}</strong></td></tr>
              <tr><td>📱 Apple·Samsung Pay</td><td><strong>${window.KioskStore.formatPrice(payStats.MOBILEPAY)}</strong></td></tr>
            </tbody>
          </table>
        </section>
      </div>
    `;

    main.querySelectorAll('.sales-period-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adminSession.salesPeriod = btn.getAttribute('data-p');
        saveAdminSession();
        render();
      });
    });

    document.getElementById('sales-menu-filter').addEventListener('change', function (e) {
      adminSession.salesMenuFilter = e.target.value;
      saveAdminSession();
      render();
    });

    document.getElementById('download-sales-csv-btn').addEventListener('click', function () {
      const csvRows = [
        ['Menu name', 'Qty sold', 'Revenue'],
        ...menuSalesList.map((m) => [m.name, m.qty, m.amount])
      ];
      const csvString = '\uFEFF' + csvRows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `freshsand_sales_${adminSession.salesPeriod.toLowerCase()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 Sales data CSV download complete.');
    });

    document.getElementById('open-closing-modal-btn').addEventListener('click', function () {
      openModal(
        '🧾 Check end-of-day settlement data',
        `
        <div class="alert-box alert-info">
          This is the closing summary as of now. Finish all uncollected or cooking orders before confirming the close.
        </div>
        <ul style="line-height:1.8;">
          <li><strong>Total successful payments:</strong> ${validOrders.length} (${window.KioskStore.formatPrice(baseSales)})</li>
          <li><strong>Cancels/refunds:</strong> ${cancelledOrders.length} (${window.KioskStore.formatPrice(
            cancelledOrders.reduce((acc, o) => acc + o.finalAmount, 0)
          )})</li>
          <li><strong>Net sales total:</strong> ${window.KioskStore.formatPrice(baseSales)}</li>
        </ul>
      `,
        [
          { label: 'Close', className: 'btn-secondary', onClick: closeModal },
          {
            label: '✅ Confirm closing settlement',
            className: 'btn-primary',
            onClick: function () {
              closeModal();
              showToast('✅ Today\'s closing data check has been recorded.');
            }
          }
        ]
      );
    });
  }

  /* ============================================================================
   * 7. 매장 설정 화면
   * ============================================================================ */

  function renderSettingsView(main) {
    const s = storeState.store;

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">⚙️ Store settings</h1>
      </div>

      <form id="store-settings-form" class="panel-grid-2">
        <section class="panel" aria-labelledby="store-basic-heading">
          <div class="panel-header">
            <h2 id="store-basic-heading" class="panel-title">Store basics and opening hours</h2>
          </div>
          <div class="form-group">
            <label for="set-store-name" class="form-label">Store name</label>
            <input type="text" id="set-store-name" class="form-input" value="${s.name}" required />
          </div>
          <div class="form-group">
            <label for="set-store-phone" class="form-label">Store phone</label>
            <input type="text" id="set-store-phone" class="form-input" value="${s.phone}" required />
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="form-group">
              <label for="set-order-start" class="form-label">Orders open from</label>
              <input type="time" id="set-order-start" class="form-input" value="${s.orderStartTime}" />
            </div>
            <div class="form-group">
              <label for="set-order-end" class="form-label">Orders close at</label>
              <input type="time" id="set-order-end" class="form-input" value="${s.orderEndTime}" />
            </div>
          </div>
          <div class="form-group">
            <label for="set-prep-mins" class="form-label">Default estimated prep time (min)</label>
            <input type="number" id="set-prep-mins" class="form-input" value="${s.estimatedPrepMinutes}" min="1" max="60" />
          </div>
          <div class="form-group">
            <span class="form-label">Dine-in and takeaway options</span>
            <div style="display:flex; gap:16px; margin-top:6px;">
              <label style="display:flex; align-items:center; gap:6px; font-weight:700;">
                <input type="checkbox" id="set-allow-dinein" ${s.allowDineIn ? 'checked' : ''} />
                <span>🍽️ Allow dine-in</span>
              </label>
              <label style="display:flex; align-items:center; gap:6px; font-weight:700;">
                <input type="checkbox" id="set-allow-takeout" ${s.allowTakeout ? 'checked' : ''} />
                <span>🛍️ Allow takeaway</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="set-pause-msg" class="form-label">Order pause notice text</label>
            <textarea id="set-pause-msg" class="form-textarea" rows="2">${s.pauseMessage}</textarea>
          </div>
        </section>

        <section class="panel" aria-labelledby="store-pay-heading">
          <div class="panel-header">
            <h2 id="store-pay-heading" class="panel-title">Payment methods · receipts · admin alert settings</h2>
          </div>
          <div class="form-group">
            <span class="form-label">Mobile payment methods</span>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
              <label><input type="checkbox" class="set-pay-chk" value="CARD" ${s.supportedPayments.includes('CARD') ? 'checked' : ''} /> 💳 Credit·debit card</label>
              <label><input type="checkbox" class="set-pay-chk" value="KAKAOPAY" ${s.supportedPayments.includes('KAKAOPAY') ? 'checked' : ''} /> 💛 OPay</label>
              <label><input type="checkbox" class="set-pay-chk" value="NAVERPAY" ${s.supportedPayments.includes('NAVERPAY') ? 'checked' : ''} /> 💚 PalmPay</label>
              <label><input type="checkbox" class="set-pay-chk" value="MOBILEPAY" ${s.supportedPayments.includes('MOBILEPAY') ? 'checked' : ''} /> 📱 Apple·Samsung Pay</label>
            </div>
          </div>
          <div class="form-group">
            <label for="set-receipt-footer" class="form-label">Receipt footer text</label>
            <input type="text" id="set-receipt-footer" class="form-input" value="${s.receiptFooter}" />
          </div>
          <div class="form-group">
            <span class="form-label">Admin alerts and auto-print</span>
            <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
              <label><input type="checkbox" id="set-alert-sound" ${s.alertSoundEnabled ? 'checked' : ''} /> 🔔 Play a sound when a new order arrives</label>
              <label><input type="checkbox" id="set-auto-print" ${s.autoPrintReceipt ? 'checked' : ''} /> 🖨️ Auto-print receipt when accepting an order</label>
            </div>
          </div>
          <div class="form-group">
            <label for="set-delay-mins" class="form-label">Kitchen delay warning time (min)</label>
            <input type="number" id="set-delay-mins" class="form-input" value="${s.delayThresholdMinutes || 15}" min="5" max="60" />
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end;">
            <button type="submit" class="btn btn-primary">💾 Save store settings</button>
          </div>
        </section>
      </form>
    `;

    document.getElementById('store-settings-form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!hasPermission('STORE_SETTINGS')) {
        showToast('⚠️ Only the store manager (admin) can change store settings.');
        return;
      }
      const payArr = [];
      main.querySelectorAll('.set-pay-chk:checked').forEach((c) => payArr.push(c.value));
      if (payArr.length === 0) {
        showToast('⚠️ You must turn on at least 1 payment method.');
        return;
      }
      const user = getCurrentUser();
      storeState = window.KioskStore.saveState(
        function (st) {
          st.store.name = document.getElementById('set-store-name').value.trim();
          st.store.phone = document.getElementById('set-store-phone').value.trim();
          st.store.orderStartTime = document.getElementById('set-order-start').value;
          st.store.orderEndTime = document.getElementById('set-order-end').value;
          st.store.estimatedPrepMinutes = Number(document.getElementById('set-prep-mins').value) || 10;
          st.store.allowDineIn = document.getElementById('set-allow-dinein').checked;
          st.store.allowTakeout = document.getElementById('set-allow-takeout').checked;
          st.store.pauseMessage = document.getElementById('set-pause-msg').value.trim();
          st.store.supportedPayments = payArr;
          st.store.receiptFooter = document.getElementById('set-receipt-footer').value.trim();
          st.store.alertSoundEnabled = document.getElementById('set-alert-sound').checked;
          st.store.autoPrintReceipt = document.getElementById('set-auto-print').checked;
          st.store.delayThresholdMinutes = Number(document.getElementById('set-delay-mins').value) || 15;
          return st;
        },
        {
          event: 'STORE_SETTINGS_UPDATED',
          audit: {
            category: 'Store settings',
            action: 'Updated store hours and payment/alert settings',
            actor: user.name
          }
        }
      );
      showToast('✅ Store settings saved and applied to the customer mobile screen.');
      render();
    });
  }

  /* ============================================================================
   * 8. 사용자 및 권한 화면 + 전체 변경 이력(Audit Log)
   * ============================================================================ */

  function renderUsersView(main) {
    const userRows = storeState.users
      .map(function (u) {
        return `
          <tr>
            <td><strong>${u.username}</strong></td>
            <td>${u.name}</td>
            <td><span class="role-badge">${u.roleName} (${u.role})</span></td>
            <td><small>${u.permissions.join(', ')}</small></td>
            <td>${window.KioskStore.formatDateTime(u.lastLoginAt)}</td>
            <td>${u.isLocked ? '<span class="badge status-cancelled">🔒 Locked</span>' : u.isActive ? '<span class="badge status-ready">Active</span>' : '<span class="badge status-pickedup">Inactive</span>'}</td>
            <td>
              <button type="button" class="btn btn-outline btn-sm switch-account-btn" data-uid="${u.id}">Switch to this account</button>
            </td>
          </tr>
        `;
      })
      .join('');

    const auditRows = (storeState.auditLogs || [])
      .slice(0, 25)
      .map(function (log) {
        return `
          <tr>
            <td>${window.KioskStore.formatDateTime(log.timestamp)}</td>
            <td><span class="badge status-accepted">${log.category}</span></td>
            <td>${log.action}</td>
            <td><strong>${log.actor}</strong></td>
          </tr>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">👥 Users and permissions · Change history</h1>
      </div>

      <section class="panel" aria-labelledby="users-table-heading">
        <div class="panel-header">
          <h2 id="users-table-heading" class="panel-title">Admin and staff accounts (permissions by role)</h2>
        </div>
        <div class="alert-box alert-info">
          • <strong>Staff (STAFF):</strong> view orders and change status &nbsp;|&nbsp;
          <strong>Manager (MANAGER):</strong> cancel orders, edit sold-out and menu &nbsp;|&nbsp;
          <strong>Admin (ADMIN):</strong> store settings, accounts and permissions
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <caption>Admin and staff accounts table</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Access granted</th>
                <th scope="col">Last login</th>
                <th scope="col">States</th>
                <th scope="col">Quick switch</th>
              </tr>
            </thead>
            <tbody>${userRows}</tbody>
          </table>
        </div>
      </section>

      <section class="panel" aria-labelledby="audit-log-heading">
        <div class="panel-header">
          <h2 id="audit-log-heading" class="panel-title">📜 Menu · order · settings change history (Audit Log)</h2>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <caption>System change history table</caption>
            <thead>
              <tr>
                <th scope="col">Changed at</th>
                <th scope="col">Type</th>
                <th scope="col">Change details</th>
                <th scope="col">By</th>
              </tr>
            </thead>
            <tbody>${auditRows}</tbody>
          </table>
        </div>
      </section>
    `;

    main.querySelectorAll('.switch-account-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adminSession.currentUserId = btn.getAttribute('data-uid');
        saveAdminSession();
        const u = getCurrentUser();
        showToast(`👤 Switched current account to [${u.name} - ${u.roleName}].`);
        render();
      });
    });
  }

  /* ============================================================================
   * 메인 렌더러 & 이벤트 초기화
   * ============================================================================ */

  function render() {
    storeState = window.KioskStore.loadState();
    updateShellChrome();
    if (!adminSession.isLoggedIn) return;

    const main = document.getElementById('admin-main');
    if (!main) return;

    switch (adminSession.currentView) {
      case 'DASHBOARD':
        renderDashboardView(main);
        break;
      case 'ORDERS':
        renderOrdersView(main);
        break;
      case 'MENUS':
        renderMenusView(main);
        break;
      case 'SOLDOUT':
        renderSoldOutView(main);
        break;
      case 'SALES':
        renderSalesView(main);
        break;
      case 'SETTINGS':
        renderSettingsView(main);
        break;
      case 'USERS':
        renderUsersView(main);
        break;
      default:
        adminSession.currentView = 'DASHBOARD';
        renderDashboardView(main);
    }
  }

  function initEvents() {
    // 1. 로그인 폼 처리 (실패 사유 안내 및 5회 이상 실패 시 계정 보호 잠금)
    const loginForm = document.getElementById('login-form');
    const loginAlert = document.getElementById('login-alert');
    if (loginForm) {
      loginForm.addEventListener('submit', function (ev) {
        ev.preventDefault();
        const uName = document.getElementById('login-username').value.trim();
        const uPass = document.getElementById('login-password').value;

        const targetUser = storeState.users.find((u) => u.username === uName);
        if (!targetUser) {
          loginAlert.hidden = false;
          loginAlert.textContent = '❌ Login failed: this admin ID doesn\'t exist.';
          return;
        }
        if (targetUser.isLocked) {
          loginAlert.hidden = false;
          loginAlert.textContent =
            '🔒 Account protection: this account is locked after 5+ wrong passwords. Contact an admin or click [Unlock account protection] below.';
          return;
        }
        if (targetUser.password !== uPass) {
          storeState = window.KioskStore.saveState(function (st) {
            const u = st.users.find((x) => x.id === targetUser.id);
            if (u) {
              u.failedAttempts = (u.failedAttempts || 0) + 1;
              if (u.failedAttempts >= 5) u.isLocked = true;
            }
            return st;
          });
          const updated = storeState.users.find((x) => x.id === targetUser.id);
          loginAlert.hidden = false;
          loginAlert.textContent = updated.isLocked
            ? '🔒 Account protection lock turned on after 5 failed passwords in a row.'
            : `❌ Wrong password. (Failed attempts: ${updated.failedAttempts}/5 — the account locks after 5 failures)`;
          return;
        }

        // 로그인 성공
        storeState = window.KioskStore.saveState(function (st) {
          const u = st.users.find((x) => x.id === targetUser.id);
          if (u) {
            u.failedAttempts = 0;
            u.isLocked = false;
            u.lastLoginAt = new Date().toISOString();
          }
          return st;
        });

        adminSession.isLoggedIn = true;
        adminSession.currentUserId = targetUser.id;
        saveAdminSession();
        loginAlert.hidden = true;
        render();
      });
    }

    document.querySelectorAll('.quick-login-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const uName = btn.getAttribute('data-user');
        const target = storeState.users.find((u) => u.username === uName);
        if (target) {
          adminSession.isLoggedIn = true;
          adminSession.currentUserId = target.id;
          saveAdminSession();
          showToast(`👋 Welcome! Logged in as [${target.name}].`);
          render();
        }
      });
    });

    const pwResetBtn = document.getElementById('open-pw-reset-btn');
    if (pwResetBtn) {
      pwResetBtn.addEventListener('click', function () {
        openModal(
          '🔐 Admin password reset',
          `
          <p>If you lost your password, the head office system admin or store manager account can reset it.</p>
          <div class="form-group">
            <label for="reset-target-id" class="form-label">Enter the ID to reset</label>
            <input type="text" id="reset-target-id" class="form-input" value="admin" />
          </div>
        `,
          [
            { label: 'Close', className: 'btn-secondary', onClick: closeModal },
            {
              label: 'Reset to default password (password123)',
              className: 'btn-primary',
              onClick: function () {
                closeModal();
                if (loginAlert) {
                  loginAlert.hidden = false;
                  loginAlert.className = 'alert-box alert-info';
                  loginAlert.textContent = '✅ Reset to temporary password (password123).';
                }
              }
            }
          ]
        );
      });
    }

    const unlockBtn = document.getElementById('unlock-accounts-btn');
    if (unlockBtn) {
      unlockBtn.addEventListener('click', function () {
        storeState = window.KioskStore.saveState(function (st) {
          st.users.forEach((u) => {
            u.failedAttempts = 0;
            u.isLocked = false;
          });
          return st;
        });
        if (loginAlert) {
          loginAlert.hidden = false;
          loginAlert.className = 'alert-box alert-info';
          loginAlert.textContent = '🔓 Lock status and failed attempts reset for all accounts.';
        }
      });
    }

    // 좌측 네비게이션 전환
    document.querySelectorAll('.nav-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adminSession.currentView = btn.getAttribute('data-view');
        saveAdminSession();
        render();
      });
    });

    // 상단 바 이벤트
    const togglePauseBtn = document.getElementById('topbar-toggle-pause-btn');
    if (togglePauseBtn) {
      togglePauseBtn.addEventListener('click', promptToggleOrderPause);
    }

    const logoutBtn = document.getElementById('topbar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        adminSession.isLoggedIn = false;
        saveAdminSession();
        render();
      });
    }

    const offlineToggle = document.getElementById('admin-offline-toggle');
    if (offlineToggle) {
      offlineToggle.addEventListener('change', function () {
        adminSession.simOffline = offlineToggle.checked;
        saveAdminSession();
        render();
      });
    }

    const reconnectBtn = document.getElementById('admin-reconnect-btn');
    if (reconnectBtn) {
      reconnectBtn.addEventListener('click', function () {
        adminSession.simOffline = false;
        saveAdminSession();
        showToast('🟢 Reconnected to the server and synced the latest order status.');
        render();
      });
    }

    const resetDataBtn = document.getElementById('reset-demo-data-btn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', function () {
        window.KioskStore.resetToDefault();
        showToast('🔄 All demo data restored to its initial state.');
        render();
      });
    }

    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    // 시계 업데이트
    setInterval(function () {
      const clockEl = document.getElementById('topbar-current-time');
      if (clockEl) {
        clockEl.textContent = window.KioskStore.formatTimeOnly(new Date().toISOString());
      }
    }, 1000);

    // 실시간 스토어 구독 (고객이 신규 주문을 넣으면 알림음 + 토스트 + 화면 즉시 갱신)
    window.KioskStore.subscribe(function (nextState, payload) {
      storeState = nextState;
      if (payload && payload.meta && payload.meta.event === 'NEW_ORDER_CREATED') {
        playAlertSound();
        const newest = nextState.orders[0];
        if (newest) {
          adminSession.selectedOrderId = newest.id;
          showToast(`🔔 [New order] Order ${newest.orderNumber} (${window.KioskStore.formatPrice(newest.finalAmount)}) is waiting to be accepted!`);
        }
      }
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initEvents();
    render();
  });
})();

