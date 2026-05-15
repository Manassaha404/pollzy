import { useState, useEffect, useRef, useCallback } from 'react'
import { Globe} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PollCard } from '../components/CreatedPollsComponents/PollCard'
import colors from '#/constants/COLORS'
import type { Poll } from '#/types/polls'
import api from '#/api/axios'
import { PollSkeleton } from '#/components/CreatedPollsComponents/PollSkeleton'
import { useNavigate } from '@tanstack/react-router'
import { EmptyState } from '#/components/PublicPollPageComponents/EmptyState'
import { BottomLoader } from '#/components/PublicPollPageComponents/BottomLoader'
import { NoMoreData } from '#/components/PublicPollPageComponents/NoMoreData'

const PAGE_SIZE = 10









export default function PublicPollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  async function fetchInitial() {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get('/poll/public', { params: { page: 1, limit: PAGE_SIZE } })
      const incoming: Poll[] = res.data.data.polls
      setPolls(incoming)
      setPage(1)
      setHasMore(incoming.length === PAGE_SIZE)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  const fetchMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const res = await api.get('/poll/public', {
        params: { page: nextPage, limit: PAGE_SIZE },
      })
      const incoming: Poll[] = res.data.data.polls
      if (incoming.length === 0) {
        setHasMore(false)
      } else {
        setPolls((prev) => [...prev, ...incoming])
        setPage(nextPage)
        if (incoming.length < PAGE_SIZE) setHasMore(false)
      }
    } catch {
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page])

  useEffect(() => {
    fetchInitial()
  }, [])

  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchMore()
      },
      { threshold: 0.5 },
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [fetchMore])

  function handelOnclick(poll: Poll) {
    
      navigate({ to: `/polls/${poll.id}` })
    
  }
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: colors.black }}>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <div className="mb-1 flex items-center gap-2.5">
            <Globe className="h-5 w-5" style={{ color: colors.sage }} />
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Public Polls
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {loading
              ? 'Loading polls…'
              : polls.length > 0
                ? `${polls.length} poll${polls.length !== 1 ? 's' : ''} available`
                : 'No public polls at the moment'}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <PollSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-24">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Failed to load public polls.
            </p>
            <Button
              onClick={fetchInitial}
              variant="ghost"
              className="h-9 rounded-xl border px-4 text-xs"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Try again
            </Button>
          </div>
        ) : polls.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="space-y-3">
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} onClickfn={handelOnclick} />
              ))}
            </div>

            {loadingMore && <BottomLoader />}
            {!hasMore && !loadingMore && <NoMoreData />}
            {hasMore && <div ref={sentinelRef} className="h-10 w-full" aria-hidden />}
          </>
        )}
      </div>
    </div>
  )
}
