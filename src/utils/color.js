/**
 * 색 대비 계산 (WCAG 2.1)
 * - SCSS 의 abstract/_theme.scss accessible-text() 와 같은 방식입니다.
 * - 테마 설정 화면에서 primary 를 바꿀 때 글자용 브랜드색(--theme-primary-text)을 다시 계산합니다.
 */

function toRgb(hex) {
    const value = hex.replace('#', '');
    const full = value.length === 3 ? [...value].map((char) => char + char).join('') : value;
    return [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16));
}

function toHex(rgb) {
    return `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}

function channel(value) {
    const ratio = value / 255;
    return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

/** 상대 휘도 (0 ~ 1) */
export function luminance(hex) {
    const [r, g, b] = toRgb(hex).map(channel);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** 두 색의 대비 (1 ~ 21) */
export function contrastRatio(a, b) {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
}

/** weight(0~1) 만큼 target 을 섞은 색 */
export function mixColor(target, color, weight) {
    const from = toRgb(color);
    const to = toRgb(target);
    return toHex(from.map((value, index) => value + (to[index] - value) * weight));
}

/** background 위에서 ratio 이상이 될 때까지 color 에 toward 를 5%씩 섞은 글자색 */
export function accessibleTextColor(color, { background = '#ffffff', ratio = 4.5, toward = '#000000' } = {}) {
    for (let step = 0; step <= 20; step += 1) {
        const candidate = mixColor(toward, color, step * 0.05);
        if (contrastRatio(candidate, background) >= ratio) return candidate;
    }
    return toward;
}

/** 테마별 글자용 브랜드색 (base/_theme.scss · base/_theme-dark.scss 기준과 동일) */
export function primaryTextColor(primary, theme = 'light') {
    if (theme === 'dark') return accessibleTextColor(primary, { background: '#2a2f38', toward: '#ffffff' });
    return accessibleTextColor(primary, { background: mixColor('#ffffff', primary, 0.92) });
}
