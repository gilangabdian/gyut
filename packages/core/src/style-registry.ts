const STYLE_ID = 'gyut-injected-styles';

/**
 * Shared stylesheet content containing static keyframes, base target rules,
 * and shape definitions driven by CSS custom properties.
 */
const GYUT_CSS = `
.gyut-target {
  position: relative;
  display: inline-block;
}

.gyut-target::before,
.gyut-target::after {
  content: attr(data-gyut-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: none;
}

.gyut-target.gyut--active::before,
.gyut-target.gyut--active::after {
  display: block;
}

/* Classic Shape: Chromatic RGB shift with moderate horizontal displacement */
.gyut-shape-classic.gyut--active::before {
  color: var(--gyut-color-1, #00ffff);
  animation: gyut-anim-classic-1 var(--gyut-anim-duration, 0.2s) infinite steps(3, jump-none);
}

.gyut-shape-classic.gyut--active::after {
  color: var(--gyut-color-2, #ff007f);
  text-shadow: var(--gyut-shadow, none);
  animation: gyut-anim-classic-2 var(--gyut-anim-duration, 0.2s) infinite steps(3, jump-none);
}

/* Slice Shape: Razor-thin ribbons with extreme lateral tearing */
.gyut-shape-slice.gyut--active::before {
  color: var(--gyut-color-1, #00ffff);
  animation: gyut-anim-slice-1 var(--gyut-anim-duration, 0.16s) infinite steps(4, jump-none);
}

.gyut-shape-slice.gyut--active::after {
  color: var(--gyut-color-2, #ff007f);
  text-shadow: var(--gyut-shadow, none);
  animation: gyut-anim-slice-2 var(--gyut-anim-duration, 0.16s) infinite steps(4, jump-none);
}

/* Block Shape: Chunky polygonal pixel/LEGO tiles with 2D diagonal stepping */
.gyut-shape-block.gyut--active::before {
  color: var(--gyut-color-1, #00ff66);
  animation: gyut-anim-block-1 var(--gyut-anim-duration, 0.24s) infinite steps(3, jump-none);
}

.gyut-shape-block.gyut--active::after {
  color: var(--gyut-color-2, #ffe600);
  text-shadow: var(--gyut-shadow, none);
  animation: gyut-anim-block-2 var(--gyut-anim-duration, 0.24s) infinite steps(3, jump-none);
}

/* Post-Glitch states */
.gyut-target.gyut--hidden {
  opacity: 0 !important;
  pointer-events: none !important;
  transition: opacity 0.3s ease;
}

.gyut-target.gyut--visibility-hidden {
  visibility: hidden !important;
  pointer-events: none !important;
}

.gyut-target.gyut--replacing {
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 0.12s ease, transform 0.12s ease;
}

/* Keyframes: High-contrast distinct shapes scaling with --gyut-intensity */
@keyframes gyut-anim-classic-1 {
  0% {
    clip-path: inset(14% 0 54% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -10px), 0);
  }
  33% {
    clip-path: inset(48% 0 22% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 8px), calc(var(--gyut-intensity, 1) * -2px));
  }
  66% {
    clip-path: inset(2% 0 76% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -12px), calc(var(--gyut-intensity, 1) * 1px));
  }
  100% {
    clip-path: inset(26% 0 42% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -6px), 0);
  }
}

@keyframes gyut-anim-classic-2 {
  0% {
    clip-path: inset(56% 0 14% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 10px), 0);
  }
  33% {
    clip-path: inset(18% 0 56% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -8px), calc(var(--gyut-intensity, 1) * 2px));
  }
  66% {
    clip-path: inset(72% 0 6% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 12px), calc(var(--gyut-intensity, 1) * -1px));
  }
  100% {
    clip-path: inset(34% 0 38% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 6px), 0);
  }
}

@keyframes gyut-anim-slice-1 {
  0% {
    clip-path: inset(8% 0 88% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -22px), 0);
  }
  33% {
    clip-path: inset(42% 0 54% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 18px), 0);
  }
  66% {
    clip-path: inset(78% 0 18% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -24px), 0);
  }
  100% {
    clip-path: inset(22% 0 74% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 14px), 0);
  }
}

@keyframes gyut-anim-slice-2 {
  0% {
    clip-path: inset(28% 0 68% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 22px), 0);
  }
  33% {
    clip-path: inset(62% 0 34% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -18px), 0);
  }
  66% {
    clip-path: inset(88% 0 8% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 24px), 0);
  }
  100% {
    clip-path: inset(12% 0 84% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -16px), 0);
  }
}

@keyframes gyut-anim-block-1 {
  0% {
    clip-path: polygon(0% 0%, 46% 0%, 46% 52%, 0% 52%);
    transform: translate(calc(var(--gyut-intensity, 1) * -14px), calc(var(--gyut-intensity, 1) * 8px));
  }
  33% {
    clip-path: polygon(52% 48%, 100% 48%, 100% 100%, 52% 100%);
    transform: translate(calc(var(--gyut-intensity, 1) * 12px), calc(var(--gyut-intensity, 1) * -8px));
  }
  66% {
    clip-path: polygon(15% 20%, 75% 20%, 75% 65%, 15% 65%);
    transform: translate(calc(var(--gyut-intensity, 1) * -10px), calc(var(--gyut-intensity, 1) * -10px));
  }
  100% {
    clip-path: polygon(0% 45%, 45% 45%, 45% 95%, 0% 95%);
    transform: translate(calc(var(--gyut-intensity, 1) * 8px), calc(var(--gyut-intensity, 1) * 6px));
  }
}

@keyframes gyut-anim-block-2 {
  0% {
    clip-path: polygon(48% 0%, 100% 0%, 100% 52%, 48% 52%);
    transform: translate(calc(var(--gyut-intensity, 1) * 14px), calc(var(--gyut-intensity, 1) * -8px));
  }
  33% {
    clip-path: polygon(0% 48%, 48% 48%, 48% 100%, 0% 100%);
    transform: translate(calc(var(--gyut-intensity, 1) * -12px), calc(var(--gyut-intensity, 1) * 10px));
  }
  66% {
    clip-path: polygon(30% 10%, 90% 10%, 90% 55%, 30% 55%);
    transform: translate(calc(var(--gyut-intensity, 1) * 10px), calc(var(--gyut-intensity, 1) * 8px));
  }
  100% {
    clip-path: polygon(55% 45%, 100% 45%, 100% 95%, 55% 95%);
    transform: translate(calc(var(--gyut-intensity, 1) * -8px), calc(var(--gyut-intensity, 1) * -6px));
  }
}
`.trim();

/**
 * Singleton stylesheet registry that tracks reference counts across all active
 * GYUT instances in the current document.
 */
class StyleRegistry {
  private static instance: StyleRegistry | null = null;
  private refCount = 0;
  private styleEl: HTMLStyleElement | null = null;

  static getInstance(): StyleRegistry {
    if (!StyleRegistry.instance) {
      StyleRegistry.instance = new StyleRegistry();
    }
    return StyleRegistry.instance;
  }

  getReferencesCount(): number {
    return this.refCount;
  }

  retain(): void {
    if (typeof document === 'undefined') return;

    if (this.refCount === 0) {
      let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        el.setAttribute('data-gyut-styles', 'true');
        el.textContent = GYUT_CSS;
        document.head.appendChild(el);
      }
      this.styleEl = el;
    }
    this.refCount++;
  }

  release(): void {
    if (typeof document === 'undefined') return;

    this.refCount = Math.max(0, this.refCount - 1);
    if (this.refCount === 0 && this.styleEl) {
      this.styleEl.remove();
      this.styleEl = null;
    }
  }
}

export const styleRegistry = StyleRegistry.getInstance();

