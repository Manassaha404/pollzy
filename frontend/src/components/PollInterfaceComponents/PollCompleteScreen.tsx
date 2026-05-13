import { CheckCircle2, BarChart2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import colors from '../../constants/COLORS'

interface PollCompleteScreenProps {
  pollTitle: string
  onViewResults: () => void
  onShare: () => void
}

export function PollCompleteScreen({ pollTitle, onViewResults, onShare }: PollCompleteScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
      {/* Icon */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl border"
        style={{ backgroundColor: `${colors.sage}15`, borderColor: `${colors.sage}35` }}
      >
        <CheckCircle2 className="w-7 h-7" style={{ color: colors.sage }} />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Thanks for voting!</h2>
        <p className="text-sm max-w-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Your responses for <span className="text-white/60 font-medium">"{pollTitle}"</span> have been recorded.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onViewResults}
          className="h-10 px-5 rounded-xl text-sm font-semibold text-black transition-colors"
          style={{ backgroundColor: colors.sage }}
        >
          <BarChart2 className="w-4 h-4 mr-1.5" />
          View Results
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onShare}
          className="h-10 px-5 rounded-xl text-sm font-medium border transition-colors"
          style={{
            color: 'rgba(255,255,255,0.4)',
            borderColor: 'rgba(255,255,255,0.08)',
            backgroundColor: 'transparent',
          }}
        >
          <Share2 className="w-4 h-4 mr-1.5" />
          Share Poll
        </Button>
      </div>
    </div>
  )
}