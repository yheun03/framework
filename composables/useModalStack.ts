type ModalId = symbol;

const stack: ModalId[] = [];

let prevOverflow: string | null = null;
let prevPaddingRight: string | null = null;

function lockScroll() {
    if (import.meta.server) return;
    const root = document.documentElement;
    if (!root) return;

    if (prevOverflow == null) prevOverflow = root.style.overflow;
    if (prevPaddingRight == null) prevPaddingRight = root.style.paddingRight;

    // 스크롤바로 인한 레이아웃 점프 완화
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;

    root.style.overflow = 'hidden';
}

function unlockScroll() {
    if (import.meta.server) return;
    const root = document.documentElement;
    if (!root) return;

    root.style.overflow = prevOverflow ?? '';
    root.style.paddingRight = prevPaddingRight ?? '';

    prevOverflow = null;
    prevPaddingRight = null;
}

function ensureScrollLock() {
    if (stack.length > 0) lockScroll();
    else unlockScroll();
}

export function useModalStack(id: ModalId) {
    function open() {
        // 이미 있으면 최신으로 올림
        const i = stack.indexOf(id);
        if (i !== -1) stack.splice(i, 1);
        stack.push(id);
        ensureScrollLock();
    }

    function close() {
        const i = stack.indexOf(id);
        if (i !== -1) stack.splice(i, 1);
        ensureScrollLock();
    }

    function isTop() {
        return stack.length > 0 && stack[stack.length - 1] === id;
    }

    function zIndex(base = 2000, step = 10) {
        const i = stack.indexOf(id);
        const idx = i === -1 ? stack.length : i;
        return base + idx * step;
    }

    return {
        open,
        close,
        isTop,
        zIndex,
    };
}
