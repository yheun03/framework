/**
 * 퍼블리싱 temp 데이터용 샘플 이미지 (SVG data URI)
 * - 외부 이미지 서버(picsum 등) 없이 폐쇄망 · 공장 내부망에서도 표시됩니다.
 * - 같은 seed 는 항상 같은 색으로 그립니다.
 *
 *   sampleImage(1)                  // 240 x 240
 *   sampleImage(101, 80)            // 80 x 80
 *   sampleImage(31, 1200, 800)      // 1200 x 800
 */
const COLORS = [
    ['#4896ec', '#1f489b'],
    ['#4aa63c', '#0c5b00'],
    ['#f19c38', '#d55b26'],
    ['#8f36aa', '#441d87'],
    ['#54bad1', '#275f63'],
    ['#de5e56', '#b63731'],
    ['#667c89', '#283237'],
];

export function sampleImage(seed = 1, width = 240, height = width) {
    const [from, to] = COLORS[Math.abs(seed) % COLORS.length];
    const fontSize = Math.max(12, Math.round(Math.min(width, height) / 5));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" fill="#ffffff" font-family="sans-serif" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${seed}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
