
import { getDB } from './index'
import type { Model, ModelStatus } from '@/types'

export async function getAllModels(): Promise<Model[]> {
  const db = await getDB()
  return db.getAllFromIndex('models', 'by-createdAt')
}

export async function getModelById(id: string): Promise<Model | undefined> {
  const db = await getDB()
  return db.get('models', id)
}

export async function addModel(model: Model): Promise<string> {
  const db = await getDB()
  return db.add('models', model)
}

export async function updateModel(model: Model): Promise<string> {
  const db = await getDB()
  model.updatedAt = new Date().toISOString()
  return db.put('models', model)
}

export async function deleteModel(id: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['models', 'paintSteps', 'paintRecords'], 'readwrite')

  const steps = await tx.objectStore('paintSteps').index('by-modelId').getAll(id)
  for (const step of steps) {
    await tx.objectStore('paintRecords').index('by-stepId').getAllKeys(step.id).then(keys =>
      Promise.all(keys.map(k => tx.objectStore('paintRecords').delete(k)))
    )
    await tx.objectStore('paintSteps').delete(step.id)
  }

  await tx.objectStore('models').delete(id)
  await tx.done
}

export async function getModelsByStatus(status: ModelStatus): Promise<Model[]> {
  const db = await getDB()
  return db.getAllFromIndex('models', 'by-status', status)
}

export async function getModelsBySeries(series: string): Promise<Model[]> {
  const db = await getDB()
  return db.getAllFromIndex('models', 'by-series', series)
}
