import { Surface } from "@dxos/app-framework";
import React from "react";
import { useValue } from "signia-react";
import { GradientBackground } from "./GradientBackground";
import { Nav } from "./Nav";
import { layoutStateAtom } from "./layout-plugin";
import { P, match } from "ts-pattern";
import { Lobby } from "./Lobby";

export const Layout = () => {
  const layoutState = useValue(layoutStateAtom);

  const layoutStateToView = (state: typeof layoutState) => {
    console.log("layout state", state);

    return match(state)
      .with({ type: "uninitialized" }, () => null)
      .with({ type: "lobby" }, () => <Lobby />)
      .with({ type: "invitation", invitationId: P.select("id") }, ({ id }) => (
        <Surface role="invitation" data={{ id }} />
      ))
      .with({ type: "game", gameId: P.select("id") }, ({ id }) => (
        <Surface role="game" data={{ id }} />
      ))
      .exhaustive();
  };

  return (
    <div className="h-full w-full">
      <Nav />
      <GradientBackground />
      {layoutStateToView(layoutState)}
    </div>
  );
};
