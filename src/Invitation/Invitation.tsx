import { useIntent } from "@dxos/app-framework";
import { useQuery } from "@dxos/react-client/echo";
import { useEffect } from "react";
import { Link } from "../Layout/components/Link";
import { useActiveRoom } from "../RoomManager/useActiveRoom";
import { Button } from "../UI/Buttons";
import { Panel } from "../UI/Panel";
import useClipboard from "../hooks/useClipboard";
import { InvitationIntent, invitationIntent } from "./invitation-plugin";

export const InvitationView = ({ id }: { id: string }) => {
  const space = useActiveRoom();
  const { dispatch } = useIntent();

  const [dbInvitation] = useQuery(space, { type: "invitation", invitationId: id });

  const { isCopied, copy } = useClipboard(window.location.href, { successDuration: 800 });

  useEffect(() => {
    if (!dbInvitation?.invitationId) return;
    dispatch(
      invitationIntent(InvitationIntent.JOIN_INVITATION, {
        invitationId: dbInvitation?.invitationId,
      })
    );
  }, [dispatch, dbInvitation?.invitationId]);

  useEffect(() => {
    if (dbInvitation?.finalised) {
      dispatch(
        invitationIntent(InvitationIntent.OPEN_GAME, {
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

  const handleCancelInvitation = () => {
    if (!space || !dbInvitation) return;
    dispatch(invitationIntent(InvitationIntent.CANCEL_INVITATION, { invitationId: id }));
  };

  if (!dbInvitation) {
    return (
      <div className="max-w-xl mx-auto">
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

  if (dbInvitation.isOpenGame) {
    return (
      <div className="m-8">
        <div className="p-4 flex flex-col items-center gap-4">
          <p className="text-lg">This is an open game.</p>
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
    <div className="m-8">
      <div className="p-4 flex flex-col items-center gap-4">
        <p className="text-md" style={{ fontFamily: "Jetbrains Mono" }}>
          The first person <strong>in your room</strong> who opens this link will enter the game.
        </p>
        <div className="flex flex-row items-center gap-2">
          <code>{window.location.href}</code>
          <Button aria-label="Copy invitation link" onClick={copy}>
            {isCopied ? "Copied ✅" : "Copy 📋"}
          </Button>
        </div>
        <Button onClick={handleCancelInvitation} aria-label="Back to lobby" variant="danger">
          Back to lobby
        </Button>
      </div>
    </div>
  );
};
