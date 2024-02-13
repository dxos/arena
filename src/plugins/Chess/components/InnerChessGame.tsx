import { useIdentity } from "@dxos/react-client/halo";
import { Chess } from "chess.js";
import React, { useCallback, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import useMeasure from "react-use-measure";
import { useValue } from "signia-react";
import { usersAtom } from "../../RoomManager/room-manager-plugin";
import { Panel } from "$ui/Panel";
import { GameAction, GameState, Move, PlayerColor, oppositePlayerColor } from "../core/game";
import { useGameActions } from "../hooks/useGameActions";
import { useGameSounds } from "../hooks/useGameSounds";
import { useGameToasts } from "../hooks/useGameToasts";
import { useInGameCursor } from "../hooks/useInGameCursor";
import { useTimeControl, useTimeOut } from "../hooks/useTimeControl";
import { findPiece } from "../core/utils";
import { Controls } from "./Controls";
import { MoveList } from "./MoveList";
import { PlayerInfo } from "./PlayerInfo";

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
  const users = useValue(usersAtom);

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

  const opponentUsername = useMemo(() => {
    return (
      users.find(
        (user) => user.identityKey.toHex() === game.players[oppositePlayerColor(playerColor)]
      )?.profile?.displayName || "Anonymous"
    );
  }, [users, game, playerColor]);

  const cursor = useInGameCursor(game.boards);

  useTimeControl(game.timeControl, game.moveTimes, game.status, game.completedAt);
  useTimeOut(send, game.status);
  useGameSounds(game.boards[game.boards.length - 1], game.status);
  useGameToasts(
    game.gameOverReason,
    playerColor,
    opponentUsername,
    game.drawOffer,
    game.takebackRequest
  );

  const gameActions = useGameActions(send, playerColor);

  const onDrop = useCallback(
    (source: string, target: string) => {
      if (cursor.isOnMostRecentState) {
        send({ type: "move-made", move: { source, target }, playerId: identityKeyHex });
        return true;
      }

      return false;
    },
    [cursor.isOnMostRecentState, send]
  );

  const squareStyles = useMemo(
    () => computeSquareStyles(game.moves[cursor.__index - 1], game.boards[cursor.__index]),
    [cursor.__index]
  );

  const [ref, bounds] = useMeasure();

  return (
    <div className="p-1 sm:p-4 grid grid-cols-1 sm:grid-cols-[auto_auto] gap-2 sm:gap-3 justify-center items-start">
      <div ref={ref} className="flex flex-col gap-2 sm:gap-3">
        <PlayerInfo name={opponentUsername} color={oppositePlayerColor(playerColor)} game={game} />
        <div className="flex-1 p-1 aspect-ratio-1 bg-stone-800 rounded-sm">
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
        <PlayerInfo
          name={identity?.profile?.displayName || "Anonymous"}
          color={playerColor}
          game={game}
        />

        <Controls
          cursor={cursor}
          playing={game.status === "in-progress"}
          drawOffered={game.drawOffer !== undefined}
          takebackRequested={
            game.takebackRequest.black !== undefined || game.takebackRequest.white !== undefined
          }
          {...gameActions}
        />
      </div>

      <Panel className="sm:w-fit overflow-auto" style={{ maxHeight: bounds.height }}>
        <MoveList
          currentMove={cursor.__index - 1}
          movesWithNotation={game.movesWithNotation}
          onSelectMove={(move) => cursor.dispatch({ type: "select-move", move: move })}
        />
      </Panel>
    </div>
  );
};
