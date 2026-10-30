import type {
  GlitchAfter,
  GlitchInstance,
  GlitchOptions,
  GlitchShape,
  GlitchTrigger,
} from './types.js'
import { resolveGlitchColors } from './colors.js'
import { styleRegistry } from './style-registry.js'

const activeInstances = new WeakMap<HTMLElement, GlitchInstance>()

interface OriginalElementState {
  text: string
  style: string | null
  classList: string[]
  ariaLabel: string | null
}

interface NormalizedGlitchOptions {
  intensity: number
  speed: number
  trigger: GlitchTrigger
  shape: GlitchShape
  respectReducedMotion: boolean
  colors?: string[] | undefined
  afterGlitch?: GlitchAfter | undefined
}

export class GlitchController implements GlitchInstance {
  private element: HTMLElement
  private options: NormalizedGlitchOptions
  private originalState: OriginalElementState
  private _isGlitching = false
  private burstTimeoutId: ReturnType<typeof setTimeout> | null = null
  private idleTimeoutId: ReturnType<typeof setTimeout> | null = null
  private transitionTimeoutId: ReturnType<typeof setTimeout> | null = null
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

    // Validate and normalize options
    const intensity = Math.min(Math.max(options.intensity ?? 0.5, 0.1), 1.0)
    const speed = Math.max(options.speed ?? 1, 0.1)
    const trigger: GlitchTrigger = options.trigger ?? 'always'
    const shape: GlitchShape = options.shape ?? 'classic'
    const respectReducedMotion = options.respectReducedMotion ?? true

    this.options = {
      intensity,
      speed,
      trigger,
      shape,
      respectReducedMotion,
      colors: options.colors,
      afterGlitch: options.afterGlitch,
    }

    // Store original state for pristine restoration upon destroy()
    this.originalState = {
      text: this.element.textContent ?? '',
      style: this.element.getAttribute('style'),
      classList: Array.from(this.element.classList),
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

    // Auto-start if trigger is 'always'
    if (this.options.trigger === 'always') {
      this.start()
    } else if (this.options.trigger === 'hover') {
      this.setupHoverTrigger()
    }
  }

  get isGlitching(): boolean {
    return this._isGlitching
  }

  private initElement(): void {
    styleRegistry.retain()

    this.element.classList.add('gyut-target')
    this.element.classList.add(`gyut-shape-${this.options.shape}`)
    this.element.setAttribute('data-gyut-text', this.originalState.text)

    // Apply baseline CSS variables
    this.element.style.setProperty(
      '--gyut-intensity',
      String(this.options.intensity)
    )
    this.element.style.setProperty(
      '--gyut-anim-duration',
      `${(0.2 / this.options.speed).toFixed(3)}s`
    )
  }

  private setupHoverTrigger(): void {
    const { signal } = this.abortController
    this.element.addEventListener('mouseenter', () => this.start(), { signal })
    this.element.addEventListener('mouseleave', () => this.stop(), { signal })
  }

  start(): void {
    if (this._isGlitching) return

    if (this.reducedMotion) {
      // If motion is reduced and afterGlitch is requested, execute immediate fallback
      if (this.options.afterGlitch) {
        this.executeAfterGlitch()
      }
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

    // Reset post-glitch modifications
    this.element.classList.remove(
      'gyut--hidden',
      'gyut--visibility-hidden',
      'gyut--replacing'
    )
    this.element.textContent = this.originalState.text
    this.element.setAttribute('data-gyut-text', this.originalState.text)

    this.start()
  }

  destroy(): void {
    this.stop()
    this.clearTimers()
    this.abortController.abort()

    // Restore original text
    this.element.textContent = this.originalState.text

    // Remove added attributes & classes
    this.element.removeAttribute('data-gyut-text')
    this.element.classList.remove(
      'gyut-target',
      'gyut--active',
      'gyut--hidden',
      'gyut--visibility-hidden',
      'gyut--replacing',
      `gyut-shape-${this.options.shape}`
    )

    // Restore inline styles
    if (this.originalState.style !== null) {
      this.element.setAttribute('style', this.originalState.style)
    } else {
      this.element.removeAttribute('style')
    }

    // Restore aria-label if present
    if (this.originalState.ariaLabel !== null) {
      this.element.setAttribute('aria-label', this.originalState.ariaLabel)
    } else {
      this.element.removeAttribute('aria-label')
    }

    // Release singleton style tag
    styleRegistry.release()
    activeInstances.delete(this.element)
  }

  private scheduleBurst(): void {
    if (!this._isGlitching) return

    // Apply color choices at burst onset
    const resolved = resolveGlitchColors(this.options.colors)
    this.element.style.setProperty('--gyut-color-1', resolved.color1)
    this.element.style.setProperty('--gyut-color-2', resolved.color2)

    if (resolved.textShadow) {
      this.element.style.setProperty('--gyut-shadow', resolved.textShadow)
    } else {
      this.element.style.removeProperty('--gyut-shadow')
    }

    // Activate visual glitch
    this.element.classList.add('gyut--active')

    // Burst lasts between 180ms to 320ms, scaled by speed
    const burstDuration = Math.round(220 / this.options.speed)

    this.burstTimeoutId = setTimeout(() => {
      this.element.classList.remove('gyut--active')

      if (this.options.afterGlitch) {
        this._isGlitching = false
        this.executeAfterGlitch()
        return
      }

      if (!this._isGlitching || this.options.trigger === 'manual') return

      // Idle pause before next burst: 800ms - 2200ms scaled by speed
      const idleInterval = Math.round(
        (900 + Math.random() * 1200) / this.options.speed
      )
      this.idleTimeoutId = setTimeout(() => {
        this.scheduleBurst()
      }, idleInterval)
    }, burstDuration)
  }

  private executeAfterGlitch(): void {
    const after = this.options.afterGlitch
    if (!after) return

    if (after.type === 'hide') {
      if (after.mode === 'visibility') {
        this.element.classList.add('gyut--visibility-hidden')
      } else {
        this.element.classList.add('gyut--hidden')
      }
      return
    }

    if (after.type === 'replace') {
      this.element.classList.add('gyut--replacing')
      this.transitionTimeoutId = setTimeout(() => {
        this.element.textContent = after.text
        this.element.setAttribute('data-gyut-text', after.text)
        this.element.classList.remove('gyut--replacing')
      }, 120)
    }
  }

  private clearTimers(): void {
    if (this.burstTimeoutId !== null) {
      clearTimeout(this.burstTimeoutId)
      this.burstTimeoutId = null
    }
    if (this.idleTimeoutId !== null) {
      clearTimeout(this.idleTimeoutId)
      this.idleTimeoutId = null
    }
    if (this.transitionTimeoutId !== null) {
      clearTimeout(this.transitionTimeoutId)
      this.transitionTimeoutId = null
    }
  }
}

export function createGlitch(
  target: HTMLElement | string,
  options?: GlitchOptions
): GlitchInstance {
  return new GlitchController(target, options)
}
