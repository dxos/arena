import { useIntent } from "@dxos/app-framework";
import { Chess } from "chess.js";
import { useCallback, useEffect } from "react";
import { SynthIntent, synthIntent } from "../../Synth/synth-plugin";
import { useOnTransition } from "../../../hooks/useTransitions";
import { GameStatus } from "../core/game";

export const useGameSounds = (fen: string, status: GameStatus) => {
  const { dispatch } = useIntent();

  useEffect(() => {
    const game = new Chess(fen);

    if (game.inCheck()) {
      dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "check" }));
    } else {
      dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "move" }));
    }
  }, [fen]);

  const onGameStart = useCallback(() => {
    dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "boot" }));
  }, [dispatch]);

  const onGameComplete = useCallback(() => {
    dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "game-over" }));
  }, [dispatch]);

  useOnTransition(status, "waiting", "in-progress", onGameStart);
  useOnTransition(status, "in-progress", "complete", onGameComplete);
};
