import { Button } from "@dxos/react-ui";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export const Lobby = () => {
  const handlePlayWithMe = () => {
    const uuid = uuidv4();

    history.pushState({}, "", `/play-with-me/${uuid}`);
  };

  return (
    <div>
      <h2>Lobby</h2>
      <Button onClick={handlePlayWithMe}>Play with your friend</Button>
    </div>
  );
};
