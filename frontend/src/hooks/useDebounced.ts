import { useState, useEffect } from "react";

export default function useDebounce(value: string, delayms: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayms);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delayms]);

  return debouncedValue;
}
