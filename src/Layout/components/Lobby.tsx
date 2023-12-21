import React from "react";
import { Button } from "../../UI/Buttons";
import { Link } from "./Link";

export const Lobby = () => {
  return (
    <div>
      <div className="p-8 flex flex-col items-center gap-4">
        <h2 className="text-3xl">Lobby</h2>
        <Link to={"/create-invitation"}>
          <Button aria-label={"Play with a friend"}>Play with a friend</Button>
        </Link>
        <Link to="/choose-room">
          <Button aria-label="Choose room">Choose room</Button>
        </Link>
      </div>
    </div>
  );
};
