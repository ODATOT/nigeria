/**
 * 샌드위치·음료 키오스크 서비스 공통 데이터 스토어 및 실시간 동기화 엔진
 * - 고객 모바일 주문 화면과 PC 관리자 화면 간 LocalStorage + BroadcastChannel 양방향 실시간 연동
 * - 메뉴, 옵션/재료 품절, 주문 상태(7단계), 매장 설정, 사용자/권한, 변경 이력(Audit Log) 관리
 */

(function (global) {
  'use strict';

  const STORAGE_KEY = 'SANDWICH_KIOSK_STATE_V2_EN';
  const CHANNEL_NAME = 'SANDWICH_KIOSK_SYNC_CHANNEL_EN';

  const ORDER_STATUS = {
    PAYMENT_PENDING: { code: 'PAYMENT_PENDING', label: 'Waiting for payment', customerLabel: 'Waiting for payment', step: 0, icon: '⏳', badgeClass: 'status-pending' },
    PAID: { code: 'PAID', label: 'Paid (new)', customerLabel: 'Payment complete', step: 1, icon: '💳', badgeClass: 'status-paid' },
    ACCEPTED: { code: 'ACCEPTED', label: 'Received', customerLabel: 'Received', step: 2, icon: '📋', badgeClass: 'status-accepted' },
    PREPARING: { code: 'PREPARING', label: 'Preparing', customerLabel: 'Preparing', step: 3, icon: '🥪', badgeClass: 'status-preparing' },
    READY: { code: 'READY', label: 'Ready', customerLabel: 'Ready', step: 4, icon: '🔔', badgeClass: 'status-ready' },
    PICKED_UP: { code: 'PICKED_UP', label: 'Picked up', customerLabel: 'Picked up', step: 5, icon: '✅', badgeClass: 'status-pickedup' },
    CANCELLED: { code: 'CANCELLED', label: 'Cancel', customerLabel: 'Cancel', step: -1, icon: '🚫', badgeClass: 'status-cancelled' }
  };

  const PAYMENT_METHODS = {
    CARD: { code: 'CARD', name: 'Credit·debit card', icon: '💳' },
    KAKAOPAY: { code: 'KAKAOPAY', name: 'OPay', icon: '💛' },
    NAVERPAY: { code: 'NAVERPAY', name: 'PalmPay', icon: '💚' },
    MOBILEPAY: { code: 'MOBILEPAY', name: 'Apple·Samsung Pay', icon: '📱' }
  };

  function getNowISO() {
    return new Date().toISOString();
  }

  function minutesAgoISO(mins) {
    return new Date(Date.now() - mins * 60 * 1000).toISOString();
  }

  function createInitialState() {
    const state = {
      version: 2,
      lastUpdatedAt: getNowISO(),
      store: {
        id: 'store-gangnam-01',
        name: 'FreshSand Lekki Branch',
        phone: '02-555-0192',
        address: '12 Admiralty Way, Lekki Phase 1, Lagos',
        imageCaption: 'Organic bakery baked fresh every morning & handmade sandwiches',
        openTime: '08:00',
        closeTime: '21:00',
        orderStartTime: '08:00',
        orderEndTime: '20:30',
        isForceClosed: false, // 영업시간 강제 종료 시뮬레이션용
        isOrderPaused: false, // 모바일 주문 접수 일시 중지
        pauseMessage: 'The store is busy right now, so mobile orders are paused. Please try again shortly.',
        allowDineIn: true,
        allowTakeout: true,
        estimatedPrepMinutes: 10,
        ShowSoldOutMenus: true, // 품절 메뉴 고객 화면 노출 방식 (true: 품절 배지 표시 후 비활성, false: 목록에서 숨김)
        minOrderQty: 1,
        maxOrderQty: 20,
        supportedPayments: ['CARD', 'KAKAOPAY', 'NAVERPAY', 'MOBILEPAY'],
        receiptFooter: 'Exchanges and refunds are available in store on the day of purchase with a receipt.',
        autoPrintReceipt: true,
        alertSoundEnabled: true,
        delayThresholdMinutes: 15
      },
      optionTemplates: {
        SANDWICH: [
          {
            id: 'opt-bread',
            name: 'Bread',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'bread-wheat', name: 'Wheat (whole wheat)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'bread-honeyoat', name: 'Honey oat', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'bread-flat', name: 'Flatbread', price: 500, soldOut: false, soldOutReason: '' },
              { id: 'bread-brioche', name: 'Brioche', price: 700, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-size-sw',
            name: 'Size',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'sw-15cm', name: 'Regular (15cm)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'sw-30cm', name: 'Jumbo (30cm)', price: 4200, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-set',
            name: 'Combo',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'set-single', name: 'Single item', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'set-cookie', name: 'Cookie + Americano combo', price: 2900, soldOut: false, soldOutReason: '' },
              { id: 'set-wedge', name: 'Potato wedges + soda combo', price: 3400, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-extra',
            name: 'Extra ingredients (up to 3)',
            required: false,
            minSelect: 0,
            maxSelect: 3,
            items: [
              { id: 'extra-egg', name: 'Egg mayo scoop', price: 1500, soldOut: false, soldOutReason: '' },
              { id: 'extra-bacon', name: '2 crispy bacon strips', price: 1800, soldOut: false, soldOutReason: '' },
              { id: 'extra-avocado', name: 'Fresh avocado slices', price: 2000, soldOut: false, soldOutReason: '' },
              { id: 'extra-cheese', name: 'Double mozzarella cheese', price: 1200, soldOut: false, soldOutReason: '' },
              { id: 'extra-jalapeno', name: 'Add jalapeños', price: 500, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-exclude',
            name: 'Remove ingredients (choose veggies to leave out)',
            required: false,
            minSelect: 0,
            maxSelect: 5,
            items: [
              { id: 'excl-onion', name: 'No raw onion', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'excl-pickle', name: 'No pickles', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'excl-tomato', name: 'No tomato', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'excl-cucumber', name: 'No cucumber', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'excl-olive', name: 'No black olives', price: 0, soldOut: false, soldOutReason: '' }
            ]
          }
        ],
        BEVERAGE: [
          {
            id: 'opt-size-bev',
            name: 'Size',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'bev-regular', name: 'Regular (355ml)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'bev-large', name: 'Large (473ml)', price: 800, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-temp',
            name: 'Temperature',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'temp-ice', name: 'ICE (cold drink)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'temp-hot', name: 'HOT (hot drink)', price: 0, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-ice',
            name: 'Ice',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'ice-less', name: 'Less ice', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'ice-normal', name: 'Regular ice', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'ice-more', name: 'Extra ice', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'ice-none', name: 'No ice (default for HOT)', price: 0, soldOut: false, soldOutReason: '' }
            ]
          },
          {
            id: 'opt-sweet',
            name: 'Sweetness',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'sweet-0', name: 'Unsweetened (0%)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'sweet-50', name: 'Less sweet (50%)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'sweet-100', name: 'Regular (100%)', price: 0, soldOut: false, soldOutReason: '' },
              { id: 'sweet-120', name: 'Extra sweet (120%)', price: 300, soldOut: false, soldOutReason: '' }
            ]
          }
        ]
      },
      menus: [
        {
          id: 'menu-sw-1',
          name: 'Basil Chicken Avocado Sandwich',
          category: 'SANDWICH',
          isRecommended: true,
          badge: 'BEST seller',
          price: 7400,
          description: 'A signature sandwich with sous-vide chicken breast, fresh avocado and handmade basil pesto',
          emoji: '🥑',
          bgColor: '#243B35',
          allergens: 'Contains wheat, soy, milk, chicken, pine nuts',
          originInfo: 'Chicken breast (local), avocado (Kenya), bacon (imported)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 1,
          updatedBy: 'Store manager Emeka Obi',
          updatedAt: minutesAgoISO(120)
        },
        {
          id: 'menu-sw-2',
          name: 'Italian BMT Club Sandwich',
          category: 'SANDWICH',
          isRecommended: true,
          badge: 'Popular',
          price: 6900,
          description: 'A classic club sandwich loaded with pepperoni, salami, boneless ham and rich cheddar cheese',
          emoji: '🥪',
          bgColor: '#243B35',
          allergens: 'Contains wheat, pork, beef, milk, soy',
          originInfo: 'Pork (local and USA), cheese (New Zealand)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 2,
          updatedBy: 'Store manager Emeka Obi',
          updatedAt: minutesAgoISO(180)
        },
        {
          id: 'menu-sw-3',
          name: 'Truffle Egg Mayo Bacon Sandwich',
          category: 'SANDWICH',
          isRecommended: true,
          badge: 'New',
          price: 6400,
          description: 'A flavorful sandwich of soft egg mayo with white truffle oil and crispy bacon',
          emoji: '🥚',
          bgColor: '#243B35',
          allergens: 'Contains egg, wheat, soy, pork, milk',
          originInfo: 'Egg (local, antibiotic-free), bacon (USA)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 3,
          updatedBy: 'Manager Folake Adeyemi',
          updatedAt: minutesAgoISO(90)
        },
        {
          id: 'menu-sw-4',
          name: 'Roast Beef & Horseradish Sandwich',
          category: 'SANDWICH',
          isRecommended: false,
          badge: '',
          price: 8200,
          description: 'Thick-sliced oven roast beef with a sharp horseradish cream sauce',
          emoji: '🥩',
          bgColor: '#243B35',
          allergens: 'Contains beef, wheat, milk, egg, soy',
          originInfo: 'Beef (local)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: true,
          soldOutAt: minutesAgoISO(40),
          soldOutBy: 'Manager Folake Adeyemi',
          soldOutReason: 'Today\'s roast beef has run out',
          resumeAt: '16:00',
          displayOrder: 4,
          updatedBy: 'Manager Folake Adeyemi',
          updatedAt: minutesAgoISO(40)
        },
        {
          id: 'menu-sw-5',
          name: 'Roasted Pumpkin & Ricotta Salad Sandwich',
          category: 'SANDWICH',
          isRecommended: false,
          badge: 'Healthy',
          price: 6800,
          description: 'A wholesome sandwich of sweet oven-roasted pumpkin, handmade ricotta and balsamic glaze',
          emoji: '🎃',
          bgColor: '#243B35',
          allergens: 'Contains wheat, milk, walnut',
          originInfo: 'Pumpkin (local), ricotta (local milk)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 5,
          updatedBy: 'Store manager Emeka Obi',
          updatedAt: minutesAgoISO(240)
        },
        {
          id: 'menu-bev-1',
          name: 'Signature Specialty Americano',
          category: 'BEVERAGE',
          isRecommended: true,
          badge: 'Popular',
          price: 3500,
          description: '100% Arabica blend coffee with a dark chocolate and roasted hazelnut aroma',
          emoji: '☕',
          bgColor: '#243B35',
          allergens: 'None (contains high caffeine 150mg)',
          originInfo: 'Beans (Colombia 60%, Brazil 40%)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 6,
          updatedBy: 'Store manager Emeka Obi',
          updatedAt: minutesAgoISO(300)
        },
        {
          id: 'menu-bev-2',
          name: 'Vanilla Bean Cream Latte',
          category: 'BEVERAGE',
          isRecommended: true,
          badge: 'New',
          price: 4600,
          description: 'A latte with natural Madagascar vanilla bean syrup, rich milk and espresso',
          emoji: '🥛',
          bgColor: '#243B35',
          allergens: 'Contains milk (high caffeine 150mg)',
          originInfo: 'Milk (local grade 1), beans (Colombia·Brazil)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 7,
          updatedBy: 'Store manager Emeka Obi',
          updatedAt: minutesAgoISO(300)
        },
        {
          id: 'menu-bev-3',
          name: 'Grapefruit Honey Sparkling Ade',
          category: 'BEVERAGE',
          isRecommended: false,
          badge: 'Popular',
          price: 4800,
          description: 'A fresh, fizzy handmade ade with freshly squeezed ruby grapefruit and acacia honey',
          emoji: '🍹',
          bgColor: '#243B35',
          allergens: 'None',
          originInfo: 'Grapefruit (imported), honey (local)',
          saleHours: '08:00 ~ 20:30',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 8,
          updatedBy: 'Manager Folake Adeyemi',
          updatedAt: minutesAgoISO(200)
        },
        {
          id: 'menu-bev-4',
          name: 'Fresh Strawberry Yogurt Smoothie',
          category: 'BEVERAGE',
          isRecommended: false,
          badge: '',
          price: 5200,
          description: 'A rich smoothie blended from fresh strawberries and plain Greek yogurt',
          emoji: '🍓',
          bgColor: '#243B35',
          allergens: 'Contains milk',
          originInfo: 'Strawberry (local), yogurt (local milk)',
          saleHours: '10:00 ~ 20:00',
          isSelling: true,
          isSoldOut: false,
          soldOutAt: null,
          soldOutBy: null,
          soldOutReason: '',
          resumeAt: null,
          displayOrder: 9,
          updatedBy: 'Store manager Emeka Obi',
          updatedAt: minutesAgoISO(220)
        }
      ],
      orders: [
        {
          id: 'ord-1001',
          orderNumber: 'A-101',
          createdAt: minutesAgoISO(19),
          paidAt: minutesAgoISO(19),
          orderType: 'DINE_IN', // DINE_IN | TAKEOUT
          status: 'PAID',
          paymentStatus: 'PAID', // PAID | VERIFYING | REFUNDED | FAILED
          paymentMethod: 'KAKAOPAY',
          customerRequest: 'Please slice the onions as thin as possible and give me plenty of napkins.',
          totalAmount: 13800,
          discountAmount: 0,
          finalAmount: 13800,
          estimatedPrepMinutes: 10,
          cancelReason: '',
          refundStatus: '',
          items: [
            {
              id: 'item-1',
              menuId: 'menu-sw-1',
              menuName: 'Basil Chicken Avocado Sandwich',
              category: 'SANDWICH',
              basePrice: 7400,
              optionPrice: 2900,
              unitPrice: 10300,
              quantity: 1,
              totalPrice: 10300,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: 'Bread', itemId: 'bread-honeyoat', itemName: 'Honey oat', price: 0 },
                { groupId: 'opt-size-sw', groupName: 'Size', itemId: 'sw-15cm', itemName: 'Regular (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: 'Combo', itemId: 'set-cookie', itemName: 'Cookie + Americano combo', price: 2900 },
                { groupId: 'opt-exclude', groupName: 'Removed ingredients', itemId: 'excl-pickle', itemName: 'No pickles', price: 0 }
              ]
            },
            {
              id: 'item-2',
              menuId: 'menu-bev-1',
              menuName: 'Signature Specialty Americano',
              category: 'BEVERAGE',
              basePrice: 3500,
              optionPrice: 0,
              unitPrice: 3500,
              quantity: 1,
              totalPrice: 3500,
              selectedOptions: [
                { groupId: 'opt-size-bev', groupName: 'Size', itemId: 'bev-regular', itemName: 'Regular (355ml)', price: 0 },
                { groupId: 'opt-temp', groupName: 'Temperature', itemId: 'temp-ice', itemName: 'ICE (cold drink)', price: 0 },
                { groupId: 'opt-ice', groupName: 'Ice', itemId: 'ice-normal', itemName: 'Regular ice', price: 0 },
                { groupId: 'opt-sweet', groupName: 'Sweetness', itemId: 'sweet-0', itemName: 'Unsweetened (0%)', price: 0 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: 'Customer mobile payment complete (OPay)', actor: 'Customer', timestamp: minutesAgoISO(19) }
          ]
        },
        {
          id: 'ord-1002',
          orderNumber: 'A-102',
          createdAt: minutesAgoISO(12),
          paidAt: minutesAgoISO(12),
          orderType: 'TAKEOUT',
          status: 'PREPARING',
          paymentStatus: 'PAID',
          paymentMethod: 'CARD',
          customerRequest: '',
          totalAmount: 15100,
          discountAmount: 0,
          finalAmount: 15100,
          estimatedPrepMinutes: 10,
          cancelReason: '',
          refundStatus: '',
          items: [
            {
              id: 'item-3',
              menuId: 'menu-sw-2',
              menuName: 'Italian BMT Club Sandwich',
              category: 'SANDWICH',
              basePrice: 6900,
              optionPrice: 3400,
              unitPrice: 10300,
              quantity: 1,
              totalPrice: 10300,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: 'Bread', itemId: 'bread-flat', itemName: 'Flatbread', price: 500 },
                { groupId: 'opt-size-sw', groupName: 'Size', itemId: 'sw-15cm', itemName: 'Regular (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: 'Combo', itemId: 'set-single', itemName: 'Single item', price: 0 },
                { groupId: 'opt-extra', groupName: 'Extra ingredients', itemId: 'extra-bacon', itemName: '2 crispy bacon strips', price: 1800 },
                { groupId: 'opt-extra', groupName: 'Extra ingredients', itemId: 'extra-cheese', itemName: 'Double mozzarella cheese', price: 1100 }
              ]
            },
            {
              id: 'item-4',
              menuId: 'menu-bev-3',
              menuName: 'Grapefruit Honey Sparkling Ade',
              category: 'BEVERAGE',
              basePrice: 4800,
              optionPrice: 0,
              unitPrice: 4800,
              quantity: 1,
              totalPrice: 4800,
              selectedOptions: [
                { groupId: 'opt-size-bev', groupName: 'Size', itemId: 'bev-regular', itemName: 'Regular (355ml)', price: 0 },
                { groupId: 'opt-temp', groupName: 'Temperature', itemId: 'temp-ice', itemName: 'ICE (cold drink)', price: 0 },
                { groupId: 'opt-ice', groupName: 'Ice', itemId: 'ice-less', itemName: 'Less ice', price: 0 },
                { groupId: 'opt-sweet', groupName: 'Sweetness', itemId: 'sweet-100', itemName: 'Regular (100%)', price: 0 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: 'Customer mobile payment complete (Credit·debit card)', actor: 'Customer', timestamp: minutesAgoISO(12) },
            { status: 'ACCEPTED', note: 'Order checked and accepted', actor: 'Staff Chinedu Okafor', timestamp: minutesAgoISO(10) },
            { status: 'PREPARING', note: 'Start cooking', actor: 'Staff Chinedu Okafor', timestamp: minutesAgoISO(8) }
          ]
        },
        {
          id: 'ord-1003',
          orderNumber: 'A-103',
          createdAt: minutesAgoISO(6),
          paidAt: minutesAgoISO(6),
          orderType: 'DINE_IN',
          status: 'READY',
          paymentStatus: 'PAID',
          paymentMethod: 'NAVERPAY',
          customerRequest: 'Lots of ice in the drink, please!',
          totalAmount: 11000,
          discountAmount: 0,
          finalAmount: 11000,
          estimatedPrepMinutes: 10,
          cancelReason: '',
          refundStatus: '',
          items: [
            {
              id: 'item-5',
              menuId: 'menu-sw-3',
              menuName: 'Truffle Egg Mayo Bacon Sandwich',
              category: 'SANDWICH',
              basePrice: 6400,
              optionPrice: 0,
              unitPrice: 6400,
              quantity: 1,
              totalPrice: 6400,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: 'Bread', itemId: 'bread-wheat', itemName: 'Wheat (whole wheat)', price: 0 },
                { groupId: 'opt-size-sw', groupName: 'Size', itemId: 'sw-15cm', itemName: 'Regular (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: 'Combo', itemId: 'set-single', itemName: 'Single item', price: 0 }
              ]
            },
            {
              id: 'item-6',
              menuId: 'menu-bev-2',
              menuName: 'Vanilla Bean Cream Latte',
              category: 'BEVERAGE',
              basePrice: 4600,
              optionPrice: 0,
              unitPrice: 4600,
              quantity: 1,
              totalPrice: 4600,
              selectedOptions: [
                { groupId: 'opt-size-bev', groupName: 'Size', itemId: 'bev-regular', itemName: 'Regular (355ml)', price: 0 },
                { groupId: 'opt-temp', groupName: 'Temperature', itemId: 'temp-ice', itemName: 'ICE (cold drink)', price: 0 },
                { groupId: 'opt-ice', groupName: 'Ice', itemId: 'ice-more', itemName: 'Extra ice', price: 0 },
                { groupId: 'opt-sweet', groupName: 'Sweetness', itemId: 'sweet-100', itemName: 'Regular (100%)', price: 0 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: 'Customer mobile payment complete (PalmPay)', actor: 'Customer', timestamp: minutesAgoISO(6) },
            { status: 'ACCEPTED', note: 'Accept order', actor: 'Manager Folake Adeyemi', timestamp: minutesAgoISO(5) },
            { status: 'PREPARING', note: 'Cooking', actor: 'Manager Folake Adeyemi', timestamp: minutesAgoISO(4) },
            { status: 'READY', note: 'Sent ready-for-pickup alert', actor: 'Manager Folake Adeyemi', timestamp: minutesAgoISO(1) }
          ]
        },
        {
          id: 'ord-1000',
          orderNumber: 'A-100',
          createdAt: minutesAgoISO(45),
          paidAt: minutesAgoISO(45),
          orderType: 'TAKEOUT',
          status: 'CANCELLED',
          paymentStatus: 'REFUNDED',
          paymentMethod: 'CARD',
          customerRequest: '',
          totalAmount: 8200,
          discountAmount: 0,
          finalAmount: 8200,
          estimatedPrepMinutes: 10,
          cancelReason: 'Full cancel after telling the customer roast beef ran out',
          refundStatus: 'Card approval cancelled',
          items: [
            {
              id: 'item-0',
              menuId: 'menu-sw-4',
              menuName: 'Roast Beef & Horseradish Sandwich',
              category: 'SANDWICH',
              basePrice: 8200,
              optionPrice: 0,
              unitPrice: 8200,
              quantity: 1,
              totalPrice: 8200,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: 'Bread', itemId: 'bread-wheat', itemName: 'Wheat (whole wheat)', price: 0 },
                { groupId: 'opt-size-sw', groupName: 'Size', itemId: 'sw-15cm', itemName: 'Regular (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: 'Combo', itemId: 'set-single', itemName: 'Single item', price: 0 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: 'Customer mobile payment complete', actor: 'Customer', timestamp: minutesAgoISO(45) },
            { status: 'CANCELLED', note: 'Cancelled (reason: full cancel after telling the customer roast beef ran out)', actor: 'Manager Folake Adeyemi', timestamp: minutesAgoISO(41) }
          ]
        },
        {
          id: 'ord-0999',
          orderNumber: 'A-099',
          createdAt: minutesAgoISO(75),
          paidAt: minutesAgoISO(75),
          orderType: 'DINE_IN',
          status: 'PICKED_UP',
          paymentStatus: 'PAID',
          paymentMethod: 'MOBILEPAY',
          customerRequest: '',
          totalAmount: 19600,
          discountAmount: 0,
          finalAmount: 19600,
          estimatedPrepMinutes: 10,
          cancelReason: '',
          refundStatus: '',
          items: [
            {
              id: 'item-99-1',
              menuId: 'menu-sw-1',
              menuName: 'Basil Chicken Avocado Sandwich',
              category: 'SANDWICH',
              basePrice: 7400,
              optionPrice: 2400,
              unitPrice: 9800,
              quantity: 2,
              totalPrice: 19600,
              selectedOptions: [
                { groupId: 'opt-bread', groupName: 'Bread', itemId: 'bread-brioche', itemName: 'Brioche', price: 700 },
                { groupId: 'opt-size-sw', groupName: 'Size', itemId: 'sw-15cm', itemName: 'Regular (15cm)', price: 0 },
                { groupId: 'opt-set', groupName: 'Combo', itemId: 'set-single', itemName: 'Single item', price: 0 },
                { groupId: 'opt-extra', groupName: 'Extra ingredients', itemId: 'extra-egg', itemName: 'Egg mayo scoop', price: 1700 }
              ]
            }
          ],
          history: [
            { status: 'PAID', note: 'Customer mobile payment complete', actor: 'Customer', timestamp: minutesAgoISO(75) },
            { status: 'ACCEPTED', note: 'Accept order', actor: 'Store manager Emeka Obi', timestamp: minutesAgoISO(74) },
            { status: 'PREPARING', note: 'Start cooking', actor: 'Store manager Emeka Obi', timestamp: minutesAgoISO(72) },
            { status: 'READY', note: 'Ready', actor: 'Store manager Emeka Obi', timestamp: minutesAgoISO(66) },
            { status: 'PICKED_UP', note: 'Customer picked up', actor: 'Staff Chinedu Okafor', timestamp: minutesAgoISO(64) }
          ]
        }
      ],
      nextOrderSequence: 104,
      users: [
        {
          id: 'usr-admin',
          username: 'admin',
          password: 'password123',
          name: 'Emeka Obi (Store manager)',
          role: 'ADMIN', // ADMIN | MANAGER | STAFF
          roleName: 'Admin',
          permissions: ['ORDER_MANAGE', 'ORDER_CANCEL', 'SOLD_OUT_MANAGE', 'MENU_MANAGE', 'SALES_VIEW', 'STORE_SETTINGS', 'USER_MANAGE'],
          lastLoginAt: minutesAgoISO(15),
          isActive: true,
          failedAttempts: 0,
          isLocked: false
        },
        {
          id: 'usr-manager',
          username: 'manager',
          password: 'password123',
          name: 'Folake Adeyemi (Manager)',
          role: 'MANAGER',
          roleName: 'Manager',
          permissions: ['ORDER_MANAGE', 'ORDER_CANCEL', 'SOLD_OUT_MANAGE', 'MENU_MANAGE', 'SALES_VIEW'],
          lastLoginAt: minutesAgoISO(50),
          isActive: true,
          failedAttempts: 0,
          isLocked: false
        },
        {
          id: 'usr-staff',
          username: 'staff',
          password: 'password123',
          name: 'Chinedu Okafor (Crew)',
          role: 'STAFF',
          roleName: 'Staff',
          permissions: ['ORDER_MANAGE'],
          lastLoginAt: minutesAgoISO(110),
          isActive: true,
          failedAttempts: 0,
          isLocked: false
        }
      ],
      auditLogs: [
        {
          id: 'log-1',
          category: 'Sold-out management',
          action: 'Marked Roast Beef & Horseradish Sandwich sold out (reason: today\'s roast beef ran out, resumes: 16:00)',
          actor: 'Manager Folake Adeyemi',
          timestamp: minutesAgoISO(40)
        },
        {
          id: 'log-2',
          category: 'Order management',
          action: 'Cancelled order A-100 and card approval',
          actor: 'Manager Folake Adeyemi',
          timestamp: minutesAgoISO(41)
        },
        {
          id: 'log-3',
          category: 'Menu management',
          action: 'Set New badge on Truffle Egg Mayo Bacon Sandwich',
          actor: 'Manager Folake Adeyemi',
          timestamp: minutesAgoISO(90)
        }
      ]
    };

    if (Array.isArray(global.SHEET_MENU_DATA) && global.SHEET_MENU_DATA.length > 0) {
      state.menus = global.SHEET_MENU_DATA.map(function (menu) {
        return Object.assign(
          {
            soldOutAt: null,
            soldOutBy: null,
            soldOutReason: '',
            resumeAt: null,
            updatedBy: 'Google Sheets sync',
            updatedAt: getNowISO()
          },
          JSON.parse(JSON.stringify(menu)),
          menu.isSoldOut
            ? {
                soldOutAt: getNowISO(),
                soldOutBy: 'Google Sheets sync',
                soldOutReason: 'Set to sold out in the sheet'
              }
            : {}
        );
      });
    }

    return state;
  }

  let channel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(CHANNEL_NAME);
    }
  } catch (e) {
    // Fallback to storage event only
  }

  const listeners = new Set();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = createInitialState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
      return createInitialState();
    }
  }

  function saveState(updater, meta) {
    const current = loadState();
    const next = typeof updater === 'function' ? updater(current) : updater;
    next.lastUpdatedAt = getNowISO();
    if (meta && meta.audit) {
      next.auditLogs = next.auditLogs || [];
      next.auditLogs.unshift({
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        category: meta.audit.category || 'System',
        action: meta.audit.action,
        actor: meta.audit.actor || 'Admin',
        timestamp: next.lastUpdatedAt
      });
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
    const payload = { type: 'STATE_UPDATED', meta: meta || {}, timestamp: next.lastUpdatedAt };
    if (channel) {
      try {
        channel.postMessage(payload);
      } catch (e) {}
    }
    notifyListeners(next, payload);
    return next;
  }

  function resetToDefault() {
    const initial = createInitialState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    const payload = { type: 'STATE_RESET', timestamp: initial.lastUpdatedAt };
    if (channel) {
      try {
        channel.postMessage(payload);
      } catch (e) {}
    }
    notifyListeners(initial, payload);
    return initial;
  }

  function notifyListeners(state, payload) {
    listeners.forEach(function (fn) {
      try {
        fn(state, payload);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  if (channel) {
    channel.onmessage = function (ev) {
      const state = loadState();
      notifyListeners(state, ev.data || { type: 'EXTERNAL_UPDATE' });
    };
  }

  window.addEventListener('storage', function (ev) {
    if (ev.key === STORAGE_KEY) {
      const state = loadState();
      notifyListeners(state, { type: 'STORAGE_EVENT' });
    }
  });

  function subscribe(callback) {
    listeners.add(callback);
    return function unsubscribe() {
      listeners.delete(callback);
    };
  }

  function formatPrice(num) {
    const n = Number(num) || 0;
    return '₦' + n.toLocaleString('en-NG');
  }

  function formatDateTime(isoStr) {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    const pad = (v) => String(v).padStart(2, '0');
    return (
      d.getFullYear() +
      '-' +
      pad(d.getMonth() + 1) +
      '-' +
      pad(d.getDate()) +
      ' ' +
      pad(d.getHours()) +
      ':' +
      pad(d.getMinutes())
    );
  }

  function formatTimeOnly(isoStr) {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    const pad = (v) => String(v).padStart(2, '0');
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function getElapsedMinutes(isoStr) {
    if (!isoStr) return 0;
    const diff = Date.now() - new Date(isoStr).getTime();
    return Math.max(0, Math.floor(diff / 60000));
  }

  /**
   * 메뉴에 해당하는 옵션 그룹 목록 반환 (템플릿 + 메뉴 커스텀 옵션 병합)
   */
  function getMenuOptionGroups(state, menu) {
    if (!menu) return [];
    if (menu.customOptionGroups && Array.isArray(menu.customOptionGroups)) {
      return menu.customOptionGroups;
    }
    const tpl = state.optionTemplates[menu.category] || [];
    return JSON.parse(JSON.stringify(tpl));
  }

  /**
   * 장바구니에 담긴 항목들이 현재 스토어 상태에서 유효한지 검증
   * - 품절된 메뉴인지
   * - 품절된 옵션이 포함되어 있는지
   * - 기본 가격이나 옵션 가격이 변경되었는지
   */
  function validateCartItems(state, cartItems) {
    const issues = [];
    const validatedItems = cartItems.map(function (item) {
      const menu = state.menus.find((m) => m.id === item.menuId);
      const itemIssues = [];
      let currentBasePrice = item.basePrice;
      let currentOptionPrice = 0;
      let isUnavailable = false;

      if (!menu || !menu.isSelling) {
        itemIssues.push('This item is no longer on sale.');
        isUnavailable = true;
      } else if (menu.isSoldOut) {
        itemIssues.push('This item sold out after you added it.');
        isUnavailable = true;
      } else {
        currentBasePrice = menu.price;
        if (currentBasePrice !== item.basePrice) {
          itemIssues.push(
            'Menu base price changed from ' + formatPrice(item.basePrice) + ' to ' + formatPrice(currentBasePrice) + '.'
          );
        }
      }

      const optionGroups = menu ? getMenuOptionGroups(state, menu) : [];
      (item.selectedOptions || []).forEach(function (sel) {
        const grp = optionGroups.find((g) => g.id === sel.groupId);
        const optItem = grp ? grp.items.find((i) => i.id === sel.itemId) : null;
        if (!optItem || optItem.soldOut) {
          itemIssues.push('Selected option [' + sel.itemName + '] is sold out.');
          isUnavailable = true;
        } else {
          currentOptionPrice += optItem.price;
          if (optItem.price !== sel.price) {
            itemIssues.push(
              'Option [' + sel.itemName + '] price changed from ' + formatPrice(sel.price) + ' to ' + formatPrice(optItem.price) + '.'
            );
          }
        }
      });

      const newUnitPrice = currentBasePrice + currentOptionPrice;
      const priceChanged = newUnitPrice !== item.unitPrice;
      if (itemIssues.length > 0) {
        issues.push({
          cartItemId: item.cartItemId,
          menuName: item.menuName,
          messages: itemIssues,
          isUnavailable: isUnavailable,
          priceChanged: priceChanged,
          newUnitPrice: newUnitPrice
        });
      }

      return Object.assign({}, item, {
        hasIssue: itemIssues.length > 0,
        isUnavailable: isUnavailable,
        priceChanged: priceChanged,
        issueMessages: itemIssues,
        latestBasePrice: currentBasePrice,
        latestOptionPrice: currentOptionPrice,
        latestUnitPrice: newUnitPrice,
        latestTotalPrice: newUnitPrice * item.quantity
      });
    });

    return {
      hasIssues: issues.length > 0,
      hasBlockingIssues: issues.some((i) => i.isUnavailable),
      hasPriceChanges: issues.some((i) => i.priceChanged),
      issues: issues,
      items: validatedItems
    };
  }

  global.KioskStore = {
    STORAGE_KEY: STORAGE_KEY,
    ORDER_STATUS: ORDER_STATUS,
    PAYMENT_METHODS: PAYMENT_METHODS,
    loadState: loadState,
    saveState: saveState,
    resetToDefault: resetToDefault,
    subscribe: subscribe,
    formatPrice: formatPrice,
    formatDateTime: formatDateTime,
    formatTimeOnly: formatTimeOnly,
    getElapsedMinutes: getElapsedMinutes,
    getMenuOptionGroups: getMenuOptionGroups,
    validateCartItems: validateCartItems
  };
})(window);

