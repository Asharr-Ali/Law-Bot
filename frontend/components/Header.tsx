'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scale, BookOpen, Search, Home } from 'lucide-react'

export default function Header() {
  const path = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/analyze', label: 'Analyze Case', icon: Scale },
    { href: '/browse', label: 'Browse Laws', icon: BookOpen },
    { href: '/search', label: 'Search PPC', icon: Search },
  ]

  return (
    <header className="sticky top-0 z-50" style={{
      background: 'linear-gradient(135deg, #102a43 0%, #243b53 100%)',
      borderBottom: '3px solid #b8860b',
      boxShadow: '0 4px 20px rgba(16,42,67,0.4)'
    }}>
      <div className="max-w-6xl mx-auto px-4 py-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #b8860b, #d9a520)' }}>
              <Scale size={20} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}>
                Law<span style={{ color: '#d9a520' }}>Bot</span>
              </span>
              <p className="text-xs text-blue-200 leading-none">Pakistan Penal Code AI</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                style={{
                  color: path === href ? '#fdf9ed' : '#9fb3c8',
                  background: path === href ? 'rgba(184,134,11,0.25)' : 'transparent',
                  border: path === href ? '1px solid rgba(184,134,11,0.4)' : '1px solid transparent',
                  fontFamily: 'Georgia, serif',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile nav indicator */}
          <div className="md:hidden flex gap-3">
            {navItems.map(({ href, icon: Icon }) => (
              <Link key={href} href={href}
                style={{ color: path === href ? '#d9a520' : '#9fb3c8' }}>
                <Icon size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
