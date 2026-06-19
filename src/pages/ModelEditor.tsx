
import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useModelStore } from '@/stores/modelStore'
import { usePaintStore } from '@/stores/paintStore'
import { useStatsStore } from '@/stores/statsStore'
import { COMMON_SERIES, COMMON_SCALES } from '@/types'
import type { Model } from '@/types'

const EMOJI_OPTIONS = ['🤖', '🛸', '⚔️', '🦄', '🔴', '🎯', '🚀', '⚡', '🛡️', '💎', '🌟', '🔥']

export default function ModelEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== 'new' && !!id

  const models = useModelStore(s => s.models)
  const createModel = useModelStore(s => s.createModel)
  const updateModel = useModelStore(s => s.updateModel)
  const createDefaultSteps = usePaintStore(s => s.createDefaultSteps)
  const refreshStats = useStatsStore(s => s.refresh)
  const init = useModelStore(s => s.init)
  const initialized = useModelStore(s => s.initialized)

  const existing = id ? models.find(m => m.id === id) : undefined

  const [form, setForm] = useState<Partial<Model>>({
    name: '',
    series: COMMON_SERIES[0],
    scale: COMMON_SCALES[1],
    thumbnail: '🤖',
    purchaseDate: '',
    startDate: '',
    finishDate: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    (async () => {
      if (!initialized) await init()
      if (existing) {
        setForm({
          name: existing.name,
          series: existing.series,
          scale: existing.scale,
          thumbnail: existing.thumbnail || '🤖',
          purchaseDate: existing.purchaseDate?.slice(0, 10) || '',
          startDate: existing.startDate?.slice(0, 10) || '',
          finishDate: existing.finishDate?.slice(0, 10) || '',
          notes: existing.notes || '',
        })
      }
    })()
  }, [id, initialized, existing])

  const validate = () => {
    const errs: Record<string, boolean> = {}
    if (!form.name?.trim()) errs.name = true
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      if (isEdit && id) {
        await updateModel(id, {
          name: form.name!,
          series: form.series!,
          scale: form.scale!,
          thumbnail: form.thumbnail,
          purchaseDate: form.purchaseDate ? new Date(form.purchaseDate).toISOString() : undefined,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
          finishDate: form.finishDate ? new Date(form.finishDate).toISOString() : undefined,
          notes: form.notes,
        })
      } else {
        const model = await createModel({
          name: form.name!,
          series: form.series!,
          scale: form.scale!,
          thumbnail: form.thumbnail,
          purchaseDate: form.purchaseDate ? new Date(form.purchaseDate).toISOString() : undefined,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
          finishDate: form.finishDate ? new Date(form.finishDate).toISOString() : undefined,
          notes: form.notes,
        })
        await createDefaultSteps(model.id)
      }
      await refreshStats()
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-workspace-muted hover:text-mecha-blue transition-colors">
        <ArrowLeft size={16} />
        返回总览
      </Link>

      <div className="card p-8">
        <h1 className="text-2xl font-display font-bold text-workspace-text mb-2">
          {isEdit ? '📝 编辑模型档案' : '✨ 新建模型档案'}
        </h1>
        <p className="text-sm text-workspace-muted mb-8">
          记录你的新模型基本信息，后续可以在详情页中添加涂装步骤和漆料记录。
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">
                模型名称 {errors.name && <span className="text-mecha-red">* 必填</span>}
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例如：RX-78-2 高达 Ver.3.0"
                className={`input-field text-base ${errors.name ? 'border-mecha-red/50 focus:border-mecha-red' : ''}`}
              />
            </div>

            <div>
              <label className="label">系列等级</label>
              <select
                value={form.series}
                onChange={(e) => setForm({ ...form, series: e.target.value })}
                className="input-field"
              >
                {COMMON_SERIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">比例</label>
              <select
                value={form.scale}
                onChange={(e) => setForm({ ...form, scale: e.target.value })}
                className="input-field"
              >
                {COMMON_SCALES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">图标</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setForm({ ...form, thumbnail: emoji })}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all border ${
                    form.thumbnail === emoji
                      ? 'bg-mecha-blue/20 border-mecha-blue/50 shadow-glow-blue scale-110'
                      : 'bg-workspace-bg border-workspace-border hover:border-workspace-borderHover'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">购入日期</label>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">开工日期</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">完成日期</label>
              <input
                type="date"
                value={form.finishDate}
                onChange={(e) => setForm({ ...form, finishDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">备注</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="记录这款模型的特点、缩胶情况、制作计划..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div className="divider" />

          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="btn-secondary">
              取消
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50"
            >
              <Save size={16} />
              {submitting ? '保存中...' : isEdit ? '保存修改' : '创建档案'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
