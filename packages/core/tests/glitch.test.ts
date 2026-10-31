import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createGlitch } from '../src/index.js'

describe('createGlitch lifecycle and DOM behavior', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    vi.useFakeTimers()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    container.remove()
  })

  it('throws error when target element is not found', () => {
    expect(() => createGlitch('#non-existent-element')).toThrowError(
      /Target element not found/
    )
    expect(() => createGlitch(null as unknown as HTMLElement)).toThrowError(
      /Invalid target provided/
    )
  })

  it('initializes on valid HTMLElement and applies attributes and classes', () => {
    const el = document.createElement('h1')
    el.textContent = 'SYSTEM OVERLOAD'
    container.appendChild(el)

    const glitch = createGlitch(el, { trigger: 'manual' })
    expect(el.classList.contains('gyut-target')).toBe(true)
    expect(el.classList.contains('gyut-shape-classic')).toBe(true)
    expect(el.getAttribute('data-gyut-text')).toBe('SYSTEM OVERLOAD')
    expect(glitch.isGlitching).toBe(false)

    glitch.destroy()
  })

  it('initializes using selector string', () => {
    const el = document.createElement('p')
    el.id = 'my-glitch-text'
    el.textContent = 'Hello World'
    container.appendChild(el)

    const glitch = createGlitch('#my-glitch-text', { trigger: 'manual' })
    expect(el.getAttribute('data-gyut-text')).toBe('Hello World')
    glitch.destroy()
  })

  it('cleans up previous instance if createGlitch is called again on the same element', () => {
    const el = document.createElement('span')
    el.textContent = 'Initial'
    container.appendChild(el)

    createGlitch(el, { trigger: 'always', shape: 'classic' })
    expect(el.classList.contains('gyut-shape-classic')).toBe(true)

    const glitch2 = createGlitch(el, { trigger: 'always', shape: 'block' })
    expect(el.classList.contains('gyut-shape-block')).toBe(true)
    expect(el.classList.contains('gyut-shape-classic')).toBe(false)

    glitch2.destroy()
  })

  it('correctly handles start, stop, and destroy lifecycle', () => {
    const el = document.createElement('div')
    el.textContent = 'LIFECYCLE TEST'
    el.style.color = 'rgb(255, 0, 0)'
    container.appendChild(el)

    const glitch = createGlitch(el, {
      trigger: 'manual',
      colors: ['#00ffff', '#ff007f'],
    })
    expect(glitch.isGlitching).toBe(false)
    expect(el.classList.contains('gyut--active')).toBe(false)

    glitch.start()
    expect(glitch.isGlitching).toBe(true)
    expect(el.classList.contains('gyut--active')).toBe(true)
    expect(el.style.getPropertyValue('--gyut-color-1')).toBe('#00ffff')
    expect(el.style.getPropertyValue('--gyut-color-2')).toBe('#ff007f')

    glitch.stop()
    expect(glitch.isGlitching).toBe(false)
    expect(el.classList.contains('gyut--active')).toBe(false)

    glitch.destroy()
    expect(el.classList.contains('gyut-target')).toBe(false)
    expect(el.hasAttribute('data-gyut-text')).toBe(false)
    expect(el.textContent).toBe('LIFECYCLE TEST')
    expect(el.style.color).toBe('rgb(255, 0, 0)')
  })

  it('supports different glitch shape presets (classic, slice, block)', () => {
    const el1 = document.createElement('div')
    const el2 = document.createElement('div')
    const el3 = document.createElement('div')
    container.append(el1, el2, el3)

    const g1 = createGlitch(el1, { shape: 'classic', trigger: 'manual' })
    const g2 = createGlitch(el2, { shape: 'slice', trigger: 'manual' })
    const g3 = createGlitch(el3, { shape: 'block', trigger: 'manual' })

    expect(el1.classList.contains('gyut-shape-classic')).toBe(true)
    expect(el2.classList.contains('gyut-shape-slice')).toBe(true)
    expect(el3.classList.contains('gyut-shape-block')).toBe(true)

    g1.destroy()
    g2.destroy()
    g3.destroy()
  })

  it('handles Unicode and emoji text without corruption', () => {
    const el = document.createElement('h2')
    const unicodeText = '🚀 警告: エラー発生 ⚡ [SYSTEM FAILURE]'
    el.textContent = unicodeText
    container.appendChild(el)

    const glitch = createGlitch(el, { trigger: 'manual' })
    expect(el.getAttribute('data-gyut-text')).toBe(unicodeText)

    glitch.destroy()
    expect(el.textContent).toBe(unicodeText)
  })

  it('handles empty text gracefully', () => {
    const el = document.createElement('span')
    el.textContent = ''
    container.appendChild(el)

    const glitch = createGlitch(el, { trigger: 'manual' })
    expect(el.getAttribute('data-gyut-text')).toBe('')
    glitch.destroy()
    expect(el.textContent).toBe('')
  })

  it('executes afterGlitch hide (opacity and visibility)', () => {
    const el1 = document.createElement('div')
    el1.textContent = 'DISAPPEAR OPACITY'
    container.appendChild(el1)

    const glitch1 = createGlitch(el1, {
      trigger: 'manual',
      afterGlitch: { type: 'hide', mode: 'opacity' },
    })

    glitch1.start()
    expect(glitch1.isGlitching).toBe(true)

    // Fast-forward past burst duration
    vi.advanceTimersByTime(300)

    expect(el1.classList.contains('gyut--hidden')).toBe(true)
    expect(glitch1.isGlitching).toBe(false)

    // Replay restores visibility and triggers again
    glitch1.replay()
    expect(el1.classList.contains('gyut--hidden')).toBe(false)

    glitch1.destroy()

    // Visibility mode test
    const el2 = document.createElement('div')
    el2.textContent = 'DISAPPEAR VISIBILITY'
    container.appendChild(el2)

    const glitch2 = createGlitch(el2, {
      trigger: 'manual',
      afterGlitch: { type: 'hide', mode: 'visibility' },
    })

    glitch2.start()
    vi.advanceTimersByTime(300)
    expect(el2.classList.contains('gyut--visibility-hidden')).toBe(true)

    glitch2.destroy()
  })

  it('executes afterGlitch replace smoothly and allows replay', () => {
    const el = document.createElement('div')
    el.textContent = 'OLD TEXT'
    container.appendChild(el)

    const glitch = createGlitch(el, {
      trigger: 'manual',
      afterGlitch: { type: 'replace', text: 'SYSTEM RESTORED' },
    })

    glitch.start()
    // Burst duration
    vi.advanceTimersByTime(250)
    // Transition duration
    vi.advanceTimersByTime(150)

    expect(el.textContent).toBe('SYSTEM RESTORED')
    expect(el.getAttribute('data-gyut-text')).toBe('SYSTEM RESTORED')
    expect(glitch.isGlitching).toBe(false)

    // Replay should restore original text and glitch again
    glitch.replay()
    expect(el.textContent).toBe('OLD TEXT')
    expect(glitch.isGlitching).toBe(true)

    glitch.destroy()
    expect(el.textContent).toBe('OLD TEXT')
  })

  it('respects prefers-reduced-motion media query', () => {
    const el = document.createElement('div')
    el.textContent = 'ACCESSIBILITY TEST'
    container.appendChild(el)

    // Mock matchMedia returning matches: true
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const glitch = createGlitch(el, {
      trigger: 'manual',
      respectReducedMotion: true,
      afterGlitch: { type: 'replace', text: 'SAFE TEXT' },
    })

    glitch.start()
    // Glitching visual should be bypassed
    expect(el.classList.contains('gyut--active')).toBe(false)

    // afterGlitch executes safely
    vi.advanceTimersByTime(150)
    expect(el.textContent).toBe('SAFE TEXT')

    glitch.destroy()
    window.matchMedia = originalMatchMedia
  })

  it('supports hover trigger mode', () => {
    const el = document.createElement('button')
    el.textContent = 'HOVER ME'
    container.appendChild(el)

    const glitch = createGlitch(el, { trigger: 'hover' })
    expect(glitch.isGlitching).toBe(false)

    // Simulate mouseenter
    el.dispatchEvent(new MouseEvent('mouseenter'))
    expect(glitch.isGlitching).toBe(true)
    expect(el.classList.contains('gyut--active')).toBe(true)

    // Simulate mouseleave
    el.dispatchEvent(new MouseEvent('mouseleave'))
    expect(glitch.isGlitching).toBe(false)
    expect(el.classList.contains('gyut--active')).toBe(false)

    glitch.destroy()
  })

  it("supports 'once' trigger mode running a single burst and stopping", () => {
    const el = document.createElement('h1')
    el.textContent = 'ONCE TEST'
    container.appendChild(el)

    const glitch = createGlitch(el, { trigger: 'once' })
    // Runs immediately on init
    expect(glitch.isGlitching).toBe(true)
    expect(el.classList.contains('gyut--active')).toBe(true)

    // Advance past burst duration (~220ms)
    vi.advanceTimersByTime(250)

    // Burst ends, active class removed, and isGlitching is false
    expect(el.classList.contains('gyut--active')).toBe(false)
    expect(glitch.isGlitching).toBe(false)

    // Advance idle time (further 2000ms) - should NOT start another burst
    vi.advanceTimersByTime(2000)
    expect(el.classList.contains('gyut--active')).toBe(false)
    expect(glitch.isGlitching).toBe(false)

    // Replay should run a single burst again
    glitch.replay()
    expect(glitch.isGlitching).toBe(true)
    expect(el.classList.contains('gyut--active')).toBe(true)

    vi.advanceTimersByTime(250)
    expect(el.classList.contains('gyut--active')).toBe(false)
    expect(glitch.isGlitching).toBe(false)

    glitch.destroy()
  })

  it("supports 'once' trigger combined with afterGlitch replacement", () => {
    const el = document.createElement('h1')
    el.textContent = 'BEFORE GLITCH'
    container.appendChild(el)

    const glitch = createGlitch(el, {
      trigger: 'once',
      afterGlitch: { type: 'replace', text: 'AFTER GLITCH' },
    })

    expect(glitch.isGlitching).toBe(true)
    expect(el.classList.contains('gyut--active')).toBe(true)

    // Burst completes (220ms) and replacement transition resolves (120ms) -> 340ms total
    vi.advanceTimersByTime(400)
    expect(el.textContent).toBe('AFTER GLITCH')
    expect(glitch.isGlitching).toBe(false)

    // Should remain stopped in post-glitch state
    vi.advanceTimersByTime(3000)
    expect(el.textContent).toBe('AFTER GLITCH')
    expect(glitch.isGlitching).toBe(false)

    glitch.destroy()
  })

  it('supports motion presets (default, smooth, lag, long) and sets --gyut-timing accordingly', () => {
    const elSmooth = document.createElement('div')
    const elLag = document.createElement('div')
    const elLong = document.createElement('div')
    const elDefault = document.createElement('div')
    container.append(elSmooth, elLag, elLong, elDefault)

    const gSmooth = createGlitch(elSmooth, {
      preset: 'smooth',
      trigger: 'manual',
    })
    const gLag = createGlitch(elLag, { preset: 'lag', trigger: 'manual' })
    const gLong = createGlitch(elLong, { preset: 'long', trigger: 'manual' })
    const gDefault = createGlitch(elDefault, {
      preset: 'default',
      trigger: 'manual',
    })

    expect(elSmooth.style.getPropertyValue('--gyut-timing')).toBe(
      'cubic-bezier(0.4, 0, 0.2, 1)'
    )
    expect(elLag.style.getPropertyValue('--gyut-timing')).toBe(
      'steps(2, jump-none)'
    )
    expect(elLong.style.getPropertyValue('--gyut-timing')).toBe(
      'steps(3, jump-none)'
    )
    expect(elDefault.style.getPropertyValue('--gyut-timing')).toBe(
      'steps(3, jump-none)'
    )

    gSmooth.destroy()
    gLag.destroy()
    gLong.destroy()
    gDefault.destroy()
  })

  it('sustains long preset burst for ~2200ms and scales with speed multiplier', () => {
    const el = document.createElement('h2')
    el.textContent = 'LONG PRESET'
    container.appendChild(el)

    // Long preset with 1x speed -> burst ~2200ms
    const glitch = createGlitch(el, { trigger: 'once', preset: 'long' })
    expect(glitch.isGlitching).toBe(true)
    expect(el.classList.contains('gyut--active')).toBe(true)

    // After 1500ms, long glitch should STILL be active
    vi.advanceTimersByTime(1500)
    expect(el.classList.contains('gyut--active')).toBe(true)
    expect(glitch.isGlitching).toBe(true)

    // After reaching 2300ms, burst should be completed
    vi.advanceTimersByTime(800)
    expect(el.classList.contains('gyut--active')).toBe(false)
    expect(glitch.isGlitching).toBe(false)

    glitch.destroy()

    // Now test long preset combined with speed: 2 -> burst ~1100ms
    const el2 = document.createElement('h2')
    el2.textContent = 'FAST LONG PRESET'
    container.appendChild(el2)

    const glitch2 = createGlitch(el2, {
      trigger: 'once',
      preset: 'long',
      speed: 2,
    })
    expect(el2.classList.contains('gyut--active')).toBe(true)

    vi.advanceTimersByTime(800)
    expect(el2.classList.contains('gyut--active')).toBe(true)

    vi.advanceTimersByTime(350) // total 1150ms
    expect(el2.classList.contains('gyut--active')).toBe(false)

    glitch2.destroy()
  })

  it('wraps base text in .gyut-base for deep fracturing and restores plain text upon destroy', () => {
    const el = document.createElement('h3')
    el.textContent = 'SHATTERED BASE TEXT'
    container.appendChild(el)

    const glitch = createGlitch(el, { trigger: 'manual' })
    const baseSpan = el.querySelector('.gyut-base')
    expect(baseSpan).not.toBeNull()
    expect(baseSpan?.textContent).toBe('SHATTERED BASE TEXT')

    glitch.destroy()
    expect(el.querySelector('.gyut-base')).toBeNull()
    expect(el.textContent).toBe('SHATTERED BASE TEXT')
  })
})
