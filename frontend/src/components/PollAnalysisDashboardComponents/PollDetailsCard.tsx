import colors from '../../constants/COLORS'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { CalendarClock, Eye, Globe, Lock, TimerReset, Vote } from 'lucide-react'

interface PollDetailsCardProps {
  poll: {
    title: string
    description?: string | null
    isPublic: boolean
    status: 'active' | 'closed' | 'draft'
    createdAt: Date | string
    closedAt?: Date | string | null
    totalViews: number
    totalVotes: number
  }
}

const STATUS_CONFIG = {
  active: {
    label: 'active',
    color: colors.sage,
    bg: `${colors.sage}15`,
  },
  closed: {
    label: 'closed',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.15)',
  },
  draft: {
    label: 'draft',
    color: colors.steel,
    bg: `${colors.steel}15`,
  },
}

export default function PollDetailsCard({ poll }: PollDetailsCardProps) {

  
  const status = STATUS_CONFIG[poll.status]

  
  return (
    <Card
      className="rounded-3xl border shadow-none"
      style={{
        backgroundColor: '#0d0d0d',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <CardContent className="p-5 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs uppercase tracking-wider"
              style={{
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              Poll Details
            </p>

            <h2 className="text-white text-lg font-semibold mt-1">
              {poll.title}
            </h2>
          </div>

          <Badge
            className="rounded-xl border-0 px-3 py-1"
            style={{
              color: status.color,
              backgroundColor: status.bg,
            }}
          >
            {status.label}
          </Badge>
        </div>

        {poll.description && (
          <div
            className="rounded-2xl p-4 text-sm leading-relaxed"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            {poll.description}
          </div>
        )}

        <Separator
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        />

        
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" style={{ color: colors.sage }} />

              <span
                className="text-xs"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Total Views
              </span>
            </div>

            <p className="text-white text-xl font-semibold mt-3">
              {poll.totalViews}
            </p>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4" style={{ color: colors.lavender }} />

              <span
                className="text-xs"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Total Votes
              </span>
            </div>

            <p className="text-white text-xl font-semibold mt-3">
              {poll.totalVotes}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          
          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Visibility
            </span>

            <div
              className="flex items-center gap-2 text-sm"
              style={{
                color: poll.isPublic ? colors.sage : colors.steel,
              }}
            >
              {poll.isPublic ? (
                <Globe className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}

              {poll.isPublic ? 'Public' : 'Private'}
            </div>
          </div>

          
          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Created
            </span>

            <div
              className="flex items-center gap-2 text-sm"
              style={{
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <CalendarClock className="w-4 h-4" />

              {format(new Date(poll.createdAt), 'MMM d, yyyy')}
            </div>
          </div>

          
          {poll.closedAt && (
            <div className="flex items-center justify-between">
              <span
                className="text-sm"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Ends At
              </span>

              <div
                className="flex items-center gap-2 text-sm"
                style={{
                  color: colors.lavender,
                }}
              >
                <TimerReset className="w-4 h-4" />

                {format(new Date(poll.closedAt), 'MMM d, yyyy')}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
