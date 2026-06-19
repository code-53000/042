
import type { StageProgress } from '@/types'
import { STAGE_LABELS } from '@/types'
import { Layers } from 'lucide-react'

interface Props {
  data: StageProgress[]
}

export default function StageProgressBar({ data }: Props) {
  if (data.length === 0) {
    return null
  }

  return (
    <div className="card p-6">
      <h3 className="section-title">
        <Layers size={20} className="text-mecha-blue" />
        涂装阶段进度总览
      </h3>

      <div className="space-y-4">
        {data.map((stage, idx) => {
          const total = Math.max(1, stage.total)
          const completedPct = (stage.completed / total) * 100
          const inProgressPct = (stage.inProgress / total) * 100
          const pendingPct = (stage.pending / total) * 100

          return (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-workspace-muted w-5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium text-workspace-text">
                    {STAGE_LABELS[stage.stage]}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="text-mecha-green">✓ {stage.completed}</span>
                  <span className="text-mecha-orange">⚡ {stage.inProgress}</span>
                  <span className="text-workspace-muted">⏳ {stage.pending}</span>
                </div>
              </div>
              <div className="relative h-6 rounded-md bg-workspace-bg overflow-hidden border border-workspace-border">
                <div className="absolute inset-0 flex">
                  <div
                    className="h-full bg-mecha-green transition-all duration-700 ease-out flex items-center justify-end pr-1"
                    style={{ width: `${completedPct}%`, animation: `fillLeft 0.8s ease-out ${idx * 0.05}s both` }}
                  >
                    {completedPct > 15 && (
                      <span className="text-[9px] font-mono text-workspace-bg font-bold">
                        {Math.round(completedPct)}%
                      </span>
                    )}
                  </div>
                  <div
                    className="h-full bg-mecha-orange transition-all duration-700 ease-out flex items-center justify-center"
                    style={{ width: `${inProgressPct}%`, animation: `fillLeft 0.8s ease-out ${idx * 0.05 + 0.2}s both` }}
                  >
                    {inProgressPct > 10 && (
                      <span className="text-[9px] font-mono text-workspace-bg font-bold">
                        {Math.round(inProgressPct)}%
                      </span>
                    )}
                  </div>
                  <div
                    className="h-full bg-workspace-muted/40 transition-all duration-700 ease-out"
                    style={{ width: `${pendingPct}%`, animation: `fillLeft 0.8s ease-out ${idx * 0.05 + 0.4}s both` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-workspace-border/50 flex items-center justify-center gap-6 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-mecha-green" />
          <span className="text-xs text-workspace-muted">已完成</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-mecha-orange" />
          <span className="text-xs text-workspace-muted">进行中</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-workspace-muted/40" />
          <span className="text-xs text-workspace-muted">待完成</span>
        </div>
      </div>
    </div>
  )
}
