import { BarChart2 } from 'lucide-react'

const sage = '#8FB3A1'

const Footer = () => {
  return (
    <div className="px-4 pb-4">
      <footer className="mx-auto max-w-3xl bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ backgroundColor: sage }}
          >
            <BarChart2 size={12} className="text-black" />
          </div>
          <span className="text-white/40 text-xs font-medium">Pollzy</span>
        </div>
        <p className="text-white/20 text-xs">© 2025 Pollzy. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Footer