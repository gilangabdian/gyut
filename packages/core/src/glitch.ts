import type {
  GlitchAfter,
  GlitchAfterReplace,
  GlitchInstance,
  GlitchOptions,
  GlitchPreset,
  GlitchShape,
  GlitchTrigger,
} from './types.js'
import { resolveGlitchColors } from './colors.js'
import { styleRegistry } from './style-registry.js'

const activeInstances = new WeakMap<HTMLElement, GlitchInstance>()

interface OriginalElementState {
  text: string
  style: string | null
  ariaLabel: string | null
}

interface NormalizedGlitchOptions {
  intensity: number
  speed: number
  delay?: number | undefined
  trigger: GlitchTrigger
  shape: GlitchShape
  preset: GlitchPreset
  respectReducedMotion: boolean
  colors?: string[] | undefined
  afterGlitch?: GlitchAfter | undefined
}

export class GlitchController implements GlitchInstance {
  private element: HTMLElement
  private options: NormalizedGlitchOptions
  private originalState: OriginalElementState
  private _isGlitching = false
  private delayTimer?: any
  private burstTimer?: any
  private idleTimer?: any
  private transTimer?: any
  private abortController = new AbortController()
  private reducedMotion = false

  constructor(target: HTMLElement | string, options: GlitchOptions = {}) {
    let el: HTMLElement | null = null
    if (typeof target === 'string') {
      el = document.querySelector<HTMLElement>(target)
      if (!el) {
        throw new Error(
          `[GYUT] Target element not found for selector: "${target}"`
        )
      }
    } else if (target instanceof HTMLElement) {
      el = target
    } else {
      throw new Error(
        '[GYUT] Invalid target provided. Expected HTMLElement or selector string.'
      )
    }

    // Clean up previous instance on this element if any
    const existing = activeInstances.get(el)
    if (existing) {
      existing.destroy()
    }

    this.element = el

    this.options = {
      intensity: Math.min(Math.max(options.intensity ?? 0.5, 0.1), 1),
      speed: Math.max(options.speed ?? 1, 0.1),
      delay: options.delay ? Math.max(options.delay, 0) : undefined,
      trigger: options.trigger ?? 'always',
      shape: options.shape ?? 'classic',
      preset: options.preset ?? 'default',
      respectReducedMotion: options.respectReducedMotion ?? true,
      colors: options.colors,
      afterGlitch: options.afterGlitch,
    }

    // Store original state for pristine restoration upon destroy()
    this.originalState = {
      text: (this.element.textContent ?? '').trim(),
      style: this.element.getAttribute('style'),
      ariaLabel: this.element.getAttribute('aria-label'),
    }

    // Check prefers-reduced-motion
    if (
      this.options.respectReducedMotion &&
      typeof window !== 'undefined' &&
      window.matchMedia
    ) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      this.reducedMotion = mediaQuery.matches
      mediaQuery.addEventListener(
        'change',
        (e) => {
          this.reducedMotion = e.matches
          if (this.reducedMotion && this._isGlitching) {
            this.stop()
          }
        },
        { signal: this.abortController.signal }
      )
    }

    // Setup element DOM and styles
    this.initElement()
    activeInstances.set(this.element, this)

