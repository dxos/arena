import { useIntent } from "@dxos/app-framework";
import { GameState, PlayerColor, oppositePlayerColor } from "../game";
import { ToasterIntent, toasterIntent } from "../../Toaster/toaster-plugin";
import { useOnTransition } from "../../hooks/useTransitions";
import { match } from "ts-pattern";

export const useGameToasts = (
  gameOverReason: GameState["gameOverReason"],
  playerColor: PlayerColor,
  opponentUsername: string,
  drawOffer: GameState["drawOffer"],
  takebackRequest: GameState["takebackRequest"]
) => {
  const { dispatch } = useIntent();

  const oppositeColor = oppositePlayerColor(playerColor);

  useOnTransition(drawOffer, undefined, oppositeColor, () => {
    dispatch(
      toasterIntent(ToasterIntent.ISSUE_TOAST, {
        title: `Draw Offer`,
        description: `${opponentUsername} has offered you a draw`,
      })
    );
  });

  useOnTransition(
    takebackRequest?.[oppositeColor],
    undefined,
    (v: any) => typeof v === "number",
    () => {
      dispatch(
        toasterIntent(ToasterIntent.ISSUE_TOAST, {
          title: `Takeback Request`,
          description: `${opponentUsername} has requested a takeback to move ${
            takebackRequest[oppositePlayerColor(playerColor)]
          }.`,
        })
      );
    }
  );

  useOnTransition(
    gameOverReason,
    undefined,
    (v: any) => typeof v === "string",
    () => {
      if (gameOverReason === undefined) return;

      const title = match(gameOverReason)
        .with("checkmate", () => "Checkmate")
        .with("white-resignation", () => "White Resigned")
        .with("black-resignation", () => "Black Resigned")
        .with("stalemate", () => "Stalemate")
        .with("insufficient-material", () => "Insufficient Material")
        .with("threefold-repetition", () => "Threefold Repetition")
        .with("white-timeout", () => "White Timeout")
        .with("black-timeout", () => "Black Timeout")
        .with("draw-agreed", () => "Draw Agreed")
        .otherwise(() => "Game Over");

      dispatch(toasterIntent(ToasterIntent.ISSUE_TOAST, { title, description: "" }));
    }
  );
};
