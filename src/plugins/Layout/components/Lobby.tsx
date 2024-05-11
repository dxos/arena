import { cn } from "$lib/css";
import { useQuery } from "@dxos/react-client/echo";
import { useValue } from "signia-react";
import { Button } from "@dxos/react-ui";
import { Panel } from "../../../UI/Panel";
import { useActiveRoom } from "../../RoomManager/hooks/useActiveRoom";
import { usernamesAtom } from "../../RoomManager/room-manager-plugin";
import { routes } from "../routes";
import { Link } from "./Link";

export const OpenGames = () => {
  const space = useActiveRoom();
  const invitations = useQuery(space, {
    type: "invitation",
    finalised: false,
    cancelled: false,
    isOpenGame: true,
  });

  const usernames = useValue(usernamesAtom);

  const grid = cn("grid grid-cols-[5fr_3fr_4fr_5fr] gap-2");

  return (
    <Panel rimLight>
      <div className="p-2 sm:p-4 max-w-4xl">
        <div className={cn(grid, "p-1 text-xs sm:text-lg")}>
          <div>Player</div>
          <div>Game</div>
          <div>Variant</div>
          <div>Player Ordering</div>
        </div>
        <div className={"flex flex-col"}>
          {invitations.map((invitation) => {
            const creator = usernames[invitation.creatorId];

            return (
              <Link key={invitation.invitationId} to={routes.invitation(invitation.invitationId)}>
                <div
                  className={cn(
                    grid,
                    "w-full",
                    "p-1",
                    "hover:bg-zinc-200 hover:cursor-pointer hover:scale-[101%] transition-transform duration-[80ms] ease-out",
                    "dark:hover:bg-zinc-700",
                    "rounded-md",
                    "text-xs sm:text-sm",
                  )}
                >
                  <div>{creator}</div>
                  <div>{invitation.gameDescription.gameId}</div>
                  <div>{invitation.gameDescription.variantId}</div>
                  <div>{invitation.gameDescription.playerOrdering}</div>
                </div>
              </Link>
            );
          })}
          {invitations.length === 0 && (
            <div className="p-1 mt-2 text-xs sm:text-sm">No open games</div>
          )}
        </div>
      </div>
    </Panel>
  );
};

export const Lobby = () => (
  <div className="mt-4 sm:mt-12">
    <div className="p-2 sm:p-8 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center sm:flex-row gap-2">
        <Link to="/create-invitation?open=true">
          <Button aria-label="Create game" variant="outline">
            Create game
          </Button>
        </Link>
        <Link to={"/create-invitation"}>
          <Button aria-label={"Play with a friend"} variant="outline">
            Play with a friend
          </Button>
        </Link>
        <Link to="/choose-room">
          <Button aria-label="Change room" variant="outline">
            Change room
          </Button>
        </Link>
      </div>
      <div className="mt-2 sm:mt-8 w-full max-w-3xl">
        <h2 className="font-medium text-2xl mb-2">Lobby</h2>
        <OpenGames />
      </div>
    </div>
  </div>
);
