import { Chess } from "chess.js";
import { match } from "ts-pattern";

type Player = "white" | "black";

function oppositePlayer(player: Player): Player {
  return player === "white" ? "black" : "white";
}

export type Move = {
  source: string;
  target: string;
  promotion?: "q" | "r" | "b" | "n";
};

function whoPlayedTurn(turn: number): Player {
  return turn % 2 === 0 ? "white" : "black";
}

export type GameStatus = "waiting" | "in-progress" | "complete";

type GameOverReason =
  | "checkmate"
  | "white-resignation"
  | "black-resignation"
  | "stalemate"
  | "insufficient-material"
  | "threefold-repetition"
  | "white-timeout"
  | "black-timeout"
  | "draw-agreed";

type GameVariant = "standard";

export type TimeControl = { baseMinutes: number; incrementSeconds: number };

export type GameState = {
  variant: GameVariant;
  timeControl: TimeControl;
  moves: Move[];
  movesWithNotation: string[];
  moveTimes: string[];
  boards: string[];
  players?: { white: string; black: string };
  status: GameStatus;
  gameOverReason?: GameOverReason;
  takebackRequest: { white?: number; black?: number };
  drawOffer?: "white" | "black";
  completedAt?: string;
};

export const zeroState = (): GameState => ({
  variant: "standard",
  timeControl: { baseMinutes: 5, incrementSeconds: 3 },
  moves: [],
  movesWithNotation: [],
  moveTimes: [],
  boards: [new Chess().fen()],
  status: "waiting",
  takebackRequest: {},
  drawOffer: undefined,
});

export type GameAction =
  | { type: "game-created"; players: { white: string; black: string } }
  | { type: "move-made"; move: Move }
  | { type: "request-takeback"; player: "white" | "black" }
  | { type: "accept-takeback"; acceptingPlayer: "white" | "black" }
  | { type: "decline-takeback"; decliningPlayer: "white" | "black" }
  | { type: "offer-draw"; player: "white" | "black" }
  | { type: "accept-draw" }
  | { type: "decline-draw" }
  | { type: "player-resigned"; player: "white" | "black" }
  | { type: "game-over"; reason: GameOverReason };

export type GameDispatch = (action: GameAction) => void;

export const exec = (state: GameState, action: GameAction): [GameState, GameAction[]] => {
  let actions: GameAction[] = [];

  switch (action.type) {
    case "game-created": {
      state.players = action.players;
      break;
    }

    case "move-made": {
      try {
        // TODO(zan): To support variants, we can use a different rules engine
        const chess = new Chess(state.boards[state.boards.length - 1]);

        const move = chess.move({
          from: action.move.source,
          to: action.move.target,
          promotion: "q",
        });

        // If first move is made, game is in progress
        if (state.moves.length === 0) {
          state.status = "in-progress";
        }

        if (state.status !== "in-progress") {
          break;
        }

        // Update move times
        const time = new Date().toISOString();

        state.moveTimes.push(time);

        // Push move and new board
        state.moves.push(action.move);
        state.movesWithNotation.push(move.san);
        state.boards.push(chess.fen());

        // Check for game over states
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            actions.push({ type: "game-over", reason: "checkmate" });
          }
          if (chess.isStalemate()) {
            actions.push({ type: "game-over", reason: "stalemate" });
          }

          if (chess.isInsufficientMaterial()) {
            actions.push({ type: "game-over", reason: "insufficient-material" });
          }

          if (chess.isThreefoldRepetition()) {
            actions.push({ type: "game-over", reason: "threefold-repetition" });
          }
        }
      } catch (e) {
        console.log("Invalid move");
      }

      break;
    }

    case "request-takeback": {
      if (state.status !== "in-progress") {
        break;
      }

      const { player } = action;

      if (player === whoPlayedTurn(state.moves.length - 1)) {
        state.takebackRequest[player] = state.moves.length - 1;
      } else {
        if (state.moves.length < 2) {
          break;
        }

        state.takebackRequest[player] = state.moves.length - 2;
      }

      break;
    }

    case "accept-takeback": {
      const { acceptingPlayer } = action;

      // TODO: Should this be the player who requested the takeback, or the player accepting?
      // The answer will become more clear when we implement.
      const moveNumber = state.takebackRequest[oppositePlayer(acceptingPlayer)];

      if (moveNumber === undefined) {
        break;
      }

      // Revert the game state to the move before the takeback
      state.moves = state.moves.slice(0, moveNumber);
      state.movesWithNotation = state.movesWithNotation.slice(0, moveNumber);
      state.moveTimes = state.moveTimes.slice(0, moveNumber);
      state.boards = state.boards.slice(0, moveNumber + 1);

      state.takebackRequest[oppositePlayer(acceptingPlayer)] = undefined;

      break;
    }

    case "decline-takeback": {
      const { decliningPlayer } = action;
      state.takebackRequest[oppositePlayer(decliningPlayer)] = undefined;

      break;
    }

    case "offer-draw": {
      if (state.status === "in-progress") {
        state.drawOffer = action.player;
      }

      break;
    }

    case "accept-draw": {
      if (state.drawOffer) {
        actions.push({ type: "game-over", reason: "draw-agreed" });
      }

      break;
    }

    case "decline-draw": {
      if (state.drawOffer) {
        state.drawOffer = undefined;
      }

      break;
    }

    case "player-resigned": {
      const { player } = action;

      actions.push({
        type: "game-over",
        reason: match(player)
          .with("white", () => "white-resignation")
          .with("black", () => "black-resignation")
          .exhaustive() as GameOverReason,
      });
      break;
    }

    case "game-over": {
      if (state.status !== "complete") {
        state.status = "complete";
        state.gameOverReason = action.reason;
        state.completedAt = new Date().toISOString();
      }
      break;
    }
  }

  return [state, actions];
};
