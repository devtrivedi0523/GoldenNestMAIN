import { useEffect, useState } from "react";

/**
 * useDebounced
 * Returns a debounced version of any value.
 *
 * Example:
 * const debouncedQuery = useDebounced(query, 350);
 */
export default function useDebounced(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
