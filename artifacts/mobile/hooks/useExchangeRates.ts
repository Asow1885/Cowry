import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

const WISE_BASE   = "https://wise.com/rates/live";
const ER_API_BASE = "https://open.er-api.com/v6/latest/USD";
const SOURCE      = "USD";
const TARGETS     = ["GNF", "XOF", "NGN", "MAD", "KES", "EUR"];
const STALE_MS    = 30 * 60 * 1000;

type Rates = Record<string, number>;

export interface ExchangeRatesState {
  rates: Rates | null;
  updatedAt: Date | null;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

let cachedRates: Rates | null = null;
let cachedAt: number | null   = null;

async function fetchFromWise(): Promise<Rates> {
  // Wise pricefeed: one call per pair, fanned out in parallel
  // Works on native (no CORS). Same mid-market rate as open.er-api.
  const results = await Promise.all(
    TARGETS.map(async (target): Promise<[string, number]> => {
      const res = await fetch(
        `${WISE_BASE}?source=${SOURCE}&target=${target}`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${target}`);
      const data = await res.json() as { value: number };
      return [target, data.value];
    })
  );
  const built: Rates = {};
  for (const [code, value] of results) built[code] = value;
  return built;
}

async function fetchFromErApi(): Promise<Rates> {
  // open.er-api.com: single call, CORS-friendly — used on web
  // Returns identical mid-market rates sourced from the same interbank feeds
  const res = await fetch(ER_API_BASE, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json() as { rates: Rates };
  const built: Rates = {};
  for (const code of TARGETS) {
    if (data.rates[code] != null) built[code] = data.rates[code];
  }
  return built;
}

export function useExchangeRates(): ExchangeRatesState {
  const [rates, setRates]         = useState<Rates | null>(cachedRates);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(
    cachedAt ? new Date(cachedAt) : null
  );
  const [loading, setLoading]     = useState(!cachedRates);
  const [error, setError]         = useState(false);
  const cancelRef                 = useRef(false);

  async function fetchRates() {
    const now = Date.now();
    if (cachedRates && cachedAt && now - cachedAt < STALE_MS) {
      setRates(cachedRates);
      setUpdatedAt(new Date(cachedAt));
      setLoading(false);
      return;
    }

    cancelRef.current = false;
    setLoading(true);
    setError(false);

    try {
      // Wise pricefeed on native (no CORS), ER API on web (CORS-safe)
      const built = await (Platform.OS === "web"
        ? fetchFromErApi()
        : fetchFromWise());

      if (cancelRef.current) return;
      cachedRates = built;
      cachedAt    = Date.now();
      setRates(cachedRates);
      setUpdatedAt(new Date(cachedAt));
      setLoading(false);
    } catch {
      if (cancelRef.current) return;
      setLoading(false);
      setError(true);
    }
  }

  useEffect(() => {
    fetchRates();
    return () => { cancelRef.current = true; };
  }, []);

  return { rates, updatedAt, loading, error, refetch: fetchRates };
}
