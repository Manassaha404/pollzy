import { Globe, Lock, Pencil, Trash2, Send, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import colors from '../../constants/COLORS.js'

interface PollHeaderProps {
  title: string
  description?: string | null
  isPublic: boolean
  onEdit: () => void
  onDelete: () => void
  onPublish: () => void
  onPreview: () => void
  isPublishing?: boolean
}

export function PollHeader({
  title,
  description,
  isPublic,
  onEdit,
  onDelete,
  onPublish,
  onPreview,
  isPublishing,
}: PollHeaderProps) {
  return (
    <div
      className="rounded-2xl border px-6 py-5 space-y-4"
      style={{ backgroundColor: '#0d0d0d', borderColor: 'rgba(255,255,255,0.06)' }}
    >
    
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider"
              style={{
                color: colors.steel,
                backgroundColor: `${colors.steel}1A`,
                borderColor: `${colors.steel}40`,
              }}
            >
              Draft
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1"
              style={{
                color: isPublic ? colors.sage : 'rgba(255,255,255,0.35)',
                backgroundColor: isPublic ? `${colors.sage}1A` : 'rgba(255,255,255,0.05)',
                borderColor: isPublic ? `${colors.sage}40` : 'rgba(255,255,255,0.08)',
              }}
            >
              {isPublic
                ? <><Globe className="w-2.5 h-2.5" /> Public</>
                : <><Lock className="w-2.5 h-2.5" /> Private</>
              }
            </Badge>
          </div>

          <h1 className="text-xl font-semibold text-white tracking-tight leading-snug truncate">
            {title}
          </h1>
          {description && (
            <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onPreview}
            className="h-9 px-3 rounded-xl text-xs font-medium border transition-colors"
            style={{
              color: 'rgba(255,255,255,0.4)',
              borderColor: 'rgba(255,255,255,0.08)',
              backgroundColor: 'transparent',
            }}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-9 px-3 rounded-xl text-xs font-medium border transition-colors"
            style={{
              color: colors.steel,
              borderColor: `${colors.steel}30`,
              backgroundColor: `${colors.steel}0D`,
            }}
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-9 px-3 rounded-xl text-xs font-medium border transition-colors"
            style={{
              color: 'rgba(252,165,165,0.7)',
              borderColor: 'rgba(239,68,68,0.2)',
              backgroundColor: 'rgba(239,68,68,0.06)',
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onPublish}
            disabled={isPublishing}
            className="h-9 px-4 rounded-xl text-xs font-semibold text-black transition-colors disabled:opacity-60"
            style={{ backgroundColor: colors.sage }}
          >
            {isPublishing ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Publishing…
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Publish
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}