import { useState } from 'react'
import colors from '../../constants/COLORS'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink, Check } from 'lucide-react'

export default function SharePollCard({ poll }: any) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(poll.shareUrl)

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleOpenLink = () => {
    window.open(poll.shareUrl, '_blank')
  }

  return (
    <Card
      className="rounded-3xl border shadow-none"
      style={{
        backgroundColor: '#0d0d0d',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-white font-medium">Public Link</h3>

          <p
            className="text-sm mt-1"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Share this link with voters
          </p>
        </div>

        <div
          className="rounded-2xl px-4 py-3 text-sm break-all"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: colors.lavender,
          }}
        >
          {poll.shareUrl}
        </div>

        {copied && (
          <div
            className="rounded-xl px-4 py-2 text-sm flex items-center gap-2"
            style={{
              backgroundColor: `${colors.sage}20`,
              color: colors.sage,
            }}
          >
            <Check className="w-4 h-4" />
            Link copied to clipboard
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleCopy}
            className="flex-1 rounded-xl text-black"
            style={{ backgroundColor: colors.sage }}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>

          <Button
            onClick={handleOpenLink}
            variant="outline"
            className="rounded-xl border-0"
            style={{
              backgroundColor: `${colors.steel}15`,
              color: colors.steel,
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}