import { useSpace } from "@dxos/react-client/echo";
import { useValue } from "signia-react";
import { activeRoomKeyAtom } from "../room-manager-plugin";
import { PublicKey } from "@dxos/react-client";
import { useMemo } from "react";

/** Returns the active space (or the default space if no active space selected) */
export const useActiveRoom = () => {
  const spaceKey = useValue(activeRoomKeyAtom);
  const publicKey = useMemo(() => (spaceKey ? PublicKey.fromHex(spaceKey) : undefined), [spaceKey]);

  return useSpace(publicKey);
};
