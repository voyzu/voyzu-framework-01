/**
 * Get and set items to and from the in-memory cache.
 * @module "caching.cache"
 */

// Import third party libraries
import { LRUCache } from "lru-cache";

// Primitive constants (settings)
const lruCacheOptions = {
  max: 1_000_000,
};

// Module initilization
const cache = new LRUCache(lruCacheOptions);

/**
 * Get item from in-memory cache.
 * @param {any} key Cache key to retrieve.
 * @returns {any} Object with the supplied key. Returns undefined if the key is not present.
 */
export function get(key) {
  return cache.get(key);
}

/**
 * Set item into in-memory cache.
 * @param {any} key The cache key to store the item against.
 * @param {any} value The value to store.
 */
export function set(key, value) {
  cache.set(key, value);
}
