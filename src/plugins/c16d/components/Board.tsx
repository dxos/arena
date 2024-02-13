import { Vector3 } from "three";
import { CELL_COUNT, Cell as CellT } from "../game";
import { grid2 } from "../lib/grid2";
import { Base } from "./Base";
import { BASE_OFFSET, CELL_SPACING } from "./C16D";
import { Cell } from "./Cell";
import { vec3Equal } from "../lib/vec3";

const newCellPosition = (c: Vector3) => new Vector3(c.x, c.y + 1, c.z);

export function Board({
  cells,
  winningCells,
  onMove,
}: {
  cells: CellT[];
  winningCells?: Vector3[];
  onMove: (cell: Vector3) => void;
}) {
  const bases = grid2(CELL_COUNT, CELL_COUNT);

  const lastCell = cells.length > 0 ? cells[cells.length - 1].cell : undefined;

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
              onMove(new Vector3(x, y, z));
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
                position={new Vector3(v.x, v.y, v.z)
                  .multiplyVectors(
                    new Vector3(v.x, v.y, v.z),
                    new Vector3(CELL_SPACING, 1, CELL_SPACING)
                  )
                  .add(new Vector3(0, BASE_OFFSET, 0))}
                onClick={(event: any) => {
                  onMove(newCellPosition(v));
                  event.stopPropagation();
                }}
                highlight={
                  winningCells && winningCells.find((winningCell) => vec3Equal(winningCell, v))
                }
                last={lastCell && vec3Equal(lastCell, v)}
              />
            );
          })}
        </group>
      </group>
    </>
  );
}
