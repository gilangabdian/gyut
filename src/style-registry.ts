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

/* Classic Shape */
.gyut-shape-classic.gyut--active::before {
  color: var(--gyut-color-1, #00ffff);
  animation: gyut-anim-classic-1 var(--gyut-anim-duration, 0.2s) infinite steps(2, jump-none);
  clip-path: inset(var(--gyut-clip-t1, 15%) 0 var(--gyut-clip-b1, 55%) 0);
  transform: translate(var(--gyut-offset-x1, -2px), var(--gyut-offset-y1, 0px));
}

.gyut-shape-classic.gyut--active::after {
  color: var(--gyut-color-2, #ff007f);
  text-shadow: var(--gyut-shadow, none);
  animation: gyut-anim-classic-2 var(--gyut-anim-duration, 0.2s) infinite steps(2, jump-none);
  clip-path: inset(var(--gyut-clip-t2, 60%) 0 var(--gyut-clip-b2, 10%) 0);
  transform: translate(var(--gyut-offset-x2, 2px), var(--gyut-offset-y2, 0px));
}

/* Slice Shape */
.gyut-shape-slice.gyut--active::before {
  color: var(--gyut-color-1, #00ffff);
  animation: gyut-anim-slice-1 var(--gyut-anim-duration, 0.15s) infinite steps(3, jump-none);
  clip-path: inset(var(--gyut-clip-t1, 5%) 0 var(--gyut-clip-b1, 80%) 0);
  transform: translate(var(--gyut-offset-x1, -4px), 0);
}

.gyut-shape-slice.gyut--active::after {
  color: var(--gyut-color-2, #ff007f);
  text-shadow: var(--gyut-shadow, none);
  animation: gyut-anim-slice-2 var(--gyut-anim-duration, 0.15s) infinite steps(3, jump-none);
  clip-path: inset(var(--gyut-clip-t2, 40%) 0 var(--gyut-clip-b2, 45%) 0);
  transform: translate(var(--gyut-offset-x2, 4px), 0);
}

/* Block / LEGO-like Shape */
.gyut-shape-block.gyut--active::before {
  color: var(--gyut-color-1, #00ff66);
  animation: gyut-anim-block-1 var(--gyut-anim-duration, 0.25s) infinite steps(2, start);
  clip-path: polygon(0% 0%, 50% 0%, 50% 50%, 0% 50%);
  transform: translate(var(--gyut-offset-x1, -3px), var(--gyut-offset-y1, 2px));
}

.gyut-shape-block.gyut--active::after {
  color: var(--gyut-color-2, #ffe600);
  text-shadow: var(--gyut-shadow, none);
  animation: gyut-anim-block-2 var(--gyut-anim-duration, 0.25s) infinite steps(2, start);
  clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
  transform: translate(var(--gyut-offset-x2, 3px), var(--gyut-offset-y2, -2px));
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

/* Keyframes */
@keyframes gyut-anim-classic-1 {
  0% {
    clip-path: inset(10% 0 60% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -3px), 0);
  }
  50% {
    clip-path: inset(40% 0 20% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 2px), calc(var(--gyut-intensity, 1) * -1px));
  }
  100% {
    clip-path: inset(25% 0 45% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -2px), calc(var(--gyut-intensity, 1) * 1px));
  }
}

@keyframes gyut-anim-classic-2 {
  0% {
    clip-path: inset(55% 0 15% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 3px), 0);
  }
  50% {
    clip-path: inset(20% 0 50% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -2px), calc(var(--gyut-intensity, 1) * 1px));
  }
  100% {
    clip-path: inset(70% 0 5% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 2px), calc(var(--gyut-intensity, 1) * -1px));
  }
}

@keyframes gyut-anim-slice-1 {
  0% {
    clip-path: inset(0% 0 85% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -5px), 0);
  }
  50% {
    clip-path: inset(45% 0 40% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 4px), 0);
  }
  100% {
    clip-path: inset(75% 0 10% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -3px), 0);
  }
}

@keyframes gyut-anim-slice-2 {
  0% {
    clip-path: inset(30% 0 55% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 4px), 0);
  }
  50% {
    clip-path: inset(60% 0 25% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * -4px), 0);
  }
  100% {
    clip-path: inset(10% 0 75% 0);
    transform: translate(calc(var(--gyut-intensity, 1) * 3px), 0);
  }
}

@keyframes gyut-anim-block-1 {
  0% {
    clip-path: polygon(0% 0%, 60% 0%, 60% 40%, 0% 40%);
    transform: translate(calc(var(--gyut-intensity, 1) * -4px), calc(var(--gyut-intensity, 1) * 2px));
  }
  50% {
    clip-path: polygon(20% 20%, 80% 20%, 80% 60%, 20% 60%);
    transform: translate(calc(var(--gyut-intensity, 1) * 3px), calc(var(--gyut-intensity, 1) * -2px));
  }
  100% {
    clip-path: polygon(0% 40%, 50% 40%, 50% 80%, 0% 80%);
    transform: translate(calc(var(--gyut-intensity, 1) * -2px), 0);
  }
}

@keyframes gyut-anim-block-2 {
  0% {
    clip-path: polygon(40% 40%, 100% 40%, 100% 100%, 40% 100%);
    transform: translate(calc(var(--gyut-intensity, 1) * 4px), calc(var(--gyut-intensity, 1) * -2px));
  }
  50% {
    clip-path: polygon(0% 60%, 70% 60%, 70% 100%, 0% 100%);
    transform: translate(calc(var(--gyut-intensity, 1) * -3px), calc(var(--gyut-intensity, 1) * 2px));
  }
  100% {
    clip-path: polygon(30% 10%, 100% 10%, 100% 50%, 30% 50%);
    transform: translate(calc(var(--gyut-intensity, 1) * 2px), 0);
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

