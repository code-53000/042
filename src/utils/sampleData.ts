
import type { Model, PaintStep, PaintRecord } from '@/types'
import { ModelService } from '@/services/ModelService'
import { PaintStepService } from '@/services/PaintStepService'
import { clearAllData } from '@/db'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const sampleModels: Omit<Model, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'RX-78-2 高达 Ver.3.0',
    series: 'MG Master Grade',
    scale: '1/100',
    status: 'in-progress',
    completion: 55,
    purchaseDate: daysAgo(120),
    startDate: daysAgo(45),
    notes: '主色已喷完，准备做旧化和水贴。肩部装甲有轻微缩胶已填。',
    thumbnail: '🤖',
  },
  {
    name: 'MSZ-006 Z高达',
    series: 'RG Real Grade',
    scale: '1/144',
    status: 'completed',
    completion: 100,
    purchaseDate: daysAgo(200),
    startDate: daysAgo(150),
    finishDate: daysAgo(30),
    notes: '完美收工！渐变分色效果满意，已入展示柜。',
    thumbnail: '🛸',
  },
  {
    name: 'ASW-G-08 巴巴托斯 天狼座',
    series: 'MG Master Grade',
    scale: '1/100',
    status: 'in-progress',
    completion: 33,
    purchaseDate: daysAgo(90),
    startDate: daysAgo(20),
    notes: '刚喷完灰色水补土，等天气好喷主色。',
    thumbnail: '⚔️',
  },
  {
    name: 'RX-0 独角兽 毁灭模式',
    series: 'HG High Grade',
    scale: '1/144',
    status: 'not-started',
    completion: 0,
    purchaseDate: daysAgo(60),
    notes: '双素组待开工，先排期。',
    thumbnail: '🦄',
  },
  {
    name: 'MSN-04 沙扎比 Ver.Ka',
    series: 'MG Master Grade',
    scale: '1/100',
    status: 'completed',
    completion: 100,
    purchaseDate: daysAgo(300),
    startDate: daysAgo(250),
    finishDate: daysAgo(80),
    notes: '金属红分色，旧化中度渍洗，手涂细节补色。',
    thumbnail: '🔴',
  },
  {
    name: 'RX-93 ν高达',
    series: 'RG Real Grade',
    scale: '1/144',
    status: 'in-progress',
    completion: 77,
    purchaseDate: daysAgo(100),
    startDate: daysAgo(60),
    notes: '细节补色中，浮游炮准备做渐变色。',
    thumbnail: '🎯',
  },
]

export const samplePaintRecords: Record<string, Omit<PaintRecord, 'id' | 'stepId'>[]> = {
  primer: [
    { brand: '郡士 Mr.Hobby', colorCode: 'SF-287', colorName: '灰色水补土 1000番', isCustomMix: false },
  ],
  basecoat: [
    { brand: '郡士 Mr.Hobby', colorCode: 'GX2', colorName: '光泽白', isCustomMix: false },
    { brand: '盖亚 Gaia', colorCode: 'GA-030', colorName: '高达蓝', isCustomMix: true, mixRatio: 'GA-030 + GA-020 3:1', notes: '加一点白提高明度' },
    { brand: '盖亚 Gaia', colorCode: 'GA-003', colorName: '纯红', isCustomMix: false },
  ],
  detail: [
    { brand: '田宫 Tamiya', colorCode: 'X-11', colorName: '铝银', isCustomMix: false },
    { brand: '匠域匠域 JUMPWIND', colorCode: 'JW021', colorName: '金属黄', isCustomMix: false },
  ],
  weathering: [
    { brand: 'AV漆 AK Interactive', colorCode: 'AK045', colorName: '棕色渍洗液', isCustomMix: false },
    { brand: '米格 AMMO Mig', colorCode: 'AMIG-1400', colorName: '旧化土', isCustomMix: false },
  ],
  topcoat: [
    { brand: '郡士 Mr.Hobby', colorCode: 'B-514', colorName: '消光透明漆', isCustomMix: false },
  ],
}

