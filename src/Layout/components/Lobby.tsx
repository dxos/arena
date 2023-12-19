import React from "react";
import { v4 as uuid } from "uuid";
import { Button } from "../../UI/Buttons";
import { Link } from "./Link";

export const Lobby = () => {
  const inviteUUID = uuid();

  return (
    <div>
      <div className="p-8 flex flex-col items-center gap-4">
        <h2 className="text-3xl">Lobby</h2>
        <Link to={`/play-with-me/${inviteUUID}`}>
          <Button aria-label={"Play with a friend"}>Play with a friend</Button>
        </Link>
        <Link to="/choose-space">
          <Button aria-label="Choose space">Choose space</Button>
        </Link>
      </div>
    </div>
  );
};
