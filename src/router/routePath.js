/**
 * src/views 의 파일 경로 → 화면 주소
 * - views/demos/demo-button.vue → /demos/demo-button
 * - views/index.vue → /
 * - views/orders/[id].vue → /orders/:id (동적 주소)
 */
export function toRoutePath(file) {
    const path = file
        .replace(/^\/?src\/views/, '')
        .replace(/\.vue$/, '')
        .replace(/\/index$/, '')
        .replace(/\[(\w+)\]/g, ':$1');
    return path || '/';
}
