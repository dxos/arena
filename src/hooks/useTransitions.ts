import { useRef, useEffect, useState } from "react";

/**
 * Custom hook to determine if a value has transitioned from a specified 'from' value to a 'to' value.
 *
 * @param currentValue - The current value to monitor for transitions.
 * @param fromValue - The value from which the transition should start.
 * @param toValue - The value to which the transition should occur.
 * @returns true if the transition from 'fromValue' to 'toValue' occurred, else false.
 */
export function useDidTransition<T>(
  currentValue: T,
  fromValue: T,
  toValue: T | ((value: T) => boolean)
) {
  const [hasTransitioned, setHasTransitioned] = useState(false);
  const previousValue = useRef(currentValue);

  useEffect(() => {
    // Check for the specific transition
    const toValueValid =
      typeof toValue === "function" ? (toValue as any)(currentValue) : toValue === currentValue;

    if (previousValue.current === fromValue && toValueValid) {
      setHasTransitioned(true);
    } else {
      setHasTransitioned(false);
    }

    // Update previous value
    previousValue.current = currentValue;
  }, [currentValue, fromValue, toValue, setHasTransitioned, previousValue]);

  return hasTransitioned;
}

/**
 * Executes a callback function when a specified transition occurs in a value.
 *
 * This function utilizes the `useDidTransition` hook to monitor changes in `currentValue`.
 * When `currentValue` transitions from `fromValue` to `toValue`, the provided `callback` function is executed. */
export function useOnTransition<T>(
  currentValue: T,
  fromValue: T,
  toValue: ((value: T) => boolean) | T,
  callback: () => void
) {
  const hasTransitioned = useDidTransition(currentValue, fromValue, toValue);

  useEffect(() => {
    if (hasTransitioned) {
      callback();
    }
  }, [hasTransitioned, callback]);
}
