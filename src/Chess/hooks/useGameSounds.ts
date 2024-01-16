import { useIntent } from "@dxos/app-framework";
import { Chess } from "chess.js";
import { useEffect } from "react";
import { SynthIntent, synthIntent } from "../../Synth/synth-plugin";
import { useOnTransition } from "../../hooks/useTransitions";
import { GameStatus } from "../game";

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

  useOnTransition(status, "in-progress", "complete", () => {
    dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "game-over" }));
  });

  useOnTransition(status, "waiting", "in-progress", () => {
    dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "boot" }));
  });
};
