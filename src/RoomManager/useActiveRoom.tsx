import { useValue } from "signia-react";
import { activeRoomKeyAtom } from "./room-manager-plugin";
import { useSpace } from "@dxos/react-client/echo";

/** Returns the active space (or the default space if no active space selected) */
export const useActiveRoom = () => {
  const spaceKey = useValue(activeRoomKeyAtom);
  const space = useSpace(spaceKey);

  return space;
};
