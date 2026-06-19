
import type { PaintRecord } from '@/types'
import { Palette, Beaker } from 'lucide-react'

interface Props {
  records: PaintRecord[]
}

export default function PaintSummary({ records }: Props) {
  const brandGroups = records.reduce((acc, r) => {
    const arr = acc.get(r.brand) ?? []
    acc.set(r.brand, [...arr, r])
    return acc
  }, new Map<string, PaintRecord[]>())

  if (records.length === 0) {
    return (
      <div className="card p-6 text-center text-workspace-muted">
        <Palette size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">还没有漆料记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Array.from(brandGroups.entries()).map(([brand, recs]) => (
        <div key={brand} className="card p-4">
          <h4 className="font-display font-semibold text-workspace-text mb-3 flex items-center gap-2">
            <Beaker size={16} className="text-mecha-purple" />
            {brand}
            <span className="text-xs font-mono text-workspace-muted ml-auto">
              {recs.length} 种
            </span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {recs.map(rec => (
              <div key={rec.id} className="flex items-center gap-3 p-2 rounded bg-workspace-bg/50 border border-workspace-border/30">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-mecha-blue/30 to-mecha-orange/30 border border-workspace-border flex items-center justify-center text-[10px] font-mono text-workspace-text">
                  🎨
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm text-workspace-text">{rec.colorName}</span>
                    <span className="font-mono text-xs text-workspace-muted">{rec.colorCode}</span>
                  </div>
                  {rec.isCustomMix && rec.mixRatio && (
                    <div className="text-[10px] font-mono text-mecha-yellow mt-0.5">
                      🧪 {rec.mixRatio}
                    </div>
                  )}
                  {rec.notes && (
                    <div className="text-[10px] text-workspace-muted mt-0.5">
                      {rec.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
