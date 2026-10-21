import { defineComponent, h, markRaw, mergeProps } from 'vue';

function createIcon(iconClass: string) {
    return markRaw(
        defineComponent({
            inheritAttrs: false,
            setup(_, { attrs }) {
                return () =>
                    h(
                        'i',
                        mergeProps(attrs, {
                            class: ['app-icon', 'fi', iconClass],
                            'aria-hidden': 'true',
                        }),
                    );
            },
        }),
    );
}

export const IconAccount = createIcon('fi-rr-user');
export const IconAccountGroup = createIcon('fi-rr-users');
export const IconAccountPlus = createIcon('fi-rr-user-add');
export const IconApp = createIcon('fi-rr-apps');
export const IconCalendar = createIcon('fi-rr-calendar');
export const IconCheck = createIcon('fi-rr-check');
export const IconCheckCircle = createIcon('fi-rr-check-circle');
export const IconChevronDown = createIcon('fi-rr-angle-small-down');
export const IconChevronLeft = createIcon('fi-rr-angle-left');
export const IconChevronRight = createIcon('fi-rr-angle-right');
export const IconChevronSmallLeft = createIcon('fi-rr-angle-small-left');
export const IconChevronSmallRight = createIcon('fi-rr-angle-small-right');
export const IconClose = createIcon('fi-rr-cross');
export const IconCloseSmall = createIcon('fi-rr-cross-small');
export const IconCog = createIcon('fi-rr-settings');
export const IconDashboard = createIcon('fi-rr-dashboard');
export const IconDoubleLeft = createIcon('fi-rr-angle-double-left');
export const IconDoubleRight = createIcon('fi-rr-angle-double-right');
export const IconEmail = createIcon('fi-rr-envelope');
export const IconEye = createIcon('fi-rr-eye');
export const IconEyeOff = createIcon('fi-rr-eye-crossed');
export const IconFile = createIcon('fi-rr-document');
export const IconFileUpload = createIcon('fi-rr-file-upload');
export const IconFilter = createIcon('fi-rr-bars-filter');
export const IconFolderPlus = createIcon('fi-rr-add-folder');
export const IconForm = createIcon('fi-rr-form');
export const IconHome = createIcon('fi-rr-home');
export const IconImagePlus = createIcon('fi-rr-add-image');
export const IconInfo = createIcon('fi-rr-info');
export const IconLink = createIcon('fi-rr-link');
export const IconLock = createIcon('fi-rr-lock');
export const IconMagnify = createIcon('fi-rr-search');
export const IconMenu = createIcon('fi-rr-menu-burger');
export const IconMinus = createIcon('fi-rr-minus');
export const IconPencil = createIcon('fi-rr-pencil');
export const IconSearch = IconMagnify;
export const IconStar = createIcon('fi-rr-star');
export const IconTap = createIcon('fi-rr-tap');
export const IconTarget = createIcon('fi-rr-target');
export const IconTrash = createIcon('fi-rr-trash');
export const IconWidgets = createIcon('fi-rr-grid');
export const IconAlert = createIcon('fi-rr-exclamation');
export const IconAngleUp = createIcon('fi-rr-angle-small-up');
export const IconArrowUp = createIcon('fi-rr-arrow-small-up');
export const IconArrowUpToLine = createIcon('fi-rr-arrow-to-top');
export const IconBell = createIcon('fi-rr-bell');
export const IconBox = createIcon('fi-rr-box-alt');
export const IconClock = createIcon('fi-rr-clock');
export const IconFolder = createIcon('fi-rr-folder');
export const IconFolderOpen = createIcon('fi-rr-folder-open');
export const IconPause = createIcon('fi-rr-pause');
export const IconPlay = createIcon('fi-rr-play');
export const IconPlus = createIcon('fi-rr-plus');
export const IconRefresh = createIcon('fi-rr-refresh');
export const IconStarFill = createIcon('fi-sr-star');
export const IconTrendDown = createIcon('fi-rr-arrow-trend-down');
export const IconTrendUp = createIcon('fi-rr-arrow-trend-up');
export const IconWarning = createIcon('fi-rr-triangle-warning');
export const IconCrossCircle = createIcon('fi-rr-cross-circle');
export const IconSettings = createIcon('fi-rr-settings-sliders');
export const IconFactory = createIcon('fi-rr-industry-windows');
