import { useEffect } from "react";
import { useIntent } from "@dxos/app-framework";
import { InvitationIntent, invitationIntent } from "../invitation-plugin";

export function useRedirectToGame(
  finalised: boolean | undefined,
  gameId: string,
  newEntityId: string | undefined
) {
  const { dispatch } = useIntent();
  useEffect(() => {
    if (finalised && newEntityId && gameId) {
      dispatch(invitationIntent(InvitationIntent.OPEN_GAME, { gameId, instanceId: newEntityId }));
    }
  }, [finalised, newEntityId]);
}
