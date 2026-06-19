
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Model } from '@/types'
import { ProgressBar, StageBadge, StatusBadge, CompletionRing } from '@/components/common/Badges'
import { STAGE_LABELS, STAGE_ORDER } from '@/types'
import { usePaintStore } from '@/stores/paintStore'
import { useEffect, useMemo, useState } from 'react'
import { ModelService } from '@/services/ModelService'

export default function ModelCard({ model }: { model: Model }) {
  const [steps, setSteps] = useState<any[]>([])
  const fetchSteps = usePaintStore(s => s.fetchSteps)
  const stepsMap = usePaintStore(s => s.stepsByModel)

  useEffect(() => {
    if (stepsMap[model.id]) {
      setSteps(stepsMap[model.id])
    } else {
      fetchSteps(model.id).then(setSteps)
    }
  }, [model.id, stepsMap, fetchSteps])

  const nextStage = useMemo(() => ModelService.getNextSuggestedStage(steps), [steps])

  const currentStage = useMemo(() => {
    const inProgress = steps.find(s => s.status === 'in-progress')
    if (inProgress) return inProgress.stage
    const lastCompleted = [...steps].reverse().find(s => s.status === 'completed')
    if (lastCompleted) {
      const idx = STAGE_ORDER.indexOf(lastCompleted.stage)
      if (idx < STAGE_ORDER.length - 1) return STAGE_ORDER[idx + 1]
      return lastCompleted.stage
    }
    return STAGE_ORDER[0]
  }, [steps])

  return (
    <Link to={`/model/${model.id}`} className="card card-glow p-5 block group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-mecha-blue to-mecha-orange rounded-full blur-3xl" />
      </div>

      <div className="flex items-start gap-4 mb-4 relative">
        <div className="w-14 h-14 rounded-lg bg-workspace-bg border border-workspace-border flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner-groove">
          {model.thumbnail || '🤖'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-semibold text-workspace-text truncate group-hover:text-mecha-blue transition-colors">
              {model.name}
            </h3>
            <StatusBadge status={model.status} />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-workspace-muted flex-wrap">
            <span className="tag border-mecha-blue/30 text-mecha-blue bg-mecha-blue/10">
              {model.series}
            </span>
            <span className="tag border-workspace-border/50 text-workspace-textDim bg-workspace-bg">
              {model.scale}
            </span>
          </div>
        </div>
        <CompletionRing value={model.completion} size={48} />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono text-workspace-muted">总体进度</span>
          <span className="text-xs font-mono font-semibold text-workspace-textDim">{model.completion}%</span>
        </div>
        <ProgressBar value={model.completion} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-workspace-muted">当前阶段</span>
          <StageBadge stage={currentStage} />
        </div>
        {nextStage && model.status !== 'completed' && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-workspace-muted">下一步建议</span>
            <span className="font-mono text-mecha-orange flex items-center gap-1">
              {STAGE_LABELS[nextStage]}
              <ChevronRight size={12} className="animate-pulse" />
            </span>
          </div>
        )}
      </div>

      {model.notes && (
        <div className="mt-4 pt-4 border-t border-workspace-border/50">
          <p className="text-xs text-workspace-textDim line-clamp-2 font-mono leading-relaxed">
            📝 {model.notes}
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 flex items-center justify-between border-t border-workspace-border/50 text-[10px] font-mono text-workspace-muted">
        {model.startDate && <span>开始 {new Date(model.startDate).toLocaleDateString('zh-CN')}</span>}
        <span className="text-mecha-blue/60 group-hover:text-mecha-blue transition-colors flex items-center gap-1">
          查看详情 <ChevronRight size={12} />
        </span>
      </div>
    </Link>
  )
}
