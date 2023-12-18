import { Surface } from "@dxos/app-framework";
import React from "react";
import { useValue } from "signia-react";
import { GradientBackground } from "./GradientBackground";
import { Nav } from "./Nav";
import { layoutStateAtom } from "../layout-plugin";
import { P, match } from "ts-pattern";
import { Lobby } from "./Lobby";
import { NotFound } from "./NotFound";
import { Fade } from "../../UI/Fade";
import { AnimatePresence } from "framer-motion";

export const Layout = () => {
  const layoutState = useValue(layoutStateAtom);

  const layoutStateToView = (state: typeof layoutState) =>
    match(state)
      .with({ type: "uninitialized" }, () => null)
      .with({ type: "lobby" }, () => <Lobby />)
      .with({ type: "invitation", invitationId: P.select("id") }, ({ id }) => (
        <Surface role="invitation" data={{ id }} />
      ))
      .with({ type: "game", gameId: P.select("id") }, ({ id }) => (
        <Surface role="game" data={{ id }} />
      ))
      .with({ type: "not-found" }, () => <NotFound />)
      .exhaustive();

  const FadeView = () => <Fade>{layoutStateToView(layoutState)}</Fade>;

  return (
    <div className="h-full w-full">
      <GradientBackground />
      <Nav />
      <AnimatePresence>
        <FadeView />
      </AnimatePresence>
    </div>
  );
};
