/**
 * LNB 메뉴 목록 (project.config.js 의 menuUrl 이 비어 있을 때 사용)
 *
 * 한 줄 = 메뉴 하나. 서버 메뉴 테이블과 같은 모양이라, 나중에 menuUrl 로 바꿔도 화면 코드는 그대로입니다.
 *
 * | 키        | 필수 | 설명                                                                  |
 * | --------- | ---- | --------------------------------------------------------------------- |
 * | id        | O    | 메뉴 고유값. 겹치지만 않으면 됩니다. (예: MENU_026001)                |
 * | parentId  |      | 상위 메뉴 id. 없으면 1단계 메뉴                                       |
 * | order     | O    | 같은 상위 안에서의 순서 (작을수록 위)                                 |
 * | to        |      | 화면 주소. 없으면 하위 메뉴를 묶는 그룹                               |
 * | labelKey  | △    | 다국어 키 (src/i18n/ko.js · en.js 의 nav.*)                           |
 * | label     | △    | 다국어가 필요 없으면 이름을 직접 적습니다. (labelKey 나 label 중 하나) |
 * | icon      |      | 1단계 메뉴 아이콘 이름 (components/Layout/LayoutNavItem.vue 목록)      |
 * | newTab    |      | true 면 새 창으로 엽니다.                                             |
 * | isActive  |      | false 면 숨깁니다. (기본 true)                                        |
 *
 * 새 화면은 npm run new:page 가 이 파일 맨 아래에 한 줄을 추가해 줍니다.
 */
