
import type { Model } from '@/types'
import { Calendar, Scale, Hash, StickyNote } from 'lucide-react'
import { StatusBadge, CompletionRing } from '@/components/common/Badges'
import { Link } from 'react-router-dom'
import { Edit3 } from 'lucide-react'

interface Props {
  model: Model
  onDelete?: () => void
}

export default function ModelInfoCard({ model, onDelete }: Props) {
  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('zh-CN') : '—'

  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-bl from-mecha-orange to-mecha-blue rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col md:flex-row gap-6">
        <div className="flex items-center gap-5 shrink-0">
          <div className="w-24 h-24 rounded-xl bg-workspace-bg border-2 border-workspace-border flex items-center justify-center text-5xl shadow-inner-groove">
            {model.thumbnail || '🤖'}
          </div>
          <CompletionRing value={model.completion} size={80} />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-workspace-text mb-2">
                {model.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="tag border-mecha-blue/40 text-mecha-blue bg-mecha-blue/10 font-mono text-sm px-3 py-1">
                  {model.series}
                </span>
                <span className="tag border-workspace-border text-workspace-textDim bg-workspace-bg font-mono text-sm px-3 py-1">
                  {model.scale}
                </span>
                <StatusBadge status={model.status} />
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/model/${model.id}/edit`} className="btn-secondary">
                <Edit3 size={16} />
                编辑档案
              </Link>
              {onDelete && (
                <button onClick={onDelete} className="btn-danger">
                  🗑️ 删除
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-workspace-border/50">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-workspace-muted shrink-0" />
              <div>
                <div className="text-[10px] text-workspace-muted uppercase tracking-wider">购入日期</div>
                <div className="font-mono text-sm text-workspace-text">{fmt(model.purchaseDate)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-mecha-orange shrink-0" />
              <div>
                <div className="text-[10px] text-workspace-muted uppercase tracking-wider">开工日期</div>
                <div className="font-mono text-sm text-workspace-text">{fmt(model.startDate)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-mecha-green shrink-0" />
              <div>
                <div className="text-[10px] text-workspace-muted uppercase tracking-wider">完成日期</div>
                <div className="font-mono text-sm text-workspace-text">{fmt(model.finishDate)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-mecha-purple shrink-0" />
              <div>
                <div className="text-[10px] text-workspace-muted uppercase tracking-wider">档案编号</div>
                <div className="font-mono text-sm text-workspace-text truncate" title={model.id}>
                  {model.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {model.notes && (
            <div className="pt-4 border-t border-workspace-border/50">
              <div className="flex items-start gap-2">
                <StickyNote size={16} className="text-mecha-yellow mt-0.5 shrink-0" />
                <div>
                  <div className="text-[10px] text-workspace-muted uppercase tracking-wider mb-1">备注</div>
                  <p className="text-sm text-workspace-textDim leading-relaxed font-mono">
                    {model.notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
