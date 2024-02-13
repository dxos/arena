import { expect, test } from "vitest";
import { exec, GameState, GameAction } from "./game"; // Adjust import paths as necessary
import { Vector3 } from "three";
import { mkApplyMany } from "../../../hooks/useStore.test";

// --- HELPERS ----------------------------------------------------------------
const applyMany = mkApplyMany(exec);
const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

const mkGameState = (): GameState => {
  const state: GameState = {
    cells: [],
    status: "waiting",
    gameOverReason: undefined,
    winningCells: undefined,
    players: { red: "Alice", yellow: "Bob" },
  };

  return state;
};

// --- TEST CASES -------------------------------------------------------------
test("Can initialize a game", () => {
  const state = applyMany(mkGameState(), []);

  expect(state.status).toBe("waiting");
  expect(state.cells.length).toBe(0);
});

test("Can make a valid move", () => {
  const state = mkGameState();

  const move = v(0, 0, 0);
  const newState = applyMany(state, [{ type: "move-made", move, playerId: "Alice" }]);

  expect(newState.cells).toHaveLength(1);
  expect(newState.cells[0].cell.equals(move)).toBeTruthy();
  expect(newState.status).toBe("in-progress");
});

test("Can't make a move out of turn", () => {
  const state = mkGameState();

  const move = v(0, 0, 0);
  const newState = applyMany(state, [{ type: "move-made", move, playerId: "Bob" }]);

  expect(newState.cells).toHaveLength(0);
  expect(newState.status).toBe("waiting");
});

test("Can't make an invalid move", () => {
  const state = mkGameState();

  const move = v(1, 1, 1);
  const newState = applyMany(state, [{ type: "move-made", move, playerId: "Alice" }]);

  expect(newState.cells).toHaveLength(0);
});

test("Can win the game (vertical)", () => {
  const state = mkGameState();

  const moves = [
    { move: v(0, 0, 0), playerId: "Alice" },
    { move: v(0, 1, 0), playerId: "Bob" },
    { move: v(0, 0, 1), playerId: "Alice" },
    { move: v(0, 1, 1), playerId: "Bob" },
    { move: v(0, 0, 2), playerId: "Alice" },
    { move: v(0, 1, 2), playerId: "Bob" },
    { move: v(0, 0, 3), playerId: "Alice" },
  ].map((move) => ({ type: "move-made", ...move } as const));

  const newState = applyMany(state, moves);

  expect(newState.status).toBe("complete");
  expect(newState.gameOverReason).toBe("red-won");
});

test("Can win the game (horizontal)", () => {
  const state = mkGameState();

  const moves = [
    { move: v(0, 0, 0), playerId: "Alice" },
    { move: v(1, 0, 0), playerId: "Bob" },
    { move: v(0, 0, 1), playerId: "Alice" },
    { move: v(1, 0, 1), playerId: "Bob" },
    { move: v(0, 0, 2), playerId: "Alice" },
    { move: v(1, 0, 2), playerId: "Bob" },
    { move: v(0, 0, 3), playerId: "Alice" },
  ].map((move) => ({ type: "move-made", ...move } as const));

  const newState = applyMany(state, moves);

  expect(newState.status).toBe("complete");
  expect(newState.gameOverReason).toBe("red-won");
});
