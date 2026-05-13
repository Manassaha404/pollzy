import { Button } from "../ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl border"
        style={{
          backgroundColor: 'rgba(239,68,68,0.08)',
          borderColor: 'rgba(239,68,68,0.2)',
        }}
      >
        <AlertCircle
          className="w-6 h-6"
          style={{ color: 'rgba(252,165,165,0.8)' }}
        />
      </div>
      <div className="text-center space-y-1">
        <p
          className="text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Failed to load polls
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Something went wrong. Please try again.
        </p>
      </div>
      <Button
        onClick={onRetry}
        variant="outline"
        className="h-9 px-4 rounded-xl text-sm border text-white/50 hover:text-white/80 mt-2"
        style={{
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Try again
      </Button>
    </div>
  )
}