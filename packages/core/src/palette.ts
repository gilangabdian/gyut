/**
 * Curated coherent palettes for random glitch color selection.
 * Each palette contains high-contrast digital accent colors designed to pop
 * against both dark and light backgrounds.
 */
export const PALETTES: readonly (readonly string[])[] = [
  // Cyberpunk Neon
  ['#00ffff', '#ff007f', '#ffe600'],
  // Electric Matrix
  ['#00ff66', '#00ffff', '#39ff14'],
  // Synthwave
  ['#ff71ce', '#01cdfe', '#05ffa1'],
  // Tokyo Arcade
  ['#ff0055', '#00f0ff', '#ffe600'],
  // High Voltage
  ['#ff3860', '#ffdd57', '#23d160'],
] as const

/**
 * Picks 2 distinct contrasting colors from the curated palettes.
 * Uses a deterministic selection based on Math.random for testability.
 */
export function getRandomGlitchColors(
  randomFn: () => number = Math.random
): [string, string] {
  const paletteIndex =
    Math.floor(randomFn() * PALETTES.length) % PALETTES.length
  const palette = PALETTES[paletteIndex] ?? PALETTES[0]!

  const firstIndex = Math.floor(randomFn() * palette.length) % palette.length
  let secondIndex = Math.floor(randomFn() * palette.length) % palette.length

  if (secondIndex === firstIndex) {
    secondIndex = (firstIndex + 1) % palette.length
  }

  const col1 = palette[firstIndex] ?? '#00ffff'
  const col2 = palette[secondIndex] ?? '#ff007f'

  return [col1, col2]
}
