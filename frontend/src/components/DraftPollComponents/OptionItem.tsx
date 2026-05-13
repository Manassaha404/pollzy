import { GripVertical, X } from 'lucide-react'


interface OptionItemProps {
  index: number
  value: string
  onChange: (value: string) => void
  onDelete: () => void
  canDelete: boolean
}

export function OptionItem({ index, value, onChange, onDelete, canDelete }: OptionItemProps) {
  return (
    <div className="flex items-center gap-2 group/option">

      <div className="cursor-grab opacity-0 group-hover/option:opacity-100 transition-opacity shrink-0">
        <GripVertical className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
      </div>

      <span
        className="flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-semibold shrink-0"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}
      >
        {index + 1}
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Option ${index + 1}`}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/15 transition-colors"
        style={{ color: 'rgba(255,255,255,0.85)' }}
      />

      {canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="opacity-0 group-hover/option:opacity-100 transition-opacity shrink-0 p-1 rounded-lg hover:bg-red-500/10"
        >
          <X className="w-3.5 h-3.5" style={{ color: 'rgba(252,165,165,0.6)' }} />
        </button>
      )}
    </div>
  )
}