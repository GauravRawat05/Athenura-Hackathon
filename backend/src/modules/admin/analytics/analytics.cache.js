/**
  analytics.cache.js
  Lightweight in-memory cache with TTL support to prevent unnecessary aggregation hits.
 */

class AnalyticsCache {
  constructor() {
    this.cache = new Map();
    this.timeouts = new Map();
  }

  /**
   * Retrieve item from cache
   * @param {string} key 
   * @returns {any}
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Store item in cache with TTL
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlMs TTL in milliseconds (default 60s)
   */
  set(key, value, ttlMs = 60000) {
    // Prevent memory leak: clear previous timer if exists for this key
    this.clearTimer(key);

    this.cache.set(key, value);

    const timer = setTimeout(() => {
      this.delete(key);
    }, ttlMs);

    // Prevent process hanging in some test runners, though usually fine
    if (timer.unref) {
      timer.unref();
    }

    this.timeouts.set(key, timer);
  }

  /**
   * Delete item from cache and clear its timer
   * @param {string} key 
   * @returns {boolean}
   */
  delete(key) {
    this.clearTimer(key);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache values and timers
   */
  clear() {
    for (const key of this.timeouts.keys()) {
      this.clearTimer(key);
    }
    this.timeouts.clear();
    this.cache.clear();
  }

  /**
   * Internal helper to clear a timer
   * @param {string} key 
   */
  clearTimer(key) {
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
      this.timeouts.delete(key);
    }
  }

  /**
   * Generate stable cache key based on endpoint and serialized query parameters
   * @param {string} endpoint 
   * @param {object} query 
   * @returns {string}
   */
  generateKey(endpoint, query = {}) {
    const sortedKeys = Object.keys(query).sort();
    const queryString = sortedKeys
      .map((key) => {
        const val = query[key];
        // Handle Date objects or other non-primitive values consistently
        if (val instanceof Date) {
          return `${key}=${val.toISOString()}`;
        }
        return `${key}=${String(val)}`;
      })
      .join("&");
    return `${endpoint}?${queryString}`;
  }
}

const analyticsCache = new AnalyticsCache();
export default analyticsCache;
