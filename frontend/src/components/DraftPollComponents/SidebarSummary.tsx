import colors from "#/constants/COLORS"
import type { QuestionDraft } from "./QuestionCard"

export function SidebarSummary({ questions }: { questions: QuestionDraft[] }) {
  const totalOptions  = questions.reduce((acc, q) => acc + q.options.length, 0)
  const requiredCount = questions.filter((q) => q.isRequired).length
  const filledCount   = questions.filter((q) => q.text.trim().length > 0).length

  const stats = [
    { label: 'Questions',  value: questions.length },
    { label: 'Options',    value: totalOptions      },
    { label: 'Required',   value: requiredCount     },
    { label: 'Filled',     value: `${filledCount}/${questions.length}` },
  ]

  return (
    <div
      className="rounded-2xl border px-5 py-5 space-y-4 sticky top-6"
      style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Overview
      </p>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-1 px-3 py-3 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          >
            <span className="text-lg font-bold text-white">{value}</span>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 pt-1">
        <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Questions
        </p>
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <span
              className="w-5 h-5 flex items-center justify-center rounded-md text-[10px] font-bold shrink-0"
              style={{ backgroundColor: `${colors.sage}20`, color: colors.sage }}
            >
              {i + 1}
            </span>
            <span
              className="text-xs truncate"
              style={{ color: q.text ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)' }}
            >
              {q.text || 'Untitled question'}
            </span>
            {q.isRequired && (
              <span className="shrink-0 text-[9px] font-semibold" style={{ color: `${colors.lavender}80` }}>
                REQ
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}