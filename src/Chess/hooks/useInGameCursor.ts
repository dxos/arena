import React, { useCallback } from "react";
import { match } from "ts-pattern";

type InGameCursorAction =
  | { type: "move-forward" }
  | { type: "move-backward" }
  | { type: "move-to-beginning" }
  | { type: "move-to-latest" }
  | { type: "select-move"; move: number };

export const useInGameCursor = <State>(states: State[]) => {
  const [current, setCurrent] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  const state = states[index];
  const numberOfStates = states.length - 1;

  React.useEffect(() => {
    if (current) {
      setIndex(numberOfStates);
    }
  }, [current, setIndex, numberOfStates]);

  const selectStateByIndex = (index: number) => {
    const latestIndex = numberOfStates;
    const adjustedIndex = Math.max(0, Math.min(index, latestIndex));

    setCurrent(adjustedIndex === latestIndex);
    setIndex(adjustedIndex);
  };

  const dispatch = useCallback(
    (action: InGameCursorAction) => {
      match(action)
        .with({ type: "move-forward" }, () => selectStateByIndex(index + 1))
        .with({ type: "move-backward" }, () => selectStateByIndex(index - 1))
        .with({ type: "move-to-beginning" }, () => selectStateByIndex(0))
        .with({ type: "move-to-latest" }, () => selectStateByIndex(numberOfStates))
        .with({ type: "select-move" }, ({ move }) => selectStateByIndex(move))
        .exhaustive();
    },
    [index, numberOfStates, selectStateByIndex]
  );

  return {
    __index: index,
    can: { moveForward: index < numberOfStates, moveBackward: index > 0 },
    board: state,
    isOnMostRecentState: current,
    dispatch,
  } as const;
};

export type InGameCursor = ReturnType<typeof useInGameCursor>;
