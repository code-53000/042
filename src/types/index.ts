
export type PaintStage =
  | 'assembly'
  | 'sanding'
  | 'primer'
  | 'basecoat'
  | 'detail'
  | 'weathering'
  | 'decals'
  | 'topcoat'
  | 'finished'

export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'skipped'

export type ModelStatus = 'not-started' | 'in-progress' | 'completed'

export interface PaintRecord {
  id: string
  stepId: string
  brand: string
  colorCode: string
  colorName: string
  isCustomMix: boolean
  mixRatio?: string
  notes?: string
}

export interface PaintStep {
  id: string
  modelId: string
  stage: PaintStage
  status: StepStatus
  description?: string
  date?: string
  photos?: string[]
  paintRecords: PaintRecord[]
}

export interface Model {
  id: string
  name: string
  series: string
  scale: string
  status: ModelStatus
  completion: number
  purchaseDate?: string
  startDate?: string
  finishDate?: string
  notes?: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

export interface FilterOptions {
  series?: string
  stage?: PaintStage
  status?: ModelStatus
  completionMin?: number
  completionMax?: number
  search?: string
}

export interface CompletionStats {
  total: number
  completed: number
  inProgress: number
  notStarted: number
  completionRate: number
}

export interface SeriesStat {
  series: string
  count: number
  completed: number
  percentage: number
}

export interface StageProgress {
  stage: PaintStage
  total: number
  completed: number
  inProgress: number
  pending: number
}

export interface MonthlyStat {
  month: string
  started: number
  finished: number
}

export const STAGE_LABELS: Record<PaintStage, string> = {
  assembly: '素组组装',
  sanding: '打磨补土',
  primer: '水补底漆',
  basecoat: '主色分色',
  detail: '细节补色',
  weathering: '旧化渍洗',
  decals: '水贴转印',
  topcoat: '消光光油',
  finished: '完成收工',
}

export const STAGE_ORDER: PaintStage[] = [
  'assembly',
  'sanding',
  'primer',
  'basecoat',
  'detail',
  'weathering',
  'decals',
  'topcoat',
  'finished',
]

export const STATUS_LABELS: Record<ModelStatus, string> = {
  'not-started': '待开始',
  'in-progress': '进行中',
  completed: '已完成',
}

export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  pending: '待开始',
  'in-progress': '进行中',
  completed: '已完成',
  skipped: '跳过',
}

export const COMMON_SERIES = [
  'MG Master Grade',
  'HG High Grade',
  'RG Real Grade',
  'PG Perfect Grade',
  'FG First Grade',
  'TV Anime',
  'SD BB战士',
  'EG Entry Grade',
  '其他',
]

export const COMMON_SCALES = [
  '1/144',
  '1/100',
  '1/60',
  '1/48',
  '1/35',
  '无比例',
]

export const PAINT_BRANDS = [
  '郡士 Mr.Hobby',
  '田宫 Tamiya',
  '盖亚 Gaia',
  '匠域匠域 JUMPWIND',
  'AV漆 AK Interactive',
  '米格 AMMO Mig',
  '优速达 U-STAR',
  '酋长大陆',
  '其他',
]
