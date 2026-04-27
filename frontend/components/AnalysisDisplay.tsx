'use client'

import { AnalysisResult } from '@/lib/api'
import { Scale, BookOpen, Copy, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import SectionCard from '@/components/SectionCard'

interface Props {
  result: AnalysisResult
}

export default function AnalysisDisplay({ result }: Props) {
  const [copied, setCopied] = useState(false)

  if (!result) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(result.analysis)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5" style={{ animation: 'slideUp 0.4s ease both' }}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Markdown container ── */
        .law-markdown { font-family: Georgia, serif; color: #243b53; }

        /* Paragraphs */
        .law-markdown p {
          font-size: 14px;
          line-height: 1.85;
          margin: 0 0 12px 0;
          color: #243b53;
        }
        .law-markdown p:last-child { margin-bottom: 0; }

        /* H2 — section headings */
        .law-markdown h2 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          font-family: Georgia, serif;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #b8860b;
          margin: 24px 0 10px 0;
          padding-bottom: 8px;
          border-bottom: 1.5px solid #f0c04055;
        }
        .law-markdown h2:first-child { margin-top: 0; }

        /* H3 */
        .law-markdown h3 {
          font-size: 14px;
          font-weight: 700;
          color: #334e68;
          margin: 16px 0 8px 0;
          font-family: Georgia, serif;
        }

        /* Bold */
        .law-markdown strong {
          font-weight: 700;
          color: #102a43;
        }

        /* Numbered list */
        .law-markdown ol {
          margin: 8px 0 14px 0;
          padding: 0;
          list-style: none;
          counter-reset: law-counter;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .law-markdown ol li {
          counter-increment: law-counter;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          font-size: 14px;
          line-height: 1.75;
          color: #243b53;
        }
        .law-markdown ol li::before {
          content: counter(law-counter);
          min-width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8860b, #d9a520);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          box-shadow: 0 2px 5px rgba(184,134,11,0.35);
          font-family: Georgia, serif;
        }

        /* Bullet list */
        .law-markdown ul {
          margin: 8px 0 14px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .law-markdown ul li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 14px;
          line-height: 1.75;
          color: #243b53;
        }
        .law-markdown ul li::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #b8860b;
          flex-shrink: 0;
          margin-top: 8px;
          box-shadow: 0 0 0 2.5px rgba(184,134,11,0.18);
        }

        /* Inline code */
        .law-markdown code {
          background: #fff8e1;
          border: 1px solid #f0c04066;
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 12px;
          color: #92400e;
          font-family: 'Courier New', monospace;
        }

        /* Blockquote — used for disclaimers / notes */
        .law-markdown blockquote {
          margin: 12px 0;
          padding: 12px 16px;
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          border-left: 3px solid #f59e0b;
          border-radius: 0 10px 10px 0;
          color: #78350f;
          font-size: 13px;
          line-height: 1.7;
        }
        .law-markdown blockquote p { margin: 0; color: #78350f; }

        /* Dividers between sections */
        .law-markdown hr {
          border: none;
          border-top: 1px solid #f0e8cc;
          margin: 20px 0;
        }

        /* Section divider pill that appears before each h2 (except first) */
        .law-markdown h2 + * { }
      `}</style>

      {/* ── Main analysis card ── */}
      <div style={{
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1.5px solid #d0a020',
        boxShadow: '0 8px 32px rgba(184,134,11,0.10)',
        background: '#fff',
      }}>

        {/* Card header */}
        <div style={{
          background: 'linear-gradient(135deg, #102a43 0%, #1e3a5f 100%)',
          borderBottom: '2px solid #b8860b',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #b8860b, #d9a520)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(184,134,11,0.4)',
            }}>
              <Scale size={16} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', fontFamily: 'Georgia, serif' }}>
                LawBot Legal Analysis
              </div>
              <div style={{ color: '#93c5fd', fontSize: '11px', marginTop: '1px' }}>
                Pakistan Penal Code Assessment
              </div>
            </div>
          </div>

          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: copied ? 'rgba(21,128,61,0.25)' : 'rgba(184,134,11,0.18)',
              color: copied ? '#86efac' : '#d9a520',
              border: `1px solid ${copied ? 'rgba(134,239,172,0.35)' : 'rgba(217,165,32,0.3)'}`,
            }}
          >
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Markdown body */}
        <div style={{ padding: '22px 24px' }}>
          <div className="law-markdown">
            <ReactMarkdown>{result.analysis}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* ── Retrieved PPC Sections ── */}
      {result.retrieved_sections && result.retrieved_sections.length > 0 && (
        <div style={{
          borderRadius: '18px',
          overflow: 'hidden',
          border: '1.5px solid #d9e2ec',
          background: '#fff',
          boxShadow: '0 4px 16px rgba(16,42,67,0.06)',
        }}>
          {/* Section header */}
          <div style={{
            padding: '13px 20px',
            borderBottom: '1px solid #f0f4f8',
            background: 'linear-gradient(135deg, #f8fafc, #f0f4f8)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #b8860b, #d9a520)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BookOpen size={13} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '13px', color: '#334e68' }}>
              Relevant PPC Sections Retrieved
            </span>
            <span style={{
              marginLeft: 'auto',
              fontSize: '11px',
              fontWeight: 700,
              color: '#b8860b',
              background: '#fff8e1',
              border: '1px solid #f0c040',
              borderRadius: '20px',
              padding: '2px 10px',
            }}>
              {result.retrieved_sections.length} found
            </span>
          </div>

          {/* Section list */}
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.retrieved_sections.map((sec, i) => (
              <div
                key={sec.section ?? i}
                style={{
                  borderRadius: '12px',
                  border: `1.5px solid ${i === 0 ? '#f0c040' : '#e2e8f0'}`,
                  background: i === 0
                    ? 'linear-gradient(135deg, #fffdf0, #fffbe8)'
                    : '#fafcff',
                  padding: '12px 14px',
                  transition: 'box-shadow 0.2s',
                  boxShadow: i === 0 ? '0 3px 12px rgba(184,134,11,0.12)' : 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,42,67,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = i === 0 ? '0 3px 12px rgba(184,134,11,0.12)' : 'none')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  {/* Badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: i === 0 ? '#fff8e1' : '#f1f5f9',
                      color: i === 0 ? '#92400e' : '#475569',
                      border: `1px solid ${i === 0 ? '#f0c040' : '#cbd5e1'}`,
                      whiteSpace: 'nowrap',
                    }}>
                      § {sec.section}
                    </span>
                    {i === 0 && (
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#b8860b',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}>
                        Top
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Georgia, serif',
                      fontWeight: 700,
                      fontSize: '13px',
                      color: '#243b53',
                      marginBottom: '4px',
                    }}>
                      {sec.title}
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      lineHeight: 1.65,
                      color: '#627d98',
                    }}>
                      {sec.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '8px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        📁 {sec.category}
                      </span>
                      {sec.relevance !== undefined && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: sec.relevance > 75 ? '#16a34a' : '#d97706',
                          background: sec.relevance > 75 ? '#f0fdf4' : '#fffbeb',
                          border: `1px solid ${sec.relevance > 75 ? '#86efac' : '#fde68a'}`,
                          borderRadius: '20px',
                          padding: '2px 8px',
                        }}>
                          {sec.relevance}% match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}