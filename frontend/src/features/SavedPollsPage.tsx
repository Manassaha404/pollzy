import { useState, useEffect } from 'react'
import { Bookmark, Plus } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PollCard } from '../components/CreatedPollsComponents/PollCard'
import colors from '#/constants/COLORS'
import type { Poll } from '#/types/polls'
import api from '#/api/axios'
import { PollSkeleton } from '#/components/CreatedPollsComponents/PollSkeleton'




function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl border"
        style={{ backgroundColor: `${colors.lavender}12`, borderColor: `${colors.lavender}30` }}
      >
        <Bookmark className="w-6 h-6" style={{ color: colors.lavender }} />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          No saved polls
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Polls you bookmark will appear here.
        </p>
      </div>
      <Link to="/polls">
        <Button
          className="h-9 px-4 rounded-xl text-sm font-medium text-black mt-2"
          style={{ backgroundColor: colors.sage }}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Explore Polls
        </Button>
      </Link>
    </div>
  )
}


export default function SavedPollsPage() {
  const [polls, setPolls]   = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)
    const navigate = useNavigate()
  async function fetchSavedPolls() {
    setLoading(true)
    setError(false)
    try {
      const res = await api.get('/poll/saved')
      setPolls(res.data.data.polls)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  function handelOnclick(poll: Poll) {
    navigate({to:`/polls/${poll.id}`})
  }
  useEffect(() => { fetchSavedPolls() }, [])

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: colors.black }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-1">
            <Bookmark className="w-5 h-5" style={{ color: colors.lavender }} />
            <h1 className="text-3xl font-semibold tracking-tight text-white">Saved Polls</h1>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {loading
              ? 'Loading your saved polls…'
              : polls.length > 0
                ? `${polls.length} saved poll${polls.length !== 1 ? 's' : ''}`
                : 'Polls you bookmark will appear here'}
          </p>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <PollSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Failed to load saved polls.</p>
            <Button
              onClick={fetchSavedPolls}
              variant="ghost"
              className="h-9 px-4 rounded-xl text-xs border"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              Try again
            </Button>
          </div>
        ) : polls.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} onClickfn={handelOnclick} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}