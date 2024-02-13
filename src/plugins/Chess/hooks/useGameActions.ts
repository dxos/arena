import { GameAction, PlayerColor } from "../core/game";

export const useGameActions = (send: (action: GameAction) => void, playerColor: PlayerColor) => {
  return {
    onResign: () => send({ type: "player-resigned", player: playerColor }),
    onOfferDraw: () => send({ type: "offer-draw", player: playerColor }),
    onAcceptDraw: () => send({ type: "accept-draw" }),
    onRequestTakeback: () => send({ type: "request-takeback", player: playerColor }),
    onAcceptTakeback: () => send({ type: "accept-takeback", acceptingPlayer: playerColor }),
  };
};
