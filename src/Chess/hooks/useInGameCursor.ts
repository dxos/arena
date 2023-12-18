import React, { useCallback } from "react";
import { GameState } from "../game";

type InGameCursorAction =
  | { type: "move-forward" }
  | { type: "move-backward" }
  | { type: "move-to-beginning" }
  | { type: "move-to-latest" }
  | { type: "select-move"; move: number };

export const useInGameCursor = ({ boards }: GameState) => {
  const [current, setCurrent] = React.useState(true);
  const [index, setIndex] = React.useState(0);

  const board = boards[index];
  const numberOfMoves = boards.length - 1;

  React.useEffect(() => {
    if (current) {
      setIndex(numberOfMoves);
    }
  }, [current, setIndex, numberOfMoves]);

  const selectBoardByIndex = (index: number) => {
    const latestIndex = numberOfMoves;
    const adjustedIndex = Math.max(0, Math.min(index, latestIndex));

    setCurrent(adjustedIndex === latestIndex);
    setIndex(adjustedIndex);
  };

  const dispatch = useCallback(
    (action: InGameCursorAction) => {
      switch (action.type) {
        case "move-forward":
          selectBoardByIndex(index + 1);
          break;
        case "move-backward":
          selectBoardByIndex(index - 1);
          break;
        case "move-to-beginning":
          selectBoardByIndex(0);
          break;
        case "move-to-latest":
          selectBoardByIndex(numberOfMoves);
          break;
        case "select-move": {
          selectBoardByIndex(action.move);
          break;
        }
      }
    },
    [index, numberOfMoves, selectBoardByIndex]
  );

  return {
    __index: index,
    can: { moveForward: index < numberOfMoves, moveBackward: index > 0 },
    board,
    canInteractWithBoard: current,
    dispatch,
  };
};

export type InGameCursor = ReturnType<typeof useInGameCursor>;
