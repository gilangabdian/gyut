const STYLE_ID = 'gyut-injected-styles'

/**
 * Shared stylesheet content containing static keyframes, base target rules,
 * and shape definitions driven by CSS custom properties.
 * Highly optimized and minified for sub-2kB bundle efficiency.
 */
const GYUT_CSS =
  '.gyut-target{position:relative;display:inline-block;--gyut-int:calc(var(--gyut-intensity,1)*1px)}' +
  '.gyut-target .gyut-base{display:inline-block;position:relative}' +
  '.gyut-target::before,.gyut-target::after{content:attr(data-gyut-text);position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:none}' +
  '.gyut-target.gyut--active .gyut-base{animation:gyut-base var(--gyut-anim-duration,.2s) infinite var(--gyut-timing,steps(3,jump-none))}' +
  '.gyut-target.gyut--active::before{display:block;color:var(--gyut-color-1,#00ffff)}' +
  '.gyut-target.gyut--active::after{display:block;color:var(--gyut-color-2,#ff007f);text-shadow:var(--gyut-shadow,none)}' +
  '.gyut-shape-classic.gyut--active::before{animation:gyut-c1 var(--gyut-anim-duration,.2s) infinite var(--gyut-timing,steps(3,jump-none))}' +
  '.gyut-shape-classic.gyut--active::after{animation:gyut-c2 var(--gyut-anim-duration,.2s) infinite var(--gyut-timing,steps(3,jump-none))}' +
  '.gyut-shape-slice.gyut--active::before{animation:gyut-s1 var(--gyut-anim-duration,.16s) infinite var(--gyut-timing,steps(4,jump-none))}' +
  '.gyut-shape-slice.gyut--active::after{animation:gyut-s2 var(--gyut-anim-duration,.16s) infinite var(--gyut-timing,steps(4,jump-none))}' +
  '.gyut-shape-block.gyut--active::before{animation:gyut-b1 var(--gyut-anim-duration,.24s) infinite var(--gyut-timing,steps(3,jump-none))}' +
  '.gyut-shape-block.gyut--active::after{animation:gyut-b2 var(--gyut-anim-duration,.24s) infinite var(--gyut-timing,steps(3,jump-none))}' +
  '.gyut-target.gyut--hidden{opacity:0!important;pointer-events:none!important}' +
  '.gyut-target.gyut--visibility-hidden{visibility:hidden!important;pointer-events:none!important}' +
  '.gyut-target.gyut--replacing{opacity:0;transform:scale(.98);transition:opacity .12s ease,transform .12s ease}' +
  '@keyframes gyut-base{0%{clip-path:inset(0 0 54% 0);transform:translate(calc(var(--gyut-int)*-6),calc(var(--gyut-int)*1)) skewX(calc(var(--gyut-intensity,1)*-3deg));opacity:.88}33%{clip-path:inset(58% 0 0 0);transform:translate(calc(var(--gyut-int)*7),calc(var(--gyut-int)*-1)) skewX(calc(var(--gyut-intensity,1)*4deg));opacity:.95}66%{clip-path:inset(26% 0 34% 0);transform:translate(calc(var(--gyut-int)*-7),calc(var(--gyut-int)*2)) skewX(calc(var(--gyut-intensity,1)*-2deg));opacity:.84}to{clip-path:none;transform:none;opacity:1}}' +
  '@keyframes gyut-c1{0%{clip-path:inset(14% 0 54%);transform:translate(calc(var(--gyut-int)*-10))}33%{clip-path:inset(48% 0 22%);transform:translate(calc(var(--gyut-int)*8),calc(var(--gyut-int)*-2))}66%{clip-path:inset(2% 0 76%);transform:translate(calc(var(--gyut-int)*-12),calc(var(--gyut-int)*1))}to{clip-path:inset(26% 0 42%);transform:translate(calc(var(--gyut-int)*-6))}}' +
  '@keyframes gyut-c2{0%{clip-path:inset(56% 0 14%);transform:translate(calc(var(--gyut-int)*10))}33%{clip-path:inset(18% 0 56%);transform:translate(calc(var(--gyut-int)*-8),calc(var(--gyut-int)*2))}66%{clip-path:inset(72% 0 6%);transform:translate(calc(var(--gyut-int)*12),calc(var(--gyut-int)*-1))}to{clip-path:inset(34% 0 38%);transform:translate(calc(var(--gyut-int)*6))}}' +
  '@keyframes gyut-s1{0%{clip-path:inset(8% 0 88%);transform:translate(calc(var(--gyut-int)*-22))}33%{clip-path:inset(42% 0 54%);transform:translate(calc(var(--gyut-int)*18))}66%{clip-path:inset(78% 0 18%);transform:translate(calc(var(--gyut-int)*-24))}to{clip-path:inset(22% 0 74%);transform:translate(calc(var(--gyut-int)*14))}}' +
  '@keyframes gyut-s2{0%{clip-path:inset(28% 0 68%);transform:translate(calc(var(--gyut-int)*22))}33%{clip-path:inset(62% 0 34%);transform:translate(calc(var(--gyut-int)*-18))}66%{clip-path:inset(88% 0 8%);transform:translate(calc(var(--gyut-int)*24))}to{clip-path:inset(12% 0 84%);transform:translate(calc(var(--gyut-int)*-16))}}' +
  '@keyframes gyut-b1{0%{clip-path:polygon(0 0,46% 0,46% 52%,0 52%);transform:translate(calc(var(--gyut-int)*-14),calc(var(--gyut-int)*8))}33%{clip-path:polygon(52% 48%,100% 48%,100% 100%,52% 100%);transform:translate(calc(var(--gyut-int)*12),calc(var(--gyut-int)*-8))}66%{clip-path:polygon(15% 20%,75% 20%,75% 65%,15% 65%);transform:translate(calc(var(--gyut-int)*-10),calc(var(--gyut-int)*-10))}to{clip-path:polygon(0 45%,45% 45%,45% 95%,0 95%);transform:translate(calc(var(--gyut-int)*8),calc(var(--gyut-int)*6))}}' +
  '@keyframes gyut-b2{0%{clip-path:polygon(48% 0,100% 0,100% 52%,48% 52%);transform:translate(calc(var(--gyut-int)*14),calc(var(--gyut-int)*-8))}33%{clip-path:polygon(0 48%,48% 48%,48% 100%,0 100%);transform:translate(calc(var(--gyut-int)*-12),calc(var(--gyut-int)*10))}66%{clip-path:polygon(30% 10%,90% 10%,90% 55%,30% 55%);transform:translate(calc(var(--gyut-int)*10),calc(var(--gyut-int)*8))}to{clip-path:polygon(55% 45%,100% 45%,100% 95%,55% 95%);transform:translate(calc(var(--gyut-int)*-8),calc(var(--gyut-int)*-6))}}'

let refCount = 0
let styleEl: HTMLStyleElement | null = null

export const styleRegistry = {
  getReferencesCount: (): number => refCount,
  retain(): void {
    if (typeof document === 'undefined') return
    if (refCount === 0) {
      let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
      if (!el) {
        el = document.createElement('style')
        el.id = STYLE_ID
        el.setAttribute('data-gyut-styles', 'true')
        el.textContent = GYUT_CSS
        document.head.appendChild(el)
      }
      styleEl = el
    }
    refCount++
  },
  release(): void {
    if (typeof document === 'undefined') return
    refCount = Math.max(0, refCount - 1)
    if (refCount === 0 && styleEl) {
      styleEl.remove()
      styleEl = null
    }
  },
}
