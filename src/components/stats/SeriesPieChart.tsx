
import type { SeriesStat } from '@/types'
import { PieChart as PieIcon } from 'lucide-react'

interface Props {
  data: SeriesStat[]
}

const COLORS = ['#4f8cff', '#ff8c42', '#4ade80', '#a78bfa', '#fbbf24', '#f87171', '#38bdf8', '#fb923c']

export default function SeriesPieChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="card p-8 text-center text-workspace-muted">
        <PieIcon size={40} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">暂无数据</p>
      </div>
    )
  }

  const total = data.reduce((s, d) => s + d.count, 0)
  let cumulative = 0
  const segments = data.map((d, i) => {
    const startAngle = (cumulative / total) * 360
    cumulative += d.count
    const endAngle = (cumulative / total) * 360
    return {
      ...d,
      startAngle,
      endAngle,
      color: COLORS[i % COLORS.length],
    }
  })

  const size = 200
  const radius = 80
  const innerRadius = 50
  const cx = size / 2
  const cy = size / 2

  const describeArc = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const start = polarToCartesian(cx, cy, outerR, endAngle)
    const end = polarToCartesian(cx, cy, outerR, startAngle)
    const innerStart = polarToCartesian(cx, cy, innerR, endAngle)
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    return [
      'M', start.x, start.y,
      'A', outerR, outerR, 0, largeArcFlag, 0, end.x, end.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerR, innerR, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z',
    ].join(' ')
  }

  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    }
  }

  return (
    <div className="card p-6">
      <h3 className="section-title !mb-6">
        <PieIcon size={20} className="text-mecha-purple" />
        系列占比分布
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="relative shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg, i) => (
              <path
                key={i}
                d={describeArc(seg.startAngle, seg.endAngle, radius, innerRadius)}
                fill={seg.color}
                className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                style={{
                  filter: `drop-shadow(0 0 8px ${seg.color}40)`,
                  animation: `pieReveal 0.8s ease-out ${i * 0.1}s both`,
                }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-display font-bold text-workspace-text">{total}</div>
            <div className="text-[10px] uppercase tracking-wider text-workspace-muted">总模型</div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded shrink-0"
                style={{ backgroundColor: seg.color, boxShadow: `0 0 8px ${seg.color}60` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-mono text-workspace-text truncate">{seg.series}</span>
                  <span className="text-xs font-mono text-workspace-muted shrink-0 ml-2">
                    {seg.count} / {seg.percentage}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-workspace-bg overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${seg.percentage}%`,
                      backgroundColor: seg.color,
                      animation: `barReveal 1s ease-out ${i * 0.1 + 0.3}s both`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
