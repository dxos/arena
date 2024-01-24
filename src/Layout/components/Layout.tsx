import { Surface } from "@dxos/app-framework";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useValue } from "signia-react";
import { P, match } from "ts-pattern";
import { Fade } from "../../UI/Fade";
import { layoutStateAtom } from "../layout-plugin";
import { ChooseSpace } from "./ChooseSpace";
import { GradientBackground } from "./GradientBackground";
import { Lobby } from "./Lobby";
import { Nav } from "./Nav";
import { NotFound } from "./NotFound";

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
      <div className="h-full w-full">
        <AnimatePresence>
          <FadeView />
        </AnimatePresence>
      </div>
    </div>
  );
};
