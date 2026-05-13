import api from '#/api/axios'
import colors from '../../constants/COLORS'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { Pencil, Trash2 } from 'lucide-react'

export default function AnalyticsHeader({ poll }: any) {
  const navigate = useNavigate();
  const handleEditPoll = () => {
    //pending feature !!!!!!
  }

  const handleDeletePoll = async() => {
    await api.delete(`/poll/deletepoll/${poll.id}`)
    navigate({
      to:`/polls/createdpolls`,
      replace: true,
    })
  }

  return (
    <div
      className="rounded-3xl border p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
      style={{
        backgroundColor: '#0d0d0d',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="space-y-3">
        <Badge
          className="rounded-xl px-3 py-1 border-0"
          style={{
            backgroundColor: `${colors.sage}20`,
            color: colors.sage,
          }}
        >
          Active Poll
        </Badge>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {poll.title}
          </h1>

          <p
            className="text-sm mt-2 max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {poll.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleEditPoll}
          variant="outline"
          className="rounded-xl border-0"
          style={{
            backgroundColor: `${colors.steel}15`,
            color: colors.steel,
          }}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Poll
        </Button>

        <Button
          onClick={handleDeletePoll}
          variant="outline"
          className="rounded-xl border-0"
          style={{
            backgroundColor: 'rgba(239,68,68,0.12)',
            color: '#ef4444',
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Poll
        </Button>
      </div>
    </div>
  )
}