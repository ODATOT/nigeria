/**
 * 2026 ACE AI SW Startup Training - Notice Navigation System
 * Replaces previous layer popup modal with direct routing to dedicated notice.html
 */

(function () {
  'use strict';

  function getBasePath() {
    const p = window.location.pathname;
    if (p.includes('/day') || p.includes('/announcement/') || p.includes('/project_day/') || p.includes('/login/') || p.includes('/real-')) {
      return '../';
    }
    return '';
  }

  const BASE_PATH = getBasePath();

  // Single new notice data (all previous notices removed)
  const NOTICES_DATA = [
    {
      id: 1,
      tag: '📷 Photo Upload Notice',
      title: '[Notice] Add your profile photo for the login page',
      formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdq7bgVerFQ55Uf2_orz_Mnqif8ABUvSY8Yjo9WI7OAQX7S5w/viewform',
      qrImage: 'img/qr/photo-submission-qr.png',
      message: 'To add your photo to the login page, please upload it using the link below.'
    }
  ];

  function navigateToNotice() {
    window.location.href = BASE_PATH + 'notice.html';
  }

  // Backward compatibility globals
  window.openNoticeModal = function (idx) {
    navigateToNotice();
  };

  window.closeNoticeModal = function () {
    // No-op since popup is removed
  };

  window.NOTICES_DATA = NOTICES_DATA;

  function bindNoticeTriggers() {
    // Update all notice badges to 1
    document.querySelectorAll('.notice-badge').forEach((badge) => {
      badge.textContent = '1';
    });

    // Route notice triggers to notice page
    const triggers = document.querySelectorAll('#openNoticeBtn, .nav-notice-btn, [data-open-notice]');
    triggers.forEach((trigger) => {
      if (!trigger.dataset.noticeBound) {
        trigger.dataset.noticeBound = 'true';
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          navigateToNotice();
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindNoticeTriggers);
  } else {
    bindNoticeTriggers();
  }
})();
