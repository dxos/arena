import { expect, test } from "vitest";
import { exec, zeroState } from "./game";
import { mkApplyMany } from "../hooks/useStore.test";

// --- HELPERS ----------------------------------------------------------------
const applyMany = mkApplyMany(exec);

const last = <T>(arr: T[]) => arr[arr.length - 1];

// --- TEST CASES -------------------------------------------------------------

test("Can create a game", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
  ]);

  expect(state.players?.white).toBe("zan");
  expect(state.players?.black).toBe("zhenya");
});

test("Can play a move", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
  ]);

  expect(state.moves).toHaveLength(1);
  expect(state.moves[0].source).toBe("e2");
  expect(state.status).toBe("in-progress");
});

test("White can resign", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "move-made", move: { source: "e7", target: "e5" } },
    { type: "player-resigned", player: "white" },
  ]);

  expect(state.status).toBe("complete");
  expect(state.gameOverReason).toBe("white-resignation");
});

test("Moves after game over should be ignored", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "move-made", move: { source: "e7", target: "e5" } },
    { type: "player-resigned", player: "white" },

    // knight f3, knight c6
    { type: "move-made", move: { source: "g1", target: "f3" } },
    { type: "move-made", move: { source: "b8", target: "c6" } },
  ]);

  expect(state.moves).toHaveLength(2);
});

test("Scholars mate should end the game in checkmate", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "move-made", move: { source: "e7", target: "e5" } },
    { type: "move-made", move: { source: "f1", target: "c4" } },
    { type: "move-made", move: { source: "b8", target: "c6" } },
    { type: "move-made", move: { source: "d1", target: "h5" } },
    { type: "move-made", move: { source: "g8", target: "f6" } },
    { type: "move-made", move: { source: "h5", target: "f7" } },
  ]);

  expect(state.status).toBe("complete");
  expect(state.gameOverReason).toBe("checkmate");
});

test("White Kingside Castle", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "move-made", move: { source: "e7", target: "e5" } },
    { type: "move-made", move: { source: "g1", target: "f3" } },
    { type: "move-made", move: { source: "b8", target: "c6" } },
    { type: "move-made", move: { source: "f1", target: "e2" } },
    { type: "move-made", move: { source: "g8", target: "f6" } },
    { type: "move-made", move: { source: "e1", target: "g1" } }, // King side castle
  ]);

  expect(state.moves).toHaveLength(7);
  expect(last(state.movesWithNotation)).toBe("O-O");
});

test("Black Kingside Castle", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } }, // White's first move
    { type: "move-made", move: { source: "e7", target: "e5" } }, // Black's first move
    { type: "move-made", move: { source: "g1", target: "f3" } }, // White's second move
    { type: "move-made", move: { source: "g8", target: "f6" } }, // Black's second move
    { type: "move-made", move: { source: "d2", target: "d4" } }, // White's third move
    { type: "move-made", move: { source: "f8", target: "e7" } }, // Black's third move
    { type: "move-made", move: { source: "b1", target: "c3" } }, // White's fourth move
    { type: "move-made", move: { source: "e8", target: "g8" } }, // Black's kingside castle
  ]);

  expect(last(state.movesWithNotation)).toBe("O-O");
});

test("En Passant", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "move-made", move: { source: "a7", target: "a6" } }, // Black's waiting move
    { type: "move-made", move: { source: "e4", target: "e5" } },
    { type: "move-made", move: { source: "d7", target: "d5" } }, // Black pawn moves adjacent to white pawn
    { type: "move-made", move: { source: "e5", target: "d6" } }, // White captures en passant
  ]);

  expect(state.moves).toHaveLength(5);
  expect(last(state.movesWithNotation)).toBe("exd6");
});

test("Can request a takeback", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "request-takeback", player: "white" },
  ]);

  expect(state.takebackRequest.white).toBe(0);
});

test("Black can't request takeback if they haven't played a move", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "request-takeback", player: "black" },
  ]);

  expect(state.takebackRequest.black).toBe(undefined);
});

test("Can accept a takeback", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "request-takeback", player: "white" },
    { type: "accept-takeback", acceptingPlayer: "black" },
  ]);

  expect(state.boards).toHaveLength(1);
});

test("Can decline a takeback", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "request-takeback", player: "white" },
    { type: "decline-takeback", decliningPlayer: "black" },
  ]);

  expect(state.takebackRequest.white).toBe(undefined);
});

test("Can offer a draw", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "offer-draw", player: "white" },
  ]);

  expect(state.drawOffer).toBe("white");
});

test("Can accept a draw offer", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "offer-draw", player: "white" },
    { type: "accept-draw" },
  ]);

  expect(state.status).toBe("complete");
  expect(state.drawOffer).toBe("white");
  expect(state.gameOverReason).toBe("draw-agreed");
});

test("Can decline a draw offer", () => {
  const state = applyMany(zeroState(), [
    { type: "game-created", players: { white: "zan", black: "zhenya" } },
    { type: "move-made", move: { source: "e2", target: "e4" } },
    { type: "offer-draw", player: "white" },
    { type: "decline-draw" },
  ]);

  expect(state.drawOffer).toBe(undefined);
});