export const MENU_ROWS = [
    { id: 'MENU_010000', order: 1, to: '/', labelKey: 'nav.home', icon: 'home' },
    { id: 'MENU_010100', order: 2, to: '/workspace', labelKey: 'nav.workspace', icon: 'dashboard' },
    { id: 'MENU_015000', order: 3, to: '/theme', labelKey: 'nav.themeSettings', icon: 'cog' },

    { id: 'MENU_018000', order: 4, labelKey: 'nav.guideGroup', icon: 'guide' },
    { id: 'MENU_018001', parentId: 'MENU_018000', order: 1, to: '/demos/demo-guide', labelKey: 'nav.demo.guide' },
    { id: 'MENU_018002', parentId: 'MENU_018000', order: 2, to: '/demos/demo-design-tokens', labelKey: 'nav.demo.designTokens' },
    { id: 'MENU_018003', parentId: 'MENU_018000', order: 3, to: '/demos/demo-page-example', labelKey: 'nav.demo.pageExample' },
    { id: 'MENU_018004', parentId: 'MENU_018000', order: 4, to: '/demos/demo-page-form', labelKey: 'nav.demo.pageForm' },
    { id: 'MENU_018005', parentId: 'MENU_018000', order: 5, to: '/demos/demo-page-master-detail', labelKey: 'nav.demo.pageMasterDetail' },
    { id: 'MENU_018006', parentId: 'MENU_018000', order: 6, to: '/demos/demo-page-picker', labelKey: 'nav.demo.pagePicker' },

    { id: 'MENU_020000', order: 5, labelKey: 'nav.group.input', icon: 'form' },
    { id: 'MENU_020001', parentId: 'MENU_020000', order: 1, to: '/demos/demo-input', labelKey: 'nav.demo.input' },
    { id: 'MENU_020002', parentId: 'MENU_020000', order: 2, to: '/demos/demo-textarea', labelKey: 'nav.demo.textArea' },
    { id: 'MENU_020003', parentId: 'MENU_020000', order: 3, to: '/demos/demo-select', labelKey: 'nav.demo.select' },
    { id: 'MENU_020004', parentId: 'MENU_020000', order: 4, to: '/demos/demo-choice', labelKey: 'nav.demo.choice' },
    { id: 'MENU_020005', parentId: 'MENU_020000', order: 5, to: '/demos/demo-input-number', labelKey: 'nav.demo.inputNumber' },
    { id: 'MENU_020006', parentId: 'MENU_020000', order: 6, to: '/demos/demo-input-group', labelKey: 'nav.demo.inputGroup' },
    { id: 'MENU_020007', parentId: 'MENU_020000', order: 7, to: '/demos/demo-datepicker', labelKey: 'nav.demo.datepicker' },
    { id: 'MENU_020008', parentId: 'MENU_020000', order: 8, to: '/demos/demo-form-field', labelKey: 'nav.demo.form' },
    { id: 'MENU_020009', parentId: 'MENU_020000', order: 9, to: '/demos/demo-upload-image', labelKey: 'nav.demo.uploadImage' },
    { id: 'MENU_020010', parentId: 'MENU_020000', order: 10, to: '/demos/demo-upload-file', labelKey: 'nav.demo.uploadFile' },

    { id: 'MENU_021000', order: 6, labelKey: 'nav.group.display', icon: 'widgets' },
    { id: 'MENU_021001', parentId: 'MENU_021000', order: 1, to: '/demos/demo-button', labelKey: 'nav.demo.button' },
    { id: 'MENU_021002', parentId: 'MENU_021000', order: 2, to: '/demos/demo-top-button', labelKey: 'nav.demo.topButton' },
    { id: 'MENU_021003', parentId: 'MENU_021000', order: 3, to: '/demos/demo-tag', labelKey: 'nav.demo.tag' },
    { id: 'MENU_021004', parentId: 'MENU_021000', order: 4, to: '/demos/demo-rating', labelKey: 'nav.demo.rating' },
    { id: 'MENU_021005', parentId: 'MENU_021000', order: 5, to: '/demos/demo-tooltip', labelKey: 'nav.demo.tooltip' },
    { id: 'MENU_021006', parentId: 'MENU_021000', order: 6, to: '/demos/demo-popover', labelKey: 'nav.demo.popover' },
    { id: 'MENU_021007', parentId: 'MENU_021000', order: 7, to: '/demos/demo-empty', labelKey: 'nav.demo.empty' },
    { id: 'MENU_021008', parentId: 'MENU_021000', order: 8, to: '/demos/demo-spinner', labelKey: 'nav.demo.spinner' },
    { id: 'MENU_021009', parentId: 'MENU_021000', order: 9, to: '/demos/demo-alert', labelKey: 'nav.demo.alert' },

    { id: 'MENU_022000', order: 7, labelKey: 'nav.group.navigation', icon: 'menu' },
    { id: 'MENU_022001', parentId: 'MENU_022000', order: 1, to: '/demos/demo-tabs', labelKey: 'nav.demo.tabs' },
    { id: 'MENU_022002', parentId: 'MENU_022000', order: 2, to: '/demos/demo-accordion', labelKey: 'nav.demo.accordion' },
    { id: 'MENU_022003', parentId: 'MENU_022000', order: 3, to: '/demos/demo-breadcrumb', labelKey: 'nav.demo.breadcrumb' },
    { id: 'MENU_022004', parentId: 'MENU_022000', order: 4, to: '/demos/demo-pagination', labelKey: 'nav.demo.pagination' },
    { id: 'MENU_022005', parentId: 'MENU_022000', order: 5, to: '/demos/demo-segmented', labelKey: 'nav.demo.segmented' },
    { id: 'MENU_022006', parentId: 'MENU_022000', order: 6, to: '/demos/demo-steps', labelKey: 'nav.demo.steps' },
    { id: 'MENU_022007', parentId: 'MENU_022000', order: 7, to: '/demos/demo-carousel', labelKey: 'nav.demo.carousel' },

    { id: 'MENU_023000', order: 8, labelKey: 'nav.group.overlay', icon: 'app' },
    { id: 'MENU_023001', parentId: 'MENU_023000', order: 1, to: '/demos/demo-modal', labelKey: 'nav.demo.modal' },
    { id: 'MENU_023002', parentId: 'MENU_023000', order: 2, to: '/demos/demo-drawer', labelKey: 'nav.demo.drawer' },
    { id: 'MENU_023003', parentId: 'MENU_023000', order: 3, to: '/demos/demo-toast', labelKey: 'nav.demo.toast' },

    { id: 'MENU_024000', order: 9, labelKey: 'nav.group.layout', icon: 'layout' },
    { id: 'MENU_024001', parentId: 'MENU_024000', order: 1, to: '/demos/demo-section', labelKey: 'nav.demo.section' },

    { id: 'MENU_025000', order: 10, labelKey: 'nav.group.data', icon: 'factory' },
    { id: 'MENU_025001', parentId: 'MENU_025000', order: 1, to: '/demos/demo-mes-sample', labelKey: 'nav.demo.mesSample' },
    { id: 'MENU_025002', parentId: 'MENU_025000', order: 2, to: '/demos/demo-data-table', labelKey: 'nav.demo.dataTable' },
    { id: 'MENU_025003', parentId: 'MENU_025000', order: 3, to: '/demos/demo-table', labelKey: 'nav.demo.table' },
    { id: 'MENU_025004', parentId: 'MENU_025000', order: 4, to: '/demos/demo-grid', labelKey: 'nav.demo.grid' },
    { id: 'MENU_025005', parentId: 'MENU_025000', order: 5, to: '/demos/demo-search-panel', labelKey: 'nav.demo.searchPanel' },
    { id: 'MENU_025006', parentId: 'MENU_025000', order: 6, to: '/demos/demo-stat-card', labelKey: 'nav.demo.statCard' },
    { id: 'MENU_025007', parentId: 'MENU_025000', order: 7, to: '/demos/demo-status-lamp', labelKey: 'nav.demo.statusLamp' },
    { id: 'MENU_025008', parentId: 'MENU_025000', order: 8, to: '/demos/demo-equipment-card', labelKey: 'nav.demo.equipmentCard' },
    { id: 'MENU_025009', parentId: 'MENU_025000', order: 9, to: '/demos/demo-timeline', labelKey: 'nav.demo.timeline' },
    { id: 'MENU_025010', parentId: 'MENU_025000', order: 10, to: '/demos/demo-tree', labelKey: 'nav.demo.tree' },
    { id: 'MENU_025011', parentId: 'MENU_025000', order: 11, to: '/demos/demo-transfer', labelKey: 'nav.demo.transfer' },
    { id: 'MENU_025012', parentId: 'MENU_025000', order: 12, to: '/demos/demo-chart', labelKey: 'nav.demo.chart' },
    { id: 'MENU_025013', parentId: 'MENU_025000', order: 13, to: '/demos/demo-progress', labelKey: 'nav.demo.progress' },

    { id: 'MENU_026000', order: 11, labelKey: 'nav.businessDemos', icon: 'chart' },
    { id: 'MENU_026001', parentId: 'MENU_026000', order: 1, to: '/erp-dashboard', labelKey: 'nav.business.erpDashboard' },
    { id: 'MENU_026002', parentId: 'MENU_026000', order: 2, to: '/sales-orders', labelKey: 'nav.business.salesOrders' },
    { id: 'MENU_026004', parentId: 'MENU_026000', order: 3, to: '/purchase-orders', labelKey: 'nav.business.purchaseOrders' },
    { id: 'MENU_026005', parentId: 'MENU_026000', order: 4, to: '/inventory-status', labelKey: 'nav.business.inventoryStatus' },
    { id: 'MENU_026006', parentId: 'MENU_026000', order: 5, to: '/production-plan', labelKey: 'nav.business.productionPlan' },
    { id: 'MENU_026007', parentId: 'MENU_026000', order: 6, to: '/work-orders', labelKey: 'nav.business.workOrders' },
    { id: 'MENU_026009', parentId: 'MENU_026000', order: 7, to: '/quality-inspection', labelKey: 'nav.business.qualityInspection' },
    { id: 'MENU_026010', parentId: 'MENU_026000', order: 8, to: '/equipment-monitoring', labelKey: 'nav.business.equipmentMonitoring' },
    { id: 'MENU_030000', order: 12, to: '/settings', labelKey: 'nav.settings', icon: 'cog' },
    { id: 'MENU_040000', order: 13, to: '/legal/lucide', labelKey: 'nav.legalLucide', icon: 'info' },
];
