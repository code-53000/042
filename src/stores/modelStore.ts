
import { create } from 'zustand'
import { initDB } from '@/db'
import { ModelService } from '@/services/ModelService'
import type { Model, FilterOptions } from '@/types'

interface ModelStoreState {
  models: Model[]
  loading: boolean
  initialized: boolean
  filters: FilterOptions
  setFilters: (filters: Partial<FilterOptions>) => void
  resetFilters: () => void
  init: () => Promise<void>
  fetchAll: () => Promise<void>
  createModel: (data: Omit<Model, 'id' | 'createdAt' | 'updatedAt' | 'completion' | 'status'>) => Promise<Model>
  updateModel: (id: string, data: Partial<Model>) => Promise<Model | undefined>
  deleteModel: (id: string) => Promise<void>
  refreshCompletion: (modelId: string) => Promise<void>
  getFilteredModels: () => Model[]
}

export const useModelStore = create<ModelStoreState>((set, get) => ({
  models: [],
  loading: false,
  initialized: false,
  filters: {},

  setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: {} }),

  init: async () => {
    if (get().initialized) return
    set({ loading: true })
    try {
      await initDB()
      await get().fetchAll()
      set({ initialized: true })
    } finally {
      set({ loading: false })
    }
  },

  fetchAll: async () => {
    set({ loading: true })
    try {
      const models = await ModelService.fetchAll()
      set({ models })
    } finally {
      set({ loading: false })
    }
  },

  createModel: async (data) => {
    const model = await ModelService.create(data)
    await get().fetchAll()
    return model
  },

  updateModel: async (id, data) => {
    const updated = await ModelService.update(id, data)
    await get().fetchAll()
    return updated
  },

  deleteModel: async (id) => {
    await ModelService.remove(id)
    await get().fetchAll()
  },

  refreshCompletion: async (modelId) => {
    await ModelService.recalculateCompletion(modelId)
    await get().fetchAll()
  },

  getFilteredModels: () => {
    const { models, filters } = get()
    return models.filter(m => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const match = m.name.toLowerCase().includes(q) || m.series.toLowerCase().includes(q) || (m.notes ?? '').toLowerCase().includes(q)
        if (!match) return false
      }
      if (filters.series && m.series !== filters.series) return false
      if (filters.status && m.status !== filters.status) return false
      if (typeof filters.completionMin === 'number' && m.completion < filters.completionMin) return false
      if (typeof filters.completionMax === 'number' && m.completion > filters.completionMax) return false
      return true
    })
  },
}))
