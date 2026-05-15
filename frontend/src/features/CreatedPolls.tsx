import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import colors from '../constants/COLORS'

import type { Filter, Poll } from '#/types/polls'
import { useEffect, useState } from 'react'
import api from '#/api/axios'
import { Link, useNavigate } from '@tanstack/react-router'
import { PollCard } from '#/components/CreatedPollsComponents/PollCard'
import { PollSkeleton } from '#/components/CreatedPollsComponents/PollSkeleton'
import { EmptyState } from '#/components/CreatedPollsComponents/EmptyState'
import { ErrorState } from '#/components/CreatedPollsComponents/ErorrState'
import { FILTERS } from '#/constants/POLL_CONSTANTS'

export default function CreatedPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const navigate = useNavigate()
  async function fetchPolls() {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get('/poll/createdpolls')
      setPolls(res.data.data.polls)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  function handelOnclick(poll: Poll) {
    if (poll.status === 'draft') {
      navigate({ to: `/polls/draft/${poll.id}` })
    } else {
      navigate({ to: `/polls/dashboard/${poll.id}` })
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  const filtered = filter === 'all' ? polls : polls.filter((p) => p.status === filter)

  const counts: Record<Filter, number> = {
    all: polls.length,
    active: polls.filter((p) => p.status === 'active').length,
    draft: polls.filter((p) => p.status === 'draft').length,
    closed: polls.filter((p) => p.status === 'closed').length,
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: colors.black }}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">My Polls</h1>
            <p className="mt-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {loading
                ? 'Loading your polls…'
                : polls.length > 0
                  ? `${polls.length} poll${polls.length !== 1 ? 's' : ''} created`
                  : 'All polls you have created'}
            </p>
          </div>

          <Link to="/polls/new">
            <Button
              className="h-10 rounded-xl px-4 text-sm font-semibold text-black transition-colors"
              style={{ backgroundColor: colors.sage }}
            >
              <Plus className="mr-1.5 h-4 w-4" /> New Poll
            </Button>
          </Link>
        </div>

        {!loading && !error && polls.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {FILTERS.map(({ value, label }) => {
              const active = filter === value
              const count = counts[value]
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    backgroundColor: active ? `${colors.sage}1A` : 'transparent',
                    borderColor: active ? `${colors.sage}4D` : 'rgba(255,255,255,0.08)',
                    color: active ? colors.sage : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {label}
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: active
                        ? `${colors.sage}33`
                        : 'rgba(255,255,255,0.06)',
                      color: active ? colors.sage : 'rgba(255,255,255,0.25)',
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <PollSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={fetchPolls} />
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-3">
            {filtered.map((poll) => (
              <PollCard key={poll.id} poll={poll} onClickfn={handelOnclick} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
