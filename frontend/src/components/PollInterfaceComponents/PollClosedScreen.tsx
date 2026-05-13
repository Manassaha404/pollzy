import { LockKeyhole, BarChart2, Share2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import colors from '#/constants/COLORS'


interface PollClosedScreenProps {
  pollTitle: string
  closedAt?: string | null
  totalVotes?: number
  onViewResults: () => void
  onShare: () => void
}

export function PollClosedScreen({
  pollTitle,
  closedAt,
  totalVotes,
  onViewResults,
  onShare,
}: PollClosedScreenProps) {
  return (
    <Card
      className="border shadow-none rounded-2xl"
      style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <CardContent className="px-6 py-10">
        <div className="flex flex-col items-center text-center space-y-6">

         
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <LockKeyhole className="w-7 h-7" style={{ color: 'rgba(255,255,255,0.3)' }} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">This poll is closed</h2>
            <p
              className="text-sm max-w-xs leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              <span className="text-white/55 font-medium">"{pollTitle}"</span> is no
              longer accepting responses.
            </p>
          </div>

     
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {closedAt && (
              <span
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.07)',
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                Closed {format(new Date(closedAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            )}
            {totalVotes !== undefined && (
              <span
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  color: colors.sage,
                  backgroundColor: `${colors.sage}10`,
                  borderColor: `${colors.sage}30`,
                }}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <Separator style={{ backgroundColor: 'rgba(255,255,255,0.05)', width: '100%' }} />

          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={onViewResults}
              className="h-10 px-6 rounded-xl text-sm font-semibold text-black transition-colors"
              style={{ backgroundColor: colors.sage }}
            >
              <BarChart2 className="w-4 h-4 mr-1.5" />
              See Results
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onShare}
              className="h-10 px-4 rounded-xl text-sm font-medium border transition-colors"
              style={{
                color: 'rgba(255,255,255,0.4)',
                borderColor: 'rgba(255,255,255,0.08)',
                backgroundColor: 'transparent',
              }}
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}