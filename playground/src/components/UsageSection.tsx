'use client'

import React, { useState } from 'react'

type TabType = 'typescript' | 'react'

export function UsageSection() {
  const [activeTab, setActiveTab] = useState<TabType>('typescript')
  const [copied, setCopied] = useState(false)

  const snippets: Record<TabType, string> = {
    typescript: `import { createGlitch } from 'gyuttt'

// Attach to any CSS selector or HTMLElement
const glitch = createGlitch('#title', {
  preset: 'smooth',
  shape: 'slice',
  intensity: 0.7,
  colors: ['#FF5FCF', '#00F0FF'],
})

// Full lifecycle controls
glitch.start()
glitch.stop()
glitch.destroy()`,

    react: `import { useEffect, useRef } from 'react'
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

  return <h1 ref={headingRef}>CYBERNETIC</h1>
}`,
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippets[activeTab])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  // Lightweight custom syntax highlighter
  const renderHighlightedCode = (code: string) => {
    const lines = code.split('\n')

    return lines.map((line, lineIdx) => {
      const commentIdx = line.indexOf('//')
      let codePart = line
      let commentPart = ''
      if (commentIdx !== -1) {
        codePart = line.slice(0, commentIdx)
        commentPart = line.slice(commentIdx)
      }

      const tokens: React.ReactNode[] = []
      let lastIndex = 0

      // Match strings, tags, keywords, hooks/lifecycle
      const regex =
        /('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|<\/?[a-zA-Z0-9:-]+(?:\s+[^>]*)?>|\b(?:import|export|from|const|let|return|default|type|function)\b|\b(?:createGlitch|useRef|useEffect|ref|destroy|start|stop|GlitchInstance)\b)/g

      let match: RegExpExecArray | null
      while ((match = regex.exec(codePart)) !== null) {
        if (match.index > lastIndex) {
          tokens.push(codePart.slice(lastIndex, match.index))
        }
        const val = match[0]
        const key = `${lineIdx}-${match.index}`

        if (val.startsWith("'") || val.startsWith('"')) {
          tokens.push(
            <span key={key} className="text-[#00F0FF]">
              {val}
            </span>
          )
        } else if (val.startsWith('<')) {
          tokens.push(
            <span key={key} className="text-[#FF71CE]">
              {val}
            </span>
          )
        } else if (
          [
            'createGlitch',
            'useRef',
            'useEffect',
            'ref',
            'destroy',
            'start',
            'stop',
            'GlitchInstance',
          ].includes(val)
        ) {
          tokens.push(
            <span key={key} className="text-[#FFE600]">
              {val}
            </span>
          )
        } else {
          tokens.push(
            <span key={key} className="text-[#FF5FCF] font-semibold">
              {val}
            </span>
          )
        }
        lastIndex = regex.lastIndex
      }

      if (lastIndex < codePart.length) {
        tokens.push(codePart.slice(lastIndex))
      }

      if (commentPart) {
        tokens.push(
          <span key={`${lineIdx}-comment`} className="text-[#6E6E7A] italic">
            {commentPart}
          </span>
        )
      }

      return (
        <div key={lineIdx} className="table-row">
          <span className="table-cell select-none pr-4 text-right text-[11px] font-mono text-[#44444e]">
            {lineIdx + 1}
          </span>
          <span className="table-cell whitespace-pre">
            {tokens.length > 0 ? tokens : ' '}
          </span>
        </div>
      )
    })
  }

  return (
    <section className="w-full max-w-[580px] mx-auto px-4 py-12 flex flex-col items-start">
      <div className="w-full text-left mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEDED] tracking-wide">
          Usage
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm font-mono text-[#737373]">
          You can start using gyuttt by importing{' '}
          <code className="text-[#EDEDED] font-semibold bg-white/5 px-1.5 py-0.5 rounded">
            createGlitch
          </code>{' '}
          and providing two parameters:{' '}
          <code className="text-[#FF5FCF]">target</code> and{' '}
          <code className="text-[#FF5FCF]">options</code>.
        </p>
      </div>

      {/* Terminal Box */}
      <div className="w-full bg-[#0c0c14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#12121e] border-b border-white/10">
          <div className="flex gap-2">
            {(
              [
                { id: 'typescript', label: 'TypeScript' },
                { id: 'react', label: 'React' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#FF5FCF] text-black font-bold shadow-md'
                    : 'text-[#737373] hover:text-[#EDEDED] hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-[#FF5FCF]/20 hover:border-[#FF5FCF]/40 border border-white/10 text-xs font-mono text-[#EDEDED] transition-all flex items-center gap-1.5"
            title="Copy code"
          >
            {copied ? (
              <>
                <svg
                  className="w-3.5 h-3.5 text-[#FF5FCF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-[#FF5FCF] font-bold text-[11px]">
                  Copied!
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 text-[#737373]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[11px] text-[#737373]">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content with Custom Syntax Highlighting */}
        <div className="p-4 sm:p-5 overflow-x-auto bg-[#08080d]">
          <pre className="font-mono text-xs sm:text-sm text-[#EDEDED] leading-relaxed">
            <div className="table w-full">
              {renderHighlightedCode(snippets[activeTab])}
            </div>
          </pre>
        </div>
      </div>

      {/* Footer Note with Link to README */}
      <p className="mt-3 text-xs font-mono text-[#737373] text-left">
        Also compatible with Vue, Svelte, or any modern framework.{' '}
        <a
          href="https://github.com/gilangabdian/gyut#usage"
          target="_blank"
          rel="noreferrer"
          className="text-[#FF5FCF] underline hover:text-[#EDEDED] transition-colors inline-flex items-center gap-0.5"
        >
          <span>Check docs</span>
          <span className="text-[10px]">↗</span>
        </a>{' '}
        for more details.
      </p>
    </section>
  )
}
