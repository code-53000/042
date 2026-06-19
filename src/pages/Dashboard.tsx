
import { useEffect, useState } from 'react'
import { useModelStore } from '@/stores/modelStore'
import { useStatsStore } from '@/stores/statsStore'
import { usePaintStore } from '@/stores/paintStore'
import CompletionCards from '@/components/stats/CompletionCards'
import SeriesPieChart from '@/components/stats/SeriesPieChart'
import StageProgressBar from '@/components/stats/StageProgressBar'
import MonthlyTrendChart from '@/components/stats/MonthlyTrendChart'
import { BarChart3, RefreshCw, Scale } from 'lucide-react'
import { ProgressBar } from '@/components/common/Badges'

export default function DashboardPage() {
  const init = useModelStore(s => s.init)
  const initialized = useModelStore(s => s.initialized)
  const completion = useStatsStore(s => s.completion)
  const series = useStatsStore(s => s.series)
  const stages = useStatsStore(s => s.stages)
  const monthly = useStatsStore(s => s.monthly)
  const scaleStats = useStatsStore(s => s.scaleStats)
  const loading = useStatsStore(s => s.loading)
  const loadAll = useStatsStore(s => s.loadAll)
  const createDefaultSteps = usePaintStore(s => s.createDefaultSteps)
  const models = useModelStore(s => s.models)

  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    (async () => {
      if (!initialized) await init()
      for (const m of models) {
        await createDefaultSteps(m.id)
      }
      await loadAll()
    })()
  }, [initialized])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadAll()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-workspace-text flex items-center gap-3">
            <BarChart3 size={28} className="text-mecha-purple" />
            涂装统计仪表盘
          </h1>
          <p className="text-sm text-workspace-muted mt-1">
            追踪你的模型制作进度，一目了然掌握整体情况
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          刷新数据
        </button>
      </div>

      {completion && <CompletionCards stats={completion} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeriesPieChart data={series} />

        {scaleStats.length > 0 && (
          <div className="card p-6">
            <h3 className="section-title">
              <Scale size={20} className="text-mecha-green" />
              比例平均完成度
            </h3>
            <div className="space-y-4">
              {scaleStats.map((s, i) => (
                <div key={s.scale} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-workspace-text">{s.scale}</span>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="text-workspace-muted">{s.count} 台</span>
                      <span className="text-mecha-blue font-bold">{s.avg}%</span>
                    </div>
                  </div>
                  <ProgressBar value={s.avg} size="lg" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <StageProgressBar data={stages} />

      <MonthlyTrendChart data={monthly} />

      <style>{`
        @keyframes pieReveal {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes barReveal {
          from { width: 0%; }
        }
        @keyframes fillLeft {
          from { width: 0% !important; }
        }
        @keyframes growUp {
          from { height: 0% !important; }
        }
      `}</style>
    </div>
  )
}