    // Auto-start if trigger is 'always' or 'once'
    if (this.options.trigger === 'always' || this.options.trigger === 'once') {
      this.start()
    } else if (this.options.trigger === 'hover') {
      this.setupHoverTrigger()
    }
  }

  get isGlitching(): boolean {
    return this._isGlitching
  }

  private getPresetConfig(): {
    timing: string
    animDuration: number
    baseBurst: number
    minIdle: number
    maxIdleVariance: number
  } {
    switch (this.options.preset) {
      case 'smooth':
        return {
          timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          animDuration: 0.75,
          baseBurst: 850,
          minIdle: 900,
          maxIdleVariance: 1200,
        }
      case 'lag':
        return {
          timing: 'steps(2, jump-none)',
          animDuration: 0.5,
          baseBurst: 550,
          minIdle: 1200,
          maxIdleVariance: 1400,
        }
      case 'long':
        return {
          timing: 'steps(3, jump-none)',
          animDuration: 0.22,
          baseBurst: 2200,
          minIdle: 800,
          maxIdleVariance: 1000,
        }
      case 'default':
      default:
        return {
          timing: 'steps(3, jump-none)',
          animDuration: 0.18,
          baseBurst: 220,
          minIdle: 900,
          maxIdleVariance: 1200,
        }
    }
  }

  private initElement(): void {
    styleRegistry.retain()

    this.element.classList.add(
      'gyut-target',
      `gyut-shape-${this.options.shape}`
    )
    this.element.setAttribute('data-gyut-text', this.originalState.text)
    this.element.innerHTML = `<span class="gyut-base">${this.originalState.text}</span>`

    const cfg = this.getPresetConfig()
    const s = this.element.style
    s.setProperty('--gyut-intensity', String(this.options.intensity))
    s.setProperty(
      '--gyut-anim-duration',
      `${(cfg.animDuration / this.options.speed).toFixed(3)}s`
    )
    s.setProperty('--gyut-timing', cfg.timing)
  }

  private setupHoverTrigger(): void {
    const { signal } = this.abortController
    this.element.addEventListener('mouseenter', () => this.start(), { signal })
    this.element.addEventListener('mouseleave', () => this.stop(), { signal })
  }

  start(): void {
    if (this._isGlitching || this.delayTimer) return

    if (this.reducedMotion) {
      if (this.options.afterGlitch) {
        this.executeAfterGlitch()
      }
      return
    }

    if (this.options.delay && this.options.delay > 0) {
      this.delayTimer = setTimeout(() => {
        this.delayTimer = undefined
        this._isGlitching = true
        this.scheduleBurst()
      }, this.options.delay)
      return
    }

    this._isGlitching = true
    this.scheduleBurst()
  }

  stop(): void {
    this._isGlitching = false
    this.clearTimers()
    this.element.classList.remove('gyut--active')
  }

  replay(): void {
    this.stop()

    this.element.classList.remove(
      'gyut--hidden',
      'gyut--visibility-hidden',
      'gyut--replacing'
    )
    this.element.innerHTML = `<span class="gyut-base">${this.originalState.text}</span>`
    this.element.setAttribute('data-gyut-text', this.originalState.text)

    this._isGlitching = true
    this.scheduleBurst()
  }

  destroy(): void {
    this.stop()
    this.clearTimers()
    this.abortController.abort()

    this.element.textContent = this.originalState.text
    this.element.removeAttribute('data-gyut-text')
    this.element.classList.remove(
      'gyut-target',
      'gyut--active',
      'gyut--hidden',
      'gyut--visibility-hidden',
      'gyut--replacing',
      `gyut-shape-${this.options.shape}`
    )

    if (this.originalState.style !== null) {
      this.element.setAttribute('style', this.originalState.style)
    } else {
      this.element.removeAttribute('style')
    }

    if (this.originalState.ariaLabel !== null) {
      this.element.setAttribute('aria-label', this.originalState.ariaLabel)
    } else {
      this.element.removeAttribute('aria-label')
    }

    styleRegistry.release()
    activeInstances.delete(this.element)
  }

  private scheduleBurst(): void {
    if (!this._isGlitching) return

    const resolved = resolveGlitchColors(this.options.colors)
    const s = this.element.style
    s.setProperty('--gyut-color-1', resolved.color1)
    s.setProperty('--gyut-color-2', resolved.color2)

    if (resolved.textShadow) {
      s.setProperty('--gyut-shadow', resolved.textShadow)
    } else {
      s.removeProperty('--gyut-shadow')
    }

    this.element.classList.add('gyut--active')

    const cfg = this.getPresetConfig()
    const burstDuration = Math.round(cfg.baseBurst / this.options.speed)

    // In-Glitch Morphing: swap text inside active burst before it resolves
    if (this.options.afterGlitch?.type === 'replace') {
      const morphLeadTime = Math.min(90, Math.round(burstDuration * 0.4))
      const swapDelay = Math.max(10, burstDuration - morphLeadTime)

      this.transTimer = setTimeout(() => {
        if (!this._isGlitching) return
        const after = this.options.afterGlitch as GlitchAfterReplace
        this.element.innerHTML = `<span class="gyut-base">${after.text}</span>`
        this.element.setAttribute('data-gyut-text', after.text)
      }, swapDelay)
    }

    this.burstTimer = setTimeout(() => {
      this.element.classList.remove('gyut--active')

      if (this.options.afterGlitch) {
        this._isGlitching = false
        if (this.options.afterGlitch.type === 'hide') {
          this.executeAfterGlitch()
        }
        return
      }

      if (
        !this._isGlitching ||
        this.options.trigger === 'manual' ||
        this.options.trigger === 'once'
      ) {
        this._isGlitching = false
        return
      }

      const idleInterval = Math.round(
        (cfg.minIdle + Math.random() * cfg.maxIdleVariance) / this.options.speed
      )
      this.idleTimer = setTimeout(() => {
        this.scheduleBurst()
      }, idleInterval)
    }, burstDuration)
  }

  private executeAfterGlitch(): void {
    const after = this.options.afterGlitch
    if (!after) return

    if (after.type === 'hide') {
      this.element.classList.add(
        after.mode === 'visibility' ? 'gyut--visibility-hidden' : 'gyut--hidden'
      )
      return
    }

    if (after.type === 'replace') {
      this.element.innerHTML = `<span class="gyut-base">${after.text}</span>`
      this.element.setAttribute('data-gyut-text', after.text)
    }
  }

  private clearTimers(): void {
    clearTimeout(this.delayTimer)
    clearTimeout(this.burstTimer)
    clearTimeout(this.idleTimer)
    clearTimeout(this.transTimer)
    this.delayTimer =
      this.burstTimer =
      this.idleTimer =
      this.transTimer =
        undefined
  }
}

export function createGlitch(
  target: HTMLElement | string,
  options?: GlitchOptions
): GlitchInstance {
  return new GlitchController(target, options)
}
