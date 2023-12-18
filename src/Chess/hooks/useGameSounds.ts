import { Chess } from "chess.js";
import { GameStatus, Move } from "../game";
import { useEffect } from "react";
import { useIntent } from "@dxos/app-framework";
import { SynthIntent, synthIntent } from "../../Synth/synth-plugin";

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

  useEffect(() => {
    if (status === "in-progress") {
      dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "boot" }));
    } else if (status === "complete") {
      dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "game-over" }));
    }
  }, [status]);
};
