const STYLE_ID = 'gyut-injected-styles'

/**
 * Shared stylesheet content containing static keyframes, base target rules,
 * and shape definitions driven by CSS custom properties.
 * Highly optimized and minified for sub-2kB bundle efficiency.
 */
const GYUT_CSS =
  '.gyut-target{position:relative;display:inline-block;--gyut-int:var(--gyut-intensity,1)}' +
  '.gyut-target::before,.gyut-target::after{content:attr(data-gyut-text);position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:none}' +
  '.gyut-target.gyut--active::before{display:block;color:var(--gyut-color-1,#00ffff)}' +
  '.gyut-target.gyut--active::after{display:block;color:var(--gyut-color-2,#ff007f);text-shadow:var(--gyut-shadow,none)}' +
  '.gyut-shape-classic.gyut--active::before{animation:gyut-anim-classic-1 var(--gyut-anim-duration,.2s) infinite steps(3,jump-none)}' +
  '.gyut-shape-classic.gyut--active::after{animation:gyut-anim-classic-2 var(--gyut-anim-duration,.2s) infinite steps(3,jump-none)}' +
  '.gyut-shape-slice.gyut--active::before{animation:gyut-anim-slice-1 var(--gyut-anim-duration,.16s) infinite steps(4,jump-none)}' +
  '.gyut-shape-slice.gyut--active::after{animation:gyut-anim-slice-2 var(--gyut-anim-duration,.16s) infinite steps(4,jump-none)}' +
  '.gyut-shape-block.gyut--active::before{animation:gyut-anim-block-1 var(--gyut-anim-duration,.24s) infinite steps(3,jump-none)}' +
  '.gyut-shape-block.gyut--active::after{animation:gyut-anim-block-2 var(--gyut-anim-duration,.24s) infinite steps(3,jump-none)}' +
  '.gyut-target.gyut--hidden{opacity:0!important;pointer-events:none!important;transition:opacity .3s ease}' +
  '.gyut-target.gyut--visibility-hidden{visibility:hidden!important;pointer-events:none!important}' +
  '.gyut-target.gyut--replacing{opacity:0;transform:scale(.98);transition:opacity .12s ease,transform .12s ease}' +
  '@keyframes gyut-anim-classic-1{0%{clip-path:inset(14% 0 54%);transform:translate(calc(var(--gyut-int)*-10px))}33%{clip-path:inset(48% 0 22%);transform:translate(calc(var(--gyut-int)*8px),calc(var(--gyut-int)*-2px))}66%{clip-path:inset(2% 0 76%);transform:translate(calc(var(--gyut-int)*-12px),calc(var(--gyut-int)*1px))}to{clip-path:inset(26% 0 42%);transform:translate(calc(var(--gyut-int)*-6px))}}' +
  '@keyframes gyut-anim-classic-2{0%{clip-path:inset(56% 0 14%);transform:translate(calc(var(--gyut-int)*10px))}33%{clip-path:inset(18% 0 56%);transform:translate(calc(var(--gyut-int)*-8px),calc(var(--gyut-int)*2px))}66%{clip-path:inset(72% 0 6%);transform:translate(calc(var(--gyut-int)*12px),calc(var(--gyut-int)*-1px))}to{clip-path:inset(34% 0 38%);transform:translate(calc(var(--gyut-int)*6px))}}' +
  '@keyframes gyut-anim-slice-1{0%{clip-path:inset(8% 0 88%);transform:translate(calc(var(--gyut-int)*-22px))}33%{clip-path:inset(42% 0 54%);transform:translate(calc(var(--gyut-int)*18px))}66%{clip-path:inset(78% 0 18%);transform:translate(calc(var(--gyut-int)*-24px))}to{clip-path:inset(22% 0 74%);transform:translate(calc(var(--gyut-int)*14px))}}' +
  '@keyframes gyut-anim-slice-2{0%{clip-path:inset(28% 0 68%);transform:translate(calc(var(--gyut-int)*22px))}33%{clip-path:inset(62% 0 34%);transform:translate(calc(var(--gyut-int)*-18px))}66%{clip-path:inset(88% 0 8%);transform:translate(calc(var(--gyut-int)*24px))}to{clip-path:inset(12% 0 84%);transform:translate(calc(var(--gyut-int)*-16px))}}' +
  '@keyframes gyut-anim-block-1{0%{clip-path:polygon(0 0,46% 0,46% 52%,0 52%);transform:translate(calc(var(--gyut-int)*-14px),calc(var(--gyut-int)*8px))}33%{clip-path:polygon(52% 48%,100% 48%,100% 100%,52% 100%);transform:translate(calc(var(--gyut-int)*12px),calc(var(--gyut-int)*-8px))}66%{clip-path:polygon(15% 20%,75% 20%,75% 65%,15% 65%);transform:translate(calc(var(--gyut-int)*-10px),calc(var(--gyut-int)*-10px))}to{clip-path:polygon(0 45%,45% 45%,45% 95%,0 95%);transform:translate(calc(var(--gyut-int)*8px),calc(var(--gyut-int)*6px))}}' +
  '@keyframes gyut-anim-block-2{0%{clip-path:polygon(48% 0,100% 0,100% 52%,48% 52%);transform:translate(calc(var(--gyut-int)*14px),calc(var(--gyut-int)*-8px))}33%{clip-path:polygon(0 48%,48% 48%,48% 100%,0 100%);transform:translate(calc(var(--gyut-int)*-12px),calc(var(--gyut-int)*10px))}66%{clip-path:polygon(30% 10%,90% 10%,90% 55%,30% 55%);transform:translate(calc(var(--gyut-int)*10px),calc(var(--gyut-int)*8px))}to{clip-path:polygon(55% 45%,100% 45%,100% 95%,55% 95%);transform:translate(calc(var(--gyut-int)*-8px),calc(var(--gyut-int)*-6px))}}'

/**
 * Singleton stylesheet registry that tracks reference counts across all active
 * GYUT instances in the current document.
 */
class StyleRegistry {
  private static instance: StyleRegistry | null = null
  private refCount = 0
  private styleEl: HTMLStyleElement | null = null

  static getInstance(): StyleRegistry {
    if (!StyleRegistry.instance) {
      StyleRegistry.instance = new StyleRegistry()
    }
    return StyleRegistry.instance
  }

  getReferencesCount(): number {
    return this.refCount
  }

  retain(): void {
    if (typeof document === 'undefined') return

    if (this.refCount === 0) {
      let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
      if (!el) {
        el = document.createElement('style')
        el.id = STYLE_ID
        el.setAttribute('data-gyut-styles', 'true')
        el.textContent = GYUT_CSS
        document.head.appendChild(el)
      }
      this.styleEl = el
    }
    this.refCount++
  }

  release(): void {
    if (typeof document === 'undefined') return

    this.refCount = Math.max(0, this.refCount - 1)
    if (this.refCount === 0 && this.styleEl) {
      this.styleEl.remove()
      this.styleEl = null
    }
  }
}

export const styleRegistry = StyleRegistry.getInstance()
