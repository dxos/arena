import { useEffect } from "react";
import { Atom } from "signia";
import { useValue } from "signia-react";
import { Vector3 } from "three";
import { CELL_COUNT, Cell } from "../components/C16D";

export const useTrackGameState = (
  cellsAtom: Atom<Cell[]>,
  gameStateAtom: Atom<"playing" | "red-won" | "yellow-won" | "draw">,
  redWinningLines: Vector3[][] | undefined,
  yellowWinningLines: Vector3[][] | undefined
) => {
  const cells = useValue(cellsAtom);

  useEffect(() => {
    if (redWinningLines) {
      gameStateAtom.set("red-won");
    } else if (yellowWinningLines) {
      gameStateAtom.set("yellow-won");
    } else if (cells.length === CELL_COUNT ** 3) {
      gameStateAtom.set("draw");
    } else {
      gameStateAtom.set("playing");
    }
  }, [redWinningLines, yellowWinningLines, cells, gameStateAtom.set]);
};
