# GYUT — Glitch Your Text ⚡

An ultra-lightweight, framework-agnostic, zero-runtime-dependency JavaScript/TypeScript library for creating animated digital text glitches.

- 🪶 **Zero runtime dependencies** — No frameworks, no heavyweight animation libraries.
- 🎨 **Default random colors** — Coherent chromatic palettes chosen per burst.
- 🌈 **Custom multi-colors** — Supply 2, 3, or more custom colors without extra DOM elements.
- 🧩 **Customizable glitch shapes** — Includes `classic`, `slice`, and `block` presets.
- 🔄 **Post-glitch transitions** — Smoothly hide or replace text after glitches.
- ♿ **Accessibility first** — Native support for `prefers-reduced-motion`.
- 🧼 **Predictable lifecycle** — Clean `destroy()`, `replay()`, and automatic style deduplication.

---

## Installation

```bash
# npm
npm install gyut

# pnpm
pnpm add gyut

# yarn
yarn add gyut
```

---

## Quickstart

```typescript
import { createGlitch } from 'gyut';

// Target can be an HTMLElement or a CSS selector
const glitch = createGlitch('#heading', {
  intensity: 0.6,
  speed: 1,
});

// Full lifecycle controls
glitch.start();
glitch.stop();
glitch.destroy();
```

---

## Features & Examples

### 1. Default Random Colors
By default, GYUT picks coherent digital accent pairs (e.g. Cyan/Magenta, Matrix Lime/Cyan) at the onset of each glitch burst:

```typescript
const glitch = createGlitch('#title');
```

### 2. Custom Colors (2, 3, or more)
Provide any practical number of hex, rgb, or hsl colors. Additional colors are layered as chromatic aberration text-shadows without adding DOM nodes:

```typescript
const glitch = createGlitch('#title', {
  colors: ['#ff00c1', '#00fff0', '#ffe600', '#7c3aed'],
});
```

### 3. Glitch Shapes
Choose between visual glitch presets:

```typescript
// 'classic' (default horizontal displacement)
createGlitch('#title', { shape: 'classic' });

// 'slice' (high-frequency thin slices)
createGlitch('#title', { shape: 'slice' });

// 'block' (stepped blocky / LEGO-like distortion)
createGlitch('#title', { shape: 'block' });
```

### 4. Hide Text After Glitch
Make text disappear after the animation finishes:

```typescript
const glitch = createGlitch('#alert', {
  trigger: 'manual',
  afterGlitch: {
    type: 'hide',
    mode: 'opacity', // 'opacity' preserves layout, 'visibility' removes focus
  },
});

glitch.start();
```

### 5. Replace Text After Glitch
Seamlessly transition to a new text string after the glitch completes:

```typescript
const glitch = createGlitch('#terminal', {
  trigger: 'manual',
  afterGlitch: {
    type: 'replace',
    text: 'SYSTEM RESTORED',
  },
});

glitch.start();

// Need to run it again?
glitch.replay(); // Restores original text and glitches again
```

### 6. Hover Trigger
Glitch only when user hovers over the element:

```typescript
createGlitch('#cta-button', {
  trigger: 'hover',
});
```

---

## API Reference

### `createGlitch(target, options?)`

#### `target`
- `HTMLElement | string`: The DOM element or selector string to attach the glitch to.

#### `options`
| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `colors` | `string[]` | `undefined` | Custom colors. If omitted, random coherent palette is used. |
| `intensity` | `number` | `0.5` | Glitch displacement magnitude (`0.1` to `1.0`). |
| `speed` | `number` | `1` | Speed multiplier for cadence and jitter. |
| `trigger` | `'always' \| 'hover' \| 'manual'` | `'always'` | Triggering behavior. |
| `shape` | `'classic' \| 'slice' \| 'block'` | `'classic'` | Glitch visual shape preset. |
| `afterGlitch` | `GlitchAfter` | `undefined` | Action to take post-glitch (`hide` or `replace`). |
| `respectReducedMotion`| `boolean` | `true` | Bypasses jitter for users requesting reduced motion. |

#### Lifecycle Methods
- `glitch.start()`: Begins or resumes the glitch effect.
- `glitch.stop()`: Pauses the glitch effect.
- `glitch.replay()`: Restores initial text/visibility and runs the glitch again.
- `glitch.destroy()`: Cleans up listeners, timers, restores original text and inline styles.
- `glitch.isGlitching`: Boolean indicating whether the glitch is currently active.

---

## License

[MIT](./LICENSE)

