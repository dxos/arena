import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { bufferCount, distinctUntilChanged, map } from "rxjs/operators";
import { useSubscription } from "./useSubscription";

const isFunction = <T>(functionToCheck: any): functionToCheck is (value: T) => boolean =>
  typeof functionToCheck === "function";

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
  fromValue: T | ((value: T) => boolean),
  toValue: T | ((value: T) => boolean)
): boolean {
  const [didTransition, setDidTransition] = useState(false);
  const value$ = React.useMemo(() => new Subject<T>(), []);

  useEffect(() => value$.next(currentValue), [currentValue]);

  const transition$ = React.useMemo(
    () =>
      value$.pipe(
        bufferCount(2, 1), // Create a sliding window of 2 values
        map(([previous, current]) => {
          const isFromValid = isFunction(fromValue) ? fromValue(previous) : fromValue === previous;
          const isToValid = isFunction(toValue) ? toValue(current) : toValue === current;
          return isFromValid && isToValid;
        }),
        distinctUntilChanged()
      ),
    [fromValue, toValue, value$]
  );

  useSubscription(
    () => transition$.subscribe((val) => setDidTransition(val)),
    [transition$, setDidTransition]
  );

  return didTransition;
}

/**
 * Executes a callback function when a specified transition occurs in a value.
 *
 * This function utilizes the `useDidTransition` hook to monitor changes in `currentValue`.
 * When `currentValue` transitions from `fromValue` to `toValue`, the provided `callback` function is executed. */
export function useOnTransition<T>(
  currentValue: T,
  fromValue: T | ((value: T) => boolean),
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
