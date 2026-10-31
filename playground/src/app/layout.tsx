import type { Metadata } from 'next'
import { DynaPuff, Space_Mono, Geist } from 'next/font/google'
import './globals.css'

const dynaPuff = DynaPuff({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700'],
})

const spaceMono = Space_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GYUTTT | Glitch Your Text',
  description: 'gyutttt is for glitching your text on the web',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${dynaPuff.variable} ${spaceMono.variable} ${geist.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#000000] text-[#EDEDED] font-sans selection:bg-[#FF5FCF] selection:text-[#000000]">
        {children}
      </body>
    </html>
  )
}
