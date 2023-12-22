import React, { useCallback, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import useMeasure from "react-use-measure";
import { Panel } from "../../UI/Panel";
import { GameAction, GameState, Move, PlayerColor, oppositePlayerColor } from "../game";
import { useGameSounds } from "../hooks/useGameSounds";
import { useInGameCursor } from "../hooks/useInGameCursor";
import { useTimeControl, useTimeOut } from "../hooks/useTimeControl";
import { PlayerInfo } from "./PlayerInfo";
import { Controls } from "./Controls";
import { MoveList } from "./MoveList";
import { Chess } from "chess.js";
import { findPiece } from "../utils";
import { useIdentity } from "@dxos/react-client/halo";

const computeSquareStyles = (lastMove: Move | undefined, fen: string) => {
  const game = new Chess(fen);
  let squareStyles = {};

  if (lastMove !== undefined) {
    squareStyles = {
      [lastMove.source]: { backgroundColor: "rgba(30, 150, 0, 0.152)" },
      [lastMove.target]: { backgroundColor: "rgba(30, 150, 0, 0.2)" },
      ...squareStyles,
    };
  }

  if (game.inCheck()) {
    let turn = game.turn();
    let kingInCheck = findPiece(game, { type: "k", color: turn });

    if (kingInCheck) {
      squareStyles = {
        [kingInCheck.square]: { backgroundColor: "rgba(255, 0, 0, 0.2)" },
        ...squareStyles,
      };
    }
  }

  return squareStyles;
};

export const InnerChessGame = ({
  game,
  send,
}: {
  game: GameState;
  send: (action: GameAction) => void;
}) => {
  const identity = useIdentity();
  const identityKeyHex = identity?.identityKey.toHex();

  const playerColor: PlayerColor | undefined = useMemo(() => {
    if (identityKeyHex === game.players.white) return "white";
    if (identityKeyHex === game.players.black) return "black";
    return undefined;
  }, [identity, game.players]);

  if (!playerColor) {
    throw new Error("Player color not found");
  }

  const cursor = useInGameCursor(game);
  useTimeControl(game.timeControl, game.moveTimes, game.status, game.completedAt);
  useTimeOut(send, game.status);
  useGameSounds(game.boards[game.boards.length - 1], game.status);

  const onDrop = useCallback(
    (source: string, target: string) => {
      console.log("onDrop", source, target);
      if (cursor.canInteractWithBoard) {
        send({ type: "move-made", move: { source, target } });
        return true;
      }
      return false;
    },
    [cursor.canInteractWithBoard, send]
  );

  const squareStyles = useMemo(
    () => computeSquareStyles(game.moves[cursor.__index - 1], game.boards[cursor.__index]),
    [cursor.__index]
  );

  const [ref, bounds] = useMeasure();

  return (
    <div className="p-4 grid grid-cols-[auto_auto] grid-rows-[1fr] gap-3 justify-center items-start">
      <div ref={ref} className="flex flex-col gap-3">
        <PlayerInfo color={oppositePlayerColor(playerColor)} game={game} />
        <div className="flex-1 p-1 aspect-ratio-1 bg-stone-600 rounded-sm">
          <div className="rounded-sm border border-stone-300">
            <Chessboard
              customSquareStyles={squareStyles}
              position={cursor.board}
              onPieceDrop={onDrop}
              areArrowsAllowed
              id={"main"}
              animationDuration={50}
              boardOrientation={playerColor}
            />
          </div>
        </div>
        <PlayerInfo color={playerColor} game={game} />

        {/* TODO(Zan): Chess game should be player aware (don't play both sides) */}
        <Controls
          cursor={cursor}
          playing={game.status === "in-progress"}
          drawOffered={game.drawOffer !== undefined}
          takebackRequested={
            game.takebackRequest.black !== undefined || game.takebackRequest.white !== undefined
          }
          onResign={() => send({ type: "player-resigned", player: "white" })}
          onOfferDraw={() => send({ type: "offer-draw", player: "white" })}
          onAcceptDraw={() => send({ type: "accept-draw" })}
          onRequestTakeback={() => send({ type: "request-takeback", player: "white" })}
          onAcceptTakeback={() => send({ type: "accept-takeback", acceptingPlayer: "black" })}
        />
      </div>

      <Panel className="w-fit overflow-auto" style={{ height: bounds.height }}>
        <MoveList
          currentMove={cursor.__index - 1}
          movesWithNotation={game.movesWithNotation}
          onSelectMove={(move) => cursor.dispatch({ type: "select-move", move: move })}
        />
      </Panel>
    </div>
  );
};
