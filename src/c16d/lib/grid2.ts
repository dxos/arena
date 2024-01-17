import { Vector3 } from "three";

export function grid2(w: number, h: number) {
  const res = [];
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      res.push(new Vector3(x, 0, y));
    }
  }

  return res;
}
