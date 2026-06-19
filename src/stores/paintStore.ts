
import { create } from 'zustand'
import { PaintStepService } from '@/services/PaintStepService'
import type { PaintStep, PaintStage, StepStatus, PaintRecord } from '@/types'
import { useModelStore } from './modelStore'

interface PaintStoreState {
  stepsByModel: Record<string, PaintStep[]>
  loading: boolean
  fetchSteps: (modelId: string) => Promise<PaintStep[]>
  createDefaultSteps: (modelId: string) => Promise<PaintStep[]>
  updateStep: (stepId: string, data: Partial<PaintStep>) => Promise<PaintStep | undefined>
  setStageStatus: (modelId: string, stage: PaintStage, status: StepStatus) => Promise<void>
  addRecord: (stepId: string, record: Omit<PaintRecord, 'id' | 'stepId'>) => Promise<PaintRecord | undefined>
  removeRecord: (recordId: string, stepId: string) => Promise<void>
  toggleStepStatus: (stepId: string, modelId: string) => Promise<void>
}

export const usePaintStore = create<PaintStoreState>((set, get) => ({
  stepsByModel: {},
  loading: false,

  fetchSteps: async (modelId) => {
    const steps = await PaintStepService.fetchByModelId(modelId)
    set(state => ({ stepsByModel: { ...state.stepsByModel, [modelId]: steps } }))
    return steps
  },

  createDefaultSteps: async (modelId) => {
    const steps = await PaintStepService.createDefaultStepsForModel(modelId)
    set(state => ({ stepsByModel: { ...state.stepsByModel, [modelId]: steps } }))
    return steps
  },

  updateStep: async (stepId, data) => {
    const updated = await PaintStepService.updateStep(stepId, data)
    if (updated) {
      const modelId = updated.modelId
      const current = get().stepsByModel[modelId] ?? []
      const next = current.map(s => s.id === stepId ? updated! : s)
      set(state => ({ stepsByModel: { ...state.stepsByModel, [modelId]: next } }))
      await useModelStore.getState().fetchAll()
    }
    return updated
  },

  setStageStatus: async (modelId, stage, status) => {
    await PaintStepService.setStageStatus(modelId, stage, status)
    await get().fetchSteps(modelId)
    await useModelStore.getState().fetchAll()
  },

  addRecord: async (stepId, record) => {
    const result = await PaintStepService.addPaintRecord(stepId, record)
    if (result) {
      const step = await PaintStepService['fetchByModelId'] ? null : null
      const all = Object.entries(get().stepsByModel)
      for (const [mid, steps] of all) {
        if (steps.find(s => s.id === stepId)) {
          await get().fetchSteps(mid)
          break
        }
      }
    }
    return result
  },

  removeRecord: async (recordId, stepId) => {
    await PaintStepService.removePaintRecord(recordId, stepId)
    const all = Object.entries(get().stepsByModel)
    for (const [mid, steps] of all) {
      if (steps.find(s => s.id === stepId)) {
        await get().fetchSteps(mid)
        break
      }
    }
  },

  toggleStepStatus: async (stepId, modelId) => {
    await PaintStepService.toggleStepStatus(stepId)
    await get().fetchSteps(modelId)
    await useModelStore.getState().fetchAll()
  },
}))
