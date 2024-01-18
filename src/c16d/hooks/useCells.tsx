import { useValue } from "signia-react";
import { Vector3 } from "three";
import {
  cellsAtom,
  gameStateAtom,
  PlayerColor,
  CELL_COUNT,
  cellsAtomRaw,
} from "../components/C16D";

export const useCells = () => {
  const cells = useValue(cellsAtom);
  const gameState = useValue(gameStateAtom);

  const addCell = (move: Vector3, player: PlayerColor) =>
    cellsAtomRaw.update(() => {
      // If game is over, don't add any more cells
      if (gameState !== "playing") return cells;

      // bail if outside bounds
      if (move.x < 0 || move.x >= CELL_COUNT) return cells;
      if (move.y < 0 || move.y >= CELL_COUNT) return cells;
      if (move.z < 0 || move.z >= CELL_COUNT) return cells;

      // must be above another cell
      if (
        move.y > 0 &&
        !cells.some(({ cell }) => cell.equals(move.clone().add(new Vector3(0, -1, 0))))
      )
        return cells;

      // check if already in list
      if (cells.find(({ cell }) => cell.equals(move))) {
        return cells;
      } else {
        return [...cells, { cell: move, player }];
      }
    });

  return { cells, addCell };
};
