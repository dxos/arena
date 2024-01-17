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
import { ChooseSpace } from "./ChooseSpace";

export const Layout = () => {
  const layoutState = useValue(layoutStateAtom);

  const layoutStateToView = (state: typeof layoutState) =>
    match(state)
      .with({ type: "uninitialized" }, () => null)
      .with({ type: "lobby" }, () => <Lobby />)
      .with({ type: "create-invitation" }, () => <Surface role="create-invitation" />)
      .with({ type: "invitation", invitationId: P.select("id") }, ({ id }) => (
        <Surface role="invitation" data={{ id }} />
      ))
      .with({ type: "game" }, ({ gameId, instanceId }) => (
        <Surface role="game" data={{ gameId, instanceId }} />
      ))
      .with({ type: "not-found" }, () => <NotFound />)
      .with({ type: "choose-room" }, () => <ChooseSpace />)
      .exhaustive();

  const FadeView = React.useMemo(
    () => () => <Fade>{layoutStateToView(layoutState)}</Fade>,
    [layoutState]
  );

  return (
    <div className="h-full w-full">
      <GradientBackground />

      <Nav />
      <div className="h-full w-full mt-4 sm:mt-12">
        <AnimatePresence>
          <FadeView />
        </AnimatePresence>
      </div>
    </div>
  );
};
