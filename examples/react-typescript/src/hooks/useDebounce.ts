/**
 * Debounce Hook following Performance Protocol
 * Reduces unnecessary API calls and renders
 */
import { useEffect, useRef } from 'react';

export function useDebounce(
  callback: () => void,
  delay: number,
  dependencies: unknown[]
): void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(callback, delay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, dependencies);
}
