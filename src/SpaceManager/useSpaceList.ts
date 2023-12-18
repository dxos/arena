import { useValue } from "signia-react";
import { availableSpacesAtom } from "./space-manager-plugin";

export const useSpaceList = () => {
  const spaces = useValue(availableSpacesAtom);
  return spaces;
};
