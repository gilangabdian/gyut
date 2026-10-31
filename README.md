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
  intensity: 0.8, // Strong visual tearing
  speed: 1.2, // Snappy animation cadence
  colors: ['#FF5FCF', '#00F0FF', '#FFFFFF'], // Custom multi-layer palette
  afterGlitch: {
    type: 'replace',
    text: 'WELCOME TO GYUT', // Final text displayed after glitch
  },
})
```

## API

### `createGlitch(target, options?)`

- **`target`**: `HTMLElement | string` — DOM element or CSS selector (e.g. `'#title'`).
- **`options`**: Optional configuration object:

| Option                 | Type                                                                                      | Default           | Description                                                                                                                           |
| :--------------------- | :---------------------------------------------------------------------------------------- | :---------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `colors`               | `string[]`                                                                                | _Random palettes_ | Array of hex/rgb/hsl color strings. If omitted, picks vibrant random contrast pairs per burst.                                        |
| `intensity`            | `number`                                                                                  | `0.5`             | Glitch displacement and jitter magnitude (`0.1` subtle to `1.0` intense).                                                             |
| `speed`                | `number`                                                                                  | `1`               | Speed multiplier for burst cadence and jitter frequency.                                                                              |
| `shape`                | `'classic' \| 'slice' \| 'block'`                                                         | `'classic'`       | Visual glitch preset (`classic`: RGB shift, `slice`: razor-thin ribbons, `block`: 2D pixel tiles).                                    |
| `trigger`              | `'always' \| 'once' \| 'hover' \| 'manual'`                                               | `'always'`        | When to glitch (`always`: continuous intervals, `once`: single burst on load/init, `hover`: on pointer hover, `manual`: via methods). |
| `afterGlitch`          | `{ type: 'hide', mode?: 'opacity' \| 'visibility' } \| { type: 'replace', text: string }` | `undefined`       | Action after glitch completes: hide element or replace text.                                                                          |
| `respectReducedMotion` | `boolean`                                                                                 | `true`            | Automatically disables animations when OS `prefers-reduced-motion` is enabled.                                                        |

### Return Value: `GlitchInstance`

`createGlitch` returns a controller instance with full lifecycle methods:

- **`start()`**: Starts or resumes the glitch animation.
- **`stop()`**: Pauses the glitch animation immediately.
- **`replay()`**: Restarts the animation from its initial state (especially useful to re-trigger after hide/replace).
- **`destroy()`**: Fully cleans up: removes listeners, timers, injected styles (when no other instances exist), and restores the original element state.
- **`isGlitching`**: Readonly boolean indicating whether a glitch burst is currently active.

## License

[MIT](./LICENSE)
