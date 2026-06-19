
import * as modelDB from '@/db/models'
import * as stepDB from '@/db/paintSteps'
import type { Model, PaintStep, FilterOptions, PaintStage, STAGE_ORDER } from '@/types'
import { STAGE_ORDER as STAGE_ORDER_CONST, STATUS_LABELS } from '@/types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

function calculateCompletion(steps: PaintStep[]): number {
  if (steps.length === 0) return 0
  const totalWeight = STAGE_ORDER_CONST.length
  const stageIndexMap = new Map(STAGE_ORDER_CONST.map((s, i) => [s, i]))

  let completedWeight = 0
  for (const step of steps) {
    const idx = stageIndexMap.get(step.stage) ?? 0
    if (step.status === 'completed') {
      completedWeight += (idx + 1) / totalWeight * (1 / STAGE_ORDER_CONST.length) * 100
    } else if (step.status === 'in-progress') {
      completedWeight += (idx + 0.5) / totalWeight * (1 / STAGE_ORDER_CONST.length) * 100
    }
  }

  const stageProgress = calculateStageProgress(steps)
  return Math.min(100, Math.round(stageProgress))
}

function calculateStageProgress(steps: PaintStep[]): number {
  if (steps.length === 0) return 0
  let score = 0
  const maxScore = STAGE_ORDER_CONST.length * 2

  for (let i = 0; i < STAGE_ORDER_CONST.length; i++) {
    const stage = STAGE_ORDER_CONST[i]
    const step = steps.find(s => s.stage === stage)
    if (!step) continue

    switch (step.status) {
      case 'completed':
        score += 2
        break
      case 'in-progress':
        score += 1
        break
      case 'skipped':
        score += 0.5
        break
      default:
        score += 0
    }
  }

  return Math.round((score / maxScore) * 100)
}

function determineStatus(completion: number): Model['status'] {
  if (completion >= 100) return 'completed'
  if (completion > 0) return 'in-progress'
  return 'not-started'
}

export const ModelService = {
  async fetchAll(): Promise<Model[]> {
    return modelDB.getAllModels()
  },

  async fetchById(id: string): Promise<Model | undefined> {
    return modelDB.getModelById(id)
  },

  async create(data: Omit<Model, 'id' | 'createdAt' | 'updatedAt' | 'completion' | 'status'>): Promise<Model> {
    const now = new Date().toISOString()
    const model: Model = {
      ...data,
      id: generateId(),
      completion: 0,
      status: 'not-started',
      createdAt: now,
      updatedAt: now,
    }
    await modelDB.addModel(model)
    return model
  },

  async update(id: string, data: Partial<Model>): Promise<Model | undefined> {
    const existing = await modelDB.getModelById(id)
    if (!existing) return undefined

    const updated = { ...existing, ...data }
    await modelDB.updateModel(updated)
    return updated
  },

  async remove(id: string): Promise<void> {
    return modelDB.deleteModel(id)
  },

  async filterModels(options: FilterOptions): Promise<Model[]> {
    const all = await modelDB.getAllModels()
    return all.filter(m => {
      if (options.search) {
        const q = options.search.toLowerCase()
        const match = m.name.toLowerCase().includes(q) || m.series.toLowerCase().includes(q) || (m.notes ?? '').toLowerCase().includes(q)
        if (!match) return false
      }
      if (options.series && m.series !== options.series) return false
      if (options.status && m.status !== options.status) return false
      if (typeof options.completionMin === 'number' && m.completion < options.completionMin) return false
      if (typeof options.completionMax === 'number' && m.completion > options.completionMax) return false
      return true
    })
  },

  async recalculateCompletion(modelId: string): Promise<Model | undefined> {
    const steps = await stepDB.getStepsWithRecordsByModelId(modelId)
    const completion = calculateCompletion(steps)
    const status = determineStatus(completion)
    return this.update(modelId, {
      completion,
      status,
      finishDate: status === 'completed' ? new Date().toISOString() : undefined,
    })
  },

  async getUniqueSeries(): Promise<string[]> {
    const all = await modelDB.getAllModels()
    return Array.from(new Set(all.map(m => m.series))).sort()
  },

  getNextSuggestedStage(steps: PaintStep[]): PaintStage | null {
    for (const stage of STAGE_ORDER_CONST) {
      const step = steps.find(s => s.stage === stage)
      if (!step || step.status === 'pending') return stage
      if (step.status === 'in-progress') return stage
    }
    return null
  },
}
