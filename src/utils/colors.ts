export function getContrastTextColor(bgColor: string): '#2e2e2f' | '#fff' {
  const hex = bgColor.replace('#', '');

  const normalized =
    hex.length === 3
      ? hex.split('').map((c) => c + c).join('')
      : hex;

  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

  return luminance > 186 ? '#2e2e2f' : '#fff';
}

export function lightenColor(
  color: string,
): string {
  const AMOUNT = 0.6;
  const hex = color.replace('#', '');

  const normalized =
    hex.length === 3
      ? hex.split('').map((c) => c + c).join('')
      : hex;

  let r = parseInt(normalized.substring(0, 2), 16);
  let g = parseInt(normalized.substring(2, 4), 16);
  let b = parseInt(normalized.substring(4, 6), 16);

  r = Math.round(r + (255 - r) * AMOUNT);
  g = Math.round(g + (255 - g) * AMOUNT);
  b = Math.round(b + (255 - b) * AMOUNT);

  return `#${[r, g, b]
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

