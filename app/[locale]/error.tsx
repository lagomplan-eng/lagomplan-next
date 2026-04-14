'use client'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="pt-[72px] min-h-screen bg-[#F4F0E8] flex items-center justify-center">
      <div className="max-w-[480px] mx-auto px-6 py-16 text-center">
        <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#B33A3A] mb-3">
          Something went wrong
        </p>
        <h1 className="font-sans text-[24px] font-semibold text-[#0F3A33] mb-3">
          Unexpected error
        </h1>
        <pre className="bg-white border border-[rgba(15,58,51,.12)] rounded-[8px] p-4 text-[12px] text-[#4F6F68] text-left overflow-auto mb-6 whitespace-pre-wrap">
          {error.message}
        </pre>
        <button
          onClick={reset}
          className="font-mono text-[10px] tracking-[1.5px] uppercase bg-[#0F3A33] text-[#FFF9F3] px-5 py-3 rounded-[4px]"
        >
          Try again
        </button>
      </div>
    </main>
  )
}
