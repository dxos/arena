import React, { Fragment } from "react";
import { Button } from "../../UI/Buttons";
import { Link } from "./Link";
import { Panel } from "../../UI/Panel";
import { useQuery } from "@dxos/react-client/echo";
import { useValue } from "signia-react";
import { usersAtom } from "../../RoomManager/room-manager-plugin";
import { useActiveRoom } from "../../RoomManager/useActiveRoom";

export const OpenGames = () => {
  const space = useActiveRoom();
  const invitations = useQuery(space, { type: "invitation", finalised: false, cancelled: false });

  const users = useValue(usersAtom);

  return (
    <Panel rimLight>
      <div className="p-4 max-w-4xl">
        {/* CSS Grid Table with Tailwind (Game, Username, Variant, Player Ordering, ) */}
        <div className="grid grid-cols-4 gap-2">
          <div className="font-bold">Game</div>
          <div className="font-bold">Username</div>
          <div className="font-bold">Variant</div>
          {/* <div className="font-bold">Player Ordering</div>
          {invitations.map((invitation) => {
            const creator = users.find((u) => u.identityKey.toHex() === invitation.creatorId)
              ?.profile?.displayName;

            return (
              <Fragment key={invitation.id}>
                <div>{invitation.gameDescription.gameId}</div>
              </Fragment>
            );
          })} */}
        </div>
        <code>
          <pre>
            {JSON.stringify(
              invitations.map((x) => ({
                creator: users.find((u) => u.identityKey.toHex() === x.creatorId)?.profile
                  ?.displayName,
                game: x.gameDescription,
              })),
              null,
              2
            )}
          </pre>
        </code>
      </div>
      <Button size="small" aria-label="Refresh">
        Refresh
      </Button>
    </Panel>
  );
};

export const Lobby = () => (
  <div>
    <div className="p-8 flex flex-col items-center gap-4">
      <div className="flex flex-row gap-2">
        <Link to="/create-invitation?open=true">
          <Button size="small" aria-label="Create game">
            Create game
          </Button>
        </Link>
        <Link to={"/create-invitation"}>
          <Button size="small" aria-label={"Play with a friend"}>
            Play with a friend
          </Button>
        </Link>
        <Link to="/choose-room">
          <Button size="small" aria-label="Choose room">
            Choose room
          </Button>
        </Link>
      </div>
      <OpenGames />
    </div>
  </div>
);
