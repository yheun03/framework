/**
 * 접근성 개발 경고 (개발 모드에서만 동작, 운영 빌드에서는 제거됩니다)
 *
 * 화면에 그려진 입력 요소에 이름(label · aria-label · aria-labelledby)이 없으면 콘솔에 알려줍니다.
 * placeholder 는 입력하면 사라지므로 이름으로 보지 않습니다.
 */
import { nextTick, onMounted } from 'vue';

function hasAccessibleName(element) {
    if (!element) return true;
    if (element.getAttribute('aria-label')?.trim()) return true;
    if (element.getAttribute('aria-labelledby')) return true;
    if (element.id && document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent.trim()) return true;
    return Boolean(element.closest('label')?.textContent.trim());
}

/**
 * @param {string} componentName 경고에 표시할 컴포넌트 이름
 * @param {Function} getControl 이름을 확인할 입력 요소(HTMLElement 또는 null)를 돌려주는 함수
 */
export function useLabelWarning(componentName, getControl) {
    if (!import.meta.env?.DEV) return;
    onMounted(async () => {
        await nextTick();
        const control = getControl();
        if (hasAccessibleName(control)) return;
        // eslint-disable-next-line no-console
        console.warn(`[a11y] ${componentName} 에 이름이 없습니다. label 또는 aria-label 을 지정하세요. (placeholder 는 이름이 아닙니다)`, control);
    });
}
