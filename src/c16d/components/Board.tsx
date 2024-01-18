import { useValue } from "signia-react";
import { Vector3 } from "three";
import { useTrackGameState } from "../hooks/useTrackGameState";
import { grid2 } from "../lib/grid2";
import { checkForWin, inWinningLine } from "../lib/winningLines";
import { Base } from "./Base";
import {
  BASE_OFFSET,
  CELL_COUNT,
  CELL_SPACING,
  cellsAtom,
  gameStateAtom,
  lastCellAtom,
  redCellsAtom,
  winningLines,
  yellowCellsAtom,
} from "./C16D";
import { Cell } from "./Cell";

const upNormal = new Vector3(0, 1, 0);
const newCellPosition = (clickedCell: Vector3) => clickedCell.clone().add(upNormal);

export function Board({ onAddCell }: { onAddCell: (selected: Vector3) => void }) {
  const cells = useValue(cellsAtom);
  const redCells = useValue(redCellsAtom);
  const yellowCells = useValue(yellowCellsAtom);
  const bases = grid2(CELL_COUNT, CELL_COUNT);

  const redWinningLines = checkForWin(redCells, winningLines);
  const yellowWinningLines = checkForWin(yellowCells, winningLines);

  const lastCell = useValue(lastCellAtom);

  useTrackGameState(cellsAtom, gameStateAtom, redWinningLines, yellowWinningLines);

  return (
    <>
      <pointLight position={[30, 3, -10]} color="blue" intensity={5} />
      <group position={[0, 0, 0]}>
        {bases.map((pos) => (
          <Base
            key={`base-${pos.toArray()}`}
            position={pos.clone().multiplyScalar(CELL_SPACING)}
            onClick={(event: any) => {
              const [x, y, z] = pos;
              onAddCell(new Vector3(x, y, z));
              event.stopPropagation();
            }}
          />
        ))}
        <group position={[0, BASE_OFFSET, 0]}>
          {cells.map(({ cell: v, player }) => {
            return (
              <Cell
                player={player}
                key={`cell-${[v.x, v.y, v.z]}`}
                position={v
                  .clone()
                  .multiplyVectors(v.clone(), new Vector3(CELL_SPACING, 1, CELL_SPACING))
                  .add(new Vector3(0, BASE_OFFSET, 0))}
                onClick={(event: any) => {
                  onAddCell(newCellPosition(v));
                  event.stopPropagation();
                }}
                highlight={
                  (redWinningLines && inWinningLine(v, redWinningLines)) ||
                  (yellowWinningLines && inWinningLine(v, yellowWinningLines))
                }
                last={lastCell && v.equals(lastCell.cell)}
              />
            );
          })}
        </group>
      </group>
    </>
  );
}
