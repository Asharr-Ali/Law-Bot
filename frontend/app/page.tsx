import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Bot,
  Database,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import Header from '@/components/Header'

const features = [
  'Retrieval-Augmented Generation (RAG)',
  'Custom structured legal dataset (JSON)',
  'Semantic search using embeddings',
  'Context-aware response generation',
  'Reduced hallucination through SAC',
]

const techStack = [
  { label: 'Frontend', value: 'Next.js' },
  { label: 'Backend', value: 'FastAPI' },
  { label: 'LLM Integration', value: 'Groq API' },
  { label: 'Vector Database', value: 'ChromaDB' },
  { label: 'Data Format', value: 'JSON' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#fdf9ed' }}>
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <section
          className="rounded-3xl p-6 md:p-10"
          style={{
            background: 'linear-gradient(135deg, #102a43 0%, #243b53 100%)',
            border: '2px solid #b8860b',
            boxShadow: '0 18px 40px rgba(16,42,67,0.25)',
          }}
        >
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
              style={{ background: 'rgba(184,134,11,0.2)', color: '#f9efc4', border: '1px solid rgba(184,134,11,0.45)' }}
            >
              <Sparkles size={14} />
              AI-powered legal assistant for Pakistan Penal Code
            </div>
            <h1
              className="text-3xl md:text-5xl font-bold leading-tight"
              style={{ color: '#fdf9ed', fontFamily: 'Georgia, serif' }}
            >
              LawBot helps you understand legal situations with grounded PPC context
            </h1>
            <p className="mt-4 text-sm md:text-base leading-7" style={{ color: '#c3d2e0' }}>
              LawBot combines structured legal data with retrieval and generation so responses are more accurate and
              less hallucinated than plain chat answers.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #b8860b, #d9a520)', color: '#fff', fontFamily: 'Georgia, serif' }}
              >
                Start Case Analysis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
                style={{ border: '1px solid #486581', color: '#d9e2ec', background: 'rgba(16,42,67,0.45)' }}
              >
                Browse PPC Sections
                <BookOpen size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #d9e2ec' }}>
            <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ background: '#fff8e1', color: '#b8860b' }}>
              <Bot size={20} />
            </div>
            <h2 className="font-bold mb-2" style={{ color: '#102a43', fontFamily: 'Georgia, serif' }}>Context-aware guidance</h2>
            <p className="text-sm leading-6" style={{ color: '#486581' }}>
              Identify relevant PPC sections and get practical next-step guidance using retrieved legal context.
            </p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #d9e2ec' }}>
            <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ background: '#fff8e1', color: '#b8860b' }}>
              <Search size={20} />
            </div>
            <h2 className="font-bold mb-2" style={{ color: '#102a43', fontFamily: 'Georgia, serif' }}>Semantic retrieval</h2>
            <p className="text-sm leading-6" style={{ color: '#486581' }}>
              Retrieval-augmented design reduces vague answers by grounding responses in a structured legal dataset.
            </p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #d9e2ec' }}>
            <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center" style={{ background: '#fff8e1', color: '#b8860b' }}>
              <Scale size={20} />
            </div>
            <h2 className="font-bold mb-2" style={{ color: '#102a43', fontFamily: 'Georgia, serif' }}>Pakistan Penal Code focus</h2>
            <p className="text-sm leading-6" style={{ color: '#486581' }}>
              Purpose-built for PPC-style case analysis and legal information workflows.
            </p>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #d9e2ec' }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#102a43', fontFamily: 'Georgia, serif' }}>
              Core Features
            </h3>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: '#334e68' }}>
                  <span className="mt-1 inline-block w-2 h-2 rounded-full" style={{ background: '#b8860b' }} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #d9e2ec' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#102a43', fontFamily: 'Georgia, serif' }}>
              <Database size={18} />
              Tech Stack
            </h3>
            <div className="space-y-3">
              {techStack.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm"
                  style={{ background: '#f8fafc', border: '1px solid #e4ecf5' }}
                >
                  <span style={{ color: '#486581' }}>{item.label}</span>
                  <span className="font-semibold" style={{ color: '#102a43' }}>{item.value}</span>
                </div>
              ))}
              <div className="rounded-lg px-3 py-2 text-sm" style={{ background: '#fff8e1', border: '1px solid #f9efc4', color: '#9a700a' }}>
                Core Concept: Retrieval-Augmented Generation (RAG)
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl p-6" style={{ background: '#fff8e1', border: '1px solid #f9efc4' }}>
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: '#9a700a', fontFamily: 'Georgia, serif' }}>
            <ShieldAlert size={18} />
            Important Disclaimer
          </h3>
          <p className="text-sm leading-7" style={{ color: '#7c5e10' }}>
            LawBot is developed for educational and research purposes only. It is not a lawyer and does not provide
            legal advice. Information may be incomplete, outdated, or inaccurate. Always consult a qualified legal
            professional before making legal decisions.
          </p>
        </section>
      </main>
    </div>
  )
}
