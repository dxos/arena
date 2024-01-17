import { TypedObject } from "@dxos/react-client/echo";
import { useIdentity } from "@dxos/react-client/halo";
import { useEffect } from "react";
import { useIntent } from "@dxos/app-framework";
import { InvitationIntent, invitationIntent } from "../invitation-plugin";

export const useJoinInvitation = (invitation: TypedObject | undefined) => {
  const identity = useIdentity();
  const { dispatch } = useIntent();

  useEffect(() => {
    if (!identity || !invitation) return;

    const identityKeyHex = identity.identityKey.toHex();

    if (invitation.creatorId !== identityKeyHex) {
      console.log("We are the second player");

      // We are the second player to join
      invitation.joiningPlayerId = identityKeyHex;
      invitation.finalised = true;

      dispatch(invitationIntent(InvitationIntent.CREATE_GAME, invitation as any));
    }
  }, [invitation, identity]);
};
