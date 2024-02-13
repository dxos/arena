import { DispatchIntent, useIntent } from "@dxos/app-framework";
import { Space, TypedObject, useQuery } from "@dxos/react-client/echo";
import { useEffect, useMemo } from "react";
import { Link } from "../../Layout/components/Link";
import { useActiveRoom } from "../../RoomManager/hooks/useActiveRoom";
import { Button } from "../../../ui/Buttons";
import { Panel } from "../../../ui/Panel";
import useClipboard from "../../../hooks/useClipboard";
import { getAuthlessInviteCodeForSpace } from "$lib/space";
import { GameIntent, gameIntent } from "../game-plugin";

function useRedirectToGame(dbInvitation: TypedObject | undefined, dispatch: DispatchIntent) {
  useEffect(() => {
    if (dbInvitation?.finalised) {
      dispatch(
        gameIntent(GameIntent.OPEN_GAME, {
          gameId: dbInvitation.gameDescription.gameId,
          instanceId: dbInvitation.instanceId,
        })
      );
    }
  }, [
    dispatch,
    dbInvitation?.finalised,
    dbInvitation?.gameDescription.gameId,
    dbInvitation?.instanceId,
  ]);
}

function useJoinInvitation(
  dbInvitation: TypedObject | undefined,
  space: Space | undefined,
  dispatch: DispatchIntent
) {
  useEffect(() => {
    if (!dbInvitation || !dbInvitation.invitationId || !space) return;

    dispatch(
      gameIntent(GameIntent.JOIN_INVITATION, {
        invitationId: dbInvitation?.invitationId,
      })
    );
  }, [dispatch, dbInvitation, dbInvitation?.invitationId, space]);
}

export const InvitationView = ({ id }: { id: string }) => {
  const space = useActiveRoom();
  const { dispatch } = useIntent();
  const [dbInvitation] = useQuery(space, { type: "invitation", invitationId: id });

  useJoinInvitation(dbInvitation, space, dispatch);
  useRedirectToGame(dbInvitation, dispatch);

  const handleCancelInvitation = () => {
    if (!space || !dbInvitation) return;
    dispatch(gameIntent(GameIntent.CANCEL_INVITATION, { invitationId: id }));
  };

  const inviteQueryString = useMemo(() => {
    if (!dbInvitation || dbInvitation.isOpenGame || !space) return undefined;

    const spaceInvitationCode = getAuthlessInviteCodeForSpace(space);
    if (!spaceInvitationCode) return undefined;

    return new URLSearchParams({ spaceInvitationCode });
  }, [space, dbInvitation]);

  const inviteUrl = useMemo(() => {
    return `${window.location.href}${inviteQueryString ? "?" : ""}${inviteQueryString?.toString()}`;
  }, [inviteQueryString]);

  const { isCopied, copy } = useClipboard(inviteUrl, { successDuration: 800 });

  if (dbInvitation === undefined) {
    return (
      <div className="mt-4 sm:mt-12 max-w-xl mx-auto">
        <Panel rimLight className="p-4 flex flex-col gap-2">
          <h3 className="text-lg" style={{ fontFamily: "EB Garamond" }}>
            We can't find that invitation.
          </h3>
          <Link to="/">
            <Button aria-label="Back to lobby" variant="danger" size="small">
              Back to lobby
            </Button>
          </Link>
        </Panel>
      </div>
    );
  }

  if (dbInvitation.cancelled)
    return (
      <div className="m-8">
        <div className="p-4 flex flex-col items-center gap-4">
          <p className="text-lg">This invitation has been cancelled by the creator.</p>
          <Link to="/">
            <Button aria-label="Back to lobby">Back to lobby</Button>
          </Link>
        </div>
      </div>
    );

  if (dbInvitation?.isOpenGame) {
    return (
      <div className="m-8">
        <div className="p-4 flex flex-col items-center gap-4">
          <p className="text-md" style={{ fontFamily: "Jetbrains Mono" }}>
            Waiting for player.
          </p>
          <p className="text-md" style={{ fontFamily: "Jetbrains Mono" }}>
            Everyone in your room can see this game in the room lobby.
          </p>

          <Link to="/">
            <Button onClick={handleCancelInvitation} aria-label="Back to lobby" variant="danger">
              Back to lobby
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="m-8 mt-4 sm:mt-12">
      <div className="p-4 flex flex-col items-center gap-4">
        <p className="text-md" style={{ fontFamily: "Jetbrains Mono" }}>
          The first person who opens this link will be invited to your room and join the game.
        </p>
        <div className="flex flex-row items-center gap-2 text-xs max-w-sm">
          <Button aria-label="Copy invitation link" onClick={copy}>
            {isCopied ? "Copied ✅" : "Copy invite link 📋"}
          </Button>
        </div>
        <Button onClick={handleCancelInvitation} aria-label="Back to lobby" variant="danger">
          Back to lobby
        </Button>
      </div>
    </div>
  );
};
