import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createStorage } from '../src/storage/StorageFactory';
import { InMemoryStorage } from '../src/storage/InMemoryStorage';

const OLD_ENV = process.env;

beforeEach(() => {
  process.env = { ...OLD_ENV };
});

afterEach(() => {
  process.env = OLD_ENV;
});

describe('StorageFactory', () => {
  it('returns InMemoryStorage by default', () => {
    delete process.env.STORAGE_DRIVER;
    const s = createStorage();
    expect(s).toBeInstanceOf(InMemoryStorage);
  });

  it('returns InMemoryStorage when driver=inmemory', () => {
    process.env.STORAGE_DRIVER = 'inmemory';
    const s = createStorage();
    expect(s).toBeInstanceOf(InMemoryStorage);
  });
});
