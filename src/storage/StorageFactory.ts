import { InMemoryStorage } from './InMemoryStorage';
import { FirestoreStorage } from './FirestoreStorage';
import type { Storage } from './Storage';
import { Firestore } from '@google-cloud/firestore';

export interface StorageOptions {
  driver?: 'inmemory' | 'firestore';
  projectId?: string;
}

export function createStorage(opts: StorageOptions = {}): Storage {
  const driver = opts.driver || (process.env.STORAGE_DRIVER as 'inmemory' | 'firestore') || 'inmemory';

  if (driver === 'firestore') {
    const projectId = opts.projectId || process.env.FIRESTORE_PROJECT_ID;
    if (!projectId) {
      throw new Error('FIRESTORE_PROJECT_ID es requerido para usar Firestore');
    }
    const db = new Firestore({ projectId });
    return new FirestoreStorage(db);
  }

  return new InMemoryStorage();
}
