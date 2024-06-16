import { clsx } from "clsx";
import { AnimatePresence } from "framer-motion";
import React, { useMemo } from "react";
import { useValue } from "signia-react";
import { P, match } from "ts-pattern";

import { Surface } from "@dxos/app-framework";

import { Fade } from "$ui/Fade";
import { ChooseRoom } from "../../RoomManager/components/ChooseRoom";
import { layoutStateAtom } from "../layout-plugin";
import { Lobby } from "./Lobby";
import { Nav } from "./Nav";
import { NotFound } from "./NotFound";
import { RoomIndicator } from "./RoomIndicator";

const images = [
  "bg-[url('/images/chess-light-1.png')] dark:bg-[url('/images/chess-dark-1.png')]",
  "bg-[url('/images/chess-light-2.png')] dark:bg-[url('/images/chess-dark-2.png')]",
];

export const Layout = () => {
  const layoutState = useValue(layoutStateAtom);
  const classNames = useMemo(() => images[Math.floor(Math.random() * images.length)], [layoutState]);
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
      .with({ type: "choose-room" }, () => <ChooseRoom />)
      .with({ type: "manage-room" }, () => <Surface role="room-manager" />)
      .exhaustive();

  const FadeView = React.useMemo(
    () => () => <Fade>{layoutStateToView(layoutState)}</Fade>,
    [layoutState],
  );

  return (
    <div className={clsx(
      "absolute inset-0 overflow-hidden flex flex-col items-center",
      "bg-zinc-800 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
    )}>
      <div className="flex flex-col h-full overflow-hidden w-[1000px]">
        <Nav />
        <div className="flex flex-col h-full relative">
          <div className={clsx("absolute inset-0 bg-no-repeat bg-cover opacity-60 dark:opacity-40", classNames)} />
          <div className="flex flex-col h-full relative z-50">
            <RoomIndicator />
            <AnimatePresence>
              <FadeView />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
