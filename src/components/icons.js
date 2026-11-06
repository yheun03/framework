/**
 * 공통 아이콘 (Lucide - https://lucide.dev, ISC License)
 *
 * - 화면에서는 `import { IconMenu } from '@/components/icons'` 후 `<IconMenu />` 로 사용합니다.
 * - 크기는 font-size(1em), 색상은 color(currentColor), 선 두께는 --app-icon-stroke-width 로 조절합니다.
 * - 새 아이콘은 https://lucide.dev/icons 에서 이름을 찾아 아래 목록에 추가합니다.
 * - Lucide 는 브랜드 로고를 제공하지 않으므로 SNS 아이콘만 같은 규격(24 · stroke)의 SVG 로 직접 정의합니다.
 */

import { defineComponent, h, markRaw, mergeProps } from 'vue';
import {
    ArrowRight,
    ArrowUp,
    ArrowUpToLine,
    Bell,
    BookOpen,
    Box,
    Building2,
    Calendar,
    ChartColumn,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronUp,
    CircleAlert,
    CircleCheck,
    CircleX,
    ClipboardList,
    Clock,
    Factory,
    FileText,
    FileUp,
    Folder,
    FolderOpen,
    FolderPlus,
    Gauge,
    Globe,
    Grid2x2,
    Headset,
    Heart,
    House,
    ImagePlus,
    Info,
    LayoutGrid,
    LayoutTemplate,
    Lightbulb,
    Link,
    ListFilter,
    Lock,
    Mail,
    Menu,
    MessageCircle,
    MessageCircleMore,
    Minus,
    Package,
    Palette,
    Pause,
    Pencil,
    PhoneCall,
    Play,
    Plus,
    Pointer,
    RefreshCw,
    Rocket,
    Search,
    Settings,
    ShieldCheck,
    ShoppingBag,
    SlidersHorizontal,
    Star,
    Target,
    Trash2,
    TrendingDown,
    TrendingUp,
    TriangleAlert,
    User,
    UserPlus,
    Users,
    X,
    Eye,
    EyeOff,
} from '@lucide/vue';

function createIcon(icon, options = {}) {
    return markRaw(
        defineComponent({
            inheritAttrs: false,
            setup(_, { attrs }) {
                return () =>
                    h(
                        icon,
                        mergeProps(attrs, {
                            class: ['app-icon', { 'app-icon--filled': options.filled }],
                            size: '1em',
                            fill: options.filled ? 'currentColor' : 'none',
                            'aria-hidden': 'true',
                        }),
                    );
            },
        }),
    );
}

/** Lucide 와 같은 규격(viewBox 24, stroke)으로 그린 SNS 아이콘 */
function createSvgIcon(children) {
    return markRaw(
        defineComponent({
            inheritAttrs: false,
            setup(_, { attrs }) {
                return () =>
                    h(
                        'svg',
                        mergeProps(attrs, {
                            class: 'app-icon',
                            xmlns: 'http://www.w3.org/2000/svg',
                            width: '1em',
                            height: '1em',
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            'stroke-width': 2,
                            'stroke-linecap': 'round',
                            'stroke-linejoin': 'round',
                            'aria-hidden': 'true',
                        }),
                        children.map(([tag, props]) => h(tag, props)),
                    );
            },
        }),
    );
}

