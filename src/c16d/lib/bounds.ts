import { Vector3 } from "three";

export function cellInBounds(cell: Vector3, dimension: number) {
  if (cell.x < 0 || cell.x >= dimension) return false;
  if (cell.y < 0 || cell.y >= dimension) return false;
  if (cell.z < 0 || cell.z >= dimension) return false;

  return true;
}
