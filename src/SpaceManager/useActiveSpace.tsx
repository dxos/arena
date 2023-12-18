import { useValue } from "signia-react";
import { currentSpaceAtom } from "./space-manager-plugin";
import { useSpace } from "@dxos/react-client/echo";

/** Returns the active space (or the default space if no active space selected) */
export const useActiveSpace = () => {
  const spaceKey = useValue(currentSpaceAtom);
  const space = useSpace(spaceKey);

  return space;
};
