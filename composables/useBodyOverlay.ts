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
        if (event.key === "Escape") options.close();
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
        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeydown);
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", options.close);
    }

    function stop() {
        if (!listening) return;
        listening = false;
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", options.close);
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
    const left = Math.min(
        Math.max(screenGap, triggerRect.left),
        Math.max(screenGap, window.innerWidth - width - screenGap),
    );

    return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
    };
}
