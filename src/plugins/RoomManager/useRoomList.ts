import { useValue } from "signia-react";
import { availableRoomsAtom } from "./room-manager-plugin";

export const useRoomList = () => {
  const spaces = useValue(availableRoomsAtom);
  return spaces;
};
