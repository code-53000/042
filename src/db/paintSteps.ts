
import { getDB } from './index'
import type { PaintStep, PaintRecord } from '@/types'

export async function getStepsByModelId(modelId: string): Promise<PaintStep[]> {
  const db = await getDB()
  return db.getAllFromIndex('paintSteps', 'by-modelId', modelId)
}

export async function getStepById(id: string): Promise<PaintStep | undefined> {
  const db = await getDB()
  return db.get('paintSteps', id)
}

export async function addStep(step: PaintStep): Promise<string> {
  const db = await getDB()
  const tx = db.transaction(['paintSteps', 'paintRecords'], 'readwrite')

  const key = await tx.objectStore('paintSteps').add(step)

  for (const record of step.paintRecords || []) {
    await tx.objectStore('paintRecords').add(record)
  }

  await tx.done
  return key as string
}

export async function updateStep(step: PaintStep): Promise<string> {
  const db = await getDB()
  const tx = db.transaction(['paintSteps', 'paintRecords'], 'readwrite')

  const existingRecords = await tx.objectStore('paintRecords').index('by-stepId').getAllKeys(step.id)
  for (const key of existingRecords) {
    await tx.objectStore('paintRecords').delete(key)
  }

  for (const record of step.paintRecords || []) {
    await tx.objectStore('paintRecords').add(record)
  }

  const key = await tx.objectStore('paintSteps').put(step)
  await tx.done
  return key as string
}

export async function deleteStep(id: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['paintSteps', 'paintRecords'], 'readwrite')

  const recordKeys = await tx.objectStore('paintRecords').index('by-stepId').getAllKeys(id)
  for (const key of recordKeys) {
    await tx.objectStore('paintRecords').delete(key)
  }

  await tx.objectStore('paintSteps').delete(id)
  await tx.done
}

export async function getRecordsByStepId(stepId: string): Promise<PaintRecord[]> {
  const db = await getDB()
  return db.getAllFromIndex('paintRecords', 'by-stepId', stepId)
}

export async function getStepsWithRecordsByModelId(modelId: string): Promise<PaintStep[]> {
  const steps = await getStepsByModelId(modelId)
  const result: PaintStep[] = []

  for (const step of steps) {
    const records = await getRecordsByStepId(step.id)
    result.push({ ...step, paintRecords: records })
  }

  return result
}
