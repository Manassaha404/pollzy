import colors from '../../constants/COLORS'

interface PollProgressBarProps {
  current: number
  total: number
}

export function PollProgressBar({ current, total }: PollProgressBarProps) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Question {current} of {total}
        </span>
        <span className="text-xs font-semibold" style={{ color: colors.sage }}>
          {pct}%
        </span>
      </div>
      <div className="h-1 w-full rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-1 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: colors.sage }}
        />
      </div>
    </div>
  )
}