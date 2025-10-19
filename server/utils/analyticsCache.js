import NodeCache from 'node-cache';
import { prisma } from './prisma.js'

const analyticsCache = new NodeCache({ stdTTL: 600 });

export async function cachedAnalytics(key, fetchFn) {
    const cached = analyticsCache.get(key);
    if (cached !== undefined) return cached;   // ✅ returns cached if exists
    const data = await fetchFn();              // ❌ fetches fresh data
    analyticsCache.set(key, data);            // ✅ caches it
    return data;
}

export function clearCache(pattern) {
    if (pattern) analyticsCache.flushAll();   // 🔹 currently flushAll for any pattern
}

export const getFactsStatus = async () => prisma.analyticsMeta.findFirst({ where: { id: 1 } });
