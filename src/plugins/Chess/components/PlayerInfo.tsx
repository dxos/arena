import React from "react";
import { match } from "ts-pattern";
import { Panel } from "$ui/Panel";
import { cn } from "$lib/css";
import { GameState, PlayerColor } from "../core/game";
import { Timer } from "./Timer";

type PlayerInfoProps = {
  color: PlayerColor;
  game: GameState;
  name?: string;
};

export const PlayerInfo = ({ color, game, name }: PlayerInfoProps) => {
  const turn = game.moves.length % 2 === 0 ? color === "white" : color === "black";

  const statusText = match(game.status)
    .with("waiting", () => "Waiting for first move")
    .with("in-progress", () => (turn ? "Your turn" : "Waiting"))
    .with("complete", () =>
      match(game.gameOverReason)
        .with("black-resignation", () => "Black resigned")
        .with("white-resignation", () => "White resigned")
        .with("checkmate", () => "Checkmate")
        .with("stalemate", () => "Stalemate")
        .with("insufficient-material", () => "Insufficient material")
        .with("threefold-repetition", () => "Threefold repetition")
        .with("white-timeout", () => "White timeout")
        .with("black-timeout", () => "Black timeout")
        .with("draw-agreed", () => "Draw")
        .with(undefined, () => "")
        .exhaustive(),
    )
    .exhaustive();

  const textColor = turn ? "text-green-600" : "text-red-600";

  return (
    <Panel
      className={cn(
        "p-3",
        "sm:p-4",
        "flex flex-row justify-between items-center",
        "font-mono",
        "transition-all duration-100 ease-in-out",
      )}
    >
      <div>
        <div className="text-md sm:text-lg font-bold capitalize">{name}</div>
        <div className={cn("text-sm", textColor)}>{statusText}</div>
      </div>
      <Timer color={color} />
    </Panel>
  );
};
