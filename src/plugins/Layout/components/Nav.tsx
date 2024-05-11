import { ShieldChevron } from "@phosphor-icons/react";
import { useClient } from "@dxos/react-client";
import { Button } from "@dxos/react-ui";
import { useActiveRoom } from "../../RoomManager/hooks/useActiveRoom";
import { PersonIcon } from "../../../icons";
import { Link } from "./Link";

const Avatar = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button aria-label="Manage user" onClick={onClick} variant="outline" classNames="shadow-md">
      <PersonIcon />
    </Button>
  );
};

export const Nav = () => {
  const client = useClient();
  const space = useActiveRoom();
  if (!space) {
    return null;
  }

  return (
    <nav className="p-4 sm:p-6 flex justify-between items-center bg-neutral-800">
      <div className="flex items-center gap-4">
        <ShieldChevron weight="duotone" className="text-[40px]" />
        <Link to="/">
          <div>
            <h1 className="font-serif font-thin text-2xl sm:text-4xl text-white">DXOS Arena</h1>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button
          aria-label="Invite to room"
          onClick={() => client.shell.shareSpace({ spaceKey: space.key })}
          variant="outline"
          classNames="shadow-md"
        >
          Invite to room
        </Button>
        <Avatar onClick={() => client.shell.open()} />
      </div>
    </nav>
  );
};
