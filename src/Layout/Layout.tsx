import { Surface, useIntent } from "@dxos/app-framework";
import { Button } from "@dxos/react-ui";
import React from "react";
import { useValue } from "signia-react";
import { GradientBackground } from "./GradientBackground";
import { Nav } from "./Nav";
import { LayoutIntent, layoutIntent, layoutStateAtom } from "./layout-plugin";

export const Layout = () => {
  const layoutState = useValue(layoutStateAtom);

  const intent = useIntent();

  return (
    <div className="h-full w-full">
      <Nav />
      <GradientBackground />
      {layoutState.mode}
      <Button
        onClick={() => intent.dispatch(layoutIntent(LayoutIntent.PLAY_GAME, { gameId: "123" }))}
      >
        Play Game
      </Button>
      <Button
        onClick={() =>
          intent.dispatch(layoutIntent(LayoutIntent.RETURN_TO_LOBBY, { lobbyParam: "123" }))
        }
      >
        Back to lobby
      </Button>
      <Surface role="game" data={{}} fallback={() => <>Fallback</>} />
    </div>
  );
};
