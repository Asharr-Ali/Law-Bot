'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SectionCard from '@/components/SectionCard'
import { searchSections, LawSection } from '@/lib/api'
import { Search, Loader, Info } from 'lucide-react'

const SUGGESTIONS = [
  'murder', 'theft', 'kidnapping', 'fraud', 'assault', 'bribery',
  'rape', 'extortion', 'defamation', 'blackmail', 'forgery', 'rioting',
]

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<LawSection[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (query?: string) => {
    const searchQ = (query ?? q).trim()
    if (!searchQ) return

    setLoading(true)
    setSearched(true)
    try {
      const data = await searchSections(searchQ)
      setResults(data.results)
    } catch (e) {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdf9ed' }}>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#102a43' }}>
            Search PPC Laws
          </h1>
          <p className="text-sm" style={{ color: '#627d98' }}>
            Search by keyword across all 478 sections of the Pakistan Penal Code
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search size={18} style={{ color: '#829ab1' }} />
          </div>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search e.g. theft, murder, assault, bribery, extortion..."
            className="w-full pl-11 pr-32 py-4 rounded-xl text-sm outline-none transition-all"
            style={{
              border: '2px solid #bcccdc',
              fontFamily: 'Georgia, serif',
              color: '#243b53',
              background: '#fff',
              fontSize: '0.95rem',
            }}
            onFocus={(e) => e.target.style.borderColor = '#b8860b'}
            onBlur={(e) => e.target.style.borderColor = '#bcccdc'}
          />
          <button
            onClick={() => handleSearch()}
            disabled={!q.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #b8860b, #d9a520)',
              fontFamily: 'Georgia, serif',
            }}>
            {loading ? <Loader size={14} className="animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Suggestions */}
        {!searched && (
          <div>
            <p className="text-xs mb-2" style={{ color: '#829ab1' }}>Quick searches:</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {SUGGESTIONS.map(s => (
                <button key={s}
                  onClick={() => { setQ(s); handleSearch(s) }}
                  className="px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
                  style={{ background: '#fff', border: '1px solid #d9e2ec', color: '#486581' }}>
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: '#fff', border: '1px solid #d9e2ec' }}>
              <Info size={16} style={{ color: '#b8860b', flexShrink: 0, marginTop: 2 }} />
              <div className="text-sm" style={{ color: '#627d98', lineHeight: 1.6 }}>
                <strong style={{ color: '#334e68' }}>Tip:</strong> For AI-powered semantic analysis of your actual case,
                use the <a href="/analyze" style={{ color: '#b8860b', textDecoration: 'underline' }}>Analyze Case</a> page.
                This search page does keyword matching across PPC sections.
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading && (
          <div className="text-center py-12" style={{ color: '#829ab1' }}>
            <Loader size={28} className="animate-spin mx-auto mb-3" style={{ color: '#b8860b' }} />
            <p className="text-sm">Searching PPC...</p>
          </div>
        )}

        {searched && !loading && (
          <div>
            <p className="text-sm mb-4" style={{ color: '#627d98' }}>
              {results.length > 0
                ? `Found ${results.length} section${results.length > 1 ? 's' : ''} matching "${q}"`
                : `No results found for "${q}"`}
            </p>

            {results.length === 0 ? (
              <div className="text-center py-12 rounded-xl"
                style={{ background: '#fff', border: '1.5px solid #d9e2ec' }}>
                <Search size={36} className="mx-auto mb-3" style={{ color: '#bcccdc' }} />
                <p className="font-semibold mb-1" style={{ color: '#334e68', fontFamily: 'Georgia, serif' }}>
                  No sections found
                </p>
                <p className="text-sm" style={{ color: '#829ab1' }}>
                  Try different keywords, or use{' '}
                  <a href="/analyze" style={{ color: '#b8860b' }}>AI Case Analysis</a>{' '}
                  for semantic search.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map(sec => (
                  <SectionCard key={sec.section} section={sec} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
