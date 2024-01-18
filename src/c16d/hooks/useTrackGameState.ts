import { useEffect } from "react";
import { Atom, Computed } from "signia";
import { useValue } from "signia-react";
import { Vector3 } from "three";
import { Cell } from "../components/C16D";
import { CELL_COUNT } from "../game";

export const useTrackGameState = (
  cellsAtom: Computed<Cell[]>,
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
