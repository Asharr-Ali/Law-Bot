'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { uploadDocument, UploadResult } from '@/lib/api'

interface Props {
  onUpload: (result: UploadResult) => void
  onClear: () => void
  uploaded: UploadResult | null
}

export default function FileUpload({ onUpload, onClear, uploaded }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return
    const file = acceptedFiles[0]

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await uploadDocument(file)
      onUpload(result)
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: loading || !!uploaded,
  })

  if (uploaded) {
    return (
      <div className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}>
        <CheckCircle size={18} style={{ color: '#15803d', flexShrink: 0, marginTop: 2 }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: '#15803d' }}>
            {uploaded.filename}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#166534' }}>
            Extracted {uploaded.char_count.toLocaleString()} characters from PDF
          </p>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: '#4b7a5a', fontStyle: 'italic' }}>
            "{uploaded.extracted_text.slice(0, 120)}..."
          </p>
        </div>
        <button onClick={onClear} className="flex-shrink-0 hover:opacity-70 transition-opacity"
          style={{ color: '#15803d' }}>
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${isDragActive ? 'dropzone-active' : ''}`}
        style={{
          borderColor: isDragActive ? '#b8860b' : '#bcccdc',
          background: isDragActive ? '#fdf9ed' : '#f8fafc',
        }}
      >
        <input {...getInputProps()} />

        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader size={28} className="animate-spin" style={{ color: '#b8860b' }} />
            <p className="text-sm" style={{ color: '#486581' }}>Extracting text from PDF...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: isDragActive ? '#b8860b' : '#e8f0f8' }}>
              {isDragActive
                ? <Upload size={22} className="text-white" />
                : <FileText size={22} style={{ color: '#627d98' }} />}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#334e68', fontFamily: 'Georgia, serif' }}>
                {isDragActive ? 'Drop your FIR here' : 'Upload FIR / Legal Document'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#829ab1' }}>
                Drag & drop a PDF, or click to browse
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-xs"
          style={{ color: '#dc2626' }}>
          <AlertCircle size={13} />
          {error}
        </div>
      )}
    </div>
  )
}
