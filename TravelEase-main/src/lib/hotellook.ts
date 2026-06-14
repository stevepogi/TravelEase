const HOTELLOOK_TOKEN = import.meta.env.VITE_HOTELLOOK_TOKEN as string;
const HOTELLOOK_MARKER = import.meta.env.VITE_HOTELLOOK_MARKER as string;

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface HotellookPrice {
  hotelName: string;
  priceFrom: number;
  priceAvg: number;
  stars: number;
  location: {
    name: string;
    country: string;
  };
}

interface CacheEntry {
  data: HotellookPrice[];
  timestamp: number;
}

function getCached(key: string): HotellookPrice[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(key: string, data: HotellookPrice[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore storage errors (e.g. private browsing)
  }
}

export async function fetchHotelPrices(
  locationName: string,
  currency: string = 'php'
): Promise<HotellookPrice[]> {
  const cacheKey = `hl_prices_${locationName.toLowerCase()}_${currency}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (!HOTELLOOK_TOKEN) {
    console.warn('Hotellook token is missing. Check your .env file.');
    return [];
  }

  const params = new URLSearchParams({
    location: locationName,
    currency,
    limit: '10',
    token: HOTELLOOK_TOKEN,
  });
  if (HOTELLOOK_MARKER) params.set('marker', HOTELLOOK_MARKER);

  try {
    const res = await fetch(`https://engine.hotellook.com/api/v2/cache.json?${params.toString()}`);
    if (!res.ok) {
      console.error('Hotellook API error:', res.status);
      return [];
    }
    const data = await res.json();
    const prices: HotellookPrice[] = Array.isArray(data) ? data : [];
    setCache(cacheKey, prices);
    return prices;
  } catch (err) {
    console.error('Hotellook fetch failed:', err);
    return [];
  }
}

export function getAveragePrice(prices: HotellookPrice[]): number | null {
  if (prices.length === 0) return null;
  const total = prices.reduce((sum, p) => sum + (p.priceAvg || p.priceFrom || 0), 0);
  return Math.round(total / prices.length);
}