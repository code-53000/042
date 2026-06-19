
import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { Model, PaintStep, PaintRecord } from '@/types'

interface GunplaDB extends DBSchema {
  models: {
    key: string
    value: Model
    indexes: {
      'by-status': string
      'by-series': string
      'by-completion': number
      'by-createdAt': string
    }
  }
  paintSteps: {
    key: string
    value: PaintStep
    indexes: {
      'by-modelId': string
      'by-stage': string
      'by-status': string
    }
  }
  paintRecords: {
    key: string
    value: PaintRecord
    indexes: {
      'by-stepId': string
      'by-brand': string
    }
  }
}

const DB_NAME = 'gunpla-progress-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<GunplaDB>> | null = null

export function initDB(): Promise<IDBPDatabase<GunplaDB>> {
  if (dbPromise) return dbPromise

  dbPromise = openDB<GunplaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('models')) {
        const modelStore = db.createObjectStore('models', { keyPath: 'id' })
        modelStore.createIndex('by-status', 'status')
        modelStore.createIndex('by-series', 'series')
        modelStore.createIndex('by-completion', 'completion')
        modelStore.createIndex('by-createdAt', 'createdAt')
      }

      if (!db.objectStoreNames.contains('paintSteps')) {
        const stepStore = db.createObjectStore('paintSteps', { keyPath: 'id' })
        stepStore.createIndex('by-modelId', 'modelId')
        stepStore.createIndex('by-stage', 'stage')
        stepStore.createIndex('by-status', 'status')
      }

      if (!db.objectStoreNames.contains('paintRecords')) {
        const recordStore = db.createObjectStore('paintRecords', { keyPath: 'id' })
        recordStore.createIndex('by-stepId', 'stepId')
        recordStore.createIndex('by-brand', 'brand')
      }
    },
  })

  return dbPromise
}

export function getDB(): Promise<IDBPDatabase<GunplaDB>> {
  if (!dbPromise) {
    return initDB()
  }
  return dbPromise
}

export async function clearAllData(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['models', 'paintSteps', 'paintRecords'], 'readwrite')
  await tx.objectStore('models').clear()
  await tx.objectStore('paintSteps').clear()
  await tx.objectStore('paintRecords').clear()
  await tx.done
}
