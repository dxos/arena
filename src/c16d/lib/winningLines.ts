import { Vector3 } from "three";

const dim = 4;

function rotateLineInFourDirections(line: Vector3[]) {
  const lines = [];
  lines.push(line);

  const l2 = [...line].map((v) =>
    v
      .clone()
      .applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2)
      .add(new Vector3(0, 0, dim - 1))
      .round()
  );
  lines.push(l2);

  const l3 = [...line].map((v) =>
    v
      .clone()
      .applyAxisAngle(new Vector3(0, 1, 0), Math.PI)
      .add(new Vector3(dim - 1, 0, dim - 1))
      .round()
  );
  lines.push(l3);

  const l4 = [...line].map((v) =>
    v
      .clone()
      .applyAxisAngle(new Vector3(0, 1, 0), (3 * Math.PI) / 2)
      .add(new Vector3(dim - 1, 0, 0))
      .round()
  );
  lines.push(l4);

  return lines;
}

export function enumerateWinningLines(): Vector3[][] {
  const lines: Vector3[][] = [];

  // Rectilinears
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      const line = [];
      for (let z = 0; z < dim; z++) {
        line.push(new Vector3(x, y, z));
      }

      lines.push(line);
    }

    for (let z = 0; z < dim; z++) {
      const line = [];
      for (let x = 0; x < dim; x++) {
        line.push(new Vector3(x, y, z));
      }

      lines.push(line);
    }
  }

  // Diagonals
  for (let y = 0; y < dim; y++) {
    const line = [];
    for (let x = 0; x < dim; x++) {
      line.push(new Vector3(x, y, x));
    }

    lines.push(line);
  }

  for (let y = 0; y < dim; y++) {
    const line = [];
    for (let z = 0; z < dim; z++) {
      line.push(new Vector3(z, y, dim - z - 1));
    }

    lines.push(line);
  }

  // Columns

  for (let x = 0; x < dim; x++) {
    for (let z = 0; z < dim; z++) {
      const line = [];
      for (let y = 0; y < dim; y++) {
        line.push(new Vector3(x, y, z));
      }

      lines.push(line);
    }
  }

  // Stairs
  for (let x = 0; x < dim; x++) {
    const line = [];
    for (let y = 0; y < dim; y++) {
      line.push(new Vector3(x, y, y));
    }

    rotateLineInFourDirections(line).forEach((l) => lines.push(l));
  }

  const line = [];
  for (let x = 0; x < dim; x++) {
    line.push(new Vector3(x, x, x));
  }

  rotateLineInFourDirections(line).forEach((l) => lines.push(l));

  return lines;
}

export function checkForWin(cells: Vector3[], winningLines: Vector3[][]) {
  const wins = [];

  for (const line of winningLines) {
    let hasWin = true;

    for (const cell of line) {
      if (!cells.find((c) => c.equals(cell))) {
        hasWin = false;
        break;
      }
    }

    if (hasWin) wins.push(line);
  }

  if (wins.length > 0) return wins;

  return undefined;
}

export function inWinningLine(cell: Vector3, winningLines: Vector3[][]) {
  if (!winningLines) return false;

  const id = (x: any) => x;

  const winningCells = winningLines.flatMap(id);
  return winningCells.some((lineCell) => lineCell.equals(cell));
}
