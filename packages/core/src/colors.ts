import { getRandomGlitchColors } from './palette.js';

export interface ResolvedColors {
  color1: string;
  color2: string;
  textShadow?: string;
}

/**
 * Validates a color string to ensure it is non-empty and well-formed.
 */
export function isValidColorString(color: unknown): color is string {
  if (typeof color !== 'string') return false;
  const trimmed = color.trim();
  if (!trimmed) return false;
  // Accepts hex, rgb, rgba, hsl, hsla, or standard named css colors
  return (
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed) ||
    /^(rgb|rgba|hsl|hsla)\(/.test(trimmed) ||
    /^[a-zA-Z]+$/.test(trimmed)
  );
}

/**
 * Resolves colors for an active glitch burst.
 * - If no colors provided or array is empty: generates random coherent pair.
 * - If 2 colors provided: mapped to color1 and color2.
 * - If 3 or more colors provided: first 2 map to color1/color2, and additional
 *   colors are stacked as chromatic text-shadow layers with micro-displacements.
 */
export function resolveGlitchColors(
  userColors?: string[],
  randomFn: () => number = Math.random
): ResolvedColors {
  if (!userColors || userColors.length === 0) {
    const [c1, c2] = getRandomGlitchColors(randomFn);
    return { color1: c1, color2: c2 };
  }

  // Validate colors
  for (const c of userColors) {
    if (!isValidColorString(c)) {
      throw new Error(`[GYUT] Invalid color provided: "${String(c)}". Expected valid hex, rgb, hsl, or named CSS color.`);
    }
  }

  if (userColors.length === 1) {
    // Single custom color provided: pair with complementary dark/light fallback
    return {
      color1: userColors[0]!,
      color2: 'transparent',
    };
  }

  const color1 = userColors[0]!;
  const color2 = userColors[1]!;

  if (userColors.length === 2) {
    return { color1, color2 };
  }

  // 3+ colors: generate multi-layer chromatic text-shadow
  // e.g. -2px 0px color3, 0px 2px color4, 2px -1px color5
  const shadowLayers: string[] = [];
  const extraColors = userColors.slice(2);
  const offsets = [
    [-2, 1],
    [2, -1],
    [0, 2],
    [-1, -2],
    [1, 2],
  ];

  for (let i = 0; i < extraColors.length; i++) {
    const offset = offsets[i % offsets.length] ?? [1, 1];
    shadowLayers.push(`${offset[0]}px ${offset[1]}px 0 ${extraColors[i]}`);
  }

  return {
    color1,
    color2,
    textShadow: shadowLayers.join(', '),
  };
}

