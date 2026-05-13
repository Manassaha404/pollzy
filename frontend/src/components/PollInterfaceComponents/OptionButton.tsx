import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import colors from '../../constants/COLORS'

interface OptionButtonProps {
  label: string
  index: number
  selected: boolean
  showResult: boolean
  voteCount: number
  totalVotes: number
  onClick: () => void
}

export function OptionButton({
  label,
  index,
  selected,
  showResult,
  voteCount,
  totalVotes,
  onClick,
}: OptionButtonProps) {
  const pct     = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0
  const letter  = String.fromCharCode(65 + index) // A, B, C…

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-300 overflow-hidden group',
        'focus-visible:outline-none',
      )}
      style={{
        backgroundColor: selected
          ? `${colors.sage}18`
          : 'rgba(255,255,255,0.03)',
        borderColor: selected
          ? `${colors.sage}60`
          : 'rgba(255,255,255,0.08)',
      }}
    >
     
      {showResult && (
        <div
          className="absolute inset-0 left-0 top-0 h-full rounded-2xl transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: selected
              ? `${colors.sage}20`
              : 'rgba(255,255,255,0.04)',
            zIndex: 0,
          }}
        />
      )}

      <div className="relative z-10 flex items-center gap-3">
     
        <span
          className="flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold shrink-0 transition-all duration-300"
          style={{
            backgroundColor: selected
              ? colors.sage
              : 'rgba(255,255,255,0.07)',
            color: selected ? '#000' : 'rgba(255,255,255,0.4)',
          }}
        >
          {selected ? <Check className="w-3.5 h-3.5" /> : letter}
        </span>


        <span
          className="flex-1 text-sm font-medium transition-colors duration-200"
          style={{ color: selected ? '#fff' : 'rgba(255,255,255,0.7)' }}
        >
          {label}
        </span>

      
        {showResult && (
          <span
            className="text-xs font-semibold shrink-0 transition-all duration-300"
            style={{ color: selected ? colors.sage : 'rgba(255,255,255,0.35)' }}
          >
            {pct}%
          </span>
        )}
      </div>
    </button>
  )
}