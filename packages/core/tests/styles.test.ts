import { describe, it, expect, beforeEach } from 'vitest'
import { styleRegistry } from '../src/style-registry.js'

describe('styleRegistry', () => {
  beforeEach(() => {
    // Reset any leftover styles
    const el = document.getElementById('gyut-injected-styles')
    if (el) el.remove()
    while (styleRegistry.getReferencesCount() > 0) {
      styleRegistry.release()
    }
  })

  it('injects style tag into document head upon first retain', () => {
    expect(document.getElementById('gyut-injected-styles')).toBeNull()
    styleRegistry.retain()

    const tag = document.getElementById('gyut-injected-styles')
    expect(tag).not.toBeNull()
    expect(tag?.tagName.toLowerCase()).toBe('style')
    expect(tag?.textContent).toContain('.gyut-target')
    expect(tag?.textContent).toContain('gyut-c1')
  })

  it('reuses the same style tag across multiple instances and does not duplicate', () => {
    styleRegistry.retain()
    styleRegistry.retain()
    styleRegistry.retain()

    expect(styleRegistry.getReferencesCount()).toBe(3)
    const allTags = document.querySelectorAll('#gyut-injected-styles')
    expect(allTags).toHaveLength(1)

    styleRegistry.release()
    styleRegistry.release()
    expect(styleRegistry.getReferencesCount()).toBe(1)
    expect(document.getElementById('gyut-injected-styles')).not.toBeNull()

    styleRegistry.release()
    expect(styleRegistry.getReferencesCount()).toBe(0)
    expect(document.getElementById('gyut-injected-styles')).toBeNull()
  })
})
