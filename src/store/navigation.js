/**
 * 네비게이션 메뉴와 활성 경로 상태를 관리하는 Pinia store 파일입니다.
 */
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useI18nText } from '@/composables/useI18nText';

const MENU_SEED = [
    {
        id: 'MENU_010000',
        parentId: null,
        depth: 1,
        order: 1,
        to: '/',
        labelKey: 'nav.home',
        icon: 'home',
        isActive: true,
    },
    {
        id: 'MENU_010100',
        parentId: null,
        depth: 1,
        order: 2,
        to: '/workspace',
        labelKey: 'nav.workspace',
        icon: 'dashboard',
        isActive: true,
    },
    {
        id: 'MENU_015000',
        parentId: null,
        depth: 1,
        order: 3,
        to: '/theme',
        labelKey: 'nav.themeSettings',
        icon: 'cog',
        isActive: true,
    },
    {
        id: 'MENU_018000',
        parentId: null,
        depth: 1,
        order: 4,
        to: '',
        labelKey: 'nav.guideGroup',
        icon: 'guide',
        isActive: true,
    },
    {
        id: 'MENU_018001',
        parentId: 'MENU_018000',
        depth: 2,
        order: 1,
        to: '/demos/demo-guide',
        labelKey: 'nav.demo.guide',
        isActive: true,
    },
    {
        id: 'MENU_018002',
        parentId: 'MENU_018000',
        depth: 2,
        order: 2,
        to: '/demos/demo-design-tokens',
        labelKey: 'nav.demo.designTokens',
        isActive: true,
    },
    {
        id: 'MENU_018003',
        parentId: 'MENU_018000',
        depth: 2,
        order: 3,
        to: '/demos/demo-page-example',
        labelKey: 'nav.demo.pageExample',
        isActive: true,
    },
    {
        id: 'MENU_020000',
        parentId: null,
        depth: 1,
        order: 5,
        to: '',
        labelKey: 'nav.group.input',
        icon: 'form',
        isActive: true,
    },
    {
        id: 'MENU_020001',
        parentId: 'MENU_020000',
        depth: 2,
        order: 1,
        to: '/demos/demo-input',
        labelKey: 'nav.demo.input',
        isActive: true,
    },
    {
        id: 'MENU_020002',
        parentId: 'MENU_020000',
        depth: 2,
        order: 2,
        to: '/demos/demo-textarea',
        labelKey: 'nav.demo.textArea',
        isActive: true,
    },
    {
        id: 'MENU_020003',
        parentId: 'MENU_020000',
        depth: 2,
        order: 3,
        to: '/demos/demo-select',
        labelKey: 'nav.demo.select',
        isActive: true,
    },
    {
        id: 'MENU_020004',
        parentId: 'MENU_020000',
        depth: 2,
        order: 4,
        to: '/demos/demo-choice',
        labelKey: 'nav.demo.choice',
        isActive: true,
    },
    {
        id: 'MENU_020005',
        parentId: 'MENU_020000',
        depth: 2,
        order: 5,
        to: '/demos/demo-input-number',
        labelKey: 'nav.demo.inputNumber',
        isActive: true,
    },
    {
        id: 'MENU_020006',
        parentId: 'MENU_020000',
        depth: 2,
        order: 6,
        to: '/demos/demo-input-group',
        labelKey: 'nav.demo.inputGroup',
        isActive: true,
    },
    {
        id: 'MENU_020007',
        parentId: 'MENU_020000',
        depth: 2,
        order: 7,
        to: '/demos/demo-datepicker',
        labelKey: 'nav.demo.datepicker',
        isActive: true,
    },
    {
        id: 'MENU_020008',
        parentId: 'MENU_020000',
        depth: 2,
        order: 8,
        to: '/demos/demo-form-field',
        labelKey: 'nav.demo.form',
        isActive: true,
    },
    {
        id: 'MENU_020009',
        parentId: 'MENU_020000',
        depth: 2,
        order: 9,
        to: '/demos/demo-upload-image',
        labelKey: 'nav.demo.uploadImage',
        isActive: true,
    },
    {
        id: 'MENU_020010',
        parentId: 'MENU_020000',
        depth: 2,
        order: 10,
        to: '/demos/demo-upload-file',
        labelKey: 'nav.demo.uploadFile',
        isActive: true,
    },
    {
        id: 'MENU_021000',
        parentId: null,
        depth: 1,
        order: 6,
        to: '',
        labelKey: 'nav.group.display',
        icon: 'widgets',
        isActive: true,
    },
    {
        id: 'MENU_021001',
        parentId: 'MENU_021000',
        depth: 2,
        order: 1,
        to: '/demos/demo-button',
        labelKey: 'nav.demo.button',
        isActive: true,
    },
    {
        id: 'MENU_021002',
        parentId: 'MENU_021000',
        depth: 2,
        order: 2,
        to: '/demos/demo-top-button',
        labelKey: 'nav.demo.topButton',
        isActive: true,
    },
    {
        id: 'MENU_021003',
        parentId: 'MENU_021000',
        depth: 2,
        order: 3,
        to: '/demos/demo-tag',
        labelKey: 'nav.demo.tag',
        isActive: true,
    },
    {
        id: 'MENU_021004',
        parentId: 'MENU_021000',
        depth: 2,
        order: 4,
        to: '/demos/demo-rating',
        labelKey: 'nav.demo.rating',
        isActive: true,
    },
    {
        id: 'MENU_021005',
        parentId: 'MENU_021000',
        depth: 2,
        order: 5,
        to: '/demos/demo-tooltip',
        labelKey: 'nav.demo.tooltip',
        isActive: true,
    },
    {
        id: 'MENU_021006',
        parentId: 'MENU_021000',
        depth: 2,
        order: 6,
        to: '/demos/demo-popover',
        labelKey: 'nav.demo.popover',
        isActive: true,
    },
    {
        id: 'MENU_021007',
        parentId: 'MENU_021000',
        depth: 2,
        order: 7,
        to: '/demos/demo-empty',
        labelKey: 'nav.demo.empty',
        isActive: true,
    },
    {
        id: 'MENU_021008',
        parentId: 'MENU_021000',
        depth: 2,
        order: 8,
        to: '/demos/demo-spinner',
        labelKey: 'nav.demo.spinner',
        isActive: true,
    },
    {
        id: 'MENU_021009',
        parentId: 'MENU_021000',
        depth: 2,
        order: 9,
        to: '/demos/demo-alert',
        labelKey: 'nav.demo.alert',
        isActive: true,
    },
    {
        id: 'MENU_022000',
        parentId: null,
        depth: 1,
        order: 7,
        to: '',
        labelKey: 'nav.group.navigation',
        icon: 'menu',
        isActive: true,
    },
    {
        id: 'MENU_022001',
        parentId: 'MENU_022000',
        depth: 2,
        order: 1,
        to: '/demos/demo-tabs',
        labelKey: 'nav.demo.tabs',
        isActive: true,
    },
    {
        id: 'MENU_022002',
        parentId: 'MENU_022000',
        depth: 2,
        order: 2,
        to: '/demos/demo-accordion',
        labelKey: 'nav.demo.accordion',
        isActive: true,
    },
    {
        id: 'MENU_022003',
        parentId: 'MENU_022000',
        depth: 2,
        order: 3,
        to: '/demos/demo-breadcrumb',
        labelKey: 'nav.demo.breadcrumb',
        isActive: true,
    },
    {
        id: 'MENU_022004',
        parentId: 'MENU_022000',
        depth: 2,
        order: 4,
        to: '/demos/demo-pagination',
        labelKey: 'nav.demo.pagination',
        isActive: true,
    },
    {
        id: 'MENU_022005',
        parentId: 'MENU_022000',
        depth: 2,
        order: 5,
        to: '/demos/demo-segmented',
        labelKey: 'nav.demo.segmented',
        isActive: true,
    },
    {
        id: 'MENU_022006',
        parentId: 'MENU_022000',
        depth: 2,
        order: 6,
        to: '/demos/demo-steps',
        labelKey: 'nav.demo.steps',
        isActive: true,
    },
    {
        id: 'MENU_022007',
        parentId: 'MENU_022000',
        depth: 2,
        order: 7,
        to: '/demos/demo-carousel',
        labelKey: 'nav.demo.carousel',
        isActive: true,
    },
    {
        id: 'MENU_023000',
        parentId: null,
        depth: 1,
        order: 8,
        to: '',
        labelKey: 'nav.group.overlay',
        icon: 'app',
        isActive: true,
    },
    {
        id: 'MENU_023001',
        parentId: 'MENU_023000',
        depth: 2,
        order: 1,
        to: '/demos/demo-modal',
        labelKey: 'nav.demo.modal',
        isActive: true,
    },
    {
        id: 'MENU_023002',
        parentId: 'MENU_023000',
        depth: 2,
        order: 2,
        to: '/demos/demo-drawer',
        labelKey: 'nav.demo.drawer',
        isActive: true,
    },
    {
        id: 'MENU_023003',
        parentId: 'MENU_023000',
        depth: 2,
        order: 3,
        to: '/demos/demo-toast',
        labelKey: 'nav.demo.toast',
        isActive: true,
    },
    {
        id: 'MENU_024000',
        parentId: null,
        depth: 1,
        order: 9,
        to: '',
        labelKey: 'nav.group.layout',
        icon: 'layout',
        isActive: true,
    },
    {
        id: 'MENU_024001',
        parentId: 'MENU_024000',
        depth: 2,
        order: 1,
        to: '/demos/demo-section',
        labelKey: 'nav.demo.section',
        isActive: true,
    },
    {
        id: 'MENU_025000',
        parentId: null,
        depth: 1,
        order: 10,
        to: '',
        labelKey: 'nav.group.data',
        icon: 'factory',
        isActive: true,
    },
    {
        id: 'MENU_025001',
        parentId: 'MENU_025000',
        depth: 2,
        order: 1,
        to: '/demos/demo-mes-sample',
        labelKey: 'nav.demo.mesSample',
        isActive: true,
    },
    {
        id: 'MENU_025002',
        parentId: 'MENU_025000',
        depth: 2,
        order: 2,
        to: '/demos/demo-data-table',
        labelKey: 'nav.demo.dataTable',
        isActive: true,
    },
    {
        id: 'MENU_025003',
        parentId: 'MENU_025000',
        depth: 2,
        order: 3,
        to: '/demos/demo-table',
        labelKey: 'nav.demo.table',
        isActive: true,
    },
    {
        id: 'MENU_025004',
        parentId: 'MENU_025000',
        depth: 2,
        order: 4,
        to: '/demos/demo-grid',
        labelKey: 'nav.demo.grid',
        isActive: true,
    },
    {
        id: 'MENU_025005',
        parentId: 'MENU_025000',
        depth: 2,
        order: 5,
        to: '/demos/demo-search-panel',
        labelKey: 'nav.demo.searchPanel',
        isActive: true,
    },
    {
        id: 'MENU_025006',
        parentId: 'MENU_025000',
        depth: 2,
        order: 6,
        to: '/demos/demo-stat-card',
        labelKey: 'nav.demo.statCard',
        isActive: true,
    },
    {
        id: 'MENU_025007',
        parentId: 'MENU_025000',
        depth: 2,
        order: 7,
        to: '/demos/demo-status-lamp',
        labelKey: 'nav.demo.statusLamp',
        isActive: true,
    },
    {
        id: 'MENU_025008',
        parentId: 'MENU_025000',
        depth: 2,
        order: 8,
        to: '/demos/demo-equipment-card',
        labelKey: 'nav.demo.equipmentCard',
        isActive: true,
    },
    {
        id: 'MENU_025009',
        parentId: 'MENU_025000',
        depth: 2,
        order: 9,
        to: '/demos/demo-timeline',
        labelKey: 'nav.demo.timeline',
        isActive: true,
    },
    {
        id: 'MENU_025010',
        parentId: 'MENU_025000',
        depth: 2,
        order: 10,
        to: '/demos/demo-tree',
        labelKey: 'nav.demo.tree',
        isActive: true,
    },
    {
        id: 'MENU_025011',
        parentId: 'MENU_025000',
        depth: 2,
        order: 11,
        to: '/demos/demo-transfer',
        labelKey: 'nav.demo.transfer',
        isActive: true,
    },
    {
        id: 'MENU_025012',
        parentId: 'MENU_025000',
        depth: 2,
        order: 12,
        to: '/demos/demo-chart',
        labelKey: 'nav.demo.chart',
        isActive: true,
    },
    {
        id: 'MENU_025013',
        parentId: 'MENU_025000',
        depth: 2,
        order: 13,
        to: '/demos/demo-progress',
        labelKey: 'nav.demo.progress',
        isActive: true,
    },
    {
        id: 'MENU_026000',
        parentId: null,
        depth: 1,
        order: 11,
        to: '',
        labelKey: 'nav.businessDemos',
        icon: 'chart',
        isActive: true,
    },
    {
        id: 'MENU_026001',
        parentId: 'MENU_026000',
        depth: 2,
        order: 1,
        to: '/erp-dashboard',
        labelKey: 'nav.business.erpDashboard',
        isActive: true,
    },
    {
        id: 'MENU_026002',
        parentId: 'MENU_026000',
        depth: 2,
        order: 2,
        to: '/sales-orders',
        labelKey: 'nav.business.salesOrders',
        isActive: true,
    },
    {
        id: 'MENU_026003',
        parentId: 'MENU_026000',
        depth: 2,
        order: 3,
        to: '/sales-order-detail',
        labelKey: 'nav.business.salesOrderDetail',
        isActive: true,
    },
    {
        id: 'MENU_026004',
        parentId: 'MENU_026000',
        depth: 2,
        order: 4,
        to: '/purchase-orders',
        labelKey: 'nav.business.purchaseOrders',
        isActive: true,
    },
    {
        id: 'MENU_026005',
        parentId: 'MENU_026000',
        depth: 2,
        order: 5,
        to: '/inventory-status',
        labelKey: 'nav.business.inventoryStatus',
        isActive: true,
    },
    {
        id: 'MENU_026006',
        parentId: 'MENU_026000',
        depth: 2,
        order: 6,
        to: '/production-plan',
        labelKey: 'nav.business.productionPlan',
        isActive: true,
    },
    {
        id: 'MENU_026007',
        parentId: 'MENU_026000',
        depth: 2,
        order: 7,
        to: '/work-orders',
        labelKey: 'nav.business.workOrders',
        isActive: true,
    },
    {
        id: 'MENU_026008',
        parentId: 'MENU_026000',
        depth: 2,
        order: 8,
        to: '/work-order-detail',
        labelKey: 'nav.business.workOrderDetail',
        isActive: true,
    },
    {
        id: 'MENU_026009',
        parentId: 'MENU_026000',
        depth: 2,
        order: 9,
        to: '/quality-inspection',
        labelKey: 'nav.business.qualityInspection',
        isActive: true,
    },
    {
        id: 'MENU_026010',
        parentId: 'MENU_026000',
        depth: 2,
        order: 10,
        to: '/equipment-monitoring',
        labelKey: 'nav.business.equipmentMonitoring',
        isActive: true,
    },
    {
        id: 'MENU_030000',
        parentId: null,
        depth: 1,
        order: 12,
        to: '/settings',
        labelKey: 'nav.settings',
        icon: 'cog',
        isActive: true,
    },
    {
        id: 'MENU_040000',
        parentId: null,
        depth: 1,
        order: 13,
        to: '/legal/lucide',
        labelKey: 'nav.legalLucide',
        icon: 'info',
        isActive: true,
    },
];

