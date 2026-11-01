# gyuttt

[![NPM version](https://img.shields.io/npm/v/gyuttt?color=black)](https://www.npmjs.com/package/gyuttt)

Glitch your text. It's small, zero dependency, and framework agnostic.

## Install

```sh
pnpm add gyuttt
```

```sh
npm install gyuttt
```

```sh
yarn add gyuttt
```

```sh
bun add gyuttt
```

## Usage

### Vanilla JavaScript / TypeScript

Pass a CSS selector string or a direct `HTMLElement`:

```ts
import { createGlitch } from 'gyuttt'

const glitch = createGlitch('#heading', {
  intensity: 0.6,
  shape: 'classic',
})

// Optional cleanup
// glitch.destroy()
```

---

### React

Use a `ref` and clean up on unmount:

```tsx
import { useEffect, useRef } from 'react'
import { createGlitch } from 'gyuttt'

export function GlitchHeading() {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!headingRef.current) return

    const glitch = createGlitch(headingRef.current, {
      shape: 'slice',
      colors: ['#FF5FCF', '#00F0FF', '#FFFFFF'],
    })

    return () => glitch.destroy()
  }, [])

  return <h1 ref={headingRef}>CYBERNETIC SYSTEM</h1>
}
```

---

### Vue 3

Use a template ref and clean up in `onUnmounted`:

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { createGlitch, type GlitchInstance } from 'gyuttt'

const headingRef = ref<HTMLHeadingElement | null>(null)
let glitch: GlitchInstance | undefined

onMounted(() => {
  if (headingRef.value) {
    glitch = createGlitch(headingRef.value, {
      shape: 'block',
      intensity: 0.7,
    })
  }
})

onUnmounted(() => {
  glitch?.destroy()
})
</script>

<template>
  <h1 ref="headingRef">CYBERNETIC SYSTEM</h1>
</template>
```

---

### Svelte

Bind the element and clean up in `onMount`:

```svelte
<script>
  import { onMount } from 'svelte'
  import { createGlitch } from 'gyuttt'

  let headingEl

  onMount(() => {
    const glitch = createGlitch(headingEl, {
      trigger: 'hover',
    })

    return () => glitch.destroy()
  })
</script>

<h1 bind:this={headingEl}>Hover to Glitch</h1>
```

---

### Full Feature Composition

All options are completely modular and can be mixed together freely. For example, a single-shot entrance burst on page load with custom colors, intense slice distortion, and smooth text replacement:

```ts
import { createGlitch } from 'gyuttt'

const glitch = createGlitch('#hero-title', {
  trigger: 'once', // Runs 1 burst on load/refresh, then stops
  shape: 'slice', // Razor-thin horizontal ribbons
  preset: 'smooth', // Fluid analog wave distortion
  intensity: 0.8, // Strong visual tearing
  speed: 1.2, // Snappy animation cadence
  colors: ['#FF5FCF', '#00F0FF', '#FFFFFF'], // Custom multi-layer palette
  afterGlitch: {
    type: 'replace',
    text: 'WELCOME TO GYUT', // Final text displayed after glitch
  },
})
```

### Motion Presets

GYUTTT provides 4 distinct motion presets to control easing and timing feel, which can be accelerated or decelerated with `speed`:

- **`'default'`**: Crisp, stepped digital jitter with rhythmic bursts.
- **`'smooth'`**: Fluid, analog wave distortion using cubic-bezier curves (no harsh stepped cuts).
- **`'lag'`**: Stuttering, low-framerate drop-frame glitch (simulating GPU lag or signal drops).
- **`'long'`**: Sustained glitch burst lasting ~2200ms before returning to idle.

```ts
// Smooth analog distortion
createGlitch('#analog-text', {
  preset: 'smooth',
  speed: 1.5,
})

// Frame-drop stutter lag
createGlitch('#lag-text', {
  preset: 'lag',
})

// Sustained long glitch
createGlitch('#alert-text', {
  preset: 'long',
})
```

---

### Custom Colors & Chromatic Stacking

By default, GYUTTT automatically selects high-contrast neon pairs from curated palettes (Cyberpunk, Matrix, Synthwave, Tokyo Arcade, High Voltage) on each burst, ensuring vibrant, visually coherent digital glitches without muddy tones or uncontrolled strobe flickering.

You can supply any number of custom colors (`hex`, `rgb`, or `hsl`). GYUTTT maps colors efficiently with **zero runtime DOM overhead**:
- **1 color**: Paired with a transparent fallback for single-channel distortion.
- **2 colors**: Mapped directly to hardware-accelerated CSS pseudo-elements (`::before` and `::after`).
- **3+ colors**: The first two colors drive the primary pseudo-elements, while additional colors are stacked as multi-layer chromatic `text-shadow` layers.

> **Tip:** We recommend **2 to 5 colors** for optimal aesthetic glitch contrast and legibility.

```ts
// 2-color classic duotone split
createGlitch('#duotone', {
  colors: ['#00F0FF', '#FF0055'],
})

// Multi-color chromatic stack (3+ colors)
createGlitch('#hyper-palette', {
  colors: ['#FF5FCF', '#00F0FF', '#FFE600', '#7928CA'],
})
```

---

### Speed & Timing Customization

The `speed` multiplier dynamically scales animation duration, burst cadence, and jitter frequency:
- **Supported Range:** `0.1` to `5.0` (Default: `1`).
- `speed: 0.2` – `0.5`: Dramatic, cinematic slow-motion effect highlighting individual slice/block offsets.
- `speed: 1.0`: Balanced standard speed.
- `speed: 2.0` – `5.0`: Snappy, hyper-speed digital jitter for high-energy futuristic interfaces.

```ts
// Cinematic slow-motion glitch
createGlitch('#slow-mo', {
  speed: 0.3,
  preset: 'smooth',
})

// Hyper-frequency rapid glitch
createGlitch('#hyper-speed', {
  speed: 3.0,
})
```

## API

### `createGlitch(target, options?)`

- **`target`**: `HTMLElement | string` — DOM element or CSS selector (e.g. `'#title'`).
- **`options`**: Optional configuration object:

| Option                 | Type                                                                                      | Default           | Description                                                                                                                                                                                            |
| :--------------------- | :---------------------------------------------------------------------------------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colors`               | `string[]`                                                                                | _Curated pairs_   | Array of color strings (`hex`, `rgb`, `hsl`). 1–2 colors use CSS pseudo-elements; 3+ colors use chromatic `text-shadow` stacking (2–5 recommended). If omitted, picks random curated high-contrast pairs per burst. [See details](#custom-colors--chromatic-stacking). |
| `intensity`            | `number`                                                                                  | `0.5`             | Glitch displacement and jitter magnitude (`0.1` subtle to `1.0` intense).                                                                                                                              |
| `speed`                | `number`                                                                                  | `1`               | Speed multiplier (`0.1` to `5.0`). Scales animation duration and jitter frequency. [See details](#speed--timing-customization).                                                                         |
| `shape`                | `'classic' \| 'slice' \| 'block'`                                                         | `'classic'`       | Visual glitch preset (`classic`: RGB shift, `slice`: razor-thin ribbons, `block`: 2D pixel tiles).                                                                                                     |
| `preset`               | `'default' \| 'smooth' \| 'lag' \| 'long'`                                                | `'default'`       | Motion and cadence preset (`default`: stepped digital, `smooth`: analog wave, `lag`: drop-frame stutter, `long`: sustained burst).                                                                     |
| `trigger`              | `'always' \| 'once' \| 'hover' \| 'manual'`                                               | `'always'`        | When to glitch (`always`: continuous intervals, `once`: single burst on load/init, `hover`: on pointer hover, `manual`: via methods).                                                                  |
| `afterGlitch`          | `{ type: 'hide', mode?: 'opacity' \| 'visibility' } \| { type: 'replace', text: string }` | `undefined`       | Action after glitch completes: hide element or replace text.                                                                                                                                           |
| `respectReducedMotion` | `boolean`                                                                                 | `true`            | Automatically disables animations when OS `prefers-reduced-motion` is enabled.                                                                                                                         |

### Return Value: `GlitchInstance`

`createGlitch` returns a controller instance with full lifecycle methods:

- **`start()`**: Starts or resumes the glitch animation.
- **`stop()`**: Pauses the glitch animation immediately.
- **`replay()`**: Restarts the animation from its initial state (especially useful to re-trigger after hide/replace).
- **`destroy()`**: Fully cleans up: removes listeners, timers, injected styles (when no other instances exist), and restores the original element state.
- **`isGlitching`**: Readonly boolean indicating whether a glitch burst is currently active.

## License

[MIT](./LICENSE)
