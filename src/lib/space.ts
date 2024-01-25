import { Space } from "@dxos/react-client/echo";
import { Invitation, InvitationEncoder } from "@dxos/react-client/invitations";

export const getAuthlessInviteCodeForSpace = (space: Space) => {
  const spaceInvite = space
    ?.share({
      type: Invitation.Type.MULTIUSE,
      authMethod: Invitation.AuthMethod.NONE,
    })
    .get();

  return InvitationEncoder.encode(spaceInvite);
};