function createNavigationMenus() {
    return MENU_SEED.filter((row) => row.isActive)
        .sort((a, b) => {
            if (a.depth !== b.depth) return a.depth - b.depth;
            return a.order - b.order;
        })
        .map((row) => ({
            id: row.id,
            parentId: row.parentId,
            depth: row.depth,
            order: row.order,
            label: row.labelKey,
            labelKey: row.labelKey,
            to: row.to,
            icon: row.icon,
            newTab: row.newTab ?? false,
        }));
}

function translateNavigationMenus(items, t) {
    if (!t) return [...items];
    return items.map((item) => ({
        ...item,
        label: item.labelKey ? t(item.labelKey, item.label) : item.label,
        children: item.children ? translateNavigationMenus(item.children, t) : undefined,
    }));
}

function buildNavigationTree(items) {
    const nodeMap = new Map();
    const roots = [];

    for (const item of items) {
        nodeMap.set(item.id, {
            ...item,
            children: undefined,
        });
    }

    for (const item of items) {
        const node = nodeMap.get(item.id);
        if (!node) continue;

        const parentId = item.parentId ?? null;
        if (!parentId) {
            roots.push(node);
            continue;
        }

        const parent = nodeMap.get(parentId);
        if (!parent) {
            roots.push(node);
            continue;
        }

        (parent.children ||= []).push(node);
    }

    const sortNavigationTree = (nodes) =>
        [...nodes]
            .sort((a, b) => a.order - b.order)
            .map((node) => ({
                ...node,
                children: node.children ? sortNavigationTree(node.children) : undefined,
            }));

    return sortNavigationTree(roots);
}

export const useNavigationStore = defineStore('navigation', () => {
    const { t } = useI18nText();
    const menus = ref([]);
    const isLoading = ref(false);
    const isLoaded = ref(false);

    const localizedMenus = computed(() => translateNavigationMenus(menus.value, t));
    const menuTree = computed(() => buildNavigationTree(localizedMenus.value));

    async function fetchMenus(force = false) {
        if (isLoading.value) return;
        if (isLoaded.value && !force) return;

        isLoading.value = true;
        try {
            menus.value = createNavigationMenus();
            isLoaded.value = true;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        menus,
        localizedMenus,
        menuTree,
        isLoading,
        isLoaded,
        fetchMenus,
    };
});
