'use client'

import { LawSection } from '@/lib/api'
import { Shield, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const CATEGORY_COLORS: Record<string, string> = {
  'Offences Against Person': '#dc2626',
  'Property Offences': '#d97706',
  'Document & Property Fraud': '#d97706',
  'False Evidence & Public Justice': '#7c3aed',
  'Public Order – Unlawful Assembly': '#2563eb',
  'Criminal Intimidation & Insult': '#db2777',
  'Defamation': '#db2777',
  'Religious Offences': '#059669',
  'Marriage & Family Offences': '#0891b2',
  'Abetment': '#9333ea',
  'General Exceptions': '#6b7280',
  'Punishments': '#b91c1c',
  'Public Servants': '#1d4ed8',
  'Public Health, Safety & Morals': '#15803d',
  'Offences Against the State': '#b45309',
  'General Provisions': '#374151',
  'General Explanations': '#374151',
}

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || '#486581'
}

interface Props {
  section: LawSection
  showRelevance?: boolean
  highlight?: boolean
}

export default function SectionCard({ section, showRelevance = false, highlight = false }: Props) {
  const [expanded, setExpanded] = useState(false)
  const color = getCategoryColor(section.category)

  return (
    <div
      className="section-card rounded-xl overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      style={{
        background: highlight ? '#fffdf5' : '#ffffff',
        border: highlight ? `2px solid #b8860b` : '1.5px solid #d9e2ec',
        boxShadow: highlight ? '0 4px 20px rgba(184,134,11,0.15)' : '0 2px 8px rgba(16,42,67,0.06)',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${highlight ? '#f9efc4' : '#f0f4f8'}` }}>
        <div className="flex items-center gap-3">
          {/* Section badge */}
          <div className="rounded-lg px-2.5 py-1 text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #102a43, #243b53)', fontFamily: 'Georgia, serif' }}>
            § {section.section}
          </div>

          {/* Category tag */}
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}>
            {section.category}
          </span>

          {/* Relevance score */}
          {showRelevance && section.relevance !== undefined && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: section.relevance > 70 ? '#dcfce7' : section.relevance > 50 ? '#fef9c3' : '#f0f4f8',
                color: section.relevance > 70 ? '#15803d' : section.relevance > 50 ? '#b45309' : '#486581',
              }}>
              {section.relevance}% match
            </span>
          )}
        </div>

        <div style={{ color: '#829ab1' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Title */}
      <div className="px-4 py-3">
        <h3 className="font-semibold text-sm leading-snug" style={{ color: '#102a43', fontFamily: 'Georgia, serif' }}>
          {section.title}
        </h3>
      </div>

      {/* Expanded description */}
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="rounded-lg p-3 text-sm leading-relaxed"
            style={{ background: '#f0f4f8', color: '#334e68', borderLeft: `3px solid ${color}` }}>
            {section.description}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: '#829ab1' }}>
            <Tag size={11} />
            <span>{section.law_code}</span>
          </div>
        </div>
      )}
    </div>
  )
}
