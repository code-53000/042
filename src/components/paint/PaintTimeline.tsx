
import { Check, Clock, SkipForward, CircleDot, ChevronDown, ChevronUp, Paintbrush, Palette, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { PaintStep, StepStatus, PaintRecord } from '@/types'
import { STAGE_LABELS } from '@/types'
import { StepStatusBadge } from '@/components/common/Badges'
import { PAINT_BRANDS } from '@/types'
import { usePaintStore } from '@/stores/paintStore'

interface Props {
  steps: PaintStep[]
  modelId: string
}

export default function PaintTimeline({ steps, modelId }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(steps.find(s => s.status === 'in-progress')?.id ?? steps[0]?.id ?? null)
  const [editingRecords, setEditingRecords] = useState<Record<string, boolean>>({})
  const toggleStepStatus = usePaintStore(s => s.toggleStepStatus)
  const updateStep = usePaintStore(s => s.updateStep)
  const addRecord = usePaintStore(s => s.addRecord)
  const removeRecord = usePaintStore(s => s.removeRecord)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const statusColors: Record<StepStatus, { dot: string; line: string; glow: string }> = {
    completed: { dot: 'bg-mecha-green border-mecha-green shadow-glow-orange', line: 'bg-mecha-green', glow: 'shadow-[0_0_12px_rgba(74,222,128,0.5)' },
    'in-progress': { dot: 'bg-mecha-orange border-mecha-orange animate-pulse', line: 'bg-mecha-orange', glow: 'shadow-[0_0_12px_rgba(255,140,66,0.5)' },
    pending: { dot: 'bg-workspace-bg border-workspace-border', line: 'bg-workspace-border', glow: '' },
    skipped: { dot: 'bg-workspace-muted border-workspace-muted', line: 'bg-workspace-border', glow: '' },
  }

  const statusIcons: Record<StepStatus, any> = {
    completed: Check,
    'in-progress': CircleDot,
    pending: null,
    skipped: SkipForward,
  }

  return (
    <div className="relative pl-2">
      <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-workspace-border" />

      {steps.map((step, idx) => {
        const color = statusColors[step.status]
        const Icon = statusIcons[step.status]
        const isExpanded = expandedId === step.id
        const isEditing = editingRecords[step.id]

        return (
          <div key={step.id} className="relative mb-4 last:mb-0">
            <div className={`absolute left-3 z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${color.dot} ${color.glow} ${step.status === 'completed' ? 'text-workspace-bg' : 'text-transparent'}`}>
              {Icon && step.status === 'completed' ? <Icon size={12} /> : null}
            </div>

            <div className="ml-12">
              <div
                className={`card p-4 cursor-pointer group transition-all ${step.status === 'completed' ? 'opacity-90' : ''}`}
                onClick={() => toggleExpand(step.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-semibold text-workspace-text">
                        {idx + 1}. {STAGE_LABELS[step.stage]}
                      </span>
                      <StepStatusBadge status={step.status} />
                    </div>
                    {step.description && !isExpanded && (
                      <p className="text-xs text-workspace-textDim font-mono truncate max-w-md">
                        {step.description}
                      </p>
                    )}
                    {step.paintRecords?.length > 0 && !isExpanded && (
                      <div className="flex items-center gap-1 mt-2">
                        <Palette size={12} className="text-mecha-purple" />
                        <span className="text-[10px] font-mono text-workspace-muted">
                          {step.paintRecords.length} 种漆料
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStepStatus(step.id, modelId) }}
                      className="text-xs text-workspace-muted hover:text-mecha-blue opacity-0 group-hover:opacity-100 transition-all px-2 py-1 rounded hover:bg-workspace-border/50"
                      title="切换状态"
                    >
                      <Clock size={14} className="inline mr-1" />
                      切换
                    </button>
                    {isExpanded ? <ChevronUp size={18} className="text-workspace-muted" /> : <ChevronDown size={18} className="text-workspace-muted" />}
                  </div>
                </div>
                {step.date && (
                  <div className="mt-2 text-[10px font-mono text-workspace-muted">
                    📅 {new Date(step.date).toLocaleDateString('zh-CN')}
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="mt-3 p-4 bg-workspace-bg/50 rounded-lg border border-workspace-border/50 space-y-4">
                  <div>
                    <label className="label">步骤说明</label>
                    <textarea
                      value={step.description || ''}
                      onChange={(e) => updateStep(step.id, { description: e.target.value })}
                      onBlur={(e) => {
                        if (e.target.value !== step.description) {
                          updateStep(step.id, { description: e.target.value })
                        }
                      }}
                      placeholder="记录这一步做了什么... 耗时、遇到的问题..."
                      className="input-field min-h-[80px] resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Paintbrush size={16} className="text-mecha-purple" />
                        <span className="text-sm font-display font-medium">漆料记录</span>
                      </div>
                      <button
                        onClick={() => setEditingRecords({ ...editingRecords, [step.id]: !isEditing })}
                        className="text-xs btn-secondary !py-1 !px-3"
                      >
                        <Plus size={12} /> 添加漆料
                      </button>
                    </div>

                    {step.paintRecords?.length > 0 ? (
                      <div className="space-y-2">
                        {step.paintRecords.map(rec => (
                        <div key={rec.id} className="card !bg-workspace-card p-3 flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono text-mecha-blue">{rec.brand}</span>
                              <span className="text-xs font-mono text-workspace-muted">
                                {rec.colorCode}</span>
                              <span className="text-xs font-medium text-workspace-text font-mono">{rec.colorName}</span>
                              {rec.isCustomMix && (
                                <span className="tag border-mecha-orange/30 bg-mecha-orange/10 text-mecha-orange text-[10px]">
                                  🎨 调色
                                </span>
                              )}
                            </div>
                            {rec.mixRatio && (
                              <div className="text-[10px] font-mono text-mecha-yellow">
                                🧪 {rec.mixRatio}
                              </div>
                            )}
                            {rec.notes && (
                              <div className="text-[10px] font-mono text-workspace-muted">
                                💡 {rec.notes}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeRecord(rec.id, step.id)}
                            className="text-workspace-muted hover:text-mecha-red transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-workspace-muted text-xs">
                        暂无漆料记录，点击"添加漆料"开始记录
                      </div>
                    )}

                    {isEditing && (
                      <AddRecordForm
                        onAdd={(rec) => addRecord(step.id, rec).then(() => {
                          setEditingRecords({ ...editingRecords, [step.id]: false })
                        })}
                        onCancel={() => setEditingRecords({ ...editingRecords, [step.id]: false })}
                      />
                    )}
                  </div>

                  <div>
                    <label className="label">完成日期</label>
                    <input
                      type="date"
                      value={step.date ? step.date.slice(0, 10) : ''}
                      onChange={(e) => updateStep(step.id, { date: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AddRecordForm({ onAdd, onCancel }: { onAdd: (r: Omit<PaintRecord, 'id' | 'stepId'>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    brand: PAINT_BRANDS[0], colorCode: '', colorName: '', isCustomMix: false, mixRatio: '', notes: '' })
  const [errors, setErrors] = useState<any>({})

  const submit = () => {
    if (!form.colorCode || !form.colorName) {
      setErrors({ colorCode: !form.colorCode, colorName: !form.colorName })
      return
    }
    onAdd({
      brand: form.brand,
      colorCode: form.colorCode,
      colorName: form.colorName,
      isCustomMix: form.isCustomMix,
      mixRatio: form.mixRatio || undefined,
      notes: form.notes || undefined,
    })
  }

  return (
    <div className="mt-3 p-4 rounded-lg border border-mecha-blue/20 bg-mecha-blue/5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">品牌</label>
          <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field">
            {PAINT_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="label">色号 {errors.colorCode && <span className="text-mecha-red">*</span>}</label>
          <input type="text" value={form.colorCode} onChange={(e) => setForm({ ...form, colorCode: e.target.value })} placeholder="GX-2 / GA-030" className="input-field" />
        </div>
      </div>
      <div>
        <label className="label">颜色名称 {errors.colorName && <span className="text-mecha-red">*</span>}</label>
        <input type="text" value={form.colorName} onChange={(e) => setForm({ ...form, colorName: e.target.value })} placeholder="高达蓝 / 光泽白" className="input-field" />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isCustomMix} onChange={(e) => setForm({ ...form, isCustomMix: e.target.checked })} className="w-4 h-4 accent-mecha-blue" />
          <span className="text-sm text-workspace-text">自定义调色</span>
        </label>
      </div>
      {form.isCustomMix && (
        <div>
          <label className="label">调色比例</label>
          <input type="text" value={form.mixRatio} onChange={(e) => setForm({ ...form, mixRatio: e.target.value })} placeholder="GA-030 + GA-020 3:1" className="input-field" />
        </div>
      )}
      <div>
        <label className="label">备注</label>
        <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="加一点白提高明度..." className="input-field" />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="btn-secondary">取消</button>
        <button onClick={submit} className="btn-primary">添加</button>
      </div>
    </div>
  )
}
