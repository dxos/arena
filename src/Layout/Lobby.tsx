import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../UI/Buttons";

export const Lobby = () => {
  const handlePlayWithMe = () => {
    const uuid = uuidv4();

    history.pushState({}, "", `/play-with-me/${uuid}`);
  };

  return (
    <div className="m-8">
      <div className="p-8 flex flex-col items-center gap-4">
        <h2 className="text-3xl">Lobby</h2>
        <Button onClick={handlePlayWithMe} aria-label={"Play with a friend"}>
          Play with a friend
        </Button>
      </div>
    </div>
  );
};
