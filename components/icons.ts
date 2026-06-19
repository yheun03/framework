import { defineComponent, h, markRaw, mergeProps } from "vue";

function createIcon(iconClass: string) {
    return markRaw(defineComponent({
        inheritAttrs: false,
        setup(_, { attrs }) {
            return () =>
                h("i", mergeProps(attrs, {
                    class: ["app-icon", "fi", iconClass],
                    "aria-hidden": "true",
                }));
        },
    }));
}

export const IconAccount = createIcon("fi-rr-user");
export const IconAccountGroup = createIcon("fi-rr-users");
export const IconAccountPlus = createIcon("fi-rr-user-add");
export const IconApp = createIcon("fi-rr-apps");
export const IconCalendar = createIcon("fi-rr-calendar");
export const IconCheck = createIcon("fi-rr-check");
export const IconCheckCircle = createIcon("fi-rr-check-circle");
export const IconChevronDown = createIcon("fi-rr-angle-small-down");
export const IconChevronLeft = createIcon("fi-rr-angle-left");
export const IconChevronRight = createIcon("fi-rr-angle-right");
export const IconChevronSmallLeft = createIcon("fi-rr-angle-small-left");
export const IconChevronSmallRight = createIcon("fi-rr-angle-small-right");
export const IconClose = createIcon("fi-rr-cross");
export const IconCloseSmall = createIcon("fi-rr-cross-small");
export const IconCog = createIcon("fi-rr-settings");
export const IconDashboard = createIcon("fi-rr-dashboard");
export const IconDoubleLeft = createIcon("fi-rr-angle-double-left");
export const IconDoubleRight = createIcon("fi-rr-angle-double-right");
export const IconEmail = createIcon("fi-rr-envelope");
export const IconEye = createIcon("fi-rr-eye");
export const IconEyeOff = createIcon("fi-rr-eye-crossed");
export const IconFile = createIcon("fi-rr-document");
export const IconFileUpload = createIcon("fi-rr-file-upload");
export const IconFilter = createIcon("fi-rr-bars-filter");
export const IconFolderPlus = createIcon("fi-rr-add-folder");
export const IconForm = createIcon("fi-rr-form");
export const IconHome = createIcon("fi-rr-home");
export const IconImagePlus = createIcon("fi-rr-add-image");
export const IconInfo = createIcon("fi-rr-info");
export const IconLink = createIcon("fi-rr-link");
export const IconMagnify = createIcon("fi-rr-search");
export const IconMenu = createIcon("fi-rr-menu-burger");
export const IconMinus = createIcon("fi-rr-minus");
export const IconPencil = createIcon("fi-rr-pencil");
export const IconSearch = IconMagnify;
export const IconStar = createIcon("fi-rr-star");
export const IconTap = createIcon("fi-rr-tap");
export const IconTarget = createIcon("fi-rr-target");
export const IconTrash = createIcon("fi-rr-trash");
export const IconWidgets = createIcon("fi-rr-grid");
