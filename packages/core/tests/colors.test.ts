import { describe, it, expect } from 'vitest'
import { resolveGlitchColors, isValidColorString } from '../src/colors.js'
import { getRandomGlitchColors, PALETTES } from '../src/palette.js'

describe('colors & palettes', () => {
  describe('isValidColorString', () => {
    it('validates hex, rgb, rgba, hsl, and named colors', () => {
      expect(isValidColorString('#ff0055')).toBe(true)
      expect(isValidColorString('#fff')).toBe(true)
      expect(isValidColorString('#12345678')).toBe(true)
      expect(isValidColorString('rgb(255, 0, 100)')).toBe(true)
      expect(isValidColorString('rgba(0, 255, 200, 0.5)')).toBe(true)
      expect(isValidColorString('hsl(180, 50%, 50%)')).toBe(true)
      expect(isValidColorString('red')).toBe(true)
      expect(isValidColorString('cyan')).toBe(true)

      expect(isValidColorString('')).toBe(false)
      expect(isValidColorString('   ')).toBe(false)
      expect(isValidColorString(123)).toBe(false)
      expect(isValidColorString(null)).toBe(false)
      expect(isValidColorString(undefined)).toBe(false)
    })
  })

  describe('getRandomGlitchColors', () => {
    it('returns a 2-color tuple from curated palettes deterministically with mocked random', () => {
      // Mock randomFn returning 0
      const colors = getRandomGlitchColors(() => 0)
      expect(colors).toHaveLength(2)
      expect(colors[0]).toBe(PALETTES[0]![0])
      expect(colors[1]).toBe(PALETTES[0]![1])
    })

    it('ensures color1 and color2 are not identical in palette', () => {
      const colors = getRandomGlitchColors(() => 0.5)
      expect(colors[0]).not.toBe(colors[1])
    })
  })

  describe('resolveGlitchColors', () => {
    it('returns random colors when userColors is undefined or empty', () => {
      const resultEmpty = resolveGlitchColors([], () => 0)
      expect(resultEmpty.color1).toBe(PALETTES[0]![0])
      expect(resultEmpty.color2).toBe(PALETTES[0]![1])
      expect(resultEmpty.textShadow).toBeUndefined()

      const resultUndefined = resolveGlitchColors(undefined, () => 0)
      expect(resultUndefined.color1).toBe(PALETTES[0]![0])
      expect(resultUndefined.color2).toBe(PALETTES[0]![1])
    })

    it('supports 2 custom colors', () => {
      const res = resolveGlitchColors(['#ff00c1', '#00fff0'])
      expect(res.color1).toBe('#ff00c1')
      expect(res.color2).toBe('#00fff0')
      expect(res.textShadow).toBeUndefined()
    })

    it('supports 1 custom color by pairing with transparent', () => {
      const res = resolveGlitchColors(['#ff00c1'])
      expect(res.color1).toBe('#ff00c1')
      expect(res.color2).toBe('transparent')
    })

    it('supports 3 or more colors via multi-layer chromatic textShadow', () => {
      const res = resolveGlitchColors([
        '#ff00c1',
        '#00fff0',
        '#ffe600',
        '#00ff66',
      ])
      expect(res.color1).toBe('#ff00c1')
      expect(res.color2).toBe('#00fff0')
      expect(res.textShadow).toBeDefined()
      expect(res.textShadow).toContain('#ffe600')
      expect(res.textShadow).toContain('#00ff66')
    })

    it('throws descriptive error on invalid color string', () => {
      expect(() => resolveGlitchColors(['not a color!'])).toThrowError(
        /Invalid color provided/
      )
      expect(() => resolveGlitchColors(['#ff0055', ''])).toThrowError(
        /Invalid color provided/
      )
    })
  })
})
