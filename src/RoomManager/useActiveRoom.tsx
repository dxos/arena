import { useSpace } from "@dxos/react-client/echo";
import { useValue } from "signia-react";
import { activeRoomKeyAtom } from "./room-manager-plugin";

/** Returns the active space (or the default space if no active space selected) */
export const useActiveRoom = () => {
  const spaceKey = useValue(activeRoomKeyAtom);
  const space = useSpace(spaceKey);

  return space;
};
