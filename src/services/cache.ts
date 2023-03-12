import NodeCache from 'node-cache';

class InMemoryCache {
  public readonly client: NodeCache;

  constructor() {
    this.client = new NodeCache({ forceString: true });
  }

  public getObjectKey<T>(key: NodeCache.Key): T | null {
    const value = this.client.get(key) as string | null | undefined;

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public setKey(key: NodeCache.Key, value: string, ttl?: string | number): void {
    ttl ? this.client.set(key, value, ttl) : this.client.set(key, value);
  }

  public hasKey(key: NodeCache.Key) {
    return this.client.has(key);
  }

  public listKeys() {
    return this.client.keys();
  }

  public removeAllKeys() {
    this.client.flushAll();
  }

  public close() {
    this.client.close();
  }
}

const cache = new InMemoryCache();

export default cache;