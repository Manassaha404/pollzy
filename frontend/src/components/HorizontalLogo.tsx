import { BarChart2 } from 'lucide-react'
const sage = '#8FB3A1'
const HorizontalLogo = () => {
  return (
    <div className="flex flex-col items-center mb-10">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: sage }}
      >
        <BarChart2 size={20} className="text-black" />
      </div>
      <h1 className="text-white text-2xl font-bold tracking-wide">
        Poll<span style={{ color: sage }}>zy</span>
      </h1>
    </div>
  )
}

export default HorizontalLogo
