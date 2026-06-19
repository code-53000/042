
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Paintbrush } from 'lucide-react'
import { useModelStore } from '@/stores/modelStore'
import { usePaintStore } from '@/stores/paintStore'
import { useStatsStore } from '@/stores/statsStore'
import ModelInfoCard from '@/components/model/ModelInfoCard'
import PaintTimeline from '@/components/paint/PaintTimeline'
import PaintSummary from '@/components/paint/PaintSummary'
import type { PaintRecord, PaintStep } from '@/types'

export default function ModelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const models = useModelStore(s => s.models)
  const deleteModel = useModelStore(s => s.deleteModel)
  const fetchSteps = usePaintStore(s => s.fetchSteps)
  const stepsByModel = usePaintStore(s => s.stepsByModel)
  const createDefaultSteps = usePaintStore(s => s.createDefaultSteps)
  const refreshStats = useStatsStore(s => s.refresh)
  const init = useModelStore(s => s.init)
  const initialized = useModelStore(s => s.initialized)

  const [loaded, setLoaded] = useState(false)

  const model = useMemo(() => models.find(m => m.id === id), [models, id])
  const steps = useMemo(() => stepsByModel[id ?? ''] ?? [], [stepsByModel, id])

  useEffect(() => {
    (async () => {
      if (!initialized) await init()
      if (id) {
        await fetchSteps(id)
        const s = stepsByModel[id] ?? []
        if (s.length === 0) {
          await createDefaultSteps(id)
        }
      }
      setLoaded(true)
    })()
  }, [id, initialized])

  const allPaintRecords = useMemo<PaintRecord[]>(() => {
    return steps.flatMap(s => s.paintRecords ?? [])
  }, [steps])

  const handleDelete = async () => {
    if (!id) return
    if (confirm(`确定要删除"${model?.name}"吗？所有涂装记录也将被删除，此操作不可恢复。`)) {
      await deleteModel(id)
      await refreshStats()
      navigate('/')
    }
  }

  if (!loaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-12 animate-pulse">
          <div className="h-8 bg-workspace-border/50 rounded w-1/3 mb-6" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-workspace-border/50 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-12 text-center">
          <h2 className="text-xl font-display font-semibold text-mecha-red mb-4">模型不存在</h2>
          <Link to="/" className="btn-secondary">
            <ArrowLeft size={16} /> 返回总览
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-workspace-muted hover:text-mecha-blue transition-colors">
        <ArrowLeft size={16} />
        返回总览
      </Link>

      <ModelInfoCard model={model} onDelete={handleDelete} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="section-title mb-6">
              <Paintbrush size={20} className="text-mecha-orange" />
              涂装步骤时间线
            </h2>
            <PaintTimeline steps={steps as PaintStep[]} modelId={model.id} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="section-title">
              🎨 漆料总览
              <span className="ml-auto text-xs font-mono text-workspace-muted">
                共 {allPaintRecords.length} 种
              </span>
            </h2>
            <PaintSummary records={allPaintRecords} />
          </div>
        </div>
      </div>
    </div>
  )
}
