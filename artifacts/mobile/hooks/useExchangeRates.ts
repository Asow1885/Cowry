import { useEffect, useRef, useState } from "react";

const RATES_URL = "https://open.er-api.com/v6/latest/USD";
const STALE_MS = 60 * 60 * 1000;

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

export function useExchangeRates(): ExchangeRatesState {
  const [rates, setRates] = useState<Rates | null>(cachedRates);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(
    cachedAt ? new Date(cachedAt) : null
  );
  const [loading, setLoading] = useState(!cachedRates);
  const [error, setError] = useState(false);
  const cancelRef = useRef(false);

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
      const res = await fetch(RATES_URL, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (cancelRef.current) return;
      cachedRates = data.rates as Rates;
      cachedAt = Date.now();
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
    return () => {
      cancelRef.current = true;
    };
  }, []);

  return { rates, updatedAt, loading, error, refetch: fetchRates };
}
