
import { ModelService } from './ModelService'
import { PaintStepService } from './PaintStepService'
import type {
  CompletionStats,
  SeriesStat,
  StageProgress,
  MonthlyStat,
  PaintStage,
  Model,
  PaintStep,
} from '@/types'
import { STAGE_ORDER, STAGE_LABELS } from '@/types'

export const StatsService = {
  async getCompletionStats(): Promise<CompletionStats> {
    const models = await ModelService.fetchAll()
    const total = models.length
    const completed = models.filter(m => m.status === 'completed').length
    const inProgress = models.filter(m => m.status === 'in-progress').length
    const notStarted = models.filter(m => m.status === 'not-started').length
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100)

    return { total, completed, inProgress, notStarted, completionRate }
  },

  async getSeriesStats(): Promise<SeriesStat[]> {
    const models = await ModelService.fetchAll()
    const total = models.length
    if (total === 0) return []

    const map = new Map<string, { count: number; completed: number }>()
    for (const m of models) {
      const entry = map.get(m.series) ?? { count: 0, completed: 0 }
      entry.count++
      if (m.status === 'completed') entry.completed++
      map.set(m.series, entry)
    }

    const result: SeriesStat[] = []
    for (const [series, data] of map.entries()) {
      result.push({
        series,
        count: data.count,
        completed: data.completed,
        percentage: Math.round((data.count / total) * 100),
      })
    }

    return result.sort((a, b) => b.count - a.count)
  },

  async getStageProgress(): Promise<StageProgress[]> {
    const models = await ModelService.fetchAll()
    const allSteps: PaintStep[] = []

    for (const m of models) {
      const steps = await PaintStepService.fetchByModelId(m.id)
      allSteps.push(...steps)
    }

    const result: StageProgress[] = []
    for (const stage of STAGE_ORDER) {
      const stageSteps = allSteps.filter(s => s.stage === stage)
      result.push({
        stage,
        total: models.length,
        completed: stageSteps.filter(s => s.status === 'completed').length,
        inProgress: stageSteps.filter(s => s.status === 'in-progress').length,
        pending: stageSteps.filter(s => s.status === 'pending' || s.status === 'skipped').length,
      })
    }

    return result
  },

  async getMonthlyStats(months: number = 6): Promise<MonthlyStat[]> {
    const models = await ModelService.fetchAll()
    const result: MonthlyStat[] = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      result.push({ month: monthStr, started: 0, finished: 0 })
    }

    for (const m of models) {
      if (m.startDate) {
        const d = new Date(m.startDate)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const entry = result.find(r => r.month === key)
        if (entry) entry.started++
      }
      if (m.finishDate) {
        const d = new Date(m.finishDate)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const entry = result.find(r => r.month === key)
        if (entry) entry.finished++
      }
    }

    return result
  },

  async getAverageCompletionByScale(): Promise<{ scale: string; avg: number; count: number }[]> {
    const models = await ModelService.fetchAll()
    if (models.length === 0) return []

    const map = new Map<string, { total: number; count: number }>()
    for (const m of models) {
      const entry = map.get(m.scale) ?? { total: 0, count: 0 }
      entry.total += m.completion
      entry.count++
      map.set(m.scale, entry)
    }

    const result: { scale: string; avg: number; count: number }[] = []
    for (const [scale, data] of map.entries()) {
      result.push({
        scale,
        avg: Math.round(data.total / data.count),
        count: data.count,
      })
    }

    return result.sort((a, b) => b.count - a.count)
  },

  getNextActionSuggestions(models: Model[], stepsMap: Map<string, PaintStep[]>): {
    model: Model
    nextStage: PaintStage | null
    urgency: 'high' | 'medium' | 'low'
  }[] {
    const suggestions: { model: Model; nextStage: PaintStage | null; urgency: 'high' | 'medium' | 'low' }[] = []

    for (const model of models) {
      if (model.status === 'completed') continue

      const steps = stepsMap.get(model.id) ?? []
      const nextStage = ModelService.getNextSuggestedStage(steps)

      let urgency: 'high' | 'medium' | 'low' = 'low'
      if (model.status === 'in-progress') {
        const inProgressStep = steps.find(s => s.status === 'in-progress')
        urgency = inProgressStep ? 'high' : 'medium'
      }

      suggestions.push({ model, nextStage, urgency })
    }

    return suggestions.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.urgency] - order[b.urgency]
    })
  },
}
