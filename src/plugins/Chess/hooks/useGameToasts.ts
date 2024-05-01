import { useIntentDispatcher } from "@dxos/app-framework";
import { GameState, PlayerColor, oppositePlayerColor } from "../core/game";
import { ToasterIntent, toasterIntent } from "../../Toaster/toaster-plugin";
import { useOnTransition } from "$hooks/useTransitions";
import { match } from "ts-pattern";
import { useCallback, useMemo } from "react";
import { on } from "events";

export const useGameToasts = (
  gameOverReason: GameState["gameOverReason"],
  playerColor: PlayerColor,
  opponentUsername: string,
  drawOffer: GameState["drawOffer"],
  takebackRequest: GameState["takebackRequest"]
) => {
  const dispatch = useIntentDispatcher();

  const oppositeColor = useMemo(() => oppositePlayerColor(playerColor), [playerColor]);

  const onDrawOffer = useCallback(() => {
    dispatch(
      toasterIntent(ToasterIntent.ISSUE_TOAST, {
        title: `Draw Offer`,
        description: `${opponentUsername} has offered you a draw`,
      })
    );
  }, [dispatch, opponentUsername]);

  useOnTransition(drawOffer, undefined, oppositeColor, onDrawOffer);

  const onTakebackRequest = useCallback(() => {
    dispatch(
      toasterIntent(ToasterIntent.ISSUE_TOAST, {
        title: `Takeback Request`,
        description: `${opponentUsername} has requested a takeback to move ${takebackRequest[oppositeColor]}.`,
      })
    );
  }, [dispatch, opponentUsername, takebackRequest]);

  useOnTransition(
    takebackRequest?.[oppositeColor],
    undefined,
    (v: any) => typeof v === "number",
    onTakebackRequest
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
