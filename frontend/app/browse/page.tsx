'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import SectionCard from '@/components/SectionCard'
import { getAllSections, getCategories, LawSection } from '@/lib/api'
import { BookOpen, Filter, ChevronDown } from 'lucide-react'

const CATEGORY_ICONS: Record<string, string> = {
  'Offences Against Person': '🩸',
  'Property Offences': '🏠',
  'Document & Property Fraud': '📄',
  'False Evidence & Public Justice': '⚖️',
  'Public Order – Unlawful Assembly': '👥',
  'Criminal Intimidation & Insult': '😤',
  'Defamation': '📢',
  'Religious Offences': '🕌',
  'Marriage & Family Offences': '👨‍👩‍👧',
  'Abetment': '🤝',
  'General Exceptions': '🛡️',
  'Punishments': '⛓️',
  'Public Servants': '👮',
  'Public Health, Safety & Morals': '🏥',
  'Offences Against the State': '🏛️',
  'General Provisions': '📜',
  'General Explanations': '📖',
  'Currency & Stamp Offences': '💰',
  'Military Offences': '⚔️',
  'Weights & Measures Offences': '⚖️',
  'Criminal Attempts': '🎯',
  'Contempt of Public Authority': '🚫',
  'Criminal Breach of Contract': '📝',
}

function BrowseContent() {
  const searchParams = useSearchParams()
  const catParam = searchParams.get('cat')

  const [sections, setSections] = useState<LawSection[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [selectedCat, setSelectedCat] = useState<string>(catParam || 'All')
  const [loading, setLoading] = useState(true)
  const [showCatDropdown, setShowCatDropdown] = useState(false)

  useEffect(() => {
    Promise.all([getAllSections(), getCategories()]).then(([sec, cat]) => {
      setSections(sec.sections)
      setCategories([{ name: 'All', count: sec.total }, ...cat.categories])
      setLoading(false)
    })
  }, [])

  const filtered = selectedCat === 'All'
    ? sections
    : sections.filter(s => s.category === selectedCat)

  return (
    <div style={{ minHeight: '100vh', background: '#fdf9ed' }}>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={22} style={{ color: '#b8860b' }} />
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#102a43' }}>
                Browse PPC Laws
              </h1>
            </div>
            <p className="text-sm" style={{ color: '#627d98' }}>
              Showing {filtered.length} of 478 sections
            </p>
          </div>

          {/* Category filter */}
          <div className="relative">
            <button
              onClick={() => setShowCatDropdown(!showCatDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                background: '#fff',
                border: '1.5px solid #b8860b',
                color: '#7a5508',
                fontFamily: 'Georgia, serif',
              }}>
              <Filter size={14} />
              {selectedCat === 'All' ? 'All Categories' : selectedCat.slice(0, 18) + (selectedCat.length > 18 ? '...' : '')}
              <ChevronDown size={13} />
            </button>

            {showCatDropdown && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-xl overflow-y-auto"
                style={{
                  background: '#fff',
                  border: '1.5px solid #d9e2ec',
                  boxShadow: '0 8px 32px rgba(16,42,67,0.15)',
                  maxHeight: '360px',
                }}>
                {categories.map(({ name, count }) => (
                  <button
                    key={name}
                    onClick={() => { setSelectedCat(name); setShowCatDropdown(false) }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-all hover:opacity-80"
                    style={{
                      background: selectedCat === name ? '#fdf9ed' : 'transparent',
                      color: selectedCat === name ? '#7a5508' : '#334e68',
                      borderBottom: '1px solid #f0f4f8',
                      fontFamily: 'Georgia, serif',
                    }}>
                    <span>{CATEGORY_ICONS[name] || '📋'} {name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded"
                      style={{ background: '#f0f4f8', color: '#627d98' }}>{count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Offences Against Person', 'Property Offences', 'Document & Property Fraud',
            'False Evidence & Public Justice', 'Punishments', 'General Exceptions'].map(cat => (
            <button key={cat}
              onClick={() => setSelectedCat(cat)}
              className="px-3 py-1 rounded-full text-xs transition-all"
              style={{
                background: selectedCat === cat ? '#b8860b' : '#fff',
                color: selectedCat === cat ? '#fff' : '#486581',
                border: `1px solid ${selectedCat === cat ? '#b8860b' : '#d9e2ec'}`,
              }}>
              {CATEGORY_ICONS[cat] || ''} {cat}
            </button>
          ))}
        </div>

        {/* Sections list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 rounded-xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(sec => (
              <SectionCard key={sec.section} section={sec} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#627d98' }}>Loading...</div>}>
      <BrowseContent />
    </Suspense>
  )
}
