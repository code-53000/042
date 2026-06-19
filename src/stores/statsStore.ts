
import { create } from 'zustand'
import { StatsService } from '@/services/StatsService'
import type { CompletionStats, SeriesStat, StageProgress, MonthlyStat } from '@/types'

interface StatsStoreState {
  completion: CompletionStats | null
  series: SeriesStat[]
  stages: StageProgress[]
  monthly: MonthlyStat[]
  scaleStats: { scale: string; avg: number; count: number }[]
  loading: boolean
  loadAll: () => Promise<void>
  refresh: () => Promise<void>
}

export const useStatsStore = create<StatsStoreState>((set) => ({
  completion: null,
  series: [],
  stages: [],
  monthly: [],
  scaleStats: [],
  loading: false,

  loadAll: async () => {
    set({ loading: true })
    try {
      const [c, s, st, m, sc] = await Promise.all([
        StatsService.getCompletionStats(),
        StatsService.getSeriesStats(),
        StatsService.getStageProgress(),
        StatsService.getMonthlyStats(),
        StatsService.getAverageCompletionByScale(),
      ])
      set({ completion: c, series: s, stages: st, monthly: m, scaleStats: sc })
    } finally {
      set({ loading: false })
    }
  },

  refresh: async () => {
    await useStatsStore.getState().loadAll()
  },
}))
