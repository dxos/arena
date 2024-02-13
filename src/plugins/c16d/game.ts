import { Vector3 } from "three";
import { checkForWin, enumerateWinningLines } from "./lib/winningLines";
import { cellInBounds } from "./lib/bounds";
import { vec3Equal } from "./lib/vec3";

// --- Constants --------------------------------------------------------------
export const CELL_COUNT = 4;
export const winningLines = enumerateWinningLines();

// --- State ------------------------------------------------------------------
type GameStatus = "waiting" | "in-progress" | "complete";

type GameOverReason = "red-won" | "yellow-won" | "draw";

export type PlayerColor = "red" | "yellow";
export type Cell = { cell: Vector3; player: PlayerColor };

export type GameState = {
  cells: Cell[];
  status: GameStatus;
  gameOverReason?: GameOverReason;
  winningCells: Vector3[] | undefined;
  players: { red: string; yellow: string };
};

export function zeroState(): Partial<GameState> {
  return {
    cells: [],
    status: "waiting",
    gameOverReason: undefined,
    winningCells: undefined,
  };
}

type GameAction =
  | { type: "move-made"; move: Vector3; playerId: string }
  | { type: "game-over"; reason: GameOverReason; winningCells?: Vector3[] };

export type GameDispatch = (action: GameAction) => void;

// --- Helpers ----------------------------------------------------------------
export const whoPlaysTurn = (turn: number): PlayerColor => (turn % 2 === 0 ? "red" : "yellow");

// --- Exec -------------------------------------------------------------------
export const exec = (state: GameState, action: GameAction): [GameState, GameAction[]] => {
  let actions: GameAction[] = [];

  switch (action.type) {
    case "move-made": {
      if (!state.players["red"] || !state.players["yellow"]) {
        console.warn("We need two players to play!, something went wrong during init.");
        break;
      }

      if (state.status === "complete") {
        break;
      }

      const { move, playerId } = action;

      const turn = whoPlaysTurn(state.cells.length);

      if (playerId !== state.players[turn as keyof typeof state.players]) {
        console.warn("You are not the player who should be making a move :P");
        break;
      }

      if (state.status === "waiting") {
        state.status = "in-progress";
      }

      // -- Valid move?
      // Must be in bounds of the board
      if (!cellInBounds(move, CELL_COUNT)) break;

      // Must be above another cell
      if (
        move.y > 0 &&
        !state.cells.some(({ cell }) => vec3Equal(cell, move.clone().add(new Vector3(0, -1, 0))))
      )
        break;

      // check if already in list
      if (
        state.cells.find(({ cell }) => {
          return vec3Equal(cell, move);
        })
      ) {
        break;
      }

      state.cells.push({ cell: move, player: turn });

      // Check if the move resulted in a win
      const redCells = state.cells.filter((cell) => cell.player === "red").map((cell) => cell.cell);

      const yellowCells = state.cells
        .filter((cell) => cell.player === "yellow")
        .map((cell) => cell.cell);

      const redWinningLines = checkForWin(redCells, winningLines);
      const yellowWinningLines = checkForWin(yellowCells, winningLines);

      if (redWinningLines) {
        actions.push({
          type: "game-over",
          reason: "red-won",
          winningCells: redWinningLines.flat(),
        });
      } else if (yellowWinningLines) {
        actions.push({
          type: "game-over",
          reason: "yellow-won",
          winningCells: yellowWinningLines.flat(),
        });
      }

      break;
    }

    case "game-over": {
      const { reason, winningCells } = action;
      state.status = "complete";
      state.gameOverReason = reason;

      if (winningCells) {
        state.winningCells = winningCells;
      }

      break;
    }
  }

  return [state, actions];
};
