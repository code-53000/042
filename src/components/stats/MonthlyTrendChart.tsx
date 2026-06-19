
import type { MonthlyStat } from '@/types'
import { TrendingUp } from 'lucide-react'

interface Props {
  data: MonthlyStat[]
}

export default function MonthlyTrendChart({ data }: Props) {
  if (data.length === 0) return null

  const maxVal = Math.max(1, ...data.map(d => Math.max(d.started, d.finished)))

  return (
    <div className="card p-6">
      <h3 className="section-title">
        <TrendingUp size={20} className="text-mecha-orange" />
        月度开工/完成趋势
      </h3>

      <div className="flex items-end justify-between gap-2 h-48 mt-6">
        {data.map((d, i) => {
          const startedH = (d.started / maxVal) * 100
          const finishedH = (d.finished / maxVal) * 100
          const monthLabel = d.month.slice(5)

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="flex items-end gap-1 h-40 flex-1 w-full max-w-[60px]">
                <div
                  className="flex-1 rounded-t bg-mecha-blue/80 transition-all duration-700 relative"
                  style={{
                    height: `${startedH}%`,
                    minHeight: d.started > 0 ? '4px' : '0',
                    animation: `growUp 0.6s ease-out ${i * 0.08}s both`,
                    boxShadow: '0 0 12px rgba(79,140,255,0.3)',
                  }}
                >
                  {d.started > 0 && startedH > 20 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-mecha-blue font-bold">
                      {d.started}
                    </span>
                  )}
                </div>
                <div
                  className="flex-1 rounded-t bg-mecha-green/80 transition-all duration-700 relative"
                  style={{
                    height: `${finishedH}%`,
                    minHeight: d.finished > 0 ? '4px' : '0',
                    animation: `growUp 0.6s ease-out ${i * 0.08 + 0.2}s both`,
                    boxShadow: '0 0 12px rgba(74,222,128,0.3)',
                  }}
                >
                  {d.finished > 0 && finishedH > 20 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-mecha-green font-bold">
                      {d.finished}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-[10px] font-mono text-workspace-muted">{monthLabel}</div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-workspace-border/50 flex items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-mecha-blue" />
          <span className="text-xs text-workspace-muted">新开工</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-mecha-green" />
          <span className="text-xs text-workspace-muted">完成收工</span>
        </div>
      </div>
    </div>
  )
}
