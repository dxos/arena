import { useValue } from "signia-react";
import { availableRoomKeysAtom } from "./room-manager-plugin";

export const useRoomList = () => {
  const spaces = useValue(availableRoomKeysAtom);
  return spaces;
};
