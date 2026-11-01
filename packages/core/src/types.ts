export type GlitchTrigger = 'always' | 'hover' | 'manual' | 'once'
export type GlitchShape = 'classic' | 'slice' | 'block'
export type GlitchPreset = 'default' | 'smooth' | 'lag' | 'long'

export interface GlitchAfterHide {
  type: 'hide'
  /**
   * Layout disappearance strategy:
   * - 'opacity': text becomes invisible (opacity: 0), preserving layout dimensions.
   * - 'visibility': visibility: hidden (preserves layout, inaccessible to focus).
   * Default: 'opacity'.
   */
  mode?: 'opacity' | 'visibility' | undefined
}

export interface GlitchAfterReplace {
  type: 'replace'
  text: string
}

export type GlitchAfter = GlitchAfterHide | GlitchAfterReplace

export interface GlitchOptions {
  /**
   * Array of color hex/rgb/hsl strings.
   * - If omitted or empty: defaults to random coherent color selection per burst.
   * - If provided: supports 2, 3, or more custom colors.
   */
  colors?: string[] | undefined

  /**
   * Glitch jitter and displacement magnitude (0.1 to 1.0).
   * Default: 0.5
   */
  intensity?: number | undefined

  /**
   * Speed multiplier for glitch cadence and jitter frequency.
   * Default: 1
   */
  speed?: number | undefined

  /**
   * Initial startup delay in milliseconds before the first glitch burst fires.
   * Default: 0
   */
  delay?: number | undefined

  /**
   * Trigger mode for animation.
   * - 'always': continuous bursts at intervals.
   * - 'once': fires single burst on load/init and stops.
   * - 'hover': runs while pointer is hovering over element.
   * - 'manual': only runs when start() or replay() is called.
   * Default: 'always'
   */
  trigger?: GlitchTrigger | undefined

  /**
   * Motion and cadence preset.
   * - 'default': Crisp digital frame jumps (steps easing, ~220ms burst).
   * - 'smooth': Fluid, analog wave distortion (cubic-bezier easing).
   * - 'lag': Low-framerate, stuttering frame drops (steps(1, start)).
   * - 'long': Sustained glitch burst (~2200ms) lingering on screen.
   * Combine with `speed` multiplier to accelerate or decelerate any preset.
   * Default: 'default'
   */
  preset?: GlitchPreset | undefined

  /**
   * Visual preset shape.
   * Default: 'classic'
   */
  shape?: GlitchShape | undefined

  /**
   * Post-glitch transition action (hide or replace).
   * If provided with trigger 'always', it executes after the initial glitch burst.
   */
  afterGlitch?: GlitchAfter | undefined

  /**
   * Whether to respect OS prefers-reduced-motion settings.
   * Default: true
   */
  respectReducedMotion?: boolean | undefined
}

export interface GlitchInstance {
  /** Starts or resumes the glitch animation */
  start(): void

  /** Pauses the glitch animation */
  stop(): void

  /** Restarts glitch from initial state (useful for replay after hide/replace) */
  replay(): void

  /**
   * Fully cleans up: removes listeners, timers, inline styles,
   * data attributes, and restores original element state.
   */
  destroy(): void

  /** Current running status */
  readonly isGlitching: boolean
}
