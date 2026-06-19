
import type { PaintStage, StepStatus, ModelStatus } from '@/types'
import { STAGE_LABELS, STEP_STATUS_LABELS, STATUS_LABELS } from '@/types'

export function StageBadge({ stage }: { stage: PaintStage }) {
  const colors: Record<PaintStage, string> = {
    assembly: 'bg-mecha-blue/15 text-mecha-blue border-mecha-blue/30',
    sanding: 'bg-workspace-muted/15 text-workspace-textDim border-workspace-muted/30',
    primer: 'bg-mecha-purple/15 text-mecha-purple border-mecha-purple/30',
    basecoat: 'bg-mecha-green/15 text-mecha-green border-mecha-green/30',
    detail: 'bg-mecha-yellow/15 text-mecha-yellow border-mecha-yellow/30',
    weathering: 'bg-mecha-orange/15 text-mecha-orange border-mecha-orange/30',
    decals: 'bg-mecha-blue/15 text-mecha-blue border-mecha-blue/30',
    topcoat: 'bg-mecha-green/15 text-mecha-green border-mecha-green/30',
    finished: 'bg-mecha-green/20 text-mecha-green border-mecha-green/40',
  }
  return (
    <span className={`tag ${colors[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  )
}

export function StatusBadge({ status }: { status: ModelStatus }) {
  const colors: Record<ModelStatus, string> = {
    'not-started': 'bg-workspace-muted/15 text-workspace-muted border-workspace-muted/30',
    'in-progress': 'bg-mecha-orange/15 text-mecha-orange border-mecha-orange/30',
    completed: 'bg-mecha-green/15 text-mecha-green border-mecha-green/30',
  }
  return (
    <span className={`badge ${colors[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

export function StepStatusBadge({ status }: { status: StepStatus }) {
  const colors: Record<StepStatus, string> = {
    pending: 'bg-workspace-muted/10 text-workspace-muted border-workspace-muted/20',
    'in-progress': 'bg-mecha-orange/20 text-mecha-orange border-mecha-orange/40',
    completed: 'bg-mecha-green/20 text-mecha-green border-mecha-green/40',
    skipped: 'bg-workspace-muted/10 text-workspace-textDim border-workspace-muted/20 line-through',
  }
  return (
    <span className={`badge ${colors[status]}`}>
      {STEP_STATUS_LABELS[status]}
    </span>
  )
}

export function ProgressBar({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' }
  const clamped = Math.max(0, Math.min(100, value))
  const gradient = clamped >= 100
    ? 'from-mecha-green to-mecha-green/60'
    : clamped >= 60
      ? 'from-mecha-blue to-mecha-blue/60'
      : clamped >= 30
        ? 'from-mecha-orange to-mecha-orange/60'
        : 'from-workspace-muted to-workspace-muted/60'

  return (
    <div className={`progress-track ${heights[size]}`}>
      <div
        className={`progress-fill bg-gradient-to-r ${gradient}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export function CompletionRing({ value, size = 64 }: { value: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  const strokeWidth = size > 48 ? 6 : 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference

  const color = clamped >= 100 ? '#4ade80' : clamped >= 60 ? '#4f8cff' : clamped >= 30 ? '#ff8c42' : '#8a8a95'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#26262e"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold" style={{ fontSize: size * 0.22, color }}>
          {clamped}%
        </span>
      </div>
    </div>
  )
}
