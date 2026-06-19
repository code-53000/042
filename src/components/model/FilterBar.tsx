
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { FilterOptions, ModelStatus, PaintStage } from '@/types'
import { STAGE_LABELS, STATUS_LABELS, COMMON_SERIES } from '@/types'
import { useState } from 'react'

interface Props {
  filters: FilterOptions
  onChange: (filters: Partial<FilterOptions>) => void
  onReset: () => void
  uniqueSeries: string[]
}

export default function FilterBar({ filters, onChange, onReset, uniqueSeries }: Props) {
  const [showMore, setShowMore] = useState(false)

  const hasActiveFilters = filters.series || filters.status || filters.stage || filters.search ||
    typeof filters.completionMin === 'number' || typeof filters.completionMax === 'number'

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-mecha-blue" />
          <h3 className="font-display font-semibold text-workspace-text">筛选条件</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-workspace-muted hover:text-mecha-orange flex items-center gap-1 transition-colors"
          >
            <X size={14} /> 清除全部
          </button>
        )}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-workspace-muted" />
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="搜索模型名称、系列、备注..."
          className="input-field pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="label">系列</label>
          <select
            value={filters.series || ''}
            onChange={(e) => onChange({ series: e.target.value || undefined })}
            className="input-field"
          >
            <option value="">全部系列</option>
            {(uniqueSeries.length > 0 ? uniqueSeries : COMMON_SERIES).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">模型状态</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onChange({ status: (e.target.value as ModelStatus) || undefined })}
            className="input-field"
          >
            <option value="">全部状态</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">当前阶段</label>
          <select
            value={filters.stage || ''}
            onChange={(e) => onChange({ stage: (e.target.value as PaintStage) || undefined })}
            className="input-field"
          >
            <option value="">全部阶段</option>
            {Object.entries(STAGE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setShowMore(!showMore)}
        className="text-xs text-mecha-blue hover:text-mecha-blueHover transition-colors font-mono"
      >
        {showMore ? '▲ 收起高级筛选' : '▼ 展开完成度筛选'}
      </button>

      {showMore && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-workspace-border/50">
          <div>
            <label className="label">完成度 ≥ (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={filters.completionMin ?? ''}
              onChange={(e) => onChange({ completionMin: e.target.value ? Number(e.target.value) : undefined })}
              className="input-field"
              placeholder="0"
            />
          </div>
          <div>
            <label className="label">完成度 ≤ (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={filters.completionMax ?? ''}
              onChange={(e) => onChange({ completionMax: e.target.value ? Number(e.target.value) : undefined })}
              className="input-field"
              placeholder="100"
            />
          </div>
        </div>
      )}
    </div>
  )
}
