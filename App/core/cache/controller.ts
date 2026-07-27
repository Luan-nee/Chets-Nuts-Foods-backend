import { cacheGlobal } from "../../consts.js";

export class CacheManager {
  static get<T>(key: string): T | undefined {
    const datos = cacheGlobal.get(key) as T;
    return datos;
  }

  static set(key: string, value: unknown, ttl = 300) {
    cacheGlobal.set(key, value, ttl);
  }

  static del(key: string) {
    cacheGlobal.del(key);
  }

  static clear() {}
}
