type BodyOverlayOptions = {
    trigger: () => HTMLElement | null;
    overlay: () => HTMLElement | null;
    close: () => void;
};

export function useBodyOverlay(options: BodyOverlayOptions) {
    let listening = false;

    function contains(target: EventTarget | null) {
        if (!(target instanceof Node)) return false;
        return Boolean(options.trigger()?.contains(target) || options.overlay()?.contains(target));
    }

    function handlePointerDown(event: PointerEvent) {
        if (!contains(event.target)) options.close();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') options.close();
    }

    function handleScroll(event: Event) {
        const overlay = options.overlay();
        const target = event.target;

        if (target instanceof Node && overlay?.contains(target)) return;
        options.close();
    }

    function start() {
        if (listening) return;
        listening = true;
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeydown);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', options.close);
    }

    function stop() {
        if (!listening) return;
        listening = false;
        document.removeEventListener('pointerdown', handlePointerDown);
        document.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', options.close);
    }

    onBeforeUnmount(stop);

    return { start, stop };
}

export function getBodyOverlayStyle(trigger: HTMLElement, overlay: HTMLElement) {
    const gap = 6;
    const screenGap = 8;
    const triggerRect = trigger.getBoundingClientRect();
    const overlayHeight = overlay.offsetHeight;
    const width = triggerRect.width;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const openAbove = spaceBelow < overlayHeight + gap && triggerRect.top > spaceBelow;
    const maxTop = Math.max(screenGap, window.innerHeight - overlayHeight - screenGap);
    const top = openAbove
        ? Math.max(screenGap, triggerRect.top - overlayHeight - gap)
        : Math.max(screenGap, Math.min(maxTop, triggerRect.bottom + gap));
    const left = Math.min(Math.max(screenGap, triggerRect.left), Math.max(screenGap, window.innerWidth - width - screenGap));

    return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
    };
}

export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tooltip / Popover 처럼 trigger 주변(상하좌우)에 띄우는 레이어 위치를 계산합니다.
 * 화면 밖으로 나가면 반대 방향으로 뒤집고, 좌우는 화면 안으로 보정합니다.
 */
export function getFloatingStyle(trigger: HTMLElement, overlay: HTMLElement, placement: FloatingPlacement = 'top', gap = 10) {
    const screenGap = 8;
    const rect = trigger.getBoundingClientRect();
    const width = overlay.offsetWidth;
    const height = overlay.offsetHeight;
    let resolved: FloatingPlacement = placement;

    if (resolved === 'top' && rect.top - height - gap < screenGap) resolved = 'bottom';
    else if (resolved === 'bottom' && rect.bottom + height + gap > window.innerHeight - screenGap) resolved = 'top';
    else if (resolved === 'left' && rect.left - width - gap < screenGap) resolved = 'right';
    else if (resolved === 'right' && rect.right + width + gap > window.innerWidth - screenGap) resolved = 'left';

    let top = 0;
    let left = 0;

    if (resolved === 'top' || resolved === 'bottom') {
        top = resolved === 'top' ? rect.top - height - gap : rect.bottom + gap;
        left = rect.left + rect.width / 2 - width / 2;
    } else {
        top = rect.top + rect.height / 2 - height / 2;
        left = resolved === 'left' ? rect.left - width - gap : rect.right + gap;
    }

    const clampedLeft = Math.min(Math.max(screenGap, left), Math.max(screenGap, window.innerWidth - width - screenGap));
    const clampedTop = Math.min(Math.max(screenGap, top), Math.max(screenGap, window.innerHeight - height - screenGap));
    // 화살표가 trigger 중앙을 가리키도록 보정값을 CSS 변수로 전달합니다.
    const arrowOffset =
        resolved === 'top' || resolved === 'bottom' ? rect.left + rect.width / 2 - clampedLeft : rect.top + rect.height / 2 - clampedTop;

    return {
        placement: resolved,
        style: {
            top: `${clampedTop}px`,
            left: `${clampedLeft}px`,
            '--floating-arrow-offset': `${arrowOffset}px`,
        } as Record<string, string>,
    };
}