export const IconAccount = createIcon(User);
export const IconAccountGroup = createIcon(Users);
export const IconAccountPlus = createIcon(UserPlus);
export const IconApp = createIcon(LayoutGrid);
export const IconCalendar = createIcon(Calendar);
export const IconCheck = createIcon(Check);
export const IconCheckCircle = createIcon(CircleCheck);
export const IconChevronDown = createIcon(ChevronDown);
export const IconChevronLeft = createIcon(ChevronLeft);
export const IconChevronRight = createIcon(ChevronRight);
export const IconChevronSmallLeft = createIcon(ChevronLeft);
export const IconChevronSmallRight = createIcon(ChevronRight);
export const IconClose = createIcon(X);
export const IconCloseSmall = createIcon(X);
export const IconCog = createIcon(Settings);
export const IconDashboard = createIcon(Gauge);
export const IconDoubleLeft = createIcon(ChevronsLeft);
export const IconDoubleRight = createIcon(ChevronsRight);
export const IconEmail = createIcon(Mail);
export const IconEye = createIcon(Eye);
export const IconEyeOff = createIcon(EyeOff);
export const IconFile = createIcon(FileText);
export const IconFileUpload = createIcon(FileUp);
export const IconFilter = createIcon(ListFilter);
export const IconFolderPlus = createIcon(FolderPlus);
export const IconForm = createIcon(ClipboardList);
export const IconHome = createIcon(House);
export const IconImagePlus = createIcon(ImagePlus);
export const IconInfo = createIcon(Info);
export const IconLink = createIcon(Link);
export const IconLock = createIcon(Lock);
export const IconMagnify = createIcon(Search);
export const IconMenu = createIcon(Menu);
export const IconMinus = createIcon(Minus);
export const IconPencil = createIcon(Pencil);
export const IconSearch = IconMagnify;
export const IconStar = createIcon(Star);
export const IconTap = createIcon(Pointer);
export const IconTarget = createIcon(Target);
export const IconTrash = createIcon(Trash2);
export const IconWidgets = createIcon(Grid2x2);
export const IconAlert = createIcon(CircleAlert);
export const IconAngleUp = createIcon(ChevronUp);
export const IconArrowUp = createIcon(ArrowUp);
export const IconArrowUpToLine = createIcon(ArrowUpToLine);
export const IconBell = createIcon(Bell);
export const IconBox = createIcon(Package);
export const IconClock = createIcon(Clock);
export const IconFolder = createIcon(Folder);
export const IconFolderOpen = createIcon(FolderOpen);
export const IconPause = createIcon(Pause);
export const IconPlay = createIcon(Play);
export const IconPlus = createIcon(Plus);
export const IconRefresh = createIcon(RefreshCw);
export const IconStarFill = createIcon(Star, { filled: true });
export const IconTrendDown = createIcon(TrendingDown);
export const IconTrendUp = createIcon(TrendingUp);
export const IconWarning = createIcon(TriangleAlert);
export const IconCrossCircle = createIcon(CircleX);
export const IconSettings = createIcon(SlidersHorizontal);
export const IconFactory = createIcon(Factory);
// 홈페이지 (GNB / Footer / 썸네일 / 독바)
export const IconShoppingBag = createIcon(ShoppingBag);
export const IconHeart = createIcon(Heart);
export const IconHeartFill = createIcon(Heart, { filled: true });
export const IconComment = createIcon(MessageCircleMore);
export const IconArrowRight = createIcon(ArrowRight);
export const IconPhone = createIcon(PhoneCall);
export const IconHeadset = createIcon(Headset);
export const IconBulb = createIcon(Lightbulb);
export const IconRocket = createIcon(Rocket);
export const IconShieldCheck = createIcon(ShieldCheck);
export const IconChart = createIcon(ChartColumn);
export const IconCube = createIcon(Box);
export const IconGlobe = createIcon(Globe);
export const IconBuilding = createIcon(Building2);
// LNB 그룹
export const IconGuide = createIcon(BookOpen);
export const IconPalette = createIcon(Palette);
export const IconLayout = createIcon(LayoutTemplate);
// SNS (Lucide 미제공 → 같은 규격으로 직접 정의)
export const IconInstagram = createSvgIcon([
    ['rect', { x: 2, y: 2, width: 20, height: 20, rx: 5, ry: 5 }],
    ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }],
    ['line', { x1: 17.5, x2: 17.51, y1: 6.5, y2: 6.5 }],
]);
export const IconFacebook = createSvgIcon([['path', { d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' }]]);
export const IconYoutube = createSvgIcon([
    [
        'path',
        {
            d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17',
        },
    ],
    ['path', { d: 'm10 15 5-3-5-3z' }],
]);
export const IconX = createSvgIcon([
    ['path', { d: 'M4 4l11.733 16H20L8.267 4z' }],
    ['path', { d: 'M4 20l6.768-6.768' }],
    ['path', { d: 'M13.228 10.772 20 4' }],
]);
export const IconKakao = createIcon(MessageCircle, { filled: true });
