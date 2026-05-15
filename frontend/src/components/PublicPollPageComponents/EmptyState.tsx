import colors from "#/constants/COLORS";
import { SearchX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-24">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl border"
        style={{ backgroundColor: `${colors.steel}12`, borderColor: `${colors.steel}30` }}
      >
        <SearchX className="h-6 w-6" style={{ color: colors.steel }} />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
          No public polls yet
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Public polls from the community will appear here.
        </p>
      </div>
    </div>
  )
}