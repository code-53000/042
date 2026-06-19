
import { useEffect, useMemo, useState } from 'react'
import { useModelStore } from '@/stores/modelStore'
import { usePaintStore } from '@/stores/paintStore'
import { useStatsStore } from '@/stores/statsStore'
import FilterBar from '@/components/model/FilterBar'
import ModelCard from '@/components/model/ModelCard'
import CompletionCards from '@/components/stats/CompletionCards'
import { PackageOpen, Plus, Box } from 'lucide-react'
import { Link } from 'react-router-dom'
import { importSampleData } from '@/utils/sampleData'

export default function OverviewPage() {
  const init = useModelStore(s => s.init)
  const loading = useModelStore(s => s.loading)
  const models = useModelStore(s => s.models)
  const filters = useModelStore(s => s.filters)
  const setFilters = useModelStore(s => s.setFilters)
  const resetFilters = useModelStore(s => s.resetFilters)
  const getFilteredModels = useModelStore(s => s.getFilteredModels)
  const completion = useStatsStore(s => s.completion)
  const loadStats = useStatsStore(s => s.loadAll)
  const fetchAll = useModelStore(s => s.fetchAll)
  const refreshStats = useStatsStore(s => s.refresh)
  const createDefaultSteps = usePaintStore(s => s.createDefaultSteps)

  const [dataImported, setDataImported] = useState(false)

  useEffect(() => {
    (async () => {
      await init()
      await loadStats()
      if (models.length === 0) {
        setDataImported(true)
      }
      for (const m of models) {
        await createDefaultSteps(m.id)
      }
    })()
  }, [])

  const filtered = useMemo(() => getFilteredModels(), [models, filters])

  const uniqueSeries = useMemo(() => {
    return Array.from(new Set(models.map(m => m.series))).sort()
  }, [models])

  const handleImportSample = async () => {
    await importSampleData()
    await Promise.all([fetchAll(), refreshStats()])
    const all = useModelStore.getState().models
    for (const m of all) {
      await createDefaultSteps(m.id)
    }
  }

  const emptyState = models.length === 0

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {completion && <CompletionCards stats={completion} />}

      {emptyState && (
        <div className="card p-12 text-center border-mecha-blue/20 bg-mecha-blue/5">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-mecha-blue/30 to-mecha-orange/30 flex items-center justify-center animate-float">
            <PackageOpen size={40} className="text-mecha-blue" />
          </div>
          <h2 className="text-2xl font-display font-bold text-workspace-text mb-3">
            欢迎来到你的涂装工作台
          </h2>
          <p className="text-workspace-muted mb-8 max-w-md mx-auto">
            开始记录你的模型涂装进度吧！你可以导入示例数据快速体验，或者从零开始创建第一个模型档案。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={handleImportSample} className="btn-primary">
              <Box size={16} /> 导入示例数据
            </button>
            <Link to="/model/new" className="btn-orange">
              <Plus size={16} /> 创建第一个模型
            </Link>
          </div>
        </div>
      )}

      {!emptyState && (
        <>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            uniqueSeries={uniqueSeries}
          />

          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-workspace-text flex items-center gap-2">
              <Box size={20} className="text-mecha-blue" />
              模型列表
              <span className="text-sm font-mono text-workspace-muted">
                ({filtered.length} / {models.length})
              </span>
            </h2>
            <Link to="/model/new" className="btn-primary">
              <Plus size={16} /> 新建模型
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="flex gap-4 mb-4">
                    <div className="w-14 h-14 rounded-lg bg-workspace-border/50" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-workspace-border/50 rounded" />
                      <div className="h-3 w-1/2 bg-workspace-border/50 rounded" />
                    </div>
                  </div>
                  <div className="h-2 bg-workspace-border/50 rounded-full mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-workspace-border/40 rounded" />
                    <div className="h-3 w-2/3 bg-workspace-border/40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(model => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <PackageOpen size={48} className="mx-auto mb-4 text-workspace-muted opacity-50" />
              <p className="text-workspace-muted">没有匹配的模型，试试调整筛选条件</p>
              <button onClick={resetFilters} className="btn-secondary mt-4">
                清除筛选
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
