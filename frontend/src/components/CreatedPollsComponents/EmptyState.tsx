import colors from "#/constants/COLORS"
import { BarChart3, Link, Plus } from "lucide-react"
import { Button } from "../ui/button"
import type { Filter } from "#/types/polls"

export function EmptyState({ filter }: { filter: Filter }) {
  const isFiltered = filter !== 'all'
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl border"
        style={{
          backgroundColor: `${colors.sage}15`,
          borderColor: `${colors.sage}30`,
        }}
      >
        <BarChart3 className="w-6 h-6" style={{ color: colors.sage }} />
      </div>
      <div className="text-center space-y-1">
        <p
          className="text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {isFiltered ? `No ${filter} polls` : 'No polls yet'}
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {isFiltered
            ? `You don't have any ${filter} polls right now.`
            : 'Create your first poll to get started.'}
        </p>
      </div>
      {!isFiltered && (
        <Link to="/polls/new">
          <Button
            className="h-9 px-4 rounded-xl text-sm font-medium text-black mt-2"
            style={{ backgroundColor: colors.sage }}
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Poll
          </Button>
        </Link>
      )}
    </div>
  )
}