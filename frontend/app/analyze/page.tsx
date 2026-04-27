'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import FileUpload from '@/components/FileUpload'
import AnalysisDisplay from '@/components/AnalysisDisplay'
import AnalysisSkeleton from '@/components/AnalysisSkeleton'
import { analyzeCase, UploadResult, AnalysisResult } from '@/lib/api'
import { Scale, Send, AlertCircle, RotateCcw, Lightbulb } from 'lucide-react'

const EXAMPLE_QUERIES = [
  'My employer fired me without notice and is refusing to pay my last month salary',
  'Someone broke into my house at night and stole my laptop and cash',
  'My landlord is threatening me and has locked me out of my rented house',
  'I was physically attacked and beaten by my neighbour in front of witnesses',
  'Someone is blackmailing me online and threatening to share my private photos',
  'A person borrowed Rs. 500,000 from me by showing fake property documents',
]

export default function AnalyzePage() {
  const [query, setQuery] = useState('')
  const [uploadedDoc, setUploadedDoc] = useState<UploadResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    if (!query.trim() && !uploadedDoc) {
      setError('Please describe your case or upload a document.')
      return
    }
    if (query.trim().length < 15) {
      setError('Please provide more detail about your case (at least 15 characters).')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await analyzeCase(
        query,
        uploadedDoc?.extracted_text
      )
      setResult(res)
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setQuery('')
    setUploadedDoc(null)
    setResult(null)
    setError('')
  }

  const handleExample = (ex: string) => {
    setQuery(ex)
    setResult(null)
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdf9ed' }}>
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: 'linear-gradient(135deg, #b8860b, #d9a520)', boxShadow: '0 4px 20px rgba(184,134,11,0.3)' }}>
            <Scale size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#102a43' }}>
            Analyze Your Case
          </h1>
          <p className="text-sm" style={{ color: '#627d98' }}>
            Describe your situation or upload your FIR. LawBot will identify applicable PPC sections and guide you.
          </p>
        </div>

        {/* Input card */}
        <div className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: '#ffffff',
            border: '1.5px solid #d9e2ec',
            boxShadow: '0 4px 24px rgba(16,42,67,0.08)',
          }}>
          {/* Card header */}
          <div className="px-5 py-4"
            style={{ borderBottom: '1px solid #f0f4f8', background: 'linear-gradient(135deg, #f8fafc, #f0f4f8)' }}>
            <h2 className="font-semibold text-sm" style={{ color: '#334e68', fontFamily: 'Georgia, serif' }}>
              Describe Your Legal Issue
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#829ab1' }}>
              Write in English or Urdu. Be as detailed as possible.
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Text area */}
            <div>
              <textarea
                value={query}
                onChange={(e) => { setQuery(e.target.value); setError('') }}
                placeholder="Example: My neighbor broke into my house and attacked me. He also damaged my property and threatened my family. I want to file an FIR — what sections apply and what should I do?"
                rows={5}
                className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  border: '1.5px solid #bcccdc',
                  fontFamily: 'Georgia, serif',
                  color: '#243b53',
                  background: '#fafcff',
                  lineHeight: 1.7,
                }}
                onFocus={(e) => e.target.style.borderColor = '#b8860b'}
                onBlur={(e) => e.target.style.borderColor = '#bcccdc'}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: query.length < 15 && query.length > 0 ? '#dc2626' : '#b0bec5' }}>
                  {query.length} characters {query.length < 15 && query.length > 0 ? '(need more detail)' : ''}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: '#e8f0f8' }} />
              <span className="text-xs" style={{ color: '#829ab1' }}>OR attach document</span>
              <div className="flex-1 h-px" style={{ background: '#e8f0f8' }} />
            </div>

            {/* File upload */}
            <FileUpload
              onUpload={setUploadedDoc}
              onClear={() => setUploadedDoc(null)}
              uploaded={uploadedDoc}
            />

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
                style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading || (!query.trim() && !uploadedDoc)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{
                  background: loading ? '#9a700a' : 'linear-gradient(135deg, #b8860b, #d9a520)',
                  fontFamily: 'Georgia, serif',
                  boxShadow: '0 4px 15px rgba(184,134,11,0.3)',
                }}>
                <Send size={16} />
                {loading ? 'Analyzing...' : 'Analyze Case'}
              </button>

              {(result || query || uploadedDoc) && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm transition-all hover:opacity-70"
                  style={{ border: '1.5px solid #d9e2ec', color: '#627d98', background: '#f8fafc' }}>
                  <RotateCcw size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Example queries */}
        {!result && !loading && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} style={{ color: '#b8860b' }} />
              <span className="text-xs font-semibold" style={{ color: '#627d98', fontFamily: 'Georgia, serif' }}>
                Try an example:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUERIES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleExample(ex)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105 text-left"
                  style={{
                    background: '#fff',
                    border: '1px solid #d9e2ec',
                    color: '#486581',
                    maxWidth: '100%',
                  }}>
                  "{ex.slice(0, 55)}..."
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading && <AnalysisSkeleton />}
        {result && !loading && <AnalysisDisplay result={result} />}

        {/* Disclaimer footer */}
        <div className="mt-8 p-4 rounded-xl text-center text-xs"
          style={{ background: '#fff8e1', border: '1px solid #f9efc4', color: '#9a700a' }}>
          ⚖️ <strong>Disclaimer:</strong> LawBot provides educational legal information only. Always consult a qualified
          Pakistani lawyer (وکیل) before taking legal action. This is not a substitute for professional legal advice.
        </div>
      </div>
    </div>
  )
}
