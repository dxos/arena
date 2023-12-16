import { Expando, useQuery, useSpace } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import React, { useEffect } from "react";
import { Button } from "../UI/Buttons";
import { Invitation } from "./invitation-plugin";

export const InvitationView = ({ id }: { id: string }) => {
  const space = useSpace();
  const [invitation] = useQuery(space, { type: "invitation", invitationId: id });
  const identity = useIdentity();

  useEffect(() => {
    if (!identity || !space) return;
    if (!invitation) {
      const newInvitation: Invitation = {
        invitationId: id,
        creatorId: identity.identityKey.toHex(),
        finalised: false,
        cancelled: false,
      };

      space.db.add(new Expando({ type: "invitation", ...newInvitation }));
    } else {
      console.log("We are", identity.identityKey.toHex());
      console.log("Creator is", invitation.creatorId);
      console.log("Equal?", invitation.creatorId === identity.identityKey.toHex());

      if (invitation.creatorId !== identity.identityKey.toHex()) {
        console.log("We are the second player");
      }
    }
  }, [invitation, identity, space]);

  const handleCancelInvitation = () => {
    if (!space || !invitation) return;
    if (identity.identityKey.toHex() !== invitation.creatorId) return;

    invitation.cancelled = true;
    history.pushState({}, "", "/");
  };

  if (!invitation) return null;

  if (invitation.cancelled)
    return (
      <div className="m-8">
        <div className="p-4 flex flex-col items-center gap-4">
          <p className="text-lg">This invitation has been cancelled by the creator.</p>
        </div>
      </div>
    );

  return (
    <div className="m-8">
      <div className="p-4 flex flex-col items-center gap-4">
        <p className="text-lg">The first person who joins this link will enter the game.</p>
        <code>{window.location.href}</code>
        <Button onClick={handleCancelInvitation} aria-label="Cancel invitation" variant="danger">
          Cancel Invitation
        </Button>
      </div>
    </div>
  );
};
