import { useCallback, useEffect, useRef, useState } from "react";

const cacheStore = new Map<string, any>();

type UseFetchOptions = {
  enabled: boolean;
};

export const useFetch = <T = any>(
  fetchKey: any,
  fetchFn: () => Promise<Response>,
  options?: Partial<UseFetchOptions>
) => {
  const key = JSON.stringify(fetchKey);
  const loadingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(cacheStore.get(key));
  const [error, setError] = useState<Error | undefined>();

  const fetchData = useCallback(async () => {
    if (loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;
      setIsLoading(true);

      const res = await fetchFn();
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const isJson = res.headers
        .get("Content-Type")
        ?.includes("application/json");

      if (isJson) {
        const json = (await res.json()) as T;
        setData(json);
        cacheStore.set(key, json);
      } else {
        const text = await res.text();
        setData(text as unknown as T);
        cacheStore.set(key, text);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (options?.enabled !== false) {
      fetchData();
    }
  }, [fetchData, options?.enabled]);

  return { data, isLoading, error, refetch: fetchData };
};
