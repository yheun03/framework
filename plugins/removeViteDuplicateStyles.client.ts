/**
 * Vite 개발 환경에서 CSS가 link와 inline style로 중복 적용되는 문제를 방지하는 Nuxt client plugin입니다.
 */

function removeViteDuplicateStyles() {
  // link로 이미 로드된 stylesheet href 목록
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"][href]'),
  );
  const linkHrefs = new Set(
    links.map((link) => link.getAttribute("href")).filter(Boolean),
  );

  // Vite dev 서버가 주입한 inline style 목록
  const styles = Array.from(
    document.querySelectorAll<HTMLStyleElement>("style[data-vite-dev-id]"),
  );

  for (const style of styles) {
    const devId = style.dataset.viteDevId;
    if (!devId) continue;

    // 동일한 CSS가 link와 style로 중복 존재하면 inline style 제거
    if (linkHrefs.has(devId)) style.remove();
  }
}

export default defineNuxtPlugin(() => {
  // 개발 모드의 클라이언트 환경에서만 실행
  if (!import.meta.dev || !import.meta.client) return;

  removeViteDuplicateStyles();

  // HMR로 style 태그가 다시 추가될 수 있어 head 변경 감시
  const observer = new MutationObserver(() => removeViteDuplicateStyles());

  observer.observe(document.head, {
    childList: true,
    subtree: true,
  });
});
