import { useEffect, useRef, useState } from "react";

const WISE_BASE = "https://wise.com/rates/live";
const SOURCE    = "USD";
const TARGETS   = ["GNF", "XOF", "NGN", "MAD", "KES", "EUR"];
const STALE_MS  = 30 * 60 * 1000;

type Rates = Record<string, number>;

export interface ExchangeRatesState {
  rates: Rates | null;
  updatedAt: Date | null;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

let cachedRates: Rates | null = null;
let cachedAt: number | null = null;

async function fetchOnePair(target: string): Promise<[string, number]> {
  const res = await fetch(
    `${WISE_BASE}?source=${SOURCE}&target=${target}`,
    { signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${target}`);
  const data = await res.json() as { value: number };
  return [target, data.value];
}

export function useExchangeRates(): ExchangeRatesState {
  const [rates, setRates]       = useState<Rates | null>(cachedRates);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(
    cachedAt ? new Date(cachedAt) : null
  );
  const [loading, setLoading]   = useState(!cachedRates);
  const [error, setError]       = useState(false);
  const cancelRef               = useRef(false);

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
      // Fan out all pairs in parallel — Wise pricefeed is one call per pair
      const results = await Promise.all(TARGETS.map(fetchOnePair));
      if (cancelRef.current) return;

      const built: Rates = {};
      for (const [code, value] of results) built[code] = value;

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
