/**
 * 고객 모바일 주문 서비스 애플리케이션 (Fresh Route 디자인 콘셉트 적용)
 * - Organic & Bold 미학, 컷 코너 카드, 4:3 음식 단면 비주얼, 2px 라인 아이콘 & 채워진 상태 아이콘
 * - 재료가 쌓이는 순서의 주문 진행 단계 시각화 및 직접적이고 친근한 한국어 문구 체계 적용
 */

(function () {
  'use strict';

  const SESSION_KEY = 'SANDWICH_CUSTOMER_SESSION_V1_EN';
  const ORDER_API_URL =
    'https://script.google.com/macros/s/AKfycbwnBPBoFAOMYkNAATlV2jKi1dMhVTbpuevMiWkamOZGJvqZt5_PqCNPyNdn5ZYWtdVbmw/exec';

  const SCREEN_TITLES = {
    START: 'Start order',
    MENU_LIST: 'Choose menu',
    MENU_DETAIL: 'Choose options',
    CART: 'Cart',
    ORDER_CONFIRM: 'Confirm order',
    PAYMENT: 'Pay',
    ORDER_COMPLETE: 'Order done',
    ORDER_STATUS: 'Order status'
  };

  /* 9. 아이콘 체계: 2px 선 두께의 라인 아이콘 & 채워진 상태 아이콘 (장식용 이모지 미사용) */
  function getLineIcon(name) {
    const icons = {
      dineIn: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`,
      takeout: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
      clock: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
      mapPin: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
      phone: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0122 16.92z"/></svg>`,
      card: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
      wallet: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 00-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>`,
      smartphone: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>`,
      plus: `<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`
    };
    return icons[name] || '';
  }

  function getFilledStatusIcon(type) {
    const icons = {
      check: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
      checkMarkOnly: `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>`,
      warning: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
      error: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`,
      info: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
      star: `<svg class="status-svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
    };
    return icons[type] || '';
  }

  /**
   * 9. 음식 사진: 4:3 비율 통일, 밝은 자연광 크림색 배경, 샌드위치 단면과 재료 질감이 선명하게 보이는 SVG 푸드 그래픽
   * 모든 음식 이미지에 메뉴명 중심의 대체 텍스트(aria-label) 제공
   */
  function renderFoodVisualSvg(menu) {
    const id = menu ? menu.id : 'hero';
    const label = menu ? `${menu.name} product image` : 'Fresh handmade sandwich main image';

    // 메뉴별 고유 식재료 단면 컬러 구성
    const palettes = {
      'menu-sw-1': { bread: '#856000', lettuce: '#27765B', filling1: '#27765B', filling2: '#856000', tomato: '#A83A45' }, // 바질 치킨 아보카도
      'menu-sw-2': { bread: '#856000', lettuce: '#27765B', filling1: '#A83A45', filling2: '#856000', tomato: '#A83A45' }, // 이탈리안 비엠티 클럽
      'menu-sw-3': { bread: '#856000', lettuce: '#27765B', filling1: '#856000', filling2: '#A83A45', tomato: '#856000' }, // 트러플 에그마요 베이컨
      'menu-sw-4': { bread: '#856000', lettuce: '#27765B', filling1: '#A83A45', filling2: '#4A605A', tomato: '#A83A45' }, // 로스트 비프
      'menu-sw-5': { bread: '#856000', lettuce: '#27765B', filling1: '#856000', filling2: '#243B35', tomato: '#856000' }, // 구운 단호박 & 리코타
      'menu-sw-6': { bread: '#856000', lettuce: '#27765B', filling1: '#856000', filling2: '#856000', tomato: '#3E762B' }, // 레몬 딜 쉬림프
      'menu-bev-1': { type: 'bev', liquid: '#243B35', top: '#856000', garnish: '#856000' }, // 아메리카노
      'menu-bev-2': { type: 'bev', liquid: '#856000', top: '#243B35', garnish: '#856000' }, // 바닐라 빈 라떼
      'menu-bev-3': { type: 'bev', liquid: '#A83A45', top: '#243B35', garnish: '#856000' }, // 자몽 에이드
      'menu-bev-4': { type: 'bev', liquid: '#A83A45', top: '#243B35', garnish: '#A83A45' }, // 생딸기 요거트 스무디
      'menu-bev-5': { type: 'bev', liquid: '#3E762B', top: '#243B35', garnish: '#27765B' }  // 시트러스 민트 콤부차
    };

    const p = palettes[id] || (menu && menu.category === 'BEVERAGE' ? palettes['menu-bev-1'] : palettes['menu-sw-1']);

    if (p.type === 'bev') {
      return `
        <svg viewBox="0 0 320 240" role="img" aria-label="${label}">
          <rect width="320" height="240" fill="#243B35" />
          <circle cx="160" cy="126" r="84" fill="#243B35" stroke="#243B35" stroke-width="2" />
          <!-- 컵 몸체 -->
          <path d="M116 78 h88 l-10 112 a12 12 0 0 1 -12 10 h-44 a12 12 0 0 1 -12 -10 z" fill="${p.liquid}" />
          <!-- 크림/거품 층 -->
          <path d="M114 78 q46 -18 92 0 v18 h-92 z" fill="${p.top}" />
          <!-- 얼음 큐브 질감 -->
          <rect x="130" y="102" width="22" height="20" rx="4" fill="#243B35" fill-opacity="0.45" />
          <rect x="164" y="108" width="24" height="20" rx="4" fill="#243B35" fill-opacity="0.4" />
          <rect x="145" y="134" width="22" height="20" rx="4" fill="#243B35" fill-opacity="0.35" />
          <!-- 돔 리드 & 스트로우 -->
          <path d="M110 78 a50 34 0 0 1 100 0 z" fill="#243B35" fill-opacity="0.55" stroke="#243B35" stroke-width="2" />
          <path d="M168 32 l-12 72" stroke="#27765B" stroke-width="7" stroke-linecap="round" />
          <circle cx="188" cy="76" r="10" fill="${p.garnish}" />
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 320 240" role="img" aria-label="${label}">
        <rect width="320" height="240" fill="#243B35" />
        <!-- 자연광 플레이트 배경 도형 -->
        <ellipse cx="160" cy="176" rx="118" ry="26" fill="#243B35" stroke="#243B35" stroke-width="2" />
        <!-- 하단 브레드 베이스 -->
        <path d="M62 152 q98 22 196 0 l-8 20 q-90 18 -180 0 z" fill="${p.bread}" />
        <!-- 메인 속재료 층 (치즈/에그/치킨/아보카도) -->
        <rect x="68" y="134" width="184" height="18" rx="9" fill="${p.filling2}" />
        <rect x="74" y="118" width="172" height="18" rx="9" fill="${p.filling1}" />
        <!-- 슬라이스 토마토 -->
        <rect x="82" y="104" width="68" height="14" rx="7" fill="${p.tomato}" />
        <rect x="166" y="104" width="68" height="14" rx="7" fill="${p.tomato}" />
        <!-- 신선한 양상추 물결 층 -->
        <path d="M58 104 q16 -16 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 l-6 12 h-180 z" fill="${p.lettuce}" />
        <!-- 상단 브리오슈/위트 브레드 & 참깨/귀리 씨앗 디테일 -->
        <path d="M60 98 C60 52, 260 52, 260 98 Z" fill="${p.bread}" />
        <ellipse cx="122" cy="72" rx="5" ry="2.5" fill="#243B35" />
        <ellipse cx="156" cy="66" rx="5" ry="2.5" fill="#243B35" />
        <ellipse cx="192" cy="73" rx="5" ry="2.5" fill="#243B35" />
        <ellipse cx="140" cy="82" rx="4" ry="2" fill="#243B35" />
        <ellipse cx="176" cy="81" rx="4" ry="2" fill="#243B35" />
      </svg>
    `;
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      screen: 'START',
      historyStack: [],
      orderType: 'DINE_IN',
      selectedCategory: 'RECOMMENDED',
      activeMenuId: null,
      editingCartItemId: null,
      detailQuantity: 1,
      detailSelections: {},
      detailErrorGroupId: null,
      detailErrorMessage: '',
      cart: [],
      customerRequest: '',
      selectedPaymentMethod: 'KAKAOPAY',
      paymentState: 'IDLE',
      paymentFailReason: '',
      activeOrderId: 'ord-1001',
      myOrderIds: ['ord-1001', 'ord-1002', 'ord-1003'],
      simInvalidLink: false,
      simNetworkOffline: false,
      simPaymentBehavior: 'SUCCESS'
    };
  }

  let session = loadSession();
  let storeState = window.KioskStore.loadState();
  let isFinalizingOrder = false;

  function saveSession() {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {}
  }

  function showToast(msg) {
    const toast = document.getElementById('live-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.hidden = true;
    }, 4000);
  }

  function navigateTo(screen, pushHistory = true) {
    if (pushHistory && session.screen !== screen) {
      session.historyStack.push(session.screen);
    }
    session.screen = screen;
    saveSession();
    render();
    const mainEl = document.getElementById('main-content');
    if (mainEl) mainEl.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    if (session.screen === 'PAYMENT' && session.paymentState === 'PROCESSING') {
      showToast('Checking the payment result. Please wait a moment.');
      return;
    }
    if (session.historyStack.length > 0) {
      session.screen = session.historyStack.pop();
    } else {
      session.screen = 'START';
    }
    saveSession();
    render();
  }

  function getStoreAvailability() {
    if (session.simInvalidLink) {
      return {
        canOrder: false,
        code: 'INVALID_LINK',
        badgeText: 'Invalid link',
        badgeClass: 'badge-error',
        iconType: 'error',
        title: 'This store order link isn\'t valid',
        reason: 'The QR code or order address you used has expired. Please scan the QR code in the store again.'
      };
    }
    if (session.simNetworkOffline) {
      return {
        canOrder: false,
        code: 'OFFLINE',
        badgeText: 'Check your network',
        badgeClass: 'badge-error',
        iconType: 'error',
        title: 'Network connection lost',
        reason: 'Your chosen menu items and cart are saved on your device. Check your Wi-Fi or mobile data and try again.'
      };
    }
    if (storeState.store.isForceClosed) {
      return {
        canOrder: false,
        code: 'CLOSED',
        badgeText: 'Closed',
        badgeClass: 'badge-closed',
        iconType: 'error',
        title: 'Orders aren\'t open right now',
        reason: `Store order hours are ${storeState.store.orderStartTime} ~ ${storeState.store.orderEndTime}. Please come back during opening hours.`
      };
    }
    if (storeState.store.isOrderPaused) {
      return {
        canOrder: false,
        code: 'PAUSED',
        badgeText: 'Orders paused',
        badgeClass: 'badge-paused',
        iconType: 'warning',
        title: 'Mobile orders are paused for a moment',
        reason: storeState.store.pauseMessage || 'The store is busy with orders; please try again shortly.'
      };
    }
    return {
      canOrder: true,
      code: 'OPEN',
      badgeText: 'Open for orders',
      badgeClass: 'badge-open',
      iconType: 'check',
      title: 'You can order right now',
      reason: ''
    };
  }

  function getCartTotalInfo() {
    const validation = window.KioskStore.validateCartItems(storeState, session.cart);
    let totalQty = 0;
    let totalAmount = 0;
    validation.items.forEach(function (item) {
      totalQty += item.quantity;
      totalAmount += item.totalPrice;
    });
    return {
      totalQty: totalQty,
      totalAmount: totalAmount,
      discountAmount: 0,
      finalAmount: totalAmount,
      validation: validation
    };
  }

  function openMenuDetail(menuId, editingCartItem) {
    const menu = storeState.menus.find((m) => m.id === menuId);
    if (!menu) return;
    if (menu.isSoldOut && !editingCartItem) {
      showToast('Sold-out items can\'t be selected.');
      return;
    }

    session.activeMenuId = menuId;
    session.detailErrorGroupId = null;
    session.detailErrorMessage = '';

    const optionGroups = window.KioskStore.getMenuOptionGroups(storeState, menu);
    if (editingCartItem) {
      session.editingCartItemId = editingCartItem.cartItemId;
      session.detailQuantity = editingCartItem.quantity;
      const map = {};
      optionGroups.forEach((g) => {
        map[g.id] = [];
      });
      (editingCartItem.selectedOptions || []).forEach((sel) => {
        if (!map[sel.groupId]) map[sel.groupId] = [];
        const grp = optionGroups.find((g) => g.id === sel.groupId);
        const opt = grp ? grp.items.find((i) => i.id === sel.itemId) : null;
        if (opt && !opt.soldOut) {
          map[sel.groupId].push(sel.itemId);
        }
      });
      session.detailSelections = map;
    } else {
      session.editingCartItemId = null;
      session.detailQuantity = 1;
      const map = {};
      optionGroups.forEach((g) => {
        map[g.id] = [];
      });
      session.detailSelections = map;
    }
    navigateTo('MENU_DETAIL');
  }

  function calculateDetailPricing(menu) {
    if (!menu) return { unitPrice: 0, totalPrice: 0, missingGroups: [], soldOutSelected: [] };
    const optionGroups = window.KioskStore.getMenuOptionGroups(storeState, menu);
    let optionSum = 0;
    const missingGroups = [];
    const soldOutSelected = [];

    optionGroups.forEach(function (grp) {
      const selectedIds = session.detailSelections[grp.id] || [];
      const validSelectedIds = [];
      selectedIds.forEach(function (id) {
        const item = grp.items.find((i) => i.id === id);
        if (item) {
          if (item.soldOut) {
            soldOutSelected.push({ groupName: grp.name, itemName: item.name });
          } else {
            validSelectedIds.push(id);
            optionSum += item.price;
          }
        }
      });

      if (grp.required && validSelectedIds.length < (grp.minSelect || 1)) {
        missingGroups.push(grp);
      }
    });

    const unitPrice = menu.price + optionSum;
    return {
      unitPrice: unitPrice,
      totalPrice: unitPrice * session.detailQuantity,
      missingGroups: missingGroups,
      soldOutSelected: soldOutSelected
    };
  }

  /* ============================================================================
   * 공통 상단 헤더 & 하단 고정 바 업데이트 (Section 11 문구 스타일 준수)
   * ============================================================================ */

  function renderHeaderAndFooter() {
    const storeNameEl = document.getElementById('header-store-name');
    const screenTitleEl = document.getElementById('header-screen-title');
    const backBtn = document.getElementById('header-back-btn');
    const cartBtn = document.getElementById('header-cart-btn');
    const cartCountEl = document.getElementById('header-cart-count');
    const orderStatusBtn = document.getElementById('header-order-status-btn');
    const activeOrderLabel = document.getElementById('header-active-order-label');
    const offlineBanner = document.getElementById('offline-banner');

    if (storeNameEl) {
      storeNameEl.textContent = session.simInvalidLink ? 'Check the store' : storeState.store.name;
    }
    if (screenTitleEl) {
      screenTitleEl.textContent = SCREEN_TITLES[session.screen] || 'Order';
    }
    if (backBtn) {
      backBtn.hidden = session.screen === 'START';
    }
    if (offlineBanner) {
      offlineBanner.hidden = !session.simNetworkOffline;
    }

    const cartInfo = getCartTotalInfo();
    if (cartCountEl) {
      cartCountEl.textContent = String(cartInfo.totalQty);
    }
    if (cartBtn) {
      cartBtn.hidden = session.screen === 'PAYMENT' && session.paymentState === 'PROCESSING';
    }

    const activeOrder =
      storeState.orders.find((o) => o.id === session.activeOrderId) ||
      storeState.orders[0];
    if (orderStatusBtn && activeOrder) {
      orderStatusBtn.hidden = false;
      const stMeta = window.KioskStore.ORDER_STATUS[activeOrder.status] || { customerLabel: activeOrder.status };
      activeOrderLabel.textContent = `${activeOrder.orderNumber} · ${stMeta.customerLabel}`;
    }

    const footer = document.getElementById('app-footer');
    const reasonBox = document.getElementById('footer-reason-box');
    const reasonText = document.getElementById('footer-reason-text');
    const priceLabel = document.getElementById('footer-price-label');
    const priceValue = document.getElementById('footer-price-value');
    const actionsContainer = document.getElementById('footer-actions');

    if (!footer || !actionsContainer) return;

    const avail = getStoreAvailability();
    reasonBox.hidden = true;
    actionsContainer.innerHTML = '';

    if (session.screen === 'START') {
      priceLabel.textContent = 'Chosen dining option';
      priceValue.textContent = session.orderType === 'DINE_IN' ? 'Dine-in' : 'Takeaway';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-primary btn-thumb';
      btn.textContent = 'Start order';
      if (!avail.canOrder) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        reasonText.textContent = avail.title;
      }
      btn.addEventListener('click', function () {
        if (!avail.canOrder) return;
        navigateTo('MENU_LIST');
      });
      actionsContainer.appendChild(btn);
    } else if (session.screen === 'MENU_LIST') {
      priceLabel.textContent = `Order total (${cartInfo.totalQty} items)`;
      priceValue.textContent = window.KioskStore.formatPrice(cartInfo.totalAmount);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-primary btn-thumb';
      btn.textContent = cartInfo.totalQty > 0 ? `View cart (${cartInfo.totalQty})` : 'View cart';
      if (cartInfo.totalQty === 0) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        reasonText.textContent = 'Choose menu items and add them to your cart.';
      }
      btn.addEventListener('click', function () {
        navigateTo('CART');
      });
      actionsContainer.appendChild(btn);
    } else if (session.screen === 'MENU_DETAIL') {
      const menu = storeState.menus.find((m) => m.id === session.activeMenuId);
      const pricing = calculateDetailPricing(menu);
      priceLabel.textContent = `Item price (${session.detailQuantity})`;
      priceValue.textContent = window.KioskStore.formatPrice(pricing.totalPrice);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-primary btn-thumb';
      btn.textContent = session.editingCartItemId ? 'Save option changes' : 'Add to cart';

      if (!menu || menu.isSoldOut) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        reasonText.textContent = 'This item is sold out. Please choose another.';
      } else if (pricing.soldOutSelected.length > 0) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        reasonText.textContent = `The ${pricing.soldOutSelected.map((s) => s.itemName).join(', ')} option is sold out. Please choose another option.`;
      } else if (pricing.missingGroups.length > 0) {
        btn.disabled = true;
        btn.setAttribute('aria-describedby', 'footer-reason-text');
        reasonBox.hidden = false;
        // 11. 문구 스타일 좋은 예: "빵 종류를 선택해 주세요."
        const firstMissing = pricing.missingGroups[0].name;
        reasonText.textContent =
          pricing.missingGroups.length === 1
            ? `Please choose ${firstMissing}.`
            : `Please choose ${pricing.missingGroups.map((g) => g.name).join(', ')}.`;
      }

      btn.addEventListener('click', function () {
        handleAddOrUpdateCart(menu, pricing);
      });
      actionsContainer.appendChild(btn);
    } else if (session.screen === 'CART') {
      priceLabel.textContent = 'Total to pay';
      priceValue.textContent = window.KioskStore.formatPrice(cartInfo.finalAmount);

      const addMoreBtn = document.createElement('button');
      addMoreBtn.type = 'button';
      addMoreBtn.className = 'btn-secondary';
      addMoreBtn.textContent = 'Add more items';
      addMoreBtn.addEventListener('click', function () {
        navigateTo('MENU_LIST');
      });

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'btn-primary';
      nextBtn.textContent = 'Confirm order';

      const maxQty = storeState.store.maxOrderQty || 20;
      if (session.cart.length === 0) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = 'Your cart is empty. Add menu items first.';
      } else if (!avail.canOrder) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = avail.title;
      } else if (cartInfo.validation.hasBlockingIssues) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = 'Some items or options are sold out. Change or remove them.';
      } else if (cartInfo.validation.hasPriceChanges) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = 'Some prices have changed. Tap the Apply latest prices button.';
      } else if (cartInfo.totalQty > maxQty) {
        nextBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = `You can order up to ${maxQty} at a time. Please lower the quantity.`;
      }

      nextBtn.addEventListener('click', function () {
        navigateTo('ORDER_CONFIRM');
      });

      actionsContainer.appendChild(addMoreBtn);
      actionsContainer.appendChild(nextBtn);
    } else if (session.screen === 'ORDER_CONFIRM') {
      priceLabel.textContent = 'Total payment';
      priceValue.textContent = window.KioskStore.formatPrice(cartInfo.finalAmount);

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn-secondary';
      editBtn.textContent = 'Change order';
      editBtn.addEventListener('click', function () {
        navigateTo('CART');
      });

      const payBtn = document.createElement('button');
      payBtn.type = 'button';
      payBtn.className = 'btn-primary';
      payBtn.textContent = 'Pay';

      if (!avail.canOrder || cartInfo.validation.hasIssues || session.cart.length === 0) {
        payBtn.disabled = true;
        reasonBox.hidden = false;
        reasonText.textContent = !avail.canOrder ? avail.title : 'Please check the status of items in your cart first.';
      }

      payBtn.addEventListener('click', function () {
        session.paymentState = 'IDLE';
        session.paymentFailReason = '';
        navigateTo('PAYMENT');
      });

      actionsContainer.appendChild(editBtn);
      actionsContainer.appendChild(payBtn);
    } else if (session.screen === 'PAYMENT') {
      priceLabel.textContent = 'Total payment';
      priceValue.textContent = window.KioskStore.formatPrice(cartInfo.finalAmount);

      const execPayBtn = document.createElement('button');
      execPayBtn.type = 'button';
      execPayBtn.className = 'btn-primary btn-thumb';

      if (session.paymentState === 'PROCESSING') {
        // 7. 장바구니와 결제: 결제 처리 중에는 버튼 문구를 '결제 확인 중'으로 바꾸고 중복 입력을 막습니다.
        execPayBtn.disabled = true;
        execPayBtn.textContent = 'Checking payment';
        reasonBox.hidden = false;
        reasonText.textContent = 'Checking the payment result. Don\'t tap the button again.';
      } else if (session.paymentState === 'UNCERTAIN') {
        execPayBtn.disabled = true;
        execPayBtn.textContent = 'Checking payment';
        reasonBox.hidden = false;
        reasonText.textContent = 'Checking the payment result. Don\'t tap the button again.';
      } else if (!session.selectedPaymentMethod) {
        execPayBtn.disabled = true;
        execPayBtn.textContent = 'Pay';
        reasonBox.hidden = false;
        reasonText.textContent = 'Please choose a payment method.';
      } else {
        execPayBtn.textContent = session.paymentState === 'FAILED' ? 'Pay again' : 'Pay';
      }

      execPayBtn.addEventListener('click', function () {
        executePayment();
      });
      actionsContainer.appendChild(execPayBtn);
    } else if (session.screen === 'ORDER_COMPLETE') {
      const ord = storeState.orders.find((o) => o.id === session.activeOrderId);
      priceLabel.textContent = 'Payment amount';
      priceValue.textContent = ord ? window.KioskStore.formatPrice(ord.finalAmount) : '₦0';

      const statusBtn = document.createElement('button');
      statusBtn.type = 'button';
      statusBtn.className = 'btn-primary btn-thumb';
      statusBtn.textContent = 'Check order status';
      statusBtn.addEventListener('click', function () {
        navigateTo('ORDER_STATUS');
      });
      actionsContainer.appendChild(statusBtn);
    } else if (session.screen === 'ORDER_STATUS') {
      const ord = storeState.orders.find((o) => o.id === session.activeOrderId) || storeState.orders[0];
      priceLabel.textContent = ord ? `Order no. ${ord.orderNumber}` : 'Order details';
      priceValue.textContent = ord ? window.KioskStore.formatPrice(ord.finalAmount) : '₦0';

      const newOrderBtn = document.createElement('button');
      newOrderBtn.type = 'button';
      newOrderBtn.className = 'btn-primary btn-thumb';
      newOrderBtn.textContent = 'Order more';
      newOrderBtn.addEventListener('click', function () {
        navigateTo('MENU_LIST');
      });
      actionsContainer.appendChild(newOrderBtn);
    }
  }

  function handleAddOrUpdateCart(menu, pricing) {
    if (!menu || pricing.missingGroups.length > 0 || pricing.soldOutSelected.length > 0) return;

    const optionGroups = window.KioskStore.getMenuOptionGroups(storeState, menu);
    const selectedOptions = [];
    let optionPrice = 0;

    optionGroups.forEach(function (grp) {
      const ids = session.detailSelections[grp.id] || [];
      ids.forEach(function (itemId) {
        const opt = grp.items.find((i) => i.id === itemId);
        if (opt && !opt.soldOut) {
          selectedOptions.push({
            groupId: grp.id,
            groupName: grp.name,
            itemId: opt.id,
            itemName: opt.name,
            price: opt.price
          });
          optionPrice += opt.price;
        }
      });
    });

    const unitPrice = menu.price + optionPrice;
    const cartEntry = {
      cartItemId: session.editingCartItemId || 'ci-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      menuId: menu.id,
      menuName: menu.name,
      category: menu.category,
      basePrice: menu.price,
      optionPrice: optionPrice,
      unitPrice: unitPrice,
      quantity: session.detailQuantity,
      totalPrice: unitPrice * session.detailQuantity,
      selectedOptions: selectedOptions
    };

    if (session.editingCartItemId) {
      const idx = session.cart.findIndex((c) => c.cartItemId === session.editingCartItemId);
      if (idx >= 0) {
        session.cart[idx] = cartEntry;
      }
      session.editingCartItemId = null;
      showToast('Options and quantity updated.');
      navigateTo('CART');
    } else {
      session.cart.push(cartEntry);
      showToast(`Added ${menu.name} to your cart.`);
      navigateTo('MENU_LIST');
    }
  }

  function executePayment() {
    if (session.paymentState === 'PROCESSING' || session.paymentState === 'UNCERTAIN') return;
    const avail = getStoreAvailability();
    if (!avail.canOrder) {
      session.paymentState = 'FAILED';
      session.paymentFailReason = `${avail.title} (${avail.reason})`;
      render();
      return;
    }

    session.paymentState = 'PROCESSING';
    session.paymentFailReason = '';
    render();

    setTimeout(function () {
      if (session.simNetworkOffline) {
        session.paymentState = 'UNCERTAIN';
        saveSession();
        render();
        return;
      }

      if (session.simPaymentBehavior === 'FAIL') {
        session.paymentState = 'FAILED';
        session.paymentFailReason =
          'Payment wasn\'t completed because the card limit was exceeded or approval was declined. Choose another payment method or check your limit and try again.';
        saveSession();
        render();
        return;
      }

      if (session.simPaymentBehavior === 'UNCERTAIN') {
        session.paymentState = 'UNCERTAIN';
        saveSession();
        render();
        return;
      }

      finalizeOrderCreation();
    }, 900);
  }

  async function saveOrderToSheet(orderSequence) {
    const response = await fetch(ORDER_API_URL, {
      method: 'POST',
      headers: {
        // text/plain을 사용하면 Apps Script 호출 시 CORS 사전 요청을 피할 수 있습니다.
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        order_number: orderSequence,
        bill_state: 'Paid',
        order_type: session.orderType === 'DINE_IN' ? 'Dine-in' : 'Takeaway',
        // 현재 화면에서 제공하는 결제 수단은 카드 및 카드 기반 간편결제입니다.
        bill_type: 'Card'
      })
    });

    if (!response.ok) {
      throw new Error(`Order API response error (${response.status})`);
    }

    const result = await response.json();
    if (!result || !result.ok) {
      throw new Error((result && result.message) || 'Failed to save the order.');
    }

    return result.data;
  }

  async function finalizeOrderCreation() {
    if (isFinalizingOrder) return;
    isFinalizingOrder = true;

    const cartInfo = getCartTotalInfo();
    let createdOrder = null;
    let orderSequence = null;
    let savedSheetOrder = null;

    session.paymentState = 'PROCESSING';
    session.paymentFailReason = '';
    saveSession();
    render();

    try {
      // 여러 탭에서 동시에 주문하더라도 고객 주문번호가 겹치지 않도록 먼저 번호를 예약합니다.
      storeState = window.KioskStore.saveState(function (state) {
        orderSequence = state.nextOrderSequence || 104;
        state.nextOrderSequence = orderSequence + 1;
        return state;
      });

      savedSheetOrder = await saveOrderToSheet(orderSequence);
    } catch (error) {
      session.paymentState = 'FAILED';
      session.paymentFailReason =
        'Failed to save order data. Check your network connection and try again. (' +
        (error && error.message ? error.message : 'Unknown error') +
        ')';
      saveSession();
      render();
      isFinalizingOrder = false;
      return;
    }

    storeState = window.KioskStore.saveState(
      function (state) {
        const orderNumber = 'A-' + orderSequence;

        const now = new Date().toISOString();
        const pmMeta = window.KioskStore.PAYMENT_METHODS[session.selectedPaymentMethod] || { name: 'Mobile pay' };

        createdOrder = {
          id: 'ord-' + Date.now(),
          orderNumber: orderNumber,
          createdAt: now,
          paidAt: now,
          orderType: session.orderType,
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentMethod: session.selectedPaymentMethod,
          sheetOrderIdx: savedSheetOrder && savedSheetOrder.idx,
          sheetSavedAt: savedSheetOrder && savedSheetOrder.order_date,
          customerRequest: (session.customerRequest || '').trim(),
          totalAmount: cartInfo.totalAmount,
          discountAmount: cartInfo.discountAmount,
          finalAmount: cartInfo.finalAmount,
          estimatedPrepMinutes: state.store.estimatedPrepMinutes || 10,
          cancelReason: '',
          refundStatus: '',
          items: cartInfo.validation.items.map(function (it, i) {
            return {
              id: 'ord-item-' + i + '-' + Date.now(),
              menuId: it.menuId,
              menuName: it.menuName,
              category: it.category,
              basePrice: it.latestBasePrice,
              optionPrice: it.latestOptionPrice,
              unitPrice: it.latestUnitPrice,
              quantity: it.quantity,
              totalPrice: it.latestTotalPrice,
              selectedOptions: it.selectedOptions
            };
          }),
          history: [
            {
              status: 'PAID',
              note: `Customer mobile payment complete (${pmMeta.name})`,
              actor: 'Customer',
              timestamp: now
            }
          ]
        };

        state.orders.unshift(createdOrder);
        return state;
      },
      {
        event: 'NEW_ORDER_CREATED',
        audit: {
          category: 'New order',
          action: 'Registered new mobile order waiting to be accepted',
          actor: 'Customer mobile'
        }
      }
    );

    if (createdOrder) {
      session.activeOrderId = createdOrder.id;
      if (!session.myOrderIds.includes(createdOrder.id)) {
        session.myOrderIds.unshift(createdOrder.id);
      }
      session.cart = [];
      session.customerRequest = '';
      session.paymentState = 'SUCCESS';
      saveSession();
      navigateTo('ORDER_COMPLETE', false);
    }

    isFinalizingOrder = false;
  }

  /* ============================================================================
   * 1 ~ 8번 화면 렌더링 (Fresh Route 콘셉트)
   * ============================================================================ */

  function renderStartScreen(main) {
    const avail = getStoreAvailability();
    const store = storeState.store;
    const signatureMenu = storeState.menus[0];
    const activeOrders = storeState.orders.filter(
      (o) => session.myOrderIds.includes(o.id) && o.status !== 'PICKED_UP'
    );

    let activeOrderBannerHtml = '';
    if (activeOrders.length > 0) {
      const latest = activeOrders[0];
      const stMeta = window.KioskStore.ORDER_STATUS[latest.status] || { customerLabel: latest.status };
      activeOrderBannerHtml = `
        <section class="card" style="border-color: var(--color-info); background: var(--color-info-light);" aria-label="Order in progress">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
            <div>
              <span class="status-badge badge-info">${getFilledStatusIcon('info')} Order in progress</span>
              <p style="margin:6px 0 0; font-weight:700; font-size:var(--text-body);">
                Order no. ${latest.orderNumber} · ${stMeta.customerLabel}
              </p>
            </div>
            <button type="button" id="start-goto-status-btn" class="btn-outline" style="min-height:44px; padding:8px 14px; font-size:var(--text-caption);">
              View status
            </button>
          </div>
        </section>
      `;
    }

    let exceptionAlertHtml = '';
    if (!avail.canOrder) {
      exceptionAlertHtml = `
        <section class="card" style="border:2px solid var(--color-error); background:var(--color-error-light);" role="alert">
          <h2 class="section-title" style="color:var(--color-error); font-size:var(--text-card-title);">
            <span>${getFilledStatusIcon('error')} ${avail.title}</span>
          </h2>
          <p style="margin:0 0 8px; font-size:var(--text-body); color:var(--color-text);">
            ${avail.reason}
          </p>
          <div style="font-size:var(--text-caption); color:var(--color-text-muted); font-weight:600;">
            Order hours: ${store.orderStartTime} ~ ${store.orderEndTime} · Contact: ${store.phone}
          </div>
        </section>
      `;
    }

    // 7. 시작 화면: 전체 화면 광고 대신 매장명과 주문 가능 상태를 먼저 표시 + 상단 35~40% 대표 샌드위치 사진 + 식사 방식 큰 선택 카드
    main.innerHTML = `
      ${activeOrderBannerHtml}
      ${exceptionAlertHtml}

      <section class="start-store-header" aria-label="Store name and order availability">
        <div class="start-store-top">
          <span class="status-badge ${avail.badgeClass}">
            ${getFilledStatusIcon(avail.iconType)}
            <span>${avail.badgeText}</span>
          </span>
          <span style="font-size:var(--text-caption); color:var(--color-text-muted);">
            Est. prep about ${store.estimatedPrepMinutes} min
          </span>
        </div>
        <h2 class="display-title">${session.simInvalidLink ? 'Check the store' : store.name}</h2>
        <p style="margin:4px 0 0; font-size:var(--text-caption); color:var(--color-text-muted);">
          ${store.address} · ${store.phone}
        </p>
      </section>

      <section class="start-hero-card" aria-label="Featured menu visual and opening hours">
        <div class="start-hero-visual">
          ${renderFoodVisualSvg(signatureMenu)}
        </div>
        <div class="start-hero-meta">
          <div class="meta-item">
            <span class="meta-label">Order hours</span>
            <strong class="meta-value">${store.orderStartTime} ~ ${store.orderEndTime}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">Est. prep time</span>
            <strong class="meta-value">About ${store.estimatedPrepMinutes} min</strong>
          </div>
        </div>
      </section>

      <section aria-labelledby="order-type-heading">
        <h2 id="order-type-heading" class="section-title">
          <span>Choose how you'll eat</span>
          <span class="status-badge badge-required">Required</span>
        </h2>
        <div class="order-type-grid">
          <button
            type="button"
            class="order-type-btn"
            data-order-type="DINE_IN"
            aria-pressed="${session.orderType === 'DINE_IN'}"
            ${!store.allowDineIn || !avail.canOrder ? 'disabled' : ''}
          >
            <div class="order-type-top">
              ${getLineIcon('dineIn')}
              ${session.orderType === 'DINE_IN' ? getFilledStatusIcon('check') : ''}
            </div>
            <div>
              <strong class="order-type-title" style="display:block;">Dine-in</strong>
              <span class="order-type-sub">${store.allowDineIn ? 'Served on a store tray' : 'Not available now'}</span>
            </div>
          </button>

          <button
            type="button"
            class="order-type-btn"
            data-order-type="TAKEOUT"
            aria-pressed="${session.orderType === 'TAKEOUT'}"
            ${!store.allowTakeout || !avail.canOrder ? 'disabled' : ''}
          >
            <div class="order-type-top">
              ${getLineIcon('takeout')}
              ${session.orderType === 'TAKEOUT' ? getFilledStatusIcon('check') : ''}
            </div>
            <div>
              <strong class="order-type-title" style="display:block;">Takeaway</strong>
              <span class="order-type-sub">${store.allowTakeout ? 'Served in takeaway packaging' : 'Not available now'}</span>
            </div>
          </button>
        </div>
      </section>
    `;

    const statusBtn = document.getElementById('start-goto-status-btn');
    if (statusBtn) {
      statusBtn.addEventListener('click', function () {
        navigateTo('ORDER_STATUS');
      });
    }

    main.querySelectorAll('.order-type-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        session.orderType = btn.getAttribute('data-order-type');
        saveSession();
        render();
      });
    });
  }

  function renderMenuListScreen(main) {
    const categories = [
      { id: 'RECOMMENDED', label: 'Recommended' },
      { id: 'SANDWICH', label: 'Sandwich' },
      { id: 'BEVERAGE', label: 'Drink' }
    ];

    const sortedMenus = storeState.menus
      .filter(function (m) {
        if (!m.isSelling) return false;
        if (m.isSoldOut && !storeState.store.ShowSoldOutMenus) return false;
        if (session.selectedCategory === 'RECOMMENDED') return m.isRecommended;
        return m.category === session.selectedCategory;
      })
      .sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));

    const tabsHtml = categories
      .map(function (c) {
        const selected = session.selectedCategory === c.id;
        return `
          <button
            type="button"
            role="tab"
            class="category-tab"
            data-cat="${c.id}"
            aria-selected="${selected}"
          >
            ${c.label}
          </button>
        `;
      })
      .join('');

    // 7. 메뉴 목록: 2열 카드, 사진(4:3) -> 이름(최대 두 줄) -> 가격 -> 배지 순서
    const cardsHtml = sortedMenus
      .map(function (menu) {
        const badges = [];
        if (menu.isRecommended || (menu.badge && menu.badge.includes('Popular'))) {
          badges.push(`<span class="status-badge badge-recommend">${getFilledStatusIcon('star')} Pick</span>`);
        }
        if (menu.badge && menu.badge.includes('New')) {
          badges.push(`<span class="status-badge badge-new">New</span>`);
        } else if (menu.badge && !menu.badge.includes('Popular')) {
          badges.push(`<span class="status-badge badge-optional">${menu.badge}</span>`);
        }
        if (menu.isSoldOut) {
          badges.push(`<span class="status-badge badge-soldout">Sold out</span>`);
        }

        return `
          <li class="menu-card ${menu.isSoldOut ? 'is-soldout' : ''}">
            <button
              type="button"
              class="menu-card-btn"
              data-menu-id="${menu.id}"
              ${menu.isSoldOut ? 'disabled aria-disabled="true"' : ''}
              aria-label="${menu.name}, ${window.KioskStore.formatPrice(menu.price)}${menu.isSoldOut ? ', sold out' : ''}"
            >
              <div class="menu-photo-wrap">
                ${renderFoodVisualSvg(menu)}
                ${
                  menu.isSoldOut
                    ? `<span class="soldout-overlay-pill">
                        ${getFilledStatusIcon('error')}
                        <span>Sold out</span>
                      </span>`
                    : ''
                }
              </div>
              <div class="menu-card-body">
                <h3 class="menu-name">${menu.name}</h3>
                <strong class="menu-price">${window.KioskStore.formatPrice(menu.price)}</strong>
                <div class="menu-badges">${badges.join('')}</div>
              </div>
            </button>
          </li>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="category-tabs-sticky">
        <div class="category-tabs" role="tablist" aria-label="Menu categories">
          ${tabsHtml}
        </div>
      </div>

      <section aria-label="Menu list">
        <ul class="menu-grid" role="list">
          ${cardsHtml || '<li class="card" style="grid-column: 1 / -1;">No menu items to show.</li>'}
        </ul>
      </section>
    `;

    main.querySelectorAll('.category-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        session.selectedCategory = tab.getAttribute('data-cat');
        saveSession();
        render();
      });
    });

    main.querySelectorAll('.menu-card-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const menuId = btn.getAttribute('data-menu-id');
        openMenuDetail(menuId, null);
      });
    });
  }

  function renderMenuDetailScreen(main) {
    const menu = storeState.menus.find((m) => m.id === session.activeMenuId);
    if (!menu) {
      main.innerHTML = `<div class="card"><p>Couldn't find the menu info.</p></div>`;
      return;
    }

    const optionGroups = window.KioskStore.getMenuOptionGroups(storeState, menu);
    const tempSelections = session.detailSelections['opt-temp'] || [];
    const isHotBeverage = tempSelections.includes('temp-hot');

    // 7. 메뉴 상세와 옵션: 필수 옵션 제목에 '필수' 배지, 선택된 옵션은 연한 초록 배경과 체크 아이콘, 추가 금액은 오른쪽 정렬
    const groupsHtml = optionGroups
      .map(function (grp) {
        const selectedIds = session.detailSelections[grp.id] || [];
        const isSingle = grp.maxSelect === 1 && grp.required;
        const hasError = session.detailErrorGroupId === grp.id;

        const ruleDesc = grp.required
          ? `Choose ${grp.minSelect} (required)`
          : `Choose up to ${grp.maxSelect} (${selectedIds.length}/${grp.maxSelect})`;

        const itemsHtml = grp.items
          .map(function (item) {
            const isChecked = selectedIds.includes(item.id);
            const isSoldOut = Boolean(item.soldOut);
            const priceLabel = item.price > 0 ? `+${window.KioskStore.formatPrice(item.price)}` : '+₦0';

            return `
              <label class="option-item-label ${isChecked ? 'is-checked' : ''} ${isSoldOut ? 'is-soldout' : ''}">
                <span class="option-item-left">
                  <input
                    type="${isSingle ? 'radio' : 'checkbox'}"
                    name="group-${grp.id}"
                    value="${item.id}"
                    data-group-id="${grp.id}"
                    data-item-id="${item.id}"
                    ${isChecked ? 'checked' : ''}
                    ${isSoldOut ? 'disabled' : ''}
                  />
                  <span class="option-check-indicator" aria-hidden="true">
                    ${getFilledStatusIcon('checkMarkOnly')}
                  </span>
                  <span>
                    <strong style="font-weight:600;">${item.name}</strong>
                    ${
                      isSoldOut
                        ? `<span class="status-badge badge-soldout" style="margin-left:6px;">Sold out</span>`
                        : ''
                    }
                  </span>
                </span>
                <span class="option-item-price">${priceLabel}</span>
              </label>
            `;
          })
          .join('');

        return `
          <section
            id="option-group-${grp.id}"
            class="option-group-card ${hasError ? 'has-error' : ''}"
            tabindex="-1"
            aria-labelledby="title-${grp.id}"
          >
            <div class="option-group-header">
              <h3 id="title-${grp.id}" class="option-group-title">${grp.name}</h3>
              <span class="status-badge ${grp.required ? 'badge-required' : 'badge-optional'}">
                ${grp.required ? 'Required' : 'Optional'}
              </span>
            </div>
            <p class="option-rule-text">${ruleDesc}</p>
            ${
              grp.id === 'opt-ice' && isHotBeverage
                ? `<div class="option-error-msg" style="background:var(--color-info-light); color:var(--color-info); border-color:rgba(43,92,166,0.55);">
                    ${getFilledStatusIcon('info')}
                    <span>Hot drinks (HOT) come with no ice by default.</span>
                  </div>`
                : ''
            }
            ${
              hasError
                ? `<div class="option-error-msg" role="alert">
                    ${getFilledStatusIcon('error')}
                    <span>${session.detailErrorMessage}</span>
                  </div>`
                : ''
            }
            <div class="option-item-list">
              ${itemsHtml}
            </div>
          </section>
        `;
      })
      .join('');

    main.innerHTML = `
      <section class="detail-hero-card" aria-label="Selected item details">
        <div class="detail-photo-box">
          ${renderFoodVisualSvg(menu)}
        </div>
        <div class="detail-hero-content">
          <h2 class="screen-heading" style="margin-bottom:6px;">${menu.name}</h2>
          <p style="margin:0 0 12px; font-size:var(--text-body); color:var(--color-text-muted);">${menu.description}</p>
          <strong style="font-family:var(--font-mono); font-size:20px; color:var(--color-primary-dark);">
            Base price ${window.KioskStore.formatPrice(menu.price)}
          </strong>

          <div class="allergen-box">
            <div><strong>Allergens:</strong> ${menu.allergens || 'Ask the store'}</div>
            <div style="margin-top:4px;"><strong>Origin:</strong> ${menu.originInfo || 'Labeled in store'}</div>
          </div>
        </div>
      </section>

      ${groupsHtml}

      <section class="qty-control-row" aria-label="Choose quantity">
        <div>
          <strong style="font-size:var(--text-card-title); font-weight:600;">Qty</strong>
          <div style="font-size:var(--text-caption); color:var(--color-text-muted);">Up to ${storeState.store.maxOrderQty || 20}</div>
        </div>
        <div class="qty-stepper">
          <button type="button" id="detail-qty-minus" class="qty-btn" aria-label="Decrease quantity by 1" ${
            session.detailQuantity <= 1 ? 'disabled' : ''
          }>−</button>
          <span class="qty-value" aria-live="polite">${session.detailQuantity}</span>
          <button type="button" id="detail-qty-plus" class="qty-btn" aria-label="Increase quantity by 1" ${
            session.detailQuantity >= (storeState.store.maxOrderQty || 20) ? 'disabled' : ''
          }>+</button>
        </div>
      </section>
    `;

    main.querySelectorAll('input[data-group-id]').forEach(function (input) {
      input.addEventListener('change', function (ev) {
        const grpId = input.getAttribute('data-group-id');
        const itemId = input.getAttribute('data-item-id');
        const grp = optionGroups.find((g) => g.id === grpId);
        if (!grp) return;

        session.detailErrorGroupId = null;
        session.detailErrorMessage = '';

        const current = (session.detailSelections[grpId] || []).slice();
        if (grp.maxSelect === 1 && grp.required) {
          session.detailSelections[grpId] = [itemId];
          if (grpId === 'opt-temp' && itemId === 'temp-hot') {
            session.detailSelections['opt-ice'] = ['ice-none'];
          }
        } else {
          if (input.checked) {
            if (current.length >= grp.maxSelect) {
              ev.preventDefault();
              input.checked = false;
              session.detailErrorGroupId = grpId;
              session.detailErrorMessage = `You can choose up to ${grp.maxSelect} for ${grp.name}. Unselect one and try again.`;
              saveSession();
              render();
              const grpEl = document.getElementById('option-group-' + grpId);
              if (grpEl) {
                grpEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                grpEl.focus({ preventScroll: true });
              }
              return;
            }
            current.push(itemId);
          } else {
            const idx = current.indexOf(itemId);
            if (idx >= 0) current.splice(idx, 1);
          }
          session.detailSelections[grpId] = current;
        }
        saveSession();
        render();
      });
    });

    const minusBtn = document.getElementById('detail-qty-minus');
    const plusBtn = document.getElementById('detail-qty-plus');
    if (minusBtn) {
      minusBtn.addEventListener('click', function () {
        if (session.detailQuantity > 1) {
          session.detailQuantity -= 1;
          saveSession();
          render();
        }
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', function () {
        const max = storeState.store.maxOrderQty || 20;
        if (session.detailQuantity < max) {
          session.detailQuantity += 1;
          saveSession();
          render();
        }
      });
    }
  }

  function renderCartScreen(main) {
    const cartInfo = getCartTotalInfo();
    const validation = cartInfo.validation;

    if (session.cart.length === 0) {
      main.innerHTML = `
        <section class="card card-cut" style="text-align:center; padding:36px 16px;">
          <h2 class="section-title" style="justify-content:center;">Your cart is empty</h2>
          <p style="margin:0 0 20px; color:var(--color-text-muted); font-size:var(--text-body);">
            Add fresh sandwiches and drinks first.
          </p>
          <button type="button" id="empty-cart-go-menu" class="btn-primary">
            Browse menu
          </button>
        </section>
      `;
      const goBtn = document.getElementById('empty-cart-go-menu');
      if (goBtn) {
        goBtn.addEventListener('click', function () {
          navigateTo('MENU_LIST');
        });
      }
      return;
    }

    let issueAlertHtml = '';
    if (validation.hasIssues) {
      issueAlertHtml = `
        <section class="card" style="border:2px solid var(--color-error); background:var(--color-error-light);" role="alert">
          <h2 class="section-title" style="color:var(--color-error); font-size:var(--text-card-title);">
            <span>${getFilledStatusIcon('error')} Some items in your cart changed status or price</span>
          </h2>
          <ul style="margin:0 0 12px; padding-left:18px; font-size:var(--text-caption); color:var(--color-text);">
            ${validation.issues
              .map((iss) => `<li><strong>${iss.menuName}:</strong> ${iss.messages.join(' / ')}</li>`)
              .join('')}
          </ul>
          ${
            validation.hasPriceChanges
              ? `<button type="button" id="sync-cart-prices-btn" class="btn-primary" style="min-height:44px; padding:8px 16px; font-size:var(--text-caption);">
                  Apply latest prices
                </button>`
              : ''
          }
        </section>
      `;
    }

    // 7. 장바구니: 세로 목록으로 표시하고 수정과 삭제를 분리, 총 금액은 가장 마지막에 큰 숫자로 강조
    const itemsHtml = validation.items
      .map(function (item) {
        const optsText =
          item.selectedOptions && item.selectedOptions.length > 0
            ? item.selectedOptions
                .map((o) => `<li>${o.groupName}: ${o.itemName}${o.price > 0 ? ` (+${window.KioskStore.formatPrice(o.price)})` : ''}</li>`)
                .join('')
            : '<li>Default options</li>';

        return `
          <article class="cart-item-card ${item.hasIssue ? 'has-issue' : ''}">
            <div class="cart-item-top">
              <div>
                <h3 style="margin:0 0 4px; font-size:var(--text-card-title); font-weight:600;">
                  ${item.menuName}
                </h3>
                ${
                  item.hasIssue
                    ? `<div style="margin-bottom:6px;">
                        <span class="status-badge badge-error">${getFilledStatusIcon('error')} ${item.issueMessages.join(' · ')}</span>
                      </div>`
                    : ''
                }
              </div>
              <strong style="font-family:var(--font-mono); font-size:var(--text-card-title); color:var(--color-text);">
                ${window.KioskStore.formatPrice(item.totalPrice)}
              </strong>
            </div>

            <ul class="cart-item-options">
              ${optsText}
            </ul>

            <div class="cart-item-actions">
              <div class="qty-stepper">
                <button type="button" class="qty-btn cart-qty-minus" data-id="${item.cartItemId}" aria-label="Decrease ${item.menuName} quantity" ${
                  item.quantity <= 1 ? 'disabled' : ''
                }>−</button>
                <span class="qty-value">${item.quantity}</span>
                <button type="button" class="qty-btn cart-qty-plus" data-id="${item.cartItemId}" aria-label="Increase ${item.menuName} quantity">+</button>
              </div>
              <div style="display:flex; gap:8px;">
                <button type="button" class="btn-secondary cart-edit-btn" data-id="${item.cartItemId}" style="min-height:44px; padding:8px 14px; font-size:var(--text-caption);">
                  Edit options
                </button>
                <button type="button" class="btn-danger cart-del-btn" data-id="${item.cartItemId}" style="min-height:44px; padding:8px 14px; font-size:var(--text-caption);">
                  Delete
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    main.innerHTML = `
      ${issueAlertHtml}
      <section aria-label="Cart items">
        ${itemsHtml}
      </section>

      <section class="card" aria-label="Payment summary">
        <h2 class="section-title">Order amount</h2>
        <div class="summary-row">
          <span>Items subtotal (${cartInfo.totalQty} items)</span>
          <strong>${window.KioskStore.formatPrice(cartInfo.totalAmount)}</strong>
        </div>
        <div class="summary-row">
          <span>Discount</span>
          <strong>-${window.KioskStore.formatPrice(cartInfo.discountAmount)}</strong>
        </div>
        <div class="summary-row total">
          <span>Final amount to pay</span>
          <strong>${window.KioskStore.formatPrice(cartInfo.finalAmount)}</strong>
        </div>
      </section>
    `;

    const syncPriceBtn = document.getElementById('sync-cart-prices-btn');
    if (syncPriceBtn) {
      syncPriceBtn.addEventListener('click', function () {
        session.cart = validation.items.map(function (it) {
          return {
            cartItemId: it.cartItemId,
            menuId: it.menuId,
            menuName: it.menuName,
            category: it.category,
            basePrice: it.latestBasePrice,
            optionPrice: it.latestOptionPrice,
            unitPrice: it.latestUnitPrice,
            quantity: it.quantity,
            totalPrice: it.latestTotalPrice,
            selectedOptions: it.selectedOptions
          };
        });
        saveSession();
        showToast('Applied the latest prices.');
        render();
      });
    }

    main.querySelectorAll('.cart-qty-minus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        const target = session.cart.find((c) => c.cartItemId === id);
        if (target && target.quantity > 1) {
          target.quantity -= 1;
          target.totalPrice = target.unitPrice * target.quantity;
          saveSession();
          render();
        }
      });
    });

    main.querySelectorAll('.cart-qty-plus').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        const target = session.cart.find((c) => c.cartItemId === id);
        if (target) {
          target.quantity += 1;
          target.totalPrice = target.unitPrice * target.quantity;
          saveSession();
          render();
        }
      });
    });

    main.querySelectorAll('.cart-edit-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        const target = session.cart.find((c) => c.cartItemId === id);
        if (target) openMenuDetail(target.menuId, target);
      });
    });

    main.querySelectorAll('.cart-del-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-id');
        session.cart = session.cart.filter((c) => c.cartItemId !== id);
        saveSession();
        showToast('Removed the selected item.');
        render();
      });
    });
  }

  function renderOrderConfirmScreen(main) {
    const cartInfo = getCartTotalInfo();
    const store = storeState.store;

    const itemsSummaryHtml = cartInfo.validation.items
      .map(function (it) {
        const opts = (it.selectedOptions || []).map((o) => o.itemName).join(', ') || 'Default options';
        return `
          <div style="padding:12px 0; border-bottom:1px solid var(--color-border);">
            <div style="display:flex; justify-content:space-between; font-weight:600;">
              <span>${it.menuName} × ${it.quantity}</span>
              <strong style="font-family:var(--font-mono);">${window.KioskStore.formatPrice(it.totalPrice)}</strong>
            </div>
            <div style="font-size:var(--text-caption); color:var(--color-text-muted); margin-top:4px;">
              ${opts}
            </div>
          </div>
        `;
      })
      .join('');

    main.innerHTML = `
      <section class="card card-cut" style="border:2px solid var(--color-primary); background:var(--color-primary-light);" aria-label="Check store and dining option">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="status-badge badge-open">${getFilledStatusIcon('check')} Store confirmed</span>
          <span class="status-badge badge-recommend">
            ${session.orderType === 'DINE_IN' ? 'Dine-in' : 'Takeaway'}
          </span>
        </div>
        <h2 class="section-title" style="margin-bottom:4px; color:var(--color-primary-dark);">
          ${store.name}
        </h2>
        <p style="margin:0; font-size:var(--text-caption); color:var(--color-text-muted);">
          ${store.address} · Please check this is the right store.
        </p>
      </section>

      <section class="card" aria-label="All ordered items">
        <h2 class="section-title">
          <span>Ordered items (${cartInfo.totalQty})</span>
        </h2>
        ${itemsSummaryHtml}
        <div class="summary-row total">
          <span>Total payment</span>
          <strong>${window.KioskStore.formatPrice(cartInfo.finalAmount)}</strong>
        </div>
      </section>

      <section class="card" aria-labelledby="req-label">
        <h2 id="req-label" class="section-title">Requests</h2>
        <textarea
          id="customer-request-input"
          class="request-textarea"
          placeholder="e.g. Please cut the sandwich in half."
          maxlength="120"
        >${session.customerRequest || ''}</textarea>
        <div class="allergy-notice" role="note">
          All items are made in the same kitchen, so allergen cross-contact can happen, and writing a request alone doesn't guarantee allergy handling. If you have an allergy, please contact the store (${store.phone}) before ordering.
        </div>
      </section>
    `;

    const reqInput = document.getElementById('customer-request-input');
    if (reqInput) {
      reqInput.addEventListener('input', function () {
        session.customerRequest = reqInput.value;
        saveSession();
      });
    }
  }

  function renderPaymentScreen(main) {
    const cartInfo = getCartTotalInfo();
    const supported = storeState.store.supportedPayments || ['CARD', 'KAKAOPAY', 'NAVERPAY', 'MOBILEPAY'];

    const methodsHtml = supported
      .map(function (code) {
        const meta = window.KioskStore.PAYMENT_METHODS[code] || { code: code, name: code };
        const selected = session.selectedPaymentMethod === code;
        const iconSvg = code === 'CARD' ? getLineIcon('card') : code === 'MOBILEPAY' ? getLineIcon('smartphone') : getLineIcon('wallet');
        return `
          <button
            type="button"
            class="payment-method-btn"
            data-pay-code="${code}"
            aria-pressed="${selected}"
            ${session.paymentState === 'PROCESSING' || session.paymentState === 'UNCERTAIN' ? 'disabled' : ''}
          >
            <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
              ${iconSvg}
              ${selected ? getFilledStatusIcon('check') : ''}
            </div>
            <span>${meta.name}</span>
          </button>
        `;
      })
      .join('');

    let statusPanelHtml = '';
    if (session.paymentState === 'IDLE') {
      statusPanelHtml = `
        <div class="card" style="background:var(--color-surface-subtle);">
          <span class="status-badge badge-info">${getFilledStatusIcon('info')} Waiting for payment</span>
          <p style="margin:8px 0 0; font-size:var(--text-body); color:var(--color-text-muted);">
            Choose a payment method, then tap the Pay button below.
          </p>
        </div>
      `;
    } else if (session.paymentState === 'PROCESSING') {
      statusPanelHtml = `
        <div class="card" style="border:2px solid var(--color-info); background:var(--color-info-light);" role="status" aria-live="assertive">
          <strong style="font-size:var(--text-card-title); color:var(--color-info);">Checking payment</strong>
          <p style="margin:6px 0 0; font-size:var(--text-body); color:var(--color-text);">
            Checking the payment result. Don't tap the button again.
          </p>
        </div>
      `;
    } else if (session.paymentState === 'FAILED') {
      statusPanelHtml = `
        <div class="card" style="border:2px solid var(--color-error); background:var(--color-error-light);" role="alert">
          <div style="display:flex; align-items:center; gap:6px; color:var(--color-error); margin-bottom:6px;">
            ${getFilledStatusIcon('error')}
            <strong style="font-size:var(--text-card-title);">Payment failed</strong>
          </div>
          <p style="margin:0 0 14px; font-size:var(--text-body); color:var(--color-text);">
            ${session.paymentFailReason}
          </p>
          <div style="display:flex; gap:8px;">
            <button type="button" id="retry-pay-now-btn" class="btn-primary" style="flex:1;">
              Pay again
            </button>
            <button type="button" id="back-to-confirm-btn" class="btn-secondary" style="flex:1;">
              Go to order confirmation
            </button>
          </div>
        </div>
      `;
    } else if (session.paymentState === 'UNCERTAIN') {
      statusPanelHtml = `
        <div class="card" style="border:2px solid var(--color-warning); background:var(--color-warning-light);" role="alert">
          <div style="display:flex; align-items:center; gap:6px; color:#856000; margin-bottom:6px;">
            ${getFilledStatusIcon('warning')}
            <strong style="font-size:var(--text-card-title);">Checking the payment result</strong>
          </div>
          <p style="margin:0 0 14px; font-size:var(--text-body); color:var(--color-text);">
            Checking the payment result. Don't tap the button again. First check the approval result below.
          </p>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <button type="button" id="verify-uncertain-success-btn" class="btn-primary">
              Approved (go to order done)
            </button>
            <button type="button" id="verify-uncertain-fail-btn" class="btn-secondary">
              Not approved (pay again)
            </button>
          </div>
        </div>
      `;
    }

    main.innerHTML = `
      <section class="card" aria-label="Final payment amount">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600; color:var(--color-text-muted);">Final payment amount</span>
          <strong style="font-family:var(--font-mono); font-size:24px; color:var(--color-primary-dark);">
            ${window.KioskStore.formatPrice(cartInfo.finalAmount)}
          </strong>
        </div>
      </section>

      <section class="card" aria-labelledby="pay-method-title">
        <h2 id="pay-method-title" class="section-title">Payment method</h2>
        <div class="payment-grid">
          ${methodsHtml}
        </div>
      </section>

      ${statusPanelHtml}
    `;

    main.querySelectorAll('.payment-method-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        session.selectedPaymentMethod = btn.getAttribute('data-pay-code');
        saveSession();
        render();
      });
    });

    const retryBtn = document.getElementById('retry-pay-now-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', executePayment);
    }

    const backConfirmBtn = document.getElementById('back-to-confirm-btn');
    if (backConfirmBtn) {
      backConfirmBtn.addEventListener('click', function () {
        session.paymentState = 'IDLE';
        navigateTo('ORDER_CONFIRM');
      });
    }

    const verifySuccessBtn = document.getElementById('verify-uncertain-success-btn');
    if (verifySuccessBtn) {
      verifySuccessBtn.addEventListener('click', function () {
        session.simNetworkOffline = false;
        const netCheck = document.getElementById('sim-network-offline');
        if (netCheck) netCheck.checked = false;
        finalizeOrderCreation();
      });
    }

    const verifyFailBtn = document.getElementById('verify-uncertain-fail-btn');
    if (verifyFailBtn) {
      verifyFailBtn.addEventListener('click', function () {
        session.paymentState = 'IDLE';
        saveSession();
        showToast('We confirmed the payment wasn\'t approved. Please pay again.');
        render();
      });
    }
  }

  function renderOrderCompleteScreen(main) {
    const order = storeState.orders.find((o) => o.id === session.activeOrderId) || storeState.orders[0];
    if (!order) {
      main.innerHTML = `<div class="card">Couldn't load order info.</div>`;
      return;
    }

    const pmMeta = window.KioskStore.PAYMENT_METHODS[order.paymentMethod] || { name: order.paymentMethod };
    const itemsHtml = order.items
      .map((it) => `<li><strong>${it.menuName}</strong> × ${it.quantity} (${window.KioskStore.formatPrice(it.totalPrice)})</li>`)
      .join('');

    // 7. 완료 화면: 주문번호를 가장 크게 보여 주고 장식은 최소화합니다.
    main.innerHTML = `
      <section class="order-number-hero" aria-label="Order done and order number">
        <span class="status-badge badge-open" style="margin-bottom:8px;">
          ${getFilledStatusIcon('check')}
          <span>Your order has been received</span>
        </span>
        <span class="order-number-label">Order no.</span>
        <strong class="order-number-big">${order.orderNumber}</strong>
        <p style="margin:0; font-size:var(--text-caption); color:var(--color-text-muted);">
          Est. prep time: about ${order.estimatedPrepMinutes || 10} min
        </p>
      </section>

      <section class="card" aria-label="Order summary">
        <h2 class="section-title">Order summary</h2>
        <div class="summary-row">
          <span>Store</span>
          <strong>${storeState.store.name}</strong>
        </div>
        <div class="summary-row">
          <span>Ordered at</span>
          <strong>${window.KioskStore.formatDateTime(order.createdAt)}</strong>
        </div>
        <div class="summary-row">
          <span>Dining option</span>
          <strong>${order.orderType === 'DINE_IN' ? 'Dine-in' : 'Takeaway'}</strong>
        </div>
        <div class="summary-row">
          <span>Payment method</span>
          <strong>${pmMeta.name}</strong>
        </div>
        <hr style="border:none; border-top:1px solid var(--color-border); margin:12px 0;" />
        <ul style="margin:0 0 12px; padding-left:18px; font-size:var(--text-body);">
          ${itemsHtml}
        </ul>
        <div class="summary-row total">
          <span>Amount paid</span>
          <strong>${window.KioskStore.formatPrice(order.finalAmount)}</strong>
        </div>
      </section>

      <section class="card" aria-label="Store contact info">
        <h2 class="section-title">Contact store</h2>
        <p style="margin:0; font-size:var(--text-caption); color:var(--color-text-muted);">
          For order questions, contact the store (${storeState.store.phone}) with your order number (${order.orderNumber}).
        </p>
      </section>
    `;
  }

  /**
   * 3. 의도적인 차별화 & 8. 주문 상태 화면:
   * 고객 화면의 진행 단계를 '재료가 쌓이는 순서'처럼 시각화합니다.
   */
  function renderOrderStatusScreen(main) {
    const order = storeState.orders.find((o) => o.id === session.activeOrderId) || storeState.orders[0];
    if (!order) {
      main.innerHTML = `<div class="card">No order to look up.</div>`;
      return;
    }

    const stMeta = window.KioskStore.ORDER_STATUS[order.status] || {
      customerLabel: order.status,
      step: 1
    };

    const ingredientLayers = [
      {
        code: 'PAID',
        step: 1,
        label: 'Step 1 · Paid',
        desc: 'Preparing a warm bread base',
        svg: `<svg class="layer-graphic" viewBox="0 0 48 28" aria-hidden="true"><path d="M4 18 q20 6 40 0 l-3 6 h-34 z" fill="#856000"/></svg>`
      },
      {
        code: 'ACCEPTED',
        step: 2,
        label: 'Step 2 · Accepted',
        desc: 'The store has your order and is adding fresh veggies',
        svg: `<svg class="layer-graphic" viewBox="0 0 48 28" aria-hidden="true"><path d="M4 16 q6 -8 12 0 t12 0 t12 0 l-2 6 h-32 z" fill="#27765B"/></svg>`
      },
      {
        code: 'PREPARING',
        step: 3,
        label: 'Step 3 · Preparing',
        desc: 'Making your item with your chosen toppings and sauce',
        svg: `<svg class="layer-graphic" viewBox="0 0 48 28" aria-hidden="true"><rect x="6" y="10" width="36" height="8" rx="4" fill="#856000"/><rect x="10" y="16" width="28" height="6" rx="3" fill="#856000"/></svg>`
      },
      {
        code: 'READY',
        step: 4,
        label: 'Step 4 · Ready',
        desc: 'Check your order number and pick it up at the counter',
        svg: `<svg class="layer-graphic" viewBox="0 0 48 28" aria-hidden="true"><path d="M6 18 C6 6, 42 6, 42 18 Z" fill="#856000"/><path d="M6 18 h36 v4 h-36 z" fill="#27765B"/></svg>`
      }
    ];

    const stackHtml = ingredientLayers
      .map(function (layer) {
        let cls = '';
        let badgeHtml = '';
        if (order.status !== 'CANCELLED') {
          if (stMeta.step > layer.step || order.status === 'PICKED_UP') {
            cls = 'is-done';
            badgeHtml = `<span class="status-badge badge-open">${getFilledStatusIcon('check')} Done</span>`;
          } else if (stMeta.step === layer.step) {
            cls = 'is-current';
            badgeHtml = `<span class="status-badge badge-recommend">In progress</span>`;
          }
        }
        return `
          <li class="ingredient-layer ${cls}" aria-current="${stMeta.step === layer.step ? 'step' : 'false'}">
            <div class="layer-left">
              ${layer.svg}
              <div>
                <span class="layer-title">${layer.label}</span>
                <span class="layer-sub">${layer.desc}</span>
              </div>
            </div>
            ${badgeHtml}
          </li>
        `;
      })
      .join('');

    let statusBannerHtml = '';
    if (order.status === 'CANCELLED') {
      statusBannerHtml = `
        <div class="card" style="border:2px solid var(--color-error); background:var(--color-error-light);" role="alert">
          <div style="display:flex; align-items:center; gap:6px; color:var(--color-error); margin-bottom:6px;">
            ${getFilledStatusIcon('error')}
            <strong>Your order was cancelled</strong>
          </div>
          <p style="margin:0 0 4px; font-size:var(--text-caption);"><strong>Cancel reason:</strong> ${order.cancelReason || 'Cancelled by store'}</p>
          <p style="margin:0; font-size:var(--text-caption);"><strong>Refund status:</strong> ${order.refundStatus || 'Approval cancelled'}</p>
        </div>
      `;
    }

    const otherOrdersHtml = storeState.orders
      .map(function (o) {
        const m = window.KioskStore.ORDER_STATUS[o.status] || { customerLabel: o.status };
        return `<option value="${o.id}" ${o.id === order.id ? 'selected' : ''}>${o.orderNumber} (${m.customerLabel} · ${window.KioskStore.formatPrice(o.finalAmount)})</option>`;
      })
      .join('');

    const itemsHtml = order.items
      .map(function (it) {
        const opts = (it.selectedOptions || []).map((o) => o.itemName).join(', ') || 'Default options';
        return `
          <li style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; font-weight:600;">
              <span>${it.menuName} × ${it.quantity}</span>
              <strong style="font-family:var(--font-mono);">${window.KioskStore.formatPrice(it.totalPrice)}</strong>
            </div>
            <div style="font-size:var(--text-caption); color:var(--color-text-muted);">${opts}</div>
          </li>
        `;
      })
      .join('');

    main.innerHTML = `
      <div class="card" style="padding:12px 16px; display:flex; align-items:center; justify-content:space-between; gap:8px;">
        <label for="switch-order-select" style="font-size:var(--text-caption); font-weight:600; color:var(--color-text-muted);">Choose order</label>
        <select id="switch-order-select" style="flex:1; padding:8px; border-radius:var(--radius-sm); border:1px solid var(--color-border); font-weight:600;">
          ${otherOrdersHtml}
        </select>
      </div>

      <section class="order-number-hero" aria-label="Order number and preparation steps">
        <span class="order-number-label">Order no.</span>
        <strong class="order-number-big">${order.orderNumber}</strong>
        <span class="status-badge ${order.status === 'CANCELLED' ? 'badge-error' : 'badge-open'}">
          ${order.status === 'CANCELLED' ? getFilledStatusIcon('error') : getFilledStatusIcon('check')}
          <span>Current status: ${stMeta.customerLabel}</span>
        </span>

        <ol class="ingredient-stack-stepper" aria-label="Order preparation steps">
          ${stackHtml}
        </ol>
      </section>

      ${statusBannerHtml}

      <section class="card" aria-label="Ordered items summary">
        <h2 class="section-title">Ordered items</h2>
        <ul style="margin:0; padding-left:18px; font-size:var(--text-body);">
          ${itemsHtml}
        </ul>
        <div class="summary-row total">
          <span>Amount paid</span>
          <strong>${window.KioskStore.formatPrice(order.finalAmount)}</strong>
        </div>
      </section>

      <section class="card" aria-label="Store contact info">
        <h2 class="section-title">Contact store</h2>
        <div style="font-size:var(--text-caption); color:var(--color-text-muted);">
          <div>${storeState.store.name} · <a href="tel:${storeState.store.phone}" style="color:var(--color-primary-dark); font-weight:600;">${storeState.store.phone}</a></div>
          <div style="margin-top:2px;">${storeState.store.address}</div>
        </div>
      </section>
    `;

    const sel = document.getElementById('switch-order-select');
    if (sel) {
      sel.addEventListener('change', function () {
        session.activeOrderId = sel.value;
        saveSession();
        render();
      });
    }
  }

  function render() {
    storeState = window.KioskStore.loadState();
    renderHeaderAndFooter();

    const main = document.getElementById('main-content');
    if (!main) return;

    switch (session.screen) {
      case 'START':
        renderStartScreen(main);
        break;
      case 'MENU_LIST':
        renderMenuListScreen(main);
        break;
      case 'MENU_DETAIL':
        renderMenuDetailScreen(main);
        break;
      case 'CART':
        renderCartScreen(main);
        break;
      case 'ORDER_CONFIRM':
        renderOrderConfirmScreen(main);
        break;
      case 'PAYMENT':
        renderPaymentScreen(main);
        break;
      case 'ORDER_COMPLETE':
        renderOrderCompleteScreen(main);
        break;
      case 'ORDER_STATUS':
        renderOrderStatusScreen(main);
        break;
      default:
        session.screen = 'START';
        renderStartScreen(main);
    }

    syncSimulatorControls();
  }

  function syncSimulatorControls() {
    const chkInvalid = document.getElementById('sim-invalid-link');
    const chkClosed = document.getElementById('sim-closed-hours');
    const chkPaused = document.getElementById('sim-order-paused');
    const chkOffline = document.getElementById('sim-network-offline');
    const selPay = document.getElementById('sim-payment-behavior');

    if (chkInvalid) chkInvalid.checked = Boolean(session.simInvalidLink);
    if (chkClosed) chkClosed.checked = Boolean(storeState.store.isForceClosed);
    if (chkPaused) chkPaused.checked = Boolean(storeState.store.isOrderPaused);
    if (chkOffline) chkOffline.checked = Boolean(session.simNetworkOffline);
    if (selPay) selPay.value = session.simPaymentBehavior || 'SUCCESS';
  }

  function initEvents() {
    const backBtn = document.getElementById('header-back-btn');
    if (backBtn) backBtn.addEventListener('click', goBack);

    const cartBtn = document.getElementById('header-cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', function () {
        navigateTo('CART');
      });
    }

    const orderStatusBtn = document.getElementById('header-order-status-btn');
    if (orderStatusBtn) {
      orderStatusBtn.addEventListener('click', function () {
        navigateTo('ORDER_STATUS');
      });
    }

    const retryNetBtn = document.getElementById('retry-network-btn');
    if (retryNetBtn) {
      retryNetBtn.addEventListener('click', function () {
        session.simNetworkOffline = false;
        saveSession();
        showToast('Network connection restored.');
        render();
      });
    }

    const toggleSimBtn = document.getElementById('toggle-sim-btn');
    const simPanel = document.getElementById('sim-panel');
    if (toggleSimBtn && simPanel) {
      toggleSimBtn.addEventListener('click', function () {
        const isHidden = simPanel.hidden;
        simPanel.hidden = !isHidden;
        toggleSimBtn.setAttribute('aria-expanded', String(isHidden));
        toggleSimBtn.textContent = isHidden ? 'Close exception test' : 'Open exception test';
      });
    }

    const chkInvalid = document.getElementById('sim-invalid-link');
    if (chkInvalid) {
      chkInvalid.addEventListener('change', function () {
        session.simInvalidLink = chkInvalid.checked;
        saveSession();
        render();
      });
    }

    const chkClosed = document.getElementById('sim-closed-hours');
    if (chkClosed) {
      chkClosed.addEventListener('change', function () {
        window.KioskStore.saveState(function (st) {
          st.store.isForceClosed = chkClosed.checked;
          return st;
        });
      });
    }

    const chkPaused = document.getElementById('sim-order-paused');
    if (chkPaused) {
      chkPaused.addEventListener('change', function () {
        window.KioskStore.saveState(function (st) {
          st.store.isOrderPaused = chkPaused.checked;
          return st;
        });
      });
    }

    const chkOffline = document.getElementById('sim-network-offline');
    if (chkOffline) {
      chkOffline.addEventListener('change', function () {
        session.simNetworkOffline = chkOffline.checked;
        saveSession();
        render();
      });
    }

    const selPay = document.getElementById('sim-payment-behavior');
    if (selPay) {
      selPay.addEventListener('change', function () {
        session.simPaymentBehavior = selPay.value;
        saveSession();
      });
    }

    if (window.location.search.includes('store=invalid')) {
      session.simInvalidLink = true;
    }

    window.KioskStore.subscribe(function (nextState, payload) {
      storeState = nextState;
      if (payload && payload.meta && payload.meta.event === 'ORDER_STATUS_CHANGED') {
        const changedOrd = nextState.orders.find((o) => o.id === payload.meta.orderId);
        if (changedOrd) {
          const stMeta = window.KioskStore.ORDER_STATUS[changedOrd.status] || { customerLabel: changedOrd.status };
          showToast(`Order ${changedOrd.orderNumber} status changed to [${stMeta.customerLabel}].`);
        }
      } else if (payload && payload.meta && payload.meta.event === 'SOLD_OUT_CHANGED') {
        showToast('Store sold-out status updated.');
      }
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initEvents();
    render();
  });
})();
