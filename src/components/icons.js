/**
 * 공통 아이콘 (Lucide - https://lucide.dev, ISC License)
 *
 * - 화면에서는 `import { IconMenu } from '@/components/icons'` 후 `<IconMenu />` 로 사용합니다.
 * - 크기는 font-size(1em), 색상은 color(currentColor), 선 두께는 --app-icon-stroke-width 로 조절합니다.
 * - 새 아이콘은 https://lucide.dev/icons 에서 이름을 찾아 아래 목록에 추가합니다.
 */

import { defineComponent, h, markRaw, mergeProps } from 'vue';
import {
    ArrowRight,
    ArrowUp,
    ArrowUpToLine,
    Bell,
    BookOpen,
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
    Code,
    Copy,
    Clock,
    Factory,
    FileText,
    FileUp,
    Folder,
    FolderOpen,
    FolderPlus,
    Gauge,
    Grid2x2,
    House,
    ImagePlus,
    Info,
    LayoutGrid,
    LayoutTemplate,
    Link,
    ListFilter,
    Lock,
    LogOut,
    Mail,
    Menu,
    Minus,
    Package,
    Pause,
    Pencil,
    Play,
    Plus,
    Pointer,
    RefreshCw,
    Search,
    Settings,
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

export const IconAccount = createIcon(User);
export const IconAccountGroup = createIcon(Users);
export const IconAccountPlus = createIcon(UserPlus);
export const IconApp = createIcon(LayoutGrid);
export const IconCalendar = createIcon(Calendar);
export const IconLogout = createIcon(LogOut);
export const IconCheck = createIcon(Check);
export const IconCheckCircle = createIcon(CircleCheck);
export const IconChevronDown = createIcon(ChevronDown);
export const IconChevronLeft = createIcon(ChevronLeft);
export const IconChevronRight = createIcon(ChevronRight);
export const IconChevronSmallLeft = createIcon(ChevronLeft);
export const IconChevronSmallRight = createIcon(ChevronRight);
export const IconClose = createIcon(X);
export const IconCloseSmall = createIcon(X);
export const IconCode = createIcon(Code);
export const IconCog = createIcon(Settings);
export const IconCopy = createIcon(Copy);
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
export const IconArrowRight = createIcon(ArrowRight);
export const IconChart = createIcon(ChartColumn);
// LNB 그룹
export const IconGuide = createIcon(BookOpen);
export const IconLayout = createIcon(LayoutTemplate);
