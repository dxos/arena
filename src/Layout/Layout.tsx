import { Surface, useIntent } from "@dxos/app-framework";
import { Button } from "@dxos/react-ui";
import React, { PropsWithChildren } from "react";
import { useValue } from "signia-react";
import { Nav } from "./Nav";
import { LayoutIntent, layoutIntent, layoutStateAtom } from "./layout-plugin";
import { GradientBackground } from "./GradientBackground";
import { ChessGame } from "./ChessGame";

export const Layout = ({ children }: PropsWithChildren) => {
  const layoutState = useValue(layoutStateAtom);

  const intent = useIntent();

  return (
    <div className="h-full w-full">
      <Nav />
      <GradientBackground />
      {children}
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
      <ChessGame />
    </div>
  );
};
