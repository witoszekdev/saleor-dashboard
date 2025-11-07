import { ChangeEvent } from "@dashboard/hooks/useForm";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

type UseSearchQueryFromUrl = [string, (event: ChangeEvent) => void, () => void];

/**
 * Hook that syncs search query with URL query parameter
 * Similar to useSearchQuery but stores state in URL for consistency with filters
 */
function useSearchQueryFromUrl(onFetch: (query: string) => void): UseSearchQueryFromUrl {
  const location = useLocation();
  const history = useHistory();

  // Read initial query from URL
  const getQueryFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);

    return params.get("query") || "";
  }, [location.search]);

  const [query, setQuery] = useState(getQueryFromUrl);

  // Call onFetch on initial mount if query exists in URL
  useEffect(() => {
    const initialQuery = getQueryFromUrl();

    if (initialQuery) {
      onFetch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with URL changes
  useEffect(() => {
    const urlQuery = getQueryFromUrl();

    if (urlQuery !== query) {
      setQuery(urlQuery);
      onFetch(urlQuery);
    }
  }, [location.search, getQueryFromUrl, query, onFetch]);

  const change = useCallback(
    (event: ChangeEvent) => {
      const value = event.target.value;

      setQuery(value);
      onFetch(value);

      // Update URL with new query
      const params = new URLSearchParams(location.search);

      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }

      history.replace(`${location.pathname}?${params.toString()}`);
    },
    [location.pathname, location.search, history, onFetch],
  );

  const reset = useCallback(() => {
    setQuery("");
    onFetch("");

    // Remove query from URL
    const params = new URLSearchParams(location.search);

    params.delete("query");
    history.replace(`${location.pathname}?${params.toString()}`);
  }, [location.pathname, location.search, history, onFetch]);

  return [query, change, reset];
}

export default useSearchQueryFromUrl;
