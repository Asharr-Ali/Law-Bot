const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface LawSection {
  section: string
  title: string
  category: string
  law_code: string
  description: string
  relevance?: number
}

export interface AnalysisResult {
  success: boolean
  analysis: string
  retrieved_sections: LawSection[]
  query_used: string
}

export interface UploadResult {
  success: boolean
  extracted_text: string
  char_count: number
  filename: string
}

export async function uploadDocument(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/api/upload-document`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Upload failed')
  }

  return res.json()
}

export async function analyzeCase(
  query: string,
  extractedDocText?: string
): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      extracted_doc_text: extractedDocText || null,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Analysis failed')
  }

  return res.json()
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/api/categories`)
  return res.json()
}

export async function getAllSections() {
  const res = await fetch(`${API_BASE}/api/sections`)
  return res.json()
}

export async function searchSections(q: string) {
  const res = await fetch(`${API_BASE}/api/sections/search?q=${encodeURIComponent(q)}&limit=15`)
  return res.json()
}
