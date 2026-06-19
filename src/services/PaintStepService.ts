
import * as stepDB from '@/db/paintSteps'
import { ModelService } from './ModelService'
import type { PaintStep, PaintRecord, PaintStage, StepStatus } from '@/types'
import { STAGE_ORDER } from '@/types'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export const PaintStepService = {
  async fetchByModelId(modelId: string): Promise<PaintStep[]> {
    const steps = await stepDB.getStepsWithRecordsByModelId(modelId)
    return steps.sort((a, b) => {
      const ai = STAGE_ORDER.indexOf(a.stage)
      const bi = STAGE_ORDER.indexOf(b.stage)
      return ai - bi
    })
  },

  async createDefaultStepsForModel(modelId: string): Promise<PaintStep[]> {
    const existing = await this.fetchByModelId(modelId)
    if (existing.length > 0) return existing

    const created: PaintStep[] = []
    for (const stage of STAGE_ORDER) {
      const step: PaintStep = {
        id: generateId(),
        modelId,
        stage,
        status: stage === 'assembly' ? 'in-progress' : 'pending',
        paintRecords: [],
      }
      await stepDB.addStep(step)
      created.push(step)
    }

    return created
  },

  async updateStep(id: string, data: Partial<PaintStep>): Promise<PaintStep | undefined> {
    const existing = await stepDB.getStepById(id)
    if (!existing) return undefined

    const updated: PaintStep = { ...existing, ...data }
    await stepDB.updateStep(updated)

    if (data.status !== undefined) {
      await ModelService.recalculateCompletion(existing.modelId)
    }

    return updated
  },

  async setStageStatus(modelId: string, stage: PaintStage, status: StepStatus): Promise<void> {
    const steps = await this.fetchByModelId(modelId)
    let step = steps.find(s => s.stage === stage)

    if (!step) {
      step = {
        id: generateId(),
        modelId,
        stage,
        status: 'pending',
        paintRecords: [],
      }
      await stepDB.addStep(step)
    }

    await stepDB.updateStep({ ...step, status })
    await ModelService.recalculateCompletion(modelId)
  },

  async addPaintRecord(stepId: string, record: Omit<PaintRecord, 'id' | 'stepId'>): Promise<PaintRecord | undefined> {
    const step = await stepDB.getStepById(stepId)
    if (!step) return undefined

    const newRecord: PaintRecord = {
      ...record,
      id: generateId(),
      stepId,
    }

    const existingRecords = await stepDB.getRecordsByStepId(stepId)
    const updatedStep: PaintStep = {
      ...step,
      paintRecords: [...existingRecords, newRecord],
    }

    await stepDB.updateStep(updatedStep)
    return newRecord
  },

  async removePaintRecord(recordId: string, stepId: string): Promise<void> {
    const step = await stepDB.getStepById(stepId)
    if (!step) return

    const existingRecords = await stepDB.getRecordsByStepId(stepId)
    const filtered = existingRecords.filter(r => r.id !== recordId)

    await stepDB.updateStep({ ...step, paintRecords: filtered })
  },

  async updateStepDescription(stepId: string, description: string, date?: string): Promise<PaintStep | undefined> {
    return this.updateStep(stepId, { description, date })
  },

  async toggleStepStatus(stepId: string): Promise<PaintStep | undefined> {
    const step = await stepDB.getStepById(stepId)
    if (!step) return undefined

    const cycle: StepStatus[] = ['pending', 'in-progress', 'completed', 'skipped']
    const currentIdx = cycle.indexOf(step.status)
    const nextStatus = cycle[(currentIdx + 1) % cycle.length]

    return this.updateStep(stepId, { status: nextStatus })
  },
}
