import { useIntent } from "@dxos/app-framework";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { SynthIntent, synthIntent } from "../Synth/synth-plugin";
import { Button } from "../UI/Buttons";

export const Lobby = () => {
  const { dispatch } = useIntent();

  const handlePlayWithMe = () => {
    const uuid = uuidv4();

    history.pushState({}, "", `/play-with-me/${uuid}`);
  };

  const handlePlayGame = () => {
    const uuid = uuidv4();
    history.pushState({}, "", `/game/${uuid}`);
  };

  return (
    <div>
      <div className="p-8 flex flex-col items-center gap-4">
        <h2 className="text-3xl">Lobby</h2>
        <Button onClick={handlePlayWithMe} aria-label={"Play with a friend"}>
          Play with a friend
        </Button>
        <Button onClick={handlePlayGame} aria-label="play-game">
          Play Game (hack)
        </Button>
        <Button
          onClick={() =>
            dispatch(synthIntent(SynthIntent.PLAY_SOUND_FROM_ATLAS, { sound: "check" }))
          }
          aria-label={"Play sound"}
        >
          Play Sound
        </Button>
      </div>
    </div>
  );
};
