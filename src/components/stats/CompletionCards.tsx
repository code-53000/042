
import type { CompletionStats } from '@/types'
import { Check, Clock, Package, Award } from 'lucide-react'
import { CompletionRing } from '@/components/common/Badges'

export default function CompletionCards({ stats }: { stats: CompletionStats }) {
  const cards = [
    {
      label: '总模型数',
      value: stats.total,
      icon: Package,
      color: 'from-mecha-blue/20 to-mecha-blue/5',
      border: 'border-mecha-blue/30',
      iconBg: 'bg-mecha-blue/20 text-mecha-blue',
      textColor: 'text-mecha-blue',
    },
    {
      label: '已完成',
      value: stats.completed,
      icon: Check,
      color: 'from-mecha-green/20 to-mecha-green/5',
      border: 'border-mecha-green/30',
      iconBg: 'bg-mecha-green/20 text-mecha-green',
      textColor: 'text-mecha-green',
    },
    {
      label: '进行中',
      value: stats.inProgress,
      icon: Clock,
      color: 'from-mecha-orange/20 to-mecha-orange/5',
      border: 'border-mecha-orange/30',
      iconBg: 'bg-mecha-orange/20 text-mecha-orange',
      textColor: 'text-mecha-orange',
    },
    {
      label: '待开始',
      value: stats.notStarted,
      icon: Award,
      color: 'from-workspace-muted/20 to-workspace-muted/5',
      border: 'border-workspace-muted/30',
      iconBg: 'bg-workspace-muted/20 text-workspace-muted',
      textColor: 'text-workspace-muted',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`card p-5 relative overflow-hidden bg-gradient-to-br ${c.color} border ${c.border}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center shadow-inner-groove`}>
              <c.icon size={20} />
            </div>
          </div>
          <div className={`text-3xl font-display font-bold ${c.textColor} mb-1`}>
            {c.value}
          </div>
          <div className="text-xs text-workspace-muted font-medium">{c.label}</div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 opacity-5 rounded-full bg-gradient-to-br from-white to-transparent" />
        </div>
      ))}

      <div className="card p-5 flex items-center justify-center">
        <div className="text-center">
          <CompletionRing value={stats.completionRate} size={72} />
          <div className="text-xs text-workspace-muted mt-2 font-medium">整体完成率</div>
        </div>
      </div>
    </div>
  )
}
