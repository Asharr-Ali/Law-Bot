'use client'

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main card skeleton */}
      <div className="rounded-2xl overflow-hidden"
        style={{ border: '2px solid #b8860b', boxShadow: '0 8px 32px rgba(184,134,11,0.1)' }}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #102a43, #243b53)', borderBottom: '2px solid #b8860b' }}>
          <div className="w-8 h-8 rounded-full shimmer" />
          <div className="space-y-1.5">
            <div className="w-40 h-3.5 rounded shimmer" />
            <div className="w-28 h-2.5 rounded shimmer" />
          </div>
        </div>

        {/* Thinking indicator */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-1.5">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
            <span className="text-sm" style={{ color: '#829ab1', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Analyzing case against Pakistan Penal Code...
            </span>
          </div>

          <div className="space-y-3">
            <div className="h-4 rounded shimmer w-3/4" />
            <div className="h-3 rounded shimmer w-full" />
            <div className="h-3 rounded shimmer w-5/6" />
            <div className="h-3 rounded shimmer w-4/5" />
            <div className="mt-4 h-4 rounded shimmer w-2/3" />
            <div className="h-3 rounded shimmer w-full" />
            <div className="h-3 rounded shimmer w-3/4" />
            <div className="h-3 rounded shimmer w-full" />
            <div className="h-3 rounded shimmer w-5/6" />
          </div>
        </div>
      </div>

      {/* Section skeletons */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded shimmer" />
          <div className="w-48 h-3.5 rounded shimmer" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: '#ffffff', border: '1.5px solid #d9e2ec' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-6 rounded shimmer" />
              <div className="w-32 h-5 rounded shimmer" />
            </div>
            <div className="h-3.5 rounded shimmer w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}
