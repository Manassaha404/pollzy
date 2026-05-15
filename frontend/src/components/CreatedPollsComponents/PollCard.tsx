import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { Clock, FileText, Globe, Lock } from 'lucide-react'
import colors from '#/constants/COLORS'
import { RESULT_VISIBILITY_CONFIG, STATUS_CONFIG } from '#/constants/POLL_CONSTANTS'
import type { Poll } from '#/types/polls'
import { useNavigate } from '@tanstack/react-router'

export function PollCard({ poll,onClickfn }: { poll: Poll, onClickfn: (poll:Poll)=>void }) {
  const status = STATUS_CONFIG[poll.status]
  const rv = RESULT_VISIBILITY_CONFIG[poll.resultVisibility]
  const RvIcon = rv.icon
  const isExpired = poll.closedAt && new Date(poll.closedAt) < new Date()

  return (
    <Card
      onClick={() => {
        onClickfn(poll);
      }}
      className="border shadow-none rounded-2xl transition-all duration-200 hover:border-white/12 group cursor-pointer"
      style={{
        backgroundColor: '#0d0d0d',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <CardContent className="px-5 py-5 space-y-4">
        {/* ── Top row ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug truncate text-white group-hover:text-white/90 transition-colors">
              {poll.title}
            </p>
            {poll.description && (
              <p
                className="text-xs mt-1 line-clamp-2 leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {poll.description}
              </p>
            )}
          </div>

          <Badge
            variant="outline"
            className="text-xs px-2 py-0.5 shrink-0 rounded-lg font-medium"
            style={{
              color: status.color,
              backgroundColor: status.bg,
              borderColor: status.border,
            }}
          >
            {status.label}
          </Badge>
        </div>

        <Separator style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: poll.isPublic ? colors.sage : colors.steel }}
          >
            {poll.isPublic ? (
              <Globe className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
            {poll.isPublic ? 'Public' : 'Private'}
          </span>

          <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <RvIcon className="w-3.5 h-3.5" />
            {rv.label}
          </span>

          <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>

          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            <FileText className="w-3.5 h-3.5" />
            {format(new Date(poll.createdAt), 'MMM d, yyyy')}
          </span>

          {/* Closes at */}
          {poll.closedAt && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
              <span
                className="flex items-center gap-1.5 text-xs"
                style={{
                  color: isExpired
                    ? 'rgba(255,255,255,0.2)'
                    : `${colors.lavender}99`,
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                {isExpired ? 'Closed ' : 'Closes '}
                {format(new Date(poll.closedAt), 'MMM d, yyyy')}
              </span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