export async function importSampleData(): Promise<{ models: Model[] }> {
  await clearAllData()

  const createdModels: Model[] = []
  const modelStageOverrides: Record<string, Partial<Record<string, PaintStep['status']>>> = {
    [sampleModels[0].name]: {
      assembly: 'completed',
      sanding: 'completed',
      primer: 'completed',
      basecoat: 'completed',
      detail: 'in-progress',
      weathering: 'pending',
      decals: 'pending',
      topcoat: 'pending',
      finished: 'pending',
    },
    [sampleModels[1].name]: {
      assembly: 'completed',
      sanding: 'completed',
      primer: 'completed',
      basecoat: 'completed',
      detail: 'completed',
      weathering: 'completed',
      decals: 'completed',
      topcoat: 'completed',
      finished: 'completed',
    },
    [sampleModels[2].name]: {
      assembly: 'completed',
      sanding: 'completed',
      primer: 'in-progress',
      basecoat: 'pending',
      detail: 'pending',
      weathering: 'pending',
      decals: 'pending',
      topcoat: 'pending',
      finished: 'pending',
    },
    [sampleModels[3].name]: {
      assembly: 'pending',
      sanding: 'pending',
      primer: 'pending',
      basecoat: 'pending',
      detail: 'pending',
      weathering: 'pending',
      decals: 'pending',
      topcoat: 'pending',
      finished: 'pending',
    },
    [sampleModels[4].name]: {
      assembly: 'completed',
      sanding: 'completed',
      primer: 'completed',
      basecoat: 'completed',
      detail: 'completed',
      weathering: 'completed',
      decals: 'completed',
      topcoat: 'completed',
      finished: 'completed',
    },
    [sampleModels[5].name]: {
      assembly: 'completed',
      sanding: 'completed',
      primer: 'completed',
      basecoat: 'completed',
      detail: 'completed',
      weathering: 'in-progress',
      decals: 'completed',
      topcoat: 'pending',
      finished: 'pending',
    },
  }

  for (const modelData of sampleModels) {
    const model = await ModelService.create(modelData)
    createdModels.push(model)

    await PaintStepService.createDefaultStepsForModel(model.id)
    const steps = await PaintStepService.fetchByModelId(model.id)

    const overrides = modelStageOverrides[modelData.name] ?? {}
    for (const step of steps) {
      const overrideStatus = overrides[step.stage]
      if (overrideStatus) {
        await PaintStepService.updateStep(step.id, {
          status: overrideStatus,
          description: step.status === 'completed' ? generateDescription(step.stage) : undefined,
        })
      }

      if ((step.stage === 'primer' || step.stage === 'basecoat' || step.stage === 'detail' || step.stage === 'weathering' || step.stage === 'topcoat')
        && (step.status === 'completed' || step.status === 'in-progress')) {
        const records = samplePaintRecords[step.stage] ?? []
        for (const rec of records) {
          await PaintStepService.addPaintRecord(step.id, rec)
        }
      }
    }
  }

  return { models: createdModels }
}

function generateDescription(stage: string): string {
  const descs: Record<string, string> = {
    assembly: '完成板件修剪，打磨合模线，假组检查组合度。',
    sanding: '缩胶处补土，整体400目→800目→1000目打磨。',
    primer: '整体喷灰色水补土检查瑕疵，厚度均匀。',
    basecoat: '主色薄喷多层，控制漆料比例 1:2.5。',
    detail: '手涂动力管、喷口、眼部等细节部位。',
    weathering: '渍洗+干扫，模拟战损和油污效果。',
    decals: '水贴配合软化剂，银线处理到位。',
    topcoat: '整体喷消光，距离25cm左右扫喷。',
    finished: '全部工序完成，检查瑕疵，收工！',
  }
  return descs[stage] ?? ''
}
