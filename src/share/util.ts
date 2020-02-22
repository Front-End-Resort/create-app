import type {
  CacheStorage,
  Cache,
  MapItem,
  AppMap
} from '../index'

export class ReqError extends Error {
  status?: number
  constructor(message?: string, status?: number) {
    super(message)
    this.status = status
  }
}

export function createCache<T>(amount: number = 10): Cache<T> {
  let cache: CacheStorage<T> = {}

  function keys(): string[] {
    return Object.keys(cache)
  }

  function checkAmount(): void {
    let cacheKeys: string[] = keys()
    if (cacheKeys.length > amount) {
      remove(cacheKeys[0])
    }
  }

  function set(key: string, value: T): void {
    remove(key)
    cache[key] = value
    checkAmount()
  }

  function get(key: string): T {
    return cache[key]
  }

  function remove(key: string): void {
    if (cache.hasOwnProperty(key)) {
      delete cache[key]
    }
  }

  function getAll(): CacheStorage<T> {
    return cache
  }

  return { keys, get, set, remove, getAll }
}

export function createMap<K, V>(): AppMap<K, V> {
  let list: MapItem<K, V>[] = []

  function find(key: K): MapItem<K, V>[] {
    return list.filter(item => item.key === key)
  }

  function has(key: K): boolean {
    let result = find(key)
    return result.length > 0
  }

  function get(key: K): V | undefined {
    let result = find(key)
    return result.length ? result[0].value : undefined
  }

  function set(key: K, value: V): void {
    let result = find(key)

    if (result.length === 0) {
      let item = { key, value }
      list.push(item)
    } else {
      result[0].value = value
    }
  }

  function remove(key: K): void {
    list = list.filter(item => item.key !== key)
  }

  return { get, set, has, remove }
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return !!value && typeof (value as { then: unknown }).then === 'function'
}